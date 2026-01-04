// ==UserScript==
// @name         Janitor AI - UI Bring back glass theme.
// @namespace    https://greasyfork.org/users/1495024
// @version      1.7
// @description  Adds a subtle blur, customizes transparency, adds matching borders, and hides the placeholder text.
// @author       Me?
// @match        https://janitorai.com/chats/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/542704/Janitor%20AI%20-%20UI%20Bring%20back%20glass%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/542704/Janitor%20AI%20-%20UI%20Bring%20back%20glass%20theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        div[class*="_headerContainer_"] {
            backdrop-filter: blur(2px) !important;
            background-color: transparent !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
        }

        textarea[class*="_chatTextarea_"] {
            backdrop-filter: blur(2px) !important;
            background-color: transparent !important;
        }

        div[class*="_chatInputInner_"] {
            border-color: rgba(255, 255, 255, 0.2) !important;
        }

        textarea[class*="_chatTextarea_"]::placeholder {
            color: transparent !important;
        }
    `);
})();