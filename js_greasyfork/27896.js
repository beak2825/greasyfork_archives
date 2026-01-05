// ==UserScript==
// @name         Zoom karnage
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  zoom F
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27896/Zoom%20karnage.user.js
// @updateURL https://update.greasyfork.org/scripts/27896/Zoom%20karnage.meta.js
// ==/UserScript==

myVar = setInterval(function(){
    setTimeout(camera.zoom = 0.3, 2);
}, 1000);

$window.onkeydown = function() {
   if (event.keyCode === 70) { 
    clearInterval(myVar);    
   }
};