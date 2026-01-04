// ==UserScript==
// @name         Gelbooru Thumbnail Enlarger
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Larger thumbnails for easier viewing.
// @author       Sparklepaws
// @match        *://gelbooru.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486630/Gelbooru%20Thumbnail%20Enlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/486630/Gelbooru%20Thumbnail%20Enlarger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const applyCSSChanges = () => {
        const imgSelector = 'article.thumbnail-preview img';
        const images = document.querySelectorAll(imgSelector);
        images.forEach(img => {
            img.style.maxWidth = '250px';
            img.style.maxHeight = '250px';
        });

        const containerSelector = '.thumbnail-preview';
        const containers = document.querySelectorAll(containerSelector);
        containers.forEach(container => {

            container.style.width = '250px';
            container.style.height = '250px';
            container.style.marginTop = '20px';
            container.style.marginLeft = '10px';
            container.style.marginRight = '10px';
        });
    };

    applyCSSChanges();
})();