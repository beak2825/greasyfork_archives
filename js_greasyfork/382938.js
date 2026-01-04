// ==UserScript==
// @name         Thanos
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Thanosifies almost all the websites you visit
// @author       TheChickenMan
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/382938/Thanos.user.js
// @updateURL https://update.greasyfork.org/scripts/382938/Thanos.meta.js
// ==/UserScript==
//Thanos v2.0 has a better transparent gif so you can have the full thanos twerking experience

var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = "* { background: url(https://media.tenor.com/images/5185e189880510119152ade7d0859fcc/tenor.gif) repeat-y, url(https://media.tenor.com/images/5185e189880510119152ade7d0859fcc/tenor.gif) repeat-y !important; background-size: 100% !important; } \n";
document.getElementsByTagName("head")[0].appendChild(style);