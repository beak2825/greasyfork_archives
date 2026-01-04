// ==UserScript==
// @name         monke
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  monke monke
// @author       You
// @match        https://www.amazon.de/-/en/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.de
// @grant        none
// @run-at document-start
// @license      [carl, creatzs].license
// @downloadURL https://update.greasyfork.org/scripts/439426/monke.user.js
// @updateURL https://update.greasyfork.org/scripts/439426/monke.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    location.href = location.href.replace('https://www.amazon.de/-/en/', 'https://www.amazon.de/-/de/')
})();