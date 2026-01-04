// ==UserScript==
// @name        Wider Goodreads
// @description Goodreads, using all available width (for more usable bookshelves)
// @namespace   https://tripu.info/
// @version     0.1.1
// @include     https://goodreads.com/*
// @include     https://www.goodreads.com/*
// @license     MIT
// @supportURL  https://tripu.info/
// @author      tripu
// @downloadURL https://update.greasyfork.org/scripts/385620/Wider%20Goodreads.user.js
// @updateURL https://update.greasyfork.org/scripts/385620/Wider%20Goodreads.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

console.debug('[Wider Goodreads] Start');

(() => {
    'use strict';
    if (document && document.getElementsByTagName && document.createElement) {
        var head = document.getElementsByTagName('head');
        if (head && 1 === head.length) {
            const style = document.createElement('style');
            head = head[0];
            style.innerText = `
                div.mainContent,
                div.mainContentFloat,
                div#leadercol {
                    width: 99%;
                }
                div#columnContainer {
                    width: 99%;
                }
                div#leftCol {
                    width: 19%;
                }
                div#rightCol {
                    width: 79%;
                }
            `;
            head.appendChild(style);
            console.debug('[Wider Goodreads] ✓ Done');
        } else {
            console.debug('[Wider Goodreads] ✗ No head');
        }
    } else {
        console.debug('[Wider Goodreads] ✗ No document');
    }
})();

console.debug('[Wider Goodreads] End');
