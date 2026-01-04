// ==UserScript==
// @name         闲聊么PC版Style
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  闲聊么PC版界面太小了，聊天不不爽。快用这个脚本把界面放大
// @author       黄盐
// @match        http://www.xianliao.me/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/32292/%E9%97%B2%E8%81%8A%E4%B9%88PC%E7%89%88Style.user.js
// @updateURL https://update.greasyfork.org/scripts/32292/%E9%97%B2%E8%81%8A%E4%B9%88PC%E7%89%88Style.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('#gmBig{z-index: 999; position:absolute; top:0px; left: 0; width: 32px; height:32px;font-size: 28px;padding: 7px 4px;color:#2772AB !important;background:#fff;cursor: pointer;}\
    #gmBig:hover{background:#eee;}');
    var a,b,c;
    a=document.createElement("div");
    a.id='gmBig';
    a.innerHTML='▣';
   b=document.querySelector('#frame');
    b.appendChild(a);
    function changeCSS(){
        var tar=document.querySelector("#frame");
        if (parseInt(tar.style.height)<50){
            document.querySelector('.collapsed_content').click();
            setTimeout("var tar=document.querySelector('#frame'); tar.style.height=window.innerHeight+'px';tar.style.width=window.innerWidth/2+'px';tar.style.bottom='0px';",40);
        }
        else{
            document.querySelector('#nav__collapse').click();
            setTimeout("var tar=document.querySelector('#frame');tar.style.width='20%';tar.style.bottom='20%';",40);
        }
    }
    a.addEventListener("click",changeCSS);
})();