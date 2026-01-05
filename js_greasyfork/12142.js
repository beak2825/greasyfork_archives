// ==UserScript==
// @name        GitHub Your Fork
// @icon        https://github.com/eXistenZNL/userscripts/raw/master/icons/github.png
// @namespace   eXistenZNL
// @description Shows a 'your fork is at' link below the title
// @include     https://*github.com/*
// @version     1.0.5
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/12142/GitHub%20Your%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/12142/GitHub%20Your%20Fork.meta.js
// ==/UserScript==

(function($) {
    if (0 === $('h1.entry-title').length) {
        console.warn('No header found with class "entry-title"');
        return;
    }
    if (0 !== $('h1.fork-flag').length) {
        console.warn('Already have a fork');
        return;
    }
    var username = String.trim($('a.name').attr('href')).substring(1);
    var repository = $('h1 strong a').html();
    var url = '/' + username + '/' + repository;
    $.get(
        url,
        function () {
            $('.entry-title').append('<span class="fork-flag"><span class="text">your fork is at <a href="' + url + '">' + username + '/' + repository + '</a></span></span>');
        }
    ).fail(function() {
       $('.entry-title').append('<span class="fork-flag"><span class="text">You dont have a fork (yet!)</span></span>');
    });
})(jQuery);

