// ==UserScript==
// @name         Zoom out
// @namespace    http://reddit.com/u/highnoon643
// @version      1.1
// @description  Zoom in/out using pageUp and pageDown
// @author       ani's official script. Made by noon- slightly changed.
// @match        http://vertix.io/
// @match        http://www.vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24459/Zoom%20out.user.js
// @updateURL https://update.greasyfork.org/scripts/24459/Zoom%20out.meta.js
// ==/UserScript==


document.getElementById("cvs").onkeydown=function(a){var b=a.keyCode?a.keyCode:a.which;34==b&&(maxScreenHeight=2800,maxScreenWidth=2900,resize());var b=a.keyCode?a.keyCode:a.which;33==b&&(maxScreenHeight-=1e3,maxScreenWidth-=1e3,resize())};