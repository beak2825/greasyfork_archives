// ==UserScript==
// @name         Farm Top 1 for uplify.link
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Auto refresh for uplify.link every minute
// @author       Role_Play
// @match        https://uplify.link/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482997/Farm%20Top%201%20for%20uplifylink.user.js
// @updateURL https://update.greasyfork.org/scripts/482997/Farm%20Top%201%20for%20uplifylink.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function reloadPage() {
        location.reload(true);
    }

    setInterval(reloadPage, 6000);
})();