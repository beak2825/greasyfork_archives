// ==UserScript==
// @name OldYoutubeDescriptionFix
// @description returns "show more" and "show less" buttons into the old Youtube video description 
// @include        *://*.youtube.com/*
// @include        *://youtube.com/*
// @version 0.0.1.20200605201833
// @namespace https://greasyfork.org/users/581294
// @downloadURL https://update.greasyfork.org/scripts/404751/OldYoutubeDescriptionFix.user.js
// @updateURL https://update.greasyfork.org/scripts/404751/OldYoutubeDescriptionFix.meta.js
// ==/UserScript==

var showButton = document.createElement ('div');
showButton.innerHTML = '<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-expander yt-uix-expander-head yt-uix-expander-collapsed-body yt-uix-gen204" type="button" onclick=";return false;" data-gen204="feature=watch-show-more-metadata"><span class="yt-uix-button-content">Show more</span></button>';
var hideButton = document.createElement ('div');
hideButton.innerHTML = '<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-expander yt-uix-expander-head yt-uix-expander-body" type="button" onclick=";return false;"><span class="yt-uix-button-content">Show less</span></button>';
var descriptionDiv = document.getElementById('action-panel-details');
var needsFix = descriptionDiv.querySelector(".yt-uix-button") == null;
if (needsFix) {
  descriptionDiv.appendChild(showButton);
  descriptionDiv.appendChild(hideButton);
}