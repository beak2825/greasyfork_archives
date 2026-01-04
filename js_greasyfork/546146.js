// ==UserScript==
// @name         ERP Remove Watermark
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes fixed watermark div with specified styles
// @author       keney
// @match        *://*/*
// @connect      erpx.htran.ltd
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546146/ERP%20Remove%20Watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/546146/ERP%20Remove%20Watermark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove watermark
    function removeWatermark() {
        // Select all div elements
        const divs = document.getElementsByTagName('div');

        // Iterate through divs to find the watermark
        for (let div of divs) {
            const style = div.style;
            if (
                style.width === '100%' &&
                style.height === '100%' &&
                style.position === 'fixed' &&
                style.top === '0px' &&
                style.zIndex === '9999' &&
                style.pointerEvents === 'none' &&
                style.backgroundImage.includes('url(')
            ) {
                div.remove();
                console.log('Watermark removed');
                return; // Exit after removing the first matching watermark
            }
        }
    }

    // Run on page load
    window.addEventListener('load', removeWatermark);

    // Create an observer for dynamically added elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            removeWatermark();
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();