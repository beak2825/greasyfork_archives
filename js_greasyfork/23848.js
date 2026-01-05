// ==UserScript==
// @name         Absolute Enable Right Click & Copy Backup
// @namespace    Absolute Right Click
// @description  Force Enable right click & Copy & Highlight
// @author       Absolute
// @version      1.1.5
// @include      http*://*
// @icon         https://cdn3.iconfinder.com/data/icons/communication-130/63/cursor-128.png
// @copyright    Absolute
// @grant        GM_addStyle
// @Exclude      /.*(JPG|PNG|GIF|JPEG|ico).*/

// @downloadURL https://update.greasyfork.org/scripts/23848/Absolute%20Enable%20Right%20Click%20%20Copy%20Backup.user.js
// @updateURL https://update.greasyfork.org/scripts/23848/Absolute%20Enable%20Right%20Click%20%20Copy%20Backup.meta.js
// ==/UserScript==

   document.body.setAttribute('oncontextmenu', 'return true');
   document.body.setAttribute('onselectstart', 'return true');
   document.body.setAttribute('ondragstart',   'return true');

   function clearEventListeners () {
   document.oncontextmenu = undefined;
   document.oncopy = undefined;
   document.oncut = undefined;
   document.onpaste = undefined;
   document.onselectstart = undefined;
   document.body.removeAttribute("oncopy");
   document.body.removeAttribute("ondrag");
   document.body.removeAttribute("oncontextmenu");
   document.body.removeAttribute("onselectstart");}
   window.addEventListener('load', clearEventListeners, false);

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
   },2000);

   var Elements = document.createElement('script');
   Elements.setAttribute('type', 'text/javascript');
   Elements.textContent = "$(function() {\n" + "$('body').off('copy contextmenu selectstart').unbind('contextmenu');\n" + "});";
   document.getElementsByTagName('body')[0].appendChild(Elements); [].forEach.call(document.querySelectorAll('[oncontextmenu]'),
   function(AllowCopy){AllowCopy.removeAttribute('oncontextmenu');}); [].forEach.call(document.querySelectorAll('[onselectstart="return false;"]'),
   function(AllowCopy){AllowCopy.removeAttribute('onselectstart');}); [].forEach.call(document.querySelectorAll('[onmousedown="return false;"]'),
   function(AllowCopy){AllowCopy.removeAttribute('onselectstart');}); [].forEach.call(document.querySelectorAll('[oncopy]'),
   function(AllowCopy){AllowCopy.removeAttribute('oncopy');});[].forEach.call(document.querySelectorAll('[unselectable]'),
   function(AllowCopy){AllowCopy.removeAttribute('unselectable');});
   if (document.onmousedown === 'rightclick') { document.onmousedown = ''; }
   if (document.oncontextmenu) { document.oncontextmenu = ''; }
   GM_addStyle('*{user-select:text !important;-moz-user-select:text!important;-webkit-user-select:text!important;-webkit-user-drag:text!important;-khtml-user-select:text!important;-khtml-user-drag:text!important;}');



