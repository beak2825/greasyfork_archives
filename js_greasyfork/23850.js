// ==UserScript== 
// @name         Absolute Enable Right Click & Copy 1
// @namespace    Absolute Right Click
// @description  Force Enable right click & Copy & Highlight
// @author       Absolute
// @version      1.1.6
// @include      http*://*
// @License      MIT License
// @icon         https://cdn3.iconfinder.com/data/icons/communication-130/63/cursor-128.png
// @copyright    Absolute
// @grant        GM_addStyle
// @Exclude      /.*(JPG|PNG|GIF|JPEG|ico).*/

// @downloadURL https://update.greasyfork.org/scripts/23850/Absolute%20Enable%20Right%20Click%20%20Copy%201.user.js
// @updateURL https://update.greasyfork.org/scripts/23850/Absolute%20Enable%20Right%20Click%20%20Copy%201.meta.js
// ==/UserScript==

   setInterval(function () {
   document.oncontextmenu=null;
   document.contextmenu=null;
   document.ondragstart=null;
   document.onkeydown=null;
   document.onmousedown=null;
   document.onmousemove=null;
   document.onmouseup=null;
   document.onselectstart=null;
   document.selectstart=null;
   document.body.oncopy=null;
   document.body.onselect=null;
   document.body.onbeforecopy=null;
   document.body.contextmenu=null;
   document.body.oncontextmenu=null;
   document.body.ondragstart=null;
   document.body.onkeydown=null;
   document.body.onmousedown=null;
   document.body.onmousemove=null;
   document.body.onmouseup=null;
   document.body.selectstart=null;
   document.body.onselectstart=null;
   document.oncopy=null;
   window.oncopy=null;
   window.contextmenu=null;
   window.oncontextmenu=null;
   window.ondragstart=null;
   window.onkeydown=null;
   window.onmousedown=null;
   window.onmousemove=null;
   window.onmouseup=null;
   window.selectstart=null;
   window.onselectstart=null;
   window.onbeforeprint=null;
   },1000);

   document.oncontextmenu = 'null'; [].forEach.call(document.querySelectorAll('[oncontextmenu]'),
   function(AllowCopy){AllowCopy.removeAttribute('oncontextmenu');}); [].forEach.call(document.querySelectorAll('[onselectstart = "return false;"]'),
   function(AllowCopy){AllowCopy.removeAttribute('onselectstart');}); [].forEach.call(document.querySelectorAll('[onmousedown = "return false;"]'),
   function(AllowCopy){AllowCopy.removeAttribute('onselectstart');}); [].forEach.call(document.querySelectorAll('[oncopy]'),
   function(AllowCopy){AllowCopy.removeAttribute('oncopy');});[].forEach.call(document.querySelectorAll('[unselectable]'),
   function(AllowCopy){AllowCopy.removeAttribute('unselectable');});
   GM_addStyle('*{user-select:text!important;-moz-user-select:text!important;-webkit-user-select:text!important;-webkit-user-drag:text!important;-khtml-user-select:text!important;}');
   var Elements = document.createElement('script');
   Elements.setAttribute('type', 'text/javascript');
   Elements.textContent = "$(function() {\n" + "$('body').off('copy contextmenu selectstart').unbind('contextmenu');\n" + "});";
   document.getElementsByTagName('body')[0].appendChild(Elements);





