// ==UserScript==
// @name         better UI for miniblox.io
// @namespace    http://tampermonkey.net/
// @description  change miniblox.io UI
// @author       Vicky_arut
// @match        https://miniblox.io/*
// @grant        GM_addStyle
// @license      Redistribution prohibited
// @version 0.0.1.20240921150619
// @downloadURL https://update.greasyfork.org/scripts/509546/better%20UI%20for%20minibloxio.user.js
// @updateURL https://update.greasyfork.org/scripts/509546/better%20UI%20for%20minibloxio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .chakra-button {
            transition: background-color 0.3s, transform 0.2s;
            border-radius: 8px;
        }

        .chakra-button:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
    `);

    window.addEventListener('load', () => {
         }
    );
})();