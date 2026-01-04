// ==UserScript==
// @name         自动激活页面防锁定
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        http://http://d.gd.189.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370443/%E8%87%AA%E5%8A%A8%E6%BF%80%E6%B4%BB%E9%A1%B5%E9%9D%A2%E9%98%B2%E9%94%81%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/370443/%E8%87%AA%E5%8A%A8%E6%BF%80%E6%B4%BB%E9%A1%B5%E9%9D%A2%E9%98%B2%E9%94%81%E5%AE%9A.meta.js
// ==/UserScript==

(function() {
    //每隔1分钟切换页面可见性
    setInterval(function() {
        document.hidden = !document.hidden;
    }, 60000);
})();