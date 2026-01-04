/* jshint esversion: 6 */
// ==UserScript==
// @name         BT之家宽屏显示
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  BT之家网页宽屏显示
// @author       greyh4t
// @license      MIT
// @match        *://*.btbtt11.com/*
// @match        *://*.btbtt12.com/*
// @match        *://*.btbtt13.com/*
// @match        *://*.btbtt14.com/*
// @match        *://*.btbtt15.com/*
// @match        *://*.btbtt16.com/*
// @match        *://*.btbtt17.com/*
// @match        *://*.btbtt18.com/*
// @match        *://*.btbtt19.com/*
// @match        *://*.btbtt20.com/*
// @run-at       document-start
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/444630/BT%E4%B9%8B%E5%AE%B6%E5%AE%BD%E5%B1%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/444630/BT%E4%B9%8B%E5%AE%B6%E5%AE%BD%E5%B1%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 宽屏
    GM_addStyle(".width {max-width:90% !important; width:90% !important;}");

    // 删除左右两侧无法点击的遮罩
    document.onreadystatechange = function () {
        if (document.readyState === "interactive") {
            document.querySelectorAll(".wrapper_bg_c.hidden-xs").forEach(el => el.remove());
        }
    }
})()
