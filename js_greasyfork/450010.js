// ==UserScript==
// @name         Bitbucket Server Pull Request Favicon
// @namespace    https://github.com/kellyselden
// @version      9
// @description  Monitor builds using tab icons
// @author       Kelly Selden
// @license      MIT
// @source       https://github.com/kellyselden/bitbucket-server-pull-request-favicon
// @supportURL   https://github.com/kellyselden/bitbucket-server-pull-request-favicon/issues/new
// @include      http*://*bitbucket*/projects/*/repos/*/pull-requests/*/*
// @downloadURL https://update.greasyfork.org/scripts/450010/Bitbucket%20Server%20Pull%20Request%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/450010/Bitbucket%20Server%20Pull%20Request%20Favicon.meta.js
// ==/UserScript==
'use strict';

const icons = {
  'build-in-progress-icon': '🔵',
  'build-successful-icon': '🟢',
  'build-failed-icon': '🔴',
};

const statusIconClass = '[data-testid="pull-request-builds-summary"] .build-status-icon';
const vetoesCountClass = '.veto-count';

function getFavicon() {
  return document.head.querySelector('link[rel="shortcut icon"]');
}

function updateFavicon() {
  let favicon = getFavicon();

  let iconText;

  if (statusIcon) {
    for (let [_class, icon] of Object.entries(icons)) {
      if (statusIcon.classList.contains(_class)) {
        iconText = icon;

        break;
      }
    }

    if (!iconText) {
      iconText = '❓';
    }
  } else {
    iconText = '⚪️';
  }

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

  let number = document.createElement('text');

  number.setAttribute('x', '4.5');
  number.setAttribute('y', '13');
  number.setAttribute('font-size', '13');
  number.setAttribute('font-family', 'Helvetica');
  number.setAttribute('font-weight', 'bold');

  number.textContent = vetoesCount.textContent;

  svg.appendChild(icon);
  svg.appendChild(number);

  favicon.href = `data:image/svg+xml,${svg.outerHTML}`;
}

let tabContainer = document.querySelector('.pull-request-tabs [role="tabpanel"]');

let statusIcon = tabContainer.querySelector(statusIconClass);

let vetoesCountContainer = document.querySelector('.merge-button-container');

let vetoesCount = vetoesCountContainer.querySelector(vetoesCountClass);

updateFavicon();

function find(node, query) {
  if (node.matches?.(query)) {
    return node;
  } else {
    return node.querySelector?.(query);
  }
}

let statusIconClassObserver;

new MutationObserver(mutationsList => {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      for (let node of mutation.removedNodes) {
        let _statusIcon = find(node, statusIconClass);

        if (_statusIcon) {
          statusIcon = null;

          statusIconClassObserver.disconnect();
          statusIconClassObserver = null;

          updateFavicon();
        }
      }
    }
  }

  if (statusIconClassObserver) {
    return;
  }

  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      for (let node of mutation.addedNodes) {
        let _statusIcon = find(node, statusIconClass);

        if (_statusIcon) {
          statusIcon = _statusIcon;

          updateFavicon();

          statusIconClassObserver = new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
              if (mutation.type === 'childList') {
                let _statusIcon = find(node, statusIconClass);

                if (_statusIcon) {
                  statusIcon = _statusIcon;

                  updateFavicon();
                }
              }
            }
          });

          statusIconClassObserver.observe(statusIcon.closest('.summary-panel'), {
            subtree: true,
            childList: true,
          });
        }
      }
    }
  }
}).observe(tabContainer, {
  childList: true,
  subtree: true,
});

new MutationObserver(mutationsList => {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      for (let node of mutation.addedNodes) {
        let _vetoesCount = find(node, vetoesCountClass);

        if (_vetoesCount) {
          vetoesCount = _vetoesCount;

          updateFavicon();
        }
      }
    }
  }
}).observe(vetoesCountContainer, {
  childList: true,
  subtree: true,
});
