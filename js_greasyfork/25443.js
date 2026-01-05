// ==UserScript==
// @name        WWT PM From Shout
// @namespace   Keka_Umans
// @description Adds PM link to posts in shoutbox
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include     *worldwidetorrents.eu/shoutbox.php
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25443/WWT%20PM%20From%20Shout.user.js
// @updateURL https://update.greasyfork.org/scripts/25443/WWT%20PM%20From%20Shout.meta.js
// ==/UserScript==

$(window).load(function(){
  // Needed for glyphicon icon
  $('head').append('<link rel="stylesheet" type="text/css" href="https://worldwidetorrents.eu/css/glyphicons.css" />');
  
  $('tr').each(function(i){
    // Get user ID
    var id = $(this).find('td:eq(1) a').data('userid');
    // Use for glyphicon Icon
    $(this).find('td:eq(1) a b').before('<a href="/mailbox.php?compose&amp;id='+id+'" target="blank"><span style="color:#C0C0C0;" title="PM User" class="glyphicon glyphicon-envelope"></span></a>');
    // Use for large PM Icon
    //$(this).find('td:eq(1) a b').before('<a href="/mailbox.php?compose&amp;id='+id+'" target="blank"><img src="/images/button_pm.gif" border="0" /></a>');
  });
  
});