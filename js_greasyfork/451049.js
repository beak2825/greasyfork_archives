// ==UserScript==
// @name         XCSHelper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide input password tips.
// @author       You
// @match        https://www.xincanshu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xincanshu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451049/XCSHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/451049/XCSHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jq(".cack_jt_box div:nth-child(5)").html('<style>.cack_jt_box {display: block;}</style>');
})();