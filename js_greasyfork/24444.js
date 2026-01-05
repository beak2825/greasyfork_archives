// ==UserScript==
// @name         Zoom out and in
// @namespace    meatman2tasty
// @version      1.2
// @description  Zoom in/out using tab and q
// @author       s8n's version of noon's script
// @match        http://vertix.io/
// @match        http://www.vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24444/Zoom%20out%20and%20in.user.js
// @updateURL https://update.greasyfork.org/scripts/24444/Zoom%20out%20and%20in.meta.js
// ==/UserScript==


document.getElementById("cvs").onkeydown=function(a){var b=a.keyCode?a.keyCode:a.which;9==b&&(maxScreenHeight=4500,maxScreenWidth=4600,resize());var b=a.keyCode?a.keyCode:a.which;81==b&&(maxScreenHeight-=1e3,maxScreenWidth-=1e3,resize())};