// ==UserScript==
// @name         WordPress Reader Utilities
// @namespace    https://github.com/BobbyWibowo
// @version      1.0.5
// @description  Common utilities for readers of WordPress-based sites.
// @author       Bobby Wibowo
// @license      MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wordpress.org
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531887/WordPress%20Reader%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/531887/WordPress%20Reader%20Utilities.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Helper functions

  const log = (msg, type = 'log') => console[type]('[WRU] ' + msg);

  const getElement = (selectors = []) => {
    let element;
    let index;
    for (index = 0; index < selectors.length; index++) {
      element = document.querySelector(selectors[index]);
      if (element) break;
    }
    return { element, index };
  };

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Detect WordPress

  const isWordPress = () => {
    const config = [
      {
        selector: 'meta[name="generator"]',
        test: element => /^WordPress/.test(element.getAttribute('content'))
      },
      { selector: '#footer .footer-wrap a[href*="wordpress.com"]' },
      { selector: '#footer2 a[href*="wordpress.org"]' },
      { selector: 'footer .site-info a[href*="wordpress.org"]' }
    ];
    const selectors = config.map(conf => conf.selector);
    const detect = getElement(selectors);
    if (detect.element) {
      if (typeof config[detect.index].test === 'function') { return config[detect.index].test(detect.element); }
      return true;
    }
    return false;
  };

  if (!isWordPress()) return;
  log('Current page is a WordPress-based site.');

  // Global style

  let globalStyle = `
    #wcc-dates-container { text-align: center; margin-bottom: 25px }
    #wcc-toggle-container { text-align: center; margin-bottom: 25px }
    #wcc-toggle { width: 100% }
  `;

  // Configurations

  const dateLocale = undefined; // undefined => Browser's locale
  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  };

  // Add detailed published/modified dates at the top of post.

  const getDates = () => {
    const tags = {
      'article:published_time': 'published',
      'article:modified_time': 'modified'
    };
    const results = {};
    const tagsKeys = Object.keys(tags);
    for (const key of tagsKeys) {
      const meta = document.head.querySelector('meta[property="' + key + '"]');
      if (!meta) continue;
      results[tags[key]] = new Date(meta.getAttribute('content'));
    }
    return results;
  };

  const displayDates = () => {
    const dates = getDates();
    const datesKeys = Object.keys(dates);
    if (!datesKeys.length) { return log('Current page does not have date meta tags.'); }

    const selectors = ['header.entry-header', 'h1.entry-title', 'h1.uk-article-title'];
    const title = getElement(selectors);
    if (!title.element) { return log('Current page does not have a title element.'); }

    const datesContainer = document.createElement('div');
    datesContainer.id = 'wcc-dates-container';
    datesContainer.innerHTML = '';
    title.element.insertAdjacentElement('afterend', datesContainer);
    log('Dates container appended.');

    for (const key of datesKeys) {
      const formattedDate = new Intl.DateTimeFormat(dateLocale, dateOptions).format(dates[key]);
      datesContainer.innerHTML += '<b>' + capitalizeFirstLetter(key) + ':</b> ' + formattedDate + '<br>';
    }
  };

  displayDates();

  // Add an expand/collapse button to comments container.

  const appendToggler = () => {
    const selectors = [
      '.content-comments.container',
      '.comments-area',
      '#disqus_thread',
      '#fastcomments-widget'
    ];

    const comments = getElement(selectors);
    if (!comments.element) { return log('Current page does not have a comments section.'); }

    globalStyle += selectors[comments.index] + ':not([data-expanded="1"]) { height: 0; overflow: hidden }';

    const commentHash = location.hash || '';
    const hasCommentHash = /^#comment(s|-\d+)$/.test(commentHash);
    if (hasCommentHash) {
      comments.element.dataset.expanded = '1';
      log('Comment hash detected, comments expanded.');
    }

    const toggleContainer = document.createElement('div');
    toggleContainer.id = 'wcc-toggle-container';
    comments.element.insertAdjacentElement('beforebegin', toggleContainer);
    log('Toggle container appended.');

    const toggle = document.createElement('button');
    toggle.id = 'wcc-toggle';

    const updateBtn = () => {
      toggle.innerHTML = (comments.element.dataset.expanded ? 'Collapse' : 'Expand') + ' Comments';
      return toggle.innerHTML;
    };
    updateBtn();

    toggle.addEventListener('click', () => {
      if (comments.element.dataset.expanded) delete comments.element.dataset.expanded;
      else comments.element.dataset.expanded = '1';
      updateBtn();
    });

    toggleContainer.appendChild(toggle);
    log('Toggle appended.');
  };
  appendToggler();

  // Add styling

  GM_addStyle(globalStyle);
  log('Styling added.');
})();