// ==UserScript==
// @name         Escape/quit gallery e-hentai
// @namespace    https://greasyfork.org/users/45933
// @version      0.1
// @description  Quit gallery mode with escape
// @run-at       document-end
// @grant        none
// @noframes
// @nocompat    Chrome
// @match        *://*.e-hentai.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-hentai.org
// @author       Fizzfaldt
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500485/Escapequit%20gallery%20e-hentai.user.js
// @updateURL https://update.greasyfork.org/scripts/500485/Escapequit%20gallery%20e-hentai.meta.js
// ==/UserScript==


/* jshint esversion: 6 */
function listen(e) {
    'use strict';
    /*
Backspace    8
Tab          9
Enter       13
Shift       16
Control     17
Alt         18
CapsLock    20
Escape      27
Space       32
PageUp      33
PageDown    34
End         35
Home        36
ArrowLeft   37
ArrowUp     38
ArrowRight  39
ArrowDown   40
Delete      46
*/
    if (document.activeElement.tagName == "TEXTAREA") {
        // Do nothing when inside a text field.
        return;
    }
    if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
        // Do nothing when modifiers are held (e.g. allow Alt+Left to go back/...
        return;
    }

    var result;
    switch (e.keyCode) {
        case 27: // Left
            action_gallery();
            break;
        default:
            //console.log("pressed " + e.keyCode + " " + e);
            return;
    }
}

(function() {
    'use strict';
    document.addEventListener('keyup', listen);
})();
