// ==UserScript==
// @name         YouTube Timestamp Copy Button
// @match        https://www.youtube.com/*
// @grant        GM_setClipboard
// @license      MIT 
// @description  유튜브 초 복사
// @version 0.0.1.20250716032101
// @namespace https://greasyfork.org/users/1483086
// @downloadURL https://update.greasyfork.org/scripts/542684/YouTube%20Timestamp%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/542684/YouTube%20Timestamp%20Copy%20Button.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // 1. UI 생성
  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'absolute', top: '10px', right: '10px',
    padding: '8px', background: '#000a', color: '#fff',
    fontSize: '12px', borderRadius: '4px', zIndex: 9999
  });
  const timeLabel = document.createElement('span');
  timeLabel.textContent = '0.000초';
  const copyBtn = document.createElement('button');
  copyBtn.textContent = '복사';
  Object.assign(copyBtn.style, {
    marginLeft: '8px', padding: '2px 6px', cursor: 'pointer'
  });
  container.append(timeLabel, copyBtn);
  document.body.append(container);

  // 2. 클릭 시 클립보드 복사
  copyBtn.addEventListener('click', () => {
    const v = document.querySelector('video');
    if (!v) return;
    const txt = v.currentTime.toFixed(3);
    GM_setClipboard(txt);            // Tampermonkey 전용 API :contentReference[oaicite:1]{index=1}
    copyBtn.textContent = '복사됨';
    setTimeout(() => { copyBtn.textContent = '복사'; }, 1000);
  });

  // 3. 타임스탬프 실시간 표시
  setInterval(() => {
    const v = document.querySelector('video');
    if (v) timeLabel.textContent = v.currentTime.toFixed(3) + '초';
  }, 100);
})();
