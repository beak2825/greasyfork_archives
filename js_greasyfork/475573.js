// ==UserScript==
// @name         Azubiheft.de - Warn on to many lines
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Wanrns if there are to many lines to send the report
// @author       Tim Gromeyer <tim.gromeyer@gmail.com>
// @match        https://www.azubiheft.de/Azubi/Wochenansicht.aspx?*
// @match        https://www.azubiheft.de/Azubi/Tagesbericht.aspx?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azubiheft.de
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475573/Azubiheftde%20-%20Warn%20on%20to%20many%20lines.user.js
// @updateURL https://update.greasyfork.org/scripts/475573/Azubiheftde%20-%20Warn%20on%20to%20many%20lines.meta.js
// ==/UserScript==

var entries = [];

if (window.location.pathname === "/Azubi/Wochenansicht.aspx") {
    entries = document.getElementsByClassName("d50");
} else {
    entries = document.getElementsByClassName("row7 d5");
}
var entriesLength = entries.length;

var linesCount = 0;

for (var i = 0; i < entriesLength; i++) {
    linesCount += entries[i].childElementCount;
}
linesCount += entries.length;

if (linesCount > 30) {
    var warning = document.createElement("div");
    warning.className = "warning";
    warning.textContent = "To many lines. Reduce the number of lines to 30 or less. Current number of lines: " + linesCount;

    warning.style.backgroundColor = "orange";
    warning.style.color = "white";
    warning.style.padding = "10px";
    warning.style.textAlign = "center";
    warning.style.fontWeight = "bold";
    warning.position = "fixed";
    warning.top = 0;
    warning.left = 0;
    warning.with = "100%";

    document.body.insertBefore(warning, document.body.firstChild);
}
