// ==UserScript==
// @name         CSDN去广告
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       nanfang
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @match        *://bbs.csdn.net/topics/*
// @match        *://*.iteye.com/blog/*
// @grant        none
// @icon         https://csdnimg.cn/public/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/399768/CSDN%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/399768/CSDN%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var myRemove=function(element){
        if(element){
           element.remove();
        }
    }
    var removeClassList=function(name){
        var list=document.getElementsByClassName(name);
        var length=list.length;
        for(let i=0;i<length;i++){
            list[0].remove();
            //list[0].parentNode.removeChild(list[0]);
        }
    }
    $(document).ready(function(){
        var advertising=document.getElementsByClassName("csdn-tracking-statistics mb8 box-shadow")[0];
        console.log(advertising);
        myRemove(advertising);
        var footer=document.getElementById("asideFooter").children[0];
        myRemove(footer);
        var footer_2=document.getElementById("dmp_ad_58").children[0];
        myRemove(footer_2);
        removeClassList("recommend-item-box recommend-recommend-box")
        removeClassList("recommend-item-box blog-expert-recommend-box");
    });
})();