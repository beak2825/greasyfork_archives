// ==UserScript==
// @name        BaiduPanDownloadHelper 2nd
// @namespace   HirahPan
// @author         HirahPan
// @description BaiduPanDownloadHelper
// @version     1
// @grant       none
// @run-at       document-start
// @include  http://pan.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/19323/BaiduPanDownloadHelper%202nd.user.js
// @updateURL https://update.greasyfork.org/scripts/19323/BaiduPanDownloadHelper%202nd.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
Object.defineProperty(navigator, 'platform', {
  value: 'sb_baidu',
  writable: false,
  configurable: false,
  enumerable: true
});
