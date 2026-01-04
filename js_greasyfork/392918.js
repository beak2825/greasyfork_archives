// ==UserScript==
// @name         Skinchanger for Vanis.io
// @namespace    Skinchanger for Vanis.io
// @version      1.1
// @description  Vanis.io skinchanger by Diszy
// @author       Diszy#0001
// @match        https://vanis.io/*
// @match        https://dev.vanis.io/*
// @run-at       document-start
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require      http://code.jquery.com/ui/1.9.2/jquery-ui.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392918/Skinchanger%20for%20Vanisio.user.js
// @updateURL https://update.greasyfork.org/scripts/392918/Skinchanger%20for%20Vanisio.meta.js
// ==/UserScript==



// DON'T MIND THE CRAPPY CODE, I'VE WRITTEN THIS IN 5 MINUTES JUST FOR PERSONAL USE, BUT I THOUGHT MAYBE OTHERS WILL USE IT TOO. DON'T BE A SKID BY RENAMING IT, THANK YOU.


// YOU SHOULD ONLY TOUCH THIS, NOT THE CODE AT THE VERY BOTTOM
// CHANGE YOUR SKIN URLS, MAXIMUM OF 6 SKINS.
var skin1 = "https://skins.vanis.io/s/31dt54";
var skin2 = "https://skins.vanis.io/s/zc1dsb";
var skin3 = "https://skins.vanis.io/s/z3fm7e";
var skin4 = "https://skins.vanis.io/s/f7k8v0";
var skin5 = "https://skins.vanis.io/s/qdgzad";
var skin6 = "https://skins.vanis.io/s/e7to4u";
var rotateTime = 60000 // 1 second = 1000, 1 minute = 60000, etc.
















































































// DON'T TOUCH THIS IF YOU DON'T UNDERSTAND.
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
} // kinda adding the sleep function of JAVA to JS ;p
window.addEventListener('load', function() // run function setSkin after the page has been
{
    alert("If you change servers, it will take " + rotateTime / (1000*60) + " minute(s) for your skin to load.");
    setSkin();
});
async function setSkin() { // the skinchanger function
await sleep(10000);
document.getElementById("skinurl").value = skin1;
await sleep(rotateTime);
document.getElementById("skinurl").value = skin2;
await sleep(rotateTime);
document.getElementById("skinurl").value = skin3;
await sleep(rotateTime);
document.getElementById("skinurl").value = skin4;
await sleep(rotateTime);
document.getElementById("skinurl").value = skin5;
await sleep(rotateTime);
document.getElementById("skinurl").value = skin6;
await sleep(rotateTime);
    setSkin();
};

