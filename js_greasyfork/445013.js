// ==UserScript==
// @name         纽菲尔德大学评教
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  谁🐓儿有时间一个一个点？
// @author       冰镇杨梅瑞纳冰YYDS
// @match        https://jpv2-2.mycospxk.com/wx/ver2.42.0/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mycospxk.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445013/%E7%BA%BD%E8%8F%B2%E5%B0%94%E5%BE%B7%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/445013/%E7%BA%BD%E8%8F%B2%E5%B0%94%E5%BE%B7%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var checkDiv = document.createElement("div");
    checkDiv.setAttribute("id","test");
    document.body.appendChild(checkDiv);
    var testBlock = document.getElementById("test");
    testBlock.style.height="auto";
    testBlock.style.width="400px";
    testBlock.style.position="absolute";
    testBlock.style.top=0;
    testBlock.style.right=0;
    testBlock.style.background="yellow";
    testBlock.style.zindex=1000;
    testBlock.innerHTML+='<div style="margin:20px;"><h1>使用须知</h1><li>学校可能要求不允许满分，因此设置<b>第一个</b>问题为“符合”，其他问题均为“非常符合”</li><li>由于多方面原因，<b>提交前请你务必自行检查。本脚本不自动提交，因此，你提交问卷代表你已检查并认可该问卷填写的内容，所有后续责任由您个人承担。</b></li><li>由于JS限制以及懒得再写了，需要你点击下方按钮才可自动填写。<b>⚠️注意，只！能！在！填写表单的界面点击按钮，其他页面点击按钮会导致浏览器卡死。</b></li><button id="start" onClick="AutoFill()" >王者出击！</button></div>'

    // Your code here...
   window.AutoFill=function(){
    alert("yes!")
    let radios = document.getElementsByClassName("ant-radio-input");
    for(var j=0;j<radios.length;j++){
            radios[j].click();
    }
    radios[3].click();
    var textareas = document.getElementsByClassName("ant-input UEditoTextarea___27hB8");
    for(var h=0;h<textareas.length;h++){
        var content="没有";
        if(h==0){
            content="无";
        }else if(h==1){
            content="有很多收获。没有建议";
        }else if(h==2){
            content="很好";
        }
        textareas[h].value=content;
    }
}
}

)();