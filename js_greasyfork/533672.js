// ==UserScript==
// @name         Disable hh.ru skill testing protection
// @name:en         Disable hh.ru skill testing protection
// @name:ru         Обход защиты тестов на подтверждение навыков на hh.ru
// @namespace    mailto:eat-the-rich.userscript.crusader452@simplelogin.fr
// @version      1.2
// @description:ru  Выключает обнаружение копирования и переключение вкладок на hh.ru, позволяя использовать любые ресурсы во время прохождения тестов на подтверждение навыков.
// @description:en  Disables copy and tab switching detection on hh.ru, allowing you to use any resources while taking skill validation tests.
// @author       eat-the-rich
// @license      MIT
// @include      https://*.hh.ru/*
// @include      https://hh.ru/*
// @run-at       document-start
// @grant        none
// @description Выключает обнаружение копирования и переключение вкладок на hh.ru, позволяя использовать любые ресурсы во время прохождения тестов на подтверждение навыков.
// @downloadURL https://update.greasyfork.org/scripts/533672/Disable%20hhru%20skill%20testing%20protection.user.js
// @updateURL https://update.greasyfork.org/scripts/533672/Disable%20hhru%20skill%20testing%20protection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store the original addEventListener function
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const blockedEvents = ['copy', 'visibilitychange', 'webkitvisibilitychange', 'blur'];

    // Override the addEventListener function
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        // Check if the event type is in our blocked list
        if (!blockedEvents.includes(type.toLowerCase())) {
            return originalAddEventListener.call(this, type, listener, options);
        }
    };

    // Sourced from: https://stackoverflow.com/questions/47660653/chrome-extension-how-to-disable-page-visibility-api
    // for some reason event listener override is not sufficient
    for (const eventName of blockedEvents) {
        window.addEventListener(eventName, function(event) {
            event.stopImmediatePropagation();
        }, true);
    }
})();