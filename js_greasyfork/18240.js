// ==UserScript==
// @name        Agar Chat
// @namespace   Wolkenflitzer und comniemeer
// @description Ein Agar.io Chat
// @include     *http://agar.io/?ip=149.202.54.217:*
// @include     *http://agar.io/?ip=comniemeer.de:*
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/18240/Agar%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/18240/Agar%20Chat.meta.js
// ==/UserScript==

var canvas = document.getElementById("canvas").parentElement;
var div = document.createElement("div");

div.id = "chatdiv";
div.setAttribute("style", "width:400px;height;250px;background-color:transparent;position:absolute;top:0px;left:0px;display:block;z-index:1000;");

var frame = document.createElement("iframe");
frame.id = "chatframe";
frame.src = "http://agarchat.comniemeer.de/";
frame.setAttribute("frameborder", "0");
frame.setAttribute("scrolling", "no");
frame.setAttribute("style", "width:100%;height:316px;");

div.appendChild(frame);
canvas.appendChild(div);