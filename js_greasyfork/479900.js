// ==UserScript==
// @name         Ironwood Ironman
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Configures the Ironwood RPG user interface to be played as an Ironman game mode.
// @author       Jordan Berlyn
// @match        https://ironwoodrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ironwoodrpg.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479900/Ironwood%20Ironman.user.js
// @updateURL https://update.greasyfork.org/scripts/479900/Ironwood%20Ironman.meta.js
// ==/UserScript==

(function() {

    let headerModified = false;
    let marketRemoved = false;
    let guildRemoved = false;
    let leaderboardsRemoved = false;

    function modifyUI() {
        const headers = document.getElementsByClassName("header");
        for (const header of headers) {
            if (header.innerText === "CHARACTER") {
                header.innerText = "CHARACTER (IRONMAN)"
                headerModified = true;
            }
        }

        const sidePanel = document.getElementsByClassName("custom-scrollbar")[0];
        if (!sidePanel) return;
        const buttons = sidePanel.getElementsByTagName("button");
        for (const button of buttons) {
            if (button.innerText === "Market") {
                button.remove();
                marketRemoved = true;
            }
            if (button.innerText === "Guild") {
                button.remove();
                guildRemoved = true;
            }
            if (button.innerText === "Leaderboards") {
                button.remove();
                leaderboardsRemoved = true;
            }
        }
    }

    function checkUI() {
        if (headerModified && marketRemoved && guildRemoved && leaderboardsRemoved) {
            clearInterval(modifyUI_Interval);
        }
    }

    const modifyUI_Interval = setInterval(modifyUI, 1000);
    const checkUI_Interval = setInterval(checkUI, 5000);

})();