// ==UserScript==
// @name         Burunduk problem solver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A wishmaster compatible with dollchan extension tools
// @license      MIT
// @author       Burunduk Valera
// @match        https://2ch.hk/po/*
// @match        https://2ch.life/po/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2ch.hk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455595/Burunduk%20problem%20solver.user.js
// @updateURL https://update.greasyfork.org/scripts/455595/Burunduk%20problem%20solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let br = document.createElement('br');
    let a = document.createElement('a');
    a.setAttribute('href', '/user/posting?nc=1');
    a.setAttribute('target', '_blank');
    a.text = 'solve cloudflare';
    let banners = document.getElementsByClassName('header__logo')[0];
    banners.appendChild(br);
    banners.appendChild(a);
})();