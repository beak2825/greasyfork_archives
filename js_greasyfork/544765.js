// ==UserScript==
// @name        AH/QQ/SB/SV Jump arrows
// @description Add arrows to navigate posts: jump back up, jump prev/next by 1, or by author.
// @author      C89sd
// @namespace   https://greasyfork.org/users/1376767
// @version     1.1
// @match       https://*.alternatehistory.com/*
// @match       https://*.questionablequesting.com/*
// @match       https://*.spacebattles.com/*
// @match       https://*.sufficientvelocity.com/*
// @grant       GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/544765/AHQQSBSV%20Jump%20arrows.user.js
// @updateURL https://update.greasyfork.org/scripts/544765/AHQQSBSV%20Jump%20arrows.meta.js
// ==/UserScript==

const DOWN_PARTIAL = true; // The down arrow jumps a bit higher to keep the bottom of the previous post in view.

'use strict';
if (!document.URL.includes('/threads/')) return;

GM_addStyle('.mleft { margin-left: 14px; }');

const posts  = [...document.querySelectorAll('article.message')];
const n      = posts.length;

// 1. build fast lookup: previous / next index per author
const byAuthor = Object.create(null),  // author -> array of post indices (in order)
      posIndex = new Uint32Array(n);   // post index -> position inside its author array

for (let i = 0; i < n; i++) {
  const a = posts[i].dataset.author;
  (byAuthor[a] ||= []).push(i);
}
for (const arr of Object.values(byAuthor))
  for (let j = 0; j < arr.length; j++) posIndex[arr[j]] = j;

// 2. walk all posts once
for (let i = 0; i < n; i++) {
  const art  = posts[i],
        head = art.querySelector('.message-attribution-main'),
        bbar  = art.querySelector('.actionBar-set.actionBar-set--external'),
        list = art.querySelector('.message-attribution-opposite--list');
  if (!head || !bbar || !list) continue;

  // up at bottom
  const bbid = `bb${i}`
  bbar.insertAdjacentHTML('beforeend', `<span><a id="${bbid}" class="actionBar-action mleft" href="#${art.id}">▲</a></span>`);

  // up/down by 1
  const upId   = i ? posts[i - 1].id : null;
  let idEls  = art.querySelectorAll('[id]'),
      downId = idEls.length ? idEls[idEls.length - 1].id : art.id;

  downId = DOWN_PARTIAL ? bbid : downId;

  const upLi   = upId   ? `<li><a href="#${upId}">▲</a></li>` : '<li>◇</li>';
  const downLi =          `<li><a href="#${downId}">▼</a></li>`;

  list.insertAdjacentHTML('beforeend', upLi + downLi);

  // prev/next by author
  const authorArr = byAuthor[art.dataset.author],
        pos       = posIndex[i];

  const prevTarget =
    pos ? `#${posts[authorArr[pos - 1]].id}` :
    art.classList.contains('hasThreadmark') ? document.querySelector('.threadmark-control--previous')?.href : null;

  const nextTarget =
    pos < authorArr.length - 1 ? `#${posts[authorArr[pos + 1]].id}` :
    art.classList.contains('hasThreadmark') ? document.querySelector('.threadmark-control--next')?.href : null;

  const DIAMOND = '<li><a class="u-concealed mleft">◇</a></li>';
  const prevHTML = prevTarget ? `<li><a class="u-concealed mleft" href="${prevTarget}">A↑</a></li>` : DIAMOND;
  const nextHTML = nextTarget ? `<li><a class="u-concealed mleft" href="${nextTarget}">A↓</a></li>` : DIAMOND;

  head.insertAdjacentHTML('beforeend', prevHTML + nextHTML);
}