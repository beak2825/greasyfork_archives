// ==UserScript==
// @name         DCInside 자짤 차단기
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  자짤 숨기기
// @match        *://gall.dcinside.com/*
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542036/DCInside%20%EC%9E%90%EC%A7%A4%20%EC%B0%A8%EB%8B%A8%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/542036/DCInside%20%EC%9E%90%EC%A7%A4%20%EC%B0%A8%EB%8B%A8%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ----- 스타일 (동일) -----
  const style = document.createElement('style');
  style.textContent = `
    img[src*="viewimage.php"] { display: none !important; }
    img[srcset*="viewimage.php"] { display: none !important; }
    img[data-src*="viewimage.php"] { display: none !important; }
    picture > source[srcset*="viewimage.php"] ~ img { display: none !important; }

    img[src*="viewimage.php"][data-fileno],
    img[srcset*="viewimage.php"][data-fileno],
    img[data-src*="viewimage.php"][data-fileno],
    img[src*="viewimage.php"][data-tempno],
    img[srcset*="viewimage.php"][data-tempno],
    img[data-src*="viewimage.php"][data-tempno],
    img[src*="viewimage.php"][onclick*="imgPop"],
    img[srcset*="viewimage.php"][onclick*="imgPop"],
    img[data-src*="viewimage.php"][onclick*="imgPop"],
    img[src*="viewimage.php"][data-original],
    img[srcset*="viewimage.php"][data-original],
    img[data-src*="viewimage.php"][data-original] { display: block !important; }

    img.dcij-show { display: block !important; }

    .dcij-wrap { position: relative; display: inline-block; max-width: 100%; }

    .dcij-toggle {
      padding: 4px 8px;
      font-size: 12px;
      line-height: 1;
      border: 1px solid rgba(0,0,0,.15);
      background: rgba(255,255,255,.95);
      border-radius: 6px;
      cursor: pointer;
      user-select: none;
      box-shadow: 0 1px 3px rgba(0,0,0,.08);
      transition: opacity .2s;
    }
    .dcij-toggle[data-state="hidden"]::after { content: "보기"; }
    .dcij-toggle[data-state="visible"]::after { content: "숨기기"; }

    /* 숨김: 버튼은 흐름(static), 항상 보임 */
    .dcij-wrap[data-state="hidden"] .dcij-toggle {
      position: static;
      display: inline-block;
      margin: 4px 0 8px 0;
      opacity: 1;
    }
    /* 보기: 버튼은 이미지 내부 좌상단, 호버시에만 보임 */
    .dcij-wrap[data-state="visible"] .dcij-toggle {
      position: absolute;
      top: 8px; left: 8px;
      margin: 0;
      z-index: 2147483647;
      opacity: 0;
    }
    .dcij-wrap[data-state="visible"]:hover .dcij-toggle { opacity: 1; }
  `;
  (document.head || document.documentElement).insertBefore(
    style, (document.head || document.documentElement).firstChild
  );

  const BLOCK_IMG = [
    'img[src*="viewimage.php"]',
    'img[srcset*="viewimage.php"]',
    'img[data-src*="viewimage.php"]',
    'picture > source[srcset*="viewimage.php"] ~ img'
  ].join(',');
  const EXEMPT_IMG = 'img[data-fileno], img[data-tempno], img[onclick*="imgPop"], img[data-original]';
  const isExempt = (img) => img.matches(EXEMPT_IMG);

  // ====== 루프 방지용 가드 ======
  let MUTATING = 0;
  const guard = (fn) => (...args) => { MUTATING++; try { return fn(...args); } finally { MUTATING--; } };

  function ensureWrap(node) {
    let wrap = node.closest?.('.dcij-wrap');
    if (wrap) return wrap;
    const parent = node.parentNode;
    if (!parent) return null;
    wrap = document.createElement('span');
    wrap.className = 'dcij-wrap';
    wrap.setAttribute('data-state', 'hidden');
    parent.insertBefore(wrap, node);
    wrap.appendChild(node);
    return wrap;
  }

  const unhideAncestorsFor = guard(function (wrap, img, turnOn) {
    let el = img;
    while (el && el !== wrap.parentElement && el !== document.documentElement) {
      const cs = window.getComputedStyle(el);
      if (turnOn) {
        if (cs.display === 'none' && el.dataset.dcijUnhid !== '1') {
          el.dataset.dcijPrevDisplay = el.style.display || '';
          el.dataset.dcijUnhid = '1';
          el.style.display = 'block';
        }
      } else {
        if (el.dataset.dcijUnhid === '1') {
          el.style.display = el.dataset.dcijPrevDisplay || '';
          delete el.dataset.dcijPrevDisplay;
          delete el.dataset.dcijUnhid;
        }
      }
      el = el.parentElement;
    }
  });

  const toggleWrap = guard(function (wrap, toShow) {
    const imgs = wrap.querySelectorAll('img');
    if (toShow) {
      imgs.forEach(img => {
        if (img.loading === 'lazy') img.loading = 'eager';
        if (img.dataset?.src && !img.src) img.src = img.dataset.src;
        img.classList.add('dcij-show');
        unhideAncestorsFor(wrap, img, true);
      });
      wrap.setAttribute('data-state', 'visible');
      wrap.querySelector('.dcij-toggle')?.setAttribute('data-state', 'visible');
    } else {
      imgs.forEach(img => {
        img.classList.remove('dcij-show');
        unhideAncestorsFor(wrap, img, false);
      });
      wrap.setAttribute('data-state', 'hidden');
      wrap.querySelector('.dcij-toggle')?.setAttribute('data-state', 'hidden');
    }
  });

  function addToggleButton(img) {
    if (img.dataset.dcijBtn === '1') return;
    const wrap = ensureWrap(img);
    if (!wrap) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dcij-toggle';
    btn.setAttribute('aria-label', '가린 이미지 보기/숨기기');

    const hiddenNow = !img.classList.contains('dcij-show');
    btn.setAttribute('data-state', hiddenNow ? 'hidden' : 'visible');
    wrap.setAttribute('data-state', hiddenNow ? 'hidden' : 'visible');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const toShow = btn.getAttribute('data-state') === 'hidden';
      toggleWrap(wrap, toShow);
    });

    guard(() => wrap.appendChild(btn))();
    img.dataset.dcijBtn = '1';
  }

  const tagHidden = guard(function (img) {
    img.classList.add('dcij-hidden');
  });

  function processImg(img) {
    if (!img || img.nodeName !== 'IMG') return;
    if (isExempt(img)) {
      guard(() => {
        img.classList.remove('dcij-hidden', 'dcij-show');
        const w = ensureWrap(img);
        if (w) toggleWrap(w, true);
      })();
      return;
    }
    tagHidden(img);
    addToggleButton(img);
  }

  function scan(root = document) {
    root.querySelectorAll(BLOCK_IMG).forEach(processImg);
  }

  // ====== 옵저버 (style/class 제외) ======
  const mo = new MutationObserver((muts) => {
    if (MUTATING) return; // 우리가 수정 중이면 무시
    for (const m of muts) {
      if (m.type === 'childList') {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (n.matches?.(BLOCK_IMG)) processImg(n);
          else scan(n);
        });
      } else if (m.type === 'attributes') {
        const el = m.target;
        if (!el.matches) continue;
        if (el.matches(BLOCK_IMG)) processImg(el);
        if (el.matches('img')) {
          if (isExempt(el)) {
            guard(() => {
              el.classList.remove('dcij-hidden', 'dcij-show');
              const w = ensureWrap(el);
              if (w) toggleWrap(w, true);
            })();
          } else if (
            el.src?.includes('viewimage.php') ||
            el.getAttribute('srcset')?.includes('viewimage.php') ||
            el.getAttribute('data-src')?.includes('viewimage.php')
          ) {
            tagHidden(el);
            addToggleButton(el);
          }
        }
      }
    }
  });
  mo.observe(document.documentElement, {
    childList: true,
    subtree: true,
    // ★ style/class 제거: 무한 루프 방지
    attributes: true,
    attributeFilter: ['src','srcset','data-src','data-fileno','data-tempno','onclick','data-original']
  });

  scan();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => scan(), { once: true });
  }
})();
