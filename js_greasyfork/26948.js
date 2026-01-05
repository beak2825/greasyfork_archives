// ==UserScript==
// @name             web_UA
// @version          0.1
// @include          *://v.qq.com/*
// @include          http://live.bilibili.com/*
// @include          http://www.bilibili.com/video/av*
// @include          http://bangumi.bilibili.com/anime/v/*
// @description 设置指定网站UA
// @grant       none
// @run-at           document-start
// @namespace https://greasyfork.org/users/18857
// @downloadURL https://update.greasyfork.org/scripts/26948/web_UA.user.js
// @updateURL https://update.greasyfork.org/scripts/26948/web_UA.meta.js
// ==/UserScript==
Object.defineProperty(navigator, 'plugins', {
  get: function () {
    return { length: 0 };
  }
});
'use strict';
Object.defineProperty(navigator,"userAgent",{value:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10;  rv:45.0) Gecko/20100101 Firefox/45.0",writable:false,configurable:false,enumerable:true});