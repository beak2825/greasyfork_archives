// ==UserScript==
// @name         Double Tap
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  selected keys will repeat when released
// @author       Justin1L8
// @match        https://jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423612/Double%20Tap.user.js
// @updateURL https://update.greasyfork.org/scripts/423612/Double%20Tap.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // list of keycodes you want repeated. these numbers are displayed in jstris's controls page
    var doubleTapKeys = [82, 65]
    function f(e){
        if (doubleTapKeys.indexOf(e.keyCode) != -1 && !e.secondTap) {
            setTimeout( function() {
                document.dispatchEvent(new KeyboardEvent('keydown', {keyCode : e.keyCode}))
                var keyEvent = new KeyboardEvent('keyup', {keyCode : e.keyCode})
                keyEvent.secondTap = true
                document.dispatchEvent(keyEvent)
            }, 0)
        }
    }

    window.addEventListener("keyup", f, true);
})();