// ==UserScript==
// @name         Phelps Boi
// @namespace    http://tampermonkey.net/
// @version      ChickenProductions1.0
// @description  Phelpsifies almost all the websites you visit
// @author       TheChickenMan
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/390868/Phelps%20Boi.user.js
// @updateURL https://update.greasyfork.org/scripts/390868/Phelps%20Boi.meta.js
// ==/UserScript==

var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = "* { background: url(https://d6vze32yv269z.cloudfront.net/users/ffe41b1e-78b2-4545-9f1f-197e0db7dcbb/qwwda8-L%20312.png) repeat-y, url(https://d6vze32yv269z.cloudfront.net/users/ffe41b1e-78b2-4545-9f1f-197e0db7dcbb/qwwda8-L%20312.png) repeat-y !important; background-size: 100% !important; } \n";
document.getElementsByTagName("head")[0].appendChild(style);