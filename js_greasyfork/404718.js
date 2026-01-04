// ==UserScript==
// @name        YouTube Restore "Show More" Button
// @description Restores the "Show More" button on old youtube
// @namespace   http://www.youtube.com/
// @include     http://www.youtube.com/*
// @include     https://www.youtube.com/*
// @version     1.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/404718/YouTube%20Restore%20%22Show%20More%22%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/404718/YouTube%20Restore%20%22Show%20More%22%20Button.meta.js
// ==/UserScript==


//I'm not a coder/scripter. I'm sure there's a much better way of doing this, but I couldn't figure it out.

function restoreDetailButtons() {
  var showMoreButton = ('<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-expander yt-uix-expander-head yt-uix-expander-collapsed-body yt-uix-gen204" type="button" onclick=";return false;" data-gen204="feature=watch-show-more-metadata"><span class="yt-uix-button-content">Show more</span></button>');
  var showLessButton = ('<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-expander yt-uix-expander-head yt-uix-expander-body" type="button" onclick=";return false;"><span class="yt-uix-button-content">Show less</span></button>');

  if(document.getElementsByClassName('yt-uix-button-expander').length == 0)
    document.getElementById("action-panel-details").insertAdjacentHTML('beforeend', showMoreButton + showLessButton);
}

//This will restore the buttons if you load into a video page directly
if(document.getElementById("action-panel-details") != null)
  restoreDetailButtons();

//This will restore the buttons if you started from https://www.youtube.com/ and then clicked into a video from there
window.addEventListener("spfdone", restoreDetailButtons);