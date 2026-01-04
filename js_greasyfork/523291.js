// ==UserScript==
// @name         Reset Usercentrics
// @namespace    http://tampermonkey.net/
// @version      2024-07-24
// @description  Hiermit können die Usercentrics Einstellungen ganz einfach gelöscht werden.
// @author       Vanakh Chea
// @match        http*://*/*
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/523291/Reset%20Usercentrics.user.js
// @updateURL https://update.greasyfork.org/scripts/523291/Reset%20Usercentrics.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(UC_UI){
        UC_UI.clearStorage()
        location.reload()
    }
})();