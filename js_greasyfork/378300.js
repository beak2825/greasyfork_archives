// ==UserScript==
// @name         MSDN中英切换
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  switch Chinese/English language in MSDN
// @author       dangoron
// @match        http*://msdn.microsoft.com/en-us/*
// @match        http*://msdn.microsoft.com/zh-cn/*
// @match        http*://docs.microsoft.com/en-us/*
// @match        http*://docs.microsoft.com/zh-cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378300/MSDN%E4%B8%AD%E8%8B%B1%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/378300/MSDN%E4%B8%AD%E8%8B%B1%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==
var Scrollposition ;
(function() {
    'use strict';

    //获得滚动条距离顶部位置
    function getScrollTop(){
        var scrollTop=0;
        if(document.documentElement&&document.documentElement.scrollTop){
            scrollTop=document.documentElement.scrollTop;
        }else if(document.body){
            scrollTop=document.body.scrollTop;
        }
        return scrollTop;
    }
    var url = location.href;
    var a = document.createElement('span');
    function create_button(){
        var css = '    background-color:#8763c5;text-align:center;opacity:0.7;color:white;cursor:pointer;position:fixed;bottom:70%;width:45px;height:25px;right:10px;z-index:9999';
        a.style.cssText = css;
        a.innerHTML ='中/英';
        a.addEventListener('mouseover', function(){ a.style.opacity = 1;}, false);
        a.addEventListener('mouseout', function(){ a.style.opacity = 0.7; }, false);
        a.addEventListener('click', function(){
            Scrollposition = getScrollTop();
            url += "?px="+ Scrollposition;
            if (url.search(/\/en-us\//) != -1){
                window.location.replace(url.replace(/\/en-us\//,'\/zh-cn\/'));
            }
            if (url.search(/\/zh-cn\//) != -1){
                window.location.replace(url.replace(/\/zh-cn\//,'\/en-us\/'));
            }
        }, false );
        document.body.appendChild(a);
    }
    create_button();
})();
var lastIndex = window.location.href.lastIndexOf("?");
var px = window.location.href.substring(lastIndex+4,window.location.href.lenght);
window.scrollTo(0,px);