// ==UserScript==
// @name           Viewer Easily
// @namespace      http://tampermonkey.net/
// @description    Easy viewer with this script
// @version        1.2
// @author         STRAGON
// @license        N/A
// @match          *://gartic.io/*
// @match          *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @icon           https://static.cdnlogo.com/logos/s/96/st.svg
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addValueChangeListener
// @grant          GM_addStyle
// @namespace *
// @downloadURL https://update.greasyfork.org/scripts/504253/Viewer%20Easily.user.js
// @updateURL https://update.greasyfork.org/scripts/504253/Viewer%20Easily.meta.js
// ==/UserScript==

var panel = document.createElement("div");
panel.style.position = "fixed";
panel.style.top = "20px";
panel.style.right = "20px";
panel.style.width = "260px";
panel.style.height = "30px";
panel.style.backgroundColor = "#000";
panel.style.borderRadius = "10px";
panel.style.padding = "8px";
panel.style.zIndex = "1000";
panel.style.textAlign = "center";
panel.style.border = "2px solid red";

var linkInput = document.createElement("input");
linkInput.type = "text";
linkInput.placeholder = "Enter link ...";
linkInput.style.width = "70%";
linkInput.style.borderRadius = "5px";
panel.appendChild(linkInput);


var btn1 = document.createElement("button");
btn1.style.backgroundColor = "#FF0000";
btn1.style.color = "#fff";
btn1.style.border = "none";
btn1.style.padding = "7px 0px";
btn1.style.borderRadius = "5px";
btn1.style.cursor = "pointer";
btn1.textContent = "Viewer";
btn1.style.width = "25%";
btn1.style.marginLeft = "5px";


panel.appendChild(btn1);

btn1.addEventListener("click", function() {
var link = linkInput.value;
var newlink = link+"/viewer";
window.open(newlink, '_blank');
});


let html=`


`

document.body.appendChild(panel);
