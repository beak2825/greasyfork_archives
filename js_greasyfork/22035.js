// ==UserScript==
// @name         [Katcr.co] Always HTTPS
// @namespace    pxgamer
// @version      0.1
// @description  As the KAT team seem to be ignoring the KAT's Problems thread, here it goes.
// @author       pxgamer
// @include      http://katcr.co/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/22035/%5BKatcrco%5D%20Always%20HTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/22035/%5BKatcrco%5D%20Always%20HTTPS.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';
    location.replace('https://' + location.href.split('://')[1]);
})();
