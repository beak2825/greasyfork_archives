// ==UserScript==
// @name         Php Sandbox Ctrl + Enter to execute
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Execute code faster
// @author       rostuhan
// @match        https://sandbox.onlinephpfunctions.com/
// @icon         https://www.google.com/s2/favicons?domain=onlinephpfunctions.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434266/Php%20Sandbox%20Ctrl%20%2B%20Enter%20to%20execute.user.js
// @updateURL https://update.greasyfork.org/scripts/434266/Php%20Sandbox%20Ctrl%20%2B%20Enter%20to%20execute.meta.js
// ==/UserScript==

function click() {
    document.getElementsByClassName("garlic-auto-save")[4].click();
}
var hold = false;
document.addEventListener("keydown", function(e) {
    if (e.key == "Control") {
        hold = true;
    }
    else if (e.key == "Enter" && hold) {
        click();
    }
});
document.addEventListener("keyup", function(e) {
    if (e.key == "Control") {
        hold = false;
    }
})