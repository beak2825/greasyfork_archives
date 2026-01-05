// ==UserScript==
// @name         Niltalk ping
// @namespace    https://niltalk.com/
// @version      0.1
// @description  prevent niltalk chat expiration
// @author       r0bin
// @match        https://niltalk.com/r/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30039/Niltalk%20ping.user.js
// @updateURL https://update.greasyfork.org/scripts/30039/Niltalk%20ping.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(
        function() {
            var msg = document.getElementById('message');
            var btn = document.getElementById('bt-send');

            var tmp = msg.value;

            msg.value = 'ping';
            btn.click();

            msg.value = tmp;

        },
        300000
    );
})();