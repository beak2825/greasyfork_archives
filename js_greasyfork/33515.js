// ==UserScript==
// @name        Tumblr only note count larger than 20000
// @descriotion Will hide anything whose notes num is not larger than 20000 on Tumblr Dashboard
// @namespace   hippotoes
// @version     1.0
// @grant       none
// @include https://www.tumblr.com/dashboard
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min.js
// @description Will hide anything whose notes num is not larger than 20000 on Tumblr Dashboard
// @downloadURL https://update.greasyfork.org/scripts/33515/Tumblr%20only%20note%20count%20larger%20than%2020000.user.js
// @updateURL https://update.greasyfork.org/scripts/33515/Tumblr%20only%20note%20count%20larger%20than%2020000.meta.js
// ==/UserScript==
$(function()
{
  $('#posts').bind("DOMSubtreeModified", function()
  {
    $( "#posts li div" ).each(function( index, element ) {
      var notes_count = $(this).find("span").filter(".note_link_current").attr('data-count');
      if (notes_count < 20000)
      {
        $(this).remove();
      }
    });
  });
// Tumblr.AutoPaginator.start();
});