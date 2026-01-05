// ==UserScript==
// @name         Youtube - Hide Volume Control
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides Youtube videos' volume control.
// @author       Gökhan Sarı
// @match        https://www.youtube.com/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/20798/Youtube%20-%20Hide%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/20798/Youtube%20-%20Hide%20Volume%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        $("button.ytp-mute-button").hide();
    });
})();