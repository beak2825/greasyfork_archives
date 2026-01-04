// ==UserScript==
// @license MIT
// @name         PDS Timer Skipper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skips the PDS timer that prevents you from continuing throughout the course
// @author       Me
// @match        https://www.teachsafe.com/prosper-driving-school/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=teachsafe.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/485250/PDS%20Timer%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/485250/PDS%20Timer%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#CountdownForSection").html("0");
    $('.btn-next').removeAttr('disabled');
})();