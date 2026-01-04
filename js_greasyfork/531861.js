// ==UserScript==
// @name         YouTube - FIXED remove download, clip, thanks buttons
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Hides YouTube "Download", "Clip", "Thanks", and "Promote" buttons from the interface. Fixed.
// @author       Magma_Craft (update by jawsawn)
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531861/YouTube%20-%20FIXED%20remove%20download%2C%20clip%2C%20thanks%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/531861/YouTube%20-%20FIXED%20remove%20download%2C%20clip%2C%20thanks%20buttons.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const style = document.createElement("style");
    style.textContent = `
        ytd-download-button-renderer,
        #flexible-item-buttons [aria-label="Promote"],
        #flexible-item-buttons [aria-label="Clip"],
        #flexible-item-buttons [aria-label="Thanks"],
        #flexible-item-buttons [title="Show support with Super Thanks"],
        ytd-button-renderer[button-renderer*="MONEY_HEART"],
        ytd-button-renderer[button-renderer*="CONTENT_CUT"] {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    //uncomment the rest if it breaks again

    /*function removeButtonsByIconType(container) {
        const buttons = container.querySelectorAll("ytd-button-renderer");

        buttons.forEach((btn) => {
            try {
                const iconType = btn.data?.icon?.iconType;
                if (["MONEY_HEART", "CONTENT_CUT", "DOWNLOAD"].includes(iconType)) {
                    btn.remove();
                }
            } catch (e) {
                // fail silently
            }
        });
    }

    async function waitForElm(selector) {
        while (!document.querySelector(selector)) {
            await new Promise((resolve) => requestAnimationFrame(resolve));
        }
        return document.querySelector(selector);
    }

    function initObserver() {
        const observer = new MutationObserver(() => {
            document.querySelectorAll("#top-level-buttons-computed.ytd-menu-renderer")
                .forEach(removeButtonsByIconType);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    document.addEventListener("yt-page-data-updated", async () => {
        const btns = await waitForElm("#top-level-buttons-computed.ytd-menu-renderer");
        removeButtonsByIconType(btns);
    });

    initObserver();*/
})();
