// ==UserScript==
// @name         Stop chapter skip shortcuts
// @description  Stop YouTube shortcuts from interfering with your Desktop environment workspace shortcuts
// @version      1.0
// @author       JustBenDev
// @match        *://www.youtube.com/*
// @run-at       document-start
// @license      N/A
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/1499639
// @downloadURL https://update.greasyfork.org/scripts/544047/Stop%20chapter%20skip%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/544047/Stop%20chapter%20skip%20shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'keydown' || type === 'keyup') {
            const wrappedListener = function(e) {
                if (e.ctrlKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
                    console.log('[Stop chapter skip shortcuts.js] Blocked chapter skip');
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return false;
                }
                return listener.call(this, e);
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

})();