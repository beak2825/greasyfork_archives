// ==UserScript==
// @match http://www.tvguide.com/listings/
// @name TV Guide Tidy
// @description Cleans up the TV Guide listings page
// @version 1.0
// @namespace https://greasyfork.org/users/4821
// @downloadURL https://update.greasyfork.org/scripts/4654/TV%20Guide%20Tidy.user.js
// @updateURL https://update.greasyfork.org/scripts/4654/TV%20Guide%20Tidy.meta.js
// ==/UserScript==

window.onload = function(){

var l = document.querySelector(".listings-w");
var b = document.querySelector("body");
l.parentNode.removeChild(l);
b.innerHTML = "";
b.appendChild(l);
l.setAttribute("style", "position:absolute;top:0;left:0;width:100%;height:100%");
document.querySelector(".gridDiv").setAttribute("style", "height:auto;overflow-x:hidden;border-bottom:solid 1px #DCDDCB");

};