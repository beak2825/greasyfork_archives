// ==UserScript==
// @name         SOOP 타임 스탬프(라이브 & 다시보기)
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  숲 라이브/다시보기 타임스탬프 복사 + 설정창(단축키/라이브 오프셋). GM 메뉴 또는 Ctrl+Shift+Y(Cmd+Shift+Y)로 설정창 열기. (기본 단축키: Y / 오프셋 기본: 0초)
// @author       WakViewer
// @match        https://play.sooplive.co.kr/*
// @match        https://vod.sooplive.co.kr/player/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.sooplive.co.kr
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521548/SOOP%20%ED%83%80%EC%9E%84%20%EC%8A%A4%ED%83%AC%ED%94%84%28%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%20%EB%8B%A4%EC%8B%9C%EB%B3%B4%EA%B8%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521548/SOOP%20%ED%83%80%EC%9E%84%20%EC%8A%A4%ED%83%AC%ED%94%84%28%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%20%EB%8B%A4%EC%8B%9C%EB%B3%B4%EA%B8%B0%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===== 공통 상수 =====
  const TOAST_MS = 1700;

  // ========= 저장 키/기본값 =========
  const STORAGE_KEYS = {
    hotkey: 'soop_ts_hotkey',
    offset: 'soop_ts_live_offset',
  };
  const DEFAULTS = {
    hotkey: { code: 'KeyY', ctrl: false, alt: false, shift: false, meta: false },
    offset: 0,
  };

  let settingsOpen = false;

  // ========= 유틸 =========
  const $ = (sel, root = document) => root.querySelector(sel);
  const isMac = () => /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
  function isTyping(e){ const t=e.target; return !!(t && t.closest('input, textarea, [contenteditable="true"], [role="textbox"]')); }

  const loadHotkey = () => Object.assign({}, DEFAULTS.hotkey, GM_getValue(STORAGE_KEYS.hotkey) || {});
  const saveHotkey = (hk) => GM_setValue(STORAGE_KEYS.hotkey, hk);
  const loadOffset = () => { const v = GM_getValue(STORAGE_KEYS.offset); return Number.isFinite(v) ? v : DEFAULTS.offset; };
  const saveOffset = (v) => GM_setValue(STORAGE_KEYS.offset, Math.max(0, parseInt(v,10) || 0));

  // 키 라벨/매칭
  const HUMAN_KEY_MAP = {
    'KeyA':'A','KeyB':'B','KeyC':'C','KeyD':'D','KeyE':'E','KeyF':'F','KeyG':'G','KeyH':'H','KeyI':'I','KeyJ':'J','KeyK':'K','KeyL':'L','KeyM':'M','KeyN':'N','KeyO':'O','KeyP':'P','KeyQ':'Q','KeyR':'R','KeyS':'S','KeyT':'T','KeyU':'U','KeyV':'V','KeyW':'W','KeyX':'X','KeyY':'Y','KeyZ':'Z',
    'Digit0':'0','Digit1':'1','Digit2':'2','Digit3':'3','Digit4':'4','Digit5':'5','Digit6':'6','Digit7':'7','Digit8':'8','Digit9':'9',
    'Numpad0':'Num0','Numpad1':'Num1','Numpad2':'Num2','Numpad3':'Num3','Numpad4':'Num4','Numpad5':'Num5','Numpad6':'Num6','Numpad7':'Num7','Numpad8':'Num8','Numpad9':'Num9',
    'NumpadAdd':'Num+','NumpadSubtract':'Num-','NumpadMultiply':'Num*','NumpadDivide':'Num/','NumpadEnter':'NumEnter','NumpadDecimal':'Num.',
    'ArrowUp':'↑','ArrowDown':'↓','ArrowLeft':'←','ArrowRight':'→',
    'Space':'Space','Enter':'Enter','Escape':'Esc','Backspace':'Backspace','Tab':'Tab',
    'Minus':'-','Equal':'=','BracketLeft':'[','BracketRight':']','Backslash':'\\','Semicolon':';','Quote':'\'','Backquote':'`','Comma':',','Period':'.','Slash':'/',
    'F1':'F1','F2':'F2','F3':'F3','F4':'F4','F5':'F5','F6':'F6','F7':'F7','F8':'F8','F9':'F9','F10':'F10','F11':'F11','F12':'F12'
  };
  const codeToHumanKey=(c)=>HUMAN_KEY_MAP[c] || c;
  const hotkeyToLabel=(hk)=>[hk.ctrl&&'Ctrl',hk.alt&&'Alt',hk.shift&&'Shift',hk.meta&&(isMac()?'Cmd':'Meta'),codeToHumanKey(hk.code)].filter(Boolean).join(' + ');
  const matchHotkey=(e,hk)=> e.code===hk.code && !!e.ctrlKey===!!hk.ctrl && !!e.altKey===!!hk.alt && !!e.shiftKey===!!hk.shift && !!e.metaKey===!!hk.meta;

  // 현재 저장된 단축키 라벨을 즉시 계산
  const currentHotkeyLabel = () => hotkeyToLabel(loadHotkey());

  function parseHMS(str){
    const p=String(str||'').trim().split(':').map(n=>parseInt(n,10));
    if(p.some(isNaN))return 0;
    const [h=0,m=0,s=0]=(p.length===3)?p:[0,p[0]||0,p[1]||0];
    return h*3600+m*60+s;
  }
  function secondsToHMS(x){
    x=Math.max(0,Math.floor(x));
    const h=String(Math.floor(x/3600)).padStart(2,'0');
    const m=String(Math.floor((x%3600)/60)).padStart(2,'0');
    const s=String(x%60).padStart(2,'0');
    return `${h}:${m}:${s}`;
  }

  // 클립보드 유틸
  async function copyText(text, toastFn){
    try{
      await navigator.clipboard.writeText(text);
      toastFn && toastFn(`복사 완료: ${text}`);
    }catch(err){
      toastFn && toastFn('클립보드 복사 실패. 브라우저 권한을 확인해주세요.');
      console.error('[SOOP TS] clipboard error:', err);
    }
  }

  // ========= 설정창 열기 (GM 메뉴 + 단축키) =========
  GM_registerMenuCommand('설정 메뉴 열기 (Ctrl+Shift+Y / Cmd+Shift+Y)', openSettings);

  document.addEventListener('keydown', (e) => {
    if (e.repeat || e.isComposing || settingsOpen || isTyping(e)) return;
    const openKey = (e.ctrlKey && e.shiftKey && e.code==='KeyY') || (e.metaKey && e.shiftKey && e.code==='KeyY');
    if (openKey) { e.preventDefault(); e.stopPropagation(); openSettings(); }
  }, true);

  function openSettings() {
    if (settingsOpen) return;
    settingsOpen = true;

    const currentHK = loadHotkey();
    let pendingHotkey  = { ...currentHK };
    let pendingOffset  = loadOffset();
    let capturing = false;

    const overlay = document.createElement('div');
    overlay.id='soop-ts-overlay';
    overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483647;display:flex;align-items:center;justify-content:center;';

    const modal = document.createElement('div');
    modal.id='soop-ts-modal';
    modal.setAttribute('role','dialog');
    modal.setAttribute('aria-modal','true');
    modal.style.cssText='--field-h:40px;width:min(720px,92vw);max-width:720px;background:#121318;color:#E9E9EF;border:1px solid #262833;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.5);font:14px/1.5 system-ui,-apple-system,Segoe UI,Roboto,"Noto Sans KR",sans-serif;position:relative;';

    const style = document.createElement('style');
    style.textContent = `
      #soop-ts-modal .soop-ts-heading { font-size: 16px; font-weight:700; margin-bottom:12px; }
      #soop-ts-modal .soop-ts-desc  { color:#B7BAC7; margin-bottom:6px; }
      #soop-ts-modal .soop-ts-muted { color:#8C90A3; margin-bottom:10px; }
      #soop-ts-modal .row   { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
      #soop-ts-modal .field { height:var(--field-h); background:#191B22; border:1px solid #2B2E3A; border-radius:10px; color:#E9E9EF; }
      #soop-ts-modal .btn-primary   { height:40px; padding:0 14px; border-radius:10px; background:#2C66FF; color:#fff; border:0; }
      #soop-ts-modal .btn-secondary { height:40px; padding:0 14px; border-radius:10px; background:#2B2E3A; color:#E9E9EF; border:0; }
      #soop-ts-modal .ghost { background:#191B22; border:1px solid #2B2E3A; color:#E9E9EF; text-align:left; padding:10px 12px; cursor:pointer; }
      #soop-ts-modal .unit { display:inline-block; height:var(--field-h); line-height:var(--field-h); margin:0 !important; }
    `;
    modal.appendChild(style);

    modal.innerHTML += `
      <div style="padding:18px 20px 14px; border-bottom:1px solid #242632; display:flex; align-items:center; gap:8px;">
        <div style="font-size:18px; font-weight:700;">타임스탬프 설정창 (Ctrl+Shift+Y / Cmd+Shift+Y)</div>
      </div>

      <div style="padding:18px 20px;">
        <div class="soop-ts-heading">단축키 설정</div>
        <div class="soop-ts-desc">아래 입력란을 클릭한 뒤 원하는 단축키를 누르세요. (예: Y, Ctrl+Y, Shift+F8)</div>
        <div class="soop-ts-muted">(브라우저/OS가 예약한 조합(Ctrl+W 등)은 동작하지 않을 수 있습니다.)</div>

        <div class="row" style="margin-bottom:10px;">
          <button id="soop-ts-capture" type="button" class="field ghost" style="flex:1 1 360px; min-height:40px;">
            <span id="soop-ts-capture-label">${hotkeyToLabel(currentHK)}</span>
            <span id="soop-ts-capture-hint" class="soop-ts-muted" style="margin-left:8px;">(클릭하여 변경)</span>
          </button>
          <button id="soop-ts-apply-hotkey" type="button" class="btn-primary">적용</button>
          <button id="soop-ts-reset-hotkey" type="button" class="btn-secondary">기본값</button>
        </div>

        <hr style="border:0; border-top:1px solid #242632; margin:18px 0;">

        <div class="soop-ts-heading">라이브 타임 오프셋 설정</div>
        <div class="soop-ts-desc">라이브 방송시간 복사 시, 입력한 초만큼 <b>과거</b> 시간을 복사합니다. (라이브에서만 적용)</div>
        <div class="soop-ts-muted">(예: 60 → 01:00:00 ▶ 00:59:00)</div>

        <div class="row" style="margin-bottom:8px;">
          <input id="soop-ts-offset" type="number" min="0" step="1" value="${pendingOffset}" class="field" style="width:160px; padding:0 10px;">
          <span class="soop-ts-muted unit">초</span>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:20px;">
          <button id="soop-ts-confirm" type="button" class="btn-primary">확인</button>
          <button id="soop-ts-close"   type="button" class="btn-secondary">닫기</button>
        </div>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const elCaptureBtn   = $('#soop-ts-capture', modal);
    const elCaptureLabel = $('#soop-ts-capture-label', modal);
    const elCaptureHint  = $('#soop-ts-capture-hint', modal);
    const elApplyHotkey  = $('#soop-ts-apply-hotkey', modal);
    const elResetHotkey  = $('#soop-ts-reset-hotkey', modal);
    const elOffsetInput  = $('#soop-ts-offset', modal);
    const elConfirm      = $('#soop-ts-confirm', modal);
    const elClose        = $('#soop-ts-close', modal);

    function setCapturing(on) {
      capturing = on;
      elCaptureBtn.style.borderColor = on ? '#2C66FF' : '#2B2E3A';
      elCaptureHint.textContent = on ? '(원하는 키를 누르세요… Esc 취소)' : '(클릭하여 변경)';
      if (on) elCaptureBtn.focus();
    }
    elCaptureBtn.addEventListener('click', () => setCapturing(true));

    function normalizeEventToHotkey(ev) {
      if (ev.code === 'Escape' && !ev.ctrlKey && !ev.altKey && !ev.shiftKey && !ev.metaKey) return null;
      const onlyMods = ['ControlLeft','ControlRight','ShiftLeft','ShiftRight','AltLeft','AltRight','MetaLeft','MetaRight'];
      if (onlyMods.includes(ev.code)) return undefined;
      return { code: ev.code, ctrl: !!ev.ctrlKey, alt: !!ev.altKey, shift: !!ev.shiftKey, meta: !!ev.metaKey };
    }
    function onCaptureKeydown(ev) {
      if (!capturing) return;
      ev.preventDefault(); ev.stopPropagation();
      const hk = normalizeEventToHotkey(ev);
      if (hk === null) { setCapturing(false); elCaptureLabel.textContent = hotkeyToLabel(pendingHotkey); return; }
      if (hk === undefined) return;
      pendingHotkey = hk;
      elCaptureLabel.textContent = hotkeyToLabel(pendingHotkey);
    }
    document.addEventListener('keydown', onCaptureKeydown, true);

    overlay.addEventListener('click', (ev) => {
      if (ev.target === overlay) closeSettings();
    });

    function toastInline(text) {
      const old = modal.querySelector('.soop-ts-toast');
      if (old) old.remove();
      const bar = document.createElement('div');
      bar.className = 'soop-ts-toast';
      bar.textContent = text;
      bar.style.cssText = [
        'position:absolute','left:50%','top:90%','transform:translate(-50%,-50%)',
        'max-width:80%','background:#1A1D27','color:#E9E9EF','border:1px solid #2B2E3A',
        'border-radius:8px','padding:10px 14px','text-align:center','pointer-events:none','opacity:.98'
      ].join(';');
      modal.appendChild(bar);
      setTimeout(() => bar.remove(), 1200);
    }

    function isReservedHotkey(hk){
      const ctrlShiftY = hk && hk.code==='KeyY' && hk.ctrl && hk.shift && !hk.alt && !hk.meta;
      const cmdShiftY  = hk && hk.code==='KeyY' && hk.meta && hk.shift && !hk.alt && !hk.ctrl;
      return ctrlShiftY || cmdShiftY;
    }
    const DISALLOWED_CODES = new Set(['Enter','Escape','Tab']);
    function isValidHotkey(hk){ return !!hk && !DISALLOWED_CODES.has(hk.code); }

    elApplyHotkey.addEventListener('click', () => {
      if (!isValidHotkey(pendingHotkey)) return toastInline('이 키는 단축키로 사용할 수 없습니다.');
      if (isReservedHotkey(pendingHotkey)) return toastInline('Ctrl/Cmd+Shift+Y는 설정창 단축키로 예약되어 사용할 수 없습니다.');
      saveHotkey(pendingHotkey);
      setCapturing(false);
      toastInline('단축키가 적용되었습니다.');
    });
    elResetHotkey.addEventListener('click', () => {
      pendingHotkey = { ...DEFAULTS.hotkey };
      elCaptureLabel.textContent = hotkeyToLabel(pendingHotkey);
      saveHotkey(pendingHotkey);
      toastInline('단축키가 기본값으로 초기화되었습니다.');
    });

    elConfirm.addEventListener('click', () => {
      saveOffset(elOffsetInput.value);
      if (isValidHotkey(pendingHotkey) && !isReservedHotkey(pendingHotkey)) saveHotkey(pendingHotkey);
      closeSettings();
    });
    elClose.addEventListener('click', closeSettings);

    const onOverlayKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); closeSettings(); }
      else if (e.key === 'Enter') { e.preventDefault(); elConfirm.click(); }
    };
    overlay.addEventListener('keydown', onOverlayKey);

    function closeSettings() {
      settingsOpen = false;
      document.removeEventListener('keydown', onCaptureKeydown, true);
      overlay.removeEventListener('keydown', onOverlayKey);
      overlay.remove();
    }
  }

  // ========= 메인 동작 =========
  const VOD_DRAG_PX = 5;
  const VOD_LONG_MS = 600;

  // 라이브
  if (location.hostname.startsWith('play.sooplive.co.kr')) {
    function getLiveTime() {
      const el = document.getElementById('time');
      return el ? el.textContent.trim() : null;
    }
    const isHMS = (t) => /^\d{1,2}:\d{2}:\d{2}$/.test(String(t||'').trim());

    // 라이브 툴팁: 최초 설정 + 호버 시 최신 단축키로 갱신
    const setLiveTooltip = () => {
      const el = document.querySelector('li.time');
      if (el) el.title = `현재 방송시간 복사 (${currentHotkeyLabel()})`;
    };
    setLiveTooltip();
    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest('li.time');
      if (el) el.title = `현재 방송시간 복사 (${currentHotkeyLabel()})`;
    }, true);

    // 토스트
    let liveToastTid = null;
    function liveToast(message){
      const toastContainer = document.querySelector('#toastMessage');
      if (!toastContainer) { alert(message); return; }
      const p = toastContainer.querySelector('p') || toastContainer.appendChild(document.createElement('p'));
      p.textContent = message;
      toastContainer.style.display = '';
      if (liveToastTid) clearTimeout(liveToastTid);
      liveToastTid = setTimeout(() => { p.textContent = ''; toastContainer.style.display = 'none'; }, TOAST_MS);
    }

    // 클릭 복사
    document.addEventListener('click', async (e) => {
      const hit = e.target.closest('li.time');
      if (!hit) return;
      const t = getLiveTime();
      if (!isHMS(t)) return liveToast('시간 포맷을 읽지 못했습니다. 잠시 후 다시 시도해주세요.');
      const baseSec = parseHMS(t);
      const adjustedSec = Math.max(0, baseSec - loadOffset());
      await copyText(secondsToHMS(adjustedSec), liveToast);
    }, true);

    // 단축키 복사
    document.addEventListener('keydown', async (e) => {
      if (e.repeat || e.isComposing || settingsOpen || isTyping(e)) return;
      const hk = loadHotkey();
      if (!matchHotkey(e, hk)) return;
      e.preventDefault();
      e.stopPropagation();

      const t = getLiveTime();
      if (!isHMS(t)) return liveToast('시간 포맷을 읽지 못했습니다. 잠시 후 다시 시도해주세요.');
      const baseSec = parseHMS(t);
      const adjustedSec = Math.max(0, baseSec - loadOffset());
      await copyText(secondsToHMS(adjustedSec), liveToast);
    }, true);
  }

  // 다시보기
  if (location.hostname.startsWith('vod.sooplive.co.kr')) {
    function getVodTime() {
      const el = document.querySelector('.time_display .time-current');
      return el ? el.textContent.trim() : null;
    }
    const isHMS = (t) => /^\d{1,2}:\d{2}:\d{2}$/.test(String(t||'').trim());

    // VOD 툴팁: 최초 설정 + 호버 시 최신 단축키로 갱신
    const setVodTooltip = () => {
      const box = document.querySelector('.time_display');
      if (box) box.title = `현재 재생시간 복사 (${currentHotkeyLabel()})`;
    };
    setVodTooltip();
    document.addEventListener('mouseover', (e) => {
      const box = e.target.closest('.time_display');
      if (box) box.title = `현재 재생시간 복사 (${currentHotkeyLabel()})`;
    }, true);

    // 드래그/롱프레스 보호
    let vodDownInfo = null;
    document.addEventListener('mousedown', (e) => {
      const box = e.target.closest('.time_display');
      if (!box) return;
      vodDownInfo = { x: e.clientX, y: e.clientY, t: Date.now() };
    }, true);

    // 토스트
    function vodToast(message){
      const toastContainer = document.querySelector('#toastMessage');
      if (!toastContainer) { alert(message); return; }
      const wrap = document.createElement('div');
      const p = document.createElement('p');
      p.textContent = message;
      wrap.appendChild(p);
      toastContainer.appendChild(wrap);
      setTimeout(() => { if (wrap.parentNode === toastContainer) toastContainer.removeChild(wrap); }, TOAST_MS);
    }

    // 클릭 복사
    document.addEventListener('click', async (e) => {
      const box = e.target.closest('.time_display');
      if (!box) return;

      const moved = vodDownInfo && (Math.hypot(e.clientX - vodDownInfo.x, e.clientY - vodDownInfo.y) > VOD_DRAG_PX);
      const long  = vodDownInfo && ((Date.now() - vodDownInfo.t) > VOD_LONG_MS);
      vodDownInfo = null;
      if (moved || long) return;

      // 클릭 순간에도 최신 라벨로 보장
      box.title = `현재 재생시간 복사 (${currentHotkeyLabel()})`;

      const t = getVodTime();
      if (!isHMS(t)) return vodToast('시간 정보를 찾을 수 없습니다. 잠시 후 다시 시도해주세요.');
      await copyText(t, vodToast);
    }, true);

    // 단축키 복사
    document.addEventListener('keydown', async (e) => {
      if (e.repeat || e.isComposing || settingsOpen || isTyping(e)) return;
      const hk = loadHotkey();
      if (!matchHotkey(e, hk)) return;
      e.preventDefault();
      e.stopPropagation();

      const t = getVodTime();
      if (!isHMS(t)) return vodToast('시간 정보를 찾을 수 없습니다. 잠시 후 다시 시도해주세요.');
      await copyText(t, vodToast);
    }, true);
  }
})();
