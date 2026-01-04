// ==UserScript==
// @name         Twitter Bait Filter
// @namespace    https://github.com/zolu647/twitter-bait-filter
// @version      2.1
// @description  Blocks bait threads on Twitter/X using Unicode, media, and keyword heuristics. Replaces with placeholder.
// @author       zolu647
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535056/Twitter%20Bait%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/535056/Twitter%20Bait%20Filter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BAIT_KEYWORDS = [
    'game of thrones',
    'hot scenes',
    'nsfw',
    'nude',
    'best scenes',
    'sexiest',
    'onlyfans',
    'follow and make my day',
    'say hi',
    'my birthday',
    "i'm ugly",
    'nobody notices',
    "maybe it's because",
    'make my day',
    'fuck it',
    'porn thread',
    'porn',
    'p*rn',
    'booty thread',
  ];

  const WHITELIST_KEYWORDS = [
    'soccer',
    'football',
    'messi',
    'ronaldo',
    'arsenal',
    'man united',
    'premier league',
    'goal',
    'chelsea',
  ];

  const EMOJI_REGEX = /[\u231A-\uD83E\uDDFF]/g;
  const THREAD_REGEX = /\bthread\b/i;

  const normalizeText = (input) =>
    input
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^\x00-\x7F]/g, '') // remove other Unicode
      .toLowerCase();

  const isTweetBait = (rawText, tweet) => {
    const text = normalizeText(rawText);
    const hasMedia = tweet.querySelector('img, video') !== null;
    const hasThread = THREAD_REGEX.test(text);
    const hasBaitText = BAIT_KEYWORDS.some((k) => text.includes(k));
    const isWhitelisted = WHITELIST_KEYWORDS.some((k) => text.includes(k));
    const emojiCount = (text.match(EMOJI_REGEX) || []).length;
    const hasTooManyEmojis = emojiCount >= 5;

    return (
      hasThread &&
      hasMedia &&
      (hasBaitText || hasTooManyEmojis || !isWhitelisted)
    );
  };

  const processTweets = () => {
    document.querySelectorAll('article').forEach((tweet) => {
      const rawText = tweet.innerText || '';
      if (isTweetBait(rawText, tweet)) {
        console.log(
          '🛑 Blocked tweet:',
          rawText.slice(0, 150).replace(/\n/g, ' ')
        );

        tweet.innerHTML = `
                  <div style="
                      padding: 16px;
                      margin: 8px;
                      color: #ff4d4d;
                      background: #1e1e1e;
                      border: 1px solid #444;
                      border-radius: 8px;
                      font-weight: bold;
                      font-family: sans-serif;
                      text-align: center;
                      font-size: 14px;
                  ">
                      🚫 Blocked Tweet (Unicode/Media Bait Detected)
                  </div>
              `;
      }
    });
  };

  const observer = new MutationObserver(() => {
    processTweets();
  });

  window.addEventListener('load', () => {
    console.log('✅ Twitter Bait Filter v1.9 loaded');
    processTweets();
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
