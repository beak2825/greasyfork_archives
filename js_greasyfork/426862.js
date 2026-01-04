// ==UserScript==
// @name         国家大剧院古典音乐频道下载
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to open the classical music's door!
// @author       williamslay
// @match        http://ncpa-classic.cntv.cn/*
// @match        http://www.ncpa-classic.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/426862/%E5%9B%BD%E5%AE%B6%E5%A4%A7%E5%89%A7%E9%99%A2%E5%8F%A4%E5%85%B8%E9%9F%B3%E4%B9%90%E9%A2%91%E9%81%93%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/426862/%E5%9B%BD%E5%AE%B6%E5%A4%A7%E5%89%A7%E9%99%A2%E5%8F%A4%E5%85%B8%E9%9F%B3%E4%B9%90%E9%A2%91%E9%81%93%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
window.onload=function(){
    'use strict';
    let download=document.createElement("a");
    download.setAttribute("class", "download");
    download.setAttribute("download", true);
    //var audioplayer=document.getElementById("audioplayer");
    //var url=audioplayer.src;
     //download.href=url;
    let myText = document.createTextNode("下载");
     GM_addStyle ( `
        .download {
           width: 38px;
           height: 18px;
           line-height: 18px;
           text-align: center;
           background-color: #577891;
           font-size: 14px;
           font-family: "宋体";
           cursor: pointer;
           display:inline-block;
           position:absolute;
           left: 63%;
          top: 35%;
           };
    ` );
    download.onclick=function downloadUrlFile() {
    let tempForm = document.createElement('form')
    var audioplayer=document.getElementById("audioplayer");
    var url=audioplayer.src;
    tempForm.action = url
    tempForm.method = 'get'
    tempForm.style.display = 'none'
    document.body.appendChild(tempForm)
    tempForm.submit()
    return tempForm
}
    download.appendChild(myText);
    var parent=document.getElementsByClassName("nr_2");
    var node=document.getElementById("audio_title_div");
    parent[0].insertBefore(download,node);
console.log("开发者williamslay,github:https://github.com/williamslay")
}