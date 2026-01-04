// ==UserScript==
// @name    	Redirect KLZ
// @description Unlock Plus Content from KleineZeitung
// @include     *.kleinezeitung.*/*
// @version 0.0.1.20180901135351
// @namespace http://domain.com/directory
// @downloadURL https://update.greasyfork.org/scripts/371795/Redirect%20KLZ.user.js
// @updateURL https://update.greasyfork.org/scripts/371795/Redirect%20KLZ.meta.js
// ==/UserScript==
 
var hlocation =window.location;
var hlocation = String(hlocation)
 
 
 
//window.location.replace('l.facebook.com/l.php?u='+location);
var fb = "https://l.facebook.com/l.php?u=";
var newlocation = fb+hlocation;
 
 
 
 
var input=document.createElement("input");
input.type="button";
input.value="convert to plus";
input.setAttribute("style", "font-size:20px;position:absolute;top:0px;right:80px;width:240px;");
input.onclick = redirect;
document.body.appendChild(input);
 
function redirect()
{
window.location.replace(newlocation); 
}
