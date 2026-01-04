// ==UserScript==
// @name         我的第一个油猴脚本
// @namespace    http://tampermonkey.net/
// @version      2025-07-07
// @description  ==================
// @author       You
// @match        https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIt
// @downloadURL https://update.greasyfork.org/scripts/542119/%E6%88%91%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/542119/%E6%88%91%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('这是我的第一个油猴脚本')

    console.log('脚本环境的window', window)
    console.log('网页环境的window', unsafeWindow)

})();