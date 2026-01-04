// ==UserScript==
// @name        Amazon name address change to ❤
// @namespace   Violentmonkey Scripts
// @match     https://www.amazon.*/*
// @grant       none
// @version     0.1
// @author      fumihiro
// @description help to hide your name and address on the left of the top column of amazon.com
// @downloadURL https://update.greasyfork.org/scripts/404180/Amazon%20name%20address%20change%20to%20%E2%9D%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/404180/Amazon%20name%20address%20change%20to%20%E2%9D%A4.meta.js
// ==/UserScript==
var line1, line2, altText1, altText2;
line1 = document.getElementById('glow-ingress-line1');
line2 = document.getElementById('glow-ingress-line2');
altText1 = document.createElement("span");
altText1.className = "nav-line-1";
altText1.innerHTML = "❤❤❤❤❤❤❤❤❤❤❤"
altText2 = document.createElement("span");
altText2.className = "nav-line-2";
altText2.innerHTML = "❤❤❤❤❤❤❤❤❤❤❤"
line1.parentNode.replaceChild(altText1, line1);
line2.parentNode.replaceChild(altText2, line2);