// ==UserScript==
// @name         Shrek Is Love
// @namespace    http://tampermonkey.net/
// @version      ChickenProductions1.0
// @description  Shrekifies almost all the websites you visit
// @author       TheChickenMan
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/383000/Shrek%20Is%20Love.user.js
// @updateURL https://update.greasyfork.org/scripts/383000/Shrek%20Is%20Love.meta.js
// ==/UserScript==

var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = "* { background: url(https://media1.tenor.com/images/7d3f352b46140c04db37c92f71d4e157/tenor.gif?itemid=8966840) repeat-y, url(https://media1.tenor.com/images/7d3f352b46140c04db37c92f71d4e157/tenor.gif?itemid=8966840) repeat-y !important; background-size: 100% !important; } \n";
document.getElementsByTagName("head")[0].appendChild(style);