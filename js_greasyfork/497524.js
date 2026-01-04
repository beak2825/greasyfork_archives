// ==UserScript==
// @name         Bilibili复制净化
// @namespace    www.bilibili.com
// @version      0.1
// @description  复制时，去掉添加物
// @author       e1399579
// @icon         https://www.bilibili.com/favicon.ico
// @match        *://www.bilibili.com/read/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497524/Bilibili%E5%A4%8D%E5%88%B6%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/497524/Bilibili%E5%A4%8D%E5%88%B6%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

"use strict";
// article-content
HTMLElement.prototype.realAddEventListener = HTMLElement.prototype.addEventListener;
HTMLElement.prototype.addEventListener = function(type, listener, options) {
    if (type === "copy") {
    } else {
        this.realAddEventListener(...arguments);
    }
};