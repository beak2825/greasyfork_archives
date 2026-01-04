// ==UserScript==
// @name         PaperWHU-Watermark-Removal
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Tampermonkey script for removing the watermark of master degree thesis library of WHU.
// @match        http://paperright.lib.whu.edu.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533747/PaperWHU-Watermark-Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/533747/PaperWHU-Watermark-Removal.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeWatermark(url) {
        let urlObj = new URL(url);
        if (urlObj.searchParams.has('watermark')) {
            urlObj.searchParams.delete('watermark');
        }
        return urlObj.toString();
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.tagName === 'IMG') {
                    processImage(node);
                }
            });
        });
    });

    function processImage(img) {
        if (img.src.includes('watermark')) {
            let newSrc = removeWatermark(img.src);
            img.src = newSrc;
        }
    }

    observer.observe(document.body, { childList: true, subtree: true });

})();
