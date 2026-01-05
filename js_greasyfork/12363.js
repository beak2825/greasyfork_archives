// ==UserScript==
// @name        WaPo Escalation
// @namespace   ffmike
// @description Hide the Washington Post Ad Blocker Blocker
// @somain      www.washingtonpost.com
// @include     http://www.washingtonpost.com/*
// @include     https://www.washingtonpost.com/*
// @version     2
// @grant       GM_addStyle
// @license        CC0 1.0; https://creativecommons.org/publicdomain/zero/1.0/
// @downloadURL https://update.greasyfork.org/scripts/12363/WaPo%20Escalation.user.js
// @updateURL https://update.greasyfork.org/scripts/12363/WaPo%20Escalation.meta.js
// ==/UserScript==

var style = "#pb-root.collapsed { overflow: visible !important;}"

GM_addStyle(style);

var style = ".jqmOverlay { display: none !important; }"

GM_addStyle(style);

var style = "#drawbridge-signup-overlay { display: none !important; }"

GM_addStyle(style);

var style = ".drawbridge-article-collapsed { display: none !important;}"

GM_addStyle(style);