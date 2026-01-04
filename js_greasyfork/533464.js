// ==UserScript==
// @name         Vercel SDK Playground – tidy inline LaTeX
// @namespace    https://sdk.vercel.ai/
// @version      0.5
// @description  Render .math-inline / .math-display elements in the Playground and all its iframes.
// @match        https://sdk.vercel.ai/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533464/Vercel%20SDK%20Playground%20%E2%80%93%20tidy%20inline%20LaTeX.user.js
// @updateURL https://update.greasyfork.org/scripts/533464/Vercel%20SDK%20Playground%20%E2%80%93%20tidy%20inline%20LaTeX.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* 0.  MathJax configuration (must precede library load) */
  unsafeWindow.MathJax = {
    tex:   { inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']] },
    chtml: { scale: 1 },
    options: { skipHtmlTags: ['script','noscript','style','textarea'] }
  };

  /* 0.1 Keep inline math from becoming block‑level */
  GM_addStyle('mjx-container.MathJax { display:inline-block !important; }');

  /* 1.  Inject MathJax CHTML build */
  const s = document.createElement('script');
  s.async = true;
  s.src   = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
  document.head.appendChild(s);

  /* 2.  Helpers ---------------------------------------------------------- */
  const wrap = (el) => {
    if (el.dataset.mjReady) return;
    const raw = el.textContent.trim();
    if (!raw) return;
    el.textContent = el.classList.contains('math-inline') ? `\\(${raw}\\)` : `\\[${raw}\\]`;
    el.dataset.mjReady = '1';
  };

  const typeset = (nodes) => {
    if (unsafeWindow.MathJax?.typesetPromise) {
      unsafeWindow.MathJax.typesetPromise(nodes).catch(console.error);
    } else {
      setTimeout(() => typeset(nodes), 120);
    }
  };

  const scan = (root = document) => {
    const elems = root.querySelectorAll('.math-inline, .math-display');
    if (!elems.length) return;
    elems.forEach(wrap);
    typeset(Array.from(elems));
  };

  /* 3.  First pass + live updates --------------------------------------- */
  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', () => scan())
    : scan();

  const mo = new MutationObserver((ms) => {
    const add = [];
    ms.forEach((m) =>
      m.addedNodes.forEach((n) => {
        if (!(n instanceof HTMLElement)) return;
        if (n.matches?.('.math-inline, .math-display')) add.push(n);
        add.push(...n.querySelectorAll?.('.math-inline, .math-display') || []);
      })
    );
    if (add.length) scan({ querySelectorAll: () => add });
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();