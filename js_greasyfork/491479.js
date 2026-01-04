// ==UserScript==
// @name         Webtoon Resize
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  resizes the images in webtoon desktop version so they're not too big.
// @author       You
// @match        https://www.webtoons.com/*/*/*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webtoons.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491479/Webtoon%20Resize.user.js
// @updateURL https://update.greasyfork.org/scripts/491479/Webtoon%20Resize.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var images = document.querySelectorAll("div.viewer_img._img_viewer_area img")
    console.log(images);
    images.forEach((item)=>{
        item.style.width="500px";
        item.style.margin="0 60px"
        item.style.minWidth="400px";
        item.style.height="auto";
    })
    // Your code here...
})();