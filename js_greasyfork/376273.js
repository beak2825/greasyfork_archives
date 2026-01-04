// ==UserScript==
// @name         StackExchange Hide Comments
// @namespace    https://github.com/walenzack
// @version      0.5
// @description  Hide comments on all Stack Exchange sites (except StackOverflow).
// @author       walen
// @match        https://*.stackoverflow.com/*
// @match        https://*.stackexchange.com/*
// @match        https://superuser.com/*
// @match        https://askubuntu.com/*
// @match        https://serverfault.com/*
// @match        https://stackapps.com/*
// @match        https://mathoverflow.net/*
// @grant        window.setInterval
// @grant        window.setTimeout
// @grant        window.location
// @downloadURL https://update.greasyfork.org/scripts/376273/StackExchange%20Hide%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/376273/StackExchange%20Hide%20Comments.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var INBOX_BUTTON = 'a[class*="js-inbox-button"]';
  var INBOX_ITEM = 'li[class^="inbox-item"]';
  var COMMENT = 'div[id^="comments"]';
  var SO = /stackoverflow\.com/;
  var SE = /(\.stackexchange\.com|superuser\.com|askubuntu\.com|serverfault\.com|stackapps\.com|mathoverflow\.net)/;
  var CHAT = /chat\.stackexchange\.com/;

  var inboxButton = document.querySelectorAll(INBOX_BUTTON)[0];
  var inboxUnreadCounter = inboxButton.children[1];

  function hideComments() {
    if (!SO.test(window.location)) {
      [].forEach.call(
        document.querySelectorAll(COMMENT),
        function (el) {
          el.style.display="none";
        }
      );
    }
  }

  function hideInboxComments() {
    // Currently this only works if the inbox has already been initialized (i.e. clicked)
    // TODO Load inbox items async. on page load without clearing initial unread status
    // TODO Skip forEach if there are no new notifications since last call
    [].forEach.call(
      document.querySelectorAll(INBOX_ITEM),
      function (el) {
        var href = el.children[0].href;
        if (SE.test(href)) { // Do not hide notifications for comments on SO posts
          if (!CHAT.test(href)) { // Do not hide chat notifications
            var type = el.children[0].children[1].children[0].children[0].innerText; //hacky af
            if ('comment' === type) {
              el.style.display="none";
              var count = Number(inboxUnreadCounter.innerText);
              if (count > 1) {
                inboxUnreadCounter.innerText = --count;
              } else if (count === 1) {
                inboxUnreadCounter.innerText = "";
                inboxUnreadCounter.style.display = 'none';
              }
            }
          }
        }
      }
    );
  };

  /* Main logic */
  window.setInterval(function() {
    // Hide comments
    hideComments();
    // Hide comment notifications
    hideInboxComments();
  }, 2*1000);
})();
