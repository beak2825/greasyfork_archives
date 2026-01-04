// ==UserScript==
// @name         超星自动填问卷 but版
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  BUT版，懂得都懂，不懂的可以看代码
// @author       太鼓达人
// @match        *.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452055/%E8%B6%85%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E9%97%AE%E5%8D%B7%20but%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/452055/%E8%B6%85%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E9%97%AE%E5%8D%B7%20but%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //线下
    var a1 = document.querySelector(".singleChoose input[name='616111'][value='2']");
    if (a1==null)
    {return;}
    a1.click();
    //人数
    var a2 = document.getElementById("3_1").querySelector("input[name='616122_1']").value = 0;
    var a3 = document.getElementById("3_2").querySelector("input[name='616123_1']").value = 0;
    //满意度
    var b1 = document.querySelector(".singleChoose input[name='616124'][value='1']").click();
    var b2 = document.querySelector(".singleChoose input[name='616125'][value='1']").click();
    var b3 = document.querySelector(".singleChoose input[name='616126'][value='1']").click();
    var b4 = document.querySelector(".singleChoose input[name='616127'][value='1']").click();
    var b5 = document.querySelector(".singleChoose input[name='616128'][value='1']").click();
    var b6 = document.querySelector(".singleChoose input[name='616129'][value='1']").click();
    //课堂状态
    var c1 = document.querySelector(".singleChoose input[name='616130'][value='1']").click();
    var c2 = document.getElementById("5_2").querySelector("input[name='616131']").value = 100;
    //其他
    var d1 = document.querySelector(".singleChoose input[name='616132'][value='2']").click();
    var d2 = document.getElementById("6_3").querySelector("textarea[name='616134']").value='无';
    console.log('填写完毕请提交');
    var submit = document.querySelector(".botBtnBox a[onclick='save(2);']");
    submit.click();
    var check = document.getElementsByClassName("layui-layer-btn0")[0];
    check.click();
    console.log("提交完成");
})();