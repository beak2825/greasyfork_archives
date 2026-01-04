// ==UserScript==
// @name         SPOJ remove profile incomplete warning
// @namespace    https://www.luogu.com.cn/user/576074
// @version      2025-04-13
// @description  BUG:It always shows me the warning that my profile is only 50% complete.
// @author       123asdf123
// @license      WTFPL
// @match        *://*.spoj.com/*
// @icon         https://spoj.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532694/SPOJ%20remove%20profile%20incomplete%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/532694/SPOJ%20remove%20profile%20incomplete%20warning.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var p=document.querySelector(".dropdown.profile").previousElementSibling;
    if(p.style="margin-right: 0px;")
        p.parentElement.removeChild(p);
})();