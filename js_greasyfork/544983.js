// ==UserScript==
// @name         New Plan: Novel Pia
// @version      1.0
// @description  remove Novel Pia popup
// @author       RAVEN
// @include      https://global.novelpia.com/*
// @icon         https://gn.novelpia.com/common/logo_novelpia_dark.svg?mode=ori
// @grant        none
// @license      none
// @namespace https://greasyfork.org/users/1467571
// @downloadURL https://update.greasyfork.org/scripts/544983/New%20Plan%3A%20Novel%20Pia.user.js
// @updateURL https://update.greasyfork.org/scripts/544983/New%20Plan%3A%20Novel%20Pia.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function removeElements() {

        const dialogModal = document.querySelector('[role="dialog"][data-state="open"]');
        if (dialogModal) {
            console.log('Removing dialog modal');
            dialogModal.remove();
        }

        const adDiv = document.getElementById('3opmmrm');
        if (adDiv) {
            console.log('Removing ad div');
            adDiv.remove();
        }

        const backdrop = document.querySelector('div[data-state="open"].bg-black\\/50');
        if (backdrop) {
            console.log('Removing backdrop overlay');
            backdrop.remove();
        }
    }

    // Run on page load
    window.addEventListener('load', () => {
        setTimeout(removeElements, 300);
        document.body.style.overflow = "visible";
        console.log(`overflow set to visible`);

    });

    // Keep observing for dynamically added elements
    const observer = new MutationObserver(() => {
        removeElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
