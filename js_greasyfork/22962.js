// ==UserScript==
// @name        Facebook Nag Killer
// @namespace   http://goo.gl/m79y0X
// @description Removes the nag screen that shows when user session is inactive.
// @include     https://www.facebook.com/*
// @version     1.1
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/22962/Facebook%20Nag%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/22962/Facebook%20Nag%20Killer.meta.js
// ==/UserScript==

function stop_nag() 
{
  if ($('#pagelet_growth_expanding_cta').length)
  {
    $('#pagelet_growth_expanding_cta').empty();
  }
	setTimeout(stop_nag,500); 
}
stop_nag();