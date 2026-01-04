// ==UserScript==
// @name         GeoRisk Insta Guess
// @description  Insta guesses Antarctica in team duels for GeoRisk sessions
// @version      1.0.6
// @author       lightblue#9668
// @license      MIT
// @match        https://www.geoguessr.com/*
// @icon         https://cdn.discordapp.com/icons/975845742629490708/5e06cb2509eec4d731c078ee20bd72d1.webp?size=128
// @namespace    https://greasyfork.org/en/users/1096177-lightblue-geog
// @downloadURL https://update.greasyfork.org/scripts/468422/GeoRisk%20Insta%20Guess.user.js
// @updateURL https://update.greasyfork.org/scripts/468422/GeoRisk%20Insta%20Guess.meta.js
// ==/UserScript==
 
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
 
let lastRoundGuessed = 0;
 
const getGameId = () => location.pathname.split("/")[2];
const getRoundNumberApi = (gameId) => `https://game-server.geoguessr.com/api/duels/${gameId}/`;
const getRoundNumber = async () => await fetchWithCors(getRoundNumberApi(getGameId()), "GET")
                              .then(it => it.json()).then(it => it.currentRoundNumber);
const getGuessApi = (gameId) => `https://game-server.geoguessr.com/api/duels/${gameId}/guess`;
 
async function guessAntarctica() {
    if (lastRoundGuessed != 0) return "Skipping because already preparing a guess";
    lastRoundGuessed = -1;
    const rn = await getRoundNumber();
    if (rn == lastRoundGuessed) return "Skipping because already guessed";
    lastRoundGuessed = rn;
    return fetchWithCors(getGuessApi(getGameId()), "POST", {"lat": -75.6, "lng": 65.8, "roundNumber": rn})
        .then(it => it.json())
        .then(it => `Sent guess for round ${it.currentRoundNumber}`)
        .catch(e => {lastRoundGuessed = 0; return e;});
};
 
function doIt() {
    if (!location.href.includes("duels")) {
        lastRoundGuessed = 0;
        return;
    }
    console.log("dueling now")

    const close_button = document.evaluate("//button[contains(., 'Close')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    if(close_button !== null){
        console.log("Found a `Close` button. Clicking it now...")
        close_button.click()
    }

    const continue_link = document.evaluate("//a[contains(.,'Continue')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    if(continue_link !== null){
        console.log("Found a `Continue` link. Clicking it now...")
        continue_link.click()
    }

    const button = document.querySelector("button[data-qa='perform-guess']>[class*='button_wrapper__']");
    if (button == null || button.innerText != "GUESS") {
        lastRoundGuessed = 0;
        return;
    }
    guessAntarctica()
    .then(out => console.log(out));
}
 
setInterval(doIt, 1000);