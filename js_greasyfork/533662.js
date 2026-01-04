// ==UserScript==
// @name         MCKO Password Revealer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes password fields to text fields on *.mcko.ru for easier typing
// @author       Dmitry
// @match        *://*.mcko.ru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533662/MCKO%20Password%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/533662/MCKO%20Password%20Revealer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('input[type="password"]').forEach(input => {
        input.type = 'text';
    });
})();