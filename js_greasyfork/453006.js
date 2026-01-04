// ==UserScript==
// @name         Left Aligned Torn
// @namespace    None
// @license      MIT
// @version      1.1
// @description  Left Aligns Torn
// @author       Krazytrain [1962748]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/453006/Left%20Aligned%20Torn.user.js
// @updateURL https://update.greasyfork.org/scripts/453006/Left%20Aligned%20Torn.meta.js
// ==/UserScript==

GM_addStyle(`.d .content .container, .d .header-wrapper-top .container, .content-wrapper   {
    margin-left: 20px !important;
    justify-content: flex-start !important;
}`);