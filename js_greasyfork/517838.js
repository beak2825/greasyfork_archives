// ==UserScript==
// @name         ADD YKCUL PICTURE TO SMLWIKI.COM/MOVIE [FIXED]
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  just adds that
// @author       smlwiki fan
// @match        https://smlwiki.com/movie/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517838/ADD%20YKCUL%20PICTURE%20TO%20SMLWIKICOMMOVIE%20%5BFIXED%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/517838/ADD%20YKCUL%20PICTURE%20TO%20SMLWIKICOMMOVIE%20%5BFIXED%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the anchor element
    const anchorElement = document.createElement('a');
    anchorElement.href = 'https://smlwiki.com/7/'; // Update the href to the full URL
    anchorElement.className = 'clickable';

    // Create the image inside the anchor
    const imgElement = document.createElement('img');
    imgElement.src = 'https://picsur.org/i/3a0d60aa-3aea-4106-8b48-b855c1bd6b31.jpg';
    imgElement.style.rotate = '11deg';
    imgElement.style.right = '90px';
    imgElement.style.left = '450px';

    // Append the image to the anchor
    anchorElement.appendChild(imgElement);

    // Append the anchor to the body or a specific container
    const container = document.querySelector('#wall') || document.body;
    container.appendChild(anchorElement);

})();
