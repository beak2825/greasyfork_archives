// ==UserScript==
// @name         themeforest
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://themeforest.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372108/themeforest.user.js
// @updateURL https://update.greasyfork.org/scripts/372108/themeforest.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //var href = document.querySelectorAll('.item-preview__preview-buttons a.live-preview')[0].getAttribute('href').split('item')[1].split('/');

    location.href = document.querySelectorAll('.item-preview__preview-buttons a.live-preview')[0].getAttribute('href');
    //document.querySelectorAll('.item-preview__preview-buttons a.live-preview')[0].click();
})();