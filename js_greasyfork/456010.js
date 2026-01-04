// ==UserScript==
// @name         Kanka Entity Privacy Setting on the Entry Tab
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Makes the entity Privacy checkbox visible on both the Entry and Permissions tabs
// @author       Salvatos
// @license      MIT
// @match        https://app.kanka.io/*/create*
// @match        https://app.kanka.io/*/edit*
// @exclude      https://app.kanka.io/*/posts/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @downloadURL https://update.greasyfork.org/scripts/456010/Kanka%20Entity%20Privacy%20Setting%20on%20the%20Entry%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/456010/Kanka%20Entity%20Privacy%20Setting%20on%20the%20Entry%20Tab.meta.js
// ==/UserScript==

/* Only run if the current user has access to the Permissions tab */
let permissionsTab = document.getElementById('form-permissions') ?? false;

if (permissionsTab) {
    const privBox = document.getElementsByClassName('privacy-callout')[0];
    const entryTab = document.getElementById('form-entry');

    // At page load, move checkbox to top of Entry tab
    setTimeout(() => { // Give it half a second for the form’s JS to set the classes
        if (entryTab.classList.contains("active")) {
            entryTab.insertBefore(privBox, entryTab.firstChild);
            observePermissions();
        }
        // Unless the page is being reloaded in a different tab
        else {
            observeEntry();
        }
    }, 500);

    /* When Permissions or Entry tab is focused, move checkbox to it.
     * Don’t rely on onClick, because the Back/Forward browser action also cycles between previously visited tabs.
     * Use mutation observers instead to watch the .active class. */

    function observeEntry() {
        // Set and run an observer until the tab is activated
        let observer = new MutationObserver(function(mutations) {
            if (entryTab.classList.contains("active")) {
                entryTab.prepend(privBox);
                //console.log("Moved tab to Entry at " + Date.now());
                observer.disconnect();
                observePermissions();
            }
        });
        observer.observe(entryTab, {attributes: true, childList: false, characterData: false, subtree: false});
    }
    function observePermissions() {
        // Set and run an observer until the tab is activated
        let observer = new MutationObserver(function(mutations) {
            if (permissionsTab.classList.contains("active")) {
                permissionsTab.prepend(privBox);
                //console.log("Moved tab to Permissions at " + Date.now());
                observer.disconnect();
                observeEntry();
            }
        });
        observer.observe(permissionsTab, {attributes: true, childList: false, characterData: false, subtree: false});
    }
}