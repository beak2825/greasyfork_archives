// ==UserScript==
// @name         百度去除右侧热点
// @namespace    http://zjfhome.320.io
// @version      0.1
// @description  屏蔽广告请用别的脚本配合使用,本脚本只用于去除右侧热点。轻量自用
// @author       zjf-a961011576@qq.com
// @match        *://*.baidu.com/*
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/403229/%E7%99%BE%E5%BA%A6%E5%8E%BB%E9%99%A4%E5%8F%B3%E4%BE%A7%E7%83%AD%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/403229/%E7%99%BE%E5%BA%A6%E5%8E%BB%E9%99%A4%E5%8F%B3%E4%BE%A7%E7%83%AD%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //需要屏蔽的dom列表
    let noneList=[]
    let dom = document.querySelectorAll('.cr-content')
    noneList.push(dom[dom.length-1])
    noneList.forEach(dom=>{dom.style.display='none'})
    // Your code here...
})();