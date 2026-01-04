// ==UserScript==
// @name         Google Search Result Clean
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.12
// @description  Remove "People also ask", "Featured Snippets", "Video", "Image", "Searches related to ...", "Twitter", etc. Remove naive websites.
// @homepage     https://greasyfork.org/zh-CN/scripts/393699
// @author       Saisai Lu
// @match        https://*.google.com/search*
// @downloadURL https://update.greasyfork.org/scripts/393699/Google%20Search%20Result%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/393699/Google%20Search%20Result%20Clean.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove naive and annoying websites.
    // Comment this out, use uBlacklist instead
    /*
    let hostsToBlock = ['www.w3schools.com', 'www.asciitable.com', 'www.dba-oracle.com', 'www.geeksforgeeks.org', 'www.tutorialspoint.com'];
    document.querySelectorAll('.g').forEach(result => {
        let a = result.querySelector('a');
        if (a && hostsToBlock.includes(a.host)) {
            result.remove();
        }
    });
    */

    // remove 'Featured Snippets'
    let firstLine = document.querySelector('.g')
    firstLine.querySelectorAll('a').forEach(link => {
        if (link.textContent == 'About Featured Snippets') {
            firstLine.remove();
        }
    });

    let resultLines = document.querySelectorAll('div#search>div>div>div');

    resultLines.forEach(resultLine => {
        resultLine.querySelectorAll('span').forEach(span => {
            //console.log(span.textContent);
            if (span.textContent == 'People also ask') {
                resultLine.remove();
            }
        });

        resultLine.querySelectorAll('a').forEach(span => {
            //console.log(span.textContent);
            if (span.textContent == 'About featured snippets') {
                resultLine.remove();
            }
        });

        resultLine.querySelectorAll('h3').forEach(span => {
            //console.log(span.textContent);
            if (span.textContent == 'Videos') {
                resultLine.remove();
            }
        });

        resultLine.querySelectorAll('span').forEach(span => {
            if (span.textContent == 'View on Twitter') {
                resultLine.remove();
            }
        });

        resultLine.querySelectorAll('img').forEach(span => {
            resultLine.remove();
        });

    });

    // remove "Searches related to ..."
    let relatedSearches = document.getElementById('bres');
    if (relatedSearches != null) relatedSearches.remove();
})();
