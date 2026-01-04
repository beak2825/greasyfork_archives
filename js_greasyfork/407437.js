// ==UserScript==
// @name         Granblue - prevent mute
// @namespace    https://greasyfork.org/en/scripts/407437-granblue-prevent-mute
// @version      1.0
// @description  Prevents the game from muting itself when the window loses focus.
// @author       no one
// @match        game.granbluefantasy.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407437/Granblue%20-%20prevent%20mute.user.js
// @updateURL https://update.greasyfork.org/scripts/407437/Granblue%20-%20prevent%20mute.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("blur", function (e) {
        e.stopImmediatePropagation();
    }, false);
})();