// ==UserScript==
// @name         智学网自欺欺人改分脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  考的差？分数低？不存在的
// @author       b站@一只会玩电脑的fish
// @match        https://www.zhixue.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476066/%E6%99%BA%E5%AD%A6%E7%BD%91%E8%87%AA%E6%AC%BA%E6%AC%BA%E4%BA%BA%E6%94%B9%E5%88%86%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/476066/%E6%99%BA%E5%AD%A6%E7%BD%91%E8%87%AA%E6%AC%BA%E6%AC%BA%E4%BA%BA%E6%94%B9%E5%88%86%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

window.onload = (function() {
    'use strict';

    console.log("Start OK");
    var wantnum;
    var wantonenum;

    console.log("time sleep");
    setTimeout(function () {
        wantnum = document.querySelector('span.specific').innerText.replace(/[^0-9]/ig,"");
        //console.log(wantnum);
        document.querySelector('.increase').innerText = wantnum;
        //Write the total score
        //写总分

        wantonenum = document.querySelector('span.ml_10').innerText.replace(/[^0-9]/ig,"");
        let lis = document.querySelectorAll('.blue');
        lis.forEach(function (li) {
            li.innerText=wantonenum;
        })
        //Write each section
        //写入每一科

    }, 1700);



})();