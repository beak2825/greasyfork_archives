// ==UserScript==
// @name        the most efficient script to bring back youtube full description
// @version     1
// @match        *://www.youtube.com/*
// @grant       GM_addStyle
 
// @namespace https://greasyfork.org/users/587153
// @description this is a scrip restore the ability to show youtube full description if. because youtube try to force us to use the new layout by breaking the old layout. there are two other scripts that do the same thing but this scrip is the most efficient. because other scrips use 2 or 3 variables but this script use only one variable and it is the shortest one
// @downloadURL https://update.greasyfork.org/scripts/405226/the%20most%20efficient%20script%20to%20bring%20back%20youtube%20full%20description.user.js
// @updateURL https://update.greasyfork.org/scripts/405226/the%20most%20efficient%20script%20to%20bring%20back%20youtube%20full%20description.meta.js
// ==/UserScript==
if (document.querySelector('button[data-gen204="feature=watch-show-more-metadata"]') == null) {
function GM_addStyle(text)
{
  var newHTML = document.createElement("div");
  newHTML.innerHTML = text;
  document.getElementById("action-panel-details").appendChild(newHTML);
}
GM_addStyle("<button class=\"yt-uix-button yt-uix-button-size-default yt-uix-button-expander yt-uix-expander-head yt-uix-expander-collapsed-body yt-uix-gen204\" type=\"button\" onclick=\";return false;\" data-gen204=\"feature=watch-show-more-metadata\"><span class=\"yt-uix-button-content\">Show more</span></button>")
GM_addStyle("<button class=\"yt-uix-button yt-uix-button-size-default yt-uix-button-expander yt-uix-expander-head yt-uix-expander-body\" type=\"button\" onclick=\";return false;\"><span class=\"yt-uix-button-content\">Show less</span></button>")
} else {}