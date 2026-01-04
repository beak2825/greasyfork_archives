// ==UserScript==
// @name         NGA去广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除浏览时嵌入页面的广告, 不知道是否对页面跳转时出现的广告有效果
// @author       You
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nga.cn
// @grant        none
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/473489/NGA%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/473489/NGA%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    console.log('script load start');
    if (!window.ngaAds) {
      window.ngaAds = [];
    }
    var t = window.ngaAds;
    Object.defineProperty(t, 'ignore', {
        value: function() { return true; },
        writable: false,
        configurable: false,
    });
    console.log('script load end: ', window.ngaAds);
})();