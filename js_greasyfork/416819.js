// ==UserScript==
// @name         wechat add copy title&url button
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  try to take over the world!
// @author       You
// @include      https://mp.weixin.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416819/wechat%20add%20copy%20titleurl%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/416819/wechat%20add%20copy%20titleurl%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var Start={};
    Start.one_create_btn = function(){
        var Div = document.getElementById("js_article");
        var button = document.createElement("input");
        button.setAttribute("type", "button");
        button.setAttribute("value", "copy_title");
        button.setAttribute("id", "copy_btn1");
        button.setAttribute("class", "class_copy_btn1");

        button.style.width = "50%";
        button.style.height = "50px";
        button.style.marginLeft = "auto"
        button.style.marginRight = "auto"

        document.body.insertBefore(button, Div);

        document.getElementById("copy_btn1").onclick=function(){
            // IE浏览器
            //var clipBoardContent=document.getElementById("activity-name").innerText;
            //var clipBoardContent=document.title;
            var clipBoardContent=document.title;
            if (window.clipboardData) {
                window.clipboardData.clearData();
                window.clipboardData.setData("Text", clipBoardContent);
                alert("复制成功！");
            }else{
                if (!document.queryCommandSupported('copy')) {
                    throw new Error('document.execCommand method not support copy command');
                }
                const input = document.createElement('input'); // 要input类型
                //input.style.cssText = 'display: block;opacity: 0;position: absolute;left: -10000px;top: -10000px;z-index: -1;width: 1px;height: 1px;'
                document.body.appendChild(input);
                input.value = clipBoardContent;
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
            }



        }

        // Error 不能通过这种属性和值的方式建立关联
        /*
        button.setAttribute("onclick", "copyUrl()");
        function copyUrl()
        {
            alert("复制成功!");
        }
        */

    };
    Start.two_create_btn = function(){
        var Div = document.getElementById("js_article");
        var button = document.createElement("input");
        button.setAttribute("type", "button");
        button.setAttribute("value", "copy_url");
        button.setAttribute("id", "copy_btn2");
        button.setAttribute("class", "class_copy_btn1");

        button.style.width = "50%";
        button.style.height = "50px";
        button.style.marginLeft = "auto"
        button.style.marginRight = "auto"

        document.body.insertBefore(button, Div);

        document.getElementById("copy_btn2").onclick=function(){
            // IE浏览器
            //var clipBoardContent=document.getElementById("activity-name").innerText;
            //var clipBoardContent=document.title;
            var clipBoardContent=document.querySelector("head > meta:nth-child(14)").content;
            if (window.clipboardData) {
                window.clipboardData.clearData();
                window.clipboardData.setData("Text", clipBoardContent);
                alert("复制成功！");
            }else{
                if (!document.queryCommandSupported('copy')) {
                    throw new Error('document.execCommand method not support copy command');
                }
                const input = document.createElement('input'); // 要input类型
                //input.style.cssText = 'display: block;opacity: 0;position: absolute;left: -10000px;top: -10000px;z-index: -1;width: 1px;height: 1px;'
                document.body.appendChild(input);
                input.value = clipBoardContent;
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
            }



        }
    }
    Start.one_create_btn();
    Start.two_create_btn();



})();

