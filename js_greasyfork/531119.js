// ==UserScript==
// @name         Anime 85s Skip Button
// @namespace    https://greasyfork.org/en/scripts/
// @version      1.0
// @description  Adds a button to skip ahead by 85 seconds on supported anime streaming sites.
// @author       YourName
// @license      MIT
// @match        *://*.gogoanime.*/*
// @match        *://*.9anime.*/*
// @match        *://*.animepahe.*/*
// @match        *://*.animixplay.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531119/Anime%2085s%20Skip%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/531119/Anime%2085s%20Skip%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSkipButton() {
        let video = document.querySelector('video');
        if (!video) return;

        let button = document.createElement('button');
        button.innerText = 'Skip 85s';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 15px';
        button.style.fontSize = '14px';
        button.style.background = 'red';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '5px';

        button.addEventListener('click', () => {
            if (video) {
                video.currentTime += 85;
            }
        });

        document.body.appendChild(button);
    }

    window.addEventListener('load', addSkipButton);
})();
