// ==UserScript==
// @name        Tumblr only videos
// @descriotion Will hide anything that is not a video on Tumblr Dashboard
// @namespace   maoistscripter
// @version     1.1
// @grant       none
// @include https://www.tumblr.com/dashboard
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min.js
// @description Will hide anything that is not a video on Tumblr Dashboard
// @downloadURL https://update.greasyfork.org/scripts/14301/Tumblr%20only%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/14301/Tumblr%20only%20videos.meta.js
// ==/UserScript==
$(function()
{

  var hide = ['conversation', 'photo', 'photoset', 'regular'];

  $('#posts').bind("DOMSubtreeModified", function()
  {
    $( "#posts li div" ).each(function( index, element ) {

      if (jQuery.inArray($(this).attr('data-type'), hide) !== -1)
        {
          $(this).remove();
        }

    });
  });
// Tumblr.AutoPaginator.start();
});