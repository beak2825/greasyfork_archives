// ==UserScript==
// @name         Torrminatorr - Forum Endless Scroll
// @icon         http://torrminatorr.com/favicon.ico
// @namespace    Royalgamer06
// @author       Royalgamer06
// @version      1.0.0
// @description  Endless scroll for the forums @ Torrminatorr (request for friend)
// @include      *://www.forum.torrminatorr.com/viewforum.php*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/29236/Torrminatorr%20-%20Forum%20Endless%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/29236/Torrminatorr%20-%20Forum%20Endless%20Scroll.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var ajaxDone = true;
var nextPage = $(".next a").attr("href");
$(document).scroll(function() {
    if (window.innerHeight + window.scrollY + 1500 >= document.body.scrollHeight && nextPage && ajaxDone) {
        ajaxDone = false;
        $.get(nextPage, function(data) {
            ajaxDone = true;
            nextPage = $(".next a", data).attr("href");
            $(".forumbg:not(.announcement) .topiclist.topics li.row", data).each(function() {
                $(".forumbg:not(.announcement) .topiclist.topics").append(this);
            });
        });
    }
});