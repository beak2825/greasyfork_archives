// ==UserScript==
// @name         Keep TSR Tab Focused
// @namespace    https://greasyfork.org/en/users/1200402-yawdev
// @version      1.0
// @description  Trick TheSimsResource into thinking the tab is always in focus | Tab Focus Timer Bypass
// @author       Yaw-Dev
// @match        *://www.thesimsresource.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525459/Keep%20TSR%20Tab%20Focused.user.js
// @updateURL https://update.greasyfork.org/scripts/525459/Keep%20TSR%20Tab%20Focused.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.hasFocus = function() {
        return true;
    };

    Object.defineProperty(document, 'visibilityState', {
        get: function() {
            return 'visible';
        },
        configurable: true
    });

    Object.defineProperty(document, 'hidden', {
        get: function() {
            return false;
        },
        configurable: true
    });

    const fakeFocusEvent = new Event('focus', { bubbles: true });
    window.dispatchEvent(fakeFocusEvent);

    const fakeVisibilityEvent = new Event('visibilitychange', { bubbles: true });
    document.dispatchEvent(fakeVisibilityEvent);
})();