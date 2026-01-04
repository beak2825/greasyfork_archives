// ==UserScript==
// @name         Kemono Auto Load Pictures
// @namespace    http://tampermonkey.net/
// @version      2025-05-02
// @description  Load full-size images on Kemono by clicking a button.
// @author       okiseji
// @match        https://kemono.su/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514350/Kemono%20Auto%20Load%20Pictures.user.js
// @updateURL https://update.greasyfork.org/scripts/514350/Kemono%20Auto%20Load%20Pictures.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const loadButton = document.createElement('button');
    loadButton.id = 'load-button';
    loadButton.style.position = 'absolute'; // Changed from fixed to absolute
    loadButton.style.top = '0px';
    loadButton.style.right = '10px';
    loadButton.style.padding = '8px 16px'; // Added padding
    loadButton.style.backgroundColor = '#ff0000'; // Changed to red
    loadButton.style.color = '#fff';
    loadButton.style.border = 'none';
    loadButton.style.borderRadius = '4px'; // Changed to rounded rectangle
    loadButton.style.fontSize = '14px';
    loadButton.style.zIndex = '10000';
    loadButton.textContent = 'Load Full-Size Images'; // Changed button text
    loadButton.title = 'Load Images';
    loadButton.addEventListener('click', () => {
        const postBodies = document.querySelectorAll('div.post__body');
        postBodies.forEach(postBody => {
            const images = postBody.querySelectorAll('img');
            images.forEach(image => {
                const event = new Event('click', { bubbles: true });
                image.dispatchEvent(event);
            });
        });
    });

    const postBodies = document.querySelectorAll('div.post__body');

    document.body.appendChild(loadButton);
})();