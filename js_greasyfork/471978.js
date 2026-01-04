// ==UserScript==
// @name         Photo Station 6 影片快轉
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Control Video forward/backward for Photo Station 6. Backword hotkey: "[", Forward hotkey: "]"
// @author       You
// @match        http://twmedia.coreop.net/photo/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coreop.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471978/Photo%20Station%206%20%E5%BD%B1%E7%89%87%E5%BF%AB%E8%BD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/471978/Photo%20Station%206%20%E5%BD%B1%E7%89%87%E5%BF%AB%E8%BD%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SECONDS = 5;

    document.addEventListener('keydown', (event) => {
        console.log(event.key)
        const extMain = window.Main;
        if (!extMain) {
            console.log('extJs main not found.');
            return;
        }
        if (event.key === '[') {
            const position = extMain.getScope("PhotoStation.VideoPlayer").player.getPosition();
            extMain.getScope("PhotoStation.VideoPlayer").player.seek(position - SECONDS);
        } else if (event.key === ']') {
            const position = extMain.getScope("PhotoStation.VideoPlayer").player.getPosition();
            extMain.getScope("PhotoStation.VideoPlayer").player.seek(position + SECONDS);
        }
    });
})();
