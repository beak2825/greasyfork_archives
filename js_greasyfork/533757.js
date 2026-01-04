// ==UserScript==
// @name        AH/QQ/SB/SV Reader mode auto link
// @description Open "Reader mode" directly when clicking threadmarked links.
// @author      C89sd
// @namespace   https://greasyfork.org/users/1376767
// @version     1.12
// @match       https://*.spacebattles.com/*
// @match       https://*.sufficientvelocity.com/*
// @match       https://*.questionablequesting.com/*
// @match       https://*.alternatehistory.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/533757/AHQQSBSV%20Reader%20mode%20auto%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/533757/AHQQSBSV%20Reader%20mode%20auto%20link.meta.js
// ==/UserScript==

'use strict';

if (window.location.href.includes('/threads/')) return;

// Note: https://forums.spacebattles.com/account/*
// cannot be implemented because there's no wordcount to detect if /reader/ is valid or not.

// Note: AlternateHistory is .com/forum/search instead of .com/search
const IS_SEARCH = /^(https:\/\/[^\/]+\/+(search|forum\/search)\/)/.test(window.location.href);

// Note: post links from Search page cannot be converted to reader mode.
// e.g "site.com/threads/foo.123/post-456"
//   resolves to "site.com/threads/foo.123/page-11#post-456"
//   not         "site.com/threads/foo.123/reader/page-2#post-456"
let regex = /^(https:\/\/[^\/]+\/+(?:threads|forum\/threads)\/[^\/]+\/)(post-\d+)?/;

function isPost(match) {
  return match[2] !== undefined;
}

let small = true;
let spanReader;
let spanPostLink;
let spanZeroWords;
if (IS_SEARCH) {
  spanReader = document.createElement('span');
  spanReader.style.fontWeight = 'normal';
  if(small) spanReader.style.fontSize = 'small';
  spanReader.textContent = '⌸ ';

  spanPostLink = document.createElement('span');
  spanPostLink.style.fontWeight = 'normal';
  if(small) spanPostLink.style.fontSize = 'small';
  spanPostLink.textContent = '☍ ';

  spanZeroWords = document.createElement('span');
  spanZeroWords.style.fontWeight = 'normal';
  if(small) spanZeroWords.style.fontSize = 'small';
  spanZeroWords.textContent = '⎕ ';
}

function prependTitleIcon(title, icon) {
  title.insertBefore(icon.cloneNode(true), title.firstChild);
}

const threads = document.querySelectorAll('div.structItem, li.block-row'); // forum, search
for (const thread of threads) {

   // old, view as threads
  var foundCount = false;

  let wordcountOld = thread.querySelector('li>a[data-xf-click="overlay"]')?.textContent?.trim();
  let wordcountNew;
  let wordcountSearch;
  if (wordcountOld && wordcountOld.startsWith('Word')) { // (wordcountOld.startsWith('Words: ') || wordcountOld.startsWith('Word Count: '))) {
    foundCount = true;
  }
  else {
    wordcountNew = thread.querySelector('dl:has(>dd>a[data-xf-click="overlay"])')?.textContent?.trim();
    if (wordcountNew && wordcountNew.startsWith('Word')) {
      foundCount = true;
    }
    else {
      wordcountSearch = thread.querySelector('li>a.wordcount');
      if (wordcountSearch) {
        foundCount = true;
      }
    }
  }

  // Note:
  // If the code breaks it will probably due to this, as there can be multiple links,
  // and I may not have :not() excluded all the cases.
  let title = thread.querySelector('div.structItem-title > a:not(.unreadLink):not(.labelLink), h3.contentRow-title > a');
  if (title) {
    const match = title.href.match(regex);
    if (match) {

      if (isPost(match)) {
        if (IS_SEARCH) prependTitleIcon(title, spanPostLink);
      } else {
        if (foundCount) {
          title.href = match[1] + 'reader/';

          if (IS_SEARCH) prependTitleIcon(title, spanReader);
        } else {
          if (IS_SEARCH) prependTitleIcon(title, spanZeroWords);
        }
      }
    }
  }

  // console.log(thread, wordcountOld, wordcountNew, wordcountSearch, foundCount, title)
}