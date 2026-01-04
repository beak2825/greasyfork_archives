// ==UserScript==
// @name   haojiachengutil
// @namespace    https://www.haojiacheng.cn
// @version      0.1
// @description  【本脚本功能】在复习学习通的各科题时，可以方便的隐藏和显示答案，提高学习效率
// @author       SuYi
// @license      End-User License Agreement
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @match        *://*.gdhkmooc.com/*
// @icon         https://www.haojiacheng.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467569/haojiachengutil.user.js
// @updateURL https://update.greasyfork.org/scripts/467569/haojiachengutil.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    //document.getElementById("rightHeight").innerHTML="<button id='mybtn'>点我啊</button>";

    var cj=document.createTextNode("点我 显示/隐藏 答案");
    var jiacheng=document.createElement("button");
    jiacheng.id="mybtn";
    jiacheng.style="font: 12px/1.5 微软雅黑, 黑体, Arial, Helvetica, sans-serif;-webkit-font-smoothing: antialiased;padding: 0;outline: none;width: 180px;height: 32px;line-height: 32px;margin: 20px;background: #FFFFFF;border: solid #3A8BFF 1px;font-size: 14px;float: left;border-radius: 5px;text-align: center;cursor: pointer;background-color: #71e871;border-color: #3A8BFF;color: rgb(224 20 20);";
    jiacheng.appendChild(cj);
    document.getElementById("rightHeight").appendChild(jiacheng);

    var mybtn = document.getElementById("mybtn");
    var j = 0;
    mybtn.addEventListener("click",function(){
         j++;
    if(j%2==0){
        for(var i=0;i<document.getElementsByClassName("mark_answer").length;i++){document.getElementsByClassName("mark_answer")[i].style="display:block";}
    }else{
        for(var w=0;w<document.getElementsByClassName("mark_answer").length;w++){document.getElementsByClassName("mark_answer")[w].style="display:none";}
    }
    });

})();



