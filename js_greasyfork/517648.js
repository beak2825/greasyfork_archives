// ==UserScript==
// @name         Disable Trello KEY
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Отключить горячие клавиши в Trello
// @author       Борис
// @match        https://trello.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517648/Disable%20Trello%20KEY.user.js
// @updateURL https://update.greasyfork.org/scripts/517648/Disable%20Trello%20KEY.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const events = ['keydown', 'keypress', 'keyup'];

    events.forEach(eventType => {
        window.addEventListener(eventType, function(e) {

            e.stopImmediatePropagation();
            e.preventDefault();
        }, true);
    });
})();
