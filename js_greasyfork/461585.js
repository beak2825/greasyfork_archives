// ==UserScript==
// @name         Ninja.io Immortality
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Gives you immortality in ninja.io
// @author       JekeX
// @match        http://ninja.io/
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461585/Ninjaio%20Immortality.user.js
// @updateURL https://update.greasyfork.org/scripts/461585/Ninjaio%20Immortality.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function immortal(){
        window.GameController.prototype.player.prototype.die = function(){
            //do nothing
        }
    }

    document.addEventListener('keydown', immortal, false);
})();