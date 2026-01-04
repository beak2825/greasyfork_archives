// ==UserScript==
// @name         LFM Helper
// @namespace    http://tampermonkey.net/
// @version      2024-12-23
// @description  Nope!
// @license      MIT
// @match        https://lowfuelmotorsport.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lowfuelmotorsport.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521579/LFM%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/521579/LFM%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", () => {
        console.log("Page fully loaded!");

        // Observe for changes in the DOM to catch the modal dynamically
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                    const modal = document.querySelector(".mat-dialog-container");
                    if (modal) {
                        console.log("Sign-Up modal detected:", modal);

                        // Automatically tick the checkboxes
                        const checkboxes = modal.querySelectorAll(".mat-checkbox-input");
                        if (checkboxes.length > 0) {
                            checkboxes.forEach((checkbox) => {
                                if (!checkbox.checked) {
                                    checkbox.click();
                                    console.log("Checkbox ticked:", checkbox);
                                }
                            });
                        } else {
                            console.log("No checkboxes found in the modal.");
                        }
                    }
                }
            }
        });

        // Start observing the body for modal appearance
        observer.observe(document.body, { childList: true, subtree: true });
        console.log("Observer is now active and watching for modals.");
    });

})();