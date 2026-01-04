// ==UserScript==
// @name         Join Random Game Mode
// @namespace    violentmonkey
// @version      3.1.3.3.7
// @description  Join a new game on your region with the highest player count for a random game mode that is not full when you press a certain key
// @author       hitthemoney, moongazer07
// @match        *://krunker.io/*
// @exclude     *://krunker.io/social.html*
// @exclude     *://krunker.io/editor.html*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485763/Join%20Random%20Game%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/485763/Join%20Random%20Game%20Mode.meta.js
// ==/UserScript==

const joinKey = "F4"; // Join game shortcut key, case sensitive
const gameModes = [0, 1, 2, 3, 10, 13, 14, 19, 21, 25, 27, 28, 29, 33, 34]; // Game mode IDs

const getRandomGameMode = async () => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.random.org/integers/?num=1&min=0&max=14&col=1&base=10&format=plain&rnd=new",
            onload: function(response) {
                if (response.status === 200) {
                    resolve(gameModes[parseInt(response.responseText.trim())]);
                } else {
                    reject(new Error("Failed to fetch random number from Random.org"));
                }
            },
            onerror: function(error) {
                reject(new Error("Failed to fetch random number from Random.org"));
            }
        });
    });
};

const getTopGame = async () => {
    const region = window.localStorage.pingRegion7 || (await fetch(`https://matchmaker.krunker.io/game-info?game=${encodeURIComponent(window.getGameActivity().id)}`).then(res => res.json()));
    const gameData = (await fetch(`https://matchmaker.krunker.io/game-list?hostname=${window.location.hostname}`).then(res => res.json())).games;
    
    const targetGameMode = await getRandomGameMode();

    const filData = gameData.filter(game =>
        game[1] === region &&
        game[4].g === targetGameMode &&
        game[4].c === 0 &&
        game[2] < game[3]
    ).sort((x, y) => y[2] - x[2]);
    
    return filData[0];
}

const joinTopGame = async () => {
    const targetGame = await getTopGame();
    window.location.href = `/?game=${targetGame[0]}`;
}

window.addEventListener("keydown", async (event) => {
    switch (event.key) {
        case joinKey: {
            await joinTopGame();
            break;
        }
    }
});