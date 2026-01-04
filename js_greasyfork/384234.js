// ==UserScript==
// @name         Kicktraq links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Links thumbnails directly to Kickstarter and adds [K] links to KS to the Top Ten list
// @author       Lex
// @match        http://www.kicktraq.com/*
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384234/Kicktraq%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/384234/Kicktraq%20links.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    $(".project-image a, .avatar a").each(function(){
        let suf = this.getAttribute('href');
        this.setAttribute('href', "https://www.kickstarter.com" + suf);
    });

    $(".listentry-mini.link a").each(function(){
        let suf = this.getAttribute('href');
        $("<a> [K]</a>").attr('href', "https://www.kickstarter.com" + suf).insertAfter(this);
    });
})(window.jQuery);
