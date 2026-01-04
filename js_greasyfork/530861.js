// ==UserScript==
// @name         Click Counter Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A button that counts clicks 
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530861/Click%20Counter%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/530861/Click%20Counter%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button element
    const button = document.createElement('button');
    button.innerText = '0';
    button.style.fontSize = '24px';
    button.style.padding = '10px 20px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    // Click event listener
    let clickCount = 0;
    button.addEventListener('click', function() {
        clickCount++;
        button.innerText = clickCount;

        // Check if click count reaches 1000
        if (clickCount === 1000) {
            // Open YouTube video
            window.open('https://www.youtube.com/embed/NVLAPYx0dc8?', '_blank');

            // Alert message after video ends
            setTimeout(() => {
                alert("Wow! You reached 1000 clicks!!");
            }, 10000); // Assuming the video is approximately 10 seconds long
        }
    });
})();
