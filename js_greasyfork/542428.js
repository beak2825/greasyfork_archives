// ==UserScript==
// @name         X.com to VXTwitter Simple Replacer
// @namespace    http://tampermonkey.net/
// @version      2025-07-13
// @description  Replaces x.com/twitter.com links with vxtwitter.com when copying a post link.
// @author       CrimsonTomato
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542428/Xcom%20to%20VXTwitter%20Simple%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/542428/Xcom%20to%20VXTwitter%20Simple%20Replacer.meta.js
// ==/UserScript==

// Source code: https://github.com/CrimsonTomato/QOLTampering/blob/main/Twitter/shareReplacer.js
/* jshint esversion: 8 */

(function() {
    'use strict';
    // Replace REPLACEMENT_DOMAIN with your domain of choice
    const REPLACEMENT_DOMAIN = 'vxtwitter.com';

    // This function checks clipboard content and replaces the domain.
    async function modifyClipboard() {
        try {
            // 1. Read the original text from the clipboard.
            // 2. Use .trim() to remove any leading/trailing whitespace, including newlines.
            const originalText = (await navigator.clipboard.readText()).trim();

            // Use a regular expression to find and replace the domain
            const newText = originalText.replace(/(x\.com|twitter\.com)/, REPLACEMENT_DOMAIN);

            // Only write to clipboard if a change was made
            if (originalText !== newText) {
                await navigator.clipboard.writeText(newText);
                console.log(`Tampermonkey: Replaced link in clipboard -> ${newText}`);
            }
        } catch (err) {
            // This can happen if the clipboard is empty or access is denied.
            console.error('Tampermonkey: Failed to read/write clipboard.', err);
        }
    }

    // Listen for clicks on the entire document to catch the share menu actions.
    document.addEventListener('click', (event) => {
        // The "Copy link" button is a div with role="menuitem" containing specific text.
        const menuItem = event.target.closest('div[role="menuitem"]');
        if (menuItem && menuItem.textContent.includes('Copy link')) {
            // A short delay ensures the site's original copy action finishes first.
            setTimeout(modifyClipboard, 100);
        }
    }, true); // Use capture phase for reliability.

})();