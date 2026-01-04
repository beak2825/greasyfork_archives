// ==UserScript==
// @name         RoughRiderRegistry - Owned Count
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds up all your owned items when you go to the last page of your list.
// @author       WillBassett
// @match        https://www.roughridersregistry.com/owned/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roughridersregistry.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/js/all.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444688/RoughRiderRegistry%20-%20Owned%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/444688/RoughRiderRegistry%20-%20Owned%20Count.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

$(document).ready(function() {
    var itemsPerPage = 20;
    var nextBtn = $('a.next.page-numbers');
    var lastPage = nextBtn.length == 0;

    if (lastPage) {
        var lastPageCount = $('div.posts_list div.post_content_wrapper').length;
        var numPages = parseInt($('nav.pagination span.page-numbers.current').text());
        var totalCount = ((numPages - 1) * itemsPerPage) + lastPageCount;

        $('div.container h1').append(` (Total: ${totalCount})`);
    }
    else {
        $('div.container h1').append(' (Total: <a id="calcTotalOwned" href="#none"><i class="fa-solid fa-calculator" aria-hidden="true"></i></a>)');

        $("#calcTotalOwned").click(function(e) {
            e.preventDefault();

            var lastPageBtn = $('nav.pagination a.page-numbers').eq(-2)[0];
            lastPageBtn.click();
        });
    }

});