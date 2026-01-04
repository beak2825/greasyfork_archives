// ==UserScript==
// @name         Always focus 
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Always keeps page in a focused/active state 
// @author       Yui-Koi
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/528490/Always%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/528490/Always%20focus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalDispatchEvent = EventTarget.prototype.dispatchEvent;
    
    Object.defineProperty(Document.prototype, 'visibilityState', {
        get: function() {
            return 'visible';
        }
    });
    
    Object.defineProperty(Document.prototype, 'hidden', {
        get: function() {
            return false;
        }
    });
    
    const blockedEvents = ['visibilitychange', 'blur', 'focusout'];
    
   EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (!blockedEvents.includes(type)) {
            originalAddEventListener.call(this, type, listener, options);
        }
    };
    
    EventTarget.prototype.dispatchEvent = function(event) {
        if (!blockedEvents.includes(event.type)) {
            return originalDispatchEvent.call(this, event);
        }
        return true;
    };
    
    console.log('Always focus script is running!');
})();