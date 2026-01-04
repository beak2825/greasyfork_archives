// ==UserScript==
// @name          [KPX] iha pildid
// @namespace     https://www.iha.ee
// @version       1.2
// @description   Toome esile tagaplaanil olevad pildid
// @author        KPCX
// @match         *://www.iha.ee/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=iha.ee
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/498008/%5BKPX%5D%20iha%20pildid.user.js
// @updateURL https://update.greasyfork.org/scripts/498008/%5BKPX%5D%20iha%20pildid.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hide small images with specific source
    document.querySelectorAll('.imgwrapper img').forEach(img => {
        if(img.src === 'https://www.iha.ee/images/resp_eds4dksid84ujitmdjdhgfkipf.gif') {
            img.style.visibility = 'hidden';
        }
    });

    // Fix large images' height and replace source
    document.querySelectorAll('.imgwrapper_big img').forEach(img => {
        if(img.src === 'https://www.iha.ee/images/resp_edtf8d345ekri46ddfskf7689x.gif') {
            img.src = img.parentNode.style.backgroundImage.slice(5, -2);
            img.parentNode.style.backgroundImage = '';
            img.parentNode.style.maxHeight = 'initial';
            img.parentNode.style.maxWidth = 'initial';
        }
    });
})();