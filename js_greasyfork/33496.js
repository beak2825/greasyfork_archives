// ==UserScript==
// @name SSC Ucinanie długich postów
// @description Dodaje opcje skrolowania w przypadku długich postów
// @author el nino
// @namespace el nino
// @include *://www.skyscrapercity.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @version 1.1.0
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/33496/SSC%20Ucinanie%20d%C5%82ugich%20post%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/33496/SSC%20Ucinanie%20d%C5%82ugich%20post%C3%B3w.meta.js
// ==/UserScript==

var style="text-align: center; padding: 3px; color: #fff; background: #5C7099; cursor:pointer";

//Find long post
$('[id^="post_message_"]').each(function( index ) {
    if ($(this).text().length > 10000) {
        var postId = $(this).attr('id').replace('post_message_', '');
        shortenPost(postId);
    }
});

//Click to show header 
$('.read-more').click(function() {
    var postId = $(this).data('postid');
    showPost(postId);
});

//Shorten post function
function shortenPost(postId){
    $('#post_message_' + postId).css({'height': 250, 'overflow-y': 'hidden', 'border': '1px solid #5C7099'});
    $('#post_message_' + postId).prepend('<div class="read-more" id="show_post_'+ postId +'" data-postid="'+ postId +'" style="'+ style +'">Pokaż cały post...</div>');
}

function showPost(postId){
    $('#post_message_' + postId).css({'height': 'auto', 'overflow-y': 'show', 'border': '0px'});
    $('#show_post_' + postId).remove();
}

