// ==UserScript==
// @name         YoutTube Thumbnail Image Resolution Selector with Buttons
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Add buttons for all resolutions when retrieving YouTube thumbnail images
// @author       satandidnowrong
// @match        https://i.ytimg.com/*
// @grant        none
// @license      Creative Commons Attribution-NonCommercial 4.0 International License
// @downloadURL https://update.greasyfork.org/scripts/489682/YoutTube%20Thumbnail%20Image%20Resolution%20Selector%20with%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/489682/YoutTube%20Thumbnail%20Image%20Resolution%20Selector%20with%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const parts = window.location.pathname.split('/');
    const newX = 'vi';
    const newY = parts[2];

    const resolutions = [
        "maxresdefault.jpg",
        "sddefault.jpg",
        "hqdefault.jpg",
        "mqdefault.jpg",
        "default.jpg",
        "hq720.jpg"
    ];

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.position = 'fixed';
    buttonsContainer.style.top = '10px';
    buttonsContainer.style.left = '10px';
    document.body.appendChild(buttonsContainer);

    resolutions.forEach(resolution => {
        const button = document.createElement('button');
        button.textContent = resolution.split('.')[0].toUpperCase();
        button.onclick = () => {
            const newUrl = `https://i.ytimg.com/${newX}/${newY}/${resolution}`;
            window.location.href = newUrl;
        };
        buttonsContainer.appendChild(button);
    });
})();
