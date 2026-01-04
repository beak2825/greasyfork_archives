// ==UserScript==
// @name         Bitbucket Server Blocked Pull Requests
// @namespace    https://github.com/kellyselden
// @version      6
// @description  Show which pull requests are blocked without opening them
// @author       Kelly Selden
// @license      MIT
// @source       https://github.com/kellyselden/bitbucket-server-blocked-pull-requests
// @supportURL   https://github.com/kellyselden/bitbucket-server-blocked-pull-requests/issues/new
// @include      http*://*bitbucket*/dashboard
// @include      http*://*bitbucket*/projects/*/repos/*/pull-requests*
// @downloadURL https://update.greasyfork.org/scripts/517243/Bitbucket%20Server%20Blocked%20Pull%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/517243/Bitbucket%20Server%20Blocked%20Pull%20Requests.meta.js
// ==/UserScript==
'use strict';

// The /pull-requests route is shared between list and create.
if (new URL(document.URL).searchParams.get('create') !== null) {
  return;
}

const refreshInterval = 10e3;
const blockersColumnClass = 'blockers-column';
const rowSelector = '.pull-request-row';

let rowsMap = new WeakMap();

let page = (pathname => {
  if (pathname.endsWith('/dashboard')) {
    return 'dashboard';
  } else if (pathname.endsWith('/pull-requests')) {
    return 'pull-requests';
  } else {
    throw new Error('Unexpected URL');
  }
})(document.location.pathname);

function find(node, query) {
  if (node.matches?.(query)) {
    return node;
  } else {
    return node.querySelector?.(query);
  }
}

function findUp(node, query) {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    node = node.parentNode;
  }

  return node.closest(query);
}

/**
 * @template {any[]} Args
 * @template R
 * @param {(...args: Args) => R} f
 * @param {number} ms
 */
function debounce(f, ms) {
  /** @type {number | undefined} */
  let id;

  /** @type {(...args: Args) => void} */
  function debounced(...args) {
    clearTimeout(id);

    id = setTimeout(() => {
      f.apply(this, args);
    }, ms);
  }

  return debounced;
}

async function _fetch(url) {
  let response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let data = await response.json();

  if (data.errors) {
    throw new AggregateError(data.errors, `Error fetching ${url}`);
  }

  return data;
}

async function getMergeBlockers(row) {
  let a = (() => {
    switch (page) {
      case 'dashboard': {
        return row.querySelector('.summary-column .title > a[href]');
      }
      case 'pull-requests': {
        return row.querySelector('.pull-request-title');
      }
    }
  })();

  let url = a.getAttribute('href');

  let { firstPart, project, repo, id } = url.match(/\/(?<firstPart>projects|users)\/(?<project>\w+)\/repos\/(?<repo>\S+)\/pull-requests\/(?<id>\d+)\/overview/).groups;

  if (firstPart === 'users') {
    project = `~${project}`;
  }

  let fetchUrl = `/rest/ui/latest/projects/${project}/repos/${repo}/pull-requests/${id}/merge`;

  let data = await _fetch(fetchUrl);

  return data.vetoes;
}

function createCell(row, isMerge) {
  // Sometimes a new row event will trigger for an existing row with the cell already created.
  // Bitbucket must be reusing rows instead of recreating them.
  if (page === 'dashboard' && row.querySelector(`.${blockersColumnClass}`)) {
    return;
  }

  let mergeBlockersColumn = document.createElement('td');
  mergeBlockersColumn.classList.add(blockersColumnClass);

  let div = document.createElement('div');

  if (!isMerge) {
    let icon = document.createElement('span');
    icon.style.cursor = 'default';

    icon.textContent = '⏳';

    div.appendChild(icon);
  }

  mergeBlockersColumn.appendChild(div);

  row.appendChild(mergeBlockersColumn);
}

