// ==UserScript==
// @name Sankaku Complex News - Kill lazy load
// @description Kill lazy load on news.sankakucomplex.com and load all images directly
// @namespace https://greasyfork.org/users/752079
// @version 1.0.1
// @license Unlicense
// @match https://news.sankakucomplex.com/*
// @grant none
// @icon https://news.sankakucomplex.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/522217/Sankaku%20Complex%20News%20-%20Kill%20lazy%20load.user.js
// @updateURL https://update.greasyfork.org/scripts/522217/Sankaku%20Complex%20News%20-%20Kill%20lazy%20load.meta.js
// ==/UserScript==

const run = () => {
    const images = document.querySelectorAll('img[data-lazy-src]');
    // Load all images - may be taxing!
    //images.forEach(image => image.src = image.dataset.lazySrc);

    images.forEach(image => {
        const srcset = image.dataset.lazySrcset.split(',');
        image.src = srcset[srcset.length - 1].split(' ')[1];
    })

}

run();
