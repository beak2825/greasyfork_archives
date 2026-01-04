// ==UserScript==
// @name         Youtube subscriptions filter
// @namespace    https://github.com/FlandreDaisuki
// @version      0.2
// @description  Work with {xxzefgh/youtube-classic-extension}
// @author       FlandreDaisuki
// @match        https://www.youtube.com/*
// @require      https://unpkg.com/sentinel-js@0.0.5/dist/sentinel.js
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/376309/Youtube%20subscriptions%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/376309/Youtube%20subscriptions%20filter.meta.js
// ==/UserScript==

/* global sentinel */

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const $el = (t, a = {}, c = () => {}) => {
  const e = document.createElement(t);
  Object.assign(e, a);
  c(e);
  return e;
};

const 過濾輸入 = $el('input', { id: '訂閱內容過濾', placeholder: 'RegExp with "ig" flag' });
const 過濾內容 = (s = '') => {
  let regex;
  try { regex = new RegExp(s, 'ig'); } catch(ex) { return; }

  $$('#guide-channels > li').forEach((li) => {
    const name = li.querySelector('.display-name').textContent.trim();

    if(regex.test(name)) {
      li.classList.remove('hidden');
    } else {
      li.classList.add('hidden');
    }
  });
};
const 自訂樣式 = $el('style', {
  id:'💜💙💚💛💖ㄟ🧛‍♀️ㄏ💖💛💚💙💜',
  textContent:`
#guide-subscriptions-section > h3:hover {
  cursor: pointer;
  font-size: 12px;
}
#訂閱內容過濾 {
  display: none;
  margin: 0 5px 4px;
  border: 1px solid gray;
}
.顯示過濾 + #訂閱內容過濾 {
  display: inline-block;
}
.hidden {
  display: none !important;
}`
});

sentinel.on('#guide-subscriptions-section > h3', (訂閱內容) => {
  sentinel.reset();

  訂閱內容.insertAdjacentElement('afterend', 過濾輸入);
  訂閱內容.addEventListener('click', (event) => {
    訂閱內容.classList.toggle('顯示過濾');
    if(!訂閱內容.classList.contains('顯示過濾')) {
      過濾輸入.value = '';
      過濾內容();
    }
  });
  過濾輸入.addEventListener('input', (event) => {
    過濾內容(過濾輸入.value.trim());
  });
  document.head.appendChild(自訂樣式);
});
