// ==UserScript==
// @name         국회의견 자동입력
// @namespace    https://pal.assembly.go.kr/
// @version      1.0.0
// @description  국회의견을 자동으로 입력해줍니다.
// @match        https://pal.assembly.go.kr/*
// @run-at       document-start
// @inject-into  page
// @all-frames   true
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546528/%EA%B5%AD%ED%9A%8C%EC%9D%98%EA%B2%AC%20%EC%9E%90%EB%8F%99%EC%9E%85%EB%A0%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/546528/%EA%B5%AD%ED%9A%8C%EC%9D%98%EA%B2%AC%20%EC%9E%90%EB%8F%99%EC%9E%85%EB%A0%A5.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ===== 공통 옵션 ===== */
  const QUIET_MS = 2000;
  const DEBUG = true;
  const log = (...a)=>{ if (DEBUG) try{console.log('[PAL]', ...a)}catch{} };

  /* ===== 라우팅 패턴 ===== */
  const VIEW_PAGE_PATTERNS = [
    '/lgsltpaSearch/view.do',
    '/lgsltpa/lgsltpaOngoing/view.do',
    '/napal/lgsltpa/lgsltpaSearch/view.do',
    '/napal/lgsltpa/lgsltpaOngoing/view.do',
  ];
  const INSERT_PAGE_PATTERNS = [
    '/lgsltpa/lgsltpaOpn/forInsert.do',
    '/napal/lgsltpa/lgsltpaOpn/insert.do',
  ];
  const LIST_PAGE_PATTERNS = [
    '/lgsltpa/lgsltpaOpn/list.do',
    '/napal/lgsltpa/lgsltpaOpn/list.do',
  ];

  const SELECTORS = {
    title:   '[name="sj"]',
    body:    '[name="cn"]',
    captchaImg:  'img[alt*="보안문자"], img[src*="captcha"], img[id*="captcha"]',
    captchaInputCandidates: ['#catpchaAnswer', '#captchaAnswer', 'input[name="catpchaAnswer"]', 'input[name="captchaAnswer"]'],
    submitBtnCandidates:    ['#btn_opnReg', 'button#btn_opnReg', 'button[type="submit"]', 'a.btn_submit'],
    openRegBtn: 'button.btn_opnReg',
  };

  /* ===== 유틸 ===== */
  const qs  = s => document.querySelector(s);
  const qsa = s => Array.from(document.querySelectorAll(s));
  function setInputValue(target, value){
    const el = typeof target === 'string' ? qs(target) : target;
    if (!el) return;
    el.value = value;
    el.dispatchEvent(new Event('input',  { bubbles:true }));
    el.dispatchEvent(new Event('change', { bubbles:true }));
  }
  function absolutizeUrl(u){ try{ return new URL(u, location.href).href }catch{ return u } }
  function safeClose(reason=''){
    log('🔚 창 닫기 시도:', reason);
    let closed=false;
    try{ window.close(); closed=true }catch{}
    if(!closed){ try{ window.open('', '_self').close(); closed=true }catch{} }
    if(!closed){ if(history.length>1) history.back(); else location.href='about:blank' }
  }
  const scheduleQuietClose = (()=> {
    let t=null;
    return ()=>{ try{ if(t) clearTimeout(t) }catch{}; t=setTimeout(()=>safeClose('quiet-after-dialogs'), QUIET_MS) }
  })();

  /* =================================================================
   * [A] alert/confirm/prompt "하드락"
   * ================================================================= */
  (function hardLockDialogs() {
    function makeLocked(fn){
      try{ Object.freeze(fn) }catch{}
      return fn;
    }
    const fakeAlert   = makeLocked(function(){ try{scheduleQuietClose()}catch{}; return true; });
    const fakeConfirm = makeLocked(function(){ try{scheduleQuietClose()}catch{}; return true; });
    const fakePrompt  = makeLocked(function(){ try{scheduleQuietClose()}catch{}; return ''  ; });

    function lockOn(obj){
      if(!obj) return;
      try{
        try{ obj.alert   = fakeAlert   }catch{}
        try{ obj.confirm = fakeConfirm }catch{}
        try{ obj.prompt  = fakePrompt  }catch{}
        const lock = (key, val) => {
          try{
            Object.defineProperty(obj, key, {
              configurable: false,
              get: ()=>val,
              set: ()=>{},
            });
          }catch{}
        };
        lock('alert',   fakeAlert);
        lock('confirm', fakeConfirm);
        lock('prompt',  fakePrompt);
      }catch{}
    }

    function lockEverywhere(root){
      try{ lockOn(root) }catch{}
      try{ lockOn(root.top) }catch{}
      try{ lockOn(root.parent) }catch{}
      try{
        const proto = root.Window && root.Window.prototype;
        if (proto){
          const lockProto = (k, v)=>{
            try{
              Object.defineProperty(proto, k, {
                configurable: false,
                get: ()=>v,
                set: ()=>{},
              });
            }catch{}
          };
          lockProto('alert',   fakeAlert);
          lockProto('confirm', fakeConfirm);
          lockProto('prompt',  fakePrompt);
        }
      }catch{}
      try{
        const ifr = root.document && root.document.getElementsByTagName('iframe');
        for (const f of ifr||[]){
          try{
            const cw = f.contentWindow;
            const src = f.getAttribute('src') || '';
            const same = !src || new URL(src, location.href).origin === location.origin;
            if (cw && same) lockOn(cw);
          }catch{}
        }
      }catch{}
    }

    lockEverywhere(window);
    let i=0;
    const again = setInterval(()=>{
      lockEverywhere(window);
      if(++i>=60) clearInterval(again);
    }, 50);

    const origOpen = window.open;
    window.open = function(...args){
      const w = origOpen.apply(this, args);
      if (!w) return w;
      try{ lockEverywhere(w) }catch{}
      try{ w.addEventListener('load', ()=>lockEverywhere(w), { once:true }) }catch{}
      setTimeout(()=>{ try{ lockEverywhere(w) }catch{} }, 120);
      return w;
    };
  })();

  /* =================================================================
   * [B] URL 변경 감시
   * ================================================================= */
  const UrlWatch = (function(){
    let last = location.href;
    const listeners = new Set();
    function emit(reason){
      const href = location.href;
      if (href === last) return;
      const prev = last; last = href;
      log('🔎 URL 변경:', reason, '\n   from:', prev, '\n   to  :', href);
      listeners.forEach(fn=>{ try{ fn(href, prev, reason) }catch(e){ console.warn(e) } });
    }
    ['pushState','replaceState'].forEach(k=>{
      const orig = history[k];
      history[k] = function(...a){
        const r = orig.apply(this, a);
        emit('history:'+k);
        return r;
      };
    });
    window.addEventListener('hashchange', ()=>emit('hashchange'));
    window.addEventListener('popstate',   ()=>emit('popstate'));
    setInterval(()=>emit('poll'), 120);
    return { onChange: fn=>listeners.add(fn), prime: ()=>emit('prime') };
  })();

  /* =================================================================
   * [C] 라우팅 헬퍼
   * ================================================================= */
  const hasAny = (href, arr)=>arr.some(p=>href.includes(p));
  const isView   = href => hasAny(href, VIEW_PAGE_PATTERNS);
  const isInsert = href => hasAny(href, INSERT_PAGE_PATTERNS);
  const isList   = href => hasAny(href, LIST_PAGE_PATTERNS) && new URL(href).searchParams.has('lgsltPaId');

  const pageState = { clickedOpenReg:false, ranInsert:false };

  /* =================================================================
   * [D] 상세/진행중: 의견등록 버튼 자동 클릭
   * ================================================================= */
  function setupAutoClickOpenReg(){
    if (pageState.clickedOpenReg) return;
    const clickNow = ()=>{
      const btn = qs(SELECTORS.openRegBtn);
      if (btn){ btn.click(); pageState.clickedOpenReg = true; log('✅ 의견등록 버튼 자동 클릭'); }
    };
    clickNow();
    const attach = ()=>{
      if (!document.body) return;
      const mo = new MutationObserver(muts=>{
        if (pageState.clickedOpenReg) return;
        for (const m of muts) for (const n of m.addedNodes){
          if (n.nodeType!==1) continue;
          if (n.matches?.(SELECTORS.openRegBtn) || n.querySelector?.(SELECTORS.openRegBtn)){
            setTimeout(clickNow, 80); return;
          }
        }
      });
      mo.observe(document.body, { childList:true, subtree:true });
    };
    (document.readyState==='loading')
      ? document.addEventListener('DOMContentLoaded', attach, { once:true })
      : attach();
  }

  /* =================================================================
   * [E] insert.do: 자동입력 + 캡차 팝업(찬반 선택) → 제출
   * ================================================================= */
  function saveToLocalServer(value, base64OrUrl){
    fetch('http://localhost:8000/upload', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ value, base64: base64OrUrl })
    }).then(()=>log('✅ 캡차 전송 OK')).catch(e=>log('⚠️ 로컬 전송 실패(무시):', e));
  }

  function getChoiceFromStorage(){
    const v = localStorage.getItem('pal_choice');
    return (v === 'pros' || v === 'cons') ? v : 'cons'; // 기본=반대(cons)
  }
  function setChoiceToStorage(choice){
    try{ localStorage.setItem('pal_choice', choice) }catch{}
  }

  function makeTexts(choice){
    if (choice === 'pros'){
      return {
        title: '찬성합니다',
        body:  '발의된 이 법안에 찬성합니다. 조속한 통과를 요청드립니다.'
      };
    }
    // default: cons
    return {
      title: '반대합니다',
      body:  '발의된 이 법안에 반대합니다. 충분한 재검토를 요청드립니다.'
    };
  }

  function showCaptchaPopup(imageUrl, onSubmit){
    qs('#captcha-popup')?.remove();
    const remembered = getChoiceFromStorage();

    const w = document.createElement('div');
    w.id='captcha-popup';
    w.style = `
      position:fixed; top:30%; left:50%; transform:translate(-50%,-30%);
      background:#fff; border:2px solid #444; padding:16px; z-index:99999;
      box-shadow:0 0 10px rgba(0,0,0,.4); text-align:center; min-width:280px; max-width:92vw; font-family:system-ui,apple sd gothic neo,Segoe UI,Malgun Gothic,sans-serif;
    `;
    w.innerHTML = `
      <h3 style="margin:0 0 10px;">🛡️ 보안문자 입력</h3>
      <img src="${imageUrl}" alt="captcha" style="display:block;margin:0 auto 8px;max-width:100%;max-height:50vh;object-fit:contain;image-rendering:pixelated;"/>
      <div id="choiceBox" style="display:flex;gap:12px;justify-content:center;align-items:center;margin:6px 0 10px;">
        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
          <input type="radio" name="pal_choice" value="cons" ${remembered==='cons'?'checked':''}/>
          <span>반대</span>
        </label>
        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
          <input type="radio" name="pal_choice" value="pros" ${remembered==='pros'?'checked':''}/>
          <span>찬성</span>
        </label>
      </div>
      <input type="text" id="captchaInputField" placeholder="보안문자 (4~5자리)" maxlength="5" style="padding:8px;font-size:16px;width:160px;border:1px solid #aaa;border-radius:6px;"/>
      <div id="err" style="color:#c00;font-size:12px;min-height:14px;margin-top:6px;"></div>
      <div style="margin-top:10px;display:flex;gap:8px;justify-content:center;">
        <button id="captchaSubmitBtn" style="padding:8px 16px;font-size:14px;cursor:pointer;border:1px solid #333;border-radius:6px;background:#f3f3f3;">확인</button>
        <button id="captchaCancelBtn" style="padding:8px 16px;font-size:14px;cursor:pointer;border:1px solid #999;border-radius:6px;background:#fff;">취소</button>
      </div>
    `;
    document.body.appendChild(w);

    const input = w.querySelector('#captchaInputField');
    const btnSubmit = w.querySelector('#captchaSubmitBtn');
    const btnCancel = w.querySelector('#captchaCancelBtn');
    const err = w.querySelector('#err');

    input.addEventListener('keydown', e=>{ if(e.key==='Enter') btnSubmit.click() });

    btnCancel.addEventListener('click', ()=>{ w.remove(); });

    btnSubmit.addEventListener('click', ()=>{
      const val = input.value.trim();
      if (val.length < 4){
        err.textContent = '4자리 이상 입력해주세요.';
        input.focus();
        return;
      }
      const choice = (w.querySelector('input[name="pal_choice"]:checked')?.value) || 'cons';
      setChoiceToStorage(choice);
      w.remove();
      onSubmit(val, choice);
    });

    input.focus();
  }

  function runInsertFlow(){
    if (pageState.ranInsert) return;
    pageState.ranInsert = true;
    log('🧩 insert 페이지 감지: 자동 입력 시작');

    const start = ()=>{
      const img = qs(SELECTORS.captchaImg);
      const inputEl = SELECTORS.captchaInputCandidates.map(qs).find(Boolean);
      const submit  = SELECTORS.submitBtnCandidates.map(qs).find(Boolean);
      const titleEl = qs(SELECTORS.title);
      const bodyEl  = qs(SELECTORS.body);

      if(!img || !inputEl || !submit || !titleEl || !bodyEl){
        log('⚠️ 필수 요소 미발견', {img:!!img, input:!!inputEl, submit:!!submit, title:!!titleEl, body:!!bodyEl});
        return;
      }

      // 초기에는 저장된 선택값 기준으로 미리 채워둠(사용자가 팝업에서 변경 가능)
      const initChoice = getChoiceFromStorage();
      const initTexts = makeTexts(initChoice);
      setInputValue(titleEl, initTexts.title);
      setInputValue(bodyEl,  initTexts.body);

      const url = absolutizeUrl(img.getAttribute('src') || img.src);

      showCaptchaPopup(url, (val, choice)=>{
        try{ saveToLocalServer(val, url) }catch{}
        // 최종 선택값으로 내용 갱신 후 제출
        const { title, body } = makeTexts(choice);
        setInputValue(titleEl, title);
        setInputValue(bodyEl,  body);
        setInputValue(inputEl,  val);

        inputEl.focus();
        setTimeout(()=>submit.click(), 300);
      });
    };

    (document.readyState==='loading')
      ? document.addEventListener('DOMContentLoaded', start, { once:true })
      : start();
  }

  /* =================================================================
   * [F] 목록 도착 시 자동 닫기
   * ================================================================= */
  function closeIfList(href, why='arrived-list'){
    if (isList(href)){
      setTimeout(()=>safeClose(why), 120);
      return true;
    }
    return false;
  }

  /* =================================================================
   * [G] URL 라우터
   * ================================================================= */
  function route(href){
    if (closeIfList(href)) return;
    if (isView(href)){
      pageState.clickedOpenReg=false;
      setupAutoClickOpenReg();
      return;
    }
    if (isInsert(href)){
      runInsertFlow();
      return;
    }
  }

  /* 부팅 & 감시 */
  route(location.href);
  UrlWatch.onChange(href=>route(href));
  UrlWatch.prime();
})();
