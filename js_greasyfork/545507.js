// ==UserScript==
// @name        Toggle Fullscreen by Backtick key
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press ` (backtick) to toggle fullscreen mode on any webpage
// @author       Ankit
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545507/Toggle%20Fullscreen%20by%20Backtick%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/545507/Toggle%20Fullscreen%20by%20Backtick%20key.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener("keydown", function (e) {
        // Check if the backtick key (usually ` or ~)
        if (e.code === "Backquote") {
            toggleFullScreen();
        }
    });

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
})();
