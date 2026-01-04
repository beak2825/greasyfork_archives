// ==UserScript==
// @name         Moon Client Beta (eine Werbung)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license MIT
// @description  Adds a button to join a Discord server
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/504980/Moon%20Client%20Beta%20%28eine%20Werbung%29.user.js
// @updateURL https://update.greasyfork.org/scripts/504980/Moon%20Client%20Beta%20%28eine%20Werbung%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button element
    const button = document.createElement('button');
    button.textContent = 'Join Moon Client Discord Server to access beta testing of moonclient';
    button.style.position = 'fixed';
    button.style.left = '50%';
    button.style.top = '50%';
    button.style.transform = 'translate(-50%, -50%)';
    button.style.width = '80vw';  // 80% of the viewport width
    button.style.height = '10vh';  // 10% of the viewport height
    button.style.backgroundColor = '#7289da'; // Discord color
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.fontSize = '1.5em';
    button.style.textAlign = 'center';
    button.style.lineHeight = '10vh'; // Vertically center text
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';
    button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)'; // Optional shadow for better visibility
    button.style.fontFamily = '"Rightenious", sans-serif'; // Apply the Rightenious font

    // Add click event to redirect to Discord server
    button.addEventListener('click', () => {
        window.location.href = 'https://discord.gg/u6HkBJYnxY';
    });

    // Append button to the body
    document.body.appendChild(button);

    // Optional: Add some CSS for better appearance
    GM_addStyle(`
        @font-face {
            font-family: 'Rightenious';
            src: url('<font-url>.woff2') format('woff2'),
                 url('<font-url>.woff') format('woff');
            font-weight: normal;
            font-style: normal;
        }

        button:hover {
            background-color: #5b6eae;
        }
    `);
})();
