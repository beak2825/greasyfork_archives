// ==UserScript==
// @name         Show Thread Images
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      GPLv3
// @description  Replaces all <image> links with images on old reddit
// @author       jaevibing
// @match        *://old.reddit.com/r/*/comments/*
// @icon         https://www.google.com/s2/favicons?domain=www.reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475580/Show%20Thread%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/475580/Show%20Thread%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace <a> elements with target="_blank" with images
    function replaceLinks() {
        const links = document.querySelectorAll('a[target="_blank"]');

        links.forEach(link => {
            const img = document.createElement('img');
            img.src = link.href;
            img.style.maxWidth = '200px';
            link.innerHTML = '';
            link.appendChild(img);
        });
    }

    // Wait for the page to fully load before executing the script
    window.addEventListener('load', replaceLinks);
})();