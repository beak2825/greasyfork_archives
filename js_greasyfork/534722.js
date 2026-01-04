// ==UserScript==
// @name          neal.fun 클리커 매크로 & 클리커
// @namespace     neal.fun 클리커 매크로 & 클리커
// @match         *://neal.fun/stimulation-clicker/
// @version       0.1
// @description   https://neal.fun/stimulation-clicker 자동 클릭
// @author        mickey90427 <mickey90427@naver.com>
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/534722/nealfun%20%ED%81%B4%EB%A6%AC%EC%BB%A4%20%EB%A7%A4%ED%81%AC%EB%A1%9C%20%20%ED%81%B4%EB%A6%AC%EC%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/534722/nealfun%20%ED%81%B4%EB%A6%AC%EC%BB%A4%20%EB%A7%A4%ED%81%AC%EB%A1%9C%20%20%ED%81%B4%EB%A6%AC%EC%BB%A4.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let clicking = false;
  let frameId = null;

  // 토글 버튼 생성
  const btn = document.createElement('button');
  btn.innerText = '오토클릭 OFF';
  btn.style.position = 'fixed';
  btn.style.left = '10px';
  btn.style.bottom = '10px';
  btn.style.zIndex = 9999;
  btn.style.padding = '10px';
  btn.style.backgroundColor = '#800';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '5px';
  btn.style.cursor = 'pointer';
  document.body.appendChild(btn);

  // 클릭 루프 함수
  function clickLoop() {
    if (!clicking) return;

    const clickButton = document.querySelector('button.main-btn');
    if (clickButton) clickButton.click();

    frameId = requestAnimationFrame(clickLoop);
  }

  // 버튼 클릭 시 오토클릭 on/off
  btn.addEventListener('click', () => {
    clicking = !clicking;
    btn.innerText = clicking ? '오토클릭 ON' : '오토클릭 OFF';
    btn.style.backgroundColor = clicking ? '#080' : '#800';

    if (clicking) {
      clickLoop();
    } else {
      cancelAnimationFrame(frameId);
    }
  });
})();
