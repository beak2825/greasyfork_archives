// ==UserScript==
// @name         nCore Space Wasting Preventer
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Prevent unnecessary space wasting in nCore tables
// @author       You
// @match        *://ncore.pro/*
// @match        *://*.ncore.pro/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541030/nCore%20Space%20Wasting%20Preventer.user.js
// @updateURL https://update.greasyfork.org/scripts/541030/nCore%20Space%20Wasting%20Preventer.meta.js
// ==/UserScript==

/*
 * MIT License
 * 
 * Copyright (c) 2025
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
    'use strict';

    // Function to expand only the torrent names
    function expandTorrentNames() {
        // Make the nobr elements break normally and show full text
        const nobrElements = document.querySelectorAll('.torrent_txt nobr, .torrent_txt2 nobr');
        nobrElements.forEach(element => {
            element.style.whiteSpace = 'normal';
            element.style.wordBreak = 'break-word';
            element.style.overflow = 'visible';
            element.style.textOverflow = 'initial';
            
            // If this nobr contains a link, get the full title
            const link = element.querySelector('a');
            if (link && link.title && link.title.length > link.textContent.length) {
                element.textContent = link.title;
                // Keep the link functionality
                element.innerHTML = `<a href="${link.href}" onclick="${link.getAttribute('onclick') || ''}" title="${link.title}">${link.title}</a>`;
            }
        });

        // Target the actual torrent links and expand them
        const torrentLinks = document.querySelectorAll('.torrent_txt a, .torrent_txt2 a');
        torrentLinks.forEach(link => {
            if (link.title && link.title.length > link.textContent.length) {
                link.textContent = link.title;
            }
            link.style.whiteSpace = 'normal';
            link.style.wordBreak = 'break-word';
            link.style.overflow = 'visible';
            link.style.textOverflow = 'initial';
        });

        console.log('nCore torrent names expanded successfully!');
    }

    // Run the name expansion when the page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', expandTorrentNames);
    } else {
        expandTorrentNames();
    }

    // Also run after a short delay to catch any dynamically loaded content
    setTimeout(expandTorrentNames, 1000);

    // Add minimal CSS to only fix torrent name display
    const style = document.createElement('style');
    style.textContent = `
        /* Allow torrent names to wrap and show fully */
        .torrent_txt nobr, .torrent_txt2 nobr {
            white-space: normal !important;
            word-break: break-word !important;
            overflow: visible !important;
            text-overflow: initial !important;
        }
        
        .torrent_txt a, .torrent_txt2 a {
            white-space: normal !important;
            word-break: break-word !important;
            overflow: visible !important;
            text-overflow: initial !important;
            display: inline !important;
        }
    `;
    document.head.appendChild(style);

})();