// ==UserScript==
// @name         Scryfall copy URLs
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Copy all URLs from a scryfall search result once loaded
// @author       Aviem Zur
// @match        https://scryfall.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420549/Scryfall%20copy%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/420549/Scryfall%20copy%20URLs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var copyTextareaBtn = document.createElement("TEXTAREA");

    copyTextareaBtn.addEventListener('click', function(event) {
        copyTextareaBtn.focus();
        copyTextareaBtn.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
    });

    var urls = [].slice.call(document.getElementsByClassName('card-grid-item-card')).map(function(obj){ return obj.href }).join('\n');

    copyTextareaBtn.value = urls;
    copyTextareaBtn.maxLength = 1000;

    var top_paragraph = document.getElementsByClassName('search-summary-english')[0].parentNode;

    top_paragraph.appendChild(document.createElement("BR"));
    top_paragraph.appendChild(document.createElement("BR"));
    top_paragraph.appendChild(copyTextareaBtn);
})();