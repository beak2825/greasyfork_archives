// ==UserScript==
// @name         Facebook Shrekifier
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Shrekifies your facebook
// @author       Khaaytil
// @match        https://*www.facebook.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/377972/Facebook%20Shrekifier.user.js
// @updateURL https://update.greasyfork.org/scripts/377972/Facebook%20Shrekifier.meta.js
// ==/UserScript==

var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = "* { background-image: url(https://i.imgur.com/1DskioD.jpg) !important; } \n";
document.getElementsByTagName("head")[0].appendChild(style);