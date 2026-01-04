// ==UserScript==
// @name         Codeship-Stupid-Header-Remove
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://blog.codeship.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/32456/Codeship-Stupid-Header-Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/32456/Codeship-Stupid-Header-Remove.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('main').css('padding-top', 100);
    $('.flexMenu').hide();
    $('.titleImg').css("top", -310);
})();