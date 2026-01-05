// ==UserScript==
// @name           Reddit - auto pause NeverEndingReddit every X pages
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
// @author         jesuis-parapluie
// @version        0.0.1
// @description    Pauses NER every X pages for you to reload Reddit at the new position and unpauses it after the reload. Helps stopping the ressources-guzzling which slows down the browser.
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant          none
// @include        /^https?:\/\/(.+\.)?reddit\.com\/?.*$/
// @exclude        /^https?:\/\/(.+\.)?reddit\.com\/.+\/comments\/.*$/
// @downloadURL https://update.greasyfork.org/scripts/14326/Reddit%20-%20auto%20pause%20NeverEndingReddit%20every%20X%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/14326/Reddit%20-%20auto%20pause%20NeverEndingReddit%20every%20X%20pages.meta.js
// ==/UserScript==


(function ($) {
    'use strict';
    /*jslint browser: true */
    /*global jQuery */

    $.noConflict();

    var options = {
            pauseAtPage: 5,
            restartNER: true
        },

        restarter = function () {
            if ($('div#NREPause').size()) {
                $('div#NREPause').click();
            } else {
                setTimeout(restarter, 300);
            }
        };


    if (options.restartNER && $('div#NREPause').hasClass('paused') && document.location.search.search("after=") > 0) { restarter(); }

    $(document).bind('DOMNodeInserted', function (e) {
        if (e.target.tagName === 'DIV' && e.target.hasAttribute('class') && e.target.getAttribute('class') === 'NERPageMarker') {
            if (!$('div#NREPause').hasClass('paused') && parseInt($(e.target).text().split(' ').pop(), 10) >= options.pauseAtPage) {
                $('div#NREPause').click();
            }
        }
    });

}(jQuery));
