// ==UserScript==
// @name        AH/QQ/SB/SV Find button
// @description Jump to the last visible liked/bookmarked post on this page, button added to the navigation bar.
// @author      C89sd
// @namespace   https://greasyfork.org/users/1376767
// @version     1.2
// @match       https://*.alternatehistory.com/*
// @match       https://*.questionablequesting.com/*
// @match       https://*.spacebattles.com/*
// @match       https://*.sufficientvelocity.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/546224/AHQQSBSV%20Find%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/546224/AHQQSBSV%20Find%20button.meta.js
// ==/UserScript==

if (!window.location.href.includes('/threads/')) return;

const nav = document.querySelector('.p-nav-opposite');
nav.insertAdjacentHTML('afterbegin',
  '<div class="p-navgroup-link" style="cursor:pointer">Find</div>');
const btn = nav.querySelector('.p-navgroup-link');

btn.onclick = () => {
  let last;

  for (const msg of document.querySelectorAll('.message')) { // .hasThreadmark
    // bookmarks
      const list = msg.querySelectorAll('.bookmarkLink.is-bookmarked');
      if (list.length) last = list[list.length - 1];

    // SB likes
      const sb = [...msg.querySelectorAll('.actionBar-action--sv-rate')]
                   .reverse()
                   .find(n => n.textContent.trim() === 'Remove');
      if (sb) last = sb;

    // SV likes
      const sv = [...msg.querySelectorAll('.button--sv-rate')]
                   .reverse()
                   .find(n => n.textContent.trim() === 'Remove');
      if (sv) last = sv;

    // QQ / AH likes
      const list2 = msg.querySelectorAll('.reaction--1.has-reaction');
      if (list2.length) last = list2[list2.length - 1];
  }

  if (last) {
    const id = 'rand' + Math.random().toString(36).slice(2); // random id
    last.id = id;
    location.hash = '#' + id;                                // jump to it
  } else {
    btn.textContent = "None!";
  }
};