// ==UserScript==
// @name        Magog Enhancements Hoard
// @description Small enhancements for the Magog forums.
// @namespace   http://the-magog-forum.freeforums.net
// @include     http://the-magog-forum.freeforums.net/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25489/Magog%20Enhancements%20Hoard.user.js
// @updateURL https://update.greasyfork.org/scripts/25489/Magog%20Enhancements%20Hoard.meta.js
// ==/UserScript==
setTimeout(function() {
  $(document).ready(function(){
      // Adds a Notifications entry on the menu, next to Profile
      var $profileMenu = $('ul[role=navigation] > li').eq(5);
      var profileLink = $profileMenu.find('a').attr('href');
      $profileMenu.after('<li><a href="'+ profileLink +'/notifications">Notifications</a></li>');
  });
}, 20);