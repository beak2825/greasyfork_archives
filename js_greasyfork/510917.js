// ==UserScript==
// @name         class.com user agent switcher
// @namespace    https://greasyfork.org/en/users/1375019-elisoreal
// @version      1.0
// @description  changes user agent for class.com and its meetings
// @author       elisoreal
// @match        *://*.class.com/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510917/classcom%20user%20agent%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/510917/classcom%20user%20agent%20switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // overwrite the default user agent
    var newUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36";

    // redefine navigator.userAgent to return the custom user agent
    Object.defineProperty(navigator, 'userAgent', {
        get: function() { return newUserAgent; }
    });
})();
