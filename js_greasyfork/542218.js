// ==UserScript==
// @name         Twitter: Highlight Posts with Links
// @version      0.1
// @description  Highlights Tweets which contain external Links or hides Tweets without them
// @author       Schubsi
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/1493523
// @downloadURL https://update.greasyfork.org/scripts/542218/Twitter%3A%20Highlight%20Posts%20with%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/542218/Twitter%3A%20Highlight%20Posts%20with%20Links.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Default-Werte
  let highlightEnabled = GM_getValue("highlightEnabled", true);
  let hideWithoutLinks = GM_getValue("hideWithoutLinks", false);

  const toggleHighlight = () => {
    highlightEnabled = !highlightEnabled;
    GM_setValue("highlightEnabled", highlightEnabled);
    processTweets();
  };

  const toggleHide = () => {
    hideWithoutLinks = !hideWithoutLinks;
    GM_setValue("hideWithoutLinks", hideWithoutLinks);
    processTweets();
  };

  // Menüeinträge in Tampermonkey
  GM_registerMenuCommand(
    `Highlighting: ${highlightEnabled ? "On" : "Off"}`,
    toggleHighlight
  );
  GM_registerMenuCommand(
    `Hide Posts without Links: ${hideWithoutLinks ? "On" : "Off"}`,
    toggleHide
  );

  const styleLinkTweet = (tweet) => {
    if (highlightEnabled) {
      tweet.style.outline = "5px solid #4ca2fe";
    } else {
      tweet.style.outline = "";
    }
  };

  const styleNonLinkTweet = (tweet) => {
    // Statt display:none verwenden wir "visibility: hidden; height: 0" trick,
    // um die Post-Elemente weiterhin im Layout zu behalten (für Scroll-Trigger)
    if (hideWithoutLinks) {
      tweet.style.visibility = "hidden";
      tweet.style.height = "0px";
      tweet.style.margin = "0";
      tweet.style.padding = "0";
      tweet.style.overflow = "hidden";
    } else {
      tweet.style.visibility = "";
      tweet.style.height = "";
      tweet.style.margin = "";
      tweet.style.padding = "";
      tweet.style.overflow = "";
    }
  };

  const autoCheckLink = (tweet) => {
    const linkEl = tweet.querySelector("a[target='_blank']");
    if (linkEl) {
      styleLinkTweet(tweet);
      return;
    }

    const quotedTweet = tweet.querySelector(
      "div[id^='id__'][aria-labelledby^='id__']"
    );
    if (!quotedTweet) {
      styleNonLinkTweet(tweet);
      return;
    }
    const quotedText = quotedTweet.querySelector(
      "div[data-testid='tweetText']"
    );
    const quotedEmbed = quotedTweet.querySelector(
      "div[id^='id__'][aria-labelledby^='id__'][data-testid='card.wrapper']"
    )
    if (!quotedText && !quotedEmbed) {
      styleNonLinkTweet(tweet);
      return;
    }
    if (quotedEmbed) {
      styleLinkTweet(tweet);
      return;
    }
    if (/\b(?!x\.com)[a-zA-Z0-9][a-zA-Z0-9\-_.]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}\b/.test(quotedText.innerText)) {
      styleLinkTweet(tweet);
      return;
    }
    styleNonLinkTweet(tweet);
  };

  const processTweets = () => {
    // Seiten-Filter
    const url = window.location.href;
    const isHome = url === 'https://x.com/';
    const isSearch = url.startsWith('https://x.com/search?q=');
    const isProfile = url.match(/https:\/\/x\.com\/[a-zA-Z0-9_]+$/);
    if (!(isHome || isSearch || isProfile)) {
      return;
    }

    document.querySelectorAll("article").forEach((tweet) => {
      autoCheckLink(tweet);
    });
  };

  const observer = new MutationObserver(() => {
    processTweets();
  });

  window.addEventListener("load", () => {
    processTweets();
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();