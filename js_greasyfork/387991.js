// ==UserScript==
// @name        KBB Anti-Adblock Killer
// @namespace   jeremy@timenotlinear.com
// @description Forces KBB to respect your right not to view content you don't want.
// @include     https://www.kbb.com/*
// @include     https://kbb.com/*
// @version     1.0
// @grant       none
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/387991/KBB%20Anti-Adblock%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/387991/KBB%20Anti-Adblock%20Killer.meta.js
// ==/UserScript==

jQuery(document).ready(function()
{
  kill_kill_kill();
});

function kill_kill_kill()
{
  if (jQuery('html').hasClass('whitelist-overlay-on'))
  {
    jQuery('html').removeClass('whitelist-overlay-on');
    jQuery('#WhitelistOverlayModalBackground').remove();
  }
  else
  {
    setTimeout(kill_kill_kill,500);
  }  
}