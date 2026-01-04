// ==UserScript==
// @name         冷少编辑器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       GodK
// @match        http://cps.neumooc.com/practice/stu/*
// @match        http://cps.neumooc.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414938/%E5%86%B7%E5%B0%91%E7%BC%96%E8%BE%91%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/414938/%E5%86%B7%E5%B0%91%E7%BC%96%E8%BE%91%E5%99%A8.meta.js
// ==/UserScript==

　　　document.oncontextmenu="";
　　　　document.onselectstart="";
    document.onpaste ="";




(function() {
    var allLine = document.getElementsByClassName("ace_line");
    var allChild=new Array();
    var allText = "https://s1.ax1x.com/2020/10/09/0BX4xI.png";


//获取编辑器内容
var playtimer=window.setInterval(function(){


    var bgdiv = document.getElementsByClassName("ace_content")[0];
    bgdiv.style.background = "url('https://s1.ax1x.com/2020/10/09/0BX4xI.png')";
    var treediv = document.getElementsByClassName("projectPracticeTree")[0];
    treediv.style.background = "url('https://s1.ax1x.com/2020/10/09/0BX4xI.png') repeat left 50% ";
    if(bgdiv != null)
    {
        clearInterval(playtimer);
    }
    },500);

    var guterContainer = document.getElementsByClassName("ace_layer ace_gutter-layer ace_folding-enabled")[0];//行数容器
    var guterDiv = document.createElement("div");
    guterDiv.style.height = "17px";
    guterDiv.setAttribute("class","ace_gutter-cell");
    guterDiv.innerHTML = "1";
    guterContainer.appendChild(guterDiv);

        var editContainer = document.getElementsByClassName("ace_layer ace_text-layer")[0];
    var lineGroupDiv = document.createElement("div");
    lineGroupDiv.style.height = "17px";
    lineGroupDiv.setAttribute("class","ace_line_group");
    var lineDiv = document.createElement("div");
    lineDiv.style.height = "17px";
    lineDiv.setAttribute("class","ace_line");
    var aSpan = document.createElement("span");
    aSpan.setAttribute("class","ace_identifier");
    aSpan.innerHTML = "asd";
    lineDiv.appendChild(aSpan);
    lineGroupDiv.appendChild(lineDiv);
    editContainer.appendChild(lineGroupDiv);



})();