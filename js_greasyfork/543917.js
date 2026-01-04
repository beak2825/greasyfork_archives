// ==UserScript==
// @name         Torn - Stable Hunting Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Sets a consistent height for the hunting results list, preventing the 'Hunt Again' button from shifting.
// @author       defend [2683949]
// @match        *://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/543917/Torn%20-%20Stable%20Hunting%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/543917/Torn%20-%20Stable%20Hunting%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .hunt-result-wrap ul.kill-list {
            min-height: 140px;
            max-height: 140px;
            overflow-y: auto;
            margin-bottom: 10px;
            padding-right: 5px;
        }

        .hunt-result-wrap .hunt-btn-area br {
            display: none;
        }
    `);
})();