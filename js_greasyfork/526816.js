// ==UserScript==
// @name         Auto Set Twitch Quality to Source
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically sets Twitch player quality to 1080p60 (Source) using element detection and closes the settings menu
// @author       Kalila Violette
// @match        https://player.twitch.tv/*
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526816/Auto%20Set%20Twitch%20Quality%20to%20Source.user.js
// @updateURL https://update.greasyfork.org/scripts/526816/Auto%20Set%20Twitch%20Quality%20to%20Source.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Twitch Quality Script] Running...");

    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                callback(element);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function setQualityToSource() {
        waitForElement('[data-a-target="player-settings-button"]', (settingsButton) => {
            console.log("[Twitch Quality Script] Clicking settings...");
            settingsButton.click();

            waitForElement('[data-a-target="player-settings-menu-item-quality"]', (qualityButton) => {
                console.log("[Twitch Quality Script] Clicking quality menu...");
                qualityButton.click();

                waitForElement('[data-a-target="player-settings-submenu-quality-option"]', () => {
                    console.log("[Twitch Quality Script] Selecting Source quality...");
                    [...document.querySelectorAll('[data-a-target="player-settings-submenu-quality-option"]')]
                        .find(el => el.innerText.includes("1080p") || el.innerText.includes("Source"))?.click();

                    // To change the quality, modify the innerText check above:
                    // "1080p" or "Source" → sets to 1080p60 (Source)
                    // "720p" → sets to 720p60
                    // "480p" → sets to 480p
                    // "360p" → sets to 360p
                    // "160p" → sets to 160p
                    // Example: el.innerText.includes("720p")

                    waitForElement('[data-a-target="player-settings-button"]', (settingsButton) => {
                        console.log("[Twitch Quality Script] Closing settings menu...");
                        settingsButton.click();
                    });
                });
            });
        });
    }

    window.addEventListener("load", setQualityToSource);
})();
