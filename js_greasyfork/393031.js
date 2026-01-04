// ==UserScript==
// @name         Image hosting 503 reload
// @namespace    https://wiki.gslin.org/wiki/Image_hosting_503_reload
// @version      0.20191128.0
// @description  Reload image when 503 happens
// @author       Gea-Suan Lin <gslin@gslin.org>
// @match        http://www.imgbabes.com/*
// @match        http://www.imgflare.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/393031/Image%20hosting%20503%20reload.user.js
// @updateURL https://update.greasyfork.org/scripts/393031/Image%20hosting%20503%20reload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if ('503 Service Temporarily Unavailable' === document.title) {
        window.location.reload();
        return;
    }

    let el = document.querySelector('h1');
    if (el && '503 Service Temporarily Unavailable' === el.innerHTML) {
        window.location.reload();
        return;
    }
})();
