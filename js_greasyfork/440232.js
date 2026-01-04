// ==UserScript==
// @name         Batoto Image Width fix
// @namespace    https://greasyfork.org/en/users/162009-delmain
// @version      0.2.2
// @description  Make sure that images in bato.to chapters aren't too wide or too narrow
// @author       Delmain
// @match        https://bato.to/chapter/*
// @icon         https://www.google.com/s2/favicons?domain=bato.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440232/Batoto%20Image%20Width%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/440232/Batoto%20Image%20Width%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let setImageSize = function(page, targetWidth) {
        let width = page.style.width.replace(/\D/g,'');
        let height = page.style.height.replace(/\D/g,'');
        let ratio = targetWidth / width;
        let newHeight = Math.floor(height * ratio);

        page.style.height = newHeight + 'px';
        page.style.width = targetWidth + 'px';

        let images = Array.from(page.getElementsByTagName('img'));
        images.forEach(function(image) {
            image.width = targetWidth
            image.height = newHeight;
        });
    };

    const windowWidthPercentMax = 0.95;
    const windowWidthPercentMin = 0.50;
    let maxWidth = Math.floor(window.innerWidth * windowWidthPercentMax);
    let minWidth = Math.floor(window.innerWidth * windowWidthPercentMin);

    let viewer = document.getElementById('viewer');
    let pages = Array.from(viewer.children);
    pages.forEach(function(page) {
        if(page.style && page.style.width) {
            let width = page.style.width.replace(/\D/g,'');
            if(width > maxWidth) { setImageSize(page, maxWidth); }
            if(width < minWidth) { setImageSize(page, minWidth); }
        }
    });
})();