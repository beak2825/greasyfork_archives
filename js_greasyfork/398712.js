// ==UserScript==
// @name         Youtube Coronavirus fix
// @namespace    http://radexito.ssd-linuxpl.com
// @version      0.1
// @description  try to take over the world!
// @author       Radosław Wysocki
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398712/Youtube%20Coronavirus%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/398712/Youtube%20Coronavirus%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!document.getElementsByClassName("ytp-error")) {
        window.location.reload();
    }
})();