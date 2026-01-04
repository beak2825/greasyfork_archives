// ==UserScript==
// @name         Squabbles.io Sort Communities
// @namespace  https://github.com/waaamb/userscripts
// @version      0.3
// @description  Sort subscribed communities on your home page.
// @author       Waaamb
// @match        *://*.squabbles.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=squabbles.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468622/Squabblesio%20Sort%20Communities.user.js
// @updateURL https://update.greasyfork.org/scripts/468622/Squabblesio%20Sort%20Communities.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* Settings */
    /* These are settings variables to enable features.
    /* Keep in mind they'll be erased if the script is updated.              */

    // This does nothing right now. The script only sorts alphabetically.
    const sortMode = 'aza';

    /* Currently the list of communities on your home page is unsorted.
    /* This function sorts them.                                             */

    let oldSquubsListLength = 0;

    const sortSquubs = () => {

        // If we're on the homepage, otherwise we're done here
        if (window.location.pathname == '/home') {

            const squubsListDiv = selectSquubsList();

            // If the list does not exist on the page, we're done here
            if (!squubsListDiv) return;

            const squubsList = Array.from(squubsListDiv.children);

            // If the list has changed lengths (i.e. it's been expanded or hidden)
            if (squubsList.length != oldSquubsListLength) {
                squubsListDiv.classList.remove('sorted');
            }

            // If the list isn't already sorted
            if (!squubsListDiv.classList.contains('sorted')) {
                // Sort the list alphabetically
                // This could be changed to incorporate different sorting methods
                let sortedSquubs = squubsList.sort((a, b) =>
                    a.textContent.localeCompare(b.textContent));
                // Move the "more" button back to the end
                sortedSquubs.push(sortedSquubs.shift());

                oldSquubsListLength = sortedSquubs.length;
                squubsListDiv.append(...sortedSquubs);
                squubsListDiv.classList.add('sorted');
            }
        }
    }

    const selectSquubsList = () => {

        // This could break at any time if elements are added to or deleted from the page
        // Hopefully the list gets an actual identifier in the future...
        const squubsListSelector = '#app #content-wrapper .container div';

        // Search for the list
        const squubsListDiv = document.querySelector(squubsListSelector);

        // If the list does not exist on the page, we're done here
        if (!squubsListDiv) return;

        // ...for now, add a class to make it easier to work with
        if (!squubsListDiv.classList.contains('squubs-list')) {
            squubsListDiv.classList.add('squubs-list');
        }

        return squubsListDiv;
    }

    const observeConfig = { attributes: 1, childList: 1, subtree: 1 }
    const observeDOM = (fn, e = document.documentElement, config = observeConfig) => {
        const observer = new MutationObserver(fn);
        observer.observe(e, config);
        return () => observer.disconnect();
    };

    observeDOM(sortSquubs);
})();