async function appendStatus(row) {
  let mergeBlockers;

  try {
    mergeBlockers = await getMergeBlockers(row);
  } catch (err) {
    for (let error of err.errors ?? [err]) {
      console.error(error);
    }

    return;
  }

  let newMergeBlockersCount = mergeBlockers.length;

  let blockersColumn = row.querySelector(`.${blockersColumnClass}`);

  let blockersCountElement = blockersColumn.querySelector('.blockers-count');

  if (blockersCountElement) {
    let oldMergeBlockersCount = parseInt(blockersCountElement.textContent);

    if (oldMergeBlockersCount === newMergeBlockersCount) {
      return;
    }
  }

  blockersColumn.replaceChildren();

  let div = document.createElement('div');

  let icon = document.createElement('span');
  icon.style.cursor = 'default';

  icon.textContent = newMergeBlockersCount ? '⚠️' : '✅';

  if (newMergeBlockersCount) {
    div.title = mergeBlockers.map(({ detailedMessage }) => detailedMessage).join('\n');
  }

  div.appendChild(icon);

  let text = document.createElement('span');
  text.classList.add('blockers-count');

  text.textContent = newMergeBlockersCount;

  div.appendChild(text);

  blockersColumn.appendChild(div);
}

let sections = (() => {
  switch (page) {
    case 'dashboard': {
      return document.querySelectorAll(':is(.reviewing-pull-requests, .created-pull-requests) > table');
    }
    case 'pull-requests': {
      return document.querySelectorAll('.pull-request-list');
    }
  }
})();

function getAllRows() {
  return [...sections].flatMap(section => [...section.querySelectorAll('tbody > tr.pull-request-row')]);
}

async function runOnRow(row, isFirstRun) {
  let isMerge = row.querySelector('.title-and-target-branch > .aui-lozenge')?.textContent === 'Merged';

  createCell(row, isMerge);

  if (isMerge) {
    return;
  }

  await appendStatus(row);

  if (isFirstRun && page === 'dashboard') {
    let debounced = debounce(appendStatus, 300);

    let rowChangesObserver = new MutationObserver(mutationsList => {
      for (let mutation of mutationsList) {
        let pr = findUp(mutation.target, rowSelector);

        debounced(pr);
      }
    });

    rowChangesObserver.observe(row, {
      childList: true,
      attributes: true,
      subtree: true,
      characterData: true,
    });

    rowsMap.set(row, rowChangesObserver);
  }
}

let newRowsObserver = new MutationObserver(mutationsList => {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      for (let node of mutation.addedNodes) {
        let row = find(node, rowSelector);

        if (row) {
          if (page === 'pull-requests' && row.parentNode.localName === 'thead') {
            addHeader(row.parentNode);
          } else {
            runOnRow(row, true);
          }
        }
      }

      if (page === 'dashboard') {
        for (let node of mutation.removedNodes) {
          let row = find(node, rowSelector);

          if (row) {
            rowsMap.get(row).disconnect();
            rowsMap.delete(row);
          }
        }
      }
    }
  }
});

function addHeader(thead) {
  let tr = thead.querySelector('tr');

  let blockersColumn = document.createElement('th');
  blockersColumn.classList.add(blockersColumnClass);
  blockersColumn.textContent = 'Blockers';

  tr.appendChild(blockersColumn);
}

for (let section of sections) {
  addHeader(section.querySelector('thead'));

  switch (page) {
    case 'dashboard': {
      newRowsObserver.observe(section.querySelector('tbody'), {
        childList: true,
      });

      break;
    }
    case 'pull-requests': {
      newRowsObserver.observe(section, {
        subtree: true,
        childList: true,
      });

      break;
    }
  }
}

async function runOnAllRows(isFirstRun) {
  let prs = getAllRows();

  await Promise.all(prs.map(pr => runOnRow(pr, isFirstRun)));
}

(async () => {
  await runOnAllRows(true);

  if (page === 'dashboard') {
    setInterval(runOnAllRows, refreshInterval);
  }
})();
