// ==UserScript==
// @name         Jenkins CloudBees Build Status Favicon
// @namespace    https://github.com/kellyselden
// @version      7
// @description  Monitor builds using tab icons
// @author       Kelly Selden
// @license      MIT
// @source       https://github.com/kellyselden/jenkins-cloudbees-build-status-favicon
// @supportURL   https://github.com/kellyselden/jenkins-cloudbees-build-status-favicon/issues/new
// @include      http*://*jenkins*/job/*/cloudbees-pipeline-explorer/*
// @downloadURL https://update.greasyfork.org/scripts/517241/Jenkins%20CloudBees%20Build%20Status%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/517241/Jenkins%20CloudBees%20Build%20Status%20Favicon.meta.js
// ==/UserScript==
'use strict';

const icons = {
  'in_progress': '🔵',
  'success': '🟢',
  'failure': '🔴',
  'unstable': '⚪️',
  'aborted': '⚪️',
};

const statusIconClass = 'cloudbees-log-viewer-badge';

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

  let statusText = status.getAttribute('data-value');

  if (!statusText) {
    replaceFavicon(favicon);

    return;
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

  icon.textContent = icons[statusText] ?? '❓';

  svg.appendChild(icon);

  favicon.href = `data:image/svg+xml,${svg.outerHTML}`;
}

function querySelectorShadow(selector, node = document) {
  if (node.matches?.(selector)) {
    return node;
  }

  for (let child of [node.shadowRoot, ...node.children].filter(Boolean)) {
    let found = querySelectorShadow(selector, child);
    if (found) {
      return found;
    }
  }
}

let container = document.querySelector('cloudbees-log-viewer-main');

let status = querySelectorShadow(statusIconClass, container);

updateFavicon(status);

new MutationObserver(mutationsList => {
  for (let mutation of mutationsList) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'data-value') {
      updateFavicon(status);
    }
  }
}).observe(status, {
  attributes: true,
  attributefilter: ['data-value'],
});
