// ==UserScript==
// @name         Chicken Productions
// @namespace    http://tampermonkey.net/
// @version      ChickenProductions1.0
// @description  Chickenifies almost all the websites you visit
// @author       TheChickenMan
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/390004/Chicken%20Productions.user.js
// @updateURL https://update.greasyfork.org/scripts/390004/Chicken%20Productions.meta.js
// ==/UserScript==

var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = "* { background: url(https://static.wixstatic.com/media/c5cbd9_030586a59fa94ee6a81dfe596bb7a971~mv2.png/v1/fill/w_258,h_200,al_c,q_80,usm_0.66_1.00_0.01/c5cbd9_030586a59fa94ee6a81dfe596bb7a971~mv2.webp) repeat-y, url(https://static.wixstatic.com/media/c5cbd9_030586a59fa94ee6a81dfe596bb7a971~mv2.png/v1/fill/w_258,h_200,al_c,q_80,usm_0.66_1.00_0.01/c5cbd9_030586a59fa94ee6a81dfe596bb7a971~mv2.webp) repeat-y !important; background-size: 100% !important; } \n";
document.getElementsByTagName("head")[0].appendChild(style);