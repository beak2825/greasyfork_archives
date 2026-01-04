// ==UserScript==
// @name         Remove Watermark for Shuiyuan SJTU
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  remove hidden watermark element from the page
// @author       benderbd42
// @match        https://shuiyuan.sjtu.edu.cn/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492435/Remove%20Watermark%20for%20Shuiyuan%20SJTU.user.js
// @updateURL https://update.greasyfork.org/scripts/492435/Remove%20Watermark%20for%20Shuiyuan%20SJTU.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('[style*="opacity: 0.00499"] { display: none !important; }');

})();
