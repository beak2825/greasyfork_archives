// ==UserScript==
// @name         Mini Browser Window
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a mini browser window with a customizable popup for changing the displayed website.
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493398/Mini%20Browser%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/493398/Mini%20Browser%20Window.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the mini window container
    const miniWindow = document.createElement('div');
    miniWindow.style.position = 'fixed';
    miniWindow.style.bottom = '10px';
    miniWindow.style.right = '10px';
    miniWindow.style.width = '300px';
    miniWindow.style.height = '200px';
    miniWindow.style.border = '1px solid #ccc';
    miniWindow.style.overflow = 'hidden';
    document.body.appendChild(miniWindow);

    // Create the iframe inside the mini window
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.example.com'; // Default website URL
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    miniWindow.appendChild(iframe);

    // Create the popup input for customizing the website URL
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter website URL';
    input.style.width = '100%';
    input.style.marginTop = '10px';
    miniWindow.appendChild(input);

    // Create the button to update the website
    const button = document.createElement('button');
    button.innerText = 'Update Website';
    button.style.width = '100%';
    button.style.marginTop = '10px';
    miniWindow.appendChild(button);

    // Add click event listener to update the iframe URL
    button.addEventListener('click', () => {
        const newUrl = input.value.trim();
        if (newUrl) {
            iframe.src = newUrl;
        }
    });
})();
