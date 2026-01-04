// ==UserScript==
// @name         补天社区阅读模式
// @namespace    http://tampermonkey.net/
// @version      2024-09-11
// @description  移除侧边栏,优化title
// @author       Mrxn
// @homepage     https://mrxn.net/
// @match        https://forum.butian.net/share/*
// @match        https://forum.butian.net/article/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=butian.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494414/%E8%A1%A5%E5%A4%A9%E7%A4%BE%E5%8C%BA%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/494414/%E8%A1%A5%E5%A4%A9%E7%A4%BE%E5%8C%BA%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function modify_title(){
        document.title = document.title.replace('奇安信攻防社区-','');
        setTimeout(function() { document.querySelector("body > div.wrap > div > div > div.col-xs-12.col-md-9.main > div.widget-article > h3").innerText=document.title; },1000);
    }
    function right_remove(){
        document.querySelector("body > div.wrap > div > div > div.col-xs-12.col-md-3.side").remove();
        document.querySelector("#template").remove();
        document.querySelector("body > div.wrap > div > div > div.mobile-toc-wrapper.visible-xs").remove();
        document.getElementsByClassName("col-xs-12 col-md-9 main")[0].style.width="100%";
    }
    document.addEventListener("scroll",function() {
        if(document.querySelector("body > div.wrap > div > div > div.col-xs-12.col-md-3.side")){
            modify_title();
            right_remove();
        }
    });
})();