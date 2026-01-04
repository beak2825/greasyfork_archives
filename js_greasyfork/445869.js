// ==UserScript==
// @name         看看不了的视频找我
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  两个解析路径，看情况加载
// @author       黄先生
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        GM_setClipboard
// @license  none
// @downloadURL https://update.greasyfork.org/scripts/445869/%E7%9C%8B%E7%9C%8B%E4%B8%8D%E4%BA%86%E7%9A%84%E8%A7%86%E9%A2%91%E6%89%BE%E6%88%91.user.js
// @updateURL https://update.greasyfork.org/scripts/445869/%E7%9C%8B%E7%9C%8B%E4%B8%8D%E4%BA%86%E7%9A%84%E8%A7%86%E9%A2%91%E6%89%BE%E6%88%91.meta.js
// ==/UserScript==


(function() {
    'use strict';
var load_url;
    setTimeout(function(){

        //hello world
        var LOAD_url;

        //var boos_url = "https://v.superso.top/";
        var HEAD_url = "https://jx.parwix.com:4433/player/?url=";
        var Q = document.getElementById('toolbar_module');
        let BTN = document.createElement('button');
        BTN.innerText = "HelloWorld";
        Q.after(BTN);
        BTN.onclick = function (){
            console.log('点击了按键');
            //为所欲为 功能实现处
            LOAD_url = window.location.href;
            console.log(LOAD_url);
            var conf=confirm('你确认打开新页面吗？');
            if(conf==true){
                var URL = HEAD_url+LOAD_url;
                window.location.href=URL;
            }else {
                console.log('************:',LOAD_url);
            }
            return;
        };


        //Hello World
        var boos_url = "https://v.superso.top/";
        var head_url = "https://jx.parwix.com:4433/player/?url=";
        var q = document.getElementById('toolbar_module');
        let btn = document.createElement('button');
        btn.innerText = "hello world";
        q.after(btn);
        btn.onclick = function (){
            console.log('点击了按键');
            //为所欲为 功能实现处
            load_url = window.location.href;
            var conf=confirm('你确认打开新页面吗？(跳转过后，点击空白处才会加载呀)');
            if(conf==true){
                GM_setClipboard(load_url);
                window.location.href=boos_url;
            }else {
                console.log('************:',load_url);
            }
            return;
        };
        }, 3000);

    })();


