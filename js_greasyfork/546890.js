// ==UserScript==
// @name         Bionic First Letters (ADHD reader)
// @namespace    https://github.com/Ronlerner-HGS/adhd-reader
// @version      1.0.0
// @description  Makes Texts more accessible by mimicking bionic reading for most webpages. The feature helps people who are having trouble of staying in line when reading text. For example people with ADHD, Autism or other disabilities.
// @author       Ron Lerner
// @license      GPL
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/546890/Bionic%20First%20Letters%20%28ADHD%20reader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546890/Bionic%20First%20Letters%20%28ADHD%20reader%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // Config
  const WRAP_CLASS = 'bn-chunk';
  const FIRST_CLASS = 'bn-first';
  const OFF_CLASS = 'bn-off';
  const IGNORE_ATTR = 'data-bn-ignore';
  const DOMAIN_KEY =
    'bn-first-letters-enabled:' + (location.hostname || 'global');
  const DEFAULT_ENABLED = true;

  // Tags/areas to skip to avoid breaking functionality or formatting.
  const SKIP_SELECTORS =
    'script,style,noscript,textarea,input,select,option,pre,code,kbd,' +
    'samp,var,math,svg,canvas,iframe,object,embed,head,title';

  // Inject CSS once
  function injectStyle() {
    if (document.getElementById('bn-first-style')) return;
    const style = document.createElement('style');
    style.id = 'bn-first-style';
    style.textContent =
      ':root{--bn-weight:700}' +
      `.${FIRST_CLASS}{font-weight:var(--bn-weight,700)!important}` +
      `.${OFF_CLASS} .${FIRST_CLASS}{font-weight:inherit!important}` +
      // Let users opt-out for parts of the page
      `[${IGNORE_ATTR}] .${FIRST_CLASS}{font-weight:inherit!important}`;
    document.head.appendChild(style);
  }

  // State
  let enabled = getEnabledFromStorage();
  let observer = null;
  let segmenter = null;
  if ('Intl' in window && 'Segmenter' in Intl) {
    try {
      segmenter = new Intl.Segmenter(undefined, {
        granularity: 'grapheme',
      });
    } catch {}
  }

  function getEnabledFromStorage() {
    const v = localStorage.getItem(DOMAIN_KEY);
    if (v === null) return DEFAULT_ENABLED;
    return v === '1';
  }

  function setEnabledToStorage(v) {
    localStorage.setItem(DOMAIN_KEY, v ? '1' : '0');
  }

  function setEnabled(v) {
    enabled = v;
    setEnabledToStorage(v);
    document.documentElement.classList.toggle(OFF_CLASS, !v);
    if (v) {
      startObserver();
      // Process anything not yet processed
      processRoot(document.body);
    } else {
      stopObserver();
      // We don't remove wrappers for performance/simplicity; CSS disables bold.
      toast('Bionic First Letters: OFF');
      return;
    }
    toast('Bionic First Letters: ON');
  }

  // Small toast to show status
  function toast(msg) {
    try {
      const id = 'bn-toast';
      let t = document.getElementById(id);
      if (!t) {
        t = document.createElement('div');
        t.id = id;
        t.style.cssText =
          'position:fixed;z-index:2147483647;right:12px;bottom:12px;' +
          'background:#111;color:#fff;padding:8px 10px;border-radius:8px;' +
          'font:12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;' +
          'box-shadow:0 4px 10px rgba(0,0,0,.25);opacity:.95';
        document.body.appendChild(t);
      }
      t.textContent = msg;
      clearTimeout(t._bnTimer);
      t._bnTimer = setTimeout(() => t.remove(), 1600);
    } catch {}
  }

  // Toggle hotkey: Alt+B
  window.addEventListener(
    'keydown',
    (e) => {
      if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          setEnabled(!enabled);
        }
      }
    },
    true
  );

  function startObserver() {
    if (observer) return;
    observer = new MutationObserver((mutations) => {
      if (!enabled) return;
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((n) => {
            if (n.nodeType === Node.ELEMENT_NODE) {
              if (
                (n).closest &&
                (n).closest(SKIP_SELECTORS + `,[${IGNORE_ATTR}]`)
              ) {
                return;
              }
              processRoot(n);
            } else if (n.nodeType === Node.TEXT_NODE) {
              if (eligibleTextNode(n)) bionicizeTextNode(n);
            }
          });
        } else if (m.type === 'characterData') {
          const tn = m.target;
          if (eligibleTextNode(tn)) bionicizeTextNode(tn);
        }
      }
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  }

  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  // Eligibility checks for text nodes
  function eligibleTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) return false;
    const text = node.nodeValue;
    if (!text || !/[\p{L}\p{N}]/u.test(text)) return false;
    const parent = node.parentElement;
    if (!parent) return false;

    // Skip if parent or ancestors are in ignored or sensitive areas
    if (parent.closest(SKIP_SELECTORS)) return false;
    if (parent.closest(`[${IGNORE_ATTR}]`)) return false;
    if (parent.closest('.' + WRAP_CLASS)) return false;
    if (parent.closest('.' + FIRST_CLASS)) return false;
    if (parent.closest('[contenteditable=""],[contenteditable="true"]'))
      return false;

    return true;
  }

  // Process an element subtree
  function processRoot(root) {
    if (!root || !(root instanceof Element)) return;
    if (root.matches(SKIP_SELECTORS) || root.closest(SKIP_SELECTORS)) return;
    if (root.closest(`[${IGNORE_ATTR}]`)) return;

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          return eligibleTextNode(node)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        },
      },
      false
    );

    const toProcess = [];
    let n;
    while ((n = walker.nextNode())) toProcess.push(n);
    for (const tn of toProcess) {
      bionicizeTextNode(tn);
    }
  }

  // Bold the first letter of every word in a text node
  function bionicizeTextNode(textNode) {
    const text = textNode.nodeValue;
    if (!text || !/[\p{L}\p{N}]/u.test(text)) return;

    // Build a wrapper that replaces the text node
    const wrapper = document.createElement('span');
    wrapper.className = WRAP_CLASS;

    let last = 0;
    const re = /[\p{L}\p{N}]+/gu;
    for (const match of text.matchAll(re)) {
      const { index } = match;
      const word = match[0];

      // Add the text between last and current word
      if (index > last) {
        wrapper.appendChild(
          document.createTextNode(text.slice(last, index))
        );
      }

      const { first, rest } = splitFirstGrapheme(word);
      const firstSpan = document.createElement('span');
      firstSpan.className = FIRST_CLASS;
      firstSpan.textContent = first;
      wrapper.appendChild(firstSpan);
      if (rest) wrapper.appendChild(document.createTextNode(rest));

      last = index + word.length;
    }

    // Tail
    if (last < text.length) {
      wrapper.appendChild(document.createTextNode(text.slice(last)));
    }

    // Replace node
    textNode.replaceWith(wrapper);
  }

  function splitFirstGrapheme(word) {
    if (!word) return { first: '', rest: '' };
    if (segmenter) {
      const segs = segmenter.segment(word);
      const it = segs[Symbol.iterator]();
      const first = it.next().value;
      if (first && typeof first.segment === 'string') {
        const f = first.segment;
        const rest = word.slice(f.length);
        return { first: f, rest };
      }
    }
    // Fallback
    return { first: word.charAt(0), rest: word.slice(1) };
  }

  // Init
  function init() {
    injectStyle();
    document.documentElement.classList.toggle(OFF_CLASS, !enabled);
    if (enabled) {
      processRoot(document.body);
      startObserver();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();