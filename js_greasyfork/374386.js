// ==UserScript==
// @name         直接跳转程序园到原地址
// @namespace    http://www.voidcn.com
// @version      0.1
// @description  try to take over the world!
// @author       ztcaoll222
// @match        http://www.voidcn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374386/%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E7%A8%8B%E5%BA%8F%E5%9B%AD%E5%88%B0%E5%8E%9F%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/374386/%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E7%A8%8B%E5%BA%8F%E5%9B%AD%E5%88%B0%E5%8E%9F%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    var originfo = document.getElementById("originfo");
    var targetUrl = originfo.text;
    location.href = targetUrl;
})();
