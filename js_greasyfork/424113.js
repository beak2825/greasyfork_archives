// ==UserScript==
// @name         NoBaidu
// @name:zh-CN   不上百度
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Jump to Google when visit Baidu.
// @description:zh-cn   在访问百度的时候跳到 Google。
// @author       Kevin Guo
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424113/NoBaidu.user.js
// @updateURL https://update.greasyfork.org/scripts/424113/NoBaidu.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    window.location = "https://www.google.com/";
})();