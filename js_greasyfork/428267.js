// ==UserScript==
// @name        Better PornHub.com
// @namespace   Violentmonkey Scripts
// @match       https://www.pornhub.com/view_video.php
// @grant       none
// @version     1.0
// @author      -
// @description Make video player large by default and scroll to video but only if you're on top while loading the page - 6/21/2021, 10:43:58 AM
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/428267/Better%20PornHubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/428267/Better%20PornHubcom.meta.js
// ==/UserScript==

// PornHub has jQuery under $j, but it only shows up after a while.
this.$ = jQuery.noConflict(true)

$("div#player").ready(function () {
  player_div = $("div#player")
  
  if(! player_div.hasClass("wide")) {
    player_key = Object.keys(MGP.players)[0]
    
    // enlarge player to wide version
    MGP.players[player_key].settings().events.expandPlayer()
    
    // scroll to player, but only if we're at the top of the page when we load it
    if($("html").scrollTop() == 0) {
      $("html").animate({
        scrollTop: player_div.offset().top - 5
      }, 10);
    }
  }
})