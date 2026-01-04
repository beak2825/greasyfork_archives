// ==UserScript==
// @name         THY Auto Skipper
// @namespace    http://tampermonkey.net/
// @version      2024-10-09
// @description  Auto-skips "Next" button click when it's available in the SCORM player.
// @author       -
// @match        https://*.thy.com/thy/eep/scorm_player.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=turkishairlines.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524096/THY%20Auto%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/524096/THY%20Auto%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let watching = false;
    let observer, observer2;


    const startWatch = () => {
        const targetNode = document.querySelector('iframe#IcerikFrame')?.contentWindow?.document?.querySelector('#next');

        if (!targetNode) {
            console.warn("Next button not found!");
            return;
        }

        const config = { attributes: true };

        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type !== "attributes") return;
                if (mutation.target.getAttribute('aria-disabled') === 'false') {
                    mutation.target.click();
                }
            }
        };

        observer = new MutationObserver(callback);
        observer.observe(targetNode, config);

        const targetNode2 = document.querySelector('#EEPtimeoutBackGround');

        if (!targetNode2) console.warn("Timeout background not found!");
        else {
            const cb = (mutationList, observer) => {
                for (const mutation of mutationList) {
                    if (mutation.type !== "attributes") return;
                    if (mutation.target.style.display === "inline") {
                        mutation.target.querySelector('#EEPgotoLastLocationBtn')?.click();
                    }
                }
            };

            observer2 = new MutationObserver(cb);
            observer2.observe(targetNode2, config);
        }

        watching = true;
        renderButton(true);
    };

    const stopWatch = () => {
        if (observer) {
            observer.disconnect();
            observer = null;
            observer2 = null;
            watching = false;
        }
        renderButton(false);
    };

    const renderButton = (isWatching) => {
        const existingButton = document.querySelector("#autoSkipButton");
        if (existingButton) existingButton.remove();

        const button = document.createElement("button");

        button.type = "button";
        button.id = "autoSkipButton";
        button.textContent = isWatching ? "Stop Auto Skip" : "Start Auto Skip";
        button.style.position = "fixed";
        button.style.right = "0.5rem";
        button.style.bottom = "3.5rem";
        button.style.padding = "10px 20px";
        button.style.backgroundColor = isWatching ? "#ff4d4d" : "#4caf50";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.zIndex = "9999";

        button.addEventListener("click", () => {
            if (watching) stopWatch();
            else startWatch();
        });

        document.body.appendChild(button);
    };

    renderButton(watching);
})();
