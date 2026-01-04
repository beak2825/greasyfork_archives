// ==UserScript==
// @name         Remove "Focus On" Section
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Removes the element that features celebrities from the Criticker homepage.
// @author       Alsweider
// @match        https://www.criticker.com/
// @icon         https://www.criticker.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525859/Remove%20%22Focus%20On%22%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/525859/Remove%20%22Focus%20On%22%20Section.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Search & remove element with the ID "rc_focus"
    var focusSection = document.getElementById('sb_focus');
    if (focusSection) {
        focusSection.remove();
    }
})();
