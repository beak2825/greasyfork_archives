// ==UserScript==
// @name        Power Platform Community - Reply / Answer Links
// @namespace   eliotcole Scripts
// @match       https://community.powerplatform.com/forums/thread/details/*
// @grant       none
// @version     1.0
// @license     MIT
// @author      eliotcole
// @description 02/01/2025, 12:26:23
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/522603/Power%20Platform%20Community%20-%20Reply%20%20Answer%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/522603/Power%20Platform%20Community%20-%20Reply%20%20Answer%20Links.meta.js
// ==/UserScript==
const ogUrlly = $('meta[property="og:url"]').attr('content');
$('div.like-button-action > span.like-comment-label > span > span[id^="record-"]').each(function(){
  let recIddy = $(this).attr('id');
  let replyLinky = ogUrlly+'#'+recIddy;
  $(this).closest('div.like-button-action').before('<div class="replyLinky"><a href="'+replyLinky+'">&#x1F517 LINK</a></div>');
});