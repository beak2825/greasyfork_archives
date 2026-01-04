// ==UserScript==
// @name         Reddit Configurable Comment Sorter
// @namespace    https://example.com/
// @version      2.2
// @description  Redirects Reddit posts to sort comments with user-configurable sort order (default: top).
// @author       diggerman987654321
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544549/Reddit%20Configurable%20Comment%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/544549/Reddit%20Configurable%20Comment%20Sorter.meta.js
// ==/UserScript==

/* jshint esversion: 10 */
/* jshint -W014 */

const redditPostRegex = /^https:\/\/www\.reddit\.com\/r\/[A-Za-z0-9][A-Za-z0-9_]{2,20}\/comments\/[a-zA-Z0-9]+/;
const isSortedRegex = /[?&]sort=/;
let currentUrl = null;

const sortOptions = {
    none: 'none',
    confidence: 'confidence',
    best: 'confidence',
    hot: 'hot',
    top: 'top',
    new: 'new',
    controversial: 'controversial',
    old: 'old',
    random: 'random',
    qa: 'qa'
};

const availableOptions = Object.keys(sortOptions).join(', ');

const defaultSortOrder = 'top';

async function getSortOrder() {
    try {
        return await GM.getValue('reddit_sort_order', defaultSortOrder);
    }
    catch (error) {
        console.error('Error getting sort order:', error);
        return defaultSortOrder;
    }
}

async function setSortOrder(sortOrder) {
    try {
        await GM.setValue('reddit_sort_order', sortOrder);
    }
    catch (error) {
        console.error('Error setting sort order:', error);
    }
}

function registerSortMenuCommands() {
    GM.registerMenuCommand('Change comment sort order', async () => {
        let userInput = prompt('Enter sort option:');

        if (userInput === null) {
            // User cancelled the prompt
            return;
        }

        userInput = userInput.trim().toLowerCase();

        if (userInput !== '' && sortOptions.hasOwnProperty(userInput)) {
            const sortValue = sortOptions[userInput];
            await setSortOrder(sortValue);
            alert(`Comment sort order changed to: ${userInput}`);
        }
        else {
            alert(`Invalid sort option. Available options: ${availableOptions}`);
        }
    });

    GM.registerMenuCommand('Disable manual sorting (uses Reddit\'s default)', async () => {
        await setSortOrder('none');
        alert('Comment sorting disabled');
    });

    GM.registerMenuCommand('Show current sort order', async () => {
        const currentSort = await getSortOrder();
        alert(`Current comment sort order: ${currentSort}`);
    });
}

function isCommentPermalink(url) {
    try {
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split('/').filter(segment => segment !== '');
        return pathSegments.length > 5;
    }
    catch {
        return false;
    }
}

function isRedditPostNotSorted(redditUrl) {
    return !isSortedRegex.test(redditUrl) && redditPostRegex.test(redditUrl);
}

async function redirectIfRedditPostNotSorted() {
    if (window.location.href === currentUrl) {
        return;
    }

    currentUrl = window.location.href;

    if (isRedditPostNotSorted(currentUrl)) {
        const sortOrder = await getSortOrder();

        // Don't sort if user has selected 'none'
        if (sortOrder === 'none') {
            return;
        }

        const appendChar = currentUrl.includes('?') ? '&' : '?';
        const sortParams = isCommentPermalink(currentUrl)
            ? `force-legacy-sct=1&sort=${sortOrder}`
            : `sort=${sortOrder}`;
        window.location.replace(`${currentUrl}${appendChar}${sortParams}`);
    }
}

(function() {
    'use strict';

    registerSortMenuCommands();

    redirectIfRedditPostNotSorted();

    const observer = new MutationObserver(redirectIfRedditPostNotSorted);
    observer.observe(document.head, {
        childList: true,
        subtree: true
    });

    window.addEventListener('popstate', redirectIfRedditPostNotSorted);

    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        redirectIfRedditPostNotSorted();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        redirectIfRedditPostNotSorted();
    };
})();
