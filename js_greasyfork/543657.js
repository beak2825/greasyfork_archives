// ==UserScript==
// @name         RGSU redirector
// @name:ru      РГСУ перенаправлятель
// @namespace    http://tampermonkey.net/
// @version      2025-07-26
// @description  Redirect from stupid 404 page to login page
// @description:ru  Редирект с тупой страницы 404 на страницу логина
// @author       Anon1423
// @match        https://cdo.rgsu.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rgsu.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543657/RGSU%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/543657/RGSU%20redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';
        if(document.querySelectorAll('.image-container')[0] != null){
            window.location.href = "https://cdo.rgsu.net/login"
        }
    // Your code here...
})();