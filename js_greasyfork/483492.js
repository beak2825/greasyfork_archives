// ==UserScript==
// @name         1111
// @namespace    http://tampermonkey.net/
// @version      2023-12-20
// @description  11111
// @author       11
// @license MIT
// @match        https://www.greenmangaming.com/zh/my-account/games/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483492/1111.user.js
// @updateURL https://update.greasyfork.org/scripts/483492/1111.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var game=4
     var styleMap = {//定义按钮样式
        display: "inline-block",
        "background-color": "RGB(135,153,135)",
        cursor: "pointer",
        "user-select": "none",
        "min-width": "74px",
        height: "28px",
        "border-radius": "16px",
        color: "#fff",
        "font-size": "14px",
        "line-height": "28px",
        "text-align": "center",
        padding: "0px 10px",
        "margin-left": "16px",
      };

      var btn1 = document.createElement("div");// 创建按钮
      btn1.innerHTML = "复制";
    for (let i in styleMap) {// 添加样式
        btn1.style[i] = styleMap[i];
      }
      btn1.addEventListener("click", clickBtn);// 添加点击事件
     function clickBtn() {var gamename=document.getElementsByClassName("prod-name");
var key=document.querySelectorAll("input[type=text]");
var keytext=[];
var gold=[];
for (var i=0;i<game;i++)
{
keytext[i]=key[i].value;
gold[i]=gamename[i].innerText+":"+keytext[i];
}
var end=gold.join('\r\n')
console.log(end);
let textarea= document.createElement("textarea");//复制到粘贴板
    let end1 = end;
    document.body.appendChild(textarea);
    textarea.value = end1 ;
    textarea.select();
    if (document.execCommand("copy")) {
      document.execCommand("copy");
    }
    document.body.removeChild(textarea);}
    var toolbox22 = document.querySelector("#my-account-header > div > div > section > section > div > div > nav > ul > li:nth-child(5)");
    toolbox22.appendChild(btn1);
    var btn2 = document.createElement("div");// 创建按钮
    btn2.innerHTML = "打开";
    for (let i in styleMap) {// 添加样式
        btn2.style[i] = styleMap[i];
      }
      btn2.addEventListener("click", clickBtn2);// 添加点击事件
    function clickBtn2(){
        var kai=document.getElementsByClassName("accordion-toggle");
        for(var k=0;k<game;k++){
        kai[k].click()}

    }
    toolbox22.appendChild(btn2);
})();