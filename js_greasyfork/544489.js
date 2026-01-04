// ==UserScript==
// @name        Redflagdeals-DarkMode.user.js
// @namespace   Violentmonkey Scripts
// @match       *://forums.redflagdeals.com/*
// @match       *://www.redflagdeals.com/*
// @grant       none
// @version     2.0
// @author      Amrit Sandhu
// @description Dark theme for RedFlagDeals
// @downloadURL https://update.greasyfork.org/scripts/544489/Redflagdeals-DarkModeuserjs.user.js
// @updateURL https://update.greasyfork.org/scripts/544489/Redflagdeals-DarkModeuserjs.meta.js
// ==/UserScript==
(function() {
    function injectScript(fn) {
        const script = document.createElement("script");
        script.textContent = `(${fn})();`;
        document.documentElement.appendChild(script);
    }

    injectScript(() => {
        // Load DarkReader dynamically
        const darkReaderScript = document.createElement("script");
        darkReaderScript.src = "https://cdn.jsdelivr.net/npm/darkreader@4.9.58/darkreader.js";
        darkReaderScript.onload = () => {
            DarkReader.setFetchMethod(window.fetch);
            DarkReader.enable();

            setTimeout(() => {
                DarkReader.enable({
                    brightness: 100,
                    contrast: 90,
                    sepia: 10
                }, {
                    css: `ul.thread-meta-small {background-color: transparent;}`,
                });
            }, 100);
        };
        document.head.appendChild(darkReaderScript);
    });
})();