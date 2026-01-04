// ==UserScript==
// @name         JK Rowling to Terf
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Change JK Rowling and J.K. Rowling to Transphobic TERF on all webpages
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461733/JK%20Rowling%20to%20Terf.user.js
// @updateURL https://update.greasyfork.org/scripts/461733/JK%20Rowling%20to%20Terf.meta.js
// ==/UserScript==


(function() {
    'use strict';
    document.body.innerHTML = document.body.innerHTML.replace(/JK Rowling|J\.K\. Rowling/g, 'TERF');
})();