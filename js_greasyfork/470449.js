// ==UserScript==
// @name         Auto Actions Compact
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Script to perform auto actions with toggle buttons.
// @author       Your Name
// @match        *://www.modd.io/*
// @exclude      https://www.modd.io/play/bossfightsRep/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470449/Auto%20Actions%20Compact.user.js
// @updateURL https://update.greasyfork.org/scripts/470449/Auto%20Actions%20Compact.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let bots = false;
    let playcounts = false;

   async function bot() {
       while (bots) {
       taro.network._io.wsUrl = `${taro.client.server.url}?token=${gsAuthToken}&sid=${taro.client.server.id}&distinctId=5c7d0b7c2972e4494a08cd7e&posthogDistinctId=5c7d0b7c2972e4494a08cd7e`;
       new WebSocket(taro.network._io.wsUrl, "bot");
       await new Promise(resolve => setTimeout(resolve, 1000));
}
   }

    async function playcount() {
       while (playcounts) {
       taro.network._io.wsUrl = `${taro.client.server.url}?token=${gsAuthToken}&sid=${taro.client.server.id}&distinctId=5c7d0b7c2972e4494a08cd7e&posthogDistinctId=5c7d0b7c2972e4494a08cd7e`;
       const alt = new WebSocket(taro.network._io.wsUrl, "bot");
       alt.close();
       await new Promise(resolve => setTimeout(resolve, 500));
}
}
    function toggleBots() {
        bots = !bots;
        if (bots) {
            bot();
        }
    }
    function togglePlaycounts() {
        playcounts = !playcounts;
        if (playcounts) {
            playcount();
        }
    }


    function updateButtonText(button, text, flag) {
        button.textContent = text + (flag ? " (ON)" : " (OFF)");
    }

    function createToggleButton(text, onClick, topOffset, rightOffset, flag) {
        const button = document.createElement("button");
        button.style.position = "fixed";
        button.style.top = topOffset + "px";
        button.style.right = rightOffset + "px";
        updateButtonText(button, text, flag);
        button.addEventListener("click", () => {
            flag = !flag;
            updateButtonText(button, text, flag);
            onClick();
        });
        document.body.appendChild(button);
    }

    createToggleButton("add bot", toggleBots, 40, 10, bots);
    createToggleButton("add playcount", togglePlaycounts, 70, 10, playcounts);
})();