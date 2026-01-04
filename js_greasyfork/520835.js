// ==UserScript==
// @name         Spam Image Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to spam an image all over the current website.
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520835/Spam%20Image%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/520835/Spam%20Image%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button
    const button = document.createElement('button');
    button.textContent = 'Click Me';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = '10000';
    button.style.padding = '10px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // Append the button to the body
    document.body.appendChild(button);

    // Image URL
    const imageUrl = 'https://i.ibb.co/x1fxQM0/IMG-0261.png';

    // Function to spam the image
    button.addEventListener('click', () => {
        for (let i = 0; i < 20; i++) { // Adjust the number of images if needed
            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.position = 'absolute';
            img.style.zIndex = '9999';
            img.style.width = '100px';
            img.style.height = '100px';
            img.style.top = `${Math.random() * window.innerHeight}px`;
            img.style.left = `${Math.random() * window.innerWidth}px`;
            document.body.appendChild(img);
        }
    });
})();
