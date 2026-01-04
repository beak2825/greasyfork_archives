// ==UserScript==
// @name         NZZ - Neue Züricher Zeitung - Paywall Unblock 
// @name:en      NZZ - Neue Züricher Zeitung - Paywall Unblock 
// @namespace    http://nzz.ch/nzz
// @version      2025-08-03
// @description     Paywall entfernt, Cookies für NZZ blockiert. CSS Anpassungen: Schwarzer Text, entfernt Opacity.
// @description:en  Removes the NZZ paywall by blocking cookies and adjusting specific CSS styles.
// @author       Thomas R.
// @license      MIT
// @match        *://www.nzz.ch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nzz.ch
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522932/NZZ%20-%20Neue%20Z%C3%BCricher%20Zeitung%20-%20Paywall%20Unblock.user.js
// @updateURL https://update.greasyfork.org/scripts/522932/NZZ%20-%20Neue%20Z%C3%BCricher%20Zeitung%20-%20Paywall%20Unblock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle (`
    .nzzinteraction {
            opacity: 1 !important;
    }`);

    function logCookie(action, cookie) {
        const parts = cookie.split(';').map(part => part.trim());
        const [nameValue, ...attributes] = parts;
        const [name, value] = nameValue.split('=');

        console.table({
            Action: action,
            Name: name,
            Value: value,
            Attributes: attributes.join('; ')
        });
    }

     // overwrite document.cookie API
    Object.defineProperty(document, 'cookie', {
        get: function(name) {
            console.log("NZZ get Cookie", name);
            return '';
        },
        set: function(cookie) {
            logCookie("NZZ Blocked", cookie);
            throw new Error();
        },
        configurable: false
    });

})();