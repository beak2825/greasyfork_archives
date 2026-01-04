// ==UserScript==
// @name         超级复制
// @namespace    http://tampermonkey.net/
// @version      0.49.2
// @description  破解和禁止网站复制功能。
// @author       You
// @license      MIT
// @match        https://*.com/*
// @match        https://*.cn/*
// @match        http://*.com/*
// @match        http://*.cn/*
// @antifeature tracking
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/440017/%E8%B6%85%E7%BA%A7%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/440017/%E8%B6%85%E7%BA%A7%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

var KEY;
"use esversion: 8";

function _main(){
    KEY = prompt("输入1破解/关闭禁止复制，输入2启用禁止复制")
    switch (KEY){
        case "1":{
            document.oncontextmenu='';
            break;
        } case "2":{
            document.oncontextmenu=Click;
            break;
        } default:{
            alert('非法')
        }
}

function Click(){
    alert('禁止复制');
    window.event.returnValue=false;
}


    mainTask();
async function mainTask() {
    
    let btn = "<button onclick='_main()'>破解禁止复制</button>"
    document.write(btn)
     Swal.fire({
        btn,
        width: 900,
        allowOutsideClick: false,
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: '好评',
        cancelButtonText: '关闭',
        reverseButtons: true
    }).then(r => {
        if (r.isConfirmed){
            GM_openInTab('https://greasyfork.org/zh-CN/scripts/440017-%E8%B6%85%E7%BA%A7%E5%A4%8D%E5%88%B6/feedback');
        }});
    // Your code here...
}}