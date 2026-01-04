// ==UserScript==
// @name         Delimiter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Marian Danilencu
// @include      *convert.town/column-to-comma-separated-list*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393777/Delimiter.user.js
// @updateURL https://update.greasyfork.org/scripts/393777/Delimiter.meta.js
// ==/UserScript==

document.querySelectorAll("h1")[0].style.display="none";
document.getElementById("main-content").style.display="none"
document.querySelectorAll("div")[21].style.display="none";
document.getElementById("ads-right-column").style.display="none";
document.getElementById("social").style.visibility="hidden";
document.querySelector(".push").style.display="none";
document.querySelectorAll("img")[1].style.display="none";
var trigger = document.getElementsByClassName("col-md-12");
for(var i =0; i < trigger.length; i++) {trigger[i].style.display="none"}