// ==UserScript==
// @name         Restore YouTube Right-Click Menu
// @version      1.0
// @description  Removes YouTube's custom right-click menu and restores the default browser menu.
// @match        *://www.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/527947/Restore%20YouTube%20Right-Click%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/527947/Restore%20YouTube%20Right-Click%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('contextmenu', (event) => {
        event.stopPropagation(); // Prevent YouTube from overriding the menu
    }, true);
})();
