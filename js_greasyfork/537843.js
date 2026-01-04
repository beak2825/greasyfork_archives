// ==UserScript==
// @name         Marumori.io Notes Sidebar with Rich Text Editor
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add a notes sidebar with a rich text editor to Marumori.io lesson pages
// @author       Matskye
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marumori.io
// @match        https://marumori.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537843/Marumoriio%20Notes%20Sidebar%20with%20Rich%20Text%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/537843/Marumoriio%20Notes%20Sidebar%20with%20Rich%20Text%20Editor.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ========= CONFIG ========= */
  const DB_NAME = 'MarumoriNotesDB';
  const STORE_NAME = 'notes';
  const DB_VERSION = 1;
  const LOCAL_KEY_OPEN = 'mm_notes_sidebar_open';
  const LOCAL_KEY_WIDTH = 'mm_notes_sidebar_width';
  const SIDEBAR_ID = 'mm-notes-sidebar';
  const TOGGLE_ID = 'mm-notes-toggle';
  const EDITOR_ID = 'mm-notes-editor';
  const SAVED_BADGE_ID = 'mm-notes-saved-badge';
  const DRAGGER_ID = 'mm-notes-resize-handle';
  const DEFAULT_WIDTH = 36;
  const MIN_WIDTH = 24;
  const MAX_WIDTH = 50;

  const LESSON_WRAPPER_SEL = 'main.lesson-wrapper';
  const LESSON_PAGE_SENTINEL = '.lesson-background-wrapper';
  const LESSON_TAG_SEL = '.tag.default';

  const QUILL_JS = 'https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js';
  const QUILL_CSS = 'https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css';
  const TURNDOWN_JS = 'https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.browser.umd.js';

  /* ========= HELPERS ========= */
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const getLocalJSON = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const setLocalJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  const toFileDownload = (name, content, mime) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const loadScript = src => new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
  const loadStyle = href => new Promise((res, rej) => {
    if (document.querySelector(`link[href="${href}"]`)) return res();
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = href;
    l.onload = res; l.onerror = rej;
    document.head.appendChild(l);
  });

  const htmlToPlainText = html => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  /* ========= INDEXED DB ========= */
  const NotesDB = (() => {
    let db;
    const open = () => new Promise((res, rej) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onerror = () => rej(req.error);
      req.onupgradeneeded = () => {
        const _db = req.result;
        if (!_db.objectStoreNames.contains(STORE_NAME))
          _db.createObjectStore(STORE_NAME, { keyPath: 'lesson' });
      };
      req.onsuccess = () => { db = req.result; res(db); };
    });
    const ensure = async () => db || open();
    const get = async k => {
      const _db = await ensure();
      return new Promise((res, rej) => {
        const tx = _db.transaction(STORE_NAME, 'readonly');
        const r = tx.objectStore(STORE_NAME).get(k);
        r.onsuccess = () => res(r.result || null);
        r.onerror = () => rej(r.error);
      });
    };
    const put = async n => {
      const _db = await ensure();
      return new Promise((res, rej) => {
        const tx = _db.transaction(STORE_NAME, 'readwrite');
        const r = tx.objectStore(STORE_NAME).put(n);
        r.onsuccess = () => res();
        r.onerror = () => rej(r.error);
      });
    };
    const getAll = async () => {
      const _db = await ensure();
      return new Promise((res, rej) => {
        const tx = _db.transaction(STORE_NAME, 'readonly');
        const r = tx.objectStore(STORE_NAME).getAll();
        r.onsuccess = () => res(r.result || []);
        r.onerror = () => rej(r.error);
      });
    };
    return { open, get, put, getAll };
  })();

  /* ========= DETECTION ========= */
  const isLessonPage = () => document.querySelector(LESSON_PAGE_SENTINEL);
  const currentLessonId = () => {
    const tag = document.querySelector(LESSON_TAG_SEL);
    if (tag) {
      const text = tag.textContent.trim();
      const m = text.match(/#\d+/);
      if (m) return m[0];
    }
    const u = location.pathname.match(/lesson\/(\d+)/i);
    return u ? `#${u[1]}` : null;
  };

  /* ========= STYLING ========= */
  function injectStyles() {
    if (document.getElementById('mm-style')) return;
    const s = document.createElement('style');
    s.id = 'mm-style';
    s.textContent = `
      :root {
        --mm-bg: #171a1c; --mm-panel: #1f2326;
        --mm-border: #2b3236; --mm-fg: #eef1f3;
        --mm-btn: #262c30; --mm-btn-hover: #30383d;
        --mm-shadow: 0 10px 28px rgba(0,0,0,0.35);
        --mm-radius: 12px;
      }
      #${SIDEBAR_ID}{
        position:fixed; top:0; right:0; height:100vh; width:36vw;
        background:var(--mm-bg); color:var(--mm-fg);
        border-left:1px solid var(--mm-border);
        transform:translateX(100%); transition:transform .3s ease;
        z-index:10000; display:flex; flex-direction:column;
        box-shadow:var(--mm-shadow);
      }
      #${SIDEBAR_ID}.open{ transform:translateX(0); }
      #${TOGGLE_ID}{
        position:fixed; top:12px; right:12px;
        background:var(--mm-btn); color:var(--mm-fg);
        border:1px solid var(--mm-border);
        border-radius:var(--mm-radius);
        padding:6px 10px; cursor:pointer;
        box-shadow:var(--mm-shadow);
        z-index:10001;
      }
      #${TOGGLE_ID}:hover{ background:var(--mm-btn-hover); }

      #${DRAGGER_ID}{
        position:absolute; left:-8px; top:0; width:8px; height:100%;
        cursor:ew-resize;
      }

      .mm-header{
        display:flex; align-items:center; justify-content:space-between;
        padding:10px 12px; background:var(--mm-panel);
        border-bottom:1px solid var(--mm-border);
      }

      .mm-btn, .mm-select{
        background:var(--mm-btn); color:var(--mm-fg);
        border:1px solid var(--mm-border);
        border-radius:8px; padding:6px 8px; cursor:pointer; font-size:13px;
      }
      .mm-btn:hover{ background:var(--mm-btn-hover); }
      .mm-controls{ display:flex; gap:8px; align-items:center; }

      #${SAVED_BADGE_ID}{ font-size:12px; opacity:0; transition:opacity .2s; color:#ccc; }
      #${SAVED_BADGE_ID}.visible{ opacity:1; }

      .ql-toolbar.ql-snow{
        border:none!important; border-bottom:1px solid var(--mm-border)!important;
        background:var(--mm-panel)!important; padding:6px!important;
        display:flex; flex-wrap:wrap; gap:6px;
      }
      .ql-container.ql-snow{ border:none!important; flex:1; }
      .ql-editor{ color:var(--mm-fg); min-height:60vh; }
      .ql-editor a{ color:#8ab4f8; text-decoration:underline; }

      #${EDITOR_ID} {
        flex: 1;
        overflow-y: auto;
        min-height: 60vh;
        display: flex;
        flex-direction: column;
      }
            ${LESSON_WRAPPER_SEL} {
        transition: margin-right .3s ease;
      }
    `;
    document.head.appendChild(s);
  }

  function createToggle() {
    if (document.getElementById(TOGGLE_ID)) return;
    const b = document.createElement('button');
    b.id = TOGGLE_ID;
    b.textContent = '📝';
    b.title = 'Toggle notes (Alt+N)';
    b.addEventListener('click', () => toggleSidebar());
    document.body.appendChild(b);
  }

  function setupResizer(sidebar) {
    const handle = sidebar.querySelector(`#${DRAGGER_ID}`);
    let startX = 0, startW = DEFAULT_WIDTH;
    const move = e => {
      const dx = startX - e.clientX;
      const vw = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startW + (dx / innerWidth) * 100));
      sidebar.style.width = `${vw}vw`;
      const wrap = document.querySelector(LESSON_WRAPPER_SEL);
      if (wrap && sidebar.classList.contains('open')) wrap.style.marginRight = `${vw}vw`;
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      setLocalJSON(LOCAL_KEY_WIDTH, parseFloat(sidebar.style.width));
    };
    handle.addEventListener('mousedown', e => {
      startX = e.clientX;
      startW = parseFloat(sidebar.style.width) || DEFAULT_WIDTH;
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
  }

  /* ========= SIDEBAR & EDITOR ========= */
  let quill, currentLesson = null;
  const savingState = { pending: false, timer: null };

  async function buildSidebar() {
    injectStyles(); createToggle();
    let sb = document.getElementById(SIDEBAR_ID);
    if (!sb) {
      sb = document.createElement('aside');
      sb.id = SIDEBAR_ID;
      sb.style.width = `${getLocalJSON(LOCAL_KEY_WIDTH, DEFAULT_WIDTH)}vw`;
      sb.innerHTML = `
        <div id="${DRAGGER_ID}"></div>
        <div class="mm-header">
          <strong>Lesson Notes</strong>
          <span id="${SAVED_BADGE_ID}">Saved</span>
        </div>
        <div id="${EDITOR_ID}"></div>
        <div class="mm-header">
          <div class="mm-controls">
            <select class="mm-select" id="mm-scope"><option value="current">Current</option><option value="all">All</option></select>
            <select class="mm-select" id="mm-format"><option value="json">JSON</option><option value="markdown">Markdown</option><option value="text">Text</option></select>
            <button class="mm-btn" id="mm-export">Export</button>
            <button class="mm-btn" id="mm-import">Import</button>
          </div>
        </div>`;
      document.body.appendChild(sb);
      setupResizer(sb);
      setSidebarOpen(!!getLocalJSON(LOCAL_KEY_OPEN, false), true);
      setupExportImport();
    }

    await Promise.all([loadStyle(QUILL_CSS), loadScript(QUILL_JS), loadScript(TURNDOWN_JS)]);

    if (!quill) {
      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }, { size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['link'],
        ['clean']
      ];

      quill = new window.Quill(`#${EDITOR_ID}`, {
        theme: 'snow',
        modules: { toolbar: { container: toolbarOptions } }
      });

      quill.on('text-change', handleEditorChange);
    }
  }

  /* ========= EXPORT / IMPORT ========= */
  function setupExportImport() {
    document.getElementById('mm-export').onclick = async () => {
      const scope = document.getElementById('mm-scope').value;
      const fmt = document.getElementById('mm-format').value;
      if (scope === 'current' && currentLesson) {
        const n = await getOrCreate(currentLesson);
        const live = quill
          ? { ...n, delta: quill.getContents(), html: quill.root.innerHTML, updatedAt: new Date().toISOString() }
          : n;
        exportNotes([live], fmt, `note_${currentLesson.replace(/[^\w#-]+/g, '_')}.${fmt}`);
      } else {
        const all = await NotesDB.getAll();
        exportNotes(all, fmt, `all_notes.${fmt}`);
      }
    };

    document.getElementById('mm-import').onclick = () => {
      const i = document.createElement('input');
      i.type = 'file'; i.accept = '.json';
      i.onchange = async e => {
        const f = e.target.files[0];
        if (!f) return;
        const arr = JSON.parse(await f.text());
        const notes = Array.isArray(arr) ? arr : [arr];
        for (const n of notes) await NotesDB.put(n);
        location.reload();
      };
      i.click();
    };
  }

  async function exportNotes(notes, fmt, name) {
    if (notes.length === 1 && currentLesson && quill) {
      notes[0] = { ...notes[0], delta: quill.getContents(), html: quill.root.innerHTML };
    }

    if (fmt === 'json') {
      return toFileDownload(name, JSON.stringify(notes, null, 2), 'application/json');
    }

    if (fmt === 'markdown') {
      const td = window.TurndownService ? new window.TurndownService() : null;
      const md = notes
        .map(
          n =>
            `## ${n.lesson}\n` +
            `_Last updated: ${n.updatedAt}_\n\n` +
            `${td ? td.turndown(n.html || '') : htmlToPlainText(n.html || '')}`
        )
        .join('\n---\n');
      return toFileDownload(name, md, 'text/markdown');
    }

    const txt = notes
      .map(n => `${n.lesson}\n${htmlToPlainText(n.html || '')}`)
      .join('\n---\n');
    toFileDownload(name, txt, 'text/plain');
  }

  /* ========= SAVING ========= */
  const handleEditorChange = async () => {
    if (!currentLesson || !quill || savingState.pending) return;
    savingState.pending = true;
    showBadge('Saving…');
    try {
      await NotesDB.put({
        lesson: currentLesson,
        delta: quill.getContents(),
        html: quill.root.innerHTML,
        updatedAt: new Date().toISOString()
      });
      showBadge('Saved', true);
    } catch (e) {
      console.error(e);
    }
    savingState.pending = false;
  };

  const showBadge = (t, flash) => {
    const b = document.getElementById(SAVED_BADGE_ID);
    if (!b) return;
    b.textContent = t;
    b.classList.add('visible');
    clearTimeout(savingState.timer);
    savingState.timer = setTimeout(() => b.classList.remove('visible'), flash ? 1200 : 0);
  };

  window.addEventListener('beforeunload', async () => {
    if (currentLesson && quill)
      await NotesDB.put({
        lesson: currentLesson,
        delta: quill.getContents(),
        html: quill.root.innerHTML,
        updatedAt: new Date().toISOString()
      });
  });

  async function getOrCreate(lesson) {
    const ex = await NotesDB.get(lesson);
    if (ex) return ex;
    const n = { lesson, delta: [], html: '', updatedAt: new Date().toISOString() };
    await NotesDB.put(n);
    return n;
  }

  async function loadLesson(lesson) {
    currentLesson = lesson;
    await buildSidebar();
    const n = await getOrCreate(lesson);
    quill.setContents(n.delta || []);
  }

  /* ========= SIDEBAR TOGGLE ========= */
