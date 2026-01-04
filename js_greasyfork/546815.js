// ==UserScript==
// @name         Bitcointalk Post and Reply Word and Char Counter
// @namespace    Royal Cap
// @version      1.2.0
// @description  Live word, character, and reading time counter for Bitcointalk reply boxes and posts. Excludes [quote] blocks, even when nested.
// @match        https://bitcointalk.org/index.php?*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546815/Bitcointalk%20Post%20and%20Reply%20Word%20and%20Char%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/546815/Bitcointalk%20Post%20and%20Reply%20Word%20and%20Char%20Counter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Remove every [quote ...] ... [/quote] block, correctly handling nesting
  function stripQuotesBBCode(text) {
    const tagRe = /\[(\/?)quote(?:[^\]]*)\]/gi;
    const stack = [];
    const ranges = [];
    let m;

    while ((m = tagRe.exec(text)) !== null) {
      const isClose = m[1] === '/';
      if (!isClose) {
        stack.push(m.index);
      } else if (stack.length) {
        const start = stack.pop();
        const end = tagRe.lastIndex;
        ranges.push([start, end]);
      }
    }

    if (ranges.length) {
      ranges.sort((a, b) => a[0] - b[0]);
      const merged = [];
      for (const [s, e] of ranges) {
        if (!merged.length || s > merged[merged.length - 1][1]) {
          merged.push([s, e]);
        } else {
          merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
        }
      }
      let out = '';
      let idx = 0;
      for (const [s, e] of merged) {
        out += text.slice(idx, s);
        idx = e;
      }
      out += text.slice(idx);
      text = out;
    }

    text = text.replace(/\[\/?quote[^\]]*\]/gi, '');
    return text.trim();
  }

  function countFromPlainText(text) {
    const words = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    const chars = text ? text.length : 0;
    const readingTime = words ? Math.ceil(words / 200) : 0;
    return { words, chars, readingTime };
  }

  // Counter for your reply textarea
  function createCounterBox(textarea) {
    if (textarea.dataset.counterAdded) return;
    textarea.dataset.counterAdded = '1';

    const counter = document.createElement('div');
    counter.style.fontSize = '12px';
    counter.style.marginTop = '4px';
    counter.style.color = '#333';
    counter.textContent = 'Words: 0 | Characters: 0 | Reading time: 0 min';
    textarea.parentNode.insertBefore(counter, textarea.nextSibling);

    function updateCounter() {
      const raw = textarea.value || '';
      const withoutQuotes = stripQuotesBBCode(raw);
      const { words, chars, readingTime } = countFromPlainText(withoutQuotes);
      counter.textContent = `Words: ${words} | Characters: ${chars} | Reading time: ${readingTime} min`;
    }

    textarea.addEventListener('input', updateCounter);
    textarea.addEventListener('change', updateCounter);
    updateCounter();
  }

  // Counter for visible posts on the page
  // This tries to remove rendered quote blocks before counting
  function extractPostTextWithoutQuotes(postEl) {
    const clone = postEl.cloneNode(true);
    // SMF based forums often use these for quotes
    clone.querySelectorAll('.quote, .quoteheader, blockquote').forEach(el => el.remove());
    return clone.innerText.trim();
  }

  function createPostCounters() {
    document.querySelectorAll('td.post, div.post').forEach(post => {
      if (post.dataset.counterAdded) return;
      post.dataset.counterAdded = '1';

      const text = extractPostTextWithoutQuotes(post);
      const { words, chars, readingTime } = countFromPlainText(text);

      const counter = document.createElement('div');
      counter.style.fontSize = '11px';
      counter.style.marginTop = '6px';
      counter.style.color = 'gray';
      counter.style.textAlign = 'right';
      counter.textContent = `Words: ${words} | Characters: ${chars} | Reading time: ${readingTime} min`;

      post.appendChild(counter);
    });
  }

  function init() {
    document.querySelectorAll("textarea[name='message']").forEach(createCounterBox);
    createPostCounters();

    const observer = new MutationObserver(() => {
      document.querySelectorAll("textarea[name='message']").forEach(createCounterBox);
      createPostCounters();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  init();
})();
