// ==UserScript==
// @name         DOI to Google Scholar
// @namespace    https://violentmonkey.github.io/
// @version      1.6
// @description  Converts DOI links and plain text DOIs directly to Google Scholar links
// @author       Bui Quoc Dung
// @match        *://*/*
// @exclude      *://scholar.google.com/*
// @license      AGPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533440/DOI%20to%20Google%20Scholar.user.js
// @updateURL https://update.greasyfork.org/scripts/533440/DOI%20to%20Google%20Scholar.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SCHOLAR_URL = 'https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=';
  const DOI_REGEX = /(?:\b|^|\s)(10\.\d{4,}\/[^\s"'<>\]}]+)/gi;

  /**
   * Chuyển một DOI (URL hoặc plain text) thành link Google Scholar
   */
  function convertDOIToScholarURL(doi) {
    const cleanDOI = doi.replace(/[.,;:]$/, '');
    const doiPart = cleanDOI.startsWith('http') ?
      cleanDOI.split('doi.org/')[1] || cleanDOI :
      cleanDOI;
    return `${SCHOLAR_URL}${encodeURIComponent(doiPart)}`;
  }

  /**
   * Xử lý các liên kết DOI, thêm sự kiện click để mở trên Google Scholar trong tab mới
   */
  function handleDOILinks() {
    const doiLinkSelectors = [
      'a[href*="doi.org/"]',
      'a[href*="dx.doi.org/"]'
    ].join(',');

    document.querySelectorAll(doiLinkSelectors).forEach(link => {
      if (!link.dataset.scholarProcessed) {
        link.dataset.scholarProcessed = 'true';
        link.addEventListener('click', e => {
          e.preventDefault();
          window.open(convertDOIToScholarURL(link.href), '_blank');
        });
      }
    });
  }

  /**
   * Tìm DOI trong text node và chuyển thành liên kết Google Scholar (mở tab mới)
   */
  function convertPlainTextDOIsToLinks() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const nodesToProcess = [];
    const safeTestRegex = /(?:\b|^|\s)(10\.\d{4,}\/[^\s"'<>\]}]+)/i;

    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (safeTestRegex.test(node.textContent)) {
        nodesToProcess.push(node);
      }
    }

    nodesToProcess.forEach(node => {
      const fragment = document.createDocumentFragment();
      const text = node.textContent;
      let lastIndex = 0;

      let match;
      DOI_REGEX.lastIndex = 0;
      while ((match = DOI_REGEX.exec(text)) !== null) {
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
        }

        const link = document.createElement('a');
        link.href = convertDOIToScholarURL(match[1]);
        link.target = '_blank'; // mở trong tab mới
        link.textContent = match[1];
        link.style.color = '#1a0dab';
        link.style.textDecoration = 'underline';
        fragment.appendChild(link);

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      }

      node.replaceWith(fragment);
    });
  }

  /**
   * Debounce để tránh xử lý quá nhiều khi DOM thay đổi liên tục
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Xử lý cả liên kết và text chứa DOI
   */
  function processDOIs() {
    handleDOILinks();
    convertPlainTextDOIsToLinks();
  }

  /**
   * Theo dõi các thay đổi động trên trang
   */
  function observeDynamicChanges() {
    const debouncedProcess = debounce(processDOIs, 250);
    const observer = new MutationObserver(debouncedProcess);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Khởi chạy script
   */
  function init() {
    processDOIs();
    observeDynamicChanges();
  }

  init();
})();
