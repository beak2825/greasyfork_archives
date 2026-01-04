// ==UserScript==
// @name         Charts link to all-time
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Makes chart button go straight to all-time releases
// @author       jermrellum
// @match        https://rateyourmusic.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415560/Charts%20link%20to%20all-time.user.js
// @updateURL https://update.greasyfork.org/scripts/415560/Charts%20link%20to%20all-time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByClassName("header_charts header_item")[0].href += "top/album/all-time/";
})();