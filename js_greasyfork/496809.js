// ==UserScript==
// @name         Keep Session Alive for McGraw-Hill Education
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simulate activity to keep session alive on learning.mheducation.com
// @match        https://learning.mheducation.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496809/Keep%20Session%20Alive%20for%20McGraw-Hill%20Education.user.js
// @updateURL https://update.greasyfork.org/scripts/496809/Keep%20Session%20Alive%20for%20McGraw-Hill%20Education.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        // Simulate a mouse move event
        document.body.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    }, 10000); // Every 10 seconds
})();