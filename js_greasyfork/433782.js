// ==UserScript==
// @name         英文页面跳转到中文
// @version      0.1
// @namespace    https://greasyfork.org/zh-CN/users/452492-0x400
// @description  一些开发文档网站英文页面跳转到中文
// @author       0x400
// @match        https://www.php.net/manual/*
// @match        https://developer.mozilla.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433782/%E8%8B%B1%E6%96%87%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%E5%88%B0%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/433782/%E8%8B%B1%E6%96%87%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%E5%88%B0%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(location.href.match(/\/en-(\w+)\//)){
       location.href=location.href.replace(/\/en\//, '/zh/').replace(/\/en-(\w+)\//, '/zh-cn/');
    }
})();