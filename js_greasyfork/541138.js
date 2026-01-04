// ==UserScript==
// @name         쿠팡플레이 1080p 화질 자동 고정
// @namespace    coupangplay1080p
// @version      1.0
// @description  1080p 화질 자동 고정
// @author       쥐샛기
// @match        https://www.coupangplay.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      GSetKI
// @downloadURL https://update.greasyfork.org/scripts/541138/%EC%BF%A0%ED%8C%A1%ED%94%8C%EB%A0%88%EC%9D%B4%201080p%20%ED%99%94%EC%A7%88%20%EC%9E%90%EB%8F%99%20%EA%B3%A0%EC%A0%95.user.js
// @updateURL https://update.greasyfork.org/scripts/541138/%EC%BF%A0%ED%8C%A1%ED%94%8C%EB%A0%88%EC%9D%B4%201080p%20%ED%99%94%EC%A7%88%20%EC%9E%90%EB%8F%99%20%EA%B3%A0%EC%A0%95.meta.js
// ==/UserScript==


(function() {
  'use strict';

  function select1080() {
    const ul = document.querySelector('ul.qualities[data-cy="playback-quality-selector-list"]');
    if (!ul) return;
    for (const li of ul.querySelectorAll('li')) {
      if (li.textContent.trim() === '1080') {
        // 이미 활성화된 상태가 아니면 클릭
        if (!li.classList.contains('active')) {
          li.click();
        }
        return; // 한 번만 선택
      }
    }
  }

  // 플레이어 로드 지연 뒤 최초 선택
  setTimeout(select1080, 1000);

  // 만약 퀄리티 리스트가 동적으로 다시 그려지면 재선택
  new MutationObserver(select1080).observe(document.body, {
    childList: true,
    subtree: true
  });
})();
