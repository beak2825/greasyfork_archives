// ==UserScript==
// @name          YouTube 광고 링크 얻기
// @namespace     YouTube 광고 링크 얻기
// @version       0.1
// @description   영상 우클릭 → 전문 통계 → YouTube 광고 링크 얻기
// @match         *://*.youtube.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @author        mickey90427 <mickey90427@naver.com>
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/534761/YouTube%20%EA%B4%91%EA%B3%A0%20%EB%A7%81%ED%81%AC%20%EC%96%BB%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/534761/YouTube%20%EA%B4%91%EA%B3%A0%20%EB%A7%81%ED%81%AC%20%EC%96%BB%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const interval = setInterval(() => {
    const panel = document.querySelector('.html5-video-info-panel-content');
    const closeBtn = document.querySelector('.html5-video-info-panel-close');

    if (panel && closeBtn && !document.querySelector('#open-video-id-btn')) {
      const btn = document.createElement('button');
      btn.id = 'open-video-id-btn';
      btn.textContent = 'YouTube 광고 링크 얻기';
      btn.style.marginRight = '6px';
      btn.style.padding = '6px 12px';
      btn.style.cursor = 'pointer';
      btn.className = 'ytp-button';

      btn.onclick = () => {
        const textSpan = panel.querySelector('.ytp-sfn-cpn');
        if (textSpan) {
          const fullText = textSpan.textContent.trim();
          const videoId = fullText.split('/')[0].trim();
          const url = `https://www.youtube.com/watch?v=${videoId}`;
          window.open(url, '_blank');
        } else {
          alert('Video ID를 찾을 수 없습니다.');
        }
      };

      closeBtn.parentElement.insertBefore(btn, closeBtn);
      console.log('영상 새 탭 열기 버튼 추가됨');
    }
  }, 1000);
})();
