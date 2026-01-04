// ==UserScript==
// @name         超星/学习通章节内ppt下载
// @namespace    https://greasyfork.org/zh-CN/users/782923-asea
// @version      1.0.6
// @description  点击右上角下载ppt的按钮即可
// @author       Asea
// @match        https://*.chaoxing.com/mycourse/studentstudy*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/446613/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%AB%A0%E8%8A%82%E5%86%85ppt%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/446613/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%AB%A0%E8%8A%82%E5%86%85ppt%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = f;
    function f() {
        setTimeout(()=>{
            var div=document.createElement("div");
            div.innerText = "下载pdf";
            document.body.appendChild(div);
            document.body.insertBefore(div, document.body.firstElementChild);
            div.style.position = "fixed";
            div.style.right="10px";
            div.style.top="0px";
            div.style.zIndex=9999999;
            div.style.color="#fff";
            div.style.background="#333";
            div.style.padding="10px";
            div.style.fontWeight="bold";
            div.style.borderRadius="3px";
            div.style.cursor="pointer";
            div.style.display="block"
            div.onclick=download;
        }, 100)
    }
    function download(){
        let files = document.getElementById("iframe").contentWindow.document.querySelectorAll("iframe[class^='ans-attach-online insertdoc-online-p']");
        if (files.length == 0){
           alert("该页面未检测到ppt");
            return;
        }
        let num = Number(prompt("一共" + files.length + "个文件,下载第几个？（默认下载全部）"));
        if(num != 0 && num <= files.length && num > 0){
            let frame = $('<iframe style="display: none;" class="multi-download"></iframe>');
            frame.attr('src',"https://cs-a" + "ns.chaoxing.com/download/" + JSON.parse(files[num - 1].getAttribute('data')).objectid);
            $(document.body).append(frame);
            setTimeout(function() {
                frame.remove();
            }, 1000);
        }else if(num == 0){
            for( let i = 0; i < files.length; i++){
                let frame = $('<iframe style="display: none;" class="multi-download"></iframe>');
                // ans好像会被浏览器检测为广告？？？所以拆开了
                frame.attr('src',"https://cs-a" + "ns.chaoxing.com/download/" + JSON.parse(files[i].getAttribute('data')).objectid);
                $(document.body).append(frame);
                setTimeout(function() {
                    frame.remove();
                }, 1000);
            }

        }else{
            alert("非法输入");
        }
    }
})();