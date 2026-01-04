// ==UserScript==
// @name         LOLZ Collapse
// @namespace    https://lolz.live
// @version      1.0
// @description  Удаляет дублирующиеся уведомления
// @match        https://lolz.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547405/LOLZ%20Collapse.user.js
// @updateURL https://update.greasyfork.org/scripts/547405/LOLZ%20Collapse.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const debounce = (fn, delay = 200) => {
    let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), delay); };
  };

  const run = debounce(() => {
    const list = document.querySelector('#AlertsDestinationWrapper ol');
    if (!list) return;

    const buckets = new Map();

    [...list.querySelectorAll('li.Alert')].forEach(li => {
      const isLike = li.querySelector('.alertAction.like2') || /нравится/i.test(li.textContent);
      const type   = isLike ? 'like' : 'reply';

      let key;
      if (isLike) {
        key = li.querySelector('h3 a[href*="posts/"]')?.href?.match(/posts\/(\d+)/)?.[1];
      } else {
        key = li.querySelector('h3 a[data-previewurl]')?.dataset.previewurl?.match(/threads\/(\d+)/)?.[1];
      }
      if (!key) return;

      const bucketKey = `${type}_${key}`;
      (buckets.get(bucketKey) || buckets.set(bucketKey, []).get(bucketKey)).push(li);
    });

    buckets.forEach(group => {
      if (group.length < 2) return;

      const [first, ...rest] = group;
      const others = rest.length;

      rest.forEach(li => li.remove());

      const h3 = first.querySelector('h3');
      if (!h3) return;
      const nickLink = h3.querySelector('a.username');
      if (!nickLink) return;

      if (h3.querySelector('.tm-counter')) return;

      const counter = document.createElement('span');
      counter.className = 'tm-counter';
      counter.textContent = ` (и ещё ${others})`;
      Object.assign(counter.style, {color:'#fff', marginLeft:'4px'});
      nickLink.after(counter);
    });
  });

  run();
  const panel = document.getElementById('AlertPanels');
  if (panel) new MutationObserver(run).observe(panel, {childList: true, subtree: true});
})();