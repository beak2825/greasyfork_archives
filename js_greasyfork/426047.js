// ==UserScript==
// @name         Remove e-hentai image title
// @namespace    Remove e-hentai image title
// @version      2.1
// @description  Remove e-hentai all image titles. They will not show on mouse hover anymore.
// @author       fmnijk
// @match        https://e-hentai.org/*
// @match        https://exhentai.org/*
// @icon         https://www.google.com/s2/favicons?domain=e-hentai.org
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/426047/Remove%20e-hentai%20image%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/426047/Remove%20e-hentai%20image%20title.meta.js
// ==/UserScript==

document.body.onmouseover = function() {
    document.querySelectorAll('img').forEach(function(img) {
        if (img.hasAttribute('title')) {
            img.setAttribute('title', '');
        }
    });
    document.querySelectorAll('div').forEach(function(img) {
        if (img.hasAttribute('title')) {
            img.setAttribute('title', '');
        }
    });
};











