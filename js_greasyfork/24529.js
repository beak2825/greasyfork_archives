// ==UserScript==
// @name         Zoom to max instant
// @namespace    meatman2tasty
// @version      1.0
// @description  Zoom in/out using tab and q
// @author       s8n's version of noon's script
// @match        http://vertix.io/
// @match        http://www.vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24529/Zoom%20to%20max%20instant.user.js
// @updateURL https://update.greasyfork.org/scripts/24529/Zoom%20to%20max%20instant.meta.js
// ==/UserScript==


document.getElementById("cvs").onkeydown=function(a){var b=a.keyCode?a.keyCode:a.which;9==b&&(maxScreenHeight=3000,maxScreenWidth=3000,resize());var b=a.keyCode?a.keyCode:a.which;81==b&&(maxScreenHeight-=1e3,maxScreenWidth-=1e3,resize())};