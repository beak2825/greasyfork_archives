// ==UserScript==
// @name         JPDB Link Remover
// @namespace    uchisen.com
// @version      2024-11-04
// @description  If you're using JPDBreader to review from the a vocab page in JPDB on mobile, tapping on a word to bring up the overlay causes the link to be followed. This script removes links from all JPDB deck pages. If you only want links removed from the All Vocab page, replace "https://jpdb.io/deck*" on line 6 with "https://jpdb.io/deck?id=gloabl"
// @author       Togeffet
// @match        https://jpdb.io/deck*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515829/JPDB%20Link%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/515829/JPDB%20Link%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const vocabulary = document.getElementsByClassName('vocabulary-spelling');

    for (let i = 0; i < vocabulary.length; i++) {
        const link = vocabulary[i].getElementsByTagName('a')[0];

        link.removeAttribute('href'); // Remove link
        link.style.cursor = "default"; // Change cursor to default (just felt better imo)
        link.style.borderBottom = 'none'; // Remove link border on hover, since it's not a link anymore
    }
})();