// ==UserScript==
// @name         远景论坛清爽浏览
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除广告，优化阅读
// @author       Bingnme
// @license      MIT
// @match        https://bbs.pcbeta.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466695/%E8%BF%9C%E6%99%AF%E8%AE%BA%E5%9D%9B%E6%B8%85%E7%88%BD%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/466695/%E8%BF%9C%E6%99%AF%E8%AE%BA%E5%9D%9B%E6%B8%85%E7%88%BD%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取元素
    var body = document.body;
    var toptb = document.getElementById("toptb");
    var hd = document.getElementById("hd");
    var wp = document.getElementById("wp");
    var ct = document.getElementById("ct");



    body.innerHTML = ""; // 清空 body 的内容
    body.appendChild(toptb);//保留登录按钮
    body.appendChild(hd); // 把 hd 元素添加到 body 中
    body.appendChild(wp); // 把 wp 元素添加到 body 中
    wp.innerHTML = "";
    wp.appendChild(ct);


    var a_pt = document.querySelectorAll(".a_pt");//获取a_pt元素
    for (var i = 0; i < a_pt.length; i++) {
      a_pt[i].style.display = 'none'; // 将所有匹配的元素的 display 样式设置为 none,从而隐藏它们
    }

})();