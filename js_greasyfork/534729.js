// ==UserScript==
// @name          elucidation.github.io 클리커 매크로 & 클리커
// @namespace     elucidation.github.io 클리커 매크로 & 클리커
// @match         *://elucidation.github.io/ClickerJs/
// @version       0.1
// @description   https://elucidation.github.io/ClickerJs/ 자동 클릭
// @author        mickey90427 <mickey90427@naver.com>
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/534729/elucidationgithubio%20%ED%81%B4%EB%A6%AC%EC%BB%A4%20%EB%A7%A4%ED%81%AC%EB%A1%9C%20%20%ED%81%B4%EB%A6%AC%EC%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/534729/elucidationgithubio%20%ED%81%B4%EB%A6%AC%EC%BB%A4%20%EB%A7%A4%ED%81%AC%EB%A1%9C%20%20%ED%81%B4%EB%A6%AC%EC%BB%A4.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let clicking = false;
  let frameId = null;

  // 왼쪽 하단 토글 버튼 생성
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

  function clickLoop() {
    if (!clicking) return;

    // 메인 버튼 클릭
    const mainBtn = document.querySelector('button[data-reactid=".0.2"]');
    if (mainBtn) mainBtn.click();

    // 업그레이드 버튼들 모두 클릭
    const upgradeButtons = document.querySelectorAll('ul[data-reactid=".0.3.0"] button');
    upgradeButtons.forEach(btn => btn.click());

    frameId = requestAnimationFrame(clickLoop);
  }

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
