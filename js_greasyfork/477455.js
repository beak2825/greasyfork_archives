// ==UserScript==
// @name         Geoguessr Location Retriever
// @match        https://www.geoguessr.com/*
// @description  Get the actual location Geoguessr gave you from the result screens. Works for games and streaks, solo and challenge.
// @version      1.1.5
// @author       victheturtle#5159
// @grant        none
// @license      MIT
// @icon         https://www.svgrepo.com/show/12218/find.svg
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @downloadURL https://update.greasyfork.org/scripts/477455/Geoguessr%20Location%20Retriever.user.js
// @updateURL https://update.greasyfork.org/scripts/477455/Geoguessr%20Location%20Retriever.meta.js
// ==/UserScript==

let lastGeneratedLink = null;
let lastChecked = 0;
let checkedResults = false;

function createCopyButton() {
    let copyButton = document.createElement("button");
    copyButton.innerHTML = "Copy Google Maps Link";
    copyButton.style = "position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 5px 15px; background-color: #4CAF50; color: white; border: none; cursor: pointer;";
    copyButton.onclick = function() {
        if (lastGeneratedLink) {
            navigator.clipboard.writeText(lastGeneratedLink);

        }
    };
    document.body.appendChild(copyButton);
}

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

function linkOfLocation(round, copyToClipboard) {
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
    lastGeneratedLink = link;  // Update the last generated link
    console.log(link);
    if (copyToClipboard) {
        try {
            navigator.clipboard.writeText(link);
        } catch (e) {
            console.log(e);
        }
    }
    return link;
}
createCopyButton();

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
    const game_tag = location.pathname.split("/")[2];
    let api_url = "https://www.geoguessr.com/api/v3/games/"+game_tag;
    if (location.pathname.startsWith("/challenge") || !!document.querySelector("div[class*='switch_switch__']")) {
        api_url = "https://www.geoguessr.com/api/v3/challenges/"+game_tag+"/game";
    };
    fetch(api_url)
    .then(res => res.json())
    .then(out => {
        addFlagOnclicks(out.rounds.slice(0, out.player.guesses.length));
        if (out.type == "challenge" && out.mode == "streak") {
            let api_url2 = "https://www.geoguessr.com/api/v3/results/highscores/"+game_tag+"?friends=false&limit=1";
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
    } else if (pinCount != lastChecked || location.pathname.startsWith("/results") && !checkedResults && document.readyState == "complete") {
        lastChecked = pinCount;
        checkedResults = location.pathname.startsWith("/results");
        check();
    }
};

function checkGameMode() {
    return location.pathname.startsWith("/results") || location.pathname.startsWith("/game") || location.pathname.startsWith("/challenge")
}


let lastDoCheckCall = 0;

//页面错误时点击
function checkAndClickButton() {
    const button = document.querySelector('button.button_button__CnARx.button_variantPrimary__xc8Hp > div.button_wrapper__NkcHZ > span.button_label__kpJrA');
    if (button && button.textContent === 'Try again') {
        button.click();
    }
}

// 使用setInterval每隔1秒运行checkAndClickButton函数
setInterval(checkAndClickButton, 1000);
//以上是页面错误时点击代码

new MutationObserver(async (mutations) => {
    if (!checkGameMode() || lastDoCheckCall >= (Date.now() - 50)) return;
    lastDoCheckCall = Date.now();
    doCheck();
}).observe(document.body, { subtree: true, childList: true });
