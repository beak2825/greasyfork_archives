// ==UserScript==
// @name         CtrlDiscord
// @namespace    discord
// @version      1.1
// @description  Use Ctrl + Enter to send message.
// @author       blindingdark
// @match        https://discord.com/*
// @downloadURL https://update.greasyfork.org/scripts/426891/CtrlDiscord.user.js
// @updateURL https://update.greasyfork.org/scripts/426891/CtrlDiscord.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';
    function keyboardEnterEvent(event) {
        var keyboardEnterEvent = new KeyboardEvent(event, {
            code: 'Enter',
            key: 'Enter',
            bubbles: true,
            cancelable: true
        });

        Object.defineProperties(keyboardEnterEvent, {
            keyCode: { get: () => 13 },
            which: { get: () => 13 }
        });

        return keyboardEnterEvent;
    }

    function handleCtrlEnterEvent(event) {
        if (!event.ctrlKey) return;
        if (event.keyCode !== 13) return;

        let textarea;
        let enterEvent;

        if (textarea = document.querySelector('span[data-slate-string="true"]')) {
            enterEvent = 'keydown';
        } else if (textarea = document.querySelector('textarea')) {
            enterEvent = 'keypress';
        } else {
            return;
        }

        textarea.dispatchEvent(keyboardEnterEvent(enterEvent));
    }

    window.addEventListener('keydown', handleCtrlEnterEvent);
})();
