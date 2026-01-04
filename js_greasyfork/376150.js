// ==UserScript==
// @name         meipai
// @namespace    qq
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.baidu.com/*

// @downloadURL https://update.greasyfork.org/scripts/376150/meipai.user.js
// @updateURL https://update.greasyfork.org/scripts/376150/meipai.meta.js
// ==/UserScript==
(function() {
    'use strict';

document.addEventListener('dblclick', onDocumenDblClick);
function onDocumenDblClick(event) {
        closeDiv('ppdiv');
      }

  var newid= document.createElement("div"); //首先创建一个div
   newid.setAttribute("id", "ppdiv"); //定义该div的id
   newid.innerHTML='<div id="qq"><video id="video81" src="http://mvvideo11.meitudata.com/5b3de09947c707567_H264_1_5e86e6085d0bab.mp4?k=f86e1a759f5f2b94ebca226f2bd43ef8&t=5c2defa4"></video></div>';
   newid.style.cssText = "display:none;";
   document.body.appendChild(newid);

function showdiv(popid) {
//////
    var Idiv = document.getElementById(popid);

    //background:url() #ffffff
    Idiv.style.cssText = "z-index:100;overflow:auto;position:absolute;background:#fff;";

    Idiv.style.display = "block";
    //以下部分要将弹出层居中显示
    Idiv.style.left = (document.documentElement.clientWidth - Idiv.clientWidth) / 2 + document.documentElement.scrollLeft + "px";
    Idiv.style.top = (document.documentElement.clientHeight - Idiv.clientHeight) / 2 + document.documentElement.scrollTop - 10 + "px";

    //以下部分使整个页面至灰不可点击
    var procbg = document.createElement("div"); //首先创建一个div
    procbg.setAttribute("id", "mybg"); //定义该div的id
    procbg.style.cssText = "background:#000000;width:100%;height:100%;position:fixed;top:0;left:0;zIndex:500;opacity:0.6;filter:Alpha(opacity=70);";
    //背景层加入页面
    document.body.appendChild(procbg);
    document.body.style.overflow = "hidden"; //取消滚动条

   //以下部分实现弹出层的拖拽效果
var posX, posY;

    Idiv.onmousedown = function(e) {
        if (!e) e = window.event; //IE
        posX = e.clientX - parseInt(Idiv.style.left);
        posY = e.clientY - parseInt(Idiv.style.top);
        document.onmousemove = mousemove;
    }

    document.onmouseup = function() {
        document.onmousemove = null;
    }

    function mousemove(ev) {
        if (ev == null) ev = window.event; //IE
        Idiv.style.left = (ev.clientX - posX) + "px";
        Idiv.style.top = (ev.clientY - posY) + "px";
    }
   window.onresize=function(){showdiv(popid);};
}

function closeDiv(id) //关闭弹出层
{
    var Idiv = document.getElementById(id);
    Idiv.style.display = "none";
    document.body.style.overflow = "auto"; //恢复页面滚动条
    var body = document.getElementsByTagName("body");
    var mybg = document.getElementById("mybg");
    body[0].removeChild(mybg);
}

    showdiv("ppdiv");
})();