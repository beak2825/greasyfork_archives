// ==UserScript==
// @name         XdebugHelper
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在指定网站设置调试Cookie
// @author       EddyLee88
// @match        *://westar.dev.com/*
// @run-at       document-start
// @grant        none
// @icon         https://xdebug.org/images/favicon.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513965/XdebugHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/513965/XdebugHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.cookie = "XDEBUG_SESSION=PHPSTORM; path=/;";
})();