// ==UserScript==
// @name         Resize Images on site e-desk
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Resize images on e-desk
// @author       MaxwGPT
// @match        https://nebrasil.e-desk.com.br/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471939/Resize%20Images%20on%20site%20e-desk.user.js
// @updateURL https://update.greasyfork.org/scripts/471939/Resize%20Images%20on%20site%20e-desk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyMaxWidthToImages() {
        const elements = document.querySelectorAll('[id*="divComentario_"] img');
        elements.forEach(img => {
            img.style.maxWidth = '300px';
            img.style.transition = 'max-width 0.3s ease';
            img.addEventListener('click', toggleImageSize);
        });
    }

    function toggleImageSize(event) {
        const img = event.target;
        const currentWidth = img.style.maxWidth;
        img.style.maxWidth = currentWidth === '100%' ? '300px' : '100%';
    }

    // Run once when the page loads
    applyMaxWidthToImages();

    // Watch for new comments loaded dynamically
    const observer = new MutationObserver(applyMaxWidthToImages);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();