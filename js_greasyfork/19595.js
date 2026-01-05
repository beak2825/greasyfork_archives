// ==UserScript==
// @name         Pages Browsing for Wall
// @namespace    pxgamer
// @version      0.1
// @description  Adds navigation to the user wall.
// @author       pxgamer
// @include      *kat.cr/user/*/
// @include      *kat.cr/user/*/?page=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19595/Pages%20Browsing%20for%20Wall.user.js
// @updateURL https://update.greasyfork.org/scripts/19595/Pages%20Browsing%20for%20Wall.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQueryVar(variable)
    {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    var user        = location.href.split("/")[4];
    var currentPage = getQueryVar("page");
    var nextPage    = 2;
    var prevPage    = 0;

    if (currentPage > 1) {
        nextPage = parseInt(currentPage, 10) + 1;
        prevPage = currentPage - 1;
    }
    if (currentPage <= 1) {
        nextPage = parseInt(currentPage, 10) + 1;
        prevPage = currentPage;
    }

    $('h2:contains("The Wall")').after('<div class="wallNav"><a class="turnoverButton siteButton bigButton kaTurnoverButton pageSpecButton" title="Go to a specific page"><i class="ka ka-zoom"></i></a> <a href="?page='+prevPage.toString()+'" class="siteButton bigButton turnoverButton"><</a> <a href="?page='+nextPage.toString()+'" class="siteButton bigButton turnoverButton">></a></div><br/>');
    $('a.pageSpecButton').on('click', function() {
        var page = prompt("Please enter a page number", "");
        if (page !== null) {
            location.href = 'https://kat.cr/user/'+user+'/?page=' + page;
        }
    });
})();
