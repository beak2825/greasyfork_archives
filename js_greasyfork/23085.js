// ==UserScript==
// @name         MC-Market - Imgur Fixer
// @namespace    http://mc-market.org/
// @version      0.1
// @description  Viewing images from Imgur on MC-Market made possible.
// @author       Art3mis
// @match        *.mc-market.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23085/MC-Market%20-%20Imgur%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/23085/MC-Market%20-%20Imgur%20Fixer.meta.js
// ==/UserScript==

function replaceImages(oldUrl, newUrl) {
    var imgs = document.getElementsByTagName('img');
    for (i = 0; i<imgs.length; i++) {
        imgs[i].src = imgs[i].src.replace(oldUrl, newUrl);
    }
}

replaceImages('i.imgur.com/', 'kageurufu.net/imgur/?');