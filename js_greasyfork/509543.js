// ==UserScript==
// @name         Change miniblox.io wallpaper(gif possible)
// @namespace    http://tampermonkey.net/
// @description  Replace wallpaper
// @author       Vicky_arut
// @match        https://miniblox.io/*
// @grant        none
// @run-at       document-end
// @license      Redistribution prohibited
// @version 0.0.1.20240921150018
// @downloadURL https://update.greasyfork.org/scripts/509543/Change%20minibloxio%20wallpaper%28gif%20possible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/509543/Change%20minibloxio%20wallpaper%28gif%20possible%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // new wallpaper (gif possible!!)
    const newImageUrl = 'https://c4.wallpaperflare.com/wallpaper/458/277/191/eminem-screensavers-and-backgrounds-wallpaper-preview.jpg';

    // MutationObserver
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            // get image tags
            const images = document.querySelectorAll('img');

            images.forEach((img) => {
                if (img.src.includes('/assets/default-92b37f60.png')) {
                    img.src = newImageUrl; // replace image
                }
            });

            // change wallpaper
            const backgroundElements = document.querySelectorAll('[style*="default-92b37f60.png"]');
            backgroundElements.forEach((element) => {
                element.style.backgroundImage = `url(${newImageUrl})`;
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();