// ==UserScript==
// @name         Colorful Public/Private Labels for GitHub
// @namespace    https://foooomio.net/
// @version      0.3
// @description  Adds color to Public/Private labels of repositories on GitHub
// @author       foooomio
// @license      MIT License
// @match        https://github.com/*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @downloadURL https://update.greasyfork.org/scripts/432153/Colorful%20PublicPrivate%20Labels%20for%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/432153/Colorful%20PublicPrivate%20Labels%20for%20GitHub.meta.js
// ==/UserScript==

(() => {
  /* global GM_config */
  'use strict';

  function addStyle() {
    GM_addStyle(`
      .public:not(.archived) .Label {
        display: var(--colorful-labels-display-public-labels, none);
        color: var(--colorful-labels-public-text);
        border-color: var(--colorful-labels-public-border);
      }
      .private:not(.archived) .Label {
        color: var(--colorful-labels-private-text);
        border-color: var(--colorful-labels-private-border);
      }
      .public.archived .Label {
        color: var(--colorful-labels-public-archived-text);
        border-color: var(--colorful-labels-public-archived-border);
      }
      .private.archived .Label {
        color: var(--colorful-labels-private-archived-text);
        border-color: var(--colorful-labels-private-archived-border);
      }
    `);
  }

  function setCSSVar() {
    const { display_public_labels, ...settings } = GM_config.get();

    document.documentElement.style.setProperty(
      '--colorful-labels-display-public-labels',
      display_public_labels ? 'inline-block' : 'none'
    );

    for (const [key, value] of Object.entries(settings)) {
      const prop = '--colorful-labels-' + key.replaceAll('_', '-');
      document.documentElement.style.setProperty(prop, value);
    }
  }

  function setupConfig() {
    GM_config.init('Colorful Public/Private Labels settings', {
      public_text: {
        label: 'Text of public repository',
        type: 'text',
        default: 'var(--color-scale-green-5)',
      },
      public_border: {
        label: 'Border of public repository',
        type: 'text',
        default: 'var(--color-scale-green-4)',
      },
      private_text: {
        label: 'Text of private repository',
        type: 'text',
        default: 'var(--color-scale-yellow-5)',
      },
      private_border: {
        label: 'Border of private repository',
        type: 'text',
        default: 'var(--color-scale-yellow-4)',
      },
      public_archived_text: {
        label: 'Text of public archived repository',
        type: 'text',
        default: 'var(--color-scale-purple-5)',
      },
      public_archived_border: {
        label: 'Border of public archived repository',
        type: 'text',
        default: 'var(--color-scale-purple-4)',
      },
      private_archived_text: {
        label: 'Text of private archived repository',
        type: 'text',
        default: 'var(--color-scale-orange-5)',
      },
      private_archived_border: {
        label: 'Border of private archived repository',
        type: 'text',
        default: 'var(--color-scale-orange-4)',
      },
      display_public_labels: {
        label: 'Display the label of public repository',
        type: 'checkbox',
        default: true,
      },
    });

    GM_registerMenuCommand('Settings...', GM_config.open);

    GM_config.onload = () => {
      setCSSVar();
    };
  }

  function setupRepoPage() {
    const header = document.getElementById('repository-container-header');
    if (!header) return;

    const label = header.querySelector('h1 .Label');
    if (!label) return;

    const text = label.textContent.trim();
    header.className += ' ' + text.toLowerCase().replace('archive', 'archived');
  }

  document.addEventListener('pjax:end', setupRepoPage);

  setupRepoPage();
  setupConfig();
  setCSSVar();
  addStyle();
})();
