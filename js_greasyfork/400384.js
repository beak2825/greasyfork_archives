// ==UserScript==
// @name         YWOT Menu Toggle
// @namespace    https://greasyfork.org/en/users/501887-spitfirex86
// @version      1.1
// @description  Automatically toggles "Show coordinates" and "Disable momentum".
// @author       ~spitfire
// @match        http*://www.yourworldoftext.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400384/YWOT%20Menu%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/400384/YWOT%20Menu%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    $(window).load(function() {
        $('#nav').find('input').attr('checked', true).click().attr('checked', true);
    });
})();