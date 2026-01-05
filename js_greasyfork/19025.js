// ==UserScript==
// @name        Inline images on a Niconico News article page
// @namespace   https://akinori.org
// @description Converts image links on a Niconico News article page to inline images.
// @author      Akinori MUSHA
// @license     2-clause BSDL
// @include     http://news.nicovideo.jp/watch/*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19025/Inline%20images%20on%20a%20Niconico%20News%20article%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/19025/Inline%20images%20on%20a%20Niconico%20News%20article%20page.meta.js
// ==/UserScript==

(function () {
    let links = document.querySelectorAll('#MainBody p a[href$=".jpg"]');
    for (let i = 0; i < links.length; i++) {
        let link = links[i];
        if (link.href == link.textContent) {
            link.textContent = '';
            let img = document.createElement('img');
            img.setAttribute('src', link.href);
            link.appendChild(img);
        }
    }
})();