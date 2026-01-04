// ==UserScript==
// @name         Expand AutoHotKey board code boxes
// @namespace    https://autohotkey.com/boards/
// @version      0.1
// @description  Expand code boxes on https://autohotkey.com/boards/
// @author       Rod
// @match        https://autohotkey.com/boards/viewtopic.php?t=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38020/Expand%20AutoHotKey%20board%20code%20boxes.user.js
// @updateURL https://update.greasyfork.org/scripts/38020/Expand%20AutoHotKey%20board%20code%20boxes.meta.js
// ==/UserScript==

(function() {
    [].map.call(document.querySelectorAll('.codebox_plus a'), function(codebox) {
        if(codebox.text == '[Expand]' || codebox.text == '[Collapse]') {
            codebox_plus_toggle(codebox, '[Expand]', '[Collapse]');
        }
    });
})();