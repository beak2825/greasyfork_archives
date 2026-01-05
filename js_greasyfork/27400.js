// ==UserScript==
// @name             Firefox-虎牙HTML5播放
// @description      通过修改Firefox的ua为Chrome,使虎牙自动启用HTML5播放器
// @author           nftbty
// @version          0.2
// @icon             http://www.huya.com/favicon.ico
// @match            *://*.huya.com/*
// @grant            none
// @run-at           document-start
// @namespace        
// @downloadURL https://update.greasyfork.org/scripts/27400/Firefox-%E8%99%8E%E7%89%99HTML5%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/27400/Firefox-%E8%99%8E%E7%89%99HTML5%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
Object.defineProperty(navigator, 'plugins', {
  get: function () {
    return { length: 0 };
  }
});
Object.defineProperty(navigator,"userAgent",{value:"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",writable:false,configurable:false,enumerable:true});