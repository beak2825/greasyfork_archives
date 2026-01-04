// ==UserScript==
// @name         mf178
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @include      http*://www.mf178.cn/customer/order/*
// @grant        none
// @supportURL   https://greasyfork.org/scripts/375854     
// @downloadURL https://update.greasyfork.org/scripts/375854/mf178.user.js
// @updateURL https://update.greasyfork.org/scripts/375854/mf178.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var button = document.createElement("input"); //创建一个input对象（提示框按钮）
    button.setAttribute("type", "button");
    button.setAttribute("value", "获取30话费");
    // button.setAttribute("class", "btn btn-default btn-info");    ajaxPostAsync('/charge/phone/receive/info', "facevalue="+value_input_1+"&receiveNum=1&channel[0]=1&channel[1]=2&channel[2]=3")
    button.setAttribute("onclick", "window.location.href='ajax?get=get_tasks&amount=200&operator_id=0&count=1;'");
    button.style.width = "100px";
    button.style.align = "left";
    button.style.background = "#FFFFFF";
    button.style.border = "5px solid " + "#FFD700";//52
    button.style.color = "red";
    button.style.fontWeight="bolder";

    // Your code here...  <a type="button" class="btn btn-default btn-info" href="javascript:getTask(50);">获取50元订单</a>
    // Your code here...

    var button2 = document.createElement("input"); //创建一个input对象（提示框按钮）
    button2.setAttribute("type", "submit");
    button2.setAttribute("value", "获取50话费");
    button2.setAttribute("onclick", "setInterval('getTask2(50);',1000);");
    //button2.setAttribute("onsubmit", "getTask(200);");
    // button2.setAttribute("onclick", "function () {var url = 'ajax?action=get_tasks&amount=200';     X.get(url);");
    button2.style.width = "100px";
    button2.style.align = "left";
    button2.style.background = "#FFFFFF";
    button2.style.border = "5px solid " + "#FFD700";//52
    button2.style.color = "red";
    button2.style.fontWeight="bolder";


    var x = document.getElementsByClassName("nav_css");
    x[0].appendChild(button);
    x[0].appendChild(button2);

    var scriptContent = 'function getTask2 (amount) {\
var url = "ajax?action=get_tasks&amount=" + amount;\
X.get(url);\
var a= document.getElementsByClassName("form-horizontal");\
a[0].submit();\
}\;'

//document.getElementById("myForm").submit()


  //加入function
var scriptE = document.createElement("script");
scriptE.setAttribute("type","text/javascript");
scriptE.innerHTML = scriptContent;
document.body.appendChild(scriptE);

})();