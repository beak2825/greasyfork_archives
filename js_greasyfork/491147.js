// ==UserScript==
// @name         Prevent Accidental Tab Closure with "ctrl + w" [recommended for sploop.io and moomoo.io]
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Prevents accidental tab closure when you press ctrl+w
// @author       Lore
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491147/Prevent%20Accidental%20Tab%20Closure%20with%20%22ctrl%20%2B%20w%22%20%5Brecommended%20for%20sploopio%20and%20moomooio%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/491147/Prevent%20Accidental%20Tab%20Closure%20with%20%22ctrl%20%2B%20w%22%20%5Brecommended%20for%20sploopio%20and%20moomooio%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('beforeunload', function(e) {
        e.preventDefault();
        e.returnValue = '';
    });

    window.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'w') {
            e.preventDefault();
            var confirmed = confirm('Are you sure you would like to close this tab or was this a accident?');
            if (confirmed) {
                window.removeEventListener('beforeunload');
                window.close();
            }
        }
    });
})();