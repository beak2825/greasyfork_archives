// ==UserScript==
// @name         Steam Community - Comments Remover
// @namespace    Royalgamer06
// @version      0.1
// @description  More options to delete comments
// @author       Royalgamer06
// @match        *://steamcommunity.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26473/Steam%20Community%20-%20Comments%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/26473/Steam%20Community%20-%20Comments%20Remover.meta.js
// ==/UserScript==

var interval = 1000;

if (jQuery("[href*='CCommentThread.DeleteComment']").length > 0) {
    jQuery("[href*='CCommentThread.DeleteComment']").after('<a class="actionlink"> | </a><a class="actionlink delAllComments">Delete Everything</a><a class="actionlink"> | </a><a class="actionlink delAuthorComments">Delete Everything From This Author</a>');
    jQuery(".delAllComments").click(function() {
        if (confirm("Are you sure you want to delete all comments?")) {
            var delComments = setInterval(function() {
                if (jQuery("[href*='CCommentThread.DeleteComment']").length > 0) {
                    eval(jQuery("[href*='CCommentThread.DeleteComment']").attr("href"));
                } else {
                    clearInterval(delComments);
                }
            }, interval);
        }
    });
    jQuery(".delAuthorComments").click(function() {
        if (confirm("Are you sure you want to delete all comments from this author?")) {
            var author = jQuery(this).parent().find(".commentthread_author_link").attr("data-miniprofile");
            var delComments = setInterval(function() {
                if (jQuery(".commentthread_comment_author [data-miniprofile=" + author + "]").length > 0) {
                    jQuery(".commentthread_comment_author [data-miniprofile=" + author + "]").each(function() {
                        eval(jQuery(this).parent().find("[href*='CCommentThread.DeleteComment']").attr("href"));
                    });
                } else if (jQuery(".commentthread_pagelinks .active").first().next().length > 0) {
                    jQuery(".commentthread_pagelinks .active").first().next().click();
                } else {
                    clearInterval(delComments);
                }
            }, interval);
        }
    });
}