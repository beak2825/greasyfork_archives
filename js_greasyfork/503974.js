// ==UserScript==
// @name         Twitch Error Fix
// @version      0.1
// @description  Reload twitch on 2000 error
// @author       Makhloufbel
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1353448
// @downloadURL https://update.greasyfork.org/scripts/503974/Twitch%20Error%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/503974/Twitch%20Error%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkStatus() {
        const results = document.querySelector("#root > div > div.Layout-sc-1xcs6mc-0.lcpZLv > div > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.InjectLayout-sc-1i43xsx-0.persistent-player > div > div.Layout-sc-1xcs6mc-0.video-player > div > div.Layout-sc-1xcs6mc-0.video-ref > div > div > div.Layout-sc-1xcs6mc-0.dZwwnJ.player-overlay-background.player-overlay-background--darkness-0.content-overlay-gate > div > div.Layout-sc-1xcs6mc-0.jkApnw.content-overlay-gate__allow-pointers > button")
        const btn = document.querySelector("#live-page-chat > div > div > div.Layout-sc-1xcs6mc-0.iTiPMO.chat-shell.chat-shell__expanded > div > div > section > div > div.Layout-sc-1xcs6mc-0.kILIqT.chat-input > div:nth-child(2) > div.Layout-sc-1xcs6mc-0.eWfUfi.chat-input__buttons-container > div.Layout-sc-1xcs6mc-0.cNKHwD > div > div > div > div.Layout-sc-1xcs6mc-0.kxrhnx > div > div > div > button")
        if (results) {
            results.click()
        }
        if(btn){
        btn.click()
        }
    }

    window.onload = function () {
        setInterval(checkStatus, 1000);
    }
})();