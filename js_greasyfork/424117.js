// ==UserScript==
// @name        Disable Selections
// @namespace   tag: utils
// @description Disable selections for ALL websites
// @author      Unbroken
// @match       *://*/*
// @version     1.00
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/424117/Disable%20Selections.user.js
// @updateURL https://update.greasyfork.org/scripts/424117/Disable%20Selections.meta.js
// ==/UserScript==
(function() {
    var disableSelections = function() {
        document.getSelection = window.getSelection = function() {
            return { isCollapsed: true };
        };
    };
    var script = document.createElement ("script");
    script.appendChild (document.createTextNode ("(" + disableSelections + ")();"));
    (document.body || document.head || document.documentElement).appendChild (script);
})();