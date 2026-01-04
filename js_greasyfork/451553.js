// ==UserScript==
// @name         Geoguessr Team Duels Custom Health
// @description  Lets you set any value for the health in a team duels game.
// @version      0.1.1
// @author       macca#8949
// @license      MIT
// @match        https://www.geoguessr.com/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/865125
// @downloadURL https://update.greasyfork.org/scripts/451553/Geoguessr%20Team%20Duels%20Custom%20Health.user.js
// @updateURL https://update.greasyfork.org/scripts/451553/Geoguessr%20Team%20Duels%20Custom%20Health.meta.js
// ==/UserScript==

const getGameId = () => {
    return window.location.href.split('/')[4];
}

window.modifyHealth = () => {
    const health = document.querySelector('#health-input').value;

    // Fetch the game options
    fetch(`https://game-server.geoguessr.com/api/lobby/${getGameId()}/join`, {
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
        "body": "{}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then((response) => response.json())
      .then((data) => {
        let gameOptions = data.gameOptions;
        gameOptions.initialHealth = health;

        fetch(`https://game-server.geoguessr.com/api/lobby/${getGameId()}/options`, {
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
            "body": JSON.stringify(gameOptions),
            "method": "PUT",
            "mode": "cors",
            "credentials": "include"
        });
    });
}

let observer = new MutationObserver((mutations) => {
    if (document.querySelector('.game-options_lives__wNSwd') && window.location.href.includes('team-duels')) {
        let healthElement = document.querySelector('.game-options_lives__wNSwd').parentElement;
        healthElement.innerHTML = `
        <input type="text" id="health-input" onchange="modifyHealth()" style="text-align: center; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px; width: 60px;"><div class="game-options_optionLabel__dJ_Cy">Health</div>
        `;

        fetch(`https://game-server.geoguessr.com/api/lobby/${getGameId()}/join`, {
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
            "body": "{}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then((response) => response.json())
          .then((data) => {
            document.querySelector('#health-input').value = data.gameOptions.initialHealth;
        });
    }
});


observer.observe(document.body, {
  characterDataOldValue: false,
  subtree: true,
  childList: true,
  characterData: false
});
