// ==UserScript==
// @name         Dank-frog
// @namespace    http://tampermonkey.net/
// @version      ChickenProductions1.0
// @description  Memeifies almost all the websites you visit
// @author       TheChickenMan
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/382835/Dank-frog.user.js
// @updateURL https://update.greasyfork.org/scripts/382835/Dank-frog.meta.js
// ==/UserScript==

var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = "* { background: url(https://media1.tenor.com/images/1381f3b25c04df112e61cfaaddd876e2/tenor.gif?itemid=5103385) repeat-y, url(https://media1.tenor.com/images/1381f3b25c04df112e61cfaaddd876e2/tenor.gif?itemid=5103385) repeat-y !important; background-size: 100% !important; } \n";
document.getElementsByTagName("head")[0].appendChild(style);