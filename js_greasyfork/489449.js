// ==UserScript==
// @name         YouTube Light Blue Background
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes the background color of YouTube to a light shade of blue.
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/489449/YouTube%20Light%20Blue%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/489449/YouTube%20Light%20Blue%20Background.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject custom CSS styles
    GM_addStyle(`
        #page-manager {
            background-color: #dcecff !important;
        }
    `);
})();
