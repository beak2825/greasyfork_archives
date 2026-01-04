// ==UserScript==
// @name  Shift equals E
// @description kids dont know how to use it
// @version  1.3
// @include  http://diep.io/*
// @connect  diep.io
// @author xeron
// @namespace    *://diep.io/
// @match        *://diep.io/
// @downloadURL https://update.greasyfork.org/scripts/432444/Shift%20equals%20E.user.js
// @updateURL https://update.greasyfork.org/scripts/432444/Shift%20equals%20E.meta.js
// ==/UserScript==
window.addEventListener("keyup", function(e) {
    if(e.code === "ShiftRight") {
        input.keyDown(69);
        input.keyUp(69);
    }
});
