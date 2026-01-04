// ==UserScript==
// @name         LordsWM - Hide Rented Artifacts 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide rented artifacts which cannot be worn(Expired Time/Exhausted Battles) on inventory page of LordsWM.com.
// @author       You
// @match        https://www.lordswm.com/inventory.php
// @match        https://www.heroeswm.ru/inventory.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541246/LordsWM%20-%20Hide%20Rented%20Artifacts.user.js
// @updateURL https://update.greasyfork.org/scripts/541246/LordsWM%20-%20Hide%20Rented%20Artifacts.meta.js
// ==/UserScript==
// Primarily developed for those who store clan artifacts and find it difficult to search required arts
//
// If you feel generous, gifts are welcome lol - https://www.lordswm.com/pl_info.php?id=4553529

(function () {
    'use strict';

    function hideRentedArtifacts() {
        const rentedItems = document.querySelectorAll('.inventory_item_finished_rent');
        if (rentedItems.length === 0) return false;

        rentedItems.forEach(el => {
            const parent = el.closest('.inventory_item_div');
            if (parent) {
                parent.style.display = 'none';
            }
        });
        return true;
    }

    function waitForArtifacts(retries = 30, interval = 300) {
        const check = () => {
            if (hideRentedArtifacts()) {
                // Once successfully hidden, stop retrying
                return;
            }

            if (retries > 0) {
                setTimeout(() => waitForArtifacts(retries - 1, interval), interval);
            }
        };
        check();
    }

    window.addEventListener('load', () => {
        waitForArtifacts();

        // Also observe future changes just in case
        const observer = new MutationObserver(() => {
            hideRentedArtifacts();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();

