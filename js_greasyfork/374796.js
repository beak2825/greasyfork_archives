// ==UserScript==
// @name         Reload images Mangadex
// @version      0.1
// @description  Reload images that failed to load
// @author       Bramia
// @include      /mangadex\.org\/chapter/
// @grant        none
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/374796/Reload%20images%20Mangadex.user.js
// @updateURL https://update.greasyfork.org/scripts/374796/Reload%20images%20Mangadex.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        const successfulImage = document.querySelector(".reader-image-wrapper > img");
        if (!successfulImage) return;
        const matches = successfulImage.src.match(/.*(?=\d)/);
        if (!matches) return;
        const baseUrl = matches[0];
        const failedImages = document.querySelectorAll(".reader-image-wrapper > .alert-danger");
        failedImages.forEach((image) => {
            image.addEventListener("click", () => {
                loadAllFailedImages();
            });
        });
        function loadAllFailedImages() {
            failedImages.forEach((image) => {
                const page = image.parentElement.dataset.page;
                image.outerHTML = `<img src="${baseUrl}${page}.jpg" draggable="false" class="noselect nodrag cursor-pointer">`;
            });
        }
    }, 500);
})();