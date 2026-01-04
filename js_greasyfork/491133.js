// ==UserScript==
// @name         치지직 광고 스킵
// @namespace    http://tampermonkey.net/
// @version      0.2
// @match        https://chzzk.naver.com/*
// @license      MIT
// @description  치지직 광고가 페이지 이동마다 너무 자주 나와서 웹에서라도 빠른 스킵을.. (1초마다 체크라 잠깐은 뜰 수 있음)
// @author       EnochG1
// @downloadURL https://update.greasyfork.org/scripts/491133/%EC%B9%98%EC%A7%80%EC%A7%81%20%EA%B4%91%EA%B3%A0%20%EC%8A%A4%ED%82%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/491133/%EC%B9%98%EC%A7%80%EC%A7%81%20%EA%B4%91%EA%B3%A0%20%EC%8A%A4%ED%82%B5.meta.js
// ==/UserScript==

const CLICK_INTERVAL_TIME = 1 * 1000;
const findAndClickInterval = () => {
    const skipBtn = document.querySelector('button[data-role="skipBtn"].btn_skip');
      if (skipBtn) {
        document.querySelector('button[data-role="skipBtn"].btn_skip').click()
      }
    const videoElement = document.querySelector('video[data-role="videoEl"]');
    if (videoElement) {
        const endEvent = new Event('ended', {
            bubbles: true, // 버블링 허용 (상위 요소로 이벤트 전파)
            cancelable: false
        });

        // 비디오 요소에 이벤트를 강제로 발생시킵니다.
        videoElement.dispatchEvent(endEvent);
    }
}

const createCheckInterval = () => {
    setInterval(() => {
      findAndClickInterval();
    }, CLICK_INTERVAL_TIME);
}

window.addEventListener('load', () => {
    createCheckInterval();
});