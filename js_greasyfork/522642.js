// ==UserScript==
// @name         Ultimate-Guitar No BS
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Display only the <pre> block on Ultimate Guitar
// @author       You
// @match        *://tabs.ultimate-guitar.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522642/Ultimate-Guitar%20No%20BS.user.js
// @updateURL https://update.greasyfork.org/scripts/522642/Ultimate-Guitar%20No%20BS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the DOM to fully load
    window.addEventListener('load', () => {
        // Select the <pre> block
        const preBlock = document.querySelector('pre');

        if (preBlock) {
            // Clear the body content
            document.body.innerHTML = '';

            // Create a container for the <pre> block
            const newPreContainer = document.createElement('div');
            newPreContainer.style.margin = '0';
            newPreContainer.style.padding = '10px';
            newPreContainer.style.backgroundColor = '#f4f4f4';
            newPreContainer.style.color = 'black';
            newPreContainer.style.fontFamily = 'monospace';
            newPreContainer.style.fontSize = '16px';

            // Set all <span> elements inside <pre> to black
            preBlock.querySelectorAll('span').forEach(span => {
                span.style.color = 'black';
            });

            // Clone and append the modified <pre> block
            newPreContainer.appendChild(preBlock.cloneNode(true));
            document.body.appendChild(newPreContainer);

            console.log('Page simplified to display only the <pre> block.');
        } else {
            console.warn('No <pre> block found on this page.');
        }
    });
})();
