// ==UserScript==
// @name         Youtube video ending screen card remover
// @namespace    http://tampermonkey.net/
// @version      1.69
// @description  Makes the youtube video ending screen cards invisible
// @author       khaaytil
// @match        https://*www.youtube.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/377412/Youtube%20video%20ending%20screen%20card%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/377412/Youtube%20video%20ending%20screen%20card%20remover.meta.js
// ==/UserScript==

var toggleScreenCard = document.createElement("div"),
    screenCardStyle = document.createElement("style");

screenCardStyle.type = "text/css";
screenCardStyle.setAttribute("id", "screenCardStyle");
screenCardStyle.innerHTML = ".ytp-ce-element.ytp-ce-element-show {display: none;}";
document.getElementsByTagName("head")[0].appendChild(screenCardStyle);

toggleScreenCard.innerHTML = "Toggle Screen Card";
toggleScreenCard.setAttribute("id", "toggleScreenCard");
toggleScreenCard.setAttribute("style", "display: inline-block; position: absolute; top: 0; left: 120px; font-size: 1.2rem; color: #ffffff; background-color: #00ff00; padding: 1px; cursor: pointer;");
toggleScreenCard.addEventListener("click", toggleScreenCardOn);

window.addEventListener("load", function() {
    document.getElementById("upnext").style.position = "relative";
    while(true) {
        if (document.body.contains(document.getElementById("upnext"))) {
            document.getElementById("upnext").appendChild(toggleScreenCard);
            break;
        }
    }
})

function toggleScreenCardOn() {
    document.getElementById("toggleScreenCard").style.backgroundColor = "#ff0000";
    document.getElementById("screenCardStyle").innerHTML = "";
    document.getElementById("toggleScreenCard").addEventListener("click", toggleScreenCardOff);
    document.getElementById("toggleScreenCard").removeEventListener("click", toggleScreenCardOn);
}

function toggleScreenCardOff() {
    document.getElementById("toggleScreenCard").style.backgroundColor = "#00ff00";
    document.getElementById("screenCardStyle").innerHTML = ".ytp-ce-element.ytp-ce-element-show {display: none;}";
    document.getElementById("toggleScreenCard").addEventListener("click", toggleScreenCardOn);
    document.getElementById("toggleScreenCard").removeEventListener("click", toggleScreenCardOff);
}