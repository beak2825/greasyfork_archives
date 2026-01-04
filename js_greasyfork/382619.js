// ==UserScript==
// @name         Almost-All-Sites-Shrekifier
// @namespace    http://tampermonkey.net/
// @version      5HR3K
// @description  Shrekifies almost all the websites you visit
// @author       Khaaytil
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/382619/Almost-All-Sites-Shrekifier.user.js
// @updateURL https://update.greasyfork.org/scripts/382619/Almost-All-Sites-Shrekifier.meta.js
// ==/UserScript==

var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = "* { background: url(https://i.imgur.com/OSjEfYw.png) repeat-y, url(https://i.imgur.com/1DskioD.jpg) repeat-y !important; background-size: 100% !important; } \n";
document.getElementsByTagName("head")[0].appendChild(style);