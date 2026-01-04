// ==UserScript==
// @name         아레나 잠금 해제
// @namespace    tampermonkey-enabled-submit
// @version      0.1.0
// @description  lmarena의 textarea를 강제로 활성화하고, 타이핑 후 Enter로 전송
// @match        https://lmarena.ai/*
// @run-at       document-start
// @grant        none
// @author       116.125
// @source       https://gall.dcinside.com/thesingularity
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545957/%EC%95%84%EB%A0%88%EB%82%98%20%EC%9E%A0%EA%B8%88%20%ED%95%B4%EC%A0%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/545957/%EC%95%84%EB%A0%88%EB%82%98%20%EC%9E%A0%EA%B8%88%20%ED%95%B4%EC%A0%9C.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TEXTAREA_SELECTOR =
    'textarea[name="message"], textarea[data-sentry-element="AutoResizeTextarea"], textarea';

  function enableTextarea(el) {
    if (!(el instanceof HTMLTextAreaElement)) return;

    if (el.disabled || el.hasAttribute('disabled')) {
      el.disabled = false;
      el.removeAttribute('disabled');
    }

    try {
      const cs = getComputedStyle(el);
      if (cs.pointerEvents === 'none') el.style.pointerEvents = 'auto';
      if (cs.userSelect === 'none') el.style.userSelect = 'text';
    } catch (_) {}
  }

  function scanAndEnable(root = document) {
    root.querySelectorAll(TEXTAREA_SELECTOR).forEach(enableTextarea);
  }

  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'childList') {
        m.addedNodes.forEach(n => {
          if (n.nodeType !== 1) return;
          if (n.matches && n.matches('textarea')) enableTextarea(n);
          if (n.querySelectorAll) scanAndEnable(n);
        });
      } else if (m.type === 'attributes') {
        if (m.target instanceof HTMLTextAreaElement &&
            (m.attributeName === 'disabled' || m.attributeName === 'class' || m.attributeName === 'style')) {
          enableTextarea(m.target);
        }
      }
    }
  });

  const startObserve = () => {
    mo.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['disabled', 'class', 'style']
    });
  };

  const init = () => {
    scanAndEnable();
    startObserve();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  document.addEventListener('keydown', e => {
    const t = e.target;
    if (!(t instanceof HTMLTextAreaElement)) return;
    if (!t.matches(TEXTAREA_SELECTOR)) return;
    if (e.isComposing) return;
    if (e.key !== 'Enter' || e.shiftKey) return;

    const form = t.closest('form');
    if (!form) return;

    e.preventDefault();
    try {
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        const submitter = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitter) submitter.click();
        else form.submit();
      }
    } catch (err) {
      console.warn('submit error:', err);
    }
  }, true);
})();
