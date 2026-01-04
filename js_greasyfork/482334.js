// ==UserScript==
// @name         V3rm.net enhancer
// @version      1.0
// @description  Removes Bloxflip banner from v3rm.net pages
// @author       Chat GPT
// @match        https://v3rm.net/*
// @namespace https://greasyfork.org/users/1234471
// @downloadURL https://update.greasyfork.org/scripts/482334/V3rmnet%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/482334/V3rmnet%20enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var bloxflip = document.querySelector('li.notice[data-notice-id="6"]');

    if (bloxflip) {
        bloxflip.remove();
    }
})();