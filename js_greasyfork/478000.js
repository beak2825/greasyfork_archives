// ==UserScript==
// @name         dict.cn修改网页标题
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  修改dict.cn页面标题，辅助notion
// @author       silviode
// @match        https://dict.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dict.cn
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/478000/dictcn%E4%BF%AE%E6%94%B9%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/478000/dictcn%E4%BF%AE%E6%94%B9%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let explain_text = document.getElementsByTagName("h1")[0].innerText + "  "
    let strongs = document.querySelectorAll("ul.dict-basic-ul>li")
    for(let i = 0; i < strongs.length - 1; i++){
        explain_text += strongs[i].innerText + "  "
    }

    document.title = explain_text
    // 如需使用手动解开注释，即删除// darkMode() 前面的反斜杠 
    // darkMode() 


})();

function darkMode(){
    let mycolor = "#252629"
    document.bgColor = mycolor
    document.querySelector(".main").style.backgroundColor = mycolor
    document.querySelectorAll("i").forEach((i)=>{i.style.backgroundColor = mycolor})
    document.querySelectorAll("h3").forEach((i)=>{i.style.backgroundColor = mycolor})
    document.querySelectorAll("li").forEach((i)=>{i.style.color = "#CDCDCD"})
    document.querySelector(".top").style.backgroundColor = mycolor
    document.querySelector("#header").style.backgroundImage = "none"
}