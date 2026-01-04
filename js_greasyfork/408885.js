// ==UserScript==
// @name         SH Permalinks for Comments
// @namespace    ultrabenosaurus.ScribbleHub
// @version      0.4
// @description  Convert the timestamps on ScribbleHub chapter comments into permalinks to make sharing comments easier.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://www.scribblehub.com/read/*/chapter/*
// @icon         https://www.google.com/s2/favicons?domain=scribblehub.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408885/SH%20Permalinks%20for%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/408885/SH%20Permalinks%20for%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var SHcomments = document.querySelectorAll('div#comments div.comment_list_main li[id^="comment-"][class^="cmt_li_chp"]');
    if( SHcomments.length > 0 ) {
        UBaddCommentPermalinks(SHcomments);
    }
    SHcomments = null;

    var SHcommentPagination = document.querySelectorAll('div[class*="comments-pagination"] ul#pagination-mesh li:not(.active) a.page-link');
    if( SHcommentPagination.length > 0 ) {
        UBaddPaginationEvents(SHcommentPagination);
    }
    SHcommentPagination = null;
})();

function UBaddCommentPermalinks(SHcomments) {
    var permalinkTemplate = "<a class='com_date' title='%timestamp%' href='%perma%'>%when%</a>";

    for (var comm in SHcomments) {
        if (SHcomments.hasOwnProperty(comm)) {
            var commID = SHcomments[comm].id.split('-')[1];
            var commDate = SHcomments[comm].querySelectorAll('div.comment-author.chapter span.com_date')[0];

            var commTimestamp = commDate.title;
            var commWhen = commDate.textContent;
            var commLink = permalinkTemplate.replace("%perma%", "#comment-"+commID).replace("%timestamp%", commTimestamp).replace("%when%", commWhen);

            commDate.insertAdjacentHTML("beforebegin", commLink);
            commDate.remove();

            commID = commDate = commTimestamp = commWhen = commLink = null;
        }
    }
    SHcomments = permalinkTemplate = comm = null;
}

function UBaddPaginationEvents(SHcommentPagination) {
    for (var pag in SHcommentPagination) {
        if (SHcommentPagination.hasOwnProperty(pag)) {
            SHcommentPagination[pag].addEventListener("click", UBpaginationEvent, false);
        }
    }
    SHcommentPagination = pag = null;
}

function UBpaginationEvent() {
    setTimeout(function(){
        UBaddCommentPermalinks( document.querySelectorAll('div#comments div.comment_list_main li[id^="comment-"][class^="cmt_li_chp"]') );
        UBaddPaginationEvents( document.querySelectorAll('div[class*="comments-pagination"] ul#pagination-mesh li:not(.active) a.page-link') );
    }, 1000);
}