// ==UserScript==
// @name         Hide Hunt
// @namespace    http://tampermonkey.net/
// @version      2024-10-10
// @description  Удаляет охоту на карте
// @author       Smaileri
// @match        https://www.heroeswm.ru/map.php*
// @match        https://www.lordswm.com/map.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/512026/Hide%20Hunt.user.js
// @updateURL https://update.greasyfork.org/scripts/512026/Hide%20Hunt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeMapHuntBlockDiv() {
        const huntBlockDiv = document.getElementById('map_hunt_block_div');
        if (huntBlockDiv) {
            huntBlockDiv.remove();
            console.log('map_hunt_block_div removed.');
        }
    }

    // MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                removeMapHuntBlockDiv();
            }
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Also try to remove the div immediately on load
    window.addEventListener('load', removeMapHuntBlockDiv);
})();
