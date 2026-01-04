// ==UserScript==
// @license MIT
// @name         KeyNavGoogleResults
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Keyboard shortcuts for Google search: numbers (1-0) open results in background tabs (Shift for foreground tab, Alt for current tab), Left/Right arrows to navigate pages
// @author       aceitw
// @match        https://www.google.com/search*
// @match        https://google.com/search*
// @grant        GM_openInTab
// @grant        window.focus
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/524830/KeyNavGoogleResults.user.js
// @updateURL https://update.greasyfork.org/scripts/524830/KeyNavGoogleResults.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STYLES = {
    indicatorBg: '#f1f3f4',
    indicatorText: '#202124',
    indicatorSize: '20px',
    fontSize: '12px',
    borderColor: '#5f6368',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  };

  let isProcessing = false;

  function getNumberKey(e) {
    const code = e.which || e.keyCode;
    if (code >= 48 && code <= 57) return code === 48 ? 0 : code - 48;
    if (code >= 96 && code <= 105) return code - 96;
    return null;
  }

  function addNumberIndicators() {
    if (isProcessing) return;
    isProcessing = true;

    document.querySelectorAll('.search-result-indicator').forEach(el => el.remove());

    const results = Array.from(document.querySelectorAll('div.MjjYud')).filter(el =>
      el.querySelector('a > h3')
    );

    results.forEach((result, index) => {
      if (index < 10) {
        const title = result.querySelector('a > h3');
        if (title && !title.querySelector('.search-result-indicator')) {
          const indicator = document.createElement('span');
          indicator.textContent = (index + 1) % 10;
          indicator.className = 'search-result-indicator';
          indicator.style.cssText = `
            display: inline-block;
            width: ${STYLES.indicatorSize};
            height: ${STYLES.indicatorSize};
            background-color: ${STYLES.indicatorBg};
            color: ${STYLES.indicatorText};
            border: 2px solid ${STYLES.borderColor};
            border-radius: 50%;
            text-align: center;
            line-height: ${STYLES.indicatorSize};
            margin-right: 8px;
            font-size: ${STYLES.fontSize};
            font-weight: bold;
            position: absolute;
            left: -32px;
            box-shadow: ${STYLES.shadow};
          `;
          title.style.position = 'relative';
          title.prepend(indicator);
        }
      }
    });

    isProcessing = false;
  }

  function openUrl(url, { active = false, currentTab = false } = {}) {
    try {
      if (currentTab) {
        window.location.href = url;
      } else if (typeof GM_openInTab !== 'undefined') {
        GM_openInTab(url, { active });
      } else {
        window.open(url, '_blank');
        if (!active) setTimeout(() => window.focus(), 0);
      }
    } catch (err) {
      console.error('openUrl error:', err);
    }
  }

  function updatePageIndicator() {
    let indicator = document.getElementById('google-results-page-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'google-results-page-indicator';
      indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
        background: ${STYLES.indicatorBg};
        padding: 4px 12px;
        border-radius: 12px;
        font-size: ${STYLES.fontSize};
        font-weight: bold;
        color: ${STYLES.indicatorText};
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      `;
      document.body.appendChild(indicator);
    }
    const start = new URLSearchParams(location.search).get('start') || '0';
    const currentPage = Math.floor(parseInt(start, 10) / 10) + 1;
    indicator.textContent = `Page ${currentPage}`;
  }

  function navigatePage(direction) {
    const next = document.querySelector('#pnnext');
    const prev = document.querySelector('#pnprev');
    if (direction === 'next' && next) next.click();
    if (direction === 'previous' && prev) prev.click();
    setTimeout(updatePageIndicator, 200);
  }

  function handleKeyPress(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const numberKey = getNumberKey(e);
    if (numberKey !== null && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const results = Array.from(document.querySelectorAll('div.MjjYud')).filter(el =>
        el.querySelector('a > h3')
      );
      const keyNum = numberKey === 0 ? 9 : numberKey - 1;
      const result = results[keyNum];
      if (result) {
        const link = result.querySelector('a');
        if (link && link.href) {
          openUrl(link.href, {
            active: e.shiftKey,
            currentTab: e.altKey,
          });
        }
      }
      return;
    }

    if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
      e.preventDefault();
      navigatePage(e.code === 'ArrowRight' ? 'next' : 'previous');
    }
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function init() {
    addNumberIndicators();
    updatePageIndicator();
    document.addEventListener('keydown', handleKeyPress);

    const observer = new MutationObserver(() => {
      debounce(addNumberIndicators, 250)();
    });

    const container = document.querySelector('#search');
    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
