// ==UserScript==
// @name         任务栏搜索防中国区
// @namespace    https://greasyfork.org/zh-CN/users/4522-lychichem
// @version      1.0.3
// @description  防止任务栏搜索的中国区页面污染浏览器bing区域
// @author       lychichem
// @license      MIT
// @include      /^https?:\/\/www\.bing\.com(\/|\/videos\/|\/images\/|\/maps\/|\/academic\/)search\?q=(.*)&cc=CN(.*)
// @include      /^https?:\/\/www\.bing\.com\/copilotsearch\?setlang=zh-cn&cc=CN(.*)
// @icon         https://www.bing.com/sa/simg/favicon-trans-bg-blue-mg.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/463607/%E4%BB%BB%E5%8A%A1%E6%A0%8F%E6%90%9C%E7%B4%A2%E9%98%B2%E4%B8%AD%E5%9B%BD%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/463607/%E4%BB%BB%E5%8A%A1%E6%A0%8F%E6%90%9C%E7%B4%A2%E9%98%B2%E4%B8%AD%E5%9B%BD%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url = window.location.href;
    let new_url = url.replace("&cc=CN", "&cc=hk");
    window.location.href = new_url;
})();