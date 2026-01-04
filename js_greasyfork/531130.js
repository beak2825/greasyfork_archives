// ==UserScript==
// @name        RPS Hide Deals
// @namespace   Violentmonkey Scripts
// @match       https://www.rockpapershotgun.com/latest*
// @grant       GM_addStyle
// @version     1.0
// @author      Bellatrix
// @license     MIT
// @description 2025-03-28, 8:35:10 a.m.
// @downloadURL https://update.greasyfork.org/scripts/531130/RPS%20Hide%20Deals.user.js
// @updateURL https://update.greasyfork.org/scripts/531130/RPS%20Hide%20Deals.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('.articles li div[data-article-type="deals"] {display:none;}');
})();