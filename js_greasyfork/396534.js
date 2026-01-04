// ==UserScript==
// @name         Rule34 Image Fit
// @namespace    potato_potato
// @description  Resize and center images on Rule34
// @author       potato_potato
// @version      0.1.0
// @grant        none
// @run-at       document-start
// @match        https://rule34.xxx/index.php?page=post&s=view&id=*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/396534/Rule34%20Image%20Fit.user.js
// @updateURL https://update.greasyfork.org/scripts/396534/Rule34%20Image%20Fit.meta.js
// ==/UserScript==

(() => {
    'use strict';
    function resize_image() {
        try {
            let image = document.getElementById("image");
            if (image != null) {
                image.style["object-fit"] = "contain"; // Protect aspect ratio
                image.style["max-height"] = "85vh"; // TODO: Investigate buggy behaviour when set higher than 85vh.
                image.style.width = "100%"; // Note that this doesn't clobber aspect ratio due to `object-fit: contain`.
            }
        } catch (e) {
            console.log('Error modifying image! Website structure change?');
            console.log(e);
        }
    }

    // We want to operate on the DOM after it is loaded, but BEFORE images are loaded and rendered, to
    // avoid the image rendering for a frame before suddenly being moved/resized.
    if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive")
        resize_image();
    else
        window.addEventListener('DOMContentLoaded', resize_image, false);
})();