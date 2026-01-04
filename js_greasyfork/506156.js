// ==UserScript==
// @name         Douyin Video Keep Playing
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Keep Douyin video playing when switching tabs
// @author       Your Name
// @match        https://www.douyin.com/vsdetail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506156/Douyin%20Video%20Keep%20Playing.user.js
// @updateURL https://update.greasyfork.org/scripts/506156/Douyin%20Video%20Keep%20Playing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Override the visibilityState property to always return 'visible'
    Object.defineProperty(document, 'visibilityState', {
        get: function() {
            return 'visible';
        }
    });

    // Override the hidden property to always return false
    Object.defineProperty(document, 'hidden', {
        get: function() {
            return false;
        }
    });

    // Dispatch the visibilitychange event to ensure the page reacts as if it's visible
    document.dispatchEvent(new Event('visibilitychange'));
})();
