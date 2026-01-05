// ==UserScript==
// @name         Remove MyBroadband partner content
// @description  Removes all "partner content" from mybroadband
// @namespace    http://tampermonkey.net/
// @version      0.5
// @author       Spooky User
// @match        *://mybroadband.co.za/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/26622/Remove%20MyBroadband%20partner%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/26622/Remove%20MyBroadband%20partner%20content.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.feed_article').each( function() {
        if($(this).find('.presented-title').length){
            $(this).remove();
        }
    });
})();