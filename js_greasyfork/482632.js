// ==UserScript==
// @name         知网检索高级预选
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  知网检索点选cssci
// @author       梁常安
// @match       https://kns.cnki.net/kns/advsearch?dbcode=CJZK
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482632/%E7%9F%A5%E7%BD%91%E6%A3%80%E7%B4%A2%E9%AB%98%E7%BA%A7%E9%A2%84%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/482632/%E7%9F%A5%E7%BD%91%E6%A3%80%E7%B4%A2%E9%AB%98%E7%BA%A7%E9%A2%84%E9%80%89.meta.js
// ==/UserScript==

(function() {
'use strict';
    var bdhx=document.getElementById('hx');
    bdhx.click();
    var cssci=document.getElementById('CSSCI');
    cssci.click();
  //window.frames['iframeResult'].document.getElementById("selectCheckbox").click()

   var aaa=document.getElementsByClassName("header")[0]
   var jssz = document.createElement("button"); //创建一个input对象（提示框按钮）
   // jssz.style = "color:#555555;padding: 3px 15px;";
    jssz.style ="    width: 120px;    height: 28px;    color: #555;    font-size: 14px; ";

    aaa.appendChild(jssz);

    var a = document.createElement("a");
     jssz.textContent = "经济学期刊TOP";
     jssz.onclick=function (){
     var zyjs=document.getElementsByClassName("header")[0].getElementsByTagName('span')[1];
     zyjs.click();
     document.getElementsByClassName("text ac_input")[0].value="LY='中国社会科学'+'经济研究'+'世界经济'+'经济学（季刊）'+'中国工业经济'+'管理世界'+'金融研究'+'数量经济技术经济研究' and SU=''"
    };

})();
