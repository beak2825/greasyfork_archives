// ==UserScript==
// @name         百度知道baiduzhidao去除复制答案的垃圾文字，自动展开答案
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  展开百度知道答案，去除答案里面各种垃圾文字，方便复制
// @author       jeterlee
// @match        https://zhidao.baidu.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420062/%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93baiduzhidao%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E7%AD%94%E6%A1%88%E7%9A%84%E5%9E%83%E5%9C%BE%E6%96%87%E5%AD%97%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/420062/%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93baiduzhidao%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E7%AD%94%E6%A1%88%E7%9A%84%E5%9E%83%E5%9C%BE%E6%96%87%E5%AD%97%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(function () {
        var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        var zhankai = document.getElementsByClassName('wgt-answers-showbtn');
        for (var ii = 0; ii < zhankai.length; ii++) {
            zhankai[ii].dispatchEvent(e);
        }
        document.getElementById("show-answer-hide").dispatchEvent(e);
        document.getElementsByClassName('wgt-best-showbtn')[0].dispatchEvent(e);
        var spanList = document.getElementById('qb-content').getElementsByTagName('span');
        var sumAtt = 0;
        for (var i = 0; i < spanList.length; i++) {
            if (spanList[i].offsetHeight <= 1) { //判定垃圾文字容器
                spanList[i].innerHTML = '';
                spanList[i].remove(); //删除垃圾文字
                sumAtt++;
            }
        }
        console.log('发现垃圾文字' + sumAtt + '个，已处理');
    }, 1600);
})();