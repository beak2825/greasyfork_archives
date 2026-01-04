// ==UserScript==
// @name         Android自动跳转国内网址
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  android.com国内不可访问，android.google.cn国内可访问，将前者自动跳转到后者
// @author       thunder-sword
// @match        *://developer.android.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=android.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474277/Android%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%9B%BD%E5%86%85%E7%BD%91%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/474277/Android%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%9B%BD%E5%86%85%E7%BD%91%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.location.host="developer.android.google.cn";
})();