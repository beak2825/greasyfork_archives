// ==UserScript==
// @name         淘宝产品上架的最初时间，仅限看C店
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *://*.taobao.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @downloadURL https://update.greasyfork.org/scripts/419975/%E6%B7%98%E5%AE%9D%E4%BA%A7%E5%93%81%E4%B8%8A%E6%9E%B6%E7%9A%84%E6%9C%80%E5%88%9D%E6%97%B6%E9%97%B4%EF%BC%8C%E4%BB%85%E9%99%90%E7%9C%8BC%E5%BA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/419975/%E6%B7%98%E5%AE%9D%E4%BA%A7%E5%93%81%E4%B8%8A%E6%9E%B6%E7%9A%84%E6%9C%80%E5%88%9D%E6%97%B6%E9%97%B4%EF%BC%8C%E4%BB%85%E9%99%90%E7%9C%8BC%E5%BA%97.meta.js
// ==/UserScript==

window.onload=(function() {
    'use strict';
    var obj = eval(g_config);
    var shijian = obj.idata.item.dbst;
    var shijianzhuanhuan = new Date(shijian).toLocaleString();
    alert("这个宝贝最初上架时间是"+shijianzhuanhuan)

    // Your code here...
})();