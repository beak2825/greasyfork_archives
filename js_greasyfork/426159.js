// ==UserScript==
// @name         [Cowcotland] Image Fancybox
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace the horrible image zoom popup with a shiny new lightbox
// @author       Sytha
// @match        https://www.cowcotland.com/*
// @icon         https://www.google.com/s2/favicons?domain=cowcotland.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426159/%5BCowcotland%5D%20Image%20Fancybox.user.js
// @updateURL https://update.greasyfork.org/scripts/426159/%5BCowcotland%5D%20Image%20Fancybox.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let paragraphIndex = 0;
    document.querySelectorAll('.artcontent > p').forEach(articleParagraph => {
        articleParagraph.querySelectorAll('a[href*="images/"][onclick*="window.open"][onclick*="popup_image"]').forEach(imageLink => {
            imageLink.onclick = null;
            imageLink.title = '';
            imageLink.dataset.fancybox = 'article-image'; // + paragraphIndex; // regroup the images in a gallery for each paragraph?
        });
        paragraphIndex++;
    });
    const fbScript = document.createElement('script');
    fbScript.src = 'https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js';
    document.head.appendChild(fbScript);
    const fbStyle = document.createElement('link');
    fbStyle.rel = 'stylesheet';
    fbStyle.href = 'https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css';
    document.head.appendChild(fbStyle);
})();