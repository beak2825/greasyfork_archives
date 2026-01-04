// ==UserScript==
// @name:en      No Search Boxes
// @name         禁用搜索框
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description:en Eradicate *ALL* search boxes!
// @description  根除 *所有* 搜索框！
// @author       PRO
// @match        https://www.google.com/*
// @match        https://www.baidu.com/*
// @match        https://cn.bing.com/*
// @match        https://www.bing.com/*
// @match        https://bing.com/*
// @match        http://www.360doc.com/*
// @match        https://blog.csdn.net/*
// @match        https://zhidao.baidu.com/*
// @match        https://baike.baidu.com/*
// @icon         https://cn.bing.com/rp/2_g0eivXNuwfBBuBWXLrMOrwkEo.svg
// @grant        none
// @run-at       document-start
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/466779/%E7%A6%81%E7%94%A8%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/466779/%E7%A6%81%E7%94%A8%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    ["selectionchange", "mouseup"].forEach((type) => {
        document.addEventListener(type, (e) => {
            e.stopImmediatePropagation();
        }, {capture: true});
        console.log(`[No Search Boxes] Blocked "${type}" listeners.`);
    });
})();