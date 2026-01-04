// ==UserScript==
// @name         合工大评教自动勾选
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点进教师评测页面自动打勾，默认全优，点击提交即可
// @author       baldmancc01
// @match        http://jxglstu.hfut.edu.cn/eams5-student/for-std/lesson-survey/start-survey/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438450/%E5%90%88%E5%B7%A5%E5%A4%A7%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/438450/%E5%90%88%E5%B7%A5%E5%A4%A7%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89.meta.js
// ==/UserScript==

(function() {
    window.onload = function(){
        var groups = document.getElementsByClassName('group');
        for(var i = 0 ; i < groups.length ; i++) {
            groups[i].getElementsByTagName('input')[0].click()
        }
    }
})();