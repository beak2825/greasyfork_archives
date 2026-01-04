// ==UserScript==
// @name         洛谷隐藏题目界面难度&标签&题解
// @namespace    http://tampermonkey.net/
// @version      0.3-dev
// @description  None
// @author       928418
// @match        https://www.luogu.com.cn/problem/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/513238/%E6%B4%9B%E8%B0%B7%E9%9A%90%E8%97%8F%E9%A2%98%E7%9B%AE%E7%95%8C%E9%9D%A2%E9%9A%BE%E5%BA%A6%E6%A0%87%E7%AD%BE%E9%A2%98%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/513238/%E6%B4%9B%E8%B0%B7%E9%9A%90%E8%97%8F%E9%A2%98%E7%9B%AE%E7%95%8C%E9%9D%A2%E9%9A%BE%E5%BA%A6%E6%A0%87%E7%AD%BE%E9%A2%98%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //题解界面直接禁掉
    if (window.location.pathname.includes("solution")) document.write("<h1>不许偷看题解！！！</h1>")
    //题目列表的难度
    var awa = document.querySelectorAll(".difficulty");
    awa.forEach(function(x){x.style.display = "none";});
    //标签同理
    awa = document.querySelectorAll(".tag");
    awa.forEach(function(x){x.style.display = "none";});
    //选择难度
    var sel = document.querySelector('svg.svg-inline--fa.fa-chevron-down').parentNode.parentNode;
    sel.style.display = "none";
    //难度隐藏
    var difficulties = document.querySelectorAll('span');
    var difficulty;
    difficulties.forEach(function(x){if (x.innerText == "难度") {difficulty = x;}});
    var container = difficulty.parentNode.parentNode;
    container.style.display = "none";
    //标签隐藏
    var tags = document.querySelectorAll('h3');
    var tagtitle;
    tags.forEach(function(x){if (x.innerText == "标签") {tagtitle = x;}});
    var block = tagtitle.parentNode;
    block.style.display = "none";
    //题解隐藏
    var svg = document.querySelectorAll("svg.svg-inline--fa.fa-book");
    svg.forEach(function(x){x.parentNode.style.display = "none";});
})();