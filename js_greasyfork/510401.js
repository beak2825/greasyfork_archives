// ==UserScript==
// @name         我的第一个油猴脚本
// @namespace    my first js
// @version      2024-09-26
// @description  我的第一个油猴脚本测试
// @author       zz
// @match        *://*/*
// @grant        none
// @license.     MIT
// @downloadURL https://update.greasyfork.org/scripts/510401/%E6%88%91%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/510401/%E6%88%91%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        console.log("我是油猴插件的代码!");
        alert("你好啊！")
    };
})();