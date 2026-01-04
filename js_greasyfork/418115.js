// ==UserScript==
// @name         Torn: Hide ticker text
// @description  Hides Torn's ticker text
// @version      0.1
// @author       Xeno2
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @namespace https://greasyfork.org/users/674903
// @downloadURL https://update.greasyfork.org/scripts/418115/Torn%3A%20Hide%20ticker%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/418115/Torn%3A%20Hide%20ticker%20text.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
        .header-wrapper-bottom .container {
            Display: none;
        }
    `);
})();