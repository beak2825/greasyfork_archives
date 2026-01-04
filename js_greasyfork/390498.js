// ==UserScript==
// @name         河南建造师安管人员继续教育-刷课-自动播放
// @namespace    https://www.tuziang.com/combat/2247.html
// @version      0.3
// @description  自动提交和播放下一节
// @author       tuziang
// @match        *://henan*.ok99ok99.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390498/%E6%B2%B3%E5%8D%97%E5%BB%BA%E9%80%A0%E5%B8%88%E5%AE%89%E7%AE%A1%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E5%88%B7%E8%AF%BE-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/390498/%E6%B2%B3%E5%8D%97%E5%BB%BA%E9%80%A0%E5%B8%88%E5%AE%89%E7%AE%A1%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E5%88%B7%E8%AF%BE-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setInterval(function () {
    var right = document.getElementById("rightiframe").contentWindow.document
    var left = document.getElementById("leftiframe").contentWindow.document
    if(right.getElementById("SaveStudyRecord").disabled !== true){
        right.getElementById("SaveStudyRecord").click()
        var lists = left.getElementsByClassName("nofinished")
        lists[0].getElementsByTagName("a")[0].click()
    }
},2000)
})();