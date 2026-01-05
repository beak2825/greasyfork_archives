// ==UserScript==
// @name         Sidebar [Horizontal]
// @namespace    pxgamer
// @version      0.1
// @description  Puts sidebar elements next to each other in a 2 column layout.
// @author       pxgamer
// @include      *kat.cr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20442/Sidebar%20%5BHorizontal%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/20442/Sidebar%20%5BHorizontal%5D.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    var params = {
        watchedThreads: '',
        latestForum: '',
        latestNews: '',
        blogroll: '',
        goodies: '',
        friendsLinks: ''
    };

    function init() {
        $('#sidebar').html('<div class="sbLeftCol inlineSbBlock"></div>');
        $('#sidebar').append('<div class="sbRightCol inlineSbBlock"></div>');
        $('.sbLeftCol').append(params.watchedThreads);
        $('.sbLeftCol').append(params.blogroll);
        $('.sbLeftCol').append(params.goodies);
        $('.sbLeftCol').append(params.friendsLinks);
        $('.sbRightCol').append(params.latestForum);
        $('.sbRightCol').append(params.latestNews);
        $('#sidebar').css('display', 'inline-flex');
        $('.inlineSbBlock').css('margin-right', '10px');
    }

    $('.sliderbox').each(function() {
        if ($(this).find('#watchedThreads').length > 0) {
            params.watchedThreads = $(this);
        }
        if ($(this).find('#latestForum').length > 0) {
            params.latestForum = $(this);
        }
        if ($(this).find('#latestNews').length > 0) {
            params.latestNews = $(this);
        }
        if ($(this).find('#blogroll').length > 0) {
            params.blogroll = $(this);
        }
        if ($(this).find('#goodies').length > 0) {
            params.goodies = $(this);
        }
        if ($(this).find('#friendsLinks').length > 0) {
            params.friendsLinks = $(this);
        }
    });

    init();

})();
