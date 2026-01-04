// ==UserScript==
// @name        Better xHamster.com
// @namespace   Violentmonkey Scripts
// @match       https://xhamster.com/videos/*
// @grant       none
// @version     1.3
// @author      -
// @description Make video player larger, scroll to video, remove hover shadows - 12/22/2021, 02:06:49 AM
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/428258/Better%20xHamstercom.user.js
// @updateURL https://update.greasyfork.org/scripts/428258/Better%20xHamstercom.meta.js
// ==/UserScript==

this.$ = jQuery.noConflict(true)

// make large player take up full height of window
$("<style type='text/css'> div.xplayer-large-mode{ height: 750px !important } </style>").appendTo("head")


$("div.width-wrap.with-player-container").first().ready(function () {

  // get rid of the idiotic hover shadows
  $("div.xplayer-background-top").remove()
  $("div.xplayer-background-bottom").remove()

  // make player large by default
  player = $("div#player-container");

  if(! player.hasClass("xplayer-large-mode")) {
    $("div.large-mode").trigger("click")
  }
  if($("html").scrollTop() == 0) {
    player[0].scrollIntoView({
      behavior: 'instant',
      block: 'end',
      inline: 'center'
    });
  }
})
