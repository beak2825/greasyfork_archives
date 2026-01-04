// ==UserScript==
// @name         Remove "Feed" from Genius
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  This Tampermonkey script removes the feed button from Genius.com and allows you to easily toggle the removal on or off through the Tampermonkey menu
// @author       Fri
// @license MIT
// @match        https://genius.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=genius.com
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/503098/Remove%20%22Feed%22%20from%20Genius.user.js
// @updateURL https://update.greasyfork.org/scripts/503098/Remove%20%22Feed%22%20from%20Genius.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default option to remove elements (enabled)
    let isEnabled = GM_getValue('removeElements', true);

    // Function to toggle the element removal option
    function toggleRemoval() {
        isEnabled = !isEnabled;
        GM_setValue('removeElements', isEnabled);
        alert(`Element removal is now ${isEnabled ? 'ENABLED' : 'DISABLED'}.`);
        location.reload();
        updateMenu();
    }

    // Update the Tampermonkey menu
    function updateMenu() {
        GM_unregisterMenuCommand('toggleRemoval');
        GM_registerMenuCommand(`Disable removal (Currently: ${isEnabled ? 'ENABLED' : 'DISABLED'})`, toggleRemoval, 't');
    }

    // Register the initial menu
    updateMenu();

    // Wait until the page has fully loaded
    window.addEventListener('load', function() {
        if (!isEnabled) {
            console.log('Feed removal is disabled.');
            return;
        }

        // Try remove the feed in bagon pages
        var bagon = document.querySelector('inbox-icon[inbox-name="newsfeed_inbox"]');
        if (bagon) {
            bagon.remove();
            console.log('Removed in bagon.');
        }

        // Try remove the feed in react pages if there are at least 5 elements in total
        var reactItems = document.querySelectorAll("div.StickyNavLoggedIn__Item-sc-1lrodac-0");
        if (reactItems.length >= 5) {
            reactItems[1].remove();
            console.log('Removed in react.');
        }

        //Try remove the feed in the main page (genius.com/)
        var mainItems = document.querySelectorAll("div.PageHeaderLoggedIn__Item-on81eb-0 ");
               if (mainItems.length >= 5) {
            mainItems[1].remove();
            console.log('Removed in main page.');
        }

    }, false);

})();