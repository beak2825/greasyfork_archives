// ==UserScript==
// @name         click the deers
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  great beta cookie empire
// @author       gofi
// @match        http://orteil.dashnet.org/cookieclicker/beta/
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/16879/click%20the%20deers.user.js
// @updateURL https://update.greasyfork.org/scripts/16879/click%20the%20deers.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var clickbigcookie = setInterval(function() {
    $('#seasonPopup').trigger('click');
}, 1);