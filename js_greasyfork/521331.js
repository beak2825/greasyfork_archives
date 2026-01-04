// ==UserScript==
// @name         SOOP 다시보기 라이브 당시 시간 표시
// @namespace    http://tampermonkey.net/
// @version      5.2.1
// @description  SOOP 다시보기에서 생방송 당시 시간을 표시/이동 (최근 기록, 셀렉터 폴백, 접근성, 최적화 + 클립보드 미리보기)
// @author       WakViewer
// @match        https://vod.sooplive.co.kr/player/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.sooplive.co.kr
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521331/SOOP%20%EB%8B%A4%EC%8B%9C%EB%B3%B4%EA%B8%B0%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%8B%B9%EC%8B%9C%20%EC%8B%9C%EA%B0%84%20%ED%91%9C%EC%8B%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/521331/SOOP%20%EB%8B%A4%EC%8B%9C%EB%B3%B4%EA%B8%B0%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%8B%B9%EC%8B%9C%20%EC%8B%9C%EA%B0%84%20%ED%91%9C%EC%8B%9C.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------------- Config & Selectors ----------------
  const SELECTORS = {
    startTimeTip: "span.broad_time[tip*='방송시간']",
    infoUL: ".broadcast_information .cnt_info ul",
  };
  const CURRENT_TIME_CANDIDATES = [
    "span.time-current", ".time-current",
    ".player .time-current", ".time_display .time-current",
    '[aria-label="Current time"]', '[data-role="current-time"]'
  ];
  const DURATION_CANDIDATES = [
    "span.time-duration", ".time-duration",
    ".player .time-duration", ".time_display .time-duration",
    '[aria-label="Duration"]', '[data-role="duration"]'
  ];

  const EDIT_THRESHOLD_SEC  = 180;
  const UPDATE_INTERVAL_MS  = 500;
  const HISTORY_KEY         = 'wv_soop_dt_history';
  const HISTORY_MAX         = 5;

  // ⏱ 사이트 기준 타임존(방송시간 tip 파싱용)
  const SITE_TZ = 'Asia/Seoul';
  // 🔒 Live 라벨 고정폭(px)
  const LIVE_LABEL_WIDTH_PX = 240;
  // 📋 클립보드 읽기 캐시(ms)
  const CLIPBOARD_CACHE_MS = 1200;

  // ---------------- State ----------------
  let startTime = null, endTime = null;
  let currentLiveTimeStr = '';
  let updateTimer = null, routeObserver = null, initDoneForHref = null;
  let timeObserver = null;
  let lastActiveEl = null;

  // ARIA announcer(복사 때만 말하기)
  let liveAnnouncerEl = null;
  function ensureAnnouncer(){
    if (liveAnnouncerEl) return liveAnnouncerEl;
    liveAnnouncerEl = document.createElement('div');
    liveAnnouncerEl.setAttribute('aria-live','polite');
    liveAnnouncerEl.setAttribute('role','status');
    // 시각적으로 숨김
    Object.assign(liveAnnouncerEl.style, {
      position:'absolute', width:'1px', height:'1px', margin:'-1px', border:'0', padding:'0',
      clip:'rect(0 0 0 0)', overflow:'hidden'
    });
    document.body.appendChild(liveAnnouncerEl);
    return liveAnnouncerEl;
  }
  function announce(msg){
    const el = ensureAnnouncer();
    // 동일 문구도 다시 읽히도록 리셋
    el.textContent = '';
    setTimeout(()=> { el.textContent = String(msg ?? ''); }, 10);
  }

  // 클립보드 캐시
  let _clipCacheVal = '';
  let _clipCacheErr = false;
  let _clipCachedAt = 0;

  // ---------------- Tiny utils ----------------
  const $ = (sel, root=document) => root.querySelector(sel);
  const p2 = (n)=> String(n).padStart(2,'0');
  const fmtDate = (d) => `${d.getFullYear()}-${p2(d.getMonth()+1)}-${p2(d.getDate())}, ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`;
  const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const esc = (s='') => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const waitFor = (selector, {timeout=10000, root=document}={}) =>
    new Promise((resolve, reject) => {
      const found = $(selector, root);
      if (found) return resolve(found);
      const obs = new MutationObserver(() => {
        const el2 = $(selector, root);
        if (el2) { obs.disconnect(); resolve(el2); }
      });
      obs.observe(root.body || root, { childList:true, subtree:true });
      if (timeout > 0) setTimeout(() => { obs.disconnect(); reject(new Error('waitFor timeout: '+selector)); }, timeout);
    });

  const pickFirst = (qList, root=document) => {
    for (const q of qList) { const el = root.querySelector(q); if (el) return el; }
    return null;
  };

  function getCurrentTimeEl() {
    // 컨테이너 우선
    const wrap = getTimeWrap();
    if (wrap) {
      const scoped = pickFirst(CURRENT_TIME_CANDIDATES, wrap);
      if (scoped) return scoped;
    }
    // 폴백
    let el = pickFirst(CURRENT_TIME_CANDIDATES);
    if (el) return el;
    const nodes = Array.from(document.querySelectorAll('span,div,time'))
      .filter(n => /:\d{2}/.test((n.textContent||'').trim()))
      .filter(n => (n.textContent||'').trim().length <= 8);
    return nodes[0] || null;
  }

  // ---- duration: 컨테이너 한정 → 폴백 (보강)
  function getTimeWrap(){
    return document.querySelector(
      '#player .player_ctrlBox .ctrlBox .ctrl .time_display,' +
      '#player .time_display,' +
      '.player .time_display,' +
      '.time_display'
    );
  }
  function isTimeLikeText(t){ return /^\d{1,2}:\d{2}(?::\d{2})?$/.test((t||'').trim()); }

  function getDurationElScoped(){
    const wrap = getTimeWrap();
    if (!wrap) return null;
    const nodes = Array.from(wrap.querySelectorAll('span,div,time')).filter(el => isTimeLikeText(el.textContent));
    // 명시 셀렉터 우선
    const explicit = nodes.find(n => n.matches('.time-duration,[aria-label="Duration"],[data-role="duration"]'));
    if (explicit) return explicit;
    // 현재시간 제외 후 마지막(보통 "현재 / 전체")
    const nonCurrent = nodes.filter(n => !n.matches('.time-current,[aria-label="Current time"],[data-role="current-time"]'));
    if (nonCurrent.length === 1) return nonCurrent[0];
    if (nonCurrent.length > 1) return nonCurrent[nonCurrent.length - 1];
    return null;
  }
  function getDurationElRobust(){
    const scoped = getDurationElScoped();
    if (scoped) return scoped;

    // 기본 후보
    const basic = pickFirst(DURATION_CANDIDATES);
    if (basic) return basic;

    // 최후 폴백: 전역 휴리스틱
    const all = Array.from(document.querySelectorAll('span,div,time')).filter(el => isTimeLikeText(el.textContent));
    const currentEl = getCurrentTimeEl();
    const curTxt = (currentEl?.textContent||'').trim();
    const scored = all
      .filter(el => el !== currentEl && (el.textContent||'').trim() !== curTxt)
      .map(el => {
        const t = (el.textContent||'').trim();
        let s = 0;
        if (/^\d{1,2}:\d{2}:\d{2}$/.test(t)) s += 3;
        const meta = ((el.className||'') + ' ' + (el.getAttribute('aria-label')||'') + ' ' + (el.getAttribute('data-role')||'')).toLowerCase();
        if (/duration|total|length/.test(meta)) s += 5;
        return { el, s };
      })
      .sort((a,b)=> b.s - a.s);
    return scored[0]?.el || null;
  }

  // ---------------- Parse helpers ----------------
  // ▶ tip의 'YYYY-MM-DD HH:mm:ss'를 사이트 기준 타임존(SITE_TZ)으로 해석해 UTC ms로 보정
  const parseTipTimes = (tip) => {
    const m = tip && tip.match(
      /방송시간\s*:\s*(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})\s*~\s*(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/
    );
    if (!m) return null;
    const sComp = { y:+m[1],  M:+m[2],  d:+m[3],  h:+m[4],  m:+m[5],  s:+m[6]  };
    const eComp = { y:+m[7],  M:+m[8],  d:+m[9],  h:+m[10], m:+m[11], s:+m[12] };
    const sMs = zonedComponentsToUTCms(sComp, SITE_TZ);
    const eMs = zonedComponentsToUTCms(eComp, SITE_TZ);
    return { start: new Date(sMs), end: new Date(eMs) };
  };

  const parseHMSFlexible = (text) => {
    if (!text) return 0;
    const parts = text.trim().split(':').map(Number);
    if (parts.some(isNaN)) return 0;
    if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
    if (parts.length === 2) return parts[0]*60 + parts[1];
    return 0;
  };

  // --------- Timezone transforms ----------
  function zonedComponentsToUTCms(comp, timeZone) {
    const utcGuess = Date.UTC(comp.y, comp.M-1, comp.d, comp.h, comp.m, comp.s);
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone, year:'numeric', month:'2-digit', day:'2-digit',
      hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false
    });
    const parts = fmt.formatToParts(new Date(utcGuess));
    const get = t => Number(parts.find(p => p.type === t).value);
    const tzY=get('year'), tzM=get('month'), tzD=get('day'), tzH=get('hour'), tzMin=get('minute'), tzS=get('second');
    const tzEpoch = Date.UTC(tzY, tzM-1, tzD, tzH, tzMin, tzS);
    const offset = tzEpoch - utcGuess;
    return Date.UTC(comp.y, comp.M-1, comp.d, comp.h, comp.m, comp.s) - offset;
  }
  function startOfDayZoned(date, timeZone) {
    const f = new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'});
    const p = f.formatToParts(date);
    const y = +p.find(v=>v.type==='year').value;
    const M = +p.find(v=>v.type==='month').value;
    const d = +p.find(v=>v.type==='day').value;
    return zonedComponentsToUTCms({y,M,d,h:0,m:0,s:0}, timeZone);
  }
  function listDaysInRange(start, end) {
    const res = [];
    if (!start || !end) return res;
    const endDayMs = startOfDayZoned(end, userTZ);
    let curMs = startOfDayZoned(start, userTZ);
    let guard = 0;
    while (curMs <= endDayMs && guard < 370) {
      const d = new Date(curMs);
      const f = new Intl.DateTimeFormat('en-CA',{timeZone:userTZ,year:'numeric',month:'2-digit',day:'2-digit'});
      const p = f.formatToParts(d);
      res.push({ y:+p.find(v=>v.type==='year').value, M:+p.find(v=>v.type==='month').value, d:+p.find(v=>v.type==='day').value });
      curMs += 24*3600*1000;
      guard++;
    }
    return res;
  }

  // --------------- Natural input parse ---------------
  function normalizeSpaces(s){ return s.replace(/\u00A0/g,' ').replace(/\s+/g,' ').trim(); }
  function inferYearFromYY(yy) {
    const yys = [startTime.getFullYear()%100, endTime.getFullYear()%100];
    if (yy === yys[0]) return startTime.getFullYear();
    if (yy === yys[1]) return endTime.getFullYear();
    return 2000 + yy;
  }
  function parseInputToTarget(text) {
    if (!text) return null;
    let s = normalizeSpaces(text).replace(/,/g,' ');

    // 한국어 날짜/시간
    const korDate = s.match(/(?:(\d{2,4})\s*년\s*)?(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
    const korTime = s.match(/(\d{1,2})\s*시(?:\s*(\d{1,2})\s*분)?(?:\s*(\d{1,2})\s*초)?/);
    if (korDate || korTime) {
      let y, M, d, h=0, m=0, sec=0;
      if (korDate) {
        const yyRaw = korDate[1];
        M = +korDate[2]; d = +korDate[3];
        if (yyRaw) y = (yyRaw.length===2) ? inferYearFromYY(+yyRaw) : +yyRaw;
        else y = startTime.getFullYear();
      } else if (korTime) {
        h = +korTime[1]; m = korTime[2]?+korTime[2]:0; sec = korTime[3]?+korTime[3]:0;
        if (h>23||m>59||sec>59) return null;
        const days = listDaysInRange(startTime, endTime);
        for (const dc of days) {
          const ms = zonedComponentsToUTCms({y:dc.y,M:dc.M,d:dc.d,h,m,s:sec}, userTZ);
          const cand = new Date(ms);
          if (cand >= startTime && cand <= endTime) return { comp:{y:dc.y,M:dc.M,d:dc.d,h,m,s:sec} };
        }
        return null;
      }
      if (korTime) { h=+korTime[1]; m=korTime[2]?+korTime[2]:0; sec=korTime[3]?+korTime[3]:0; }
      if (h>23||m>59||sec>59) return null;
      if (!y||!M||!d) return null;
      return { comp:{y,M,d,h,m,s:sec} };
    }

    let m;
    m = s.match(/^(\d{4})[-.](\d{1,2})[-.](\d{1,2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (m) { const y=+m[1], M=+m[2], d=+m[3], h=+m[4], mm=+m[5], ss=m[6]?+m[6]:0; if (h>23||mm>59||ss>59) return null;
      return { comp:{y,M,d,h,m:mm,s:ss} }; }
    m = s.match(/^(\d{2})[-.](\d{1,2})[-.](\d{1,2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (m) { const y=inferYearFromYY(+m[1]), M=+m[2], d=+m[3], h=+m[4], mm=+m[5], ss=m[6]?+m[6]:0; if (h>23||mm>59||ss>59) return null;
      return { comp:{y,M,d,h,m:mm,s:ss} }; }
    m = s.match(/^(\d{1,2})[-.](\d{1,2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (m) { const M=+m[1], d=+m[2], h=+m[3], mm=+m[4], ss=m[5]?+m[5]:0; if (h>23||mm>59||ss>59) return null;
      const candidates=[startTime.getFullYear(), endTime.getFullYear()];
      for (const y of [...new Set(candidates)]) {
        const ms=zonedComponentsToUTCms({y,M,d,h,m:mm,s:ss}, userTZ); const cand=new Date(ms);
        if (cand>=startTime && cand<=endTime) return { comp:{y,M,d,h,m:mm,s:ss} };
      }
      return { comp:{ y:startTime.getFullYear(), M, d, h, m:mm, s:ss } }; }
    m = s.match(/^(\d{4}-\d{1,2}-\d{1,2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (m) { const [y,M,d]=m[1].split('-').map(Number); const h=+m[2], mm=+m[3], ss=m[4]?+m[4]:0; if (h>23||mm>59||ss>59) return null;
      return { comp:{ y,M,d,h,m:mm,s:ss } }; }
    const t = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (t && startTime && endTime) {
      const hh=+t[1], mm=+t[2], ss=t[3]?+t[3]:0; if (hh>23||mm>59||ss>59) return null;
      const days=listDaysInRange(startTime, endTime);
      for (const d of days) {
        const candMs=zonedComponentsToUTCms({ y:d.y,M:d.M,d:d.d,h:hh,m:mm,s:ss }, userTZ);
        const cand=new Date(candMs);
        if (cand>=startTime && cand<=endTime) return { comp:{ y:d.y,M:d.M,d:d.d,h:hh,m:mm,s:ss } };
      }
      return null;
    }
    const onlyKorTime = s.match(/^(\d{1,2})\s*시(?:\s*(\d{1,2})\s*분)?(?:\s*(\d{1,2})\s*초)?$/);
    if (onlyKorTime && startTime && endTime) {
      const hh=+onlyKorTime[1], mm=onlyKorTime[2]?+onlyKorTime[2]:0, ss=onlyKorTime[3]?+onlyKorTime[3]:0;
      if (hh>23||mm>59||ss>59) return null;
      const days=listDaysInRange(startTime, endTime);
      for (const d of days) {
        const candMs=zonedComponentsToUTCms({ y:d.y,M:d.M,d:d.d,h:hh,m:mm,s:ss }, userTZ);
        const cand=new Date(candMs);
        if (cand>=startTime && cand<=endTime) return { comp:{y:d.y,M:d.M,d:d.d,h:hh,m:mm,s:ss} };
      }
      return null;
    }
    const korDateAndHm = s.match(/(?:(\d{2,4})\s*년\s*)?(\d{1,2})\s*월\s*(\d{1,2})\s*일\s+(\d{1,2}):(\d{2})$/);
    if (korDateAndHm) {
      let y = korDateAndHm[1] ? (korDateAndHm[1].length===2 ? inferYearFromYY(+korDateAndHm[1]) : +korDateAndHm[1]) : startTime.getFullYear();
      const M = +korDateAndHm[2], d = +korDateAndHm[3], h = +korDateAndHm[4], m = +korDateAndHm[5];
      if (h>23||m>59) return null;
      return { comp:{ y,M,d,h,m,s:0 } };
    }
    m = s.match(/^(\d{1,2})[.-](\d{1,2})\s+(\d{1,2}):(\d{2})$/);
    if (m) {
      const M=+m[1], d=+m[2], h=+m[3], mm=+m[4];
      if (h>23||mm>59) return null;
      const candidates=[startTime.getFullYear(), endTime.getFullYear()];
      for (const y of [...new Set(candidates)]) {
        const ms=zonedComponentsToUTCms({y,M,d,h,m:mm,s:0}, userTZ);
        const cand=new Date(ms);
        if (cand>=startTime && cand<=endTime) return { comp:{y,M,d,h,m:mm,s:0} };
      }
      return { comp:{ y:startTime.getFullYear(), M, d, h, m:mm, s:0 } };
    }
    return null;
  }

  // ---------------- Toast ----------------
  function showToastMessage(message, isError=false) {
    const container =
      document.querySelector('#toastMessage') ||
      document.querySelector('#toast-message') ||
      document.querySelector('.toastMessage') ||
      document.querySelector('.toast-message') ||
      document.querySelector('.toast_container, .toast-container, .toast-wrap, .toast_wrap');

    if (container) {
      const wrap = document.createElement('div');
      const text = document.createElement('p');
      text.textContent = String(message ?? '');
      wrap.appendChild(text); container.appendChild(wrap);
      setTimeout(() => { if (wrap.parentNode === container) container.removeChild(wrap); }, 2000);
      return;
    }
    try { window.dispatchEvent(new CustomEvent('toast-message', { detail:{ message:String(message ?? ''), type:isError?'error':'info' } })); } catch {}
    alert(String(message ?? ''));
  }

  // ---------------- History store ----------------
  const loadHistory = () => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch { return []; }
  };
  const saveHistory = (arr) => localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(0, HISTORY_MAX)));
  const addHistory  = (item) => {
    const list = loadHistory().filter(v => v !== item);
    list.unshift(item);
    saveHistory(list);
  };
  const clearHistory = () => saveHistory([]);

  // ---------------- Modal ----------------
  let jumpModalHost = null;

  // 공유 URL 파라미터 중복 방지
  function setChangeSecondParam(url, sec){
    // 혹시 모를 유사 키도 정리
    ['change_second','t','time','sec'].forEach(k => url.searchParams.delete(k));
    url.searchParams.set('change_second', String(sec));
    return url;
  }

  // 클립보드 읽기(1.2초 캐시)
  async function readClipboardCached(){
    const now = Date.now();
    if (now - _clipCachedAt < CLIPBOARD_CACHE_MS) {
      return { text:_clipCacheVal, error:_clipCacheErr };
    }
    try {
      const text = (await navigator.clipboard.readText()) || '';
      _clipCacheVal = text; _clipCacheErr = false; _clipCachedAt = now;
      return { text, error:false };
    } catch {
      _clipCacheVal = ''; _clipCacheErr = true; _clipCachedAt = now;
      return { text:'', error:true };
    }
  }

  function openJumpModal(triggerBtn) {
    lastActiveEl = triggerBtn || document.activeElement;

    const startStr = fmtDate(startTime);
    const endStr   = fmtDate(endTime);
    const durEl = getDurationElRobust();
    const totalDuration = durEl ? parseHMSFlexible((durEl.textContent || '').trim()) : null;
    const expectedSec = Math.max(0, ((endTime - startTime)/1000) | 0);
    const isEditedLike = (totalDuration != null) && (totalDuration + EDIT_THRESHOLD_SEC < expectedSec);

    const editedBadgeHTML = isEditedLike
      ? `<span id="edit-badge" style="margin-left:90px;font-size:12px;color:#ffc107;background:#2a2f36;padding:2px 8px;border-radius:999px;">해당 다시보기는 시네티 같이보기 진행 또는 편집된 영상일 수 있습니다.</span>`
      : '';

    const hintBase = new Date(startTime.getTime() + 2*60*1000);
    const y = hintBase.getFullYear(), M = p2(hintBase.getMonth()+1), D = p2(hintBase.getDate());
    const H = p2(hintBase.getHours()), m = p2(hintBase.getMinutes()), s = p2(hintBase.getSeconds());
    const yy = String(y).slice(-2), kH = String(hintBase.getHours());
    const placeholderHint = `예: ${y}-${M}-${D}, ${H}:${m}:${s}  /  ${yy}.${M}.${D} ${H}:${m}  /  ${M}월 ${D}일 ${kH}시 ${m}분`;

    if (!jumpModalHost) {
      jumpModalHost = document.createElement('div');
      jumpModalHost.style.position = 'fixed';
      jumpModalHost.style.inset = '0';
      jumpModalHost.style.zIndex = '2147483647';
      jumpModalHost.attachShadow({ mode:'open' });
      document.documentElement.appendChild(jumpModalHost);
    }
    const root = jumpModalHost.shadowRoot; root.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = `
      :host { all: initial; }
      .backdrop { all: initial; position: fixed; inset: 0; background: rgba(0,0,0,.38); display: grid; place-items: center; }
      .card {
        all: initial; width: min(720px, 94vw); background: #1f2329; color: #e9edf3; border-radius: 14px;
        box-shadow: 0 20px 60px rgba(0,0,0,.45);
        font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", Helvetica, Arial, sans-serif;
        text-rendering: optimizeSpeed; font-size: 14px; line-height: 1.5; padding: 22px 24px 18px;
      }
      .titlebar { display:flex; align-items:center; justify-content:space-between; margin-bottom: 14px; }
      .title { font-weight: 800; font-size: 18px; letter-spacing: .1px; }
      .desc  { opacity: .85; margin-bottom: 12px; white-space: pre-line; }

      .section { margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,.08); }
      .section:first-of-type { margin-top: 0; padding-top: 0; border-top: none; }
      .section-title { display:flex; align-items:center; gap:8px; font-weight: 700; color:#dbe5f5; margin: 6px 0 8px; }
      .section-title::before { content:""; display:inline-block; width:14px; height:14px; border-radius:3px; background: linear-gradient(135deg, #3aa0ff, #8f77ff); }

      .row { display: grid; grid-template-columns: 160px 1fr; gap: 12px; align-items: center; margin: 8px 0; }
      .row > div:last-child { min-width: 0; }
      .label { opacity: .85; }

      .inputwrap { position: relative; display: flex; align-items: center; gap: 8px; }
      input[type="text"]{
        all: initial; background:#2a2f36; color:#e9edf3; padding:10px 12px; border-radius:10px; border:1px solid transparent; outline:none;
        font:13px/1.2 inherit; width:100%; box-sizing:border-box; display:block;
      }
      input[type="text"]:focus{ border-color:#048BFF; }

      .hist-panel { position: absolute; left: 0; right: 36px; top: calc(100% + 6px); background: #1f2329; border: 1px solid #2f3540; border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,.45); padding: 8px; z-index: 5; display: none; }
      .hist-panel.show { display: block; }
      .hist-item { display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:10px; cursor:pointer; }
      .hist-item:hover { background:#2a2f36; }
      .hist-ico { opacity:.9; }
      .hist-text { flex:1; pointer-events:none; }
      .ellipsis { overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
      .hist-del { all:initial; color:#9aa3ad; cursor:pointer; padding:2px 6px; border-radius:6px; margin-left:2px; }
      .hist-del:hover { background:#2a2f36; color:#e9edf3; }
      .divider { height:1px; background:#2a2f36; margin:6px 4px; }
      .hist-caption { font-size:11px; opacity:.7; padding:0 10px 4px; }

      /* 현재 클립보드 칩 */
      .hist-panel .hist-item[data-clip]{
        background:#2a2f36; border:1px solid #2a2f36;
        border-radius:9999px;
        margin-left: 8px;
        padding:4px 10px;
        line-height:14px;
        font-size:12px;
      }
      .hist-panel .hist-item[data-clip]:hover{ background:#343a43; border-color:#4b5563; }
      .hist-panel .hist-item[data-clip] .hist-ico{ font-size:12px; opacity:.9; }
      .hist-panel .hist-item[data-clip] .hist-text{
        color:#ffc107; font-weight:300;
        overflow:hidden; white-space:nowrap; text-overflow:ellipsis;
        font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", Helvetica, Arial, sans-serif;
      }
      /* 권한 실패 시 빨간 글자 */
      .hist-panel .hist-item[data-clip].error .hist-text{ color:#ff4d4f; }

      /* 둥근모서리 칩 모양 */
      .hist-chip{ background:#2a2f36; border:1px solid #3b414c; border-radius:10px; padding:8px 10px; margin-left: 8px;}
      .hist-chip:hover{ background:#343a43; }
      .hist-chip .hist-ico{ opacity:.9; }
      .hist-chip .hist-text{
        flex:1; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; font-size:12px;
      }

      .hist-footer { display:flex; justify-content:flex-end; padding-top:6px; }
      .hist-clear { all:initial; cursor:pointer; padding:6px 10px; border-radius:999px; background:#2a2f36; color:#e9edf3; font-size:12px; }
      .hist-clear:hover { background:#343a43; }

      .iconbtn{ all: initial; cursor:pointer; width:36px; height:36px; display:grid; place-items:center; border-radius:10px; background:#2a2f36; color:#e9edf3; user-select:none; }
      .iconbtn:hover{ background:#343a43; }

      .picker{ all: initial; position:absolute; right:0; top:calc(100% + 8px); background:#22262c; color:#e9edf3; border:1px solid #2f3540; border-radius:12px; box-shadow:0 16px 50px rgba(0,0,0,.45); padding:12px; z-index:4; min-width: 440px; font-family: inherit; text-rendering: inherit; }
      .picker[hidden]{ display:none !important; }
      .pick-row{ display:flex; align-items:center; gap:10px; margin-top:8px; flex-wrap:wrap; }
      .seg{ background:#2a2f36; border-radius:10px; padding:6px 10px; font-size:12px; }

      select{ all: initial; background:#2a2f36; color:#e9edf3; padding:8px 10px; border-radius:10px; border:1px solid transparent; outline:none; font:13px/1.2 inherit; }
      select:focus{ border-color:#048BFF; }

      input[type=number]::-webkit-outer-spin-button,
      input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      input[type=number] { -moz-appearance: textfield; }

      .numbox { display:flex; align-items:center; background:transparent; }
      .num{ all: initial; background:#2a2f36; color:#e9edf3; padding:8px 8px; border-radius:10px; border:1px solid transparent; outline:none; width:54px; text-align:center; font:13px/1.2 inherit; }
      .num:focus{ border-color:#048BFF; }
      .steppers { display:flex; flex-direction:column; gap:2px; margin-left:4px; }
      .step { all: initial; cursor:pointer; width:18px; height:16px; display:grid; place-items:center; border-radius:6px; background:#2a2f36; color:#e9edf3; font-size:10px; line-height:1; }
      .step:hover { background:#343a43; }
      .colon { opacity:.8; margin: 0 2px; }

      .pillbar, .tz, .hint { margin-left: 172px; }
      .pillbar { display:flex; gap:6px; margin-top: 12px; margin-bottom: 10px; flex-wrap:wrap; }
      .pill { all: initial; cursor:pointer; padding:6px 10px; border-radius:999px; background:#2a2f36; color:#e9edf3; font-size:12px; }
      .pill:hover { background:#343a43; }
      .pill.primary { background:#048BFF; color:#fff; }
      .pill.primary:hover { background:#048BFF; color:#fff; }

      .tz { font-size:12px; opacity:.8; margin-top: 14px; }
      .hint { font-size:12px; opacity:.75; margin-top:6px; }

      .actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
      .btn { all: initial; cursor: pointer; padding: 8px 12px; border-radius: 10px; background: #2a2f36; color: #e9edf3; }
      .btn.primary { background:#048BFF; color:#fff; }
    `;

    const container = document.createElement('div'); container.className = 'backdrop';
    const card = document.createElement('div'); card.className = 'card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-label', '특정 시간으로 이동하기');

    card.innerHTML = `
      <div class="titlebar"><div class="title" id="wv-jump-title">⇋  특정 시간으로 이동하기</div></div>
      <div class="desc" id="wv-jump-desc">시간을 입력/붙여넣기 하세요. (Enter=확인, ESC=닫기)</div>

      <div class="section" aria-labelledby="wv-jump-title">
        <div class="section-title">방송 정보 ${editedBadgeHTML}</div>
        <div class="row"><div class="label">방송 시작 시간</div><div id="start-label">${startStr}</div></div>
        <div class="row" style="margin-bottom:8px;"><div class="label">방송 종료 시간</div><div id="end-label">${endStr}</div></div>
      </div>

      <div class="section" style="margin-top:16px;">
        <div class="section-title">이동 설정</div>
        <div class="row">
          <div class="label">이동할 시간 입력</div>
          <div>
            <div class="inputwrap">
              <input id="dt" type="text" aria-describedby="wv-jump-desc" placeholder="${placeholderHint}" autocomplete="off" autocapitalize="off" spellcheck="false">
              <div id="hist" class="hist-panel" role="listbox" aria-label="최근 입력 기록"></div>
              <button id="openPicker" class="iconbtn" title="날짜/시간 선택" aria-label="날짜/시간 선택">📅</button>
              <div id="picker" class="picker" hidden>
                <div class="seg">방송 날짜 선택(해당 방송이 진행된 일자 중 선택 가능)</div>
                <div class="pick-row">
                  <div class="numbox">
                    <select id="daySel"></select>
                    <div class="steppers" style="margin-left:6px;">
                      <button class="step" id="dayUp"   title="다음 날짜">▲</button>
                      <button class="step" id="dayDown" title="이전 날짜">▼</button>
                    </div>
                  </div>
                </div>

                <div class="seg" style="margin-top:8px;">시/분/초 입력</div>
                <div class="pick-row" id="hmsRow">
                  <div class="numbox">
                    <input id="hh" class="num" type="number" min="0" max="23" step="1" placeholder="HH" aria-label="시(0-23)" inputmode="numeric">
                    <div class="steppers">
                      <button class="step" data-target="hh" data-delta="+1">▲</button>
                      <button class="step" data-target="hh" data-delta="-1">▼</button>
                    </div>
                  </div>
                  <span class="colon">:</span>
                  <div class="numbox">
                    <input id="mm" class="num" type="number" min="0" max="59" step="1" placeholder="MM" aria-label="분(0-59)" inputmode="numeric">
                    <div class="steppers">
                      <button class="step" data-target="mm" data-delta="+1">▲</button>
                      <button class="step" data-target="mm" data-delta="-1">▼</button>
                    </div>
                  </div>
                  <span class="colon">:</span>
                  <div class="numbox">
                    <input id="ss" class="num" type="number" min="0" max="59" step="1" placeholder="SS" aria-label="초(0-59)" inputmode="numeric">
                    <div class="steppers">
                      <button class="step" data-target="ss" data-delta="+1">▲</button>
                      <button class="step" data-target="ss" data-delta="-1">▼</button>
                    </div>
                  </div>
                </div>

                <div class="pick-row">
                  <div class="pillbar">
                    <button class="pill primary" id="pkApply">적용</button>
                    <button class="pill" id="pkCancel">닫기</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pillbar">
          <button class="pill primary" id="useNow">현재 화면 시간 적용</button>
          <button class="pill" data-bump="-60">-60s</button>
          <button class="pill" data-bump="-30">-30s</button>
          <button class="pill" data-bump="+30">+30s</button>
          <button class="pill" data-bump="+60">+60s</button>
          <button class="pill" id="copyShare">URL 복사</button>
          <button class="pill primary" id="copyInput">입력한 시간 복사</button>
        </div>

        <div class="tz">표시 타임존: ${userTZ}</div>
        <div class="hint" id="hint-now"></div>
      </div>

      <div class="actions">
        <button class="btn primary" id="ok">확인</button>
        <button class="btn" id="cancel">닫기</button>
      </div>
    `;

    const dt       = card.querySelector('#dt');
    const histBox  = card.querySelector('#hist');
    const picker   = card.querySelector('#picker');
    const openBtn  = card.querySelector('#openPicker');
    const pkCancel = card.querySelector('#pkCancel');
    const pkApply  = card.querySelector('#pkApply');
    const daySel   = card.querySelector('#daySel');
    const dayUp    = card.querySelector('#dayUp');
    const dayDown  = card.querySelector('#dayDown');
    const hhInp    = card.querySelector('#hh');
    const mmInp    = card.querySelector('#mm');
    const ssInp    = card.querySelector('#ss');

    // ---------- History dropdown ----------
    async function renderHistory() {
      const list = loadHistory();
      const { text:clip, error:clipError } = await readClipboardCached();

      const hasHist = list.length > 0;
      const hasClip = !!clip;
      if (!hasHist && !hasClip && !clipError) { histBox.innerHTML = ''; return; }

      const histHTML = hasHist ? list.map((v,i)=>`
        <div class="hist-item" role="option" data-index="${i}">
          <span class="hist-ico">↺</span>
          <div class="hist-text ellipsis" title="${esc(v)}">${esc(v)}</div>
          <button class="hist-del" title="삭제" aria-label="삭제" data-del="${i}">×</button>
        </div>`).join('') : '';

      const clipSectionTitle = (hasClip || clipError) ? `<div class="divider"></div><div class="hist-caption">현재 클립보드</div>` : '';

      const clipItem = hasClip ? `
        <div class="hist-item" data-clip="1" title="${esc(clip)}">
          <span class="hist-ico">📋</span>
          <div class="hist-text ellipsis">${esc(clip)}</div>
        </div>` : (clipError ? `
        <div class="hist-item error" data-clip="1" title="클립보드 읽기 권한이 없습니다.">
          <span class="hist-ico">📋</span>
          <div class="hist-text ellipsis">클립보드 읽기 권한이 없습니다.</div>
        </div>` : '');

      const footerHTML = `
        <div class="divider"></div>
        <div class="hist-footer"><button class="hist-clear">히스토리 삭제</button></div>
      `;

      histBox.innerHTML = `${histHTML}${clipSectionTitle}${clipItem}${footerHTML}`;

      histBox.querySelectorAll('.hist-item[data-index]').forEach(el=>{
        el.addEventListener('click', ()=>{
          const idx = Number(el.getAttribute('data-index'));
          const item = loadHistory()[idx];
          if (!item) return;
          dt.value = item;
          hideHistory();
        });
      });

      histBox.querySelectorAll('.hist-del').forEach(btn=>{
        btn.addEventListener('click',(e)=>{
          e.stopPropagation();
          const idx = Number(btn.getAttribute('data-del'));
          const list = loadHistory();
          list.splice(idx,1);
          saveHistory(list);
          renderHistory();
        });
      });

      const clipEl = histBox.querySelector('.hist-item[data-clip]');
      if (clipEl && !clipEl.classList.contains('error')) {
        clipEl.addEventListener('click', ()=>{
          dt.value = clip;
          hideHistory();
        });
      }

      const clearBtn = histBox.querySelector('.hist-clear');
      if (clearBtn) clearBtn.addEventListener('click', ()=> { clearHistory(); renderHistory(); });
    }
    async function showHistory() {
      await renderHistory();
      if (loadHistory().length || (await readClipboardCached()).text || histBox.querySelector('.hist-item.error')) histBox.classList.add('show');
      else histBox.classList.remove('show');
    }
    function hideHistory() { histBox.classList.remove('show'); }

    dt.addEventListener('focus', showHistory);
    dt.addEventListener('input', showHistory);
    root.addEventListener('click', (e)=>{
      const path = e.composedPath();
      if (!path.includes(histBox) && !path.includes(dt)) hideHistory();
    });

    function bindStrictTwoDigit(input, max) {
      if (!input) return;
      const setOverwrite = on => input.dataset.overwrite = on ? '1':'0';
      setOverwrite(true);

      const clamp = v => {
        if (v === '') return '';
        let n = parseInt(v,10); if (isNaN(n)) n = 0;
        if (n > max) n = max; if (n < 0) n = 0; return String(n);
      };
      const coerce = () => {
        let raw = (input.value||'').replace(/\D/g,'');
        if (raw.length>2) raw = raw.slice(-2);
        raw = clamp(raw);
        input.value = raw === '' ? '' : String(parseInt(raw,10));
      };

      input.addEventListener('focus', ()=>{ try{input.select();}catch{} setOverwrite(true); });
      input.addEventListener('mousedown', ()=> setOverwrite(true));

      input.addEventListener('keydown', (e)=>{
        const edit = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
        if (edit.includes(e.key)) return;

        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
          let cur = parseInt(input.value,10); if (isNaN(cur)) cur = 0;
          const delta = (e.key === 'ArrowUp') ? +1 : -1;
          const mod = max + 1;
          const next = ((cur + delta) % mod + mod) % mod;
          input.value = String(next);
          input.dispatchEvent(new Event('input'));
          setOverwrite(true);
          return;
        }

        if (e.key.length===1 && !/\d/.test(e.key)) { e.preventDefault(); return; }

        const curDigitsLen = ((input.value||'').replace(/\D/g,'')).length;
        if (input.dataset.overwrite === '1' || curDigitsLen >= 2) {
          input.value = '';
          setOverwrite(false);
        }

        e.preventDefault();
        const cur = (input.value||'').replace(/\D/g,'');
        let next = (cur + e.key).slice(-2);
        next = clamp(next);
        input.value = next;
        input.dispatchEvent(new Event('input'));
      });

      input.addEventListener('input', coerce);

      input.addEventListener('paste', (e)=>{
        const t = (e.clipboardData || window.clipboardData)?.getData('text') || '';
        const d = t.replace(/\D/g,''); e.preventDefault();
        if (!d) return;
        let v = d.slice(-2); v = clamp(v);
        input.value = v;
        input.dispatchEvent(new Event('input'));
        setOverwrite(false);
      });

      input.addEventListener('blur', ()=>{
        let v = (input.value||'').replace(/\D/g,''); if (v==='') return;
        v = clamp(v);
        input.value = String(parseInt(v,10)).padStart(2,'0');
        setOverwrite(true);
      });

      input.addEventListener('wheel', (e)=>{
        if (document.activeElement !== input) return;
        e.preventDefault();
        let cur = parseInt(input.value,10); if (isNaN(cur)) cur = 0;
        const delta = e.deltaY < 0 ? +1 : -1;
        const mod = max + 1;
        const next = ((cur + delta) % mod + mod) % mod;
        input.value = String(next);
        input.dispatchEvent(new Event('input'));
        setOverwrite(true);
      }, {passive:false});
    }
    bindStrictTwoDigit(hhInp,23);
    bindStrictTwoDigit(mmInp,59);
    bindStrictTwoDigit(ssInp,59);

    function stepWrap(input, max, delta) {
      if (!input) return;
      let cur = parseInt(input.value,10); if (isNaN(cur)) cur = 0;
      const mod = max + 1;
      const next = ((cur + delta) % mod + mod) % mod;
      input.value = String(next);
      input.dispatchEvent(new Event('input'));
      input.dataset.overwrite = '1';
    }
    card.querySelectorAll('.step[data-target]').forEach(btn=>{
      const id = btn.getAttribute('data-target');
      const delta = btn.getAttribute('data-delta') === '+1' ? +1 : -1;
      const max = id === 'hh' ? 23 : 59;
      const input = card.querySelector('#'+id);
      btn.addEventListener('click', ()=> stepWrap(input,max,delta));
    });

    const toYMD = (date) => {
      const f = new Intl.DateTimeFormat('en-CA',{timeZone:userTZ,year:'numeric',month:'2-digit',day:'2-digit'});
      const p = f.formatToParts(date);
      return `${p.find(v=>v.type==='year').value}-${p.find(v=>v.type==='month').value}-${p.find(v=>v.type==='day').value}`;
    };
    const daysComp = listDaysInRange(startTime, endTime);
    daySel.innerHTML = '';
    for (const d of daysComp) {
      const ymd = `${d.y}-${p2(d.M)}-${p2(d.d)}`;
      const opt = document.createElement('option');
      opt.value = ymd; opt.textContent = ymd;
      daySel.appendChild(opt);
    }
    const modalCurrentEl = getCurrentTimeEl(); // ☑ 모달 내 1회만 캡처
    const secNow = modalCurrentEl ? parseHMSFlexible(modalCurrentEl.textContent) : 0;
    const liveNow = startTime ? new Date(startTime.getTime() + secNow*1000) : new Date();
    const liveDateStr = toYMD(liveNow);
    const optsArr = Array.prototype.slice.call(daySel.options || []);
    daySel.value = (optsArr.find(o=>o.value===liveDateStr)?.value) || (optsArr[0]?.value || '');

    const stepDay = (delta) => {
      const opts = daySel.options; const len = opts.length; if (!len) return;
      let idx = daySel.selectedIndex; if (idx<0) idx=0;
      idx = ((idx + delta) % len + len) % len;
      daySel.selectedIndex = idx; daySel.dispatchEvent(new Event('change'));
    };
    dayUp.addEventListener('click',   ()=> stepDay(+1));
    dayDown.addEventListener('click', ()=> stepDay(-1));

    const togglePicker = (show) => { if (show) picker.removeAttribute('hidden'); else picker.setAttribute('hidden',''); };
    togglePicker(false);
    openBtn.addEventListener('click', (e)=>{ e.stopPropagation(); togglePicker(picker.hasAttribute('hidden')); });
    pkCancel.addEventListener('click', ()=> togglePicker(false));
    container.addEventListener('click', (e) => {
      const path = e.composedPath();
      if (!path.includes(card)) { closeModal(); }
    });

    pkApply.addEventListener('click', ()=> {
      const h = hhInp && hhInp.value === '' ? NaN : +(hhInp?.value ?? NaN);
      const Mins = mmInp && mmInp.value === '' ? NaN : +(mmInp?.value ?? NaN);
      const Secs = ssInp && ssInp.value === '' ? NaN : +(ssInp?.value ?? NaN);
      if ([h,Mins,Secs].some(v=>Number.isNaN(v))) return showToastMessage('시/분/초를 입력하세요.', true);
      if (h<0||h>23||Mins<0||Mins>59||Secs<0||Secs>59) return showToastMessage('시/분/초 범위를 확인하세요.', true);

      const baseDate = daySel.value;
      const comp = { y:+baseDate.slice(0,4), M:+baseDate.slice(5,7), d:+baseDate.slice(8,10), h, m:Mins, s:Secs };
      const ms = zonedComponentsToUTCms(comp, userTZ);
      const target = new Date(ms);
      if (target < startTime || target > endTime) return showToastMessage('방송 시간 범위를 벗어났습니다.', true);
      dt.value = fmtDate(target);
      dt.focus(); dt.select();
      togglePicker(false);
      hideHistory();
    });

    // ▶ 모달 힌트 업데이트
    const readSceneSec = () => modalCurrentEl ? parseHMSFlexible(modalCurrentEl.textContent) : 0;
    const refreshHint = () => {
      const sNow = readSceneSec();
      const live = startTime ? new Date(startTime.getTime() + sNow*1000) : new Date();
      card.querySelector('#hint-now').textContent = `현재 장면(내 타임존): ${fmtDate(live)}`;
    };
    refreshHint();
    let hintObs = null, hintTimer = null;
    function startHintAutoUpdate(){
      if (modalCurrentEl) {
        hintObs = new MutationObserver(() => refreshHint());
        hintObs.observe(modalCurrentEl, { childList:true, characterData:true, subtree:true });
      }
      if (!hintTimer) hintTimer = setInterval(refreshHint, UPDATE_INTERVAL_MS);
    }
    startHintAutoUpdate();

    function applyParsedFromText(text) {
      const parsed = parseInputToTarget(text);
      if (!parsed) return false;
      const target = new Date(zonedComponentsToUTCms(parsed.comp, userTZ));
      if (target < startTime || target > endTime) return false;
      dt.value = fmtDate(target);
      dt.focus(); dt.select();
      return true;
    }
    dt.addEventListener('paste', (e) => {
      const text = (e.clipboardData || window.clipboardData)?.getData('text');
      if (!text) return;
      if (applyParsedFromText(text)) e.preventDefault();
    });
    dt.addEventListener('change', () => { if (dt.value) applyParsedFromText(dt.value); });

    card.querySelector('#useNow').addEventListener('click', () => {
      const sNow2 = readSceneSec();
      const live2 = startTime ? new Date(startTime.getTime() + sNow2*1000) : new Date();
      dt.value = fmtDate(live2);
      refreshHint();
      hideHistory();
    });
    card.querySelectorAll('.pill[data-bump]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        if (!dt.value) return;
        const parsed = parseInputToTarget(dt.value); if (!parsed?.comp) return;
        const base = new Date(zonedComponentsToUTCms(parsed.comp, userTZ));
        const bumped = new Date(base.getTime() + Number(btn.getAttribute('data-bump'))*1000);
        dt.value = fmtDate(bumped);
        hideHistory();
      });
    });
    card.querySelector('#copyInput').addEventListener('click', () => {
      if (!dt.value) { showToastMessage('시간을 먼저 지정하세요.', true); announce('시간을 먼저 지정하세요.'); return; }
      const text = dt.value;
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
        .then(()=> { showToastMessage('입력한 시간 복사 완료'); announce('입력한 시간 복사 완료'); })
        .catch(()=> { showToastMessage('복사 실패', true); announce('복사 실패'); });
    });
    card.querySelector('#copyShare').addEventListener('click', () => {
      if (!dt.value || !startTime) { showToastMessage('시간을 먼저 지정하세요.', true); announce('시간을 먼저 지정하세요.'); return; }
      const parsed = parseInputToTarget(dt.value);
      if (!parsed?.comp) { showToastMessage('형식이 올바르지 않습니다.', true); announce('형식이 올바르지 않습니다.'); return; }
      const target = new Date(zonedComponentsToUTCms(parsed.comp, userTZ));
      if (target < startTime || target > endTime) { showToastMessage('방송 시간 범위를 벗어났습니다.', true); announce('방송 시간 범위를 벗어났습니다.'); return; }
      const diffSec = Math.floor((target - startTime)/1000);
      const url = setChangeSecondParam(new URL(location.href), diffSec);
      navigator.clipboard.writeText(url.toString())
        .then(()=> { showToastMessage('공유 링크 복사 완료'); announce('공유 링크 복사 완료'); })
        .catch(()=> { showToastMessage('복사 실패', true); announce('복사 실패'); });
    });

    const focusables = card.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstF = focusables[0], lastF = focusables[focusables.length-1];
    (firstF || card).focus();
    card.addEventListener('keydown', (e)=>{
      if (e.key === 'Escape') { e.stopPropagation(); closeModal(); }
      if (e.key === 'Enter')  { e.stopPropagation(); card.querySelector('#ok').click(); }
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstF) { e.preventDefault(); (lastF||firstF).focus(); }
        else if (!e.shiftKey && document.activeElement === lastF) { e.preventDefault(); (firstF||lastF).focus(); }
      }
    });

    function closeModal() {
      if (hintObs) { try{ hintObs.disconnect(); }catch{} hintObs = null; }
      if (hintTimer) { clearInterval(hintTimer); hintTimer = null; }
      jumpModalHost.style.display = 'none';
      if (lastActiveEl && typeof lastActiveEl.focus === 'function') lastActiveEl.focus();
    }

    card.querySelector('#cancel').addEventListener('click', closeModal);
    card.querySelector('#ok').addEventListener('click', () => {
      if (!dt.value || !startTime) { showToastMessage('시간을 먼저 지정하세요.', true); announce('시간을 먼저 지정하세요.'); return; }
      const parsed = parseInputToTarget(dt.value);
      if (!parsed?.comp) { showToastMessage('형식이 올바르지 않습니다.', true); announce('형식이 올바르지 않습니다.'); return; }
      const target = new Date(zonedComponentsToUTCms(parsed.comp, userTZ));
      if (target < startTime || target > endTime) { showToastMessage('방송 시간 범위를 벗어났습니다.', true); announce('방송 시간 범위를 벗어났습니다.'); return; }
      addHistory(fmtDate(target));
      const diffSec = Math.floor((target - startTime)/1000);
      const url = setChangeSecondParam(new URL(location.href), diffSec);
      window.location.replace(url.toString());
    });

    container.appendChild(card);
    root.append(style, container);
    jumpModalHost.style.display = 'block';
  }

  // ---------------- Top UI & loop ----------------

  const upsertLiveUI = () => {
    const ul = $(SELECTORS.infoUL);
    if (!ul) return {};

    const parent = ul.parentElement;
    if (parent) {
      Object.assign(parent.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      });
    }

    // 오른쪽 그리드(안내문/Live | 조회수·날짜)
    let rightWrap = document.getElementById('live-right-wrap');
    if (!rightWrap) {
      rightWrap = document.createElement('div');
      rightWrap.id = 'live-right-wrap';
      Object.assign(rightWrap.style, {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) auto', // ← 첫 칸(라이브 라벨)이 늘어날 수 있게
        columnGap: '8px',
        rowGap: '0px',
        justifyContent: 'end',
        alignItems: 'center',
        marginLeft: 'auto',
        minWidth: '0'
      });
      parent.insertBefore(rightWrap, ul);
    }

    // Live + ⇋
    let liveRow = document.getElementById('live-row');
    if (!liveRow) {
      liveRow = document.createElement('div');
      liveRow.id = 'live-row';
      Object.assign(liveRow.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '0',
        gridColumn: '1',
        gridRow: '2'
      });
      rightWrap.appendChild(liveRow);
    } else if (liveRow.parentElement !== rightWrap) {
      rightWrap.appendChild(liveRow);
    }

    // Live 텍스트 (고정폭) — 자동 읽기 해제(ARIA live 미사용)
    let liveSpan = document.getElementById('live-time-display');
    if (!liveSpan) {
      liveSpan = document.createElement('span');
      liveSpan.id = 'live-time-display';
      Object.assign(liveSpan.style, {
        fontSize: '14px',
        lineHeight: '28px',
        cursor: 'pointer',
        flex: '1 1 auto',
        width: 'auto',
        minWidth: '0',
        maxWidth: '100%',
        display: 'block',
        fontVariantNumeric: 'tabular-nums',
        fontFeatureSettings: '"tnum" 1, "lnum" 1',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      });
      liveSpan.setAttribute('aria-label','Live 당시 시간. 클릭 시 복사.');
      liveSpan.title = '클릭 시 시간 복사';
      liveSpan.addEventListener('click', () => {
        if (!currentLiveTimeStr) return;
        (navigator.clipboard
          ? navigator.clipboard.writeText(currentLiveTimeStr)
          : Promise.reject()
        ).then(()=>{
          showToastMessage(`복사 완료: ${currentLiveTimeStr}`);
          announce(`복사 완료. ${currentLiveTimeStr}`);
        }).catch(()=>{
          showToastMessage('복사 실패', true);
          announce('복사 실패');
        });
      });
      liveRow.appendChild(liveSpan);
    } else if (liveSpan.parentElement !== liveRow) {
      liveRow.appendChild(liveSpan);
    }

    // ⇋ 버튼 (간격 의도 유지: marginRight=10px)
    let jumpBtn = document.getElementById('jump-button');
    if (!jumpBtn) {
      jumpBtn = document.createElement('button');
      jumpBtn.id = 'jump-button';
      jumpBtn.innerHTML = '<strong>⇋</strong>';
      Object.assign(jumpBtn.style, {
        marginLeft: '0px',
        marginRight: '10px',
        color: '#FF2F00',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        lineHeight: '28px',
        flex: '0 0 auto',
      });
      jumpBtn.title = '특정 시간으로 이동하기';
      jumpBtn.addEventListener('click', () => {
        if (!startTime || !endTime) return showToastMessage('방송 정보가 아직 준비되지 않았습니다.', true);
        openJumpModal(jumpBtn);
      });
      liveRow.appendChild(jumpBtn);
    } else if (jumpBtn.parentElement !== liveRow) {
      liveRow.appendChild(jumpBtn);
    }

    // 조회수/날짜 블록 위치
    Object.assign(ul.style, {
      marginLeft: '0',
      width: 'auto',
      gridColumn: '2',
      gridRow: '2',
      alignSelf: 'center'
    });
    if (ul.parentElement !== rightWrap) rightWrap.appendChild(ul);
    return {};
  };

  // 안내문구: rightWrap의 1행 배치
  function maybeShowEditNotice(durationEl) {
    if (!startTime || !endTime || !durationEl) return;

    const total = parseHMSFlexible((durationEl.textContent || '').trim());
    const expected = Math.max(0, ((endTime - startTime) / 1000) | 0);

    const rightWrap = document.getElementById('live-right-wrap');
    if (!rightWrap) return;

    let note = document.getElementById('edit-notice');

    if (total + EDIT_THRESHOLD_SEC < expected) {
      if (!note) {
        note = document.createElement('strong');
        note.id = 'edit-notice';
        note.textContent = '[같이보기 진행 또는 편집된 영상일 수 있습니다.]';
        Object.assign(note.style, {
          fontSize: '12px',
          lineHeight: '14px',
          color: '#9196a1',
          whiteSpace: 'nowrap',
          gridColumn: '1',
          gridRow: '1',
          alignSelf: 'center'
        });
      }
      if (note.parentElement !== rightWrap) rightWrap.appendChild(note);
    } else {
      if (note && note.parentElement) note.parentElement.removeChild(note);
    }
  }

  // 최적화된 업데이트 루프 + 옵저버 안전망(+ 탭 비활성화 절전)
  let cachedCurrentEl = null;
  let lastCurrentText = '';
  let lastRendered = '';

  function attachTimeObserver(el){
    if (timeObserver) try{ timeObserver.disconnect(); }catch{}
    timeObserver = new MutationObserver(() => renderLiveTime(el));
    timeObserver.observe(el, { characterData:true, subtree:true, childList:true });
  }

  function refreshCurrentEl() {
    if (!cachedCurrentEl || !document.contains(cachedCurrentEl)) {
      cachedCurrentEl = getCurrentTimeEl();
      lastCurrentText = '';
      if (!document.hidden && cachedCurrentEl) attachTimeObserver(cachedCurrentEl);
    }
    return cachedCurrentEl;
  }
  function renderLiveTime(el) {
    const liveSpan = document.getElementById('live-time-display');
    if (!el || !liveSpan || !startTime) return;
    const txt = (el.textContent||'').trim();
    if (txt === lastCurrentText) return;
    lastCurrentText = txt;
    const sec = parseHMSFlexible(txt);
    const live = new Date(startTime.getTime() + sec*1000);
    const html = `<span style="color:#9196a1;">Live 당시 시간⠀</span><span style="color:#FF2F00;">${fmtDate(live)}</span>`;
    if (html !== lastRendered) {
      liveSpan.innerHTML = html;
      currentLiveTimeStr = fmtDate(live);
      lastRendered = html;
    }
  }
  function startRenderLoop() {
    if (updateTimer) clearInterval(updateTimer);
    if (document.hidden) return; // 절전: 숨김이면 루프 시작하지 않음
    updateTimer = setInterval(() => {
      const el = refreshCurrentEl();
      if (el) renderLiveTime(el);
    }, UPDATE_INTERVAL_MS);
  }
  function stopRenderLoop(){
    if (updateTimer) { clearInterval(updateTimer); updateTimer = null; }
    if (timeObserver) { try{ timeObserver.disconnect(); }catch{} timeObserver = null; }
  }

  // ---------------- Init / SPA handling ----------------
  const initOncePerRoute = async () => {
    const href = location.href;
    if (initDoneForHref === href) return;
    initDoneForHref = href;

    stopRenderLoop();
    cachedCurrentEl = null; lastCurrentText=''; lastRendered='';

    let tipEl;
    try { tipEl = await waitFor(SELECTORS.startTimeTip, { timeout:15000, root:document }); }
    catch {
      tipEl = Array.from(document.querySelectorAll('span[tip]')).find(el => /방송시간/.test(el.getAttribute('tip')||''));
      if (!tipEl) return;
    }
    const times = parseTipTimes(tipEl.getAttribute('tip') || '');
    if (!times) return;
    startTime = times.start; endTime = times.end;

    upsertLiveUI();

    // duration 보강 탐색
    let durationEl = getDurationElRobust();
    if (!durationEl) { try { durationEl = await waitFor(DURATION_CANDIDATES.join(','), { timeout:10000 }); } catch {} }
    maybeShowEditNotice(durationEl);

    startRenderLoop();
  };

  const hookHistory = () => {
    if (routeObserver) return;
    ['pushState','replaceState'].forEach(fn => {
      const orig = history[fn];
      history[fn] = function(...args){ const ret = orig.apply(this, args); setTimeout(()=>initOncePerRoute(), 50); return ret; };
    });
    window.addEventListener('popstate', () => setTimeout(()=>initOncePerRoute(), 50));
    routeObserver = new MutationObserver(() => { if (location.href !== initDoneForHref) initOncePerRoute(); });
    // 🔽 부하 절감: body만, subtree:false
    routeObserver.observe(document.body || document.documentElement, { childList:true, subtree:false });
  };

  // 탭 가시성에 따라 루프/옵저버 일시정지/재개
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopRenderLoop();
    } else {
      // 복귀 시 한 번 갱신 + 루프 재시작
      refreshCurrentEl();
      const el = cachedCurrentEl || getCurrentTimeEl();
      if (el) renderLiveTime(el);
      startRenderLoop();
      // SPA 전환이 있었다면 재초기화
      initOncePerRoute();
    }
  });

  window.addEventListener('load', () => { hookHistory(); initOncePerRoute(); });
})();
