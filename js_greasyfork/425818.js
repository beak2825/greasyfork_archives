// ==UserScript==
// @name         电影天堂广告去除，迅雷电影天堂批量下载
// @namespace    http://tampermonkey.net/
// @version      2021.5.3.17
// @description  电影天堂一进去随便点击毕然打开一波广告，作为一个搬砖狗，感觉很烦，就弄了几段代码去了。。另外也把电影的迅雷链接以选中方式直接批量显示在页面，如果需要复制下载,直接CTRL+C，本着方便自己，方便他人的原则，上传一波，以兹共享!
// @author       talen
// @include      https://www.dytt8.net/*
// @include      https://www.dydytt.net/*
// @include      https://www.dy2018.com/*
// @include      https://www.ygdy8.com/*
// @include      https://www.xl720.com/thunder/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425818/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%EF%BC%8C%E8%BF%85%E9%9B%B7%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/425818/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%EF%BC%8C%E8%BF%85%E9%9B%B7%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function(){

        if(document.querySelector("body > a")){
            document.querySelector("body > a").outerHTML = "";
        }
        var input = document.createElement("textarea");

        input.setAttribute("id","myinput");
        input.style.color = "red";
        input.style.width = "100%";
        input.style.height = "500px";
        input.style.margin = "0 auto";
        //input.style.position = "fixed";
        input.style.top = "0";
        input.style.left = "0";
        input.style.bottom = "0";
        input.style.right = "0";
        var x, i, showAddress=true;
        if(document.querySelector("#Zoom span table tbody tr td a")){
            x = document.querySelectorAll("#Zoom span table tbody tr td a");
            for (i = 0; i < x.length; i++) {
                input.value=input.value+';'+x[i].attributes[7].value;
            }
        }
        else if (document.querySelector("#downlist table tbody tr td a")){
            x = document.querySelectorAll("#downlist table tbody tr td a");
            for (i = 0; i < x.length; i++) {
                input.value=input.value+';'+x[i].href;
            }
        }
        else if (document.querySelector("#zdownload > div.down_btn.down_btn_xl > a")){
            x = document.querySelectorAll("#zdownload > div.down_btn.down_btn_xl > a");
            for (i = 0; i < x.length; i++) {
                input.value=input.value+';'+x[i].href;
                if (i% 20 == 0){
                    input.value = input.value + '\r\n\r\n';
                }
            }
        }
        else if (document.querySelector("#ztxt > div > a")){
            x = document.querySelectorAll("#ztxt > div > a");
            for (i = 0; i < x.length; i++) {
                input.value=input.value+';'+x[i].href;
                if (i% 20 == 0){
                    input.value = input.value + '\r\n\r\n';
                }
            }
        }
        else{
            showAddress = false;
        }
        console.log("获取到的磁力链接个数："+x.length);

        if (showAddress){
            document.body.prepend(input);

            document.getElementById("myinput").select();
        }

    };




})();