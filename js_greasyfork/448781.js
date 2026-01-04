// ==UserScript==
// @name        Geoguessr Disunity Script
// @namespace   https://github.com/handfit
// @version     1.0.4
// @description Geoguessr cheat/hack. Press SHIFT + ALT + G and the location of your current geoguessr game will open in a new window.
// @author      Pantera
// @homepage    https://github.com/handfit
// @match       https://www.geoguessr.com/*
// @grant       none
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/448781/Geoguessr%20Disunity%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/448781/Geoguessr%20Disunity%20Script.meta.js
// ==/UserScript==

function getGameMode(url,fetch){
    if(fetch == 0) {
        return url.split(".com/")[1].split("/")[0].toUpperCase();
    }
    else {
        return url.split("api/")[1].split("/")[0].toUpperCase();
    }
}

function getApiUrl(url){
    url = url.replace("www.", "");
    switch (getGameMode(url,0)) {
        case "DUELS":
        case "TEAM-DUELS":
        case "LIVE-CHALLENGE":
        case "BULLSEYE":
        case "BATTLE-ROYALE": {
            return url.replace("geoguessr.com", "game-server.geoguessr.com/api").replace("team-duels", "duels");
        }
        case "QUIZ": {
            return url.replace("geoguessr.com/quiz/play", "game-server.geoguessr.com/api/live-challenge");
        }
        case "COMPETITIVE-STREAK": {
            return url.replace("geoguessr.com/competitive-streak", "game-server.geoguessr.com/api/competitive-streaks");
        }
        case "GAME": {
            return url.replace("geoguessr.com/game", "geoguessr.com/api/v3/games").replace("geoguessr.com/challenge", "geoguessr.com/api/v3/games");
        }
        case "CHALLENGE": {
            let gt = __NEXT_DATA__.props.pageProps.game.token;
            return `https://www.geoguessr.com/api/v3/games/${gt}?client=web`;
        }
  }
}

function makeApiCall(url){
    fetch(url,{credentials: 'include'}).then(x=>x.json()).then(x=>{
        let rounds = x.rounds;
        let cur = x.currentRoundNumber -1;
        if(Number.isNaN(cur)) cur = x.round -1;
        let round = rounds[cur];
        switch (getGameMode(url,1)) {
            case "DUELS":
            case "BULLSEYE": {
                round = round.panorama;
                break;
            }
            case "LIVE-CHALLENGE": {
                round = round.question.panoramaQuestionPayload.panorama;
                break;
            }
            case "COMPETITIVE-STREAKS": {
                round = x.player.currentRound;
            }
        }
        let lat = round.lat;
        let lng = round.lng;
        window.open(`https://www.google.com/maps/place/${lat},${lng}/@${lat},${lng-5},6.7z`,"_blank", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=800, height=500, top=0, left=0");
    })
}

function handleKeyEvent() {
    const url = window.location.href.replace("/reconnect", "").replace("?client=web", "");
    const ApiUrl = getApiUrl(url);
    makeApiCall(ApiUrl);
}

(function () {
  "use strict";
  document.onkeydown = (evt) => {
    evt = evt || window.event;
    if (evt.shiftKey && evt.altKey && evt.keyCode == 71) {
      handleKeyEvent();
    }
  };
})();
