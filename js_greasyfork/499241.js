// ==UserScript==
// @name         Redirect YouTube to Invidious
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  redirect YouTube pages to Invidious for privacy-friendly viewing
// @author       vorm--
// @match        *://www.youtube.com/*
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499241/Redirect%20YouTube%20to%20Invidious.user.js
// @updateURL https://update.greasyfork.org/scripts/499241/Redirect%20YouTube%20to%20Invidious.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const menu_command_id_2 = GM_registerMenuCommand("Open in Invidious", function(event) {
        var currentUrl = window.location.href;
        var invidiousUrl = currentUrl.replace('www.youtube.com', 'redirect.invidious.io');
        window.location.href = invidiousUrl;
    });

})();
