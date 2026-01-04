// ==UserScript==
// @name         N1 AD clearer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  clean ad
// @author       Beaverite
// @match        https://narrow.one/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545179/N1%20AD%20clearer.user.js
// @updateURL https://update.greasyfork.org/scripts/545179/N1%20AD%20clearer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  //u can complement
  const URL_PATTERNS = [
    'doubleclick\\.net',
    'googlesyndication',
    'adservice\\.google',
    'adsystem',
    'adserver',
    '/ads/',
    '/getad',
    'interstitial',
    'servead',
    '\\bad(s|vert).*\\.js',
    'rainbow-house\\.com\\.tw',
    'store\\.logitech\\.tw',
    'facebook\\.com',
    'youtube\\.com',
    'x\\.com',
    'instagram\\.com',
    'discord\\.com',
    'googletagmanager\\.com',
    'googletagservices\\.com',
    'google-analytics\\.com',
    'scorecardresearch\\.com',
    'zedo\\.com',
    'adnxs\\.com',
    'criteo\\.com',
    'taboola\\.com',
    'outbrain\\.com',
    'quantserve\\.com'
  ].map(s => new RegExp(s, 'i'));
  const NODE_SELECTORS = [
    'iframe[src*="ad"]',
    'iframe[src*="ads"]',
    '[class*="ad-"]',
    '[id*="ad-"]',
    '.ads',
    '.advert',
    '.overlay-ad',
    '.video-ad',
    '.interstitial',
  ];
  //

  const NODE_WHITELIST = [
    '.game-ui', '.hud', '#gameCanvas'
  ];
  function matchesBlockUrl(url) {
    if (!url) return false;
    return URL_PATTERNS.some(re => re.test(url));
  }
  function isWhitelisted(node) {
    if (!node || !node.matches) return false;
    return NODE_WHITELIST.some(s => node.matches(s));
  }
  const _origFetch = window.fetch;
  window.fetch = function (input, init) {
    const url = (typeof input === 'string') ? input : (input && input.url) || '';
    if (matchesBlockUrl(url)) {
      console.info('[AdBlocker] blocked fetch:', url);
      return Promise.reject(new DOMException('Blocked by userscript'));
    }
    return _origFetch.apply(this, arguments);
  };
  const _origXhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (matchesBlockUrl(url)) {
      console.info('[AdBlocker] blocking XHR open to', url);
      this.__blockByAdBlocker = true;
    }
    return _origXhrOpen.apply(this, arguments);
  };
  const _origXhrSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    if (this.__blockByAdBlocker) {
      this.abort && this.abort();
      console.info('[AdBlocker] aborted XHR');
      return;
    }
    return _origXhrSend.apply(this, arguments);
  };
  const origOpen = window.open;
  window.open = function (url, name, specs) {
    if (matchesBlockUrl(url)) {
      console.info('[AdBlocker] blocked popup:', url);
      return null;
    }
    return origOpen.apply(this, arguments);
  };
  const origSetAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name, value) {
    if ((this.tagName === 'IFRAME' || this.tagName === 'FRAME') && name === 'src' && matchesBlockUrl(value)) {
      console.info('[AdBlocker] blocked iframe src set to', value);
      return;
    }
    return origSetAttr.apply(this, arguments);
  };
  function cleanNode(node) {
    if (!node || !(node instanceof Element)) return;
    if (isWhitelisted(node)) return;
    for (const sel of NODE_SELECTORS) {
      if (node.matches && node.matches(sel)) {
        console.info('[AdBlocker] removing node matching', sel);
        node.remove();
        return;
      }
    }
    node.querySelectorAll && node.querySelectorAll('iframe,frame').forEach(iframe => {
      const s = iframe.getAttribute && iframe.getAttribute('src');
      if (matchesBlockUrl(s)) {
        console.info('[AdBlocker] removing iframe with blocked src', s);
        iframe.remove();
      }
    });
  }
  const observer = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'childList') {
        m.addedNodes && m.addedNodes.forEach(n => {
          if (n.nodeType === Node.ELEMENT_NODE) cleanNode(n);
        });
      } else if (m.type === 'attributes') {
        cleanNode(m.target);
      }
    }
  });
  function startObserver() {
    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'style', 'src']
    });
  }
  function initialSweep() {
    NODE_SELECTORS.forEach(sel => {
      document.querySelectorAll(sel).forEach(n => cleanNode(n));
    });
    document.querySelectorAll('iframe,frame').forEach(fr => {
      const s = fr.getAttribute && fr.getAttribute('src');
      if (matchesBlockUrl(s)) {
        console.info('[AdBlocker] initial removing iframe', s);
        fr.remove();
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initialSweep();
      startObserver();
    });
  } else {
    initialSweep();
    startObserver();
  }
  console.info('[AdBlocker] script loaded for narrow.one with extended rules');
})();