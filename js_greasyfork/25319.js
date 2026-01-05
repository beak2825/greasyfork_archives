// ==UserScript==
// @name          Fresh Lobsters
// @version       0.0.3
// @namespace     http://userscripts.psbarrett.com
// @description	  Highlights fresh comments on Lobste.rs.
// @include       https://lobste.rs/*
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/25319/Fresh%20Lobsters.user.js
// @updateURL https://update.greasyfork.org/scripts/25319/Fresh%20Lobsters.meta.js
// ==/UserScript==
'use strict'

// Workaround Backwards Incompatible Change
if (typeof GM_addStyle == 'undefined') {
  var GM_addStyle = (aCss) => {
    'use strict';
    let head = document.getElementsByTagName('head')[0];
    if (head) {
      let style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = aCss;
      head.appendChild(style);
      return style;
    }
    return null;
  };
}

GM_addStyle(
`
.byline.fresh-item > span,
.byline a.fresh-item {
  color:red;
}
`);

function get_comment_id(byline) {
  let a = byline.querySelector('a');
  return a.name;
}

function get_comment_time(byline) {
  let item_link_ele = byline.querySelector('span');
  return item_link_ele.title;
}

//
// Comments
//
let all_byline = document.querySelectorAll('.comment .byline');

for (let byline of all_byline) {
  let comment_id = get_comment_id(byline);
  let comment_time = get_comment_time(byline);
  
  if (comment_id !== null && comment_time !== null) {
    var status = localStorage.getItem(comment_id);

    if (status === null || comment_time !== status) {
      byline.classList.add("fresh-item");
      localStorage.setItem(comment_id, comment_time);
    }
  }
}

//
// Comment Links
//
let stories = document.querySelectorAll('.stories li');

for (let story of stories) {
  let story_id = story.dataset.shortid;
  let comment_link = story.querySelector('.byline .comments_label a');
  let story_comment_count = comment_link.textContent.trim().split(" ")[0].trim();

  // If Parsed Properly, Check Count, Mark Changed
  if (story_id !== null && story_comment_count !== null && story_comment_count !== 'no') {
    var status = localStorage.getItem(story_id);

    if (status !== null && story_comment_count !== status) {
      comment_link.classList.add("fresh-item");
    }
  }

  // Save Story Comment Count when Visited
  if (stories.length == 1) {
    localStorage.setItem(story_id, story_comment_count);
  }
}