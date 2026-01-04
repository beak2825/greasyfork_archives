// ==UserScript==
// @name         Bloxd Fullscreen Bypass
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Lets you play bloxd.io without having to enter fullscreen
// @author       Devappl
// @match        https://bloxd.io/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486704/Bloxd%20Fullscreen%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/486704/Bloxd%20Fullscreen%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        var elementToDelete = document.querySelector('.ForceRotateBackground.FullyFancyText');
        if (elementToDelete) {
            elementToDelete.remove();
        }
    }, 100);
})();
