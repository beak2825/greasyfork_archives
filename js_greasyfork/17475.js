// ==UserScript==
// @name     Down with the sloth!
// @include https://*.reddit.com/r/Guildwars2/*
// @description:en Replace the header background on /r/Guildwars2/
// @run-at document-start
// @grant    GM_addStyle
// @version 1.6
// @namespace https://greasyfork.org/users/31925
// @description Replace the header background on /r/Guildwars2/
// @downloadURL https://update.greasyfork.org/scripts/17475/Down%20with%20the%20sloth%21.user.js
// @updateURL https://update.greasyfork.org/scripts/17475/Down%20with%20the%20sloth%21.meta.js
// ==/UserScript==

GM_addStyle ("#header::after , #header::before {display: none !important;}");
var position = Math.floor((Math.random() * 100) + 1); 
var picarray = ["http://i.imgur.com/ea5u5eO.jpg" , "http://i.imgur.com/TEJetJY.jpg" , "http://i.imgur.com/9w3wJve.jpg" , "http://i.imgur.com/UULnDzW.jpg" , "http://i.imgur.com/h0hZfon.jpg" , "http://i.imgur.com/jMsPyQR.jpg" , "http://i.imgur.com/HoiSUqN.jpg" , "http://i.imgur.com/oCYUddy.jpg"]
var picture = picarray[Math.floor(Math.random() * picarray.length)]; 

document.addEventListener("load", function() {
var costumheader = document.getElementById("header");
costumheader.style.backgroundImage = "url('" + picture + "')";
costumheader.style.backgroundPosition = "50% " + position + "%";
costumheader.style.backgroundSize = "cover";
}, true);

// if you dont like the parallax scroll effect delete or rem the script after this line.

document.onscroll = function() {
parallax = "50% " + (position + (-window.scrollY / 15)).toFixed(1) + "%";
document.getElementById("header").style.backgroundPosition = parallax; };