// ==UserScript==
// @name         SteamGifts - Extended Navigation
// @version      0.3
// @description  Extended Navigation: Fixes last page + find last comment.
// @author       Royalgamer06
// @include      *steamgifts.com/discussion/*
// @grant        none
// @namespace    Royalgamer06
// @downloadURL https://update.greasyfork.org/scripts/20144/SteamGifts%20-%20Extended%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/20144/SteamGifts%20-%20Extended%20Navigation.meta.js
// ==/UserScript==

var always = false;

$(document).ready(function() {
    if ($('.pagination__navigation').find('.fa-angle-double-right').length === 0) {
        var href = location.href.split('/discussion/')[1].split('/');
        href = href[0] + '/' + href[1].split('#')[0];
        href = '/discussion/' + href + '/search?page=4096';
        $('.pagination__navigation').append('<a href="' + href + '"><span>Last</span> <i class="fa fa-angle-double-right"></i></a>');
    }
    if (always) {
        navLatestComment();
    } else {
        $('.page__heading__breadcrumbs:last').append('<pre>  -  </pre><a style="cursor: pointer;" id="lastcomment">Find most recent comment on page</a>');
        $('#lastcomment').on('click', function() {
            navLatestComment();
            $(this).hide();
            $(this).parent().find('pre').hide();
        });
    }
});

function navLatestComment() {
    var comment_elements = document.querySelectorAll('div[data-comment-id]');
    var comment_latest = 0;
    for (var i = 0; i < comment_elements.length; i++) {
        if (comment_elements[i].getAttribute('data-comment-id') > comment_latest) {
            comment_latest = comment_elements[i].getAttribute('data-comment-id');
        }
    }
    var comment_id = document.querySelector('div[data-comment-id="' + comment_latest + '"] .comment__summary').getAttribute('id');
    if (location.href.indexOf('#') == -1) {
        location.href = location.href + '#' + comment_id;
    } else {
        location.href = location.href.split('#')[0] + '#' + comment_id;
    }
}