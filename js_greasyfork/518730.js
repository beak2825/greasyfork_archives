// ==UserScript==
// @name         Remove Watermark from Canvas
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Removes the watermark image on the chart on the site jsontochart.com. Also removed when you download the image.
// @author       Miscellaneous Account
// @match        https://jsontochart.com/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518730/Remove%20Watermark%20from%20Canvas.user.js
// @updateURL https://update.greasyfork.org/scripts/518730/Remove%20Watermark%20from%20Canvas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Save the original drawImage method
    const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;

    // Override the drawImage method
    CanvasRenderingContext2D.prototype.drawImage = function(image, ...args) {
        // Skip rendering the watermark image
        if (image.currentSrc === "https://jsontochart.com/assets/img/logo.png") {
            console.log('Blocked rendering of watermark image:', image.currentSrc);
            return;
        }

        // Call the original drawImage method with all arguments
        originalDrawImage.call(this, image, ...args);
    };
})();
