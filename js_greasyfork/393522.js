// ==UserScript==
// @name         Moodle to Moodle-RC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  redict to read only version of moodle when moodle is down
// @author       Imageine Breaker
// @match        https://moodle.nottingham.ac.uk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393522/Moodle%20to%20Moodle-RC.user.js
// @updateURL https://update.greasyfork.org/scripts/393522/Moodle%20to%20Moodle-RC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var request = new XMLHttpRequest();
    request.open('GET', window.location.href);
    request.send();
    request.onreadystatechange = function() {
        console.log(request.status);
        if (request.status == 503) {
            console.log(window.location.href.replace('moodle', 'moodle-rc'));
            window.location.replace("https://moodle-rc.nottingham.ac.uk");
        }
    }

})();