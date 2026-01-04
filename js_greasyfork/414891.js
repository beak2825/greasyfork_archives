// ==UserScript==
// @name         realt.by-ratings
// @namespace    realt
// @version      0.1.0
// @description  taking over the realt comments by ratings!
// @author       You
// @match        https://realt.by/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414891/realtby-ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/414891/realtby-ratings.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ALT_TEXT = 'Похоже на очередной высер от неадеквата: ';
    var CERTAIN_ALT_TEXT = 'Определенно очередной высер от неадеквата: ';
    var ratings = $('div.reputa');
    $.each(ratings, function (i, e){
        var likes = $(e).find('.rep-like').html();
        var dislikes = $(e).find('.rep-dislike').html();
        var likesInt = 0;
        var dislikesInt = 0;
        likesInt = likes.endsWith("K") ? parseInt(likes.slice(0, -1) * 1000) :
          parseInt(likes);
        dislikesInt = dislikes.endsWith("K") ? parseInt(dislikes.slice(0, -1) * 1000) :
          parseInt(dislikes);
        var comment_div = $(e).parents('.comment-user').find('.comment-user-right');
        var comment_div_top = comment_div.find('.comment-user-right-top');
        if (likesInt < dislikesInt) {
            comment_div.find('.comment-links').html('');
            comment_div.attr('data-show', false);
            var rank = parseInt(comment_div_top.find('span[id^="rate"]').html());
            var alt_text = (rank<-1 ? CERTAIN_ALT_TEXT : ALT_TEXT) + comment_div_top.find('a[id]').html();
            comment_div.attr('data-alt-text', alt_text);
            comment_div_top.text(alt_text);
            var comment_div_text = comment_div.find('.comment-text');
            comment_div.attr('data-old-text', comment_div_text.html());
            comment_div_text.html('');
            comment_div_top.on('dblclick', function(){
                var $parent = $(this).parent();
                var $comment = $(this).siblings('.comment-text');
                if ($parent.attr('data-show')==='false') {
                    $comment.html($(this).parent().attr('data-old-text'));
                    $parent.attr('data-show', true);
                }else {
                    $comment.html('');
                    $parent.attr('data-show', false);
                }
            });
        }
    });
})();