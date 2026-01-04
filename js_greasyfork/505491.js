// ==UserScript==
// @name         Onlyfans mouse wheel next/prev in gallery
// @namespace    http://tampermonkey.net/
// @version      2024-08-25
// @description  The script allows you to use the mouse wheel to view the images and video gallery
// @author       Batya
// @match        https://onlyfans.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onlyfans.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505491/Onlyfans%20mouse%20wheel%20nextprev%20in%20gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/505491/Onlyfans%20mouse%20wheel%20nextprev%20in%20gallery.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function tmOnlyFansWheelNextPrev(event) {
        let btn;

        if (event.deltaY > 0) {
            btn = document.querySelector('.pswp__button--arrow--next');
        } else {
            btn = document.querySelector('.pswp__button--arrow--prev');
        }
        if (btn && !btn.hasAttribute('disabled')) {
            btn.click();
        }

    }

    let item = document.querySelector('body');
    item.onwheel = tmOnlyFansWheelNextPrev;

})();