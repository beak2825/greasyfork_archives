// ==UserScript==
// @name         GHA workflow_dispatch
// @namespace    https://gist.github.com/rehangit/58409fc3cca4ec7630487ac13a055b27
// @version      0.1.6
// @description  Add missing info in workflow_dispatch actions
// @author       Rehan Ahmad
// @match        https://github.com/*/*/actions
// @match        https://github.com/*/*/actions/*
// @grant        none
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDdmZmYiPjxjaXJjbGUgY3g9Ijk5LjUiIGN5PSI5OS41IiBzdHJva2Utd2lkdGg9IjE1IiByPSI1MCIvPjxwYXRoIGQ9Ik04NyAxMjJsMzUtMjIuNUw4NyA3N3oiIHN0cm9rZS13aWR0aD0iOCIvPjxwYXRoIGQ9Ik05OS41IDE1MmMwIDIyLjUgMCAyMi41IDk1IDIyLjAxbS05NS0xOS41MWMwIDkyLjcgMCA5Mi43IDY1IDk1IiBzdHJva2Utd2lkdGg9IjE1Ii8+PGNpcmNsZSBjeD0iMjE5LjUiIGN5PSIyNDkuNSIgc3Ryb2tlLXdpZHRoPSIxMCIgcj0iMjUiLz48cGF0aCBkPSJNMjA3IDI0OS41aDdtMTEgMGg3IiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZS1kYXNoYXJyYXk9IjQwIDQ4Ii8+PGNpcmNsZSBjeD0iMjE5LjUiIGN5PSIxNzQuNSIgc3Ryb2tlLXdpZHRoPSIxMCIgcj0iMjUiLz48cGF0aCBkPSJNMjA4LjUgMTc3LjgzbDYuNjcgNi42NyAxMy4zMy0yMCIgc3Ryb2tlLXdpZHRoPSI4Ii8+PC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/435742/GHA%20workflow_dispatch.user.js
// @updateURL https://update.greasyfork.org/scripts/435742/GHA%20workflow_dispatch.meta.js
// ==/UserScript==

// Use with extension: Tampermonkey or ViolentMonkey
// Easier install from: https://greasyfork.org/en/scripts/435742-gha-workflow-dispatch

let GITHUB_TOKEN = localStorage.getItem('GITHUB_TOKEN');
if (!GITHUB_TOKEN) {
  GITHUB_TOKEN = prompt(
    "Please enter your Github token with 'repo' and 'workflow' access\n(Generate at https://github.com/settings/tokens)"
  );
  localStorage.setItem('GITHUB_TOKEN', GITHUB_TOKEN);
}

const headers = { headers: { Authorization: `token ${GITHUB_TOKEN}` } };

const ghCacheStored = localStorage.getItem('GITHUB_API_CACHE');
const ghCache = (ghCacheStored && JSON.parse(ghCacheStored)) || {};
const getGH = async url => {
  if (!ghCache[url]) {
    ghCache[url] = await fetch(url, headers).then(res => res.json());
    localStorage.setItem('GITHUB_API_CACHE', JSON.stringify(ghCache));
  }
  return ghCache[url];
};

const render = event => {
  console.log('render fired', event);
  setTimeout(() => {
    document
      .querySelectorAll('.Box-row.js-socket-channel.js-updatable-content')
      .forEach(async node => {
        const middle = node.querySelector('.d-table-cell + .d-none');
        if (middle.innerText.trim() === '') {
          const link = node.querySelector('.Link--primary');
          const url = link.href.replace(
            '//github.com',
            '//api.github.com/repos'
          );
          const res = await getGH(url, headers);

          const branch = res.head_branch;
          const href = [res.repository.html_url, 'tree', branch].join('/');

          const sha = res.head_sha.slice(0, 7);
          const href_sha = [
            res.repository.html_url,
            'commit',
            res.head_sha,
          ].join('/');

          middle.innerHTML = `
            <div class="d-inline-block branch-name css-truncate css-truncate-target" style="max-width: 200px;">
              <a href="${href}" target="_blank">${branch}</a>
            </div> 
            <div style="padding: 2px 6px">
              <a class="d-block text-small color-fg-muted" href="${href_sha}" target="_blank">#${sha}</a>
            </div>
          `;
        }
      });
  }, 2000);
};

(() => {
  render();
  document.addEventListener('load', render);
  document.addEventListener('visibilitychange', render);
  document.addEventListener('readystatechange', render);
  window.addEventListener('hashchange', render);

  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      render('mutation-observer');
    }
  }).observe(document, { subtree: true, childList: true });
})();