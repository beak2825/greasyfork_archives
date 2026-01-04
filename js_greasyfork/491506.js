// ==UserScript==
// @name         HoU Recolor
// @namespace    http://tampermonkey.net/
// @version      2024-04-03
// @description  Einfaches recolor von HoU, ihr könnt hinter background-color eure eigenen Hex Farbcodes setzen :)
// @author       Ophiris
// @license      MIT
// @match        https://house-of-usenet.com/*
// @icon         https://house-of-usenet.com/styles/custom/favicon.png
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/491506/HoU%20Recolor.user.js
// @updateURL https://update.greasyfork.org/scripts/491506/HoU%20Recolor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Menüleiste
    $('.p-nav-inner').attr('style','background-color: #2f4858');
    // Untere Menüleiste
    $('.p-sectionLinks-inner').attr('style','background-color: #3c4f71');
    // Sidebar
    $('.p-body-sidebar .block-container').attr('style','background-color: #3c4f71');
    // Footer
    $('.pre-footer--content, .pre-footer .block-container').attr('style','background-color: #3c4f71');
    // Filter in Threads
    $('.block-filterBar').attr('style','background-color: #cc4b4b');
    // Seitenzahl Aktiv
    $('.pageNav-page.pageNav-page--current').attr('style','background-color: #cc4b4b');
    // Neuer Thread
    $('.button.button--cta, a.button.button--cta').attr('style','background-color: #cc4b4b');
    // Thread Zitat
    $('.bbCodeBlock-title').attr('style','background-color: #cc4b4b')
})();