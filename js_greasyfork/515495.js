// ==UserScript==
// @name          TorrentBD: FAQClipper - Copy FAQs as BBCode
// @namespace     eLibrarian-userscripts
// @description   Quickly copy FAQs with titles and embedded links as BBCode for seamless sharing on forums, shoutboxes, and more!
// @version       0.1
// @author        eLibrarian
// @license       GPL-3.0-or-later
// @match         https://*.torrentbd.net/*
// @match         https://*.torrentbd.com/*
// @match         https://*.torrentbd.org/*
// @match         https://*.torrentbd.me/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/515495/TorrentBD%3A%20FAQClipper%20-%20Copy%20FAQs%20as%20BBCode.user.js
// @updateURL https://update.greasyfork.org/scripts/515495/TorrentBD%3A%20FAQClipper%20-%20Copy%20FAQs%20as%20BBCode.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function applyStyles(element, styles) {
    Object.entries(styles).forEach(([property, value]) => {
      element.style[property] = value;
    });
  }

  function injectStyles() {
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);

    const styleSheet = styleElement.sheet;
    const styles = [
      `.copy-button-icon {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        font-size: 12px;
        color: #B0BEC5;
        vertical-align: middle;
        margin-right: 5px;
      }`,
      `.copy-button-icon:hover {
        color: #78909C;
      }`,
      `.copy-button-icon-right {
        float: right;
        margin-left: auto;
        margin-right: 5px;
      }`,
      `.toast-notification {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #333;
        color: #fff;
        padding: 15px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
        z-index: 1000;
      }`
    ];
    styles.forEach(rule => styleSheet.insertRule(rule));
  }

  function addCopyButtons(faqHeader) {
    faqHeader.querySelectorAll('.copy-button-icon').forEach(btn => btn.remove());

    const faqTitle = faqHeader.childNodes[0].textContent.trim().replace(/\s*\(Updated|New\)$/, '').trim();
    const faqLink = faqHeader.parentElement.querySelector('.collapsible-body .right a[href*="faq.php"]');

    if (!faqLink) return;

    createCopyButtons(faqHeader, faqTitle, faqLink.href);
  }

  function createCopyButtons(faqHeader, faqTitle, link) {
    const buttons = [
      { isRightAligned: false, label: '' },
      { isRightAligned: true, label: window.location.href.includes('lang=bn') ? 'EN' : 'BN' }
    ];

    buttons.forEach(({ isRightAligned, label }) => {
      const buttonElement = document.createElement('div');
      buttonElement.classList.add('copy-button-icon');
      if (isRightAligned) buttonElement.classList.add('copy-button-icon-right');

      const iconElement = document.createElement('i');
      iconElement.classList.add('material-icons');
      iconElement.textContent = 'content_copy';
      applyStyles(iconElement, {
        fontSize: '20px',
        color: '#B0BEC5',
        verticalAlign: 'middle',
      });

      const labelText = document.createTextNode(` ${label}`);

      buttonElement.appendChild(iconElement);
      buttonElement.appendChild(labelText);
      buttonElement.addEventListener('click', (event) => handleCopy(event, faqTitle, link, isRightAligned));

      isRightAligned ? faqHeader.append(buttonElement) : faqHeader.prepend(buttonElement);
    });
  }

  async function handleCopy(event, faqTitle, faqLink, isRightAligned) {
    event.stopPropagation();
    let linkToCopy = faqLink;

    if (isRightAligned) {
      linkToCopy = faqLink.replace(/lang=(en|bn)/, (match, lang) => (lang === 'en' ? 'lang=bn' : 'lang=en'));

      try {
        const response = await fetch(linkToCopy);
        const documentParser = new DOMParser();
        const parsedDocument = documentParser.parseFromString(await response.text(), 'text/html');
        const titleElement = parsedDocument.querySelector('#middle-block h4.spidq');
        faqTitle = titleElement ? titleElement.textContent.trim() : faqTitle;
      } catch {
        showToast('Failed to copy. Please try again.');
        return;
      }
    }

    copyToClipboard(`[url=${linkToCopy}]${faqTitle}[/url]`);
    showToast(`Copied: ${faqTitle}`);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() => showToast('Failed to copy. Please try again.'));
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast-notification');
    toast.textContent = message;

    applyStyles(toast, {
      opacity: '0',
    });

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
    }, 100);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 3000);
  }

  function initializeScript() {
    injectStyles();
    document.querySelectorAll('.collapsible-header.faqq').forEach(addCopyButtons);
    observeDynamicContainer();
  }

  function observeDynamicContainer() {
    const dynamicContainer = document.querySelector('.th-class-container-dyanmic');
    if (!dynamicContainer) return;

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.matches('li')) {
              const faqHeader = node.querySelector('.collapsible-header.faqq');
              if (faqHeader) {
                addCopyButtons(faqHeader);
              }
            }
          });
        }
      }
    });

    observer.observe(dynamicContainer, { childList: true, subtree: true });
  }

  window.addEventListener('load', initializeScript);
})();