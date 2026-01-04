// ==UserScript==
// @name         Gixen timer bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bypass the timer on www.gixen.com after login
// @author       Steve Chambers
// @match        http://www.gixen.com/*
// @match        https://www.gixen.com/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/372531/Gixen%20timer%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/372531/Gixen%20timer%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#gbutton").prop("disabled", false);
    $("#gbutton").click();
})();