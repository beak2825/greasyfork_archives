// ==UserScript==
// @name        reddit: /u/ keywords highlight
// @namespace   Violentmonkey Scripts
// @match       https://old.reddit.com/user/*
// @match       https://old.reddittorjg6rue252oqsxryoxengawnmo46qy4kyii5wtqnwfj4ooad.onion/user/*
// @grant       none
// @version     0.1.3
// @author      -
// @description -
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/523136/reddit%3A%20u%20keywords%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/523136/reddit%3A%20u%20keywords%20highlight.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const words = ['invite', 'torrent', 'tracker', 'opensignups',
                 ' mam ', ' ptp ', ' ggn ', ' btn ', ' kg ',
                 'pirate', 'piracy', 'dmca',
                ];


  const selector = '.linklisting div[id^="thing_"]';
  const fields_selector = '.title, .subreddit, .usertext-body';
  document.querySelectorAll(selector).forEach(comment => {
    var str = '';
    comment.querySelectorAll(fields_selector).forEach(f => {
      str += ' ' + f.textContent.toLowerCase();
    });

    // console.log(str);

    words.forEach(word => {
      if (str.includes(word)) {
        comment.style.background = 'rgb(255, 224, 224)';
      }
    });

  });



})();