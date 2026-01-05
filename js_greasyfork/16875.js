// ==UserScript==
// @name         click the cookie
// @namespace    http://tampermonkey.net/
// @version      1
// @description  great cookie empire
// @author       gofi
// @match        http://orteil.dashnet.org/cookieclicker/
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/16875/click%20the%20cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/16875/click%20the%20cookie.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var maekcookies = setInterval(function() {
    $('#bigCookie').trigger('click');
}, 1);