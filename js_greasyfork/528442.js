// ==UserScript==
// @name         Filter Alter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filter Alter.
// @run-at       document-start
// @author       Otokoneko
// @match        https://manwa.me/chapter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manwa.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528442/Filter%20Alter.user.js
// @updateURL https://update.greasyfork.org/scripts/528442/Filter%20Alter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalAlert = window.alert;

    function shouldBlockAlert(message) {
        const blockedPatterns = [
            /广告/i,
        ];

        return blockedPatterns.some(pattern => pattern.test(message));
    }

    window.alert = function(message) {
        if (shouldBlockAlert(message.toString())) {
            console.log('Blocked alert:', message);
            return;
        }

        originalAlert.apply(window, arguments);
    };

    Object.defineProperty(window, 'alert', {
        writable: false,
        configurable: false
    });
})();