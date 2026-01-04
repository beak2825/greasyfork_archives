// ==UserScript==
// @name         修改超星论文查重（自慰）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  本地自慰修改查重率
// @author       H
// @match        http://dsa.dayainfo.com/*
// @icon         https://www.google.com/s2/favicons?domain=dayainfo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430364/%E4%BF%AE%E6%94%B9%E8%B6%85%E6%98%9F%E8%AE%BA%E6%96%87%E6%9F%A5%E9%87%8D%EF%BC%88%E8%87%AA%E6%85%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/430364/%E4%BF%AE%E6%94%B9%E8%B6%85%E6%98%9F%E8%AE%BA%E6%96%87%E6%9F%A5%E9%87%8D%EF%BC%88%E8%87%AA%E6%85%B0%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //定义按钮，以及文本框
var butn = document.createElement("button");
var textvalue = document.createElement("INPUT");
textvalue .setAttribute("type", "text");

//优化按钮
butn.innerText="修改";
butn.style.background="#757575";
butn.style.color="#fff";
//优化文本框
textvalue.size = "10";
textvalue.color="#ffff";
//触发点击事件
butn.onclick=function(){
var x = document.getElementsByClassName("li_2 similarpercent");
x[0].innerText = textvalue.value+"%";
};
//在网页中插入按钮以及文本框
var share = document.querySelector(".second_nav");
share.parentElement.append(butn,share);
share.parentElement.append(textvalue,share);
})();