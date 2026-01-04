// ==UserScript==
// @name        Improved Content Width - fandom.com
// @namespace   Violentmonkey Scripts
// @match       https://*.fandom.com/wiki/*
// @grant       none
// @version     1.0
// @author      neruok
// @license     WTFPL
// @description The width of the content window is no longer limited, making it easier to read wide tables.
// @downloadURL https://update.greasyfork.org/scripts/436247/Improved%20Content%20Width%20-%20fandomcom.user.js
// @updateURL https://update.greasyfork.org/scripts/436247/Improved%20Content%20Width%20-%20fandomcom.meta.js
// ==/UserScript==

var s = document.createElement("style");
s.innerHTML = ".wide-resizable-container { max-width:unset !important; }";
document.getElementsByTagName("head")[0].appendChild(s);

var elem, style;
elem = document.querySelector(".main-container .resizable-container");
elem.classList.add("wide-resizable-container");



