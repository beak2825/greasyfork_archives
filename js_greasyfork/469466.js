// ==UserScript==
// @name         Poop
// @namespace    敲掉我不想看到的部分
// @version      0.3
// @description  Bonk!
// @author       路过虎扑原版的jr
// @match        *://ambr.top/*
// @icon         https://cdn-icons-png.flaticon.com/512/6788/6788572.png?x-oss-process=image/resize,m_fill,w_72,h_72
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469466/Poop.user.js
// @updateURL https://update.greasyfork.org/scripts/469466/Poop.meta.js
// ==/UserScript==

// Remove div element with name="Advertisement"
var advertisementDiv = document.querySelector('div[name="Advertisment"]');
if (advertisementDiv) {
  advertisementDiv.remove();
}

// Remove video element
var videoElement = document.querySelector('video');
if (videoElement) {
  videoElement.remove();
}


// Remove elements with a class containing "footer"
var footerElements = document.querySelectorAll('[class*="footer"]');
footerElements.forEach(function(element) {
  element.remove();
});