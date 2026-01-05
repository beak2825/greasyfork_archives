// ==UserScript==
// @name        Disable image resize in Feedly
// @description By default feedly.com uses own thumb generator service. This script disables it
// @namespace   zcarot
// @match       *://*.feedly.com/*
// @version     1.2
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/19315/Disable%20image%20resize%20in%20Feedly.user.js
// @updateURL https://update.greasyfork.org/scripts/19315/Disable%20image%20resize%20in%20Feedly.meta.js
// ==/UserScript==
/*jslint browser:true */

(function () {
    'use strict';

    var wait = function () {
        var divs = document.querySelectorAll('div.u5EntryAnnotationHolder, div.u4EntryAnnotationHolder, div.topRecommendedEntry'),
            imgs = document.querySelectorAll('div.content img'),
            divImgs = document.querySelectorAll('div.list-entries .visual');

        [].forEach.call(divs, function (div) {
            var preview = div.childNodes[1],
                style,
                src;

            if (!(preview.getAttribute('data-fetched'))) {
                preview.setAttribute('data-fetched', 1);
                style = preview.currentStyle || window.getComputedStyle(preview, false);
                if (style.backgroundImage) {
                    src = /url=([^&]+)/.exec(style.backgroundImage);
                    if (src && src[1]) {
                        preview.style.backgroundImage = 'url(' + decodeURIComponent(src[1]) + ')';
                    }
                }
            }
        });

        [].forEach.call(divImgs, function (divImage) {
            if (!(divImage.getAttribute('data-fetched'))) {
                divImage.setAttribute('data-fetched', 1);
                var src = divImage.getAttribute('data-original');
                var divStyle = divImage.currentStyle || window.getComputedStyle(divImage, false);
                if (divStyle) {
                    var linkEncoded = /url=([^&]+)/.exec(divStyle.backgroundImage.slice(4, -1).replace(/"/g, ""));
                    if (linkEncoded && linkEncoded[1]) {
                        divImage.style.backgroundImage = "";
                        var newImage = new Image();
                        divImage.appendChild(newImage);
                        newImage.src = decodeURIComponent(linkEncoded[1]);
                        newImage.style.maxWidth = divStyle.width;
                    }
                }
            }
        });

        [].forEach.call(imgs, function (image) {
            if (!(image.getAttribute('data-fetched'))) {
                image.setAttribute('data-fetched', 1);
                var src = image.getAttribute('data-original');
                if (src) {
                    image.src = src;
                }
            }
        });

        setTimeout(wait, 200);
    };
    wait();
}());