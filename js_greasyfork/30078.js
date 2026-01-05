// ==UserScript==
// @name         兔搜小说阅读快速转码/一键去广告
// @namespace    http://www.tusou.win/
// @version      V 0.1
// @description  部分小说站列表也增加转码阅读，无广告更流畅
// @author       兔搜
// @match      *://www.bookzx.org/htm/*/
// @match      *://chuangshi.qq.com/bk/*/*-l.html
// @match      *://www.hengyan.com/dir/*.aspx
// @match      *://www.xiaoyuanju.com/files/article/html/*/*/index.html
// @match       *//book.999.com/show/*.html
// @match        *://novel.hongxiu.com/a/*/list.html
// @match       *://book.zhulang.com/*/
// @match        *://b.faloo.com/html/*/*/
// @match        *://*/book/*/readbook.html
// @match       *://*/*/list.html
// @match        *://*/info/*#Catalog
// @match        *://*/book/*#Catalog
// @match        *://*/read/*.html
// @match       *://*/showchapter/*.html
// @match       *://*/book/*/*/
// @match       *://*/bookreader/*/
// @match        *://*/showchapter/*
// @match        *://www.17k.com/list/*
// @match       *://*/chaplist/*.html
// @match       *://*/book/*/chapter.html
// @match       *://*/book/*/
// @match       *://*/read/*/
// @match      *://*/showclist/*.html

// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/30078/%E5%85%94%E6%90%9C%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E5%BF%AB%E9%80%9F%E8%BD%AC%E7%A0%81%E4%B8%80%E9%94%AE%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/30078/%E5%85%94%E6%90%9C%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E5%BF%AB%E9%80%9F%E8%BD%AC%E7%A0%81%E4%B8%80%E9%94%AE%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('#TManays{z-index:999999; position:absolute; left:0px; top:0px; width:170px; height:auto; border:0; margin:0;}'+
                '.TMbtn{position:fixed; left:0; opacity:1; height:120px; width:30px; border-width:2px 2px 2px 2px; border-color:#0894ec; border-radius:0 5px 5px 0; background-color:#0894ec; border-style:solid; font:bold 15px "微软雅黑" !important; color:#ffffff; margin:0; padding:0;} '+
                '.TMbtn:hover{width:30px; opacity:1;font:bold 16px "微软雅黑" !important;} '+
                '#TMGobtn{top:200px;} ');

    function btnGo(){
        window.open('http://www.tusou.win/index.php?url='+window.location.href+'&p=1', "_blank");//默认使用疯狂解析，直接跳转
    }

    var div=document.createElement("div");
    div.innerHTML='<div id="TManays">'+
        '<button id="TMGobtn" class="TMbtn">转码阅读▶</button>'+
        '</div>';
    document.body.appendChild(div);
    document.querySelector("#TMGobtn").addEventListener("click",btnGo,false);

})();