function setSidebarOpen(o) {
  const s = document.getElementById(SIDEBAR_ID);
  const w = document.querySelector(LESSON_WRAPPER_SEL);
  if (!s) return;

  s.classList.toggle('open', o);
  setLocalJSON(LOCAL_KEY_OPEN, !!o);

  const vw = parseFloat(s.style.width) || DEFAULT_WIDTH;
  if (w) w.style.marginRight = o ? `${vw}vw` : '';
}
  const toggleSidebar = f =>
    setSidebarOpen(f ?? !document.getElementById(SIDEBAR_ID)?.classList.contains('open'));

  /* ========= OBSERVER ========= */
  let obs;
  function startObserver() {
    if (obs) return;
    obs = new MutationObserver(() => checkRoute());
obs.observe(document.documentElement, { childList: true, subtree: true });
  }

async function checkRoute() {
  // if not on a lesson page, clean up
  if (!isLessonPage()) {
    document.getElementById(SIDEBAR_ID)?.remove();
    document.getElementById(TOGGLE_ID)?.remove();
    return;
  }

  // ignore "mark words known" page
  const markBtn = Array.from(document.querySelectorAll('span')).find(e =>
    e.textContent?.includes('I want to mark words as known')
  );
  if (markBtn) {
    document.getElementById(SIDEBAR_ID)?.remove();
    document.getElementById(TOGGLE_ID)?.remove();
    return;
  }

  const lesson = currentLessonId();
  if (!lesson) return;

  await NotesDB.open();

  // 🕒 Wait until lesson wrapper exists & is visible
  let wrapperReady = 0;
  while (!document.querySelector(LESSON_WRAPPER_SEL) && wrapperReady < 25) {
    await sleep(100);
    wrapperReady++;
  }

  // also wait for Quill container to be mounted (avoid early blank editor)
  if (!document.getElementById(EDITOR_ID)) {
    await sleep(100);
  }

  if (lesson !== currentLesson) {
    await loadLesson(lesson);
  } else if (quill && currentLesson) {
    // Reload content if Quill got wiped by re-render
    const n = await NotesDB.get(currentLesson);
    if (n && (!quill.getText().trim() || quill.getLength() <= 1)) {
      quill.setContents(n.delta || []);
    }
  } else {
    await buildSidebar();
  }
}

  function setupShortcuts() {
    document.addEventListener(
      'keydown',
      e => {
        if (
          e.altKey &&
          !e.shiftKey &&
          !e.ctrlKey &&
          !e.metaKey &&
          e.key.toLowerCase() === 'n'
        ) {
          e.preventDefault();
          toggleSidebar();
        }
      },
      { passive: false }
    );
  }

/* ========= SELF-HEAL WATCHDOG ========= */
function startSelfHealWatcher() {
  let intervalId = null;

  async function healCheck() {
    const isLesson = isLessonPage();
    if (!isLesson) return; // skip when not in a lesson

    const sidebar = document.getElementById(SIDEBAR_ID);
    const editor = document.getElementById(EDITOR_ID);

    // Case 1: lesson exists but sidebar vanished entirely
    if (isLesson && !sidebar) {
      console.warn('[Marumori Notes] Sidebar missing — rebuilding');
      await buildSidebar();
      return;
    }

    // Case 2: sidebar exists but Quill isn't initialized or lost content
    if (isLesson && sidebar && (!window.Quill || !quill)) {
      console.warn('[Marumori Notes] Quill instance missing — rebuilding');
      await buildSidebar();
      return;
    }

    // Case 3: Quill exists but its editor is blank while notes exist in DB
    if (isLesson && quill && currentLesson) {
      const n = await NotesDB.get(currentLesson);
      if (n && (!quill.getText().trim() || quill.getLength() <= 1) && n.delta?.ops?.length) {
        console.warn('[Marumori Notes] Empty editor detected — restoring note');
        quill.setContents(n.delta);
      }
    }
  }

  // start the loop
  function start() {
    if (intervalId) return;
    intervalId = setInterval(healCheck, 3000);
    console.debug('[Marumori Notes] Self-heal watcher active');
  }

  // stop the loop
  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      console.debug('[Marumori Notes] Self-heal watcher paused');
    }
  }

  // Observe page changes to start/stop automatically
  const observer = new MutationObserver(() => {
    if (isLessonPage()) start();
    else stop();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // start immediately if we’re already on a lesson
  if (isLessonPage()) start();
}

  /* ========= INIT ========= */
(async function init() {
  await sleep(150);
  await NotesDB.open();
  setupShortcuts();
  startObserver();
  startSelfHealWatcher(); // 🩹 added line
  await checkRoute();
})();

})();