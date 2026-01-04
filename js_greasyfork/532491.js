// ==UserScript==
// @name         Disable CMD+S
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prevents websites from intercepting the CMD+S (Save) shortcut on Mac
// @author       Ben Whaley
// @grant        none
// @license      MIT
// @match        https://www.example.com
// @downloadURL https://update.greasyfork.org/scripts/532491/Disable%20CMD%2BS.user.js
// @updateURL https://update.greasyfork.org/scripts/532491/Disable%20CMD%2BS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handleKeyDown(event) {
        // Check for CMD+S (metaKey is the Command key on Mac)
        if (event.metaKey && event.key === 's') {
            event.stopPropagation();
            console.log('Tampermonkey script intercepted CMD+S');
        }
    }

    document.addEventListener('keydown', handleKeyDown, true);

    function createCustomEventHandler() {
        const originalAddEventListener = EventTarget.prototype.addEventListener;

        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (type === 'keydown') {
                const wrappedListener = function(event) {
                    if (event.metaKey && event.key === 's') {
                        return;
                    }
                    return listener.apply(this, arguments);
                };

                return originalAddEventListener.call(this, type, wrappedListener, options);
            }

            return originalAddEventListener.call(this, type, listener, options);
        };
    }

    createCustomEventHandler();

    console.log('Tampermonkey script loaded: CMD+S shortcut interceptor');
})();