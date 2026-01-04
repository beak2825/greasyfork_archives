// ==UserScript==
// @name         Inline SVG Replacer
// @namespace    https://mkpo.li/
// @version      0.1.1
// @description  Replace all img tags with src as an SVG file into inline SVG tags
// @author       mkpoli
// @match        *://*/*
// @exclude      *://*.google.*/*
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/484635/Inline%20SVG%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/484635/Inline%20SVG%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const isNonSvgImage = (img) => {
        const ext = img.src.split('.').pop();
        return ext && ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'avif', 'apng', 'tiff', 'tif'].includes(ext);
    }
    const isSvgResponse = (response) => {
        const contentType = response.headers.get('Content-Type');
        return contentType && contentType.includes('image/svg+xml');
    };
    console.log("hello2")
    document.querySelectorAll('img').forEach(async img => {
        if (isNonSvgImage(img)) return;
        console.log("replacing", img)
        try {
            const response = await fetch(img.src);
            if (isSvgResponse(response)) {
                const svgText = await response.text();
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
                const inlineSvg = svgDoc.querySelector('svg');

                if (inlineSvg) {
                    Array.from(img.attributes).forEach(attr => {
                        inlineSvg.setAttribute(attr.name, attr.value);
                    });

                    img.replaceWith(inlineSvg);
                }
            }
        } catch (error) {
            console.error('Error inlining SVG:', error);
        }
    });
})();