// ==UserScript==
// @name         Invisible Typer
// @namespace    Royalgamer06
// @version      1.0
// @description  Type an invisible character when pressing CTRL + Space.
// @author       Royalgamer06
// @include      *
// @exclude      file://*
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/25360/Invisible%20Typer.user.js
// @updateURL https://update.greasyfork.org/scripts/25360/Invisible%20Typer.meta.js
// ==/UserScript==

var charcode = 8290; //10240, 8290, 8192, 8193, 8239, 8204, 8195, 4448, 12644
unsafeWindow.onkeydown = function(e) {
    if (e.ctrlKey && e.keyCode == 32) {
        try {
            document.execCommand('insertText', false, String.fromCharCode(charcode));
        } catch(c) {
            try {
                document.activeElement.value = document.activeElement.value.slice(0, document.activeElement.selectionStart) + String.fromCharCode(charcode) + document.activeElement.value.slice(document.activeElement.selectionEnd);
            } catch(c) {}
        }
    }
};