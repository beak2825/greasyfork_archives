// ==UserScript==
// @name         Ubuntu font
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Warning: Assumes Ubuntu font is installed. See https://greasyfork.org/en/scripts/29542-ubuntu-font/code for a fix.
// @author       You
// @match        */*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/29540/Ubuntu%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/29540/Ubuntu%20font.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle("body { font-family: Ubuntu }");
})();