// ==UserScript==
// @name         Empeopled direct comment link
// @namespace    empeopled
// @version      0.2
// @description  Adds a direct link to each comment
// @author       Ludiko
// @match        http*://*.empeopled.com/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12950/Empeopled%20direct%20comment%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/12950/Empeopled%20direct%20comment%20link.meta.js
// ==/UserScript==

var commentNumber = 0;

function checkComments() {
    var comment = $('[id^=comment_actions_]');
    if(comment.length == commentNumber) {
        setTimeout(checkComments, 400);
    } else {
        comment.each(function () {
          var id = $(this).attr('id').split('_')[2];
          var contextual = $(this).find('.contextual');
          if (contextual.find('#comment_link_' + id).length == 0 ) {
            contextual.append('<a href="https://empeopled.com/c/' + id + '" title="permalink" id="comment_link_' + id + '"><i class="fa fa-link"></i></a>');
          }
        })
        setTimeout(checkComments, 5000);
    }
}

$(window).scroll(function () {
   if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
        commentNumber = $('[id^=comment_actions_]').length;
        checkComments();
   }
});

checkComments();