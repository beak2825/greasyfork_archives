// ==UserScript==
// @name         Goodbye selections
// @namespace    http://superuser.com/a/708325
// @version      0.2
// @author       Robertof
// @description:en Disable copy/paste restriction from jandan
// @match        http://*.jandan.net/*
// @grant        none
// @description Disable copy/paste restriction from jandan
// @downloadURL https://update.greasyfork.org/scripts/11316/Goodbye%20selections.user.js
// @updateURL https://update.greasyfork.org/scripts/11316/Goodbye%20selections.meta.js
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