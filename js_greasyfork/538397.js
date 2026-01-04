// ==UserScript==
// @name         FMP Fast Login
// @name:en      FMP Fast Login
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  跳过Discord加载
// @description:en Skip Discord loading
// @match        https://footballmanagerproject.com/*
// @match        https://www.footballmanagerproject.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538397/FMP%20Fast%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/538397/FMP%20Fast%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
    .splash-background{
        visibility: hidden;
    }
    `);
})();