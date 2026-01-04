// ==UserScript==
// @name     Youtube RSS
// @namespace   http://shadow.ed
// @description Adds RSS alternate to Youtube channel page
// @include     https://www.youtube.com/channel/*
// @include     https://www.youtube.com/user/*
// @version  1
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/368579/Youtube%20RSS.user.js
// @updateURL https://update.greasyfork.org/scripts/368579/Youtube%20RSS.meta.js
// ==/UserScript==

var chanId = document.querySelector('[rel="canonical"]').getAttribute('href').split('/')[4];
var rss = document.createElement('link');
rss.setAttribute('rel', 'alternate');
rss.setAttribute('type', 'application/rss+xml');
rss.setAttribute('href', 'https://www.youtube.com/feeds/videos.xml?channel_id=' + chanId);
document.head.appendChild(rss);