// ==UserScript==
// @name         知网批量下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  知网文档批量下载（代替手动）
// @author       You
// @match        https://*.cnki.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnki.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445699/%E7%9F%A5%E7%BD%91%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/445699/%E7%9F%A5%E7%BD%91%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

function Add_Div(text){
    var Div = document.createElement("div");
    Div.innerHTML = text;
    document.body.appendChild(Div);
}
function Add_Js(text){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.innerText = text;
    document.body.appendChild(script);
}

setTimeout(
function() {
Add_Js('var j = 0;'+
       'function FUCKCNKI(){var l = document.getElementsByClassName("downloadlink icon-download").length;'+
       'var go = confirm("将下载本页");'+
       'if(!go) return;'+
       'for (i = 0; i < l; i++)'+
       '{'+
       'setTimeout(() => {(document.getElementsByClassName("downloadlink icon-download")[j]).click(); j++;},3000 * i);'+
       '}'+
       'j=0'+
       '}');
Add_Div('<div style="position: fixed;top:50px;right:25px;z-index:999">'+
        '<Button id="Cat" align="center" font-size:30px; onclick="FUCKCNKI()"><strong>批量下载</strong></Button>'+
        '</div>');

    // Your code here...
}
,2000);