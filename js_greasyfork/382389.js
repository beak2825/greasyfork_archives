// ==UserScript==
// @name         cnblog 博客园自动展开所有需要点加号的代码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  博客园自动展开所有需要点加号的代码
// @author       Donald Wu
// @match        *://www.cnblogs.com/*
// @grant        none
// require       //cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382389/cnblog%20%E5%8D%9A%E5%AE%A2%E5%9B%AD%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E6%89%80%E6%9C%89%E9%9C%80%E8%A6%81%E7%82%B9%E5%8A%A0%E5%8F%B7%E7%9A%84%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/382389/cnblog%20%E5%8D%9A%E5%AE%A2%E5%9B%AD%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E6%89%80%E6%9C%89%E9%9C%80%E8%A6%81%E7%82%B9%E5%8A%A0%E5%8F%B7%E7%9A%84%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
   $(".cnblogs_code").click();
})();
