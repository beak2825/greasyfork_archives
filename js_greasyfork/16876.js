// ==UserScript==
// @name         click the golden cookie
// @namespace    http://tampermonkey.net/
// @version      1
// @description  great cookie empire
// @author       gofi
// @match        http://orteil.dashnet.org/cookieclicker/
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/16876/click%20the%20golden%20cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/16876/click%20the%20golden%20cookie.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var clickgoldencookies = setInterval(function() {
    $('#goldenCookie').trigger('click');
}, 1);