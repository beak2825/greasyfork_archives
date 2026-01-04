// ==UserScript==
// @name         保存CSDN文章为PDF
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去掉其他元素，只保留文章内容，方便阅读
// @author       jonas
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://iconfont.alicdn.com/s/a0a60ea8-d86f-483a-a2ee-cf3d9549cbad_origin.svg
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/424860/%E4%BF%9D%E5%AD%98CSDN%E6%96%87%E7%AB%A0%E4%B8%BAPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/424860/%E4%BF%9D%E5%AD%98CSDN%E6%96%87%E7%AB%A0%E4%B8%BAPDF.meta.js
// ==/UserScript==

(function()
 {
    'use strict';
    var article = document.getElementsByClassName("blog-content-box");
    var barContent = document.getElementsByClassName("bar-content");

     function openWin()
    {
        window.document.body.innerHTML=article[0].innerHTML;
        window.print();
        location.reload();

        /*var myWindow = window.open('','','width=1200,height=600');
        myWindow.document.write(article[0].innerHTML);
        myWindow.print();*/
    }

    var download = document.createElement("input");
    download.type = "button";
    download.style.position = 'fixed';
    download.style.height = '32px';
    download.style.width = '82px';
    download.style.button = '10px';
    download.style.right = '10px';
    download.style.color = '#fff';
    download.style.backgroundColor="#E33E33";
    download.style.borderRadius="5px"; ;
    download.setAttribute("class","button");
    download.setAttribute("value","下载此文章");
    download.addEventListener('click', function(ev){download.remove();window.setTimeout(openWin(),2000)})
    barContent[0].appendChild(download);
})();