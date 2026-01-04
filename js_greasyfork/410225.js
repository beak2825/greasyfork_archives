// ==UserScript==
// @name        LMS Class Colors
// @namespace   Violentmonkey Scripts
// @match       https://lms.rpi.edu/*
// @grant       none
// @version     1.0
// @author      -
// @description 8/31/2020, 8:51:28 AM
// @downloadURL https://update.greasyfork.org/scripts/410225/LMS%20Class%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/410225/LMS%20Class%20Colors.meta.js
// ==/UserScript==

var placeName = document.getElementById("crumb_1").textContent;

document.getElementsByClassName("global-nav-bar-wrap")[0].style.position = "relative";


var topTab = document.getElementById("topTabs");
var miniTab = document.getElementsByClassName("global-nav-bar-wrap")[0];
var place = document.createElement("p");
place.textContent = document.getElementById("crumb_1").textContent;
place.style.color = "white";
place.style.margin = "0.5rem";
place.style.marginLeft = "3rem";
place.style.fontWeight = "600";
place.style.position = "absolute";
place.style.bottom = "0";
miniTab.append(place);

var color = "";

if (placeName.includes("MATH")) color = "#eb3434";
else if (placeName.includes("IHSS")) color = "#f4f745";
else if (placeName.includes("BIOL")) color = "#ae34eb";
else if (placeName.includes("DATA STRUCTURES")) color = "#eb6e34";

topTab.style.backgroundColor = color;
miniTab.style.backgroundColor = color;