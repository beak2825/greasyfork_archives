// ==UserScript==
// @name         Inject Games Link
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Injects a link to games.com on a specific page
// @author       Your Name
// @match        *://*/*  // Change this to the specific website you want to target
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515522/Inject%20Games%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/515522/Inject%20Games%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container for the injected HTML
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '20%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.padding = '20px';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid black';
    container.style.zIndex = '9999';
    container.style.textAlign = 'center';
    container.style.fontFamily = 'Arial, sans-serif';

    // Add HTML content to the container
    container.innerHTML = `
        <h1>Welcome to Games</h1>
        <p>Click the link below to visit Games.com:</p>
        <a href="https://www.games.com" target="_blank" style="text-decoration: none; color: blue; font-size: 24px;">Go to Games.com</a>
    `;

    // Append the container to the body
    document.body.appendChild(container);
})();
