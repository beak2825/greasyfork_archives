// ==UserScript==
// @name         GitHub - Add Path Search
// @namespace    http://splintor.wordpress.com/
// @version      0.2
// @description  Enable easy searching in a specific path
// @author       splintor@gmail.com
// @updateUrl    https://gist.github.com/splintor/8d3f12b86962efe5dcacb28ca15aa87d/raw
// @match        https://github.com/*
// @downloadURL https://update.greasyfork.org/scripts/390001/GitHub%20-%20Add%20Path%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/390001/GitHub%20-%20Add%20Path%20Search.meta.js
// ==/UserScript==

'use strict';

const GITHUB_BASE = 'https://github.com';
const SEARCH_ENDPOINT = 'search';

function urlGenerator(urlParts, searchCriteria) {
  const { org, path, repo } = urlParts;
  if (!org) {
    return {
      base: `${GITHUB_BASE}/${SEARCH_ENDPOINT}`,
      query: { q: searchCriteria },
    };
  }

  if (!repo) {
    return {
      base: `${GITHUB_BASE}/${SEARCH_ENDPOINT}`,
      query: {
        q: `${searchCriteria} org:${org}`,
        type: `Code`
      }
    };
  }

  const query = searchCriteria + (path ? ` path:${path}` : '');
  return {
    base: `${GITHUB_BASE}/${org}/${repo}/${SEARCH_ENDPOINT}`,
    query: { q: query }
  };
}

function parseUrl(url) {
  const regex = /https:\/\/github\.com\/([\w-]*)\/?([\w-\.]*)?(?:\/(tree|blob)\/\w*\/)?(.*)?/;
  const match = regex.exec(url) || [];
  const path = match[3] === 'blob' ? match[4].split('/').slice(0, -1).join('/') : match[4];
  return {
    org: match[1] || null,
    repo: match[2] || null,
    path: path && !path.startsWith('/search?') ? path : null,
  };
}

function combineQueryParams(params) {
  return '?' + Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
}

(function buildElement() {
  const container = document.getElementById('jump-to-results');
  if (!container) {
    setTimeout(buildElement, 100);
    return;
  }

  new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type == "childList") {
        const searchScoped = Array.from(mutation.addedNodes).find(n => n.id === 'jump-to-suggestion-search-scoped');
        if (searchScoped) {
          const existing = document.getElementById('jump-to-suggestion-search-path');
          if (existing) {
            existing.remove();
          }

          const urlParts = parseUrl(location.href);
          if (!urlParts.path) {
            return;
          }

          const element = searchScoped.cloneNode(true);
          element.classList.remove('js-jump-to-scoped-search', 'navigation-focus');
          element.classList.add('js-jump-to-path-search');
          element.setAttribute('aria-selected', 'false');
          element.id = 'jump-to-suggestion-search-path';
          const searchString = document.getElementsByName('q')[0].value;
          const { base, query } = urlGenerator(urlParts, searchString);
          const a = element.querySelector('a');
          const url = base + combineQueryParams(query);
          a.setAttribute('href', url);
          a.addEventListener('click', event => { // we need this because the search input form somehow overrides clicks and uses its action
            event.preventDefault();
            window.location.href = url;
          });
          const badge = element.querySelector('.js-jump-to-badge-search-text-default');
          const text = 'in ' + urlParts.path;
          badge.innerText = text;
          badge.setAttribute('aria-label', 'text');
          searchScoped.after(element);
        }
      }
    });
  }).observe(container, { childList: true });
})();
