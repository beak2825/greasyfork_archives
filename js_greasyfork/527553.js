// ==UserScript==
// @name         Youtube Middle Click Search (Updated)
// @namespace    https://greasyfork.org/users/649
// @version      3.0
// @description  Middle clicking the YouTube search or suggestions opens results in a new tab
// @author       flowscript
// @match        *://www.youtube.com/*
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527553/Youtube%20Middle%20Click%20Search%20%28Updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527553/Youtube%20Middle%20Click%20Search%20%28Updated%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const SEL_SEARCH_BTN = '.ytSearchboxComponentSearchButton';
  const SEL_SUGGESTION = '.ytSuggestionComponentSuggestion';
  const SEL_CLEAR_BTN  = '.ytSearchboxComponentClearButton';
  const SEL_INPUT      = 'input.ytSearchboxComponentInput';

  // Convert user’s query into something like "foo+bar"
  function encodeURIWithPlus(str) {
    return encodeURIComponent(str).replace(/%20/g, '+');
  }

  function isSearchButton(el) {
    return el.closest?.(SEL_SEARCH_BTN);
  }

  function getSuggestionEl(el) {
    return el.closest?.(SEL_SUGGESTION);
  }

  function isClearButton(el) {
    return el.closest?.(SEL_CLEAR_BTN);
  }

  function getSearchInputValue() {
    const input = document.querySelector(SEL_INPUT);
    return input?.value.trim() || '';
  }

  function getSuggestionText(suggestionEl) {
    const textEl = suggestionEl.querySelector('.ytSuggestionComponentLeftContainer span');
    return textEl?.textContent.trim() || '';
  }

  // Open query in new tab
  function openInNewTab(query) {
    if (!query) return;
    const url = `${location.origin}/results?search_query=${encodeURIWithPlus(query)}`;
    GM_openInTab(url, true);
  }

  // Open query in current tab
  function openInSameTab(query) {
    if (!query) return;
    const url = `${location.origin}/results?search_query=${encodeURIWithPlus(query)}`;
    window.location.href = url;
  }

  /**
   * 1) Intercept mousedown on button=1 (middle-click),
   *    open results in new tab immediately, then block normal click.
   */
  document.addEventListener(
    'mousedown',
    (e) => {
      if (e.button !== 1) return; // only middle-click
      const target = e.target;

      // If it’s the main search button
      if (isSearchButton(target)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openInNewTab(getSearchInputValue());
        return;
      }

      // If it’s a suggestion
      const suggestionEl = getSuggestionEl(target);
      if (suggestionEl && !isClearButton(target)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openInNewTab(getSuggestionText(suggestionEl));
      }
    },
    true
  );

  /**
   * 2) Intercept normal left-click (button=0),
   *    open results in same tab, block YouTube’s single-page script.
   */
  document.addEventListener(
    'click',
    (e) => {
      if (e.button !== 0) return; // only left-click
      const target = e.target;

      // If it’s the main search button
      if (isSearchButton(target)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openInSameTab(getSearchInputValue());
        return;
      }

      // If it’s a suggestion
      const suggestionEl = getSuggestionEl(target);
      if (suggestionEl && !isClearButton(target)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openInSameTab(getSuggestionText(suggestionEl));
      }
    },
    true
  );
})();
