// ==UserScript==
// @name        getmusic.fm Redeem Button Transformer
// @namespace   Violentmonkey Scripts
// @match       *://www.getmusic.fm/*
// @grant       none
// @version     1.0
// @author      Raman Sinclair
// @description 17/11/2024, 20:36:51
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/539548/getmusicfm%20Redeem%20Button%20Transformer.user.js
// @updateURL https://update.greasyfork.org/scripts/539548/getmusicfm%20Redeem%20Button%20Transformer.meta.js
// ==/UserScript==

// prevent JQuery conflicts, see http://wiki.greasespot.net/@grant
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function () {
    var redeemButtonParentElements = document.querySelectorAll('div[data-hello-url]');
    redeemButtonParentElements.forEach(function (redeemButtonParent) {
        const url = redeemButtonParent.getAttribute('data-hello-url');
        const redeemButton = redeemButtonParent.querySelector('button');
        if (redeemButton && url) {
            const className = redeemButton.className;
            const redeemButtonChildren = Array.from(redeemButton.children);
            redeemButtonParent.removeChild(redeemButton);
            const a = document.createElement('a');
            a.href = url;
            a.className = className;
            a.target = '_blank';
            redeemButtonChildren.forEach(function (child) {
                a.appendChild(child);
            });
            redeemButtonParent.appendChild(a);
        }
    });
});