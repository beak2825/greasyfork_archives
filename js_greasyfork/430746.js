/* eslint-env browser */

// ==UserScript==
// @name         Amazon DD+ 5.1 Enabler
// @namespace    nyuszika7h@gmail.com
// @version      0.1.6
// @description  Enable DD+ 5.1 Audio for Amazon Video
// @author       nyuszika7h
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.primevideo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430746/Amazon%20DD%2B%2051%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/430746/Amazon%20DD%2B%2051%20Enabler.meta.js
// ==/UserScript==

(function () {
  'use strict';
  (function (open) {
    XMLHttpRequest.prototype.open = function () {
      arguments[1] = arguments[1].replace('~', '')
      open.apply(this, arguments)
    }
  })(XMLHttpRequest.prototype.open)
})()