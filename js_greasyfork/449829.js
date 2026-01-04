// ==UserScript==
// @name         快速切换百度和谷歌搜索引擎移动端
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在移动端的谷歌和百度搜索之间来回跳转
// @author       我自己
// @match          *://*.baidu.com/*
// @include        *://*.google.tld/*
// @match        https://www.google.com/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/449829/%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2%E7%99%BE%E5%BA%A6%E5%92%8C%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E7%A7%BB%E5%8A%A8%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/449829/%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2%E7%99%BE%E5%BA%A6%E5%92%8C%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E7%A7%BB%E5%8A%A8%E7%AB%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /********************************
    根据域名地址，判断当前应该用哪个规则
*********************************/
var domain = document.domain;
console.log(domain);
if (domain.match("baidu")){
    console.log("当前网址是百度"+ domain);
    var url = "https://www.google.com/search?q=";
    var input = document.getElementById("kw").value;
    var enginename = "谷歌";

    /****************************************
        创建一个a标签，里面是span标签，内容是“谷歌”。
    *****************************************/
    var newNode = document.createElement("a");
    newNode.setAttribute("class","se-tabitem");
    var spannode = document.createElement("span");
    newNode.appendChild(spannode);
    spannode.innerHTML="谷歌";
    //设置属性
    newNode.setAttribute("href",url+input);

    //用insertNode函数向页面插入节点
    var insertedNode  = document.querySelectorAll("div.se-tab-lists")[0];
    var referenceNode = document.querySelectorAll("a.se-tabitem")[1];
    insertedNode .insertBefore(newNode, referenceNode);
}
if (domain.match("google")){
    console.log("当前网址是谷歌"+ domain);
    var url = "https://m.baidu.com/s?word=";
    var input = document.querySelector('input[name="q"]').value;
    var enginename = "百度";

    /****************************************
        创建一个a标签，里面是span标签，内容是“谷歌”。
    *****************************************/
    var newNode = document.createElement("div");
    newNode.setAttribute("class","hdtb-mitem");
    var spannode = document.createElement("a");
    newNode.appendChild(spannode);
    spannode.innerHTML="百度";
    //设置属性
    spannode.setAttribute("href",url+input);

    //用insertNode函数向页面插入节点
    var insertedNode  = document.querySelectorAll("div.IC1Ck")[0];
    console.log(insertedNode);
    var referenceNode = document.querySelectorAll("div.hdtb-mitem")[1];
    console.log(referenceNode);
    insertedNode .insertBefore(newNode, referenceNode);
}
})();