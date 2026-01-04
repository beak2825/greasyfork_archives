// ==UserScript==
// @name         Woomy Config Randomizer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Randomizes your config as you play the game
// @author       PowfuArras // Discord: @xskt
// @match        https://woomy.app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=woomy.app
// @grant        none
// @license      FLORRIM DEVELOPER GROUP LICENSE (https://github.com/Florrim/license/blob/main/LICENSE.md)
// @downloadURL https://update.greasyfork.org/scripts/471058/Woomy%20Config%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/471058/Woomy%20Config%20Randomizer.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Simulate a click event on an element
    function click(element) {
        element.dispatchEvent(new MouseEvent("click", {
            view: window,
            bubbles: false,
            cancelable: true
        }));
    }

    // When the page loads...
    window.addEventListener("load", function () {
        // Try, try try try!
        let interval = setInterval(function () {
            try {
                // Main import button for the options menu
                const importElement = document.getElementById("importOptions").childNodes[0].parentElement;

                // Clear the interval if we manage to hook into the options menu
                clearInterval(interval);

                // More important buttons
                const exportElement = document.getElementById("exportOptions");
                const resetElement = document.getElementById("resetOptions");
                const fieldElement = document.getElementById("optionsResult");

                // Get the default config options as a starting point
                click(resetElement);
                click(exportElement);
                const config = JSON.parse(fieldElement.value);
                config["Menu Animation"] = "disabled";
                config["Menu Dark Mode"] = true;

                // Main loop for causing chaos
                setInterval(function () {

                    // Abuse the built in randomize feature to randomly select a property to change our own config with,
                    // then import the merged config
                    fieldElement.value = "randomize";
                    click(importElement);
                    const selection = JSON.parse(fieldElement.value);
                    const keys = Object.keys(selection);
                    const key = keys[Math.floor(keys.length * Math.random())];
                    if (key === "Screenshot Mode" || key === "Resolution" || key === "Font Family" || key === "Menu Animation" || key === "Menu Dark Mode" || key === "FPS Cap") return;
                    config[key] = selection[key];
                    fieldElement.value = JSON.stringify(config);
                    click(importElement);
                }, 100);
            } catch (error) {}
        }, 100);
    });
})();