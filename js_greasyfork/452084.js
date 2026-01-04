// ==UserScript==
// @name         MissAV
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  MissAV Block ads
// @author       You
// @match        https://missav.com/en/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452084/MissAV.user.js
// @updateURL https://update.greasyfork.org/scripts/452084/MissAV.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('.under_player').forEach(item =>
                item.remove());
document.querySelectorAll("body > div > div.mx-auto.px-4.content-without-search.pb-12 > div > div.flex-1.order-first > div:nth-child(1) > div.relative.-mx-4.-mt-6 > div").forEach(ele => ele._x_attributeCleanups = null)
})();