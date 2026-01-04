// ==UserScript==
// @name         浏览器自动翻页插件（baidu、google、bing）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  这是一个帮助你高效使用搜索引擎的插件，使用这个插件可以在搜索引擎中快速向前、向后翻页。
// @author       sandysyan
// @match
// @grant        none
// @icon https://raw.githubusercontent.com/c17abab/pics/master/%E5%A4%B4%E5%83%8F.jpg
// @使用方法：
// ctrl + ->：向后翻页
// ctrl + <-：向前翻页
// 目前支持以下站点：
// @include         *://www.baidu.com/*
// @include         *://www.google.com/*
// @include         *://cn.bing.com/*


// @downloadURL https://update.greasyfork.org/scripts/381099/%E6%B5%8F%E8%A7%88%E5%99%A8%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E6%8F%92%E4%BB%B6%EF%BC%88baidu%E3%80%81google%E3%80%81bing%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/381099/%E6%B5%8F%E8%A7%88%E5%99%A8%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E6%8F%92%E4%BB%B6%EF%BC%88baidu%E3%80%81google%E3%80%81bing%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    document.onkeydown=function(e){
        var dom;
        var i;

        var isie = (document.all) ? true:false;
        var key;
        if(isie){
            key = window.event.keyCode;
        }else{
            key = e.which;
        }
        if(!e.ctrlKey){
            return;
        }

        if(key==37){
            // left
            if(location.href.indexOf("bing") > 0 && location.href.indexOf("bing") < 20) {
                dom = document.getElementsByTagName("a");
                for(i = 0; i < dom.length; i++){
                    if (dom[i].getAttribute("title") === "上一页"){
                        dom[i].click();
                    }
                }
            }else if(location.href.indexOf("google") > 0 && location.href.indexOf("google") < 20) {
                dom = document.getElementsByTagName("span");
                for(i = 0; i < dom.length; i++){
                    if(dom[i].innerText === "上一页"){
                        dom[i].click();
                    }
                }
            } else if (location.href.indexOf("baidu") > 0 && location.href.indexOf("baidu") < 20) {
                dom = document.getElementsByTagName("a");
                for(i = 0; i < dom.length; i++){
                    if(dom[i].innerText === "<上一页"){
                        dom[i].click();
                    }
                }
            }

        } else if(key==38){
            //alert('top');
        } else if(key==39){
            // right
            if(location.href.indexOf("bing") > 0 && location.href.indexOf("bing") < 20) {
                dom = document.getElementsByTagName("a");
                for(i = 0; i < dom.length; i++){
                    if (dom[i].getAttribute("title") === "下一页"){
                        dom[i].click();
                    }
                }
            } else if(location.href.indexOf("google") > 0 && location.href.indexOf("google") < 20) {
                dom = document.getElementsByTagName("span");
                for(i = 0; i < dom.length; i++){
                    if(dom[i].innerText === "下一页"){
                        dom[i].click();
                    }
                }
            } else if (location.href.indexOf("baidu") > 0 && location.href.indexOf("baidu") < 20) {
                dom = document.getElementsByTagName("a");
                for(i = 0; i < dom.length; i++){
                    if(dom[i].innerText === "下一页>"){
                        dom[i].click();
                    }
                }
            }

        } else if(key==40){
            //alert('down');
        }
    };
})();

