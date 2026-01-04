// ==UserScript==
// @name         微软文档修改默认语言
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  try to take over the world!
// @author       You
// @match        https://*.microsoft.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/420266/%E5%BE%AE%E8%BD%AF%E6%96%87%E6%A1%A3%E4%BF%AE%E6%94%B9%E9%BB%98%E8%AE%A4%E8%AF%AD%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/420266/%E5%BE%AE%E8%BD%AF%E6%96%87%E6%A1%A3%E4%BF%AE%E6%94%B9%E9%BB%98%E8%AE%A4%E8%AF%AD%E8%A8%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var reg = /.microsoft\.com\/(en-us|zh-tw)/;
    var str = window.location.href;
    if (reg.test(window.location.href) &&
        confirm('是否将语言切换为中文')) {
        str = str.replace('en-us', 'zh-cn');
        str = str.replace('zh-tw', 'zh-cn');
        window.location.href = str;
    }
})();