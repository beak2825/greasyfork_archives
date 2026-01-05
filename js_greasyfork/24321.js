// ==UserScript==
// @name         Fur Affinity Gallery Keys
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Allows viewers to move between pictures in a gallery using the arrow keys.
// @author       ItsNix (https://www.furaffinity.net/user/itsnix/)
// @match        https://www.furaffinity.net/view/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/24321/Fur%20Affinity%20Gallery%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/24321/Fur%20Affinity%20Gallery%20Keys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // New code for finding the next and previous element in the gallery.
    var lnks = $.map($($('img')).parents('a[href*="view"]'), function(a) { return $(a).attr('href'); });
    var curr = $(location).attr('href').split('/')[4];
    var pids = $.map(lnks, function(h) { return h.split('/')[2]; });
    var prev = pids.filter(function(i) { return i < curr; }).pop();
    var next = pids.filter(function(i) { return i > curr; })[0];
    if (next !== undefined) { next = '/view/' + next + '/'; }
    if (prev !== undefined) { prev = '/view/' + prev + '/'; }

    // No longer works:
    //var prev = $('.prev').attr('href');
    //var next = $('.next').attr('href');

    var nextpage = $('.parsed_nav_links').children('a:contains("NEXT")').attr('href');
    var prevpage = $('.parsed_nav_links').children('a:contains("PREV")').attr('href');
    if (nextpage === undefined) { nextpage = $('a.auto_link[href*="view"]:contains("Next"), a.auto_link[href*="view"]:contains("NEXT")').attr('href'); }
    if (prevpage === undefined) { prevpage = $('a.auto_link[href*="view"]:contains("Prev"), a.auto_link[href*="view"]:contains("PREV")').attr('href'); }
    if (nextpage === undefined) { nextpage = $('a.auto_link[href*="view"]:contains("Final"), a.auto_link[href*="view"]:contains("FINAL")').attr('href'); }
    if (prevpage === undefined) { prevpage = $('a.auto_link[href*="view"]:contains("First"), a.auto_link[href*="view"]:contains("FIRST")').attr('href'); }
    if (nextpage === undefined) { nextpage = $('a.auto_link[href*="view"]:contains("Last"), a.auto_link[href*="view"]:contains("LAST")').attr('href'); }
    $(window).keydown(function(e){
        if (e.target.id != 'JSMessage') {
            if (e.keyCode == 37 && next !== undefined) { window.location.href = next; return false; }
            if (e.keyCode == 39 && prev !== undefined) { window.location.href = prev; return false; }
            if (e.keyCode == 188 && prevpage !== undefined) { window.location.href = prevpage; return false; }
            if (e.keyCode == 190 && nextpage !== undefined) { window.location.href = nextpage; return false; }
        }
    });
})();