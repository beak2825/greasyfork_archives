// ==UserScript==
// @name         成都继续教育自动确定2020年12月28日更新
// @namespace    https://hehome.xyz/
// @version      0.1.2
// @description  跳过提示确认的对话框
// @author       hemengyang
// @updater      legend02uwn
// @match        *://www.cdjxjy.com/*
// @downloadURL https://update.greasyfork.org/scripts/419269/%E6%88%90%E9%83%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%A1%AE%E5%AE%9A2020%E5%B9%B412%E6%9C%8828%E6%97%A5%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/419269/%E6%88%90%E9%83%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%A1%AE%E5%AE%9A2020%E5%B9%B412%E6%9C%8828%E6%97%A5%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var confirm = function () {
        return true;
    };
    window.confirm = function () {
        return true;
    };
})();