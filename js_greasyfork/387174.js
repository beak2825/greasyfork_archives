// ==UserScript==
// @name         Narkoz - AYY - Y1
// @namespace    http://ygn01.ga
// @version      2.0
// @description  AgarZ.com System 2019
// @author       Developer  Y1
// @match        http://agarz.com/*
// @iconURL      http://ygn01.ga/icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387174/Narkoz%20-%20AYY%20-%20Y1.user.js
// @updateURL https://update.greasyfork.org/scripts/387174/Narkoz%20-%20AYY%20-%20Y1.meta.js
// ==/UserScript==
var username = "selima";
var password = "slmax";
var d = new Date();
var date = d.getTime();


$('head script[src*="js//main61obf.js?test"]').remove();
var script = document.createElement("script");
script.src = "http://ygn01.ga/agarz.js?username="+username+"&password="+password+"&v="+date;
document.getElementsByTagName("head")[0].appendChild(script);