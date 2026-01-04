// ==UserScript==
// @name        치지직 광고 자동 스킵
// @namespace   qkqWkd
// @match       https://chzzk.naver.com/*
// @version     0.3
// @author      qkqWkd
// @description 치지직 방송에서 나오는 광고를 자동으로 스킵해주는 스크립트입니다.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/482706/%EC%B9%98%EC%A7%80%EC%A7%81%20%EA%B4%91%EA%B3%A0%20%EC%9E%90%EB%8F%99%20%EC%8A%A4%ED%82%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/482706/%EC%B9%98%EC%A7%80%EC%A7%81%20%EA%B4%91%EA%B3%A0%20%EC%9E%90%EB%8F%99%20%EC%8A%A4%ED%82%B5.meta.js
// ==/UserScript==

const CLICK_INTERVAL_TIME = 5 * 1000;
const CREATE_INTERVAL_TIME = 1 * 60 * 60 * 1000;

const clickEvent = new Event('click');

let initialCall = true;
let intevalId = null;

const findAndClickInterval = (intervalId) => {
    const skipBtn = document.querySelector('button[data-role="skipBtn"].btn_skip');
      if (skipBtn) {
        initialCall = false;
        
        const skipBtnStyle = window.getComputedStyle(skipBtn);
        if (skipBtnStyle.getPropertyValue('display') === 'block') {
          skipBtn.dispatchEvent(clickEvent);
          setTimeout(() => {
            createCheckInterval();
          }, CREATE_INTERVAL_TIME);
          clearInterval(intervalId);
        }
      }
      
      if (initialCall) clearInterval(intervalId);
}

const createCheckInterval = () => {
    intervalId = setInterval(() => {
      findAndClickInterval(intervalId);
    }, CLICK_INTERVAL_TIME);
}

window.addEventListener('load', () => {
    createCheckInterval();
});