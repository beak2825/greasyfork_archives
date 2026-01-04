// ==UserScript==
// @name         Absolute Date for GitHub
// @namespace    https://foooomio.net/
// @version      0.6
// @description  Changes relative dates to absolute dates on GitHub
// @author       foooomio
// @license      MIT License
// @match        https://*.github.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js
// @require      https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @downloadURL https://update.greasyfork.org/scripts/426138/Absolute%20Date%20for%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/426138/Absolute%20Date%20for%20GitHub.meta.js
// ==/UserScript==

(() => {
  /* global dayjs, GM_config */
  'use strict';

  const formatDate = (date) => dayjs(date).format(GM_config.get('format'));

  function overrideMethod() {
    unsafeWindow.customElements.define = new Proxy(unsafeWindow.customElements.define, {
      apply: function (target, thisArg, argumentsList) {
        const [name, constructor] = argumentsList;
        if (name === 'relative-time') {
          constructor.prototype.update = function () {
            this.shadowRoot.textContent = this.textContent = formatDate(this.date);
          };
        }
        return Reflect.apply(target, thisArg, argumentsList);
      },
    });
  }

  function updateFormat() {
    const elements = document.querySelectorAll('relative-time');
    elements.forEach((element) => element.connectedCallback());
  }

  function addInitialStyle() {
    GM_addStyle(`
      [aria-labelledby="files"] [style="width:100px;"] {
        width: unset !important;
      }
      [aria-labelledby="folders-and-files"] thead th:last-of-type {
        width: 160px;
      }
      [aria-labelledby$="files"] relative-time {
        font-variant-numeric: var(--absolute-date-aligned);
      }
      relative-time::before {
        content: var(--absolute-date-preposition);
      }
      [aria-labelledby$="files"] relative-time::before {
        content: unset
      }
    `);
  }

  function setDatesAligned() {
    if (GM_config.get('aligned')) {
      document.documentElement.style.setProperty('--absolute-date-aligned', 'tabular-nums');
    } else {
      document.documentElement.style.removeProperty('--absolute-date-aligned');
    }
  }

  function setPreposition() {
    const preposition = GM_config.get('preposition');
    if (preposition) {
      document.documentElement.style.setProperty('--absolute-date-preposition', `"${preposition} "`);
    } else {
      document.documentElement.style.removeProperty('--absolute-date-preposition');
    }
  }

  function setupConfig() {
    GM_config.init('Absolute Date for GitHub settings', {
      preposition: {
        label: 'Word to add before dates (except in file lists of repositories)',
        type: 'text',
        default: 'at',
      },
      format: {
        label: 'Date format (See https://day.js.org/docs/en/display/format)',
        type: 'text',
        default: 'YYYY/MM/DD HH:mm',
      },
      aligned: {
        label: 'Align dates in file lists of repositories',
        type: 'checkbox',
        default: true,
      },
    });

    GM_registerMenuCommand('Settings...', GM_config.open);

    GM_config.onload = () => {
      setDatesAligned();
      setPreposition();
      updateFormat();
    };
  }

  setupConfig();
  overrideMethod();

  addInitialStyle();

  setDatesAligned();
  setPreposition();

  document.addEventListener('turbo:render', () => {
    setDatesAligned();
    setPreposition();
  });
})();
