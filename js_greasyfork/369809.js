// ==UserScript==
// @name         爱数多段质检用
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Douglas
// @match        http://babel.magicdatatech.com/processmore/index.php/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369809/%E7%88%B1%E6%95%B0%E5%A4%9A%E6%AE%B5%E8%B4%A8%E6%A3%80%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/369809/%E7%88%B1%E6%95%B0%E5%A4%9A%E6%AE%B5%E8%B4%A8%E6%A3%80%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
function changeStyle()
    {
        document.body.style.backgroundColor="#f2f9fd";
        document.body.style.backgroundImage="url(http://www.infinity-game.com/image/Journals/Atmo_Nov_2012/atmo_nov_2012_3.png)";
        document.querySelector('#annotations').style.zIndex="999";
        //将右侧的，防止输入框的
        //        document.getElementById("annotations").style.zIndex="999";
    }
window.onload = changeStyle;
function addBtn()
    {
       $("button").click(function(){
  $(this).clone(true).insertAfter(this);
});
    }
document.oncontextmenu=new Function("event.returnValue=false;");
//禁用右键，防止未保存，误点击返回
//document.onselectstart=new Function("event.returnValue=false;");
//于禁止选择网页中的文字，此事件不支持对input和textarea无效。
    // Your code here...
})();