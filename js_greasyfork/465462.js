// ==UserScript==
// @name         Geoguessr Team Duels spec mode
// @description  Lets you see pins and guesses from the other team while a round is still running
// @version      1.0.7
// @author       victheturtle#5159
// @license      MIT
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151668
// @match        https://www.geoguessr.com/*
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @icon         https://cdn.discordapp.com/icons/975845742629490708/5e06cb2509eec4d731c078ee20bd72d1.webp?size=128
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465462/Geoguessr%20Team%20Duels%20spec%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/465462/Geoguessr%20Team%20Duels%20spec%20mode.meta.js
// ==/UserScript==
 
 
////////////////////////////////////////////////////////////
//////////  !!!   DO NOT SHARE THIS SCRIPT   !!!  //////////
////////// as it can easily be used for cheating. //////////
////////////////////////////////////////////////////////////
 
/// SCRIPT ACTIVATION
 
const keyToActivate = "s";
 
let active = localStorage.getItem("SpecModeActive") == "1";
 
/// INPUTS
 
function addActivationFeedbackCard() {
    if (location.pathname.split("/")[1] != "team-duels" && location.pathname.split("/")[1] != "party") return false;
    if (document.getElementById("spec-mode-feedback") != null) return true;
    const container = document.createElement("div");
    container.style = "text-align: center; position: fixed; left: 0px; top: 36px; width: 100%; z-index: 1;"
    container.innerHTML = `<div id="spec-mode-feedback-container" style="display: inline-block; border-radius: 10px; transform: skew(-7.5deg,0deg);
    background: linear-gradient(0deg,rgba(161,155,217,0) 50%,rgba(161,155,217,.6)),#563b9a; padding: 4px; transition: opacity 0.4s ease 0s;">
    <div style="background: #000000; border-radius: 6px; padding: 1px">
    <div id="spec-mode-feedback" style="color: rgb(255, 255, 255); border-radius: 5px; padding: 4px 10px;
    font-size: var(--font-size-16); font-weight: 700; line-height: var(--line-height-16); text-shadow: 0 0.125rem 0.125rem var(--ds-color-black-20);">
    </div></div></div>`;
    __next.appendChild(container);
    return true;
}
 
let timeoutTask = null;
function setActivationFeedbackText() {
    if (!addActivationFeedbackCard()) return;
    const card = document.getElementById("spec-mode-feedback");
    card.innerHTML = "Spec mode: " + ((active) ? "ON" : "OFF")
    card.style.backgroundColor = (active) ? "#81D03C" : "#CC2F30";
    const container = document.getElementById("spec-mode-feedback-container");
    container.style.opacity = "100%";
    container.style.marginRight = `${document.querySelector("div[class*='tabs_content__']")?.clientWidth || 0}px`;
    if (timeoutTask != null) clearTimeout(timeoutTask);
    timeoutTask = setTimeout(() => {container.style.opacity = "0%";}, 2000);
}
 
let lastTimeSwitched = Date.now()
const switchMarkersOnOff = () => {
    if (Date.now() - lastTimeSwitched < 200) return;
    lastTimeSwitched = Date.now()
    active = !active;
    localStorage.setItem("SpecModeActive", 1 - localStorage.getItem("SpecModeActive"));
    setActivationFeedbackText();
    if (active) {
        sendMessage(" .", "green");
        getPlayersData().then(() => { scanStyles().then(() => {
            editPins();
        }) });
    } else {
        sendMessage(" ,", "green");
        for (let playerId in markers) {
            markers[playerId].remove()
            delete markers[playerId];
        }
        markers = {};
    }
}
 
document.addEventListener("load", setActivationFeedbackText())
document.addEventListener("keypress", (e) => { if (document.activeElement.tagName != "INPUT" && e.key == keyToActivate) { switchMarkersOnOff(); }; });
 
/// FETCH PLAYERS DATA
 
