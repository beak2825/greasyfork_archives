// ==UserScript==
// @name         preview.themeforest.net
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://preview.themeforest.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377988/previewthemeforestnet.user.js
// @updateURL https://update.greasyfork.org/scripts/377988/previewthemeforestnet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //location.href = document.querySelectorAll('.preview__action--close a')[0].getAttribute('href');
    document.querySelectorAll('.preview__action--close a')[0].click();
})();