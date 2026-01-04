// ==UserScript==
// @name         Zerochan Thumbnail Enhancer
// @description  Load bigger thumbnails on Zerochan
// @namespace    https://greasyfork.org/users/752079
// @version      1.0.2
// @license      Unlicense
// @match        https://www.zerochan.net/*
// @grant        none
// @icon         https://www.zerochan.net/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/522215/Zerochan%20Thumbnail%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/522215/Zerochan%20Thumbnail%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function enhanceImage(img) {
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc) {
            const newSrc = dataSrc.replace(
                /s\d\.zerochan\.net\/\d+\/.*?\/(\d+)\.jpg/,
                's1.zerochan.net/$1.600.$1.jpg'
            );
            img.setAttribute('src', newSrc);
            img.classList.add('loaded');
        }
    }

    document.querySelectorAll('img').forEach(enhanceImage);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'IMG') {
                    enhanceImage(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
