// ==UserScript==
// @name         Minimal Live
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Windzard
// @match        https://www.douyu.com/*
// @match        https://www.huya.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/400187/Minimal%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/400187/Minimal%20Live.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Douyu
    $(".layout-Bottom").remove();
    $(".layout-Player-guessgame").remove();
    $(".layout-Aside").remove();
    $("#js-room-activity").remove();
    //Huya
    $(".mod-sidebar").remove();
    $("#match-cms-content").remove();
    $(".diy-toutu").remove();
})();