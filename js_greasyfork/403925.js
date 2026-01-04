// ==UserScript==
// @name         avblurr-bh
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Blurra av byggahus forum
// @author       Edward Tjörnhammar
// @match        *://www.byggahus.se/forum/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/403925/avblurr-bh.user.js
// @updateURL https://update.greasyfork.org/scripts/403925/avblurr-bh.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var imgs = document.getElementsByTagName('img');
    for(var i=0; i<imgs.length;i++) {
        scrub(imgs[i]);
    };
})();

function scrub(img) {
    var nimg = img.cloneNode(true);
    if(nimg.hasAttribute('data-img-src')) {
        nimg.setAttribute('src', nimg.getAttribute('data-img-src'));
        img.parentNode.parentNode.parentNode.parentNode.replaceWith(nimg);
    } else if(nimg.classList.contains('LbImage')) {
        img.parentNode.parentNode.parentNode.parentNode.replaceWith(nimg);
    };
};
