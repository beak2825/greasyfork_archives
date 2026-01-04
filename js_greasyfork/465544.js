// ==UserScript==
// @name         空管网络大学课程自动学习助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  弹窗时自动消除
// @author       xxx
// @match        https://kgzgkc.caacmooc.org/adks-spcrm/videoPlay/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=caacmooc.org
// @grant        none
// @license      CC BY-NC 3.0 CN
// @downloadURL https://update.greasyfork.org/scripts/465544/%E7%A9%BA%E7%AE%A1%E7%BD%91%E7%BB%9C%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/465544/%E7%A9%BA%E7%AE%A1%E7%BD%91%E7%BB%9C%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var intervalReturn= setInterval(() => {
        //console.log("扫描ing")
        let jixu =document.getElementById("jxstudy")
        let target = document.getElementsByClassName("toshare")
        if(target&&target[0]&&target[0].display=="none") return
        if(!jixu) return
        jixu.click()
        //console.log("监控到~~~");
    }, 5000);
})();