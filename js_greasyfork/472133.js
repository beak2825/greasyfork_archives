// ==UserScript==
// @name         CTRL-Z for jpdb.io
// @namespace
// @version      0.2
// @description  Press "CTRL-Z" (hotkey) to undo review
// @author       DarkShadow44 (Fabian Maurer
// @match        https://jpdb.io/review*
// @license      MIT
// @grant        none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/472133/CTRL-Z%20for%20jpdbio.user.js
// @updateURL https://update.greasyfork.org/scripts/472133/CTRL-Z%20for%20jpdbio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'z') {
             window.history.back();
        }
    });
})();
