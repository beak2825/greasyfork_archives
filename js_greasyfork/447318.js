// ==UserScript==
// @name         Ping 
// @namespace    -
// @version      1
// @license MIT
// @description  This Script is Provided By xXGuiXx YT
// @author       xXGuiXx YT
// @match        *://stratums.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447318/Ping.user.js
// @updateURL https://update.greasyfork.org/scripts/447318/Ping.meta.js
// ==/UserScript==
let author = ["xXGuiXx YT"];

var ping = document.getElementById("pingDisplay");
ping.replaceWith(document.createElement("a"));
ping.style.fontSize = "30px";
ping.style.display = "block";
ping.style.zIndex = "1";
document.body.appendChild(ping);