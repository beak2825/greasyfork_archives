// ==UserScript==
// @name         RuneSoftware  security
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description no rats
// @author       adminman123 on discord
// @match        *://runesoftware.co/*
// @grant        none
// @license      idk
// @downloadURL https://update.greasyfork.org/scripts/479270/RuneSoftware%20%20security.user.js
// @updateURL https://update.greasyfork.org/scripts/479270/RuneSoftware%20%20security.meta.js
// ==/UserScript==

(function() {
    'use strict';

    alert('FAKE WEBSITE! Bringing to the real one');
    window.location.href = 'http://runesoftware.cc';
})();