// ==UserScript==
// @name         Nexusmods without Ratings
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Removes endorsements and download counts from all mods for unbiased browsing.
// @license      MIT
// @author       AeonOfTime
// @match        https://www.nexusmods.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514134/Nexusmods%20without%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/514134/Nexusmods%20without%20Ratings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = init();

    function init()
    {
        console.log('RemoveEndorsements | Initializing.');

        const observer = new MutationObserver((mutationList, observer) => {
            removeRatings();
        });

        // Use an observer to react to changes in the page structure:
        // We use this to handle AJAX-based page changes like switching
        // tabs on the mod page, so we can remove elements in the
        // dynamically loaded content.
        observer.observe(
            document.getElementsByTagName('BODY')[0],
            {
                attributes: false,
                childList: true,
                subtree: true
            }
        );

        removeRatings();
    }

    function removeRatings()
    {
        console.log("RemoveEndorsements | Hiding elements.");

        removeBySelector('.stat-endorsements');
        removeBySelector('.stat-uniquedls');
        removeBySelector('.stat-totaldls');
        removeBySelector('.stat-totalviews');
        removeBySelector('.endorsecount');
        removeBySelector('.downloadcount');
    }

    function removeBySelector(selector)
    {
        const elements = document.querySelectorAll(selector);
        for(let i=0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
    }
})();