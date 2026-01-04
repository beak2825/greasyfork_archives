// ==UserScript==
// @name         Aistudio Redirect Bypass
// @namespace    https://greasyfork.org/
// @version      1.1
// @description  Automatically replace Google redirect URLs on AI Studio with their actual destination links.
// @author       Bui Quoc Dung
// @match        https://aistudio.google.com/*
// @grant        GM_xmlhttpRequest
// @connect      vertexaisearch.cloud.google.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545183/Aistudio%20Redirect%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/545183/Aistudio%20Redirect%20Bypass.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function resolveRedirect(googleUrl, callback) {
    let intermediateUrl;
    try {
      const urlObj = new URL(googleUrl);
      intermediateUrl = urlObj.searchParams.get('q');
    } catch (e) {
      callback(null);
      return;
    }

    if (!intermediateUrl) {
      callback(null);
      return;
    }

    GM_xmlhttpRequest({
      method: 'HEAD',
      url: intermediateUrl,
      onload: function (response) {
        if (response.finalUrl && response.finalUrl !== intermediateUrl) {
          callback(response.finalUrl.trim());
        } else {
          callback(intermediateUrl);
        }
      },
      onerror: function () {
        callback(null);
      }
    });
  }

  function fixAnchor(a) {
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('https://www.google.com/url') || a.dataset.linkFixed) {
      return;
    }
    a.dataset.linkFixed = 'processing';
    resolveRedirect(href, realLink => {
      if (realLink) {
        a.setAttribute('href', realLink);
        a.dataset.linkFixed = 'true';
      } else {
        a.dataset.linkFixed = 'failed';
      }
    });
  }

  function scanAndFixAnchors() {
    document.querySelectorAll('a.ng-star-inserted[href^="https://www.google.com/url"]:not([data-link-fixed])')
      .forEach(fixAnchor);

    document.querySelectorAll('.search-sources a[href^="https://www.google.com/url"]:not([data-link-fixed])')
      .forEach(fixAnchor);
  }

  scanAndFixAnchors();

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches?.('a[href^="https://www.google.com/url"]:not([data-link-fixed])')) {
            fixAnchor(node);
          }
          node.querySelectorAll?.('a[href^="https://www.google.com/url"]:not([data-link-fixed])')
            .forEach(fixAnchor);
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
