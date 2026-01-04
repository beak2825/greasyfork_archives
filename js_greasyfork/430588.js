/* eslint-env browser */

// ==UserScript==
// @name         Amazon HEVC Enabler
// @namespace    nyuszika7h@gmail.com
// @version      0.1.7
// @description  Enable HEVC streams for Amazon Video
// @author       nyuszika7h
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.primevideo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430588/Amazon%20HEVC%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/430588/Amazon%20HEVC%20Enabler.meta.js
// ==/UserScript==

(function () {
  'use strict';
  (function (open) {
    XMLHttpRequest.prototype.open = function () {
      arguments[1] = arguments[1].replace('deviceVideoCodecOverride=H264', 'deviceVideoCodecOverride=H265').replace('~', '')
      open.apply(this, arguments)
    }
  })(XMLHttpRequest.prototype.open)
})()