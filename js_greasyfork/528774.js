// ==UserScript==
// @name         DMM Kurofune
// @namespace    https://greasyfork.org/zh-TW/users/1338298-jeff-huang
// @version      2025-03-08_17h36m
// @description  Log in to DMM
// @author       hangjeff
// @match        https://*.dmm.co.jp/*
// @match        https://*.dmm.com/*
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528774/DMM%20Kurofune.user.js
// @updateURL https://update.greasyfork.org/scripts/528774/DMM%20Kurofune.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const Target_Name = 'ckcy_remedied_check';

    let expires = new Date();

    expires.setFullYear(expires.getFullYear() + 100); // 100 years later
    console.log("Expires: " + expires.toUTCString());

    document.cookie = Target_Name + "=" + "ec_mrnhbtk" + "; expires=" + expires.toUTCString() + "; path=/; domain=.dmm.com; secure;";
    document.cookie = Target_Name + "=" + "ec_mrnhbtk" + "; expires=" + expires.toUTCString() + "; path=/; domain=.dmm.co.jp; secure;";

})();