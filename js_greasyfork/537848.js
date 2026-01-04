// ==UserScript==
// @name         Tandro.de - Close Confirmation Prompt
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Warns you before accidentally closing or reloading tandro.de
// @author       Asriel
// @license      GPL-3.0
// @icon         https://tandro.de/img/logo_small_4.png
// @match        *://tandro.de/*
// @match        *://www.tandro.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537848/Tandrode%20-%20Close%20Confirmation%20Prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/537848/Tandrode%20-%20Close%20Confirmation%20Prompt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('beforeunload', function(e) {
        const confirmationMessage = 'Bist du sicher, dass du die Seite verlassen möchtest? Deine Änderungen könnten verloren gehen.';
        (e || window.event).returnValue = confirmationMessage; // For older browsers
        return confirmationMessage;
    });
})();
