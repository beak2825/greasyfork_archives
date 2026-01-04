// ==UserScript==
// @name         Auto Click "抢地主" Buttons
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动抢地主
// @author       Augury
// @match        *://game.hullqin.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477173/Auto%20Click%20%22%E6%8A%A2%E5%9C%B0%E4%B8%BB%22%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/477173/Auto%20Click%20%22%E6%8A%A2%E5%9C%B0%E4%B8%BB%22%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Infinite loop
    while (true) {
        // Get all the "抢地主" buttons on the page
        const buttons = document.querySelectorAll('button:contains("抢地主")');

        // Loop through the buttons and click them
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].click();
        }

        // Wait for 1 second before repeating the loop
        setTimeout(() => {}, 100);
    }
})();