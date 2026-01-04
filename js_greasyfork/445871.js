// ==UserScript==
// @name         看看不了的视频找我
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  三种方式，加载结果随缘；其中一种脚本需要后面这个脚本的支持(https://greasyfork.org/zh-CN/scripts/445872-b%E7%AB%99%E8%B7%B3%E8%BD%AC%E8%A7%A3%E6%9E%90vip?locale_override=1)
// @author       黄先生
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        GM_setClipboard
// @license  none
// @downloadURL https://update.greasyfork.org/scripts/445871/%E7%9C%8B%E7%9C%8B%E4%B8%8D%E4%BA%86%E7%9A%84%E8%A7%86%E9%A2%91%E6%89%BE%E6%88%91.user.js
// @updateURL https://update.greasyfork.org/scripts/445871/%E7%9C%8B%E7%9C%8B%E4%B8%8D%E4%BA%86%E7%9A%84%E8%A7%86%E9%A2%91%E6%89%BE%E6%88%91.meta.js
// ==/UserScript==


(function() {
    'use strict';
var load_url;
    setTimeout(function(){

        //hello world
        var LOAD1_url;
        var LOAD2_url;

        //var boos_url = "https://v.superso.top/";
        var HEAD1_url = "https://jx.parwix.com:4433/player/?url=";
        var Q = document.getElementById('toolbar_module');
        let BTN = document.createElement('button');
        BTN.innerText = "World";
        Q.after(BTN);
        BTN.onclick = function (){
            console.log('点击了按键');
            //为所欲为 功能实现处
            LOAD1_url = window.location.href;
            console.log(LOAD1_url);
            var conf=confirm('你确认打开新页面吗？');
            if(conf==true){
                var URL = HEAD1_url+LOAD1_url;
                window.location.href=URL;
            }else {
                console.log('************:',LOAD1_url);
            }
            return;
        };

        var HEAD2_url = "https://z1.m1907.cn/?jx=";
        var id_bar = document.getElementById('toolbar_module');
        let btn_2 = document.createElement('button');
        btn_2.innerText = "Hello";
        id_bar.after(btn_2);
        btn_2.onclick = function (){
            console.log('点击了按键');
            //为所欲为 功能实现处
            LOAD2_url = window.location.href;
            console.log(LOAD2_url);
            var conf=confirm('你确认打开新页面吗？（若是连续剧会显示全部）');
            if(conf==true){
                var URL = HEAD2_url+LOAD2_url;
                window.location.href=URL;
            }else {
                console.log('************:',LOAD2_url);
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


