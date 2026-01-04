// ==UserScript==
// @name         Free4talk keep chat
// @version      1.0
// @description  Makes the chat in the rooms not delete after refreshing
// @author       Azeez
// @match        https://www.free4talk.com/room/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1095860
// @downloadURL https://update.greasyfork.org/scripts/482331/Free4talk%20keep%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/482331/Free4talk%20keep%20chat.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Check if the keep-chat parameter is already present
    if (!window.location.search.includes('keep-chat=true')) {
        // Add the keep-chat parameter to the current URL
        var separator = window.location.href.includes('?') ? '&' : '?';
        var updatedURL = window.location.href + separator + 'keep-chat=true';
        // Update the URL
        window.history.replaceState({}, document.title, updatedURL);
    }
})();