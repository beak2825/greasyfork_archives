// ==UserScript==
// @name         Geoguessr Location Retriever with Alert
// @match        https://www.geoguessr.com/*
// @description  Get the actual location Geoguessr gave you from the result screens. Works for games and streaks, solo and challenge.
// @version      2.2.2
// @author       victheturtle#5159 modified by paulantier
// @grant        none
// @license      MIT
// @icon         https://www.svgrepo.com/show/12218/find.svg
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @downloadURL https://update.greasyfork.org/scripts/489902/Geoguessr%20Location%20Retriever%20with%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/489902/Geoguessr%20Location%20Retriever%20with%20Alert.meta.js
// ==/UserScript==


let lastChecked = 0;
let checkedResults = false;

function getPins() {
    return document.querySelectorAll("[class*='map-pin_clickable']");
};

function panoIdDecoder(geoguessrPanoId) {
    let gsvPanoId = "";
    for (let i = 0; i < geoguessrPanoId.length; i+=2) {
        let seq = geoguessrPanoId.substring(i, i+2);
        gsvPanoId += String.fromCharCode(parseInt(seq, 16));
    }
    return gsvPanoId;
}

function linkOfLocation(round) {
    if (round.panoId == null) return null;
    let lat = round.lat;
    let lng = round.lng;
    let pid = panoIdDecoder(round.panoId);
    let rh = round.heading;
    let rp = round.pitch;
    let rz = round.zoom;
    let h = Math.round(round.heading * 100) / 100;
    let p = Math.round((90 + round.pitch) * 100) / 100;
    let z = Math.round((90 - round.zoom/2.75*90) * 10) / 10;
    const extra = `"countryCode":null,"stateCode":null,"extra":{"tags":[]}`;
    let link = `https://www.google.com/maps/@${lat},${lng},3a,${z}y,${h}h${(p==90)?"":","+p+"t"}/data=!3m6!1e1!3m4!1s${pid}!2e0!7i13312!8i6656`;
    let loc_json = `{"lat":${lat},"lng":${lng},"heading":${rh},"pitch":${rp},"panoId":"${pid}","zoom":${rz},${extra}}`;
    console.log(link);
    

    // Créer un lien de téléchargement pour le fichier texte
    const currentDate = new Date().toISOString().replace(/:/g, "-");
    const fileName = `${currentDate}.txt`;
    const fileContent = `${lat},${lng}\n${loc_json}`;
    const fileBlob = new Blob([fileContent], { type: 'text/plain' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(fileBlob);
    downloadLink.download = fileName;
    downloadLink.click();

    //alert(`Latitude: ${lat}, Longitude: ${lng}`); // Afficher l'alerte avec la latitude et la longitude
    return link;
}



function addFlagOnclicks(rounds) {
    let pin = getPins();
    for (let i = 0; i < pin.length; i++) {
        let link = linkOfLocation(rounds[(pin.length>1) ? pin[i].innerText-1 : rounds.length-1-i], pin.length==1);
        if (link != null) pin[i].onclick = function () {window.open(link, '_blank');};
    }
};

function addStreakChallengeOnclicks(rounds) {
    setTimeout(() => {
        let playersTable = document.querySelectorAll("div[class*='results_highscoreHeader__']")[0].parentElement.children[1];
        let roundsTable = document.querySelectorAll("div[class*='results_highscoreHeader__']")[1].parentElement;
        for (let i = 0; i < playersTable.children.length; i += 2) {
            playersTable.children[i].onclick = function () {addStreakChallengeOnclicks(rounds);};
        }
        for (let i = 1; i < roundsTable.children.length; i++) {
            let link = linkOfLocation(rounds[i-1], false);
            console.log(link);
            if (link != null) roundsTable.children[i].onclick = function () {window.open(link, '_blank');};
            roundsTable.children[i].style="cursor: pointer;";
        }
    }, 200);
}

function check() {
    const game_tag = location.pathname.substr(location.pathname.lastIndexOf("/")+1);
    let api_url = location.origin + "/api/v3/games/" + game_tag;
    if (location.pathname.includes("/challenge") || !!document.querySelector("div[class*='switch_switch__']")) {
        api_url = location.origin + "/api/v3/challenges/" + game_tag + "/game";
    };
    fetch(api_url)
    .then(res => res.json())
    .then(out => {
        addFlagOnclicks(out.rounds.slice(0, out.player.guesses.length));
        if (out.type == "challenge" && out.mode == "streak") {
            let api_url2 = location.origin + "/api/v3/results/highscores/"+game_tag+"?friends=false&limit=1";
            fetch(api_url2)
            .then(res => res.json())
            .then(out => addStreakChallengeOnclicks(out[0].game.rounds))
            .catch(err => { throw err });
        };
    }).catch(err => { throw err });

};

function doCheck() {
    let pinCount = getPins().length;
    if (pinCount == 0) {
        lastChecked = 0;
        checkedResults = false;
    } else if (pinCount != lastChecked || location.pathname.includes("/results") && !checkedResults && document.readyState == "complete") {
        lastChecked = pinCount;
        checkedResults = location.pathname.includes("/results");
        check();
    }
};

function checkGameMode() {
    return location.pathname.includes("/results") || location.pathname.includes("/game") || location.pathname.includes("/challenge")
}


let lastDoCheckCall = 0;
new MutationObserver(async (mutations) => {
    if (!checkGameMode() || lastDoCheckCall >= (Date.now() - 50)) return;
    lastDoCheckCall = Date.now();
    doCheck();
}).observe(document.body, { subtree: true, childList: true });
