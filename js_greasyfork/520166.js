// ==UserScript==
// @name         Kobo-Link-to-Book-Sites
// @namespace    https://github.com/edsantiago/greasemonkey
// @version      0.2
// @description  Adds buttons on kobo.com book pages linking to GR/Hardcover
// @match        https://*.kobo.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520166/Kobo-Link-to-Book-Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/520166/Kobo-Link-to-Book-Sites.meta.js
// ==/UserScript==

/*
** Changelog:
**
** 2024-12-08  0.2  roughly working implementation
**
** 2024-12-08  0.1  stolen shamelessly from SirGryphin's Open in Goodreads
**                  https://greasyfork.org/en/scripts/470655-open-in-goodreads
*/

(function () {
    'use strict';

    function findisbn() {
        const metadata = document.getElementsByClassName('bookitem-secondary-metadata');
        if (metadata) {
            if (metadata[0].innerText.includes('eBook Details')) {
                var match = metadata[0].innerText.match(/Book ID:\s+(\d+)/);
                if (match && match[1]) {
                    return match[1];
                }
            }
        }
        console.log("findisbn(): no joy");
        return;
    }

    function makeButton(siteName, bgColor, Url) {
        const button = document.createElement('a');
        button.innerText = `Open in ${siteName}`;
        button.style.cssText = `
                        margin: 10px auto;
                        display: block;
                        color: #ffffff;
                        background-color: ${bgColor};
                        border: none;
                        border-radius: 4px;
                        padding: 8px 12px;
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        font-weight: bold;
                        cursor: pointer;
                    `;
        button.href = Url;
        button.target = '_blank';

        return button;
    }

    function addButton(mainimage) {
        // Make sure page is for a book and includes ISBN
        var isbn = findisbn();
        if (! isbn) {
            return;
        }

        const centerDiv = document.createElement('div');
        centerDiv.style.textAlign = 'center';
        centerDiv.appendChild(makeButton('Goodreads', '#377458', `https://www.goodreads.com/book/isbn?isbn=${isbn}`));

        centerDiv.appendChild(makeButton('Hardcover', '#4338ca', `https://hardcover.app/search?q=${isbn}&type=Books`));

        mainimage.parentNode.insertBefore(centerDiv, mainimage.nextSibling);
    }

    // Observer to detect when the target elements are available
    const observer = new MutationObserver(() => {
        const mainimage = document.getElementsByClassName('main-product-image');

        if (mainimage) {
            addButton(mainimage[0]);
            observer.disconnect(); // Stop observing once the button is added
        }
    });

    // Start observing for changes in the DOM
    observer.observe(document.body, { childList: true, subtree: true });
})();
