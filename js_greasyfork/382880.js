// ==UserScript==
// @name         Default Dancing
// @namespace    http://tampermonkey.net/
// @version      ChickenProductions1.0
// @description  Defaultifies almost all the websites you visit
// @author       TheChickenMan
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/382880/Default%20Dancing.user.js
// @updateURL https://update.greasyfork.org/scripts/382880/Default%20Dancing.meta.js
// ==/UserScript==

var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = "* { background: url(https://i.makeagif.com/media/5-13-2018/QNvZv0.gif) repeat-y, url(https://i.makeagif.com/media/5-13-2018/QNvZv0.gif) repeat-y !important; background-size: 100% !important; } \n";
document.getElementsByTagName("head")[0].appendChild(style);