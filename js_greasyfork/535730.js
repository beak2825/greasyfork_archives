// ==UserScript==
// @name         Instiz iOS Zoom Blocker (강화판)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  iOS Safari에서 input 포커스 시 확대 방지. 폰트 크기 강제 및 스타일 충돌 방지 포함
// @author       San (Modified by ChatGPT)
// @match        *://*instiz.net/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535730/Instiz%20iOS%20Zoom%20Blocker%20%28%EA%B0%95%ED%99%94%ED%8C%90%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535730/Instiz%20iOS%20Zoom%20Blocker%20%28%EA%B0%95%ED%99%94%ED%8C%90%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.log('[Instiz Zoom Blocker] 스크립트 실행됨');

  document.addEventListener('DOMContentLoaded', () => {
    // Viewport meta 태그 삽입
    function addViewportMetaTag() {
      if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
        document.head.appendChild(meta);
        console.log('[Instiz Zoom Blocker] viewport 메타태그 삽입 완료');
      }
    }

    // input, textarea, select 요소 폰트 크기 강제
    function applyFontFix() {
      const elements = document.querySelectorAll('input, textarea, select');
      elements.forEach(el => {
        const computedSize = parseInt(window.getComputedStyle(el).fontSize);
        if (computedSize < 16) {
          el.style.setProperty('font-size', '16px', 'important');
        }
      });
    }

    // body 스타일 클린업
    function cleanUpBodyStyle() {
      const body = document.body;
      body.style.setProperty('transform', '', 'important');
      body.style.setProperty('transform-origin', '', 'important');
      body.style.setProperty('overflow', '', 'important');
      body.style.setProperty('touch-action', 'manipulation', 'important');
    }

    // 최초 실행
    addViewportMetaTag();
    applyFontFix();
    cleanUpBodyStyle();

    // 정기 재적용
    setInterval(() => {
      applyFontFix();
    }, 1000);

    // DOM 변경 감지
    const observer = new MutationObserver(() => {
      applyFontFix();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
})();