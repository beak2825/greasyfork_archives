// ==UserScript==
// @name         JMTT
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  禁漫天堂
// @author       You
// @include      /^http(s)://18-comic-minions.club
// @include      /^http(s)://18-comic-minions.club/photo/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1.123
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501448/JMTT.user.js
// @updateURL https://update.greasyfork.org/scripts/501448/JMTT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
    const banners1 = document.querySelectorAll('.div-bf-pv');
    if (banners1.length) {
        for (let i = 0; i < banners1.length; i++) {
            banners1[i].style.display = 'none';
        }
    }

    // 首页banner
    const banners2 = document.querySelectorAll('.photo_center_div');
    if(banners2.length) {
        for (let i = 0; i < banners2.length; i++) {
            banners2[i].style.display = 'none';
        }
    }

    // 漂浮层
    const op = document.querySelectorAll('.ts-im-container');
    if(op.length) {
        for (let i = 0; i < op.length; i++) {
            op[i].style.display = 'none';
        }
    }

    // 漂浮层
    const abs = document.querySelectorAll('.hidden-lg');
    if(abs.length) {
        for (let i = 0; i < abs.length; i++) {
            if(abs[i].classList.length === 1) {
                abs[i].style.display = 'none';
            }
        }
    }
}, 1000)
})();