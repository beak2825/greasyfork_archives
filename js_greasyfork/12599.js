// ==UserScript==
// @name Lobsters guest comment folding
// @namespace https://www.github.com/aborgna/userscripts
// @author aborgna
// @description Enable comment folding for guests in lobsters' comment threads.
// @version 1.1
// @icon https://lobste.rs/favicon.ico
// @include https://lobste.rs/s/*
// @match https://lobste.rs/s/*
// @grant none
// @require https://code.jquery.com/jquery-1.11.3.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/12599/Lobsters%20guest%20comment%20folding.user.js
// @updateURL https://update.greasyfork.org/scripts/12599/Lobsters%20guest%20comment%20folding.meta.js
// ==/UserScript==

/*
 * Most of this code is just copied from lobsters' application.js.erb
 * https://github.com/jcs/lobsters
 */

$(".comment > .details > .byline").prepend('<a class="comment_folder"></a>');

$(document).on("click", "a.comment_folder", function() {
    $(this).addClass("comment_unfolder").removeClass("comment_folder");
    var comment = $(this).closest(".comment");
    comment.addClass("collapsed");
    comment.nextAll(".comments").each(function() {
        $(this).addClass("collapsed");
    });
});

$(document).on("click", "a.comment_unfolder", function() {
    $(this).addClass("comment_folder").removeClass("comment_unfolder");
    var comment = $(this).closest(".comment");
    comment.removeClass("collapsed");
    comment.nextAll(".comments").each(function() {
        $(this).removeClass("collapsed");
    });
});

