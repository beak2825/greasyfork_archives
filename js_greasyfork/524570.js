// ==UserScript==
// @name         [sn0tspoon] Neopets URL Linkifier
// @namespace    snotspoon.neocities.org
// @version      1.8
// @description  Convert plaintext URLs into clickable links, fix broken redirect links, and linkify petpage shorthands (/~username) on Neopets
// @author       nadinejun0
// @match        https://www.neopets.com/*
// @match        http://www.neopets.com/*
// @match        https://www.neopets.com/~*
// @match        http://www.neopets.com/~*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/524570/%5Bsn0tspoon%5D%20Neopets%20URL%20Linkifier.user.js
// @updateURL https://update.greasyfork.org/scripts/524570/%5Bsn0tspoon%5D%20Neopets%20URL%20Linkifier.meta.js
// ==/UserScript==


/**
 * changelog & modifications:
 *
 * v1.8 - 10/14/25 - redirect fix:
 * added fixRedirectLinks() to repair broken neopets redirect wrapper
 * problem: neopets wraps external urls in /redirect/fansite.phtml?r=URL_ENCODED_LINK which doesn't actually redirect
 * fix: /redirect/fansite.phtml?r=https%3A%2F%2Fimpress.openneo.net%2F... 
 * becomes: https://impress.openneo.net/...
 *
 * petpage shorthand support:
 * added PETPAGE_PATTERN to detect /~username shorthand references
 * common on boards where users type just /~petname instead of full urls
 * converts: /~username to https://www.neopets.com/~username
 *
 */



(function () {
  'use strict';

  // URL pattern used by both matching and testing
  const URL_PATTERN =
    '(?:https?:\\/\\/)?(?:www\\.)?(?:(?:neopets\\.com\\/[^\\s<>"\']+)|(?:impress\\.openneo\\.net\\/[^\\s<>"\']+)|(?:impress-2020\\.openneo\\.net\\/[^\\s<>"\']+)|(?:items\\.jellyneo\\.net\\/[^\\s<>"\']+))';

  // Petpage shorthand pattern - matches /~username
  const PETPAGE_PATTERN = '\\/~[a-zA-Z0-9_]+';
  
  // Combined pattern for all URLs and petpage shorthands
  const COMBINED_PATTERN = `(?:${URL_PATTERN}|${PETPAGE_PATTERN})`;

  const urlRegex = new RegExp(COMBINED_PATTERN, 'g');      // for exec loop
  const urlTest = new RegExp(COMBINED_PATTERN);            // for quick .test

  const SKIP_SELECTOR = 'a,script,style,textarea,input';

  // replace plaintext URLs inside <a> elements
  function processTextNode(node) {
    const text = node.textContent;
    if (!text || !urlTest.test(text)) return;
    if (!node.parentNode) return;

    // exclusions
    if (node.parentNode.closest && node.parentNode.closest(SKIP_SELECTOR)) return;

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    urlRegex.lastIndex = 0;

    let match;
    while ((match = urlRegex.exec(text)) !== null) {
      const matchedUrl = match[0];
      const start = match.index;

      // append text before the match
      if (start > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
      }

      // create link
      const link = document.createElement('a');
      
      // Handle petpage shorthand /~username
      let href;
      if (matchedUrl.startsWith('/~')) {
        href = 'https://www.neopets.com' + matchedUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      } else {
        href = matchedUrl.startsWith('http') ? matchedUrl : 'https://' + matchedUrl;
        
        if (
          matchedUrl.includes('neopets.com') ||
          matchedUrl.includes('impress.openneo.net') ||
          matchedUrl.includes('impress-2020.openneo.net') ||
          matchedUrl.includes('jellyneo.net')
        ) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      }
      
      link.href = href;
      link.textContent = matchedUrl;

      fragment.appendChild(link);
      lastIndex = start + matchedUrl.length;
    }

    // append any remaining trailing text
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }


      if (node.parentNode) {
      node.parentNode.replaceChild(fragment, node);
    }
  }

  function processContainer(container) {
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (n) => {
          if (!n.nodeValue || !urlTest.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
          const p = n.parentNode;
          if (!p) return NodeFilter.FILTER_REJECT;
          if (p.closest && p.closest(SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      },
      false
    );

    const nodes = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n);
    for (const tn of nodes) processTextNode(tn);
  }

  // Process specific sections of board posts
  function processNeoPosts(root = document) {
    // main post content
    root.querySelectorAll('.boardPostMessage').forEach((post) => processContainer(post));

    // signatures area after separator span
    root.querySelectorAll('span[style*="color:#818181"]').forEach((separator) => {
      const nextNode = separator.nextSibling;
      if (!nextNode) return;
      if (nextNode.nodeType === Node.TEXT_NODE) {
        processTextNode(nextNode);
      } else if (nextNode.nodeType === Node.ELEMENT_NODE) {
        processContainer(nextNode);
      }
    });
  }

  // Fix broken Neopets redirect links
  function fixRedirectLinks(root = document) {
    const redirectLinks = root.querySelectorAll('a[href*="/redirect/fansite.phtml?r="]');
    
    redirectLinks.forEach(link => {
      try {
        const url = new URL(link.href, window.location.origin);
        const redirectParam = url.searchParams.get('r');
        
        if (redirectParam) {
          // Decode the URL and set it as the direct href
          const decodedUrl = decodeURIComponent(redirectParam);
          link.href = decodedUrl;
          
          // Ensure external links open in new tab with security attributes
          if (!decodedUrl.includes('neopets.com')) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
          }
        }
      } catch (e) {
        console.error('Error fixing redirect link:', e);
      }
    });
  }

  // init
  processNeoPosts(document);
  fixRedirectLinks(document);

  // observer
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        // Fix any redirect links in the new node
        if (node.matches && node.matches('a[href*="/redirect/fansite.phtml?r="]')) {
          fixRedirectLinks(node.parentElement);
        } else if (node.querySelector) {
          fixRedirectLinks(node);
        }

        if (node.classList && node.classList.contains('boardPostMessage')) {
          processContainer(node);
          continue;
        }

        const post = node.querySelector && node.querySelector('.boardPostMessage');
        if (post) processContainer(post);

        // Also handle new separators that might appear
        if (node.matches && node.matches('span[style*="color:#818181"]')) {
          const nextNode = node.nextSibling;
          if (nextNode) {
            if (nextNode.nodeType === Node.TEXT_NODE) processTextNode(nextNode);
            else if (nextNode.nodeType === Node.ELEMENT_NODE) processContainer(nextNode);
          }
        } else if (node.querySelector) {
          node.querySelectorAll('span[style*="color:#818181"]').forEach((sep) => {
            const nn = sep.nextSibling;
            if (!nn) return;
            if (nn.nodeType === Node.TEXT_NODE) processTextNode(nn);
            else if (nn.nodeType === Node.ELEMENT_NODE) processContainer(nn);
          });
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();