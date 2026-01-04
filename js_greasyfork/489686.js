// ==UserScript==
// @name         Quotientapp_ Show Phone Number
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extracts value from second selector on newly opened page and appends it to target div element
// @author       You
// @match        https://go.quotientapp.com/q/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489686/Quotientapp_%20Show%20Phone%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/489686/Quotientapp_%20Show%20Phone%20Number.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Get the link from the first selector
    const firstLink = document.querySelector('#zBody > form > div > div > div.quoteCanvas-page > div.quote-detail.qCustomCssBlock.quote-detail-inline > div:nth-child(1) > div > span > a:nth-child(2)');
    const link = firstLink ? firstLink.href : document.querySelector('#zBody > form > div > div > div.quoteCanvas-page > div.quote-detail.qCustomCssBlock.quote-detail-inline > div:nth-child(1) > div > span > a');

    const newWindow = window.open(link);

    newWindow.addEventListener('load', () => {
        // Get the div element with the class "quote-detail-val" inside the div element with the class "contact-right-col"
        const divElement = newWindow.document.querySelector('.contact-right-col .quote-detail-val');
        // Check if the div element exists
        if (divElement !== null) {
            // Get the anchor element inside the div element
            const anchorElement = divElement.querySelector('a');
            // Get the value from the href attribute of the anchor element
            const value = anchorElement.getAttribute('href');
            // Close the new window
            newWindow.close();
            // Get the target div element
            const targetDiv = document.querySelector('#zBody > div:nth-child(6) > div.bg-slate-100.border-b.border-slate-200.pt-3.pb-3 > div > div > div.relative.w-full.md\\:w-1\\/3.md\\:mr-10.mb-5.md\\:mb-0 > div > div:nth-child(2) > div > div > div.leading-5.flex-1.overflow-hidden');
            // Append the value to the target div element
            targetDiv.appendChild(document.createTextNode(value));
        } else {
            // Set the value to "No phone number"
            const value = "No phone number";
            // Close the new window
            newWindow.close();
            // Get the target div element
            const targetDiv = document.querySelector('#zBody > div:nth-child(6) > div.bg-slate-100.border-b.border-slate-200.pt-3.pb-3 > div > div > div.relative.w-full.md\\:w-1\\/3.md\\:mr-10.mb-5.md\\:mb-0 > div > div:nth-child(2) > div > div > div.leading-5.flex-1.overflow-hidden');
            // Append the value to the target div element
            targetDiv.appendChild(document.createTextNode(value));
        }
    });
})();

