// ==UserScript==
// @name         DDG Focus Fix
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  Keep focusing on the search bar when window focus changes
// @author       mechtifs
// @match        https://duckduckgo.com/*
// @icon         https://duckduckgo.com/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/486675/DDG%20Focus%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/486675/DDG%20Focus%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type == 'blur') {
            const newListener = function(event) {
                if (document.hasFocus()) {
                    return listener.apply(this, arguments);
                }
            };
            return originalAddEventListener.call(this, type, newListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
})();
