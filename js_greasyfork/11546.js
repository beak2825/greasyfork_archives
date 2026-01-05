// ==UserScript==
// @name        HN highlight fresh comments
// @description Highlights fresh comments on Hacker News.
// @version     1
// @namespace   https://greasyfork.org/en/scripts/6955-hacker-fresh
// @include     http://news.ycombinator.com/*
// @include     https://news.ycombinator.com/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/11546/HN%20highlight%20fresh%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/11546/HN%20highlight%20fresh%20comments.meta.js
// ==/UserScript==

GM_addStyle(".fresh-item { background-color: #FEE67F; border-radius: 3px; }");

(function() {
  'use strict';
  function get_comment_id(vote_box) {
    var item_link_ele = vote_box.parentElement.querySelector('.comhead > a:nth-child(2)');

    // Check for deleted comment
    if (item_link_ele === null) {
      return null;
    }

    var link = new URL(item_link_ele.href);
    return link.searchParams.get('id');
  }

  var all_vote_box = document.querySelectorAll('tbody > tr > td[valign=top]');

  for (var e of all_vote_box) {
    e.classList.add("vote-box");

    var item_id = get_comment_id(e);
    if (item_id !== null) {
      var status = localStorage.getItem(item_id);

      if (status === null) {
        e.classList.add("fresh-item");
        localStorage.setItem(item_id, "seen");
      }
    }
  }
})();