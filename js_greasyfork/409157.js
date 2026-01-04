// ==UserScript==
// @name        Meduza.io: Close news on ESC hit
// @description This userscript enables ability to close news posts on Meduza.io using Escape key
// @match       https://meduza.io/*
// @namespace   https://github.com/ri-nat
// @version 0.0.1.20200819171028
// @downloadURL https://update.greasyfork.org/scripts/409157/Meduzaio%3A%20Close%20news%20on%20ESC%20hit.user.js
// @updateURL https://update.greasyfork.org/scripts/409157/Meduzaio%3A%20Close%20news%20on%20ESC%20hit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.addEventListener('keydown', function(e) {
        if (e.key == 'Escape') {
            document.getElementsByClassName('MaterialPanel-close')[0].getElementsByTagName('button')[0].click()
        }
    });
})();