// ==UserScript==
// @name         Anti Focus Detection
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevent focus/visibility detection
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532782/Anti%20Focus%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/532782/Anti%20Focus%20Detection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Object.defineProperty(document, 'hidden', {
        get: () => false
    });

    Object.defineProperty(document, 'visibilityState', {
        get: () => 'visible'
    });

    const eventsToBlock = ['visibilitychange', 'blur', 'focus', 'focusin', 'focusout'];

    eventsToBlock.forEach(eventType => {
        window.addEventListener(eventType, e => e.stopImmediatePropagation(), true);
    });

    const originalAddEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function(eventType, listener, options) {
        if (eventsToBlock.includes(eventType)) {
            return;
        }
        originalAddEventListener.call(this, eventType, listener, options);
    };

})();
