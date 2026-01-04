// ==UserScript==
// @name            PixeL0RD Captcha Killer
// @version         1.0.0
// @author          PixeL0RD
// @homepage        https://userscripts-mirror.org/scripts/show/15753
// @match           https://pixelcanvas.io/*

// @description     Die Captcha

// @namespace https://greasyfork.org/users/186608
// @downloadURL https://update.greasyfork.org/scripts/368229/PixeL0RD%20Captcha%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/368229/PixeL0RD%20Captcha%20Killer.meta.js
// ==/UserScript==

var contents = document.getElementById("contents");
var link;
if(contents){
if(contents.textContent.match('.*(Routine Check).*')){
link = contents.getElementsByTagName("a")[1].href;
setTimeout(Captcha,250);//use a delay

}
}
function Captcha(){
location.href = link;
}


