// ==UserScript==
// @name         Thingiverse no suck
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Thingiverse Enable Paginate on Settings -> Go trough paging with A or D / Left Arrow or Right Arrow / Search results per page upset to 24 modify it for your screen resolution !
// @author       inZane
// @match        https://www.thingiverse.com/explore/*
// @match        https://www.thingiverse.com/search*
// @match        https://www.thingiverse.com/newest*
// @match        https://www.thingiverse.com/customizable*
// @match        https://www.thingiverse.com/thing:*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393595/Thingiverse%20no%20suck.user.js
// @updateURL https://update.greasyfork.org/scripts/393595/Thingiverse%20no%20suck.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onkeydown = checkKey;
    var per_page = 24;
    $('.thing, .make, .thingcollection-card').attr("style", "margin-right:0!important;");
    $('.bottom_content').attr("style", "width:90%!important;");
    $('.width-2.share').attr("style", "width:80%;!important;");
    var currentLink = window.location.href;
    if(currentLink != undefined) {
        if(currentLink.indexOf('search') >= 0) {
            if(currentLink.indexOf('per_page') < 0) {
                window.location.replace(currentLink + "&per_page=" + per_page);
            }
        }
    }
    $('.pagination-link').each(function(){
        if($(this).attr("href") != undefined) {
            if($(this).attr('href').indexOf('per_page') < 0) {
                if($(this).attr('href').indexOf('?') < 0) {
                    $(this).attr('href', $(this).attr('href') + '?per_page=' + per_page);
                } else {
                    $(this).attr('href', $(this).attr('href') + '&per_page=' + per_page);
                }
            }
        }
    });
    function checkKey(e) {
        e = e || window.event;
        if(!$('.search-form input').is(":focus")) {
            if (e.keyCode == '37' || e.keyCode == '65') {
                var prevlink = $('.pagination-link:nth-child(2)').attr("href");
                if(prevlink != undefined) {
                    window.location = prevlink;
                }
            }
            else if (e.keyCode == '39' || e.keyCode == '68') {
                // right arrow

                var nextlink = $('.pagination-link:nth-last-child(2)').attr('href');
                if(nextlink != undefined) {
                    window.location = nextlink;
                }
            } else if (e.keyCode == '70') {
                if(currentLink.indexOf('thing:') >= 0) {
                    $('.icon-like').trigger("click");
                }
            }
        }
    }
})();