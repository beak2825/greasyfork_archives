// ==UserScript==
// @name         恺睿教育自动点击挂机验证
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       MC_jjk
// @match        https://www.career99.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410030/%E6%81%BA%E7%9D%BF%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%8C%82%E6%9C%BA%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/410030/%E6%81%BA%E7%9D%BF%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%8C%82%E6%9C%BA%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.info("脚本开始执行！")
    setInterval(function() {
        console.info("脚本执行！")
        var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        var b = document.getElementsByClassName("punch-time"); b[0].dispatchEvent(e);
    }, 60000);
})();