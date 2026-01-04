// ==UserScript==
// @name         Open Dev Tools on Ctrl+Shift+I
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Opens developer options when Ctrl+Shift+I is pressed on fishingfrenzy.co
// @author       ErrorNullTag
// @match        https://fishingfrenzy.co/*
// @grant        none
// @license      GPULv3
// @downloadURL https://update.greasyfork.org/scripts/514398/Open%20Dev%20Tools%20on%20Ctrl%2BShift%2BI.user.js
// @updateURL https://update.greasyfork.org/scripts/514398/Open%20Dev%20Tools%20on%20Ctrl%2BShift%2BI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.code === 'KeyI') {
            const devToolsEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'F12',
                code: 'F12',
                which: 123
            });
            document.dispatchEvent(devToolsEvent);
        }
    });
})();
