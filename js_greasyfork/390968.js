// ==UserScript==
// @name         PanDownload网页版快捷跳转按钮
// @version      0.0.4
// @namespace    https://greasyfork.org/zh-CN/scripts/390968-pandownload
// @description  百度网盘分享链接页面加个按钮，点击可跳转到 PanDownload 网页版去下载（在“木木”脚本的基础上进行改进，使得页面更美观）
// @author       lyydhy
// @match        *://pan.baidu.com/s/*
// @match        *://pan.baidu.com/share/*
// @match        *://yun.baidu.com/s/*
// @downloadURL https://update.greasyfork.org/scripts/390968/PanDownload%E7%BD%91%E9%A1%B5%E7%89%88%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/390968/PanDownload%E7%BD%91%E9%A1%B5%E7%89%88%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
        var url = window.location.href;
        var ua=navigator.userAgent;
        if(ua.indexOf('Android')>0){
            var button1=document.querySelector("button.share-friend");
            button1.innerText="PD跳转"
            button1.addEventListener("click",function(){
                pd();
            }
                                    );
        }else{
            var button=document.querySelector("div.x-button-box");
            var css = "color: white;width: 100px;line-height: 35px;text-align: center;border: 1px solid #09AAFF;background-color: #09AAFF;border-radius: 4px;height: 32px;padding:7px;cursor:pointer;text-decoration:none;";
            var a = document.createElement("a");
            a.title="可以是用motrix下载器下载 内含aria2 然后使用aria2模式下载，或者普通模式配合idm等下载器使用";
            a.style.cssText = css;
            a.innerHTML="PD网页"
            button.appendChild(a);
            a.addEventListener("click",function(){
                pd()});

        }

        var pd=function(){
            url = url.replace('baidu.com','baiduwp.com');
            window.open(url, "_blank");
        }
        }
})();
