// ==UserScript==
// @name         我要看 python 中文文档！
// @namespace    https://github.com/F-park/python-docs-redirect
// @version      0.1
// @description  自动跳转 python 中文文档
// @author       F-park
// @match        https://docs.python.org/*/3*/*
// @match        https://docs.python.org/3*/*
// @icon         https://docs.python.org/3/_static/py.svg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513160/%E6%88%91%E8%A6%81%E7%9C%8B%20python%20%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/513160/%E6%88%91%E8%A6%81%E7%9C%8B%20python%20%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.referrer != '' &&
        new URL(document.referrer).pathname.startsWith('/zh-cn')) {
        // 从中文文档来的就返回
        return;
    }

    if (location.pathname.startsWith('/3')) {
        // 从英文文档来的
        location.pathname = "zh-cn" + location.pathname;
    } else {
        // 从其他语言文档来的
        location.pathname = location.pathname.replace(/\/.*?(?=\/)/, '/zh-cn');
    }
})();