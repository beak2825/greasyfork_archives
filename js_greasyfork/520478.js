// ==UserScript==
// @name         MGoBlog Dark Mode
// @namespace    Violentmonkey Scripts
// @version      1.1.0
// @description  Makes MGoBlog website dark.
// @author       Jerry Haagsma
// @match        *://mgoblog.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mgoblog.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520478/MGoBlog%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/520478/MGoBlog%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const DARK_COLOR = '#00162a';
  const MEDIUM_COLOR = '#989c97';
  const LIGHT_COLOR = '#fafafa';

  const highContrastSelectors = [
    // Body (visible when scrolling down to refresh)
    'body',

    '.page-content',

    // Post content wrapper
    '#block-mgoblog-content .content',
    '.content',

    // Comments section
    '.pager .pager__items',
    '.view-content',
    '.thread-wrapper',
    '#comments > .view-content',

    // Comments text field
    'div.ck > .ck-editor__main > .ck-editor__editable',

    // Homepage feed article
    '.view-primary-articles .views-row',
    '.view-secondary-articles .views-row',

    '.content-wrapper',
    '.block',

    // Search input
    'input.form-search',

    // Tables
    'tr',
    'tr:nth-child(2n)',
    'tr td',

    // Comments heading
    '.comments-filter h1',

    // Comments user data
    '.comment__footer > .comment__user-data',
  ];

  const getHighContrastCssForSelector = (selector) => `${selector} {
    background-color: ${DARK_COLOR};
    color: ${LIGHT_COLOR};
  }`;

  const mediumTextSelectors = [
    // MGoBoard side bar replies count
    '.views-row > .views-field-comment-count',

    // Homepage article author name
    '.view-primary-articles .views-row .views-field-byline a',
    '.view-secondary-articles .views-row .views-field-byline a',

    // Diaries author name
    '.sidebar .view .views-field-uid a',
  ];

  const getMediumTextCssForSelector = (selector) => `${selector} {
    color: ${MEDIUM_COLOR};
  }`;

  const removePageBackgroundImage = `
    .page-content {
      background-size: 0;
    }
  `;

  const enableLogoHeader = `
    #block-frontpagelogoheader > .content {
      background-color: transparent;
    }
  `;

  const css = `
    ${highContrastSelectors.map(getHighContrastCssForSelector).join('\n\n')}

    ${mediumTextSelectors.map(getMediumTextCssForSelector).join('\n\n')}

    a {
      color: ${LIGHT_COLOR};
    }

    ${removePageBackgroundImage}

    ${enableLogoHeader}
  `;

  document
    .head
    .insertAdjacentHTML('beforeend', `<style>${css}</style>`);
})();