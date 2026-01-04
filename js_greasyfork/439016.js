// ==UserScript==
// @name         Bypass Welt paywall
// @namespace    none
// @version      1.1
// @description  bypass the paywall in www.welt.de (only shows blurred content)
// @author       Me
// @match        https://www.welt.de/*
// @grant        GM_addStyle
// @license      GPL v3
// @downloadURL https://update.greasyfork.org/scripts/439016/Bypass%20Welt%20paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/439016/Bypass%20Welt%20paywall.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
* { filter: none !important }
.c-obfuscated-article__blur { opacity: 1 !important }
.c-obfuscated-article__preview-gradient { background: none !important }
`);
})();