async function fetchWithCors(url, method, body) {
    return await fetch(url, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.8",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            "x-client": "web"
        },
        "referrer": "https://www.geoguessr.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": (method == "GET") ? null : JSON.stringify(body),
        "method": method,
        "mode": "cors",
        "credentials": "include"
    });
};
 
window.fetchWithCors = fetchWithCors
 
const checkUrl = () => location.pathname.split("/").length == 3 && location.pathname.split("/")[1] == "team-duels";
const getGameId = () => location.pathname.split("/")[2];
 
let lastCheckedLobby = "";
let pfps = {};
let nicks = {};
let teams = {};
async function getPlayersData() {
    if (!checkUrl()) return;
    const lobbyId = getGameId();
    if (lobbyId == lastCheckedLobby) return;
    await fetchWithCors(`https://game-server.geoguessr.com/api/lobby/${lobbyId}/join`, "POST", {})
    .then(res => res.json())
    .then(json => {
        if (json.status != "Closed") return; // lobby still open to join
        lastCheckedLobby = lobbyId;
        for (let player of json.players) {
            pfps[player.playerId] = player.avatarPath;
            nicks[player.playerId] = player.nick;
            teams[player.playerId] = player.team;
        }
    }).catch(err => console.log(err));
}
 
/// MONKEY PATCH WEBSOCKET

const getPins = (players) => Object.fromEntries(players.map(player => [player.playerId, player.pin]).filter(it => it[1] != null));
const getGuesses = (players, roundNb) => Object.fromEntries(players.filter(player => player.guesses.length > 0)
                                                .map(player => [player.playerId, player.guesses[player.guesses.length-1]])
                                                .filter(it => it[1].roundNumber == roundNb)
                                                .map(it => {return [it[0], {"lat": it[1].lat, "lng": it[1].lng}]}));
const isAlcatraz = (guess) => Math.abs(guess.lat - 37.8269506) < 0.01 && Math.abs(guess.lng + 122.4234864) < 0.01;
 
let accessToken = "";
let lobbyId = ""
let selfPlayerId = "";
let redPins = {};
let bluePins = {};
let redGuesses = {};
let blueGuesses = {};
 
const originalSend = WebSocket.prototype.send;
let messageSocket = null;
let oppositeChatSubscription = null;
WebSocket.prototype.send = function(...args) {
    const sent = JSON.parse(...args);
    if (sent.code != "HeartBeat" && sent.code != "Unsubscribe") {
        if (sent.code == "Subscribe") {
            if (sent.topic.startsWith("chat:InGame:TextMessages:")) {
                accessToken = sent.accessToken;
                messageSocket = this;
                if (oppositeChatSubscription == null && (sent.topic.includes(":blue") || sent.topic.includes(":red"))) {
                    oppositeChatSubscription = JSON.parse(JSON.stringify(sent));
                    if (sent.topic.includes(":blue")) {
                        oppositeChatSubscription.topic = sent.topic.substr(0, sent.topic.length-4) + "red";
                    } else {
                        oppositeChatSubscription.topic = sent.topic.substr(0, sent.topic.length-3) + "blue";
                    }
                    this.send(JSON.stringify(oppositeChatSubscription));
                    sendMessage((active) ? " -" : "", "green");
                }
            }
        } else if (sent.code == "SubscribeToLobby") {
            lobbyId = sent.gameId;
            selfPlayerId = sent.playerId;
        } else if (sent.code == "ChatMessage" || sent.code == "ChatEmote") {
            accessToken = sent.accessToken;
            messageSocket = this;
        } else {
            //console.log(sent);
        }
    }
 
    if (this.geoguessrTeamDuelSpecMode == 0) return originalSend.call(this, ...args);
    this.geoguessrTeamDuelSpecMode = 0
    const originalOnmessage = this.onmessage;
    this.onmessage = ({ data }) => {
        if (originalOnmessage != null) originalOnmessage({ data });
        const received = JSON.parse(data);
        // console.log(received);
        if (received.code == 'ChatMessage') {
            let payload = JSON.parse(received.payload);
            let source = payload.sourceId;
            let msg = payload.textPayload;
            if (msg == "" || msg[0] == " ") return;
            let team = (received.topic.endsWith(":red")) ? "Red" : ((received.topic.endsWith(":blue")) ? "Blue" : "Common");
            getPlayersData().then(() => {
                console.log(`[${team} chat] ${nicks[source] || source}: ${msg}`);
            });
        } else if (received.code == 'DuelPinPlaced' || received.code == 'DuelPlayerGuessed') {
            // console.log(`${received.code}: ${received.playerId}`);
            let roundNb = received.duel.state.currentRoundNumber
            let redPlayers = received.duel.state.teams[0].players
            let bluePlayers = received.duel.state.teams[1].players
            let newRedGuesses = getGuesses(redPlayers, roundNb)
            let newBlueGuesses = getGuesses(bluePlayers, roundNb)
            for (let key in newRedGuesses) {
                redGuesses[key] = (isAlcatraz(newRedGuesses[key])) ? redPins[key] : newRedGuesses[key];
            }
            for (let key in newBlueGuesses) {
                blueGuesses[key] = (isAlcatraz(newBlueGuesses[key])) ? bluePins[key] : newBlueGuesses[key];
            }
            redPins = getPins(redPlayers)
            bluePins = getPins(bluePlayers)
            if (active) {
                getPlayersData().then(() => { scanStyles().then(() => {
                    editPins();
                }) });
            }
        } else if (received.code == 'DuelPing') {
            //received.duel.playerId
            //received.duel.location.lat
        }
    };
    return originalSend.call(this, ...args);
};
 
