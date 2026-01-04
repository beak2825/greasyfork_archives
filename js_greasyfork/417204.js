// ==UserScript==
// @name     Shift + Enter to send tweet
// @description Press shift and enter at the same time to send a tweet!
// @author   Thestickman391
// @version  1
// @homepageURL https://gist.github.com/Thestickman391/d5e40959eeee7c41b986c06457ec5575
// @include  https://twitter.*/*
// @grant    none
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require  https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js
// @namespace https://greasyfork.org/users/710818
// @downloadURL https://update.greasyfork.org/scripts/417204/Shift%20%2B%20Enter%20to%20send%20tweet.user.js
// @updateURL https://update.greasyfork.org/scripts/417204/Shift%20%2B%20Enter%20to%20send%20tweet.meta.js
// ==/UserScript==

waitForKeyElements ('[data-testid="tweetButton"]', tweetButtonLoaded);

function tweetButtonLoaded (tweetButton)
{
  $('[data-testid="tweetTextarea_0"]').keydown(function(e){
    console.log(e);
    if (e.keyCode == 13 && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      $(tweetButton).click();
    }
  })
}