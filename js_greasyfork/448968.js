// ==UserScript==
// @name         Discord Keyword Notification -updated
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license      GNU AGPLv3
// @author       noxtrip (original by jcunews) 
// @description  Displays a windows notification whenever a user mentions specific textual word(s) in a channel. The script must be manually edited to configure the keywords.
// @match        *://discordapp.com/*
// @match        *://discord.com/*
// @grant       GM_notification
// @require     http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/448968/Discord%20Keyword%20Notification%20-updated.user.js
// @updateURL https://update.greasyfork.org/scripts/448968/Discord%20Keyword%20Notification%20-updated.meta.js
// ==/UserScript==

(function() {

  //=== CONFIGURATION BEGIN ===

  //maximum duration to display notification
  var notificationDuration = 50000; //in milliseconds. 1000ms = 1 second. 0 or less = disable auto-dismiss notification.

  //keywords are specified as regular expression. note: the "g" flag is required.
  //quick tutorial: https://www.codeproject.com/Articles/199382/Simple-and-Useful-JavaScript-Regular-Expression-Tu
  //full tutorial: https://www.regular-expressions.info/tutorial.html
  var keywordsRegexp = /leech|snip/gi;

  //=== CONFIGURATION END ===

  var observer, observing, selector = '[class^="scrollerInner-"]', matches = [];
  function notify(keywords, nt) {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        GM_notification ( {title: 'Discord match found', text: keywords[0] } );
      }
    });
  }

  function getMatches(s, r, m) {
    r = [];
    while (m = keywordsRegexp.exec(s)){
        r.push(m[0]);
        break;
    }
    return r;
  }

  function check(records) {
    records.forEach(function(record) {
      record.addedNodes.forEach(function(node, m, s) {
        if (
          node && (!node.previousElementSibling || !(/hasMore/).test(node.previousElementSibling.className)) &&
          !node.querySelector('[class*="isSending-"]') && (node = node.querySelector('[class^="markup-"]')) &&
          ((m = getMatches(node.textContent)).length)
        ) {
           notify(m);
        }
      });
    });
  }

  function init(observerInit) {
    observerInit = {childList: true, subtree: true};
    setInterval(function(ele) {
      if (location.pathname.substr(0, 10) === "/channels/") {
        if (!observing && (ele = document.querySelector(selector))) {
          observing = true;
          if (!observer) observer = new MutationObserver(check);
          observer.observe(ele, observerInit);
        }
      } else if (observing) {
        observer.disconnect();
        observing = false;
      }
    }, 500);
  }

  if (window.Notification) {
    Notification.requestPermission().then(function() {
      if (Notification.permission === "granted") {
        init();
      } else alert("Access to Browser Notification feature is not granted by user.\nKeyword notification can not be displayed.");
    });
  } else alert("Browser Notification feature is disabled or not supported.");

})();