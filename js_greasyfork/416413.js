// ==UserScript==
// @description Clarizen feature add for nav bar
// @namespace   Clarizen PPM Playbook Nav
// @name   Clarizen PPM Playbook Nav
// @include     https://app2.clarizen.com/Clarizen/*
// @version     1.3
// @downloadURL https://update.greasyfork.org/scripts/416413/Clarizen%20PPM%20Playbook%20Nav.user.js
// @updateURL https://update.greasyfork.org/scripts/416413/Clarizen%20PPM%20Playbook%20Nav.meta.js
// ==/UserScript==

var link="https://pacificpm.sharepoint.com/sites/ClarizenDMS/SitePages/Project Playbook.aspx";
var header = document.querySelector("#HeaderWrapper");
var input=document.createElement("input");
input.type="button";
input.value="Playbook";
input.onclick = openWindow;
input.setAttribute("style", "font-size:12px;position:absolute;top:15px;left:150px;");
header.appendChild(input);

function openWindow()
{
    window.open(link);
}