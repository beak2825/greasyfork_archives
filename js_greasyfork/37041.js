// ==UserScript==
// @name         Reddit hide sidebar
// @namespace    reddit.com/u/GoldenSights
// @version      0.2
// @description  Hide the reddit sidebar with a simple button
// @author       GoldenSights
// @include        *://*.reddit.com/*
// @grant        metadata
// @downloadURL https://update.greasyfork.org/scripts/37041/Reddit%20hide%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/37041/Reddit%20hide%20sidebar.meta.js
// ==/UserScript==

function togglesidebar()
{
    var sidebar = document.querySelector(".side");
    if (sidebar.style.overflow == "hidden")
    {
        sidebar.style.height = "";
        sidebar.style.width = "";
        sidebar.style.overflow = "visible";
    }
    else
    {
        if($(document).width()< 1200){
            sidebar.style.height = "19px";
            sidebar.style.width = "46px";
            sidebar.style.overflow = "hidden";
        }
    }
}
var togglebutton = document.createElement("button");
var toggletext = document.createTextNode("Hidebar");
togglebutton.appendChild(toggletext);

togglebutton.addEventListener("click", togglesidebar);
togglebutton.style.fontSize = "9px";
togglebutton.style.position = "absolute";
togglebutton.style.right = "4px";
togglebutton.style.zIndex = "2";
togglebutton.style.color = "#000";

togglesidebar();

var sidebar = document.querySelector(".side");
var spacer = sidebar.querySelector(".spacer");
sidebar.insertBefore(togglebutton, spacer);