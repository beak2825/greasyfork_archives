// ==UserScript==
// @name         Vev Keyboard Remap
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remap CMD+Z to CMD+Y in Vev
// @author       You
// @match        https://www.vev.design/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471899/Vev%20Keyboard%20Remap.user.js
// @updateURL https://update.greasyfork.org/scripts/471899/Vev%20Keyboard%20Remap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            var newYEvent = new KeyboardEvent('keydown', {
                key: 'y',
                code: 'KeyY',
                keyCode: 89,
                ctrlKey: event.ctrlKey,
                metaKey: event.metaKey,
                altKey: event.altKey,
                shiftKey: event.shiftKey,
                isComposing: event.isComposing,
            });
            document.dispatchEvent(newYEvent);
        }
    });
})();