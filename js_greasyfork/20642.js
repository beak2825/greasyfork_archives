// ==UserScript==
// @name        Overwatch forums user info
// @namespace   abyx
// @description:en Linkify user names so it directs to playoverwatch profile
// @include     http://*.battle.net/forums/*/overwatch/topic/*
// @version     0.2
// @grant       none
// @description Linkify user names so it directs to playoverwatch profile
// @downloadURL https://update.greasyfork.org/scripts/20642/Overwatch%20forums%20user%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/20642/Overwatch%20forums%20user%20info.meta.js
// ==/UserScript==

var postsCollection = document.getElementsByClassName("TopicPost-content");
var posts = Array.from(postsCollection);
posts.forEach(function(x) {
  var linkToPosts = x.getElementsByClassName("Author-posts")[1].href;
  var bnet = /a=(.+)$/i.exec(linkToPosts)[1];
  var bnetFormatted = bnet.replace("%23","-");
  var region = /http:\/\/(\w+)\.battle/.exec(document.URL)[1];
  var authorNameElement = x.getElementsByClassName("Author-name")[0];
  var authorName = authorNameElement.innerHTML;
  authorNameElement.innerHTML = '<a href="https://playoverwatch.com/en-us/career/pc/' + region + '/' + bnetFormatted + '">' + authorName + '</a>';
  });