// ==UserScript==
// @name         Hide Twitter Verified Checkmarks
// @version      1.1
// @description  Hide the "Get verified" nag and/or all checkmarks
// @author       Zira Ott
// @namespace    dev.foxs.userscripts.twitter-checkmarks
// @license      MIT
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/510664/Hide%20Twitter%20Verified%20Checkmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/510664/Hide%20Twitter%20Verified%20Checkmarks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Settings

    // Load the toggle states (default to true for both)
    let hideVerifiedNag = GM_getValue('hideVerifiedNag', true);
    let hideCheckmarks = GM_getValue('hideCheckmarks', true);

    let hideVerifiedNagCommand;
    let hideCheckmarksCommand;

    // Clear existing commands and add new ones with the current states
    function updateMenuCommands() {
        if (hideVerifiedNagCommand) GM_unregisterMenuCommand(hideVerifiedNagCommand);
        if (hideCheckmarksCommand) GM_unregisterMenuCommand(hideCheckmarksCommand);

        hideVerifiedNagCommand = GM_registerMenuCommand(`${hideVerifiedNag ? '✅' : '🔳'} Hide "Get Verified" Nag`, toggleVerifiedNag);
        hideCheckmarksCommand = GM_registerMenuCommand(`${hideCheckmarks ? '✅' : '🔳'} Hide All Checkmarks`, toggleCheckmarks);
    }

    function toggleVerifiedNag() {
        hideVerifiedNag = !hideVerifiedNag;
        GM_setValue('hideVerifiedNag', hideVerifiedNag);
        updateNagVisibility();
        updateMenuCommands();
    }

    function toggleCheckmarks() {
        hideCheckmarks = !hideCheckmarks;
        GM_setValue('hideCheckmarks', hideCheckmarks);
        updateCheckmarkVisibility();
        updateMenuCommands();
    }

    // Actual magic

    function updateNagVisibility() {
        const nagElement = document.querySelector('div[data-testid="UserName"] a[href="/i/premium_sign_up"]');

        if (nagElement && nagElement.parentElement && nagElement.parentElement.parentElement) {
            nagElement.parentElement.parentElement.style.display = hideVerifiedNag ? 'none' : 'block';
        }
    }

    function updateCheckmarkVisibility() {
        const checkmarks = document.querySelectorAll('svg[data-testid="icon-verified"]');
        checkmarks.forEach(checkmark => {
            checkmark.style.display = hideCheckmarks ? 'none' : 'block';
        });
    }

    // Events

    // Set up a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(() => {
        updateNagVisibility();
        updateCheckmarkVisibility();
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the functions initially in case elements are already present
    updateNagVisibility();
    updateCheckmarkVisibility();

    // Initialize the menu commands
    updateMenuCommands();
})();
