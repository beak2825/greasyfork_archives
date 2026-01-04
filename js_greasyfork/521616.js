// ==UserScript==
// @name         DMM Auto Cookie Setter (Both Domains)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically set a specific cookie when visiting dmm.com and dmm.co.jp for bypass geo blocking.
// @author       Parin
// @match        *://*.dmm.com/*
// @match        *://*.dmm.co.jp/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521616/DMM%20Auto%20Cookie%20Setter%20%28Both%20Domains%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521616/DMM%20Auto%20Cookie%20Setter%20%28Both%20Domains%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.cookie = "ckcy_remedied_check=ec_mrnhbtk; expires=Sat, 24 May 2025 02:51:01 UTC; domain=.dmm.com; path=/";
    document.cookie = "ckcy_remedied_check=ec_mrnhbtk; expires=Sat, 24 May 2025 02:51:01 UTC; domain=.dmm.co.jp; path=/";
})();
