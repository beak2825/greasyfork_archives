// ==UserScript==
// @name         Absolute Enable Right Click & Copy 2
// @namespace    Absolute Right Click
// @description  Force Enable right click & Copy & Highlight
// @author       Absolute
// @version      1.1.9
// @include      http*://*
// @icon         https://cdn3.iconfinder.com/data/icons/communication-130/63/cursor-128.png
// @license      BSD
// @copyright    Absolute
// @grant        GM_addStyle
// @Exclude      /.*(JPG|PNG|GIF|JPEG|ico).*/

// @downloadURL https://update.greasyfork.org/scripts/24336/Absolute%20Enable%20Right%20Click%20%20Copy%202.user.js
// @updateURL https://update.greasyfork.org/scripts/24336/Absolute%20Enable%20Right%20Click%20%20Copy%202.meta.js
// ==/UserScript==

   var Exclude = ['app.box.com','www.dropbox.com','cp.sync.com','www.icloud.com','www.mega.nz','www.mediafire.com','translate.google','drive.google.com'];

   var Check = window.location.href;
   var Match = RegExp(Exclude.join('|')).exec(Check);
   var Frame = document.getElementsByTagName('body')[0];
   var iBody = function(event){event.stopImmediatePropagation();};

   if (Match) { } else {

   Frame.addEventListener('contextmenu',iBody,true);
   Frame.addEventListener('keydown',iBody,true);
   Frame.addEventListener('keyup',iBody,true);
   Frame.addEventListener('mouseup',iBody,true);
   Frame.addEventListener('mousedown',iBody,true);
   Frame.addEventListener('dragstart',iBody,true);
   Frame.addEventListener('selectstart',iBody,true);
   Frame.addEventListener('copy',iBody,true);
   }

   GM_addStyle(`*{
   user-select:text!important;
  -moz-user-select:text!important;
  -webkit-user-select:text!important;
  -webkit-user-drag:text!important;
  -khtml-user-select:text!important;
  -khtml-user-drag:text!important;}
   }`);














//   document.body.setAttribute('oncontextmenu','return true');
//   document.body.setAttribute('onselectstart','return true');
//   document.body.setAttribute('ondragstart' , 'return true');

//   function RemoveEvent () {
//   document.oncontextmenu = undefined;
//   document.oncopy = undefined;
//   document.oncut = undefined;
//   document.onpaste = undefined;
//   document.onselectstart = undefined;
//   document.body.removeAttribute("oncopy");
//   document.body.removeAttribute("ondrag");
//   document.body.removeAttribute("oncontextmenu");
//   document.body.removeAttribute("onselectstart");}
//   window.addEventListener('load', RemoveEvent, false);

//   setInterval (function () {
//   document.oncontextmenu=null;
//   document.contextmenu=null;
//   document.ondragstart=null;
//   document.onkeydown=null;
//   document.onmousedown=null;
//   document.onmousemove=null;
//   document.onmouseup=null;
//   document.onselectstart=null;
//   document.selectstart=null;
//   document.body.oncopy=null;
//   document.body.onselect=null;
//   document.body.onbeforecopy=null;
//   document.body.contextmenu=null;
//   document.body.oncontextmenu=null;
//   document.body.ondragstart=null;
//   document.body.onkeydown=null;
//   document.body.onmousedown=null;
//   document.body.onmousemove=null;
//   document.body.onmouseup=null;
//   document.body.selectstart=null;
//   document.body.onselectstart=null;
//   document.oncopy=null;
//   window.oncopy=null;
//   window.contextmenu=null;
//   window.oncontextmenu=null;
//   window.ondragstart=null;
//   window.onkeydown=null;
//   window.onmousedown=null;
//   window.onmousemove=null;
//   window.onmouseup=null;
//   window.selectstart=null;
//   window.onselectstart=null;
//   window.onbeforeprint=null;
//   },2000000000);


/*
   (function(css) {
   var head = document.getElementsByTagName("body")[0];
   if (head) {
   var style = document.createElement("style");
   style.textContent = css;
   style.type = "text/css";
   head.appendChild(style);
   }})('body, body * { -moz-user-focus:normal; -moz-user-select:text; -webkit-user-select:text; user-select:text; }');
  */ 

