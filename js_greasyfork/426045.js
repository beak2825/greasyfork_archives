// ==UserScript==
// @name        PSBOT
// @namespace   Violentmonkey Scripts
// @match       https://itsm.services.sap/*
// @match       https://sap.service-now.com/*
// @grant       none
// @version     0.1
// @author      I843865
// @description 5/06/2021, 4:04:08 PM
//@run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/426045/PSBOT.user.js
// @updateURL https://update.greasyfork.org/scripts/426045/PSBOT.meta.js
// ==/UserScript==
   
   
   
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
  
  

  
   
function pollDOM() {
  
  if (!document.getElementById("cai-webchat")) {
		var s = document.createElement("script");
	 	  s.setAttribute("id", "cai-webchat");
		  s.setAttribute("src", "https://cdn.cai.tools.sap/webchat/webchat.js");
			  document.body.appendChild(s);
		}
		s.setAttribute("channelId", "3cf7cdeb-33ce-41e7-b1c7-438725833b46");
		s.setAttribute("token", "299e528a6e305aeba7a1009969b060e8");
  
  
 
 

}
 
 
function checkURL() {
 
  pollDOM();
  setTimeout(checkURL, 300);
 
}
 
checkURL();
  
/******/ })()