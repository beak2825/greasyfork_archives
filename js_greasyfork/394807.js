// ==UserScript==
// @name         知乎界面美化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  移除侧边栏，最大化主题内容，移除导航栏。
// @author       sky-gg
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394807/%E7%9F%A5%E4%B9%8E%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/394807/%E7%9F%A5%E4%B9%8E%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
setTimeout(function(){
    // Your code here...
    let head = document.getElementsByTagName('header')[0];
    let main = document.getElementsByClassName('Topstory-mainColumn')[0];
    let side = document.getElementsByClassName('GlobalSideBar')[0];
    let Qmain = document.getElementsByClassName('Question-mainColumn')[0];
    let Qside = document.getElementsByClassName('Question-sideColumn')[0];
    if(head){
        head.parentElement.removeChild(head)
    }
    if(main){
        main.style.width = '100%'
    }
    if(side){
        side.parentElement.removeChild(side)
    }
    if(Qmain){
        Qmain.style.width = '100%'
    }
    if(Qside){
        Qside.parentElement.removeChild(Qside)
    }
},3000)
})();