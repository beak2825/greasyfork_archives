// ==UserScript==
// @name            fc-ab blocker
// @name:cs         fc-ab blokovač
// @namespace       https://petrvurm.cz
// @version         2024-07-11
// @description     Blocks fc-ab disable adblock popup on all websites and enables scrolling
// @description:cs  Blokuje vyskakovací okno fc-ab disable adblock na všech webových stránkách
// @author          Petr Vurm
// @match           *://*/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=petrvurm.cz
// @grant           none
// @license         Copyright Petr Vurm
// @downloadURL https://update.greasyfork.org/scripts/500265/fc-ab%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/500265/fc-ab%20blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enableScrolling() {
        document.body.style.overflow = 'auto';
    }

    function hideElements() {
        // Select all elements with class 'fc-ab-root'
        let fcAbRootElements = document.querySelectorAll('.fc-ab-root');
        fcAbRootElements.forEach(element => {
            element.style.display = 'none';
        });

        // Select all elements with class that starts with 'fc-ab-'
        let fcAbElements = document.querySelectorAll('[class^="fc-ab-"]');
        fcAbElements.forEach(element => {
            element.style.display = 'none';
        });

        // Enable scrolling on body
        enableScrolling();
    }

    // Initial hide and enable scrolling
    hideElements();

    // MutationObserver to hide elements that are dynamically added to the DOM and enable scrolling
    let observer = new MutationObserver(hideElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();
