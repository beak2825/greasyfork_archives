// ==UserScript==
// @name         PWA Manifest Remover
// @namespace    https://github.com/jairjy
// @version      1.6
// @description  Removes the manifest file from any site, which enables the "back" arrow in all Progressive Web Apps.
// @author       JairJy
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/411404/PWA%20Manifest%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/411404/PWA%20Manifest%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var newe = document.createElement("link");
    newe.rel = "manifest";
    newe.href = " ";
    newe.setAttribute("crossorigin", "use-credentials");
    document.getElementsByTagName("head")[0].prepend(newe);
})();

