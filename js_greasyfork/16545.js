// ==UserScript==
// @name        Load all Webtoons images
// @namespace   line-webtoons@
// @description Dowloads all the images on load instead of on scroll
// @include     http://www.webtoons.com/en/*/viewer*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16545/Load%20all%20Webtoons%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/16545/Load%20all%20Webtoons%20images.meta.js
// ==/UserScript==
var i,
    v_html_collection = document.getElementsByClassName('_images');
function replaceImages(element) {
    'use strict';
    let image_url = element.getAttribute('data-url');
    element.src = image_url;
}
for (i = 0; i < v_html_collection.length; i++ ) {
    replaceImages(v_html_collection[i]);
}
