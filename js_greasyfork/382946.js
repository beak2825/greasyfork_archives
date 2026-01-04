// ==UserScript==
// @name         Sub to Pewdiepie
// @namespace    http://tampermonkey.net/
// @version      ChickenProductions1.1
// @description  PewDiePieifies almost all the websites you visit
// @author       TheChickenMan
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/382946/Sub%20to%20Pewdiepie.user.js
// @updateURL https://update.greasyfork.org/scripts/382946/Sub%20to%20Pewdiepie.meta.js
// ==/UserScript==

var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = "* { background: url(https://media.tenor.com/images/512bcbf8c75e7b343d820ed4b3495753/tenor.gif) repeat-y, url(https://media.tenor.com/images/512bcbf8c75e7b343d820ed4b3495753/tenor.gif) repeat-y !important; background-size: 100% !important; } \n";
document.getElementsByTagName("head")[0].appendChild(style);