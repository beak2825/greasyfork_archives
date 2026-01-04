// ==UserScript==
// @name         Agar.io Use mousebuttons
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Eject mass with left Mousebutton, and split with right Mousebutton
// @author       KanjiasDev
// @match        https://agar.io/*
// @icon         https://www.google.com/s2/favicons?domain=agar.io
// @grant        none
// @license GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/427676/Agario%20Use%20mousebuttons.user.js
// @updateURL https://update.greasyfork.org/scripts/427676/Agario%20Use%20mousebuttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.addEventListener) {
        document.addEventListener('contextmenu', function(e) {
            if (!window.core) return;

            core.split();
            e.preventDefault();
        }, false);
    } else {
        document.attachEvent('oncontextmenu', function() {
            if (!window.core) return;

            core.split();
            window.event.returnValue = false;
        });
    }

    if (document.addEventListener) {
        document.addEventListener('click', function(e) {
            if (!window.core) return;

            core.eject();
            e.preventDefault();
        }, false);
    } else {
        document.attachEvent('onclick', function() {
            if (!window.core) return;

            core.eject();
        });
    }

})();
