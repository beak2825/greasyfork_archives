// ==UserScript==
// @name         hide all image tags on a page
// @namespace    https://github.com/4ndr3wN/BrowserJavascripts/tree/master/hide_all_images
// @version      0.1
// @description  Hide all image tags
// @author       4ndr3wN@github
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386766/hide%20all%20image%20tags%20on%20a%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/386766/hide%20all%20image%20tags%20on%20a%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var images = document.getElementsByTagName('img');

    setImagesNone(images);

    function setImagesNone(images){
        for (var img_k in images) {
            if (!images.hasOwnProperty(img_k)) continue;// skip loop if the property is from prototype

            var image_v = images[img_k];
            image_v.style.display = "none";
        }
    }
})();