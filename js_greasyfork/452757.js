// ==UserScript==
// @name         Geoguessr Custom Emotes
// @description  Allows you to use many custom emotes and some commands in the Geoguessr chat
// @version      2.2.3
// @author       victheturtle#5159
// @license      MIT
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151668
// @match        https://www.geoguessr.com/*
// @icon         https://www.geoguessr.com/_next/static/images/emote-gg-cf17a1f5d51d0ed53f01c65e941beb6d.png
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @downloadURL https://update.greasyfork.org/scripts/452757/Geoguessr%20Custom%20Emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/452757/Geoguessr%20Custom%20Emotes.meta.js
// ==/UserScript==


// REPLACE WITH THE TAGS OF YOUR 6 FAVOURITE EMOTES
// LIST OF AVAILABLE EMOTE TAGS AT https://gist.github.com/GreenEyedBear/7e5046589b0f020c1ec80629c582cca6
const FAVOURITES = [
    "tf",
    "FatChamp",
    ":gg:",
    "FeelsBadMan",
    ":goat:",
    ":wave:",
]

/* Geoguessr defaults:
const FAVOURITES = [
    ":confused:",
    ":cry:",
    ":gg:",
    ":happy:",
    ":mindblown:",
    ":wave:",
]
*/


let geoguessrCustomEmotes = {};

const customEmotesInjectedClass = "custom-emotes-injected";
const getAllNewMessages = () => document.querySelectorAll(`div[class*="chat-message_messageContent__"]:not([class*="${customEmotesInjectedClass}"])`);

let favouritesInjected = false;
const getEmoteSelectorBox = () => document.querySelector(`div[class*="chat-input_optionSelector__"]`);

let accessToken = "";
const originalSend = WebSocket.prototype.send;
let messageSocket = null;
WebSocket.prototype.send = function(...args) {
    try {
    const sent = JSON.parse(...args);
    if (sent.code == "Subscribe" && sent.topic.startsWith("chat:InGame:TextMessages:")) {
        accessToken = sent.accessToken;
        messageSocket = this;
    }
    } catch(e) {}
    return originalSend.call(this, ...args);
};

function sendFavouriteEmote(txt) {
    if (messageSocket == null) return;
    messageSocket.send(JSON.stringify(
        {code: 'ChatMessage', topic: 'chat:InGame:TextMessages:'+getGameId(), payload: txt, accessToken: accessToken}
    ));
}

const GGemotes = {
    ":confused:": "https://www.geoguessr.com/_next/static/images/emote-confused-e0cf85ababd0222d0a5afdd1e197643b.png",
    ":cry:": "https://www.geoguessr.com/_next/static/images/emote-cry-d6a31832e6fbb210bbc7f51a5a566b43.png",
    ":gg:": "https://www.geoguessr.com/_next/static/images/emote-gg-cf17a1f5d51d0ed53f01c65e941beb6d.png",
    ":happy:": "https://www.geoguessr.com/_next/static/images/emote-happy-072e991610e1235c10a134dac75b128c.png",
    ":mindblown:": "https://www.geoguessr.com/_next/static/images/emote-mindblown-d1f80fc9fd1cb031bbfb3de1240e03e5.png",
    ":wave:": "https://www.geoguessr.com/_next/static/images/emote-wave-da1dd3859051c109583d2f3cda5824f8.png",
}

function addFavouriteEmotes(emoteSelectorBox) {
    emoteSelectorBox.innerHTML = "";
    let chatInput = document.querySelector(`input[class*="chat-input_textInput__"]`);
    Element.prototype.addTrustedEventListener = function () {
        let args = [...arguments]
        return this.addEventListener(...args);
    }
    chatInput.addTrustedEventListener('input',function(e) {
        if (!e.isTrusted) {
            this.value += e.data;
            this.defaultValue = this.value;
        }
    }, false);
    for (let i=0; i<6; i++) {
        const button = document.createElement("button");
        button.innerHTML = `<img src="${GGemotes[FAVOURITES[i]] || geoguessrCustomEmotes[FAVOURITES[i]]}"><span>${FAVOURITES[i]}</span>`;
        button.onclick = () => sendFavouriteEmote(FAVOURITES[i]);
        emoteSelectorBox.appendChild(button);
    };
};

const emoteInjectionTemplate = (emoteSrc) => `</span>
<span class="${cn("chat-message_emoteWrapper__")}"><img src="${emoteSrc}" class="${cn("chat-message_messageEmote__")}"></span>
<span class="${cn("chat-message_messageText__")}">`;

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

const getGameId = () => ((location.pathname.split("/")[2].length > 20) ? location.pathname.split("/")[2] : location.pathname.split("/")[3]);
const getPartyId = async () => await fetchWithCors(getLobbyApi(getGameId()), "POST", {})
                              .then(it => it.json()).then(it => it.partyId);
const getPlayerId = async (nick) => await fetchWithCors(getLobbyApi(getGameId()), "POST", {})
                              .then(it => it.json()).then(it => {
                                  let matches = it.players.filter(it => it.nick.toLowerCase() == nick.toLowerCase()).map(it => it.playerId).sort();
                                  return matches[matches.length-1];
                              });
const getLobbyApi = (gameId) => `https://game-server.geoguessr.com/api/lobby/${gameId}/join`;
const getKickApi = (gameId) => `https://game-server.geoguessr.com/api/lobby/${gameId}/kick`;
const getBanApi = (partyId) => `https://www.geoguessr.com/api/v4/parties/${partyId}/ban`;
const getRoundNumberApi = (gameId) => `https://game-server.geoguessr.com/api/duels/${gameId}/`;
const getRoundNumber = async () => await fetchWithCors(getRoundNumberApi(getGameId()), "GET")
                              .then(it => it.json()).then(it => it.currentRoundNumber);
const getGuessApi = (gameId) => `https://game-server.geoguessr.com/api/duels/${gameId}/guess`;

async function ban(nick) {
    const playerId = await getPlayerId(nick);
    const partyId = await getPartyId();
    fetchWithCors(getKickApi(getGameId()), "POST", {playerId: playerId}).catch(e => console.log(e));
    fetchWithCors(getBanApi(partyId), "POST", {userId: playerId, ban: true}).catch(e => console.log(e));
};

async function unban(nick) {
    const playerId = await getPlayerId(nick);
    const partyId = await getPartyId();
    fetchWithCors(getBanApi(partyId), "POST", {userId: playerId, ban: false}).catch(e => console.log(e));
};

async function openProfile(nick) {
    const playerId = await getPlayerId(nick);
    window.open("/user/"+playerId);
};

async function guessEiffelTower() {
    const rn = await getRoundNumber();
    fetchWithCors(getGuessApi(getGameId()), "POST", {"lat": 48.85837, "lng": 2.29448, "roundNumber": rn}).catch(e => console.log(e));
};

function handleCommand(type, args, isSelf) {
    try {
        console.log(type)
        console.log(args)
        if (type == "/ban") {
            if (args.length != 0 && isSelf) ban(args);
        } else if (type == "/unban") {
            if (args.length != 0 && isSelf) unban(args);
        } else if (type == "/mute") {
            if (args.length != 0 && isSelf) localStorage.setItem("CustomEmotesMuted"+args.toLowerCase(), "1");
        } else if (type == "/unmute") {
            if (args.length != 0 && isSelf) localStorage.setItem("CustomEmotesMuted"+args.toLowerCase(), "0");
        } else if (type == "/check") {
            if (args.length != 0 && isSelf) openProfile(args);
        } else if (type == "/eiffel") {
            if (location.pathname.includes("duel") && isSelf) guessEiffelTower();
        }
    } catch (e) { console.log(e); };
};

function injectCustomEmotes(words) {
    for (let i=0; i<words.length; i+=2) {
        if (words[i] == "") continue;
        const lowercaseWord = words[i].toLowerCase();
        for (let emoteName in geoguessrCustomEmotes) {
            if (lowercaseWord == emoteName.toLowerCase() || lowercaseWord[0] == ":" && lowercaseWord == ":"+emoteName.toLowerCase()+":") {
                words[i] = emoteInjectionTemplate(geoguessrCustomEmotes[emoteName]);
                break;
            }
        }
    }
    return words.join("");
}

function deleteEmptyTextTags() {
    for (let emptyTextTags of document.getElementsByClassName(cn("chat-message_messageText__"))) {
        if (emptyTextTags.innerHTML == "") emptyTextTags.remove();
    }
}

let observer = new MutationObserver((mutations) => {
    const emoteSelectorBox = getEmoteSelectorBox();
    if (emoteSelectorBox == null) {
        favouritesInjected = false;
    } else if (!favouritesInjected && Object.keys(geoguessrCustomEmotes).length !== 0) {
        favouritesInjected = true;
        addFavouriteEmotes(emoteSelectorBox);
    };
    deleteEmptyTextTags();
    const newMessages = getAllNewMessages();
    if (newMessages.length == 0) return;
    for (let message of newMessages) {
        if (message.classList.contains(customEmotesInjectedClass)) continue;
        message.classList.add(customEmotesInjectedClass);
        const words = message.innerHTML.split(/((?:<|>|&lt;|&gt;|,| |\.)+)/g);
        const author = message.innerHTML.split(/(?:<|>)+/)[2];
        const messageContentStart = words.indexOf("><");
        const isSelf = message.parentNode.className.includes("isSelf");
        if (!isSelf && localStorage.getItem("CustomEmotesMuted"+author.toLowerCase()) == "1") {
            requireClassName('chat-message_messageText__').then(textStyle => {
                message.innerHTML = words.slice(0, messageContentStart+1).join("") + `span class="${textStyle}" style="color:silver">[Muted]</span` + words.slice(words.length-3).join("");
            });
        } else {
            if (words.length >= messageContentStart+10 && words[messageContentStart+5][0] == "/") {
                handleCommand(words[messageContentStart+5], words.slice(messageContentStart+7, words.length-4).join(""), isSelf)
            }
            scanStyles().then(() => {
                message.innerHTML = injectCustomEmotes(words);
            });
        }
    };
    deleteEmptyTextTags();
});

async function fetchEmotesRepository() {
    const lastTimeFetched = localStorage.getItem("CustomEmotesLastFetched")*1
    if (Date.now() - lastTimeFetched < 60*1000) { // Github API has a limit rate of 60 requests per hour so prevent more than 1 request per minute
        return localStorage.getItem("CustomEmotesStored")
    } else {
        const emotesRepositoryContent = await fetch("https://api.github.com/gists/7e5046589b0f020c1ec80629c582cca6")
        .then(it => it.json())
        .then(it => it.files["GeoguessrCustomEmotesRepository.json"].content);
        localStorage.setItem("CustomEmotesStored", emotesRepositoryContent);
        localStorage.setItem("CustomEmotesLastFetched", Date.now());
        return emotesRepositoryContent;
    }
}

(() => {
    fetchEmotesRepository().then(emotesRepositoryContent => {
        geoguessrCustomEmotes = JSON.parse(emotesRepositoryContent);
        observer.observe(document.body, { subtree: true, childList: true });
    }).catch(err => console.log(`Geoguessr Custom Emotes error at fetchEmotesRepository(): ${err}`));
})();
