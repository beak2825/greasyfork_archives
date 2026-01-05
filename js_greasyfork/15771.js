// ==UserScript==
// @name        Redirect book title links in DeVry's Books24x7 RSS feeds
// @namespace   https://greasyfork.org/users/130-joshg253
// @description The book title links in the RSS feeds don't work anymore -- this will redirect them so they do.
// @include     http://*.*
// @include     https://*.*
// @exclude     http://devry.skillport.com/*
// @exclude     https://devry.skillport.com/*
// @version     1a
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15771/Redirect%20book%20title%20links%20in%20DeVry%27s%20Books24x7%20RSS%20feeds.user.js
// @updateURL https://update.greasyfork.org/scripts/15771/Redirect%20book%20title%20links%20in%20DeVry%27s%20Books24x7%20RSS%20feeds.meta.js
// ==/UserScript==

document.body.addEventListener('click', function (e) {
  var targ = e.target || e.srcElement;
  if (targ && targ.href && targ.href.match('https?://devry.skillport.com')) {
    targ.href = targ.href.replace('https://devry.skillport.com/skillportfe/main.action?assetid=$%7BBookID%7D', 'http://skillport.books24x7.com/toc.aspx?bkid=');
  }
});
