// ==UserScript==
// @name         360-error-page
// @description  Kill the 360's error page ad.
// @author       zelricx
// @namespace    https://greasyfork.org/users/212360
// @version      0.1
// @date         2018.09.20
// @include      https://browser.360.cn/se/errorpage/*
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @icon         https://www.360.cn/favicon.ico
// @encoding     utf-8
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/372169/360-error-page.user.js
// @updateURL https://update.greasyfork.org/scripts/372169/360-error-page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("body").empty();
    window.stop();
})();