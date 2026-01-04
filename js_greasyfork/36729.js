// ==UserScript==
// @name pan.download
// @namespace Violentmonkey Scripts
// @match *://pan.baidu.com/*
// @grant none
// @run-at       document-start
// @description 百度一键大文件下载，更新于2018.01.26
// @version 0.0.1.20180126075854
// @downloadURL https://update.greasyfork.org/scripts/36729/pandownload.user.js
// @updateURL https://update.greasyfork.org/scripts/36729/pandownload.meta.js
// ==/UserScript==
var ua = 'Mozilla/5.0 (Linux; Android 8.0.0; G8142 Build/47.1.A.8.49) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3117.2 Mobile Safari/537.36'

Object.defineProperty(Object.getPrototypeOf(navigator), 'platform', { 
  value: 'Linux armv8I',  // 安卓系统
  enumerable: true,
  writable: true,
  configurable: true,
})
Object.defineProperty(Object.getPrototypeOf(navigator), 'userAgent', { 
  value: ua,  // chrome  浏览器
  enumerable: true,
  writable: true,
  configurable: true,
})
