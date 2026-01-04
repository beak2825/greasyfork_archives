// ==UserScript==
// @name         mikanani修复css
// @namespace    http://tampermonkey.net/
// @version      2024-10-06
// @description  修复css
// @author       shadows
// @match        https://mikanani.me/
// @match        https://mikanani.me/Home/MyBangumi
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mikanani.me
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520697/mikanani%E4%BF%AE%E5%A4%8Dcss.user.js
// @updateURL https://update.greasyfork.org/scripts/520697/mikanani%E4%BF%AE%E5%A4%8Dcss.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle("#an-list #an-list-res {overflow: visible;}");
})();