// ==UserScript==
// @name         去除贴吧搜索框自动选中
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除百度贴吧搜索框自动选中
// @author       yzj957x
// @license MIT
// @match        *://tieba.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jsons.cn
// @grant        https://imgsa.baidu.com/forum/pic/item/a6efce1b9d16fdfa6291460ab98f8c5495ee7b51.jpg
// @downloadURL https://update.greasyfork.org/scripts/445992/%E5%8E%BB%E9%99%A4%E8%B4%B4%E5%90%A7%E6%90%9C%E7%B4%A2%E6%A1%86%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/445992/%E5%8E%BB%E9%99%A4%E8%B4%B4%E5%90%A7%E6%90%9C%E7%B4%A2%E6%A1%86%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD.meta.js
// ==/UserScript==

(function() {
    document.getElementById('wd1').select=null;
})();