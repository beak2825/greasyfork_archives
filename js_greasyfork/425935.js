// ==UserScript==
// @name         计算clcu
// @namespace    undefined
// @version      0.1.0
// @description  计算练习脚本
// @author       userzhang123456
// @match        https://www.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/425935/%E8%AE%A1%E7%AE%97clcu.user.js
// @updateURL https://update.greasyfork.org/scripts/425935/%E8%AE%A1%E7%AE%97clcu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.head.innerHTML="";
    document.body.innerHTML="";
    document.write("<p id=\"p1\">你好 选择下面的不同模型</p>");
    document.write("<input id=\"but1\" type=\"button\" onclick=\"num1()\" value=\"梯形\">");
    document.write("<input id=\"but2\" type=\"button\" onclick=\"num2()\" value=\"半圆形\">");
    document.write("<input id=\"but3\" type=\"button\" onclick=\"num3()\" value=\"直角三角形\">");
    window.num1 = function(){
        document.body.innerHTML="";
        document.write("<p id=\"p1\">计算梯形</p>");
        document.write("<p id=\"ps1\">上底</p>");
        document.write("<input type=\"number\" id=\"in1\" >");
        document.write("<br>");
        document.write("<p id=\"ps2\">高</p>");
        document.write("<input type=\"number\" id=\"in2\" >");
        document.write("<br>");
        document.write("<p id=\"ps3\">左边</p>");
        document.write("<input type=\"number\" id=\"in3\" >");
        document.write("<br>")
        document.write("<p id=\"ps4\">右边</p>");
        document.write("<input type=\"number\" id=\"in4\" >");
        document.write("<br>");
        document.write("<br>");
        document.write("<input id=\"but4\" type=\"button\" onclick=\"clu1()\" value=\"计算\">");
        document.write("<p id=\"p2\">结果：</p>");
        document.write("<p id=\"p3\">==========</p>");
    }
    window.num2 = function(){
        document.body.innerHTML="";
        document.write("<p id=\"p1\">计算扇形</p>");
        document.write("<p id=\"ps1\">半径</p>");
        document.write("<input type=\"number\" id=\"in1\" >");
        document.write("<br>");
        document.write("<p id=\"ps2\">扇形的两个半径组成三角形的长</p>");
        document.write("<input type=\"number\" id=\"in2\" >");
        document.write("<br>");
        document.write("<br>");
        document.write("<input id=\"but4\" type=\"button\" onclick=\"clu2()\" value=\"计算\">");
        document.write("<p id=\"p2\">结果：</p>");
        document.write("<p id=\"p3\">==========</p>");
    }
    window.num3 = function(){
        document.body.innerHTML="";
        document.write("<p id=\"p1\">计算直角三角形</p>");
        document.write("<p id=\"ps1\">直角边1</p>");
        document.write("<input type=\"number\" id=\"in1\" >");
        document.write("<br>");
        document.write("<p id=\"ps2\">直角边2</p>");
        document.write("<input type=\"number\" id=\"in2\" >");
        document.write("<br>");
        document.write("<p id=\"ps3\">斜边</p>");
        document.write("<input type=\"number\" id=\"in3\" >");
        document.write("<br>");
        document.write("<br>");
        document.write("<input id=\"but4\" type=\"button\" onclick=\"clu3()\" value=\"计算\">");
        document.write("<p id=\"p2\">结果：</p>");
        document.write("<p id=\"p3\">==========</p>");
    }
    window.clu1 = function(){
        var x1 = document.getElementById("in1").value;//上
        var x2 = document.getElementById("in2").value;//高
        var x3 = document.getElementById("in3").value;//左
        var x4 = document.getElementById("in4").value;//右
        var out1 =Math.acos(x2/x3)*180/Math.PI +90;//左边角
        var out2 =Math.acos(x2/x4)*180/Math.PI +90;//右边角
        var oa2 =Math.pow(x2,2);
        var oc2 =Math.pow(x3,2);
        var outb1 =Math.sqrt(oc2-oa2);//左底
        oa2 =Math.pow(x2,2);
        oc2 =Math.pow(x4,2);
        var outb2 =Math.sqrt(oc2-oa2);//右底
        var out3 =Number(outb1)+Number(outb2)+Number(x1);
        document.getElementById("p3").innerHTML = "左边角度："+out1+"</br>"+"右边角度："+out2+"</br>"+" 下底长："+out3+"</br>"+"左三角形底长："+outb1+"</br>"+"右三角形底长："+outb2;
    }
    window.clu2 = function(){
        var x1 = document.getElementById("in1").value;
        var x2 = document.getElementById("in2").value;
        document.getElementById("p3").innerHTML = "程序还没写出来";
    }
    window.clu3 = function(){
        var x1 = document.getElementById("in1").value;
        var x2 = document.getElementById("in2").value;
        var x3 = document.getElementById("in3").value;
        document.getElementById("p3").innerHTML = "程序还没写出来";
    }
    // Your code here...
})();