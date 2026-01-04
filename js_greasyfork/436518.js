// ==UserScript==
// @name         No Search For
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       waki285
// @match        *://*.google.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/436518/No%20Search%20For.user.js
// @updateURL https://update.greasyfork.org/scripts/436518/No%20Search%20For.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        if ($("div[id^=eob_]")) $("div[id^=eob_]").parent().parent().css("height", "");
        if ($("div[id^=eob_]")) $("div[id^=eob_]").remove();
    }, 1);
})();