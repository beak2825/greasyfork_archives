// ==UserScript==
// @name        Nomoji (Unicode-aware, flags preserved)
// @match       *://*/*
// @run-at      document-start
// @grant       none
// @version     0.4.0
// @namespace   https://greasyfork.org/users/1497719
// @description Blocks all emojis except flags from being displayed on any website (text, images, CSS) — Unicode-aware, reentrancy-guarded
// @downloadURL https://update.greasyfork.org/scripts/543442/Nomoji%20%28Unicode-aware%2C%20flags%20preserved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543442/Nomoji%20%28Unicode-aware%2C%20flags%20preserved%29.meta.js
// ==/UserScript==

(() => {
  // Unicode property-based matching
  const EMOJI_CLUSTER =
    /\p{Extended_Pictographic}(?:\uFE0F)?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F)?)*?/u;
  const FLAG_SEQUENCE = /[\u{1F1E6}-\u{1F1FF}]{2}/u;

  const emojiTestRE = new RegExp(
    `(?:${FLAG_SEQUENCE.source})|(?:${EMOJI_CLUSTER.source})`,
    'u'
  );
  const emojiReplaceRE = new RegExp(
    `(${FLAG_SEQUENCE.source})|(${EMOJI_CLUSTER.source})`,
    'gu'
  );

  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT', 'TEXTAREA']);
  const EDITABLE_INPUTS = new Set(['INPUT', 'TEXTAREA']);

  const isEditable = (el) =>
    el && el.nodeType === Node.ELEMENT_NODE &&
    (EDITABLE_INPUTS.has(el.tagName) || el.isContentEditable);

  const isSkippable = (el) =>
    el && el.nodeType === Node.ELEMENT_NODE && SKIP_TAGS.has(el.tagName);

  let processing = false;

  const stripTextNode = (node) => {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const parent = node.parentNode;
    if (!parent || isEditable(parent) || isSkippable(parent)) return;
    const val = node.nodeValue;
    if (!val || !emojiTestRE.test(val)) return;
    node.nodeValue = val
      .replace(emojiReplaceRE, (m, flag) => (flag ? flag : ''))
      .replace(/\uFE0F/gu, ''); // remove stray VS16
  };

  const processElement = (el) => {
    if (isEditable(el) || isSkippable(el)) return;

    for (const attr of ['aria-label', 'title', 'alt']) {
      if (el.hasAttribute && el.hasAttribute(attr)) {
        const v = el.getAttribute(attr);
        if (v && emojiTestRE.test(v)) {
          el.setAttribute(
            attr,
            v.replace(emojiReplaceRE, (m, flag) => (flag ? flag : '')).replace(/\uFE0F/gu, '')
          );
        }
      }
    }

    const tag = el.tagName;

    if (tag === 'IMG' || tag === 'SVG' || tag === 'PICTURE') {
      const src = (el.getAttribute && el.getAttribute('src')) || '';
      const role = (el.getAttribute && el.getAttribute('role')) || '';
      const cls = (el.className && String(el.className)) || '';
      const looksEmoji =
        /twemoji|emoji|emojione|noto-emoji|blobcat|blobmoji/i.test(src + ' ' + role + ' ' + cls);

      if (looksEmoji) {
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('width', '0px', 'important');
        el.style.setProperty('height', '0px', 'important');
        el.style.setProperty('overflow', 'hidden', 'important');
        return;
      }
    }

    const styleAttr = el.getAttribute && el.getAttribute('style');
    if (styleAttr && /background(-image)?:/i.test(styleAttr)) {
      let bg = '';
      try {
        bg = getComputedStyle(el).backgroundImage || '';
      } catch {}
      if (/emoji|twemoji/i.test(bg)) {
        el.style.setProperty('background-image', 'none', 'important');
      }
    }
  };

  const processSubtree = (root) => {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      stripTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE) return;

    if (!isSkippable(root)) processElement(root);

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            return isSkippable(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
          }
          if (node.nodeType === Node.TEXT_NODE) {
            const p = node.parentNode;
            if (!p || isEditable(p) || isSkippable(p)) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );

    let node = walker.currentNode;
    do {
      if (node.nodeType === Node.TEXT_NODE) {
        stripTextNode(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        processElement(node);
      }
      node = walker.nextNode();
    } while (node);
  };

  const init = () => {
    if (!document.body) {
      requestAnimationFrame(init);
      return;
    }
    processing = true;
    try {
      processSubtree(document.body);
    } finally {
      processing = false;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  let queue = new Set();
  let scheduled = false;

  const flush = () => {
    scheduled = false;
    if (queue.size === 0) return;
    processing = true;
    observer.disconnect();
    try {
      for (const node of queue) processSubtree(node);
    } finally {
      queue.clear();
      processing = false;
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  };

  const schedule = (node) => {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
      queue.add(node);
    }
    if (!scheduled) {
      scheduled = true;
      Promise.resolve().then(flush);
    }
  };

  const observer = new MutationObserver((mutations) => {
    if (processing) return;
    for (const m of mutations) {
      if (m.type === 'characterData') {
        schedule(m.target);
      } else if (m.type === 'childList') {
        for (const node of m.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            schedule(node);
          }
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
})();
