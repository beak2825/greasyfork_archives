// ==UserScript==
// @name        Deskthority: Mark forums read
// @author      Bruno Sabença
// @version     1
// @description Mark all forums read from the unread posts page
// @namespace   https://deskthority.net
// @include     https://deskthority.net/search.php?search_id=unreadposts
// @include     https://deskthority.net/?markread
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/22240/Deskthority%3A%20Mark%20forums%20read.user.js
// @updateURL https://update.greasyfork.org/scripts/22240/Deskthority%3A%20Mark%20forums%20read.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function() {
    if (window.location.href == "https://deskthority.net/search.php?search_id=unreadposts") {
        var markread_link_html = "<span class=\"markread\">Mark forums read</span> • ";

        $(".rightside.pagination").each(function() {
            $(this).prepend(markread_link_html);
        });

        $(".markread").each(function() {
            $(this).click(function() {
                window.location.href = "https://deskthority.net?markread";
            });
        });
    }

    if (window.location.href == "https://deskthority.net/?markread") {
        var markread_link_href = $("a:contains('Mark forums read')").attr("href");

        window.location.replace(markread_link_href);
    }
});

GM_addStyle("                   \
.markread {                     \
cursor: pointer;                \
cursor: hand;                   \
}                               \
.markread:hover {               \
text-decoration: underline;     \
}                               \
");
