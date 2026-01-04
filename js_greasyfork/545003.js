// ==UserScript==
// @name         Google Sites - Code Formatter Modal
// @namespace    google-sites-explainpark101-code-formatter
// @version      0.4.2
// @description  Allows use of code formatter in Google Sites
// @match        https://sites.google.com/d/*/edit
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-idle
// @require      https://unpkg.com/prettier@3.3.3/standalone.js
// @require      https://unpkg.com/prettier@3.3.3/plugins/babel.js
// @require      https://unpkg.com/prettier@3.3.3/plugins/typescript.js
// @require      https://unpkg.com/prettier@3.3.3/plugins/estree.js
// @require      https://unpkg.com/prettier@3.3.3/plugins/html.js
// @require      https://unpkg.com/prettier@3.3.3/plugins/postcss.js
// @require      https://unpkg.com/prettier@3.3.3/plugins/markdown.js
// @require      https://unpkg.com/sql-formatter@15.3.2/dist/sql-formatter.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545003/Google%20Sites%20-%20Code%20Formatter%20Modal.user.js
// @updateURL https://update.greasyfork.org/scripts/545003/Google%20Sites%20-%20Code%20Formatter%20Modal.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // -------------------- Styles --------------------
  GM_addStyle(`
    .exlnprk-open-btn {
      position: fixed;
      /* 수정: right -> left 로 변경 */
      left: max(16px, env(safe-area-inset-left) + 12px);
      bottom: max(16px, env(safe-area-inset-bottom) + 12px);
      z-index: 2147483647;
      background: #1f6feb; color: #fff; border: none; border-radius: 20px;
      padding: 10px 14px; font-size: 14px; cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,.2);
      transition: transform .12s ease, box-shadow .12s ease;
    }
    .exlnprk-open-btn:focus { outline: 2px solid #99c2ff; outline-offset: 2px; }
    @media (max-width: 640px) {
      .exlnprk-open-btn {
        bottom: calc(max(16px, env(safe-area-inset-bottom) + 12px) + 56px);
      }
    }

    /* 드래그 중 시각 효과 */
    .exlnprk-open-btn.exlnprk-dragging {
      transform: scale(0.96);
      box-shadow: 0 10px 24px rgba(0,0,0,.35);
      cursor: grabbing;
    }
    .exlnprk-open-btn.exlnprk-dragging::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 24px;
      border: 2px dashed #1f6feb;
      opacity: .6;
      animation: exlnprk-pulse 1s ease-in-out infinite;
      pointer-events: none;
    }
    @keyframes exlnprk-pulse {
      0% { opacity: .6; }
      50% { opacity: .2; }
      100% { opacity: .6; }
    }

    dialog.exlnprk-dialog {
      z-index: 2147483647; border: none; border-radius: 12px; padding: 0;
      width: min(920px, 92vw);
      color: #1f2328; background: #ffffff; box-shadow: 0 20px 48px rgba(0,0,0,.25);
    }
    dialog.exlnprk-dialog::backdrop { background: rgba(0,0,0,.35); }

    .exlnprk-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px; border-bottom: 1px solid #e6e6e6; background: #f7f9fc;
      border-top-left-radius: 12px; border-top-right-radius: 12px;
    }
    .exlnprk-title { margin: 0; font-size: 16px; font-weight: 700; }
    .exlnprk-close {
      background: transparent; border: none; font-size: 18px; cursor: pointer;
    }
    .exlnprk-body { padding: 12px 16px 8px 16px; }
    .exlnprk-controls {
      display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 8px;
    }
    .exlnprk-controls label { font-size: 13px; color: #3b3f45; }
    .exlnprk-controls select, .exlnprk-controls input[type="number"] {
      padding: 4px 8px; font-size: 13px;
    }
    .exlnprk-checkbox { display: inline-flex; align-items: center; gap: 6px; }
    .exlnprk-ta {
      width: 100%; height: 380px; resize: vertical; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
      font-size: 13px; line-height: 1.5; padding: 10px 12px; border: 1px solid #e1e4e8; border-radius: 8px;
    }
    .exlnprk-footer {
      display: flex; gap: 8px; justify-content: space-between; align-items: center; padding: 10px 16px 16px 16px;
    }
    .exlnprk-btn {
      border: 1px solid #d0d7de; background: #f6f8fa; color: #24292f;
      padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 13px;
    }
    .exlnprk-btn.primary { background: #1f6feb; color: #fff; border-color: #1f6feb; }
    .exlnprk-btn:focus { outline: 2px solid #99c2ff; outline-offset: 2px; }
    .exlnprk-status { font-size: 12px; color: #59636e; padding: 0 16px 12px 16px; min-height: 18px; }
    .exlnprk-left { display: flex; gap: 8px; }
    .exlnprk-right { display: flex; gap: 8px; }
    .exlnprk-body {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 0;
    }
    .exlnprk-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      min-width: 0;
    }
    .exlnprk-ta {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      box-sizing: border-box;
      resize: vertical;
      overflow: auto;
    }
  `);

  // -------------------- Constants & Utils --------------------
  const LS_KEYS = {
    customLangs: 'exlnprk-customLangs',
    lastLang: 'exlnprk-lastLang',
    btnPos: 'exlnprk-open-btn-pos',
  };

  const baseLangs = ['python', 'javascript', 'sql', 'css', 'html', 'vue', 'cpp', 'rust', 'go', 'r'];

  const prettierParsers = {
    javascript: 'babel',
    typescript: 'typescript',
    html: 'html',
    css: 'css',
    json: 'json',
    markdown: 'markdown',
    vue: 'vue',
  };

  const loadCustomLangs = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEYS.customLangs) || '[]'); }
    catch { return []; }
  };
  const saveCustomLangs = (arr) => {
    try { localStorage.setItem(LS_KEYS.customLangs, JSON.stringify(arr)); } catch {}
  };

  const getIndent = () => Math.min(Math.max(parseInt(indentInput.value || '2', 10), 1), 8);
  const tabsToSpaces = (text, size) => text.replace(/\t/g, ' '.repeat(size));
  const normalizeEOL = (text) => text.replace(/\r\n?/g, '\n');

  function setStatus(msg, isError = false) {
    status.textContent = msg || '';
    status.style.color = isError ? '#b42318' : '#59636e';
  }
  function ensurePrettier() {
    const has = !!(globalThis.prettier && globalThis.prettierPlugins);
    if (!has) setStatus('Prettier 로딩 중이거나 사용 불가 상태입니다.', true);
    return has;
  }
  function ensureSqlFormatter() {
    return !!globalThis.sqlFormatter;
  }
  function displayName(v) {
    const map = {
      python: 'Python', javascript: 'JavaScript', sql: 'SQL', css: 'CSS',
      html: 'HTML', vue: 'Vue', cpp: 'C++', rust: 'Rust', go: 'Go', r: 'R'
    };
    return map[v] || v;
  }
  function option(value, text) {
    const o = document.createElement('option'); o.value = value; o.textContent = text; return o;
  }
  function isCustomValue(v) { return v.startsWith('custom:'); }
  function customValue(name) { return 'custom:' + name; }

  // -------------------- Elements (Trusted Types-safe) --------------------
  const openBtn = document.createElement('button');
  openBtn.className = 'exlnprk-open-btn';
  openBtn.type = 'button';
  openBtn.setAttribute('aria-label', 'Code Formatter 열기');
  openBtn.textContent = 'Code Formatter';

  const dlg = document.createElement('dialog');
  dlg.className = 'exlnprk-dialog';
  dlg.setAttribute('role', 'dialog');
  dlg.setAttribute('aria-modal', 'true');

  const header = document.createElement('div');
  header.className = 'exlnprk-header';
  const title = document.createElement('h2');
  title.id = 'exlnprk-title';
  title.className = 'exlnprk-title';
  title.textContent = '코드 포맷터';
  const closeX = document.createElement('button');
  closeX.className = 'exlnprk-close';
  closeX.type = 'button';
  closeX.setAttribute('aria-label', '닫기');
  closeX.textContent = '✕';
  header.append(title, closeX);

  const body = document.createElement('div');
  body.className = 'exlnprk-body';
  body.setAttribute('aria-labelledby', 'exlnprk-title');

  const controls = document.createElement('div');
  controls.className = 'exlnprk-controls';

  const langLabel = document.createElement('label'); langLabel.textContent = '언어 ';
  const langSel = document.createElement('select');
  langSel.id = 'exlnprk-lang';
  langSel.setAttribute('aria-label', '언어 선택');
  langLabel.appendChild(langSel);

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'exlnprk-btn';
  addBtn.textContent = '언어 추가';

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.className = 'exlnprk-btn';
  delBtn.textContent = '언어 삭제';

  const indentLabel = document.createElement('label'); indentLabel.textContent = '들여쓰기 ';
  const indentInput = document.createElement('input');
  indentInput.id = 'exlnprk-indent';
  indentInput.type = 'number'; indentInput.min = '1'; indentInput.max = '8'; indentInput.value = '2';
  indentInput.setAttribute('aria-label', '들여쓰기 공백 수');
  indentLabel.appendChild(indentInput);

  const cbWrap = document.createElement('label'); cbWrap.className = 'exlnprk-checkbox';
  const autoTabs = document.createElement('input');
  autoTabs.id = 'exlnprk-autoTabs'; autoTabs.type = 'checkbox'; autoTabs.checked = true;
  cbWrap.append(autoTabs, document.createTextNode('붙여넣을 때 탭을 스페이스로 자동 변환'));

  controls.append(langLabel, addBtn, delBtn, indentLabel, cbWrap);

  const ta = document.createElement('textarea');
  ta.id = 'exlnprk-ta';
  ta.className = 'exlnprk-ta';
  ta.setAttribute('spellcheck', 'false');
  ta.placeholder = '여기에 코드를 붙여넣으세요';

  body.append(controls, ta);

  const status = document.createElement('div');
  status.id = 'exlnprk-status';
  status.className = 'exlnprk-status';
  status.setAttribute('aria-live', 'polite');

  const footer = document.createElement('div');
  footer.className = 'exlnprk-footer';
  const leftGrp = document.createElement('div'); leftGrp.className = 'exlnprk-left';
  const fmtBtn = document.createElement('button');
  fmtBtn.id = 'exlnprk-format';
  fmtBtn.className = 'exlnprk-btn';
  fmtBtn.type = 'button';
  fmtBtn.title = 'Ctrl+Enter';
  fmtBtn.textContent = '포맷팅';
  const copyBtn = document.createElement('button');
  copyBtn.id = 'exlnprk-copy';
  copyBtn.className = 'exlnprk-btn primary';
  copyBtn.type = 'button';
  copyBtn.title = 'Ctrl+Shift+C';
  copyBtn.textContent = '복사';
  leftGrp.append(fmtBtn, copyBtn);
  const rightGrp = document.createElement('div'); rightGrp.className = 'exlnprk-right';
  const closeBtn2 = document.createElement('button');
  closeBtn2.id = 'exlnprk-close';
  closeBtn2.className = 'exlnprk-btn';
  closeBtn2.type = 'button';
  closeBtn2.textContent = '닫기(Esc)';
  rightGrp.append(closeBtn2);
  footer.append(leftGrp, rightGrp);

  dlg.append(header, body, status, footer);
  document.documentElement.append(openBtn, dlg);

  // -------------------- Language select --------------------
  function populateLangs() {
    const current = langSel.value;
    langSel.replaceChildren();
    baseLangs.forEach(l => langSel.appendChild(option(l, displayName(l))));
    loadCustomLangs().forEach(name => langSel.appendChild(option(customValue(name), name)));
    const last = localStorage.getItem(LS_KEYS.lastLang);
    if (last && [...langSel.options].some(o => o.value === last)) langSel.value = last;
    else if (current && [...langSel.options].some(o => o.value === current)) langSel.value = current;
  }
  populateLangs();

  // -------------------- Formatters --------------------
  async function formatWithPrettier(code, lang) {
    const parser = prettierParsers[lang];
    if (!parser) return null;
    const prettier = globalThis.prettier;
    const plugins = globalThis.prettierPlugins;
    return await prettier.format(code, {
      parser,
      plugins,
      tabWidth: getIndent(),
      useTabs: false,
      endOfLine: 'lf',
      semi: true,
      singleQuote: true,
      printWidth: 100,
      trailingComma: 'es5',
    });
  }
  function formatWithSqlFormatter(code) {
    if (!ensureSqlFormatter()) return null;
    try {
      return globalThis.sqlFormatter.format(code, { language: 'sql', tabWidth: getIndent() });
    } catch (e) {
      console.error('[exlnprk] sql format error:', e);
      setStatus(`SQL 포맷 실패: ${e?.message || e}`, true);
      return null;
    }
  }
  function basicCleanup(text) {
    return tabsToSpaces(normalizeEOL(text), getIndent());
  }

  // -------------------- Core actions --------------------
  async function formatCode() {
    let code = ta.value;
    code = tabsToSpaces(code, getIndent());
    const lang = langSel.value;

    try {
      if (prettierParsers[lang]) {
        if (!ensurePrettier()) {
          const safe = normalizeEOL(code);
          ta.value = safe;
          return { ok: false, code: safe, message: 'Prettier 미사용: 기본 정리만 적용' };
        }
        try {
          const formatted = await formatWithPrettier(code, lang);
          ta.value = formatted;
          return { ok: true, code: formatted };
        } catch (err) {
          console.warn('[exlnprk] Prettier parse error; fallback to basic cleanup:', err);
          setStatus(`포맷 실패(구문 오류 가능). 기본 정리로 대체했습니다.`, true);
          const safe = basicCleanup(code);
          ta.value = safe;
          return { ok: false, code: safe, message: err?.message || String(err) };
        }
      }

      if (lang === 'sql') {
        const formatted = formatWithSqlFormatter(code) || normalizeEOL(code);
        ta.value = formatted;
        return { ok: true, code: formatted };
      }

      const cleaned = basicCleanup(code);
      ta.value = cleaned;
      return { ok: true, code: cleaned };
    } catch (e) {
      console.error('[exlnprk] format error:', e);
      setStatus(`포맷팅 실패: ${e?.message || e}`, true);
      const safe = normalizeEOL(code);
      ta.value = safe;
      return { ok: false, code: safe, message: e?.message || String(e) };
    }
  }

  async function copyFormatted() {
    const { code } = await formatCode();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(code, { type: 'text', mimetype: 'text/plain' });
      } else {
        const tmp = document.createElement('textarea');
        tmp.value = code;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        tmp.remove();
      }
      setStatus('포맷팅된 코드를 클립보드로 복사했습니다.');
    } catch (e) {
      console.error('[exlnprk] copy error:', e);
      setStatus('클립보드 복사에 실패했습니다.', true);
    }
  }

  // -------------------- Dialog open/close --------------------
  let openerForFocus = null;
  function openDialog() {
    openerForFocus = document.activeElement;
    dlg.showModal();
    setTimeout(() => ta.focus(), 0);
    setStatus('팁: Ctrl+Enter=포맷, Ctrl+Shift+C=복사, Esc=닫기');
  }
  function closeDialog() {
    dlg.close();
    setStatus('');
    if (openerForFocus && typeof openerForFocus.focus === 'function') openerForFocus.focus();
    else openBtn.focus();
  }

  // -------------------- Events --------------------
  closeX.addEventListener('click', closeDialog);
  closeBtn2.addEventListener('click', closeDialog);

  ta.addEventListener('paste', (ev) => {
    if (!autoTabs.checked) return;
    try {
      const data = ev.clipboardData?.getData('text');
      if (typeof data === 'string') {
        ev.preventDefault();
        const converted = tabsToSpaces(data, getIndent());
        const { selectionStart, selectionEnd, value } = ta;
        const before = value.slice(0, selectionStart);
        const after = value.slice(selectionEnd);
        ta.value = before + converted + after;
        const pos = before.length + converted.length;
        ta.setSelectionRange(pos, pos);
      }
    } catch {}
  });

  dlg.addEventListener('keydown', async (e) => {
    if (e.key === 'Escape') { e.preventDefault(); closeDialog(); return; }
    const meta = e.ctrlKey || e.metaKey;
    if (meta && e.key.toLowerCase() === 'enter') { e.preventDefault(); const res = await formatCode(); if (res.ok) setStatus('포맷팅 완료'); }
    if (meta && e.shiftKey && e.key.toLowerCase() === 'c') { e.preventDefault(); await copyFormatted(); }
  });

  fmtBtn.addEventListener('click', async () => {
    const res = await formatCode();
    if (res.ok) setStatus('포맷팅 완료');
  });
  copyBtn.addEventListener('click', async () => { await copyFormatted(); });

  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'm') {
      e.preventDefault();
      if (dlg.open) closeDialog(); else openDialog();
    }
  });

  ['keydown', 'keyup', 'keypress'].forEach(type => {
    ta.addEventListener(type, (e) => e.stopPropagation());
  });

  langSel.addEventListener('change', () => {
    try { localStorage.setItem(LS_KEYS.lastLang, langSel.value); } catch {}
    delBtn.disabled = !isCustomValue(langSel.value);
  });
  addBtn.addEventListener('click', () => {
    const name = (prompt('추가할 언어 이름을 입력하세요 (예: Kotlin)') || '').trim();
    if (!name) return;
    const exists = [...langSel.options].some(o => o.textContent.toLowerCase() === name.toLowerCase());
    if (exists) { setStatus('이미 존재하는 언어입니다.'); return; }
    const list = loadCustomLangs(); list.push(name); saveCustomLangs(list);
    populateLangs();
    langSel.value = customValue(name);
    try { localStorage.setItem(LS_KEYS.lastLang, langSel.value); } catch {}
    delBtn.disabled = false;
    setStatus(`언어 추가: ${name}`);
  });
  delBtn.addEventListener('click', () => {
    const v = langSel.value;
    if (!isCustomValue(v)) { setStatus('기본 언어는 삭제할 수 없습니다.'); return; }
    const name = v.slice('custom:'.length);
    if (!confirm(`"${name}" 언어를 삭제할까요?`)) return;
    const list = loadCustomLangs().filter(n => n !== name);
    saveCustomLangs(list);
    populateLangs();
    delBtn.disabled = !isCustomValue(langSel.value);
    setStatus(`언어 삭제: ${name}`);
  });
  delBtn.disabled = !isCustomValue(langSel.value);

  // -------------------- Hold-to-drag(500ms) on FAB --------------------
  (function installHoldDragButton(btn, onActivate, opts = {}) {
    const holdMs = opts.holdMs ?? 500;
    const storageKey = LS_KEYS.btnPos;

    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      // 수정: saved.right -> saved.left
      if (saved && saved.left && saved.bottom) {
        // 수정: btn.style.right -> btn.style.left
        btn.style.left = saved.left;
        btn.style.bottom = saved.bottom;
      }
    } catch {}

    let down = false;
    let dragging = false;
    let holdTimer = null;
    // 수정: startRight -> startLeft
    let startX = 0, startY = 0, startLeft = 0, startBottom = 0;
    let pointerId = null;

    function savePos() {
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          // 수정: right -> left
          left: btn.style.left || '',
          bottom: btn.style.bottom || ''
        }));
      } catch {}
    }
    function startDragVisual() {
      dragging = true;
      btn.classList.add('exlnprk-dragging');
      try { setStatus('버튼 이동 모드: 드래그로 위치 조정'); } catch {}
    }
    function endDragVisual() {
      dragging = false;
      btn.classList.remove('exlnprk-dragging');
      try { setStatus(''); } catch {}
    }

    function onPointerDown(e) {
      if (typeof e.button === 'number' && e.button !== 0) return;
      down = true;
      dragging = false;
      pointerId = e.pointerId;
      btn.setPointerCapture?.(pointerId);

      const cs = getComputedStyle(btn);
      startX = e.clientX;
      startY = e.clientY;
      // 수정: cs.right -> cs.left, startRight -> startLeft
      startLeft = parseInt(cs.left, 10) || 0;
      startBottom = parseInt(cs.bottom, 10) || 0;

      holdTimer = setTimeout(() => {
        if (!down) return;
        startDragVisual();
      }, holdMs);

      e.preventDefault();
      e.stopPropagation();
    }
    function onPointerMove(e) {
      if (!down || !dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      // 수정: right 계산 -> left 계산
      btn.style.left = Math.max(0, startLeft + dx) + 'px';
      btn.style.bottom = Math.max(0, startBottom - dy) + 'px';
    }
    function onPointerUp(e) {
      if (!down) return;
      down = false;

      clearTimeout(holdTimer);
      holdTimer = null;

      if (dragging) {
        endDragVisual();
        savePos();
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if (typeof onActivate === 'function') onActivate();
      e.preventDefault();
      e.stopPropagation();
    }
    function onPointerCancel() {
      if (!down) return;
      down = false;
      clearTimeout(holdTimer);
      holdTimer = null;
      if (dragging) {
        endDragVisual();
        savePos();
      }
    }

    btn.addEventListener('pointerdown', onPointerDown);
    btn.addEventListener('pointermove', onPointerMove);
    btn.addEventListener('pointerup', onPointerUp);
    btn.addEventListener('pointercancel', onPointerCancel);

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, true);
  })(openBtn, openDialog, { holdMs: 500 });

  // -------------------- Keyboard nudge(Alt+Shift+Arrows) --------------------
  (function enablePositionNudge(btn) {
    function save() {
      try {
        localStorage.setItem(LS_KEYS.btnPos, JSON.stringify({
          // 수정: right -> left
          left: btn.style.left || '',
          bottom: btn.style.bottom || ''
        }));
      } catch {}
    }
    window.addEventListener('keydown', (e) => {
      if (!(e.altKey && e.shiftKey)) return;
      const step = 4;
      const cs = getComputedStyle(btn);
      // 수정: curRight -> curLeft
      const curLeft = parseInt(cs.left, 10) || 0;
      const curBottom = parseInt(cs.bottom, 10) || 0;
      if (e.key === 'ArrowUp') { btn.style.bottom = (curBottom + step) + 'px'; save(); e.preventDefault(); }
      else if (e.key === 'ArrowDown') { btn.style.bottom = Math.max(0, curBottom - step) + 'px'; save(); e.preventDefault(); }
      // 수정: right -> left 로직 변경
      else if (e.key === 'ArrowLeft') { btn.style.left = Math.max(0, curLeft - step) + 'px'; save(); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { btn.style.left = (curLeft + step) + 'px'; save(); e.preventDefault(); }
      // 수정: right, left 스타일 초기화
      else if (e.key.toLowerCase() === 'r') { btn.style.left = ''; btn.style.right = ''; btn.style.bottom = ''; localStorage.removeItem(LS_KEYS.btnPos); e.preventDefault(); }
    });
  })(openBtn);
})();