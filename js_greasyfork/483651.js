
// ==UserScript==
// @name         SangTacViet Auto Cống Hiến
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Tự động cống hiến linh thạch
// @match        *sangtacviet.pro/the-luc/cong-hien/*
// @match        *sangtacvietfpt.com/the-luc/cong-hien/*
// @match        *sangtacviet.com/the-luc/cong-hien/*
// @match        *sangtacviet.me/the-luc/cong-hien/*
// @match        *sangtacviet.vip/the-luc/cong-hien/*
// @match        *14.225.254.182/the-luc/cong-hien/*
// @icon         http://14.225.254.182/favicon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483651/SangTacViet%20Auto%20C%E1%BB%91ng%20Hi%E1%BA%BFn.user.js
// @updateURL https://update.greasyfork.org/scripts/483651/SangTacViet%20Auto%20C%E1%BB%91ng%20Hi%E1%BA%BFn.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

    const elements = document.querySelectorAll('[class="item"]');

    for (let i = 0; i < Math.min(10, elements.length); i++) {
        elements[i].click();
        console.log('+1');
    }

    const primaryButton = document.querySelectorAll('[class="btn btn-primary"]')[0];

    if (primaryButton) {
        primaryButton.click();
    } else {
        console.log('Primary button not found.');
    }
})();