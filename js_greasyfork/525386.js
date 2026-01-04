// ==UserScript==
// @name         Auto Regenerate on Server Busy (DeepSeek)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Automatically regenerates when AI server is busy, accurately targeting regenerate button
// @author       Your Name
// @match        https://chat.deepseek.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525386/Auto%20Regenerate%20on%20Server%20Busy%20%28DeepSeek%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525386/Auto%20Regenerate%20on%20Server%20Busy%20%28DeepSeek%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setInterval(() => {
        console.log("Running server busy check...");

        // Locate the "server is busy" message inside a <p> element
        const busyMessage = document.evaluate(
            "//p[contains(text(), 'The server is busy. Please try again later.')]",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (busyMessage) {
            console.log("Server busy message detected.");

            // Locate the regenerate button by targeting the <rect> element with id '重新生成'
            const regenerateButtonSvg = document.querySelector('rect[id="重新生成"]');

            if (regenerateButtonSvg) {
                console.log("Correct regenerate button SVG found. Clicking parent button...");
                regenerateButtonSvg.closest('div.ds-icon-button').click();  // Click the regenerate button
                console.log("Clicked regenerate button.");
            } else {
                console.error("Regenerate button SVG not found. Check selector.");
            }
        } else {
            console.log("No server busy message detected.");
        }
    }, 3000);  // Check interval in milliseconds
})();
