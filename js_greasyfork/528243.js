// ==UserScript==
// @name         eR move active enhacements to the top
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Moves active enhacements to the top in eR inventory
// @author       W
// @match        https://www.erepublik.com/*/main/inventory
// @match        https://www.erepublik.com/*/economy/inventory
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528243/eR%20move%20active%20enhacements%20to%20the%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/528243/eR%20move%20active%20enhacements%20to%20the%20top.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function moveActiveEnhancements() {
        let inventoryContainer = document.getElementById("inventoryItems");
        let activeEnhancements = document.getElementById("activeEnhancements");

        if (inventoryContainer && activeEnhancements) {
            inventoryContainer.prepend(activeEnhancements);
            console.log("✅ activeEnhancements moved");
            return true;
        }
        return false;
    }

    let observer = new MutationObserver((mutations, obs) => {
        if (moveActiveEnhancements()) {
            obs.disconnect();
        }
    });

    let inventoryContainer = document.getElementById("inventoryItems");
    if (inventoryContainer) {
        observer.observe(inventoryContainer, { childList: true, subtree: true });
    }

    window.addEventListener("load", () => {
        setTimeout(() => {
            if (moveActiveEnhancements()) {
                observer.disconnect();
            }
        }, 1000);
    });
})();