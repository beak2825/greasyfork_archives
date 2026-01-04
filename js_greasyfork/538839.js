// ==UserScript==
// @name         XHamster "Watched" videos remover
// @namespace    http://tampermonkey.net/
// @version      2025-06-08
// @license      MIT
// @description  Removes thumbnails in XHamster for already watched videos
// @author       RubberPixel
// @match        https://xhamster.com/videos/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xhamster.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/538839/XHamster%20%22Watched%22%20videos%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/538839/XHamster%20%22Watched%22%20videos%20remover.meta.js
// ==/UserScript==
 
function GM_addStyle(cssStr){
 
    var n = document.createElement('style');
    n.type = "text/css";
    n.innerHTML = cssStr;
    document.getElementsByTagName('body')[0].appendChild(n);
 
}
 
GM_addStyle(".thumb-list__item:has(> a > div > div.thumb-image-container__watched) { visibility: collapse; }");
GM_addStyle(".thumb-list-mobile-item:has(div > a > div > div.thumb-image-container__watched) { visibility: collapse; }");
