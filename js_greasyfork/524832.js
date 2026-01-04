// ==UserScript==
// @name         Makes the Attack-Links clickable.
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes the attack-links clickable.
// @author       Grance [3487987]
// @match        *://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524832/Makes%20the%20Attack-Links%20clickable.user.js
// @updateURL https://update.greasyfork.org/scripts/524832/Makes%20the%20Attack-Links%20clickable.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to convert div into a clickable link
    function convertDivToLink() {
        //console.log("convertDivToLink triggered at", new Date().toISOString());

        const divs = document.querySelectorAll('div.available___xegv_');
        //console.log(`Found ${divs.length} div(s) with class 'available___xegv_'`);

        divs.forEach((div, index) => {
            //console.log(`Processing div #${index + 1}:`, div.textContent);

            if (div.textContent.includes('https://') && !div.dataset.linkConverted) {
                //console.log("Div contains a URL and hasn't been processed.");

                const urlMatch = div.textContent.match(/https:\/\/www\.torn\.com\/loader\.php\?sid=attack&user2ID=\d+/);
                if (urlMatch) {
                    const url = urlMatch[0];
                    const text = div.textContent.replace(url, '').trim();

                    //console.log(`URL: ${url}, Remaining Text: "${text}"`);

                    const link = document.createElement('a');
                    link.href = url;
                    link.textContent = `${text} Available`;
                    link.style.color = 'inherit';
                    link.style.textDecoration = 'none';
                    link.target = '_blank';

                    div.innerHTML = '';
                    div.appendChild(link);
                    div.dataset.linkConverted = 'true';

                    //console.log("Div converted to clickable link:", div.innerHTML);
                } else {
                    //console.warn("No valid URL found in the div.");
                }
            } else {
                //console.log("Div does not contain a URL or was already processed.");
            }
        });
    }

    // Observe the page for dynamic content
    const observer = new MutationObserver((mutations) => {
        //console.log("MutationObserver triggered:", mutations);
        convertDivToLink();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    //console.log("MutationObserver started.");

    // Run conversion immediately after page load
    window.addEventListener('load', () => {
        //console.log("Page loaded. Initializing link conversion...");
        convertDivToLink();
    });
})();
