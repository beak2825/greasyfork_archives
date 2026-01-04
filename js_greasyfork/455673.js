// ==UserScript==
// @name         强制彩色
// @namespace    https://3never.life/
// @version      1.0.8
// @description  强制所有网站使用彩色
// @author       3never
// @match        *://*/*
// @exclude      *://*.youtube.com/*
// @exclude      *://*.reddit.com/*
// @exclude      *://twitter.com/*
// @exclude      *://*.google.com/*
// @icon         https://i2.100024.xyz/2022/11/30/ukf7tm.webp
// @grant        none
// @license      MIT
// @supportURL   https://github.com/3never/force-colorful
// @downloadURL https://update.greasyfork.org/scripts/455673/%E5%BC%BA%E5%88%B6%E5%BD%A9%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/455673/%E5%BC%BA%E5%88%B6%E5%BD%A9%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let divCount=0
    function 修改节点filter(node){
        let style = window.getComputedStyle(node,null).filter
        if(style=='grayscale(1)'||style=='grayscale(100%)'){
            node.style.setProperty('filter', 'grayscale(0)', 'important');
        }
    }
    function changeFilterByTag(tag){
        var nodes = document.getElementsByTagName(tag);
        for (var i = 0; i < nodes.length; i++) {
            修改节点filter(nodes[i])
        }
    }
    function 黑白清零(){
        let curCount = document.getElementsByTagName("div").length;
        if(divCount != curCount){
            修改节点filter(document.documentElement)
            修改节点filter(document.body)
            changeFilterByTag("div")
            changeFilterByTag("form")
            changeFilterByTag("img")
            divCount = curCount
        }
    }
    // B站
    var patt1=new RegExp("bilibili.com");
    if(patt1.test(window.location.href)){
        document.documentElement.style.setProperty('filter', 'grayscale(0)', 'important');
        return
    }
    // hypergryph.com
    var patt2=new RegExp("hypergryph.com");
    if(patt2.test(window.location.href)){
        document.documentElement.style.setProperty('filter', 'grayscale(0)', 'important');
        document.body.style.setProperty('filter', 'grayscale(0)', 'important');
        return
    }
    黑白清零();
    setInterval(function(){ 黑白清零(); }, 3000);
})();