// ==UserScript==
// @name         Remove capture attribute (with iframe support)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes the 'capture' attribute from <input> elements inside the main document and all same-origin iframes, with notification toast.
// @author       You
// @match        *://*.jzetech.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533971/Remove%20capture%20attribute%20%28with%20iframe%20support%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533971/Remove%20capture%20attribute%20%28with%20iframe%20support%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * Displays a floating toast-style notification.
   * @param {string} message
   */
  function showNotification(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#4CAF50',
      color: '#fff',
      padding: '10px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: 9999,
      opacity: 0,
      transition: 'opacity 0.5s',
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = 1;
    });

    setTimeout(() => {
      toast.style.opacity = 0;
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  /**
   * Removes 'capture' attribute from all input elements within a document.
   * @param {Document} doc - The document (main or iframe) to process
   * @returns {number} - Count of removed attributes
   */
  function processDocument(doc) {
    let removedCount = 0;
    const inputsWithCapture = doc.querySelectorAll('input[capture]');
    inputsWithCapture.forEach(input => {
      console.log('Removed capture attribute from:', input);
      input.removeAttribute('capture');
      removedCount++;
    });
    return removedCount;
  }

  /**
   * Processes the main document and all same-origin iframes.
   */
  function removeAllCaptureAttributes() {
    let totalRemoved = processDocument(document);

    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      try {
        const iframeDoc = iframe.contentDocument;
        if (iframeDoc) {
          totalRemoved += processDocument(iframeDoc);
        }
      } catch (e) {
        console.warn('⚠️ Cannot access iframe due to cross-origin restrictions:', iframe.src);
      }
    });

    if (totalRemoved > 0) {
      showNotification(`🎉 Removed 'capture' from ${totalRemoved} input(s)`);
    }
  }

  // Run on page load
  removeAllCaptureAttributes();

  // Observe the main document and iframes for DOM changes
  const observer = new MutationObserver(removeAllCaptureAttributes);
  observer.observe(document.body, { childList: true, subtree: true });

  // Also attach observers for any iframes that load later
  const iframeObserver = new MutationObserver(() => {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      try {
        const iframeDoc = iframe.contentDocument;
        if (iframeDoc) {
          const innerObserver = new MutationObserver(removeAllCaptureAttributes);
          innerObserver.observe(iframeDoc, { childList: true, subtree: true });
        }
      } catch (e) {
        // Ignore cross-origin iframes
      }
    });
  });

  iframeObserver.observe(document.body, { childList: true, subtree: true });
})();
