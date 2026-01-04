// ==UserScript==
// @name         HZ Learn - Text shadow fix
// @namespace    https://hz.nl/
// @version      1.0
// @description  Fixes UI issues on the HZ Learn pages.
// @author       Auxority (https://github.com/Auxority)
// @match        https://learn.hz.nl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hz.nl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474606/HZ%20Learn%20-%20Text%20shadow%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/474606/HZ%20Learn%20-%20Text%20shadow%20fix.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const styleSheet = document.styleSheets[0];
    if (!styleSheet) {
        return;
    }

    styleSheet.insertRule("a { text-shadow: none !important; }", 0);
    styleSheet.insertRule("h1 { text-shadow: 0 0 3px #000 !important; }", 0);
})();
