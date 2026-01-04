// ==UserScript==
// @name misskon.com - Kill lazy load
// @description Kill lazy load on misskon.com and load all images directly.
// @namespace https://greasyfork.org/users/752079
// @version 1.0.1
// @license Unlicense
// @match https://misskon.com/*
// @grant none
// @icon https://misskon.com/media/2023/12/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/522214/misskoncom%20-%20Kill%20lazy%20load.user.js
// @updateURL https://update.greasyfork.org/scripts/522214/misskoncom%20-%20Kill%20lazy%20load.meta.js
// ==/UserScript==

const run = () => {
    const images = document.querySelectorAll('img.lazy:not(.loaded)');
    images.forEach(image => {
        image.src = image.dataset.src
        image.dataset.wasProcessed = 'true';
        image.classList.add('loaded');
   });
}

run();
