// ==UserScript==
// @name         Mute accounts under level 5
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fed up of spam and constant messages? Heres the solution.
// @author       You
// @match        http://www.diamondhunt.co/game.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27679/Mute%20accounts%20under%20level%205.user.js
// @updateURL https://update.greasyfork.org/scripts/27679/Mute%20accounts%20under%20level%205.meta.js
// ==/UserScript==

(function() {
    'use strict';

    addToChatBox = (function() {
        var cached_function = addToChatBox;
        return function() {
            if (parseInt(arguments[3].split(":")[0].replace(/[ )(]/g,'')) < 5) {
                return;
            }
            cached_function.apply(this, arguments);
        };
    }());
})();