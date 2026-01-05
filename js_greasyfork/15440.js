// ==UserScript==
// @name Disable WeChat Confirmation upon Leaving
// @namespace http://tampermonkey.net/
// @version      0.11
// @description  disable the annoying "Confirm Navigation" notification when trying to refresh or close WeChat web version.
// @author       Mikkkee
// @match        https://web.wechat.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15440/Disable%20WeChat%20Confirmation%20upon%20Leaving.user.js
// @updateURL https://update.greasyfork.org/scripts/15440/Disable%20WeChat%20Confirmation%20upon%20Leaving.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.onbeforeunload = null;
    window.onunload = null;  
})();
