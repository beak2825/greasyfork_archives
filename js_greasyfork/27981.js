// ==UserScript==
// @name         MooMoo autospawn + Auto Attack
// @namespace    http://tampermonkey.net/
// @version      1.57
// @description  Auto spawns and attacks
// @author       meatman2tasty
// @match        http://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27981/MooMoo%20autospawn%20%2B%20Auto%20Attack.user.js
// @updateURL https://update.greasyfork.org/scripts/27981/MooMoo%20autospawn%20%2B%20Auto%20Attack.meta.js
// ==/UserScript==

setInterval(function(){ 
    setTimeout(enterGame(1), 2);
}, 10);

setInterval(function(){ 
    sendJoin(1);
}, 6000);

setInterval(function(){ 
    window.io.managers[Object.keys(this.io.managers)[0]].nsps["/"].emit("3", "d", 1);
}, 6000);

setInterval(function(){ 
    document.getElementById("nameInput").value = 'Lynchbots V1.57';
}, 1000);

setInterval(function(){ 
    window.io.managers[Object.keys(this.io.managers)[0]].nsps["/"].emit("3", "r", 1);
}, 6000);

setInterval(function(){ 
    window.io.managers[Object.keys(this.io.managers)[0]].nsps["/"].emit("4", '1');
}, 5000);

setInterval(function(){ 
    window.io.managers[Object.keys(this.io.managers)[0]].nsps["/"].emit("ch", 'LynchTheNigg3rsLynchTheNigg3rs');
}, 5000);

var element = document.getElementById("gameName");
element.parentNode.removeChild(element);

var element = document.getElementById("menuContainer");
element.parentNode.removeChild(element);

var element = document.getElementById("loadingText");
element.parentNode.removeChild(element);

var element = document.getElementById("mainMenu");
element.parentNode.removeChild(element);