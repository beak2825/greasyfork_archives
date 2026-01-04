// ==UserScript==
// @name        Disable YouTube Ambient Mode
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.1
// @author      thehus
// @description Disables YouTube Ambient Mode on desktop
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/524741/Disable%20YouTube%20Ambient%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/524741/Disable%20YouTube%20Ambient%20Mode.meta.js
// ==/UserScript==

window.addEventListener("load", (event) => {
    const MAX_RETRIES = 10;
    const WAIT_MS = 500;

    const runScript = () => {
        // wait for an element to appear on the page
        const waitForElement = (selector) => {
            let timeout = MAX_RETRIES;

            return new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    const el = selector();
                    if (el) {
                        clearInterval(interval);
                        resolve(el);
                    }
                    if (timeout-- <= 0) {
                        clearInterval(interval);
                        reject("timeout");
                    }
                }, WAIT_MS);
            });
        };

        // find the settings cog and press it
        waitForElement(() => document.querySelector("[data-tooltip-target-id=ytp-settings-button]")).then((cog) => {
            cog.click();
            cog.click();

            const getAmbientMode = () => Array.from(document.getElementsByClassName("ytp-menuitem")).find(e => e.innerText.toLowerCase().includes("ambient mode"));
            // find the ambient mode button and press it if it is enabled
            waitForElement(getAmbientMode).then((el) => {
                if (el.ariaChecked === "true") el.click();
            }).catch((e) => {
                console.log("couldn't find ambient mode button");
            });

        }).catch((e) => {
            console.log("couldn't find settings cog");
        });
    };

    const checkAndRunScript = () => {
        if (window.location.href.includes("youtube.com/watch")) {
            runScript();
        }
    };

    window.addEventListener('yt-page-data-updated', function (e) {
        checkAndRunScript();
    });

    // Initial check
    checkAndRunScript();
});
