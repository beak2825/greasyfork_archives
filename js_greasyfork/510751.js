// ==UserScript==
// @name         Alert on Every Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show an alert on every webpage
// @author       Your Name
// @match        *://*:*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510751/Alert%20on%20Every%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/510751/Alert%20on%20Every%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    alert('This alert shows up on every webpage!');
})();
