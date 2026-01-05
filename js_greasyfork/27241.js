// ==UserScript==
// @name             乐视HTML5播放
// @description      通过修改ua使乐视自动启用HTML5播放器播放视频，但是好像加载html5视频比较慢
// @author           nftbty
// @version          0.4
// @icon             https://www.le.com/favicon.ico
// @include          *://www.le.com/*
// @include          *://tv.le.com/*
// @include          *://movie.le.com/*
// @include          *://sports.le.com/*
// @grant             none
// @run-at           document-start
// @namespace        
// @downloadURL https://update.greasyfork.org/scripts/27241/%E4%B9%90%E8%A7%86HTML5%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/27241/%E4%B9%90%E8%A7%86HTML5%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
Object.defineProperty(navigator, 'plugins', {
  get: function () {
    return { length: 0 };
  }
});
Object.defineProperty(navigator,"userAgent",{value:"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-US) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27",writable:false,configurable:false,enumerable:true});