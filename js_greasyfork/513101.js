// ==UserScript==
// @name         Simple instagram Images
// @namespace    http://tampermonkey.net/
// @version      2024-10-18
// @description  Simple userscript to open instagram images in another tab.
// @author       pe-dro
// @match        *://*.instagram.com/*
// @source       https://github.com/pe-dro/simple-instagram-images/
// @supportURL   https://github.com/pe-dro/simple-instagram-images/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license
// @downloadURL https://update.greasyfork.org/scripts/513101/Simple%20instagram%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/513101/Simple%20instagram%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

function removeElements() {
    const elements = document.querySelectorAll('._aagw');
    elements.forEach(el => el.remove());
}

function makeImagesClickable() {
    const divs = document.querySelectorAll('._aagv');
    divs.forEach(div => {
        const imgs = div.querySelectorAll('img');
        imgs.forEach(img => {
            const link = img.src;
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                window.open(link, '_blank');
            });
        });
    });
}


setInterval(() => {
    removeElements();
    makeImagesClickable();
}, 1000); 
})();