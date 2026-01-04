// ==UserScript==
// @name         Death Logger
// @namespace    https://bonk.io/
// @version      0.1
// @description  if you die you unlog instantly (from your account (Only for quickplay!))
// @author       iNeonz
// @match        https://bonk.io/*
// @run-at       document-idle
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @downloadURL https://update.greasyfork.org/scripts/469679/Death%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/469679/Death%20Logger.meta.js
// ==/UserScript==
setInterval(() => {
    if ((!document.getElementById("ingametextwarning_spectating") || document.getElementById("ingametextwarning_spectating").style.display == 'none' || document.getElementById("ingametextwarning_spectating").style.visibility == 'hidden') && document.getElementById("gamerenderer") && document.getElementById("gamerenderer").children[0] && document.getElementById("gamerenderer").children[0].style.visibility != 'hidden' && document.getElementById("gamerenderer").style.visibility != 'hidden' && document.getElementById("ingamewinner") && document.getElementById("ingamewinner").style.visibility != 'hidden'){
        if (document.getElementById("ingamewinner_bottom") && document.getElementById("ingamewinner_top").textContent != document.getElementById("pretty_top_name").textContent){
            document.getElementById("pretty_top_exit").click();
            setTimeout(() => {
                document.getElementById("leaveconfirmwindow_okbutton").click();
            setTimeout(() => {
                document.getElementById("pretty_top_exit").click();
            },5);
            },5);
        }
    }
},500);