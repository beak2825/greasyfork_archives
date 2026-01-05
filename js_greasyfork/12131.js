// ==UserScript==
// @name        MyBike.gr filter content
// @namespace   mybikegr_content
// @include     http://www.mybike.gr/*
// @version     1
// @description Use custom filters in new content
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12131/MyBikegr%20filter%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/12131/MyBikegr%20filter%20content.meta.js
// ==/UserScript==


var newContent = "http://www.mybike.gr/new-content/?updateFilters=0&vncTimePeriod=all&onlyUnread=0&onlyFollowed=0&onlyStarted=0&onlyParticipated=0";
var myContent = "http://www.mybike.gr/new-content/?updateFilters=0&vncTimePeriod=all&onlyUnread=0&onlyFollowed=1&onlyStarted=0&onlyParticipated=1";

window.addEventListener('load', function() {
  
  var ulist = document.getElementById("elHeaderSubLinks").getElementsByClassName("ipsList_inline");
  var listitem = ulist[0].getElementsByTagName("a");

  listitem[1].href = newContent;
  listitem[2].href = myContent;

  var ulist = document.getElementById("elMobileNav");
  var listitem = ulist.getElementsByTagName("a");

  listitem[1].href = newContent;
  listitem[2].href = myContent;

}, false);



