// ==UserScript==
// @name         Google Search Site Switch
// @namespace    https://github.com/yookibooki/userscripts
// @description  Adds search engines to Google's results page
// @version      1.0
// @match        https://www.google.com/search*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/532753/Google%20Search%20Site%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/532753/Google%20Search%20Site%20Switch.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

    function init() {
      const input = document.querySelector('input[name="q"], textarea[name="q"]');
      if (!input?.value) return;
  
      const query = encodeURIComponent(input.value);
      const engines = [
        ['Yandex', 'yandex.com', `https://yandex.com/search/?text=${query}`],
        ['Bing', 'bing.com', `https://www.bing.com/search?q=${query}`],
        ['DuckDuckGo', 'duckduckgo.com', `https://duckduckgo.com/?q=${query}`],
        ['Perplexity', 'perplexity.ai', `https://www.perplexity.ai/search?q=${query}`],
        ['Reddit', 'reddit.com', `https://www.reddit.com/search/?q=${query}`],
        ['Wikipedia', 'wikipedia.org', `https://en.wikipedia.org/wiki/Special:Search?search=${query}`],
        ['ChatGPT', 'chatgpt.com', `https://chatgpt.com/?q=${query}`],
        ['GitHub', 'github.com', `https://github.com/search?q=${query}`]
      ];

      GM_addStyle(`
        .gm-search-icons {
          display: flex;
          align-items: center;
          margin-left: 8px;
          gap: 8px;
        }
        .gm-search-icons img {
          width: 20px;
          height: 20px;
          transition: opacity 0.2s;
        }
        .gm-search-icons a:hover img {
          opacity: 0.8;
        }
      `);

      const container = document.createElement('div');
      container.className = 'gm-search-icons';

      container.innerHTML = engines.map(([name, domain, url]) =>
        `<a href="${url}" title="Search on ${name}">
          <img src="https://www.google.com/s2/favicons?domain=${domain}"
               alt="${name}" width="20" height="20">
        </a>`
      ).join('');

      container.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (link) {
          e.preventDefault();
          GM_openInTab(link.href, { active: true, insert: true });
        }
      });

      const targetSelectors = [
        '#hdtb-sc > div > div > div.crJ18e',
        '#appbar',
        '#hdtb',
        '#top_nav'
      ];
  
      let target;
      for (const selector of targetSelectors) {
        target = document.querySelector(selector);
        if (target) break;
      }
  
      if (target) {
        target.appendChild(container);
      }
    }
  })();