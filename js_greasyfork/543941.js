// ==UserScript==
// @name         YouTube - time travel with the upload date!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace upload year text on YouTube videos, settable via Tampermonkey menu
// @author       Teg219
// @license      MIT
// @match        https://www.youtube.com/watch*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/543941/YouTube%20-%20time%20travel%20with%20the%20upload%20date%21.user.js
// @updateURL https://update.greasyfork.org/scripts/543941/YouTube%20-%20time%20travel%20with%20the%20upload%20date%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_YEAR = 2009;


    async function getYear() {
        return await GM_getValue('currentYear', DEFAULT_YEAR);
    }


    async function setYear() {
        let currentYear = await getYear();
        let input = prompt('What year is it? (2006-2024)', currentYear);
        if (input === null) return; // cancelled
        input = parseInt(input);
        if (isNaN(input) || input < 2006 || input > 2024) {
            alert('Invalid year! Please enter a number between 2006 and 2024.');
            return;
        }
        await GM_setValue('currentYear', input);
        alert(`Year set to ${input}. Reload the page to apply changes.`);
        replaceUploadYear();
    }


    async function replaceUploadYear() {
        const currentYear = await getYear();
        const yearRegex = /\b(19|20)\d{2}\b/;

        const dateSpan = document.querySelector('#watch-uploader-info span.run-text');
        if (!dateSpan) return;

        const text = dateSpan.textContent;
        if (!text) return;

        const match = text.match(yearRegex);
        if (!match) return;

        const year = parseInt(match[0], 10);
        if (year >= currentYear) {
            const newText = text.replace(yearRegex, currentYear.toString());
            if (dateSpan.textContent !== newText) {
                dateSpan.textContent = newText;
            }
        }
    }


    replaceUploadYear();


    const observer = new MutationObserver(() => {
        replaceUploadYear();
    });
    observer.observe(document.body, { childList: true, subtree: true });


    GM_registerMenuCommand('What year is it?', setYear);
})();
