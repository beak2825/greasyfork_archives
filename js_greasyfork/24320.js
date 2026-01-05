// ==UserScript==
// @name         Fur Affinity Auto-Scroll
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Auto-scrolls to the content of a view.
// @author       ItsNix (https://www.furaffinity.net/user/itsnix/)
// @match        https://www.furaffinity.net/view/*
// @grant        none
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/24320/Fur%20Affinity%20Auto-Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/24320/Fur%20Affinity%20Auto-Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $( document ).ready(function() {
        $('#ddmenu').css('position', 'absolute');
        $(window).scrollTop($('.submission-area').offset().top);
    });
})();