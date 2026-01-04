// ==UserScript==
// @name         Jenkins Build Status Favicon
// @namespace    https://github.com/kellyselden
// @version      6
// @description  Monitor builds using tab icons
// @author       Kelly Selden
// @license      MIT
// @source       https://github.com/kellyselden/jenkins-build-status-favicon
// @supportURL   https://github.com/kellyselden/jenkins-build-status-favicon/issues/new
// @include      http*://*jenkins*/job/*
// @downloadURL https://update.greasyfork.org/scripts/449997/Jenkins%20Build%20Status%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/449997/Jenkins%20Build%20Status%20Favicon.meta.js
// ==/UserScript==
'use strict';

const icons = {
  'In progress': '🔵',
  'Success': '🟢',
  'Failed': '🔴',
  'Unstable': '⚪️',
  'Aborted': '⚪️',
};

const statusIconClass = 'a.build-status-link';

function getFavicon() {
  return document.head.querySelector('link[rel="shortcut icon"]');
}

function replaceFavicon(favicon) {
  if (favicon) {
    favicon.href = '/favicon.ico';
  }
}

function updateFavicon(status) {
  let favicon = getFavicon();

  let statusText = status.getAttribute('tooltip');

  if (!statusText) {
    replaceFavicon(favicon);

    return;
  }

  let iconText = icons[statusText.replace(' > Console Output', '')];

  if (!iconText) {
    iconText = '❓';
  }

  // Sometimes the favicon gets stuck on the Jenkins logo,
  // even though the element is set to the status.
  // Doing this seems to jump start it into working.
  if (favicon) {
    document.head.removeChild(favicon);

    favicon = null;
  }

  if (!favicon) {
    favicon = document.createElement('link');

    favicon.rel = 'shortcut icon';

    document.head.appendChild(favicon);
  }

  let svg = document.createElement('svg');

  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  let icon = document.createElement('text');

  icon.setAttribute('font-size', '13');
  icon.setAttribute('y', '13');

  icon.textContent = iconText;

  svg.appendChild(icon);

  favicon.href = `data:image/svg+xml,${svg.outerHTML}`;
}

let container = document.querySelector('#buildHistory tbody');

if (!container) {
  return;
}

let status = container.querySelector(statusIconClass);

if (status) {
  updateFavicon(status);
}

function find(node, query) {
  if (node.matches?.(query)) {
    return node;
  } else {
    return node.querySelector?.(query);
  }
}

new MutationObserver(mutationsList => {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      for (let node of mutation.addedNodes) {
        let status = find(node, statusIconClass);

        if (status) {
          updateFavicon(status);
        }
      }

      for (let node of mutation.removedNodes) {
        let status = find(node, statusIconClass);

        if (status) {
          replaceFavicon();
        }
      }
    }
  }
}).observe(container, {
  subtree: true,
  childList: true,
});
