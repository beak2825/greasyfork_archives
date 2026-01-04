// ==UserScript==
// @name         Clozemaster artifical image URL Changer and Resizer
// @namespace    https://gist.github.com/evilUrge/999787edfbb9c9f485037eebdbd2ada3
// @version      0.4
// @description  Change background image URLs from *.small.png to *.png, stretch images, and ensure they are not trimmed on Clozemaster
// @author       Gilad Maoz
// @license      MIT
// @icon         https://www.clozemaster.com/icons/favicon-96x96.png
// @match        https://www.clozemaster.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498766/Clozemaster%20artifical%20image%20URL%20Changer%20and%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/498766/Clozemaster%20artifical%20image%20URL%20Changer%20and%20Resizer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function replaceImageURLs() {
        const elements = document.querySelectorAll('div[style*=".small.png"]');

        elements.forEach(el => {
            let style = el.getAttribute('style'); // Replace .small.png with .png
            let newStyle = style.replace(/\.small\.png/g, '.png'); // Add styles to stretch the background image and prevent it from being trimmed
            newStyle += ' background-size: cover; background-repeat: no-repeat; overflow: visible; min-height: 1024px';
            el.setAttribute('style', newStyle);
        });
    }
    function removeShowImageButton() {
        const button = document.querySelector('.btn-default.toggle-image');
        if (button) {
            button.remove();
        }
    }

    replaceImageURLs();
//    removeShowImageButton();

    const observer = new MutationObserver(() => {
        replaceImageURLs();
//        removeShowImageButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();