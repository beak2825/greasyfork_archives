// ==UserScript==
// @name         Enable Right CLick and Selection
// @version      1
// @description  Enable Right CLick and Selection on Skirdrowreloaded
// @author       Samu
// @match        https://www.skidrowreloaded.com/*
// @grant        none
// @namespace    ERCS
// @downloadURL https://update.greasyfork.org/scripts/13967/Enable%20Right%20CLick%20and%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/13967/Enable%20Right%20CLick%20and%20Selection.meta.js
// ==/UserScript==

document.oncontextmenu = null;
document.onmousedown = null;
window.disableSelection = null;
document.body.onmousedown = null;
document.body.style.cursor = "auto";
document.body.onselectstart = null;
document.body.style.MozUserSelect = "auto";