// ==UserScript==
// @name         adblock-helper
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  绕过使用js代码检测广告
// @author       weiye
// @match        https://rx.nodejs.cn/*
// @icon         https://rx.nodejs.cn/assets/images/favicons/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489465/adblock-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/489465/adblock-helper.meta.js
// ==/UserScript==

(function() {
  'use strict';
  window._AdBlockInit = true;
})();