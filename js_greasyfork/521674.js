// ==UserScript==
// @name         空文本链接翻译器
// @namespace    http://tampermonkey.net/
// @version      2024-12-26
// @description  节省F12时间。
// @author       PriorityStack（改编自MLE_Automaton的“洛谷口苗语（其实是空文本链接）翻译”）
// @match        https://www.luogu.com.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521674/%E7%A9%BA%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%E7%BF%BB%E8%AF%91%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/521674/%E7%A9%BA%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%E7%BF%BB%E8%AF%91%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var x=document.getElementsByClassName("lg-article")[8];
    var Button=document.createElement("button");
    Button.className="am-btn am-btn-success am-btn-sm";
    Button.innerHTML='开启空文本链接翻译';
    x.appendChild(Button);
    var onc=0;
    Button.onclick=function(){
        if(onc===0){onc=1;}
        else {onc=0;}
        if(onc===1)
        {
            setTimeout(function awa() {
                var feeds = document.getElementsByClassName("feed-comment");
                feeds.forEach((x) => {
                    var links = x.getElementsByTagName("a");
                    links.forEach((x) => {
                        if (!x.innerHTML.trim())
                        {
                            x.outerHTML = "<p id=\"TM-kwbljfyq\" style=\"display:inline;\">[空文本链接翻译：“" + decodeURI((new URL(x.href)).pathname.slice(1)) + "”]</p>";
                        }
                    });
                });
            }, 100);
        }
        else
        {
            while(onc===0){
                var links = document.getElementById("TM-kwbljfyq");
                links.outerHTML="<a href=\""+links.innerHTML.substring(10,links.innerHTML.length-2)+"\"></a>";
            }
        }
    }
})();