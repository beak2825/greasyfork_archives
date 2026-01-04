// ==UserScript==
// @name         Lightshot Page to Image Link Redirect
// @namespace    https://prnt.sc
// @version      0.4
// @description  Redirect to the actual image URL on Lightshot pages
// @author       BoomBookTR
// @match        https://prnt.sc/*
// @exclude      https://prnt.sc/
// @exclude      https://prnt.sc/gallery.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.tr
// @grant        none
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/502434/Lightshot%20Page%20to%20Image%20Link%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/502434/Lightshot%20Page%20to%20Image%20Link%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sayfadaki resmi bulma
    const imageElement = document.querySelector('.screenshot-image');

    // Eğer resim bulunursa
    if (imageElement) {
        const imageSrc = imageElement.getAttribute('src');

        // Sayfayı resmin URL'sine yönlendirme
        window.location.href = imageSrc;
        // Yeni bir sekmede açma
        //window.open(imageSrc, '_blank');
    }
})();