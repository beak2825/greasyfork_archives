// ==UserScript==
// @name         bombs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       lesungera
// @match        https://www.erepublik.com/*/military/battlefield/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382157/bombs.user.js
// @updateURL https://update.greasyfork.org/scripts/382157/bombs.meta.js
// ==/UserScript==


function small() {
    bomb(21);
}

function cruise() {
    bomb(215);
}

function big(){
    bomb(22);
}


async function bomb(id) {
    while(1) {
        await fetch("https://www.erepublik.com/en/military/deploy-bomb", {
            "credentials": "include",
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9,bg-BG;q=0.8,bg;q=0.7",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://www.erepublik.com/en/military/battlefield/" + SERVER_DATA.battleId,
            "referrerPolicy": "same-origin",
            "body": "battleId=" + SERVER_DATA.battleId + "&_token=" + SERVER_DATA.csrfToken + "&bombId=" + id,
            "method": "POST",
            "mode": "cors"
        });
        await sleep(800);
    }
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

window.small = small;
window.cruise = cruise;
window.big = big;