function sendMessage(msg, team) { // team can be "blue" or "red" for sending to that team. Or anything else, that will send to everyone
    if (messageSocket == null) return;
    let suffix = (team == "red" || team == "blue" || team == "green") ? ":"+team : "";
    messageSocket.send(JSON.stringify(
        {code: 'ChatMessage', topic: 'chat:InGame:TextMessages:'+lobbyId+suffix, payload: msg, accessToken: accessToken}
    ))
}
 
window.sendMessage = sendMessage;
 
/// GRAB MAP OBJECT
 
const googleMapsPromise = new Promise(resolve => {
  let scriptObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.tagName === "SCRIPT" && node.src.startsWith("https://maps.googleapis.com/maps/api/js?")) {
          node.addEventListener('load', () => resolve());
          if (scriptObserver) scriptObserver.disconnect();
          scriptObserver = undefined;
        }
      }
    }
  });
  new MutationObserver((_, observer) => {
    if (document.head && scriptObserver) {
      scriptObserver.observe(document.head, { childList: true });
      observer.disconnect();
    };
  }).observe(document.documentElement, { childList: true, subtree: true });
});
 
window.mapObject = null;
googleMapsPromise.then(() => {
    const oldMap = google.maps.Map;
    google.maps.Map = Object.assign(function (...args) {
        const res = oldMap.apply(this, args);
        window.mapObject = this;
        return res;
    }, {
        prototype: Object.create(oldMap.prototype)
    });
 
    google.maps.event.addDomListener(document, 'keyup', function (e) {
        if (e.key == keyToActivate) switchMarkersOnOff();
    });
 
    class GeoguessrPinMarker extends google.maps.OverlayView {
        constructor(args) {
            super();
            this.latlng = args.latlng;
            this.html = args.html;
            this.setMap(args.map);
        }
 
        createDiv() {
            this.div = document.createElement('div');
            this.div.style.position = 'absolute';
            if (this.html) {
                this.div.innerHTML = this.html;
            }
        }
 
        appendDivToOverlay() {
            const panes = this.getPanes();
            panes.overlayImage.appendChild(this.div);
        }
 
        positionDiv() {
            const point = this.getProjection().fromLatLngToDivPixel(this.latlng);
            if (point) {
                this.div.style.left = `${point.x}px`;
                this.div.style.top = `${point.y}px`;
            }
        }
 
        draw() {
            if (!this.div) {
                this.createDiv();
                this.appendDivToOverlay();
            }
            this.positionDiv();
        }
        remove() {
            if (this.div) {
                this.div.parentNode.removeChild(this.div);
                this.div = null;
            }
            this.setMap(null);
        }
        getPosition() {
            return this.latlng;
        }
 
        getDraggable() {
            return false;
        }
    };
    window.GeoguessrPinMarker = GeoguessrPinMarker;
});
 
