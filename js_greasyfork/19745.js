// ==UserScript==
// @name        Koncat
// @namespace   https://greasyfork.org/en/users/44053-shirl
// @version     1.1
// @description Changes the steamgifts cat animation to a konrad animation
// @match       http://www.steamgifts.com/*
// @match       https://www.steamgifts.com/*
// @grant       none
// @resource    https://media.giphy.com/media/XhuKmvxRHCWTC/giphy.gif
// @downloadURL https://update.greasyfork.org/scripts/19745/Koncat.user.js
// @updateURL https://update.greasyfork.org/scripts/19745/Koncat.meta.js
// ==/UserScript==
// saves all settings of all <img> tags in the tags variable/array
var tags = document.getElementsByTagName('img');
// goes through every entry in the tags array, so through every <img> tag
for (var i = 0; i < tags.length; i++) {
  // replaces the searched image src with the one you want. This happens in ALL <img> tags with the searched src
  if (tags[i].src.search(/cat_sagan\.gif/) > -1) {
    tags[i].src = "https://media.giphy.com/media/XhuKmvxRHCWTC/giphy.gif";
  }
}
// note: this code was not written by me. It was linked to me by someone who had found it somewhere else. The konrad gif was created by me though.