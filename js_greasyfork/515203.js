// ==UserScript==
// @name         ArsTechnica Wide Mode
// @license MIT
// @namespace    https://meyer.eu
// @version      1.0.1
// @description  makes the article content wider on ArsTechnica
// @author       philipp@meyer.eu
// @match        http*://arstechnica.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arstechnica.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515203/ArsTechnica%20Wide%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/515203/ArsTechnica%20Wide%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const adDivs = document.querySelectorAll('div.ad-wrapper');
    adDivs.forEach(adDiv => adDiv.remove());

    const divs = document.querySelectorAll('main > article > div');
    const [head, ...list] = divs;
    list.forEach(div => {
        div.className = 'post-content-wrapper relative mx-auto px-[15px] sm:max-w-3xl sm:px-5 lg:px-8 xl:px-0';
    });
})();