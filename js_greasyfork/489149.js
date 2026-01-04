// ==UserScript==
// @name         publink-free-dd
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  publink-free-dd 钉钉
// @author       huangbc
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489149/publink-free-dd.user.js
// @updateURL https://update.greasyfork.org/scripts/489149/publink-free-dd.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(() => {
  if (window.dd && !window.dd.version) {
    window.dd.version = '4.0.0'
  }
}, 100)


})();