// ==UserScript==
// @name         btbtt.me去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  btbtt去广告
// @author       ojdev
// @match        https://www.btbtt.me/*
// @match        *://*btbtt*
// @match        *://*btbtt*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/397800/btbttme%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/397800/btbttme%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function () {
        $("#wrapper_left_bg").remove();
        $("#wrapper_right_bg").remove();
        $(".width.imgs_1").remove();
    }, 100);
})();
