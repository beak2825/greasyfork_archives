// ==UserScript==
// @name         拷贝去除Emoji
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  通过快捷键Ctrl+Alt+C来在无Emoji的情况下拷贝。
// @author       Cedaros
// @match        *://*
// @match        https://*.bilibili.com/*
// @icon         https://s1.328888.xyz/2022/08/11/6jrQy.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449353/%E6%8B%B7%E8%B4%9D%E5%8E%BB%E9%99%A4Emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/449353/%E6%8B%B7%E8%B4%9D%E5%8E%BB%E9%99%A4Emoji.meta.js
// ==/UserScript==

function copyContent(value,type="input"){
    const input=document.createElement(type);
    input.setAttribute("readonly","readonly");
    input.value=value;console.log(value);
    document.body.appendChild(input);
    input.setSelectionRange(0,9999);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
}
document.onkeydown=function(e){
    if(e.ctrlKey&&e.altKey&&e.keyCode==67){
        var nt="";
        var tt=window.getSelection(0).toString();
        for(var i=0;i<tt.length;i++){
            if(tt.charCodeAt(i)>=32&&tt.charCodeAt(i)<=126)nt+=tt.charAt(i);
        }
        copyContent(nt);
    }
}