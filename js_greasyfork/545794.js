// ==UserScript==
// @name         Old Reddit Images
// @namespace    http://tampermonkey.net/
// @version      2025-08-14
// @description  Script to show images on old reddit directly on the page instead of <image> links.
// @author       WideWalkinMenace
// @match        *://*.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/545794/Old%20Reddit%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/545794/Old%20Reddit%20Images.meta.js
// ==/UserScript==

// Source: https://www.reddit.com/r/help/comments/192zsle/how_to_see_images_in_comments_in_old_reddit/
(function() {
    [...document.querySelectorAll('a')].forEach((element) => {
    if(element.innerHTML == '&lt;image&gt;'){
    const my_img = document.createElement('img');
    my_img.src = element.href;
    my_img.style = 'max-width:240px;width:100%';
    element.replaceWith(my_img);
    }});
})();