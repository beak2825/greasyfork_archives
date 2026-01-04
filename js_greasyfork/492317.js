// ==UserScript==
// @name         Confluence In-line Monospace Style Keyboard Shortcut Helper
// @namespace    http://tampermonkey.net/
// @version      2024-04-12
// @description  Add keyboard shortcut for Confluence text editor to allow quick toggle style of selected text.
// @author       Kyson, Zijing
// @match        https://*/pages/*.action*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492317/Confluence%20In-line%20Monospace%20Style%20Keyboard%20Shortcut%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/492317/Confluence%20In-line%20Monospace%20Style%20Keyboard%20Shortcut%20Helper.meta.js
// ==/UserScript==

(function() {
    let waitForTinyMce = function () {
        if (window.tinyMCE.activeEditor) {
            console.log("Keyboard shortcuts editor patch loaded.");
            window.tinyMCE.activeEditor.addShortcut('meta+alt+m', 'Switch Monospace Style', 'confMonospace');
            window.tinyMCE.activeEditor.addShortcut('meta+alt+j', 'Switch Superscript Style', 'Superscript');
            window.tinyMCE.activeEditor.addShortcut('meta+alt+k', 'Switch Subscript Style', 'Subscript');
        } else {
            setTimeout(waitForTinyMce, 1000)
        }
    }
    waitForTinyMce();
})();
