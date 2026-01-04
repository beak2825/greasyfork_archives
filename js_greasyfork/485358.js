// ==UserScript==
// @name         Find this image on SauceNAO
// @namespace    http://t.me/therealkww/
// @version      2024-01-21
// @description  tries to find currently opened image on SauceNAO
// @author       kww
// @license      WTFPL
// @match        *://chan.sankakucomplex.com/*posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankakucomplex.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485358/Find%20this%20image%20on%20SauceNAO.user.js
// @updateURL https://update.greasyfork.org/scripts/485358/Find%20this%20image%20on%20SauceNAO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let stats = document.getElementById('stats');
    let h5Header = stats.nextElementSibling.firstChild.nextElementSibling; // works on my machine

    // Check if the h5 header exists
    if (h5Header) {
        // Get the next sibling element of the h5 header
        const nextElement = h5Header.nextElementSibling;

        // Check if the next sibling is a list (ul)
        if (nextElement.tagName.toLowerCase() === 'ul') {
            // Create a new list item and link
            let listItem = document.createElement('li');
            let linkTag = document.createElement('a');

            // Retrieve href attribute from <a> tag with id "lowres"
            let link = document.getElementById('lowres');
            let href;
            if (link) {
                href = link.getAttribute('href')
                linkTag.textContent = 'Find sauce by thumbnail';
                linkTag.setAttribute('href', `https://saucenao.com/search.php?db=999&dbmaski=32768&url=${encodeURIComponent(href)}`);
                linkTag.setAttribute('target', '_blank'); // open in new tab
                listItem.appendChild(linkTag);
                nextElement.appendChild(listItem);
            }

            // Create a new list item and link
            listItem = document.createElement('li');
            linkTag = document.createElement('a');

            // Retrieve href attribute from <a> tag with id "highres"
            link = document.getElementById('highres');
            if (link) {
                href = link.getAttribute('href')
                linkTag.textContent = 'Find sauce by source';
                linkTag.setAttribute('href', `https://saucenao.com/search.php?db=999&dbmaski=32768&url=${encodeURIComponent(href)}`);
                linkTag.setAttribute('target', '_blank'); // open in new tab
                listItem.appendChild(linkTag);
                nextElement.appendChild(listItem);
            }

            //else abort
        }
    }
})();