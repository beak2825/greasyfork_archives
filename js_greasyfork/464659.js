// ==UserScript==
// @name         Yen Press Auto Show More
// @version      1.2
// @description  automatically shows more as you scroll
// @author       Hato4PL
// @match        https://yenpress.com/*
// @exclude      https://yenpress.com/calendar*
// @icon         https://yenpress.com/images/favicon.png
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @namespace    https://greasyfork.org/users/1060113
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/464659/Yen%20Press%20Auto%20Show%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/464659/Yen%20Press%20Auto%20Show%20More.meta.js
// ==/UserScript==

/* globals jQuery, $ */

(function() {
    'use strict';

    var $window = $(window);

    $window.on('scroll', showMore);

    var x = new MutationObserver(function () {
        $window.off('scroll', showMore);
        $window.on('scroll', showMore);
        if(document.querySelector('.cat-list-rows')) x.observe(document.querySelector('.cat-list-rows'), { childList: true });
    });

    if(document.querySelector('.show-more-container')) x.observe(document.querySelector('.show-more-container'), { childList: true });
    if(document.querySelector('.results-holder')) x.observe(document.querySelector('.results-holder'), { childList: true });

    function showMore() {
        var e = $('.show-more, .search-page-show-more.active #search-more');
        if (e.length) {
            var hT = e.offset().top,
                hH = e.outerHeight(),
                wH = $(window).height(),
                wS = $(this).scrollTop();

            if (wS > (hT+hH-wH)) {
                $window.off('scroll', showMore);
                e[0].click();
            }
        }
    }
})();