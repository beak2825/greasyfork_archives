// ==UserScript==
// @name         simplify bbs.szhome.com
// @namespace    https://greasyfork.org
// @url          https://greasyfork.org/zh-CN/scripts/432398
// @version      0.3
// @description  simplify bbs.szhome
// @author       chaosky
// @match        http://bbs.szhome.com/*
// @grant        GM_log
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/432398/simplify%20bbsszhomecom.user.js
// @updateURL https://update.greasyfork.org/scripts/432398/simplify%20bbsszhomecom.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    GM_addStyle(" \
.fixedbox { position: absolute !important; } \
.float-bar { position: absolute !important; display: none !important; } \
");
})();