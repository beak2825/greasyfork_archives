// ==UserScript==
// @name          JustWatch - Search Improvements and Watchlist Item Hider
// @description   Improved search efficiency and hiding of watchlist items
// @author        TheRealHawk
// @license       MIT
// @namespace     https://greasyfork.org/en/users/18936-therealhawk
// @match         https://www.justwatch.com/*
// @version       1.14
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533252/JustWatch%20-%20Search%20Improvements%20and%20Watchlist%20Item%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/533252/JustWatch%20-%20Search%20Improvements%20and%20Watchlist%20Item%20Hider.meta.js
// ==/UserScript==

/* globals $ */

(function() {
    'use strict';

    GM_addStyle(`
        #searchbar-input {
            color: black !important;
            background: white !important;
        }
        #searchbar-input:focus {
            color: black !important;
        }
    `);

    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    function enhanceSearchBar() {
        const $searchBar = $('#searchbar-input');
        if ($searchBar.length && !$searchBar.hasClass('jw-enhanced')) {
            $searchBar.addClass('jw-enhanced');
            $searchBar.on('click', function() {
                $(this).select();
            });
        }
    }

    // State tracking for the auto-scroll mechanic
    let isAutoScrolling = false;
    let savedScrollPos = 0;

    function hideWatchlistItems() {
        const $watchedItems = $('.title-poster-quick-actions-content__bubbles__item--selected svg[data-icon="bookmark"]');
        $watchedItems.closest('[data-testid="titleItem"]').hide();
        
        // Check if we need to load more or if we can restore position
        manageInfiniteScroll();
    }

    function manageInfiniteScroll() {
        const scrollThreshold = window.innerHeight * 2;
        const currentHeight = document.documentElement.scrollHeight;

        // Condition 1: The page has enough content (more than 2 screens worth)
        if (currentHeight > scrollThreshold) {
            // If we were forcing a scroll, we can now safely go back to the user's position
            if (isAutoScrolling) {
                window.scrollTo(0, savedScrollPos);
                isAutoScrolling = false;
            }
            return;
        }

        // Condition 2: The page is too short (we need more items)
        // If we aren't already managing a scroll, save the user's spot
        if (!isAutoScrolling) {
            savedScrollPos = window.scrollY;
            isAutoScrolling = true;
        }

        // Jump to bottom to trigger JustWatch's loader
        window.scrollTo(0, document.body.scrollHeight);
        window.dispatchEvent(new CustomEvent('scroll'));
    }

    // Run once on load
    hideWatchlistItems();

    const observer = new MutationObserver(debounce(() => {
        enhanceSearchBar();
        hideWatchlistItems(); 
    }, 200));

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
