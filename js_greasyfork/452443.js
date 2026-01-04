// ==UserScript==
// @name         Disable confirmation dialog to leave page
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Get rid of annoying "This page asks to leave"!
// @author       Kirill Skliarov
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/452443/Disable%20confirmation%20dialog%20to%20leave%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/452443/Disable%20confirmation%20dialog%20to%20leave%20page.meta.js
// ==/UserScript==

(function() {
    const nativeAddEventListener = EventTarget.prototype.addEventListener;
    function patchedAddEventListener(...args) {
        if (args[0] !== 'beforeunload') {
            nativeAddEventListener.apply(this, args);
        }
    }
    EventTarget.prototype.addEventListener = patchedAddEventListener;
    Object.defineProperty(window, 'onbeforeunload', {
        configurable: false,
        get() { return null; },
        set() { return; },
    });
})();