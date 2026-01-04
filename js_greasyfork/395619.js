// ==UserScript==
// @name         DocTorn Cure
// @description  Cures DocTorn
// @version      1.0.1
// @author       Vinkuun
// @match        https://*.torn.com/*
// @grant        none
// @run-at       document-start
// @namespace    https://greasyfork.org/users/4796
// @downloadURL https://update.greasyfork.org/scripts/395619/DocTorn%20Cure.user.js
// @updateURL https://update.greasyfork.org/scripts/395619/DocTorn%20Cure.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", () => document.querySelector('script[uid]').setAttribute('uid', '1494436'));
})();