// ==UserScript==
// @name         Stop Google Badgering
// @description  Stops Google from badgering about annoying stuff
// @version      1.0.11
// @author       heavyLobster2
// @namespace    github.com/heavyLobster2
// @match        *://www.google.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388467/Stop%20Google%20Badgering.user.js
// @updateURL https://update.greasyfork.org/scripts/388467/Stop%20Google%20Badgering.meta.js
// ==/UserScript==
(function () {
    "use strict";
    var style = document.createElement("style");
    style.type = "text/css";
    document.head.appendChild(style);
    style.sheet.insertRule("[role='dialog'] { display: none !important; }", 0);
})();