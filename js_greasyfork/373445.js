// ==UserScript==
// @name         Discord Keyword Notification
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @license      GNU AGPLv3
// @author       jcunews
// @description  Displays a browser notification whenever a user mentions specific textual word(s) in a channel. The script must be manually edited to configure the keywords.
// @match        *://discordapp.com/*
// @match        *://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373445/Discord%20Keyword%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/373445/Discord%20Keyword%20Notification.meta.js
// ==/UserScript==

(function() {

  //=== CONFIGURATION BEGIN ===

  //maximum duration to display notification
  var notificationDuration = 5000; //in milliseconds. 1000ms = 1 second. 0 or less = disable auto-dismiss notification.

  //keywords are specified as regular expression. note: the "g" flag is required.
  //quick tutorial: https://www.codeproject.com/Articles/199382/Simple-and-Useful-JavaScript-Regular-Expression-Tu
  //full tutorial: https://www.regular-expressions.info/tutorial.html
  var keywordsRegexp = /\bnotifyme\b|\bspotme\b|\bmatchwordstart|trivia|matchwordend\b|^matchmessagestart|matchmessageend$/gi;

  //=== CONFIGURATION END ===

  var observer, observing, selector = '[class^="messagesWrapper-"] #chat-messages', matches = [];
  function notify(keywords, nt) {
    var nt = new Notification("Keyword Notification", {
      body: keywords.shift() + " mentions: " + keywords.join(", ")
    });
    setTimeout(function() {
      matches.shift();
    }, 500);
    if (notificationDuration > 0) setTimeout(function() {
      nt.close();
    }, notificationDuration);
  }

  function getMatches(s, r, m) {
    r = [];
    while (m = keywordsRegexp.exec(s)) r.push(m[0]);
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
          m.unshift(Array.from(node.querySelectorAll("h2 span:first-child")).map(e => e.textContent.trim()).join(" "));
          if (!matches.includes(s = m.join("\uffff"))) {
            matches.push(s);
            notify(m);
          }
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
