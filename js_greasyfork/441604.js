// ==UserScript==
// @name         Reposition Recently Uploaded Chip
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Repositions the "Recently Uploaded" chip to the front
// @author       RadicalDowntownUrbanite
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441604/Reposition%20Recently%20Uploaded%20Chip.user.js
// @updateURL https://update.greasyfork.org/scripts/441604/Reposition%20Recently%20Uploaded%20Chip.meta.js
// ==/UserScript==

/**
 * Originally I wanted to hook unto the pushState of the site to check for the
 * position of the Recently Uploded chip, however YT uses some secret sauce I
 * am not familiar with to change page state which makes it difficult to hook
 * into it without just polling the url. Instead I use a mutation observer to
 * trigger whenever the DOM of the site changes and then update the position
 * of the Recently Uploaded chip if it's present on the page.
 */
(function() {
    'use strict';

    function debounce(func) {
        let timer;

        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), 300);
        };
    }

    /**
     * Debounce the mutation observer callback because the MO can really thrash while the page is loading.
     * This will result in a slight delay before the RU chip is moved but won't affect page load performance either.
     */
    const updateRecentlyUploaded = debounce((mutations, me) => {
        if (!window.location.pathname === '/') {
            //console.debug(`=========== Not on main url ${window.location.href}`)
            return ;
        }

        const chips = [...document.querySelectorAll('iron-selector.ytd-feed-filter-chip-bar-renderer yt-chip-cloud-chip-renderer')];

        if (chips.length === 0) {
            //console.debug('=========== No chips');
            return;
        }

        const index = chips.findIndex(chip => chip.innerText === 'Recently uploaded')

        if (index > 1) {
            //console.debug('=========== Recently uploaded found and not first index');
            const chip = chips[index];
            const parent = chip.parentNode;
            parent.removeChild(chip);
            parent.prepend(chip);
         //} else if (index === 0) {
            //console.debug('=========== Recently uploaded already at first position');
         //} else {
            //console.debug('=========== Recently uploaded chip not found');
        }
    });

    // set up the mutation observer
    const observer = new MutationObserver(updateRecentlyUploaded);

    // start observing
    observer.observe(document, {
        childList: true,
        subtree: true
    });

})();