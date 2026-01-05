// ==UserScript==
// @name             腾讯视频h5
// @version          0.5.1
// @include          *://v.qq.com/*
// @include          *://lol.qq.com/v/*
// @include          *://film.qq.com/*
// @include          *://view.inews.qq.com/*
// @include          *://news.qq.com/*
// @description   腾讯视频html5播放器
// @grant             none
// @run-at           document-start
// @namespace https://greasyfork.org/users/60675
// @downloadURL https://update.greasyfork.org/scripts/22376/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91h5.user.js
// @updateURL https://update.greasyfork.org/scripts/22376/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91h5.meta.js
// ==/UserScript==
Object.defineProperty(navigator, 'plugins', {
  get: function () {
    return { length: 0 };
  }
});
'use strict';
Object.defineProperty(navigator,"userAgent",{value:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10;  rv:48.0) Gecko/20100101 Firefox/48.0",writable:false,configurable:false,enumerable:true});