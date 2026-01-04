// ==UserScript==
// @name        7대업무지구변경
// @namespace   Violentmonkey Scripts
// @match       https://luciferhong.github.io/luciferhong*
// @grant       none
// @version     1.00
// @description 2025. 2. 04. 오후 15:00:03
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/527914/7%EB%8C%80%EC%97%85%EB%AC%B4%EC%A7%80%EA%B5%AC%EB%B3%80%EA%B2%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/527914/7%EB%8C%80%EC%97%85%EB%AC%B4%EC%A7%80%EA%B5%AC%EB%B3%80%EA%B2%BD.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // 변수 재정의
    destinations[7].name = '고속터미널역';
    destinations[7].lat = 37.5049142;
    destinations[7].lng = 127.0049151;

    const checkbox = document.getElementById('chk7');
    if (checkbox && checkbox.type === 'checkbox') {
      checkbox.checked = true; // 체크 상태로 변경
      console.log('id가 chk7인 체크박스를 체크 상태로 변경했습니다.');
    }

    const changeDMCToExpressTerminal = () => {
      document
        .querySelectorAll('.checkbox-container label')
        .forEach((label) => {
          const input = label.querySelector('input[type="checkbox"]');
          if (input && label.textContent.trim() === 'DMC역') {
            label.textContent = '고속터미널역';
            label.insertBefore(input, label.firstChild); // 체크박스를 라벨 안의 처음 위치로 이동
          }
        });
    };

    changeDMCToExpressTerminal();
  })();