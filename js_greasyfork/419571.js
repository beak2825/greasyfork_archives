// ==UserScript==
// @name         Diep.io Rshift to autofire
// @version      0.1
// @description  for people who use arrow keys
// @author       xeron
// @match        ://diep.io/
// @namespace https://greasyfork.org/users/686267
// @downloadURL https://update.greasyfork.org/scripts/419571/Diepio%20Rshift%20to%20autofire.user.js
// @updateURL https://update.greasyfork.org/scripts/419571/Diepio%20Rshift%20to%20autofire.meta.js
// ==/UserScript==
window.addEventListener("keyup", function(e) {
    if(e.code === "ShiftRight") {
        input.keyDown(69);
        input.keyUp(69);
    }
});