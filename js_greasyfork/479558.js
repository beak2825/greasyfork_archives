// ==UserScript==
// @name         Weibo Purifier
// @namespace    http://tampermonkey.net/weibo-purifier
// @version      20231112
// @description  Purify your Weibo
// @author       Tadokoro Kouji
// @match        https://weibo.com/*
// @license      MIT
// @grant        GM_log
// @require      https://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @downloadURL https://update.greasyfork.org/scripts/479558/Weibo%20Purifier.user.js
// @updateURL https://update.greasyfork.org/scripts/479558/Weibo%20Purifier.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    const black_list = [];
    waitForKeyElements(".vue-recycle-scroller__item-view", function() {
        // remove_by_blacklist(black_list);
        remove_by_pattern();
    });
})();

function remove_by_blacklist(black_list) {
    const feeds = document.querySelectorAll('.vue-recycle-scroller__item-view').forEach(e => {
        const htmlString = e.outerHTML;
        if (isAnyBlacklistIdInHTML(htmlString, black_list, true)) {
            e.remove();
        }
    });
}

function isAnyBlacklistIdInHTML(targetString, idsArray, verbose = false) {
    for (const id of idsArray) {
        const substring = `<span title="${id}">${id}</span>`;
        if (targetString.includes(substring)) {
            if (verbose) {
                GM_log(`Removing: ${id}`);
            }
            return true;
        }
    }
    return false;
}

function remove_by_pattern(verbose = false) {
    const feeds = document.querySelectorAll('.vue-recycle-scroller__item-view').forEach(e => {
        const htmlString = e.outerHTML;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        const links = tempDiv.querySelectorAll('a.ALink_default_2ibt1[aria-label]');
        let toRemove = false;
        links.forEach(link => {
            const ariaLabelValue = link.getAttribute('aria-label');
            // Perform your checks here...
            // If some condition is met, set toRemove to true
            if (judge_pattern(ariaLabelValue, true)) {
                toRemove = true;
                if (verbose) {
                    GM_log(`Removing: ${ariaLabelValue}`);
                }
            }
        });
        if (toRemove) {
            e.remove();
        }
    });
}

function judge_pattern(id, verbose = false) {
    const id_separated = Array.from(new Intl.Segmenter('cn', { granularity: 'word' }).segment(id));

    // Extract the "segment" property from each object in the array
    const segments = id_separated.map(entry => entry.segment);

    let match = false;
    if (segments.length === 2) {
        // Check condition for length 2: [4][3]
        match = segments[0].length === 4 && segments[1].length === 3;
    } else if (segments.length === 3) {
        // Check condition for length 3: [2][2][3]
        match = segments[0].length === 2 && segments[1].length === 2 && segments[2].length === 3;
    }

    if (verbose) {
        GM_log(`ID ${id} -> ${JSON.stringify(segments)}: ${match + ''}`);
    }

    return match;
}