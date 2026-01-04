// ==UserScript==
// @name         ArkhamDB Landing Page Images
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fixes the broken images of ArkhamDB's landing page.
// @author       Chr1Z
// @match        https://*.arkhamdb.com/
// @icon         https://i.imgur.com/T3vHgln.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533608/ArkhamDB%20Landing%20Page%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/533608/ArkhamDB%20Landing%20Page%20Images.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.addEventListener('load', () => {
        const elements = document.querySelectorAll('[style*="background-image"]');

        elements.forEach(el => {
            const style = el.getAttribute('style');
            const match = style.match(/url\(["']?(\/[^"')]+\.png)["']?\)/);

            if (match) {
                const originalUrl = match[1];
                const jpgUrl = originalUrl.replace(/\.png$/, '.jpg');

                // Create a test image to see if the .png exists
                const img = new Image();
                img.src = originalUrl;

                img.onerror = () => {
                    // If .png fails to load, replace background-image with .jpg
                    const newStyle = style.replace(originalUrl, jpgUrl);
                    el.setAttribute('style', newStyle);
                };
            }
        });
    });
})();