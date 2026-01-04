// ==UserScript==
// @name         Hide CSS
// @version      1.0
// @description  Trigger CSS from Link
// @match        https://www.google.com/
// @grant        none
// @namespace https://greasyfork.org/users/1178417
// @downloadURL https://update.greasyfork.org/scripts/475886/Hide%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/475886/Hide%20CSS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cssLink = document.createElement("link");
    cssLink.href = "https://playground.edel.travel/hide.css";
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    document.head.appendChild(cssLink);
})();
