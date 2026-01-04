// ==UserScript==
// @name         AWBW: Disable Right Click in game
// @namespace    http://tampermonkey.net/
// @version      2024-01-30
// @description  Just disable right click context menu and that's it.
// @author       Hollen9
// @match        https://awbw.amarriner.com/game.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486080/AWBW%3A%20Disable%20Right%20Click%20in%20game.user.js
// @updateURL https://update.greasyfork.org/scripts/486080/AWBW%3A%20Disable%20Right%20Click%20in%20game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // No context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    }, false);

    // No text selecting
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
    }, false);

    // No dragging
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
    }, false);
})();