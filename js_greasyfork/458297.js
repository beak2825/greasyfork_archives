// ==UserScript==
// @name         Team Duel insta guess
// @description  Insta guesses Antarctica in team duels
// @version      1.0.3
// @author       victheturtle#5159
// @license      MIT
// @match        https://www.geoguessr.com/*
// @icon         https://cdn.discordapp.com/icons/975845742629490708/5e06cb2509eec4d731c078ee20bd72d1.webp?size=128
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @downloadURL https://update.greasyfork.org/scripts/458297/Team%20Duel%20insta%20guess.user.js
// @updateURL https://update.greasyfork.org/scripts/458297/Team%20Duel%20insta%20guess.meta.js
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

const getGameId = () => ((location.pathname.split("/")[2].length > 20) ? location.pathname.split("/")[2] : location.pathname.split("/")[3]);
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
    if (!location.href.includes("team-duels")) {
        lastRoundGuessed = 0;
        return;
    }
    const button = document.querySelector("button[data-qa='perform-guess']>[class*='button_wrapper__']");
    if (button == null || button.innerText != "GUESS") {
        lastRoundGuessed = 0;
        return;
    }
    guessAntarctica()
    .then(out => console.log(out));
}

setInterval(doIt, 200);
