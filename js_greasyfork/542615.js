// ==UserScript==
// @name         Disable skill test anti-cheat
// @namespace    mailto:eat-the-rich.userscript.crusader452@simplelogin.fr
// @version      1.3
// @description  Отключает защиту от копирования и переключения вкладок на любых сайтах
// @author       eat-the-rich
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542615/Disable%20skill%20test%20anti-cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/542615/Disable%20skill%20test%20anti-cheat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const blockedEvents = ['copy', 'visibilitychange', 'webkitvisibilitychange', 'blur'];

    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (!blockedEvents.includes(type.toLowerCase())) {
            return originalAddEventListener.call(this, type, listener, options);
        }
    };

    for (const eventName of blockedEvents) {
        window.addEventListener(eventName, function(event) {
            event.stopImmediatePropagation();
        }, true);
    }
})();
