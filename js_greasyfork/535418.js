// ==UserScript==
// @name         RealClass Auto Lecture Player v1.0.3
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  인젝션여부 체크
// @match        *://realclass.co.kr/new/class/*
// @match        *://realclass.co.kr/new/class/*?*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535418/RealClass%20Auto%20Lecture%20Player%20v103.user.js
// @updateURL https://update.greasyfork.org/scripts/535418/RealClass%20Auto%20Lecture%20Player%20v103.meta.js
// ==/UserScript==
console.log('🔥 RC userscript injected');
(function() {
  'use strict';

  // ---- 상수 정의 ----
  const INTERVAL       = 1000;
  const NEXT_STAGE_TXT = '다음 단계로';

  const DAY_BTN_SEL    = 'div[data-event="class_day_btn"]';
  const DAY_TEXT_SEL   = 'p';
  const MODULE_WRAP    = 'div.LuMWM';
  const PLAY_BTN_SEL   = 'button[aria-label="play"], button[title="재생"]';
  const MUTE_BTN_SEL   = 'button[aria-label="mute"], button[title="음소거"]';
  const VIDEO_SEL      = 'video';
  const PROGRESS_SEL   = 'div[class*="PddST"] > div';

  const parts      = location.pathname.split('/');
  const courseRoot = parts.slice(0,4).join('/');
  const baseURL    = location.origin + courseRoot;

  // ---- 전역 상태 변수 ----
  let timer      = null;
  let stage      = 'navigate';
  let currentDay = 0;

  // ---- UI 생성 함수 ----
  function createUI() {
    // 컨테이너
    const uiContainer = document.createElement('div');
    uiContainer.id = 'rc-ui';
    uiContainer.style = `
      position: fixed;
      top: 10px; right: 10px;
      background: rgba(255,255,255,0.95);
      border: 2px solid #f90;
      padding: 10px;
      z-index: 2147483647;
      font-family: sans-serif;
      font-size: 14px;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    `;
    uiContainer.innerHTML = `
      <label style="margin-right:8px">
        시작 일차:
        <input id="rc-day-input" type="number" min="1" value="1" style="width:50px">
      </label>
      <button id="rc-start-btn" style="margin-right:6px">▶ 시작</button>
      <button id="rc-stop-btn">■ 중지</button>
    `;
    document.body.appendChild(uiContainer);

    // 로그 박스
    const logBox = document.createElement('pre');
    logBox.id = 'rc-log';
    logBox.style = `
      position: fixed;
      bottom: 10px; right: 10px;
      width: 320px; height: 200px;
      overflow-y: auto;
      background: rgba(0,0,0,0.8);
      color: #0f0;
      padding: 8px;
      font-size: 12px;
      line-height: 1.2;
      z-index: 2147483647;
      border-radius: 4px;
    `;
    document.body.appendChild(logBox);
  }

  // ---- 로그 함수 ----
  function log(msg) {
    const time = new Date().toLocaleTimeString();
    const line = `[${time}] ${msg}`;
    console.log(line);
    const logBox = document.getElementById('rc-log');
    if (logBox) {
      logBox.textContent += line + '\n';
      logBox.scrollTop = logBox.scrollHeight;
    }
  }

  // ---- 상태 머신 함수들 ----
  function waitForElement(sel, timeout = 8000) {
    return new Promise((resolve, reject) => {
      const interval = 200;
      let elapsed = 0;
      const id = setInterval(() => {
        const el = document.querySelector(sel);
        if (el) {
          clearInterval(id);
          resolve(el);
        } else if ((elapsed += interval) >= timeout) {
          clearInterval(id);
          reject(new Error(`Timeout waiting for ${sel}`));
        }
      }, interval);
    });
  }

  function processVideo() {
    const vid = document.querySelector(VIDEO_SEL);
    if (vid) {
      vid.muted = true;
      vid.play().catch(()=>{});
    }
    document.querySelector(PLAY_BTN_SEL)?.click();
    document.querySelector(MUTE_BTN_SEL)?.click();
    const bar = document.querySelector(PROGRESS_SEL);
    if (bar && bar.style.width === '100%') {
      log('[Auto] 1단계 완료');
      stage = 'afterVideo';
    }
  }

function afterVideo() {
    // “다음 단계로” 버튼이 보이면 바로 클릭
    const nextBtn = [...document.querySelectorAll('button')]
                      .find(b => b.textContent.trim() === NEXT_STAGE_TXT);
    if (nextBtn) {
      log('[Auto] 1단계 팝업 → 다음 단계');
      nextBtn.click();
      stage = 'sentence';
    }
  }

  function processSentence() {
   // 1) “다음문장” 버튼 클릭
    const sentenceBtn = document.querySelector('button[direction="next"]')
                      || [...document.querySelectorAll('button')]
                           .find(b => b.textContent.includes('다음문장'));
    if (sentenceBtn) {
      sentenceBtn.click();
      return;
    }

    // 2) “다음 단계로” 버튼이 보이면 클릭
    const nextBtn = [...document.querySelectorAll('button')]
                      .find(b => b.textContent.trim() === NEXT_STAGE_TXT);
    if (nextBtn) {
      log('[Auto] 2단계 팝업 → 다음 단계');
      nextBtn.click();
      stage = 'afterSentence';
    }
  }
  function afterSentence() {
    sessionStorage.setItem('rcLastDay', String(currentDay));
    log(`[Auto] ${currentDay}일차 완료 저장 → 루트 복귀`);
    window.location.href = baseURL;
    stage = 'navigate';
  }

  async function processNavigate() {
    const next = currentDay + 1;
    const days = [...document.querySelectorAll(DAY_BTN_SEL)];
    const target = days.find(d => {
      const p = d.querySelector(DAY_TEXT_SEL);
      return p && p.textContent.trim() === `${next}일차`;
    });
    if (!target) {
      log('[Auto] 다음 일차 없음 — 종료');
      clearInterval(timer);
      return;
    }

    log(`[Auto] ${next}일차 헤더 클릭`);
    target.click();

    try {
      await waitForElement(MODULE_WRAP);
      log('[Auto] 모듈 컨테이너 감지');

      const hdr = [...document.querySelectorAll('h3')]
                    .find(h => h.textContent.trim() === '강의');
      if (!hdr) throw new Error('“강의” 그룹 미검출');

      const group = hdr.closest('div.jviVpY') || hdr.parentElement.parentElement;
      const link  = group.querySelector('a[data-event="class_study_link"]');
      if (!link) throw new Error('강의 링크 미검출');

      currentDay = next;
      sessionStorage.setItem('rcLastDay', String(currentDay));

      log('[Auto] 강의 첫 링크 클릭 → 재생 페이지');
      link.click();
      stage = 'video';
    }
    catch (e) {
      log(`[Auto] processNavigate 오류: ${e.message || e}`);
      clearInterval(timer);
    }
  }

  function mainLoop() {
    switch (stage) {
      case 'video':        processVideo();     break;
      case 'afterVideo':   afterVideo();       break;
      case 'sentence':     processSentence();  break;
      case 'afterSentence':afterSentence();    break;
      case 'navigate':     processNavigate();  break;
    }
  }

  // ---- 버튼 바인딩 & 자동 재개 ----
  function bindButtonsAndResume() {
    const dayInput = document.getElementById('rc-day-input');
    const startBtn = document.getElementById('rc-start-btn');
    const stopBtn  = document.getElementById('rc-stop-btn');

    // 이전값 반영
    const saved = parseInt(sessionStorage.getItem('rcLastDay'), 10);
    if (!isNaN(saved) && saved >= 0) {
      dayInput.value = saved + 1;
    }

    startBtn.addEventListener('click', () => {
      if (timer) return;
      const v = parseInt(dayInput.value, 10);
      if (!isNaN(v) && v > 0) {
        currentDay = v - 1;
        sessionStorage.setItem('rcLastDay', String(currentDay));
      }
      sessionStorage.setItem('rcRunning', '1');
      stage = (location.pathname === courseRoot ? 'navigate' : 'video');
      timer = setInterval(mainLoop, INTERVAL);
      log('▶ 자동 진행 시작');
    });

    stopBtn.addEventListener('click', () => {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
      sessionStorage.setItem('rcRunning', '0');
      log('■ 자동 진행 중지');
    });

    // 자동 재개
    if (sessionStorage.getItem('rcRunning') === '1') {
      setTimeout(() => {
        startBtn.click();
        log('▶ 자동 진행 재개');
      }, 200);
    }
  }

  // ---- 초기화 함수 ----
  function init() {
    createUI();
    bindButtonsAndResume();
    log('초기화 완료. ▶ 시작을 눌러주세요.');
  }

  // ---- body 생성 감지 후 init 호출 ----
  const bodyObserver = new MutationObserver((mutations, obs) => {
    if (document.body) {
      obs.disconnect();
      init();
    }
  });
  bodyObserver.observe(document.documentElement, { childList: true, subtree: true });

})();