/// ADD PINS
 
let markers = {};
let failCount = 0
const t0 = Date.now()
function addPin(pinCoords, guessed, playerId) {
    if (pinCoords == null) return;
    if (window.GeoguessrPinMarker == null) {
        if (Date.now() - t0 > 1000) {
            failCount++;
            if (failCount == 3) {
                window.alert(`**SPEC MODE**
                              The script doesn't seem to be working...
                              The most common reason for that is that Extenssr is running.
                              If this is the case, please disable Extenssr to be able to use Spec Mode`);
            }
        }
        return;
    }
    let colorClass = (teams[playerId] == "red") ? cn("styles_borderColorRed__") : cn("styles_borderColorBlue__");
    let guessClass = (guessed) ? `${cn("map-pin_mapPin__")} ${cn("game-map_otherTeamMemberGuessPin__")}` : `${cn("map-pin_mapPin__")} ${cn("game-map_otherTeamMemberGuessPin__")} ${cn("game-map_ghostMarker__")}`;
    let innerHTML = `
        <div class="${guessClass}" id="pin-${playerId}">
            <div class="${cn("styles_circle__")} ${cn("styles_variantRaised__")} ${cn("styles_colorWhite__")} ${colorClass} ${cn("styles_borderSizeFactorTwo__")}">
                <div class="${cn("styles_rectangle__")}" style="padding-top: 100%;">
                    <div class="${cn("styles_innerCircle__")}">
                        <div class="${cn("styles_content__")}">
                            <img src="/images/auto/48/48/ce/0/plain/${pfps[playerId]}" class="${cn("styles_image__")}" alt="${nicks[playerId]}" loading="auto" style="object-fit: cover;">
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
 
    if (markers[playerId] != null && markers[playerId].div != null) {
        markers[playerId].div.innerHTML = innerHTML;
        markers[playerId].latlng = pinCoords;
        markers[playerId].draw();
    } else {
        if (markers[playerId] != null) {
            markers[playerId].remove();
            delete markers[playerId];
        }
        let pin = new window.GeoguessrPinMarker({latlng: pinCoords, map: window.mapObject, html: innerHTML});
        markers[playerId] = pin;
    }
}
 
function editPins() {
    if (!checkUrl() || document.querySelector("[class*=overlay_backdrop__], [class*=overlay_overlay__], [class*=game-summary_container__]")) return;
    if (teams[selfPlayerId] == "red") {
        for (let playerId in bluePins) {
            addPin(bluePins[playerId], false, playerId)
        }
        for (let playerId in blueGuesses) {
            addPin(blueGuesses[playerId], true, playerId)
        }
    } else if (teams[selfPlayerId] == "blue") {
        for (let playerId in redPins) {
            addPin(redPins[playerId], false, playerId)
        }
        for (let playerId in redGuesses) {
            addPin(redGuesses[playerId], true, playerId)
        }
    }
}
 
function deleteFakePins() {
    for (let playerId in markers) {
        markers[playerId].remove()
        delete markers[playerId];
    }
    redPins = {};
    bluePins = {};
    redGuesses = {};
    blueGuesses = {};
    markers = {}
}
 
/// MUTATIONS
 
function handleMutations() {
    if (!checkUrl() || document.querySelector("[class*=overlay_backdrop__], [class*=overlay_overlay__], [class*=game-summary_container__]")) {
        deleteFakePins();
        return;
    }
}
 
new MutationObserver((mutations) => handleMutations()).observe(document.body, { subtree: true, childList: true});