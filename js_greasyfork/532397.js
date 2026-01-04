// ==UserScript==
// @name         🔗 文本快链
// @namespace    https://greasyfork.org/zh-CN/users/1454800
// @version      1.0.5
// @description  智能识别网页中纯文本链接并转为可点击链接
// @author       Aiccest
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532397/%F0%9F%94%97%20%E6%96%87%E6%9C%AC%E5%BF%AB%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/532397/%F0%9F%94%97%20%E6%96%87%E6%9C%AC%E5%BF%AB%E9%93%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const linkPrefixes = [
    'http://', 'https://', 'ftp://', 'thunder://', 'ed2k://',
    'magnet:', 'mailto:', 'tel:', 'sms:'
  ];
  const fileExtensions = [
    '.zip', '.rar', '.7z', '.exe', '.pdf', '.docx', '.doc', '.xlsx', '.xls',
    '.pptx', '.ppt', '.mp4', '.mp3', '.jpg', '.png', '.gif', '.txt', '.json', '.js', '.css'
  ];
  const punctuations = '，。！？、；：”“‘’（）【】《》…';
  const linkRegex = new RegExp(
    `(${linkPrefixes.map(p => p.replace(/[:\\/]/g, '\\$&')).join('|')})[^\\s<>"'${punctuations}]*`,
    'gi'
  );
  const markdownRegex = /.*?(https?:\/\/[^\s)]+)/gi;
  const ignoredTags = new Set(['A', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'BUTTON']);

  function findExtensionEnd(url) {
    const lowerUrl = url.toLowerCase();
    for (const ext of fileExtensions) {
      const idx = lowerUrl.indexOf(ext);
      if (idx !== -1) return idx + ext.length;
    }
    return -1;
  }

  function shouldExtendAfterExtension(url, extEnd) {
    const nextChar = url[extEnd];
    const afterExt = url.slice(extEnd);
    return /^[a-z]/.test(nextChar) &&
      !/^(https?|ftp|thunder|ed2k|magnet|mailto|tel|sms):\/\//i.test(afterExt);
  }

  function cleanUrlEnd(url) {
    return url.replace(/[.,!?]+$/, '');
  }

  function createLinkElement(url) {
    const a = document.createElement('a');
    a.href = url;
    a.textContent = url;
    a.style.textDecoration = 'none';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    return a;
  }

  function processTextNode(textNode) {
    if (!textNode || !textNode.parentNode || ignoredTags.has(textNode.parentNode.tagName)) return;
    if (textNode._linkified) return;

    let text = textNode.nodeValue;
    text = text.replace(markdownRegex, (_, url) => url);
    linkRegex.lastIndex = 0;
    if (!linkRegex.test(text)) return;

    const frag = document.createDocumentFragment();
    let lastIndex = 0, match;
    linkRegex.lastIndex = 0;

    while ((match = linkRegex.exec(text)) !== null) {
      const matchStart = match.index;
      const rawUrl = match[0];
      let realUrl = rawUrl;
      let overflowText = '';

      const extEnd = findExtensionEnd(rawUrl);
      if (extEnd !== -1 && extEnd < rawUrl.length) {
        if (!shouldExtendAfterExtension(rawUrl, extEnd)) {
          realUrl = rawUrl.slice(0, extEnd);
          overflowText = rawUrl.slice(extEnd);
        }
      } else {
        realUrl = cleanUrlEnd(rawUrl);
        overflowText = rawUrl.slice(realUrl.length);
      }

      if (matchStart > lastIndex) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex, matchStart)));
      }
      frag.appendChild(createLinkElement(realUrl));
      if (overflowText) frag.appendChild(document.createTextNode(overflowText));

      lastIndex = matchStart + rawUrl.length;
    }

    if (lastIndex < text.length) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textNode._linkified = true;
    textNode.parentNode.replaceChild(frag, textNode);
  }

  function walkAndProcess(root) {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.parentNode) return NodeFilter.FILTER_REJECT;
          if (ignoredTags.has(node.parentNode.tagName)) return NodeFilter.FILTER_REJECT;
          if (node._linkified) return NodeFilter.FILTER_REJECT;

          const text = node.nodeValue;
          if (!text || (!linkRegex.test(text) && !markdownRegex.test(text))) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      processTextNode(node);
    }
  }

  const pendingNodes = new Set();
  let scheduled = false;

  function scheduleProcessing() {
    if (scheduled) return;
    scheduled = true;
    requestIdleCallback(() => {
      for (const node of pendingNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          processTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          walkAndProcess(node);
        }
      }
      pendingNodes.clear();
      scheduled = false;
    });
  }

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        pendingNodes.add(node);
      }
    }
    scheduleProcessing();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  walkAndProcess(document.body);

})();