// ==UserScript==
// @name         CTRL-s save for Django Admin
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  With this script you can use Control-s to save and continue in the Django Admin environment
// @author       mcemperor
// @match        */admin/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424617/CTRL-s%20save%20for%20Django%20Admin.user.js
// @updateURL https://update.greasyfork.org/scripts/424617/CTRL-s%20save%20for%20Django%20Admin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let keysDown = {}
    window.onkeydown = function (e) {
        keysDown[e.key] = true
        if (keysDown.Control && keysDown.s) {
            e.preventDefault()
            document.getElementsByName("_continue")[0].click()
        }
    }
    window.onkeyup = function (e) {
        keysDown[e.key] = false
    }
})();