// ==UserScript==
// @name         URL to Direct
// @namespace    pxgamer
// @version      0.4
// @description  URL to Direct for Kickass Torrents
// @author       pxgamer
// @include      *kat.cr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20167/URL%20to%20Direct.user.js
// @updateURL https://update.greasyfork.org/scripts/20167/URL%20to%20Direct.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    $('a[rel="nofollow noopener noreferrer"][href^="//ext.kat.cr"]').each(function() {
        var eurl = $(this).attr('href').split('/')[5];
        var text = $(this).text();
        var url = window.atob(eurl);
        $(this).replaceWith('<a href="'+url+'" target="_blank">'+text+'</a>');
    });
})();
