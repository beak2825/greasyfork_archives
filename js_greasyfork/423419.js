// ==UserScript==
// @name         安乐传
// @author       Jones Miller
// @version      23.04.01
// @namespace    https://t.me/jsday
// @description  一键到顶、到底； 电脑端、移动端通用。
// @include      *
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/423419/%E5%AE%89%E4%B9%90%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/423419/%E5%AE%89%E4%B9%90%E4%BC%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

  function s(i){ window.scrollTo(0,i);};
  var jmfortop=document.createElement("div");
    jmfortop=document.body.appendChild(jmfortop);
    jmfortop.innerHTML=' <head> <style type="text/css"> #jmchuan { position:fixed; display:block; width:49px; height:88px; bottom:30px; right:-60px; background:transparent !important; z-index:100000; transition:.5s all; border-radius:10px;} #jmchuan div { position:absolute; width:100%; height:49%; background:rgba(0,0,0,0.5) url(https://g.csdnimg.cn/side-toolbar/2.9/images/fanhuidingbucopy.png) no-repeat center !important; background-size:18px !important; border-radius:10px;} #jmchuan div:hover { background-color:red !important; background-size:26px !important;} </style> </head> <body> <div id="jmchuan"> <div id="jmgotop" style="top:0;"></div> <div id="jmgobtn" style="bottom:0;transform:rotate(180deg);"></div> </div> </body>';
    window.onscroll=function() { scrollFunction();};
    function scrollFunction() {
    if (document.body.scrollTop > 149 || document.documentElement.scrollTop > 149 ) {
        jmchuan.style.right='10px';
    } else {
        jmchuan.style.right='-60px';
    }
  }
  jmgotop.onclick=()=>{
    s(0);
  };
  jmgobtn.onclick=()=>{
    s(document.body.scrollHeight);
  };

})();