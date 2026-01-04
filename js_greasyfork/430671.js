/* eslint-env browser */

// ==UserScript==
// @name         Amazon HEVC Enabler
// @namespace    nyuszika7h@gmail.com
// @version      0.1.4
// @description  Enable HEVC streams for Amazon Video
// @author       nyuszika7h
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.primevideo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430671/Amazon%20HEVC%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/430671/Amazon%20HEVC%20Enabler.meta.js
// ==/UserScript==

(function () {
  'use strict';
  (function (open) {
    XMLHttpRequest.prototype.open = function () {
      arguments[1] = arguments[1].replace('deviceVideoQualityOverride=HD', 'deviceVideoQualityOverride=UHD')
      open.apply(this, arguments)
    }
  })(XMLHttpRequest.prototype.open)
})()