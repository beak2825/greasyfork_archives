// ==UserScript==
// @name         ShopperStop Product Gallery Modifications
// @description  Image and buttons modification for ShopperStop product gallery
// @author       https://github.com/amitpatil321
// @namespace    https://github.com/amitpatil321/ShopperStop-Product-Gallery-Modifications-Tampermonkey
// @version      0.1
// @match        https://www.shoppersstop.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shoppersstop.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520233/ShopperStop%20Product%20Gallery%20Modifications.user.js
// @updateURL https://update.greasyfork.org/scripts/520233/ShopperStop%20Product%20Gallery%20Modifications.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function resizeGallery(){
        const dialog = document.querySelector('[data-testid="PdpDialogImageCarousel"]');
        if (!dialog) return;

        const image = dialog.querySelector(".pdp-dialog-image");
        if(image){
            image.style.maxWidth = "600px";
        }

        // Next prev image resize
        const galleryButtons = dialog.querySelectorAll(".slick-slider .slick-arrow");
        if(galleryButtons){
            galleryButtons.forEach(button => {
                button.style.width = "60px";
                button.style.height = "60px";
            });
        }
    }


    document.body.addEventListener('click', function (event) {
        const productImage = event.target.closest('img.object-contain');
        if (productImage) {
            setTimeout(() => resizeGallery(), 50);
        }
        const navButtons = event.target.closest('.slick-next');
        if (navButtons) {
            setTimeout(() => resizeGallery(), 550);
        }
    });
})();