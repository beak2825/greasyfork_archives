// ==UserScript==
// @name         LingQ-style Word Highlighter for ttsu.app
// @version      1.5.0
// @description  Track known words with a red→green scale; Right-Click or Alt+Right-Click to set level; page-aware regex; batched highlights; dark-mode contrast; periodic refresher for infinite scroll; palette shows current level.
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @match        *://ttsu.app/*
// @match        *://*.ttsu.app/*
// @match        *://reader.ttsu.app/*
// @license MIT 
// @namespace tek
// @downloadURL https://update.greasyfork.org/scripts/545612/LingQ-style%20Word%20Highlighter%20for%20ttsuapp.user.js
// @updateURL https://update.greasyfork.org/scripts/545612/LingQ-style%20Word%20Highlighter%20for%20ttsuapp.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /*** ---------- CONFIG ---------- ***/
  const ONLY_IF_HOST_CONTAINS_TTSU = false;
  const TTSU_HOST_SNIPPETS = ["ttsu.app", "/ttsu", "reader.ttsu"];

  // Page-aware: build regex only from words that actually appear on the page.
  const PAGE_AWARE = true;
  const MAX_NGRAM = 8; // for CJK runs, collect 1..MAX_NGRAM tokens

  // Palette trigger: false = Alt+Right-Click (keeps native menu). true = intercept all right-clicks.
  const ALWAYS_INTERCEPT_RIGHT_CLICK = true;

  // Scope work to a known content root (big speedup). Leave "" to use document.body.
  const CONTENT_SCOPE_SELECTOR = ""; // e.g. "#root main", ".reader-content"

  // Periodic refresher for infinite-scroll:
  // const ENABLE_PERIODIC_RECALC = false;
  // const PERIODIC_INTERVAL_MS = 2000;

  // Knowledge levels → colors (red → green)
  const LEVELS = [
    { id: 0, name: "New",           color: "#ffd9d9" },
    { id: 1, name: "Primed",        color: "#ffcaa6" },
    { id: 2, name: "Familiar",      color: "#fff3a6" },
    { id: 3, name: "Comfortable",   color: "#e0f7a6" },
    { id: 4, name: "Recallable",    color: "#c7f0b7" },
    { id: 5, name: "Automatic",     color: "#b3e8ad" },
  ];

  /*** ---------- STYLES ---------- ***/
  const HIGHLIGHT_CSS = `
    .vm-lingq { border-radius: .25em; padding: .05em .15em; box-decoration-break: clone; -webkit-box-decoration-break: clone; transition: box-shadow 120ms; }
    .vm-lingq:hover { box-shadow: inset 0 0 0 2px rgba(0,0,0,.15); cursor: default; }

    .vm-palette {
      position: fixed;
      z-index: 2147483647;
      background: #fff;
      border: 1px solid rgba(0,0,0,.12);
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,.18);
      padding: 8px;
      min-width: 240px;
      font: 13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji";
      user-select: none;
      max-width: 92vw;
      max-height: 80vh;
      overflow: auto;
    }

    .vm-palette h4 {
      margin: 0 0 6px;
      font-size: 12px;
      font-weight: 600;
      color: #444;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }
    .vm-palette h4 .vm-current-label {   /* <<< ADDED */
      font-size: 11px;
      font-weight: 500;
      color: #888;
    }

    .vm-palette .vm-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }

    .vm-level {
      position: relative; /* <<< ADDED (for the check badge) */
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      border-radius: 8px;
      border: 1px solid rgba(0,0,0,.08);
      background: #fafafa;
      cursor: pointer;
      flex: 1 1 48%;
      min-width: 98px;
      transition: transform .06s, background .12s, border .12s, box-shadow .12s;
    }
    .vm-level:hover {
      transform: translateY(-1px);
      background: #f6f6f6;
    }

    /* ACTIVE STATE — slick glow ring + subtle backdrop */
    .vm-level.active { /* <<< ADDED */
      background: radial-gradient(circle at 0% 0%, rgba(0,0,0,.05) 0%, rgba(0,0,0,0) 60%), #fff;
      border: 1px solid rgba(0,0,0,.4);
      box-shadow:
        0 8px 20px rgba(0,0,0,.28),
        0 0 0 2px rgba(0,0,0,.6) inset,
        0 0 24px rgba(0,0,0,.4);
    }

    /* Little check badge in the corner */
    .vm-level .vm-active-check { /* <<< ADDED */
      position: absolute;
      top: 4px;
      right: 4px;
      width: 16px;
      height: 16px;
      border-radius: 6px;
      background: rgba(0,0,0,.75);
      color: #fff;
      font-size: 10px;
      font-weight: 600;
      line-height: 16px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,.4);
      opacity: 0;
      transform: scale(.7);
      transition: opacity .12s, transform .12s;
      pointer-events: none;
    }
    .vm-level.active .vm-active-check { /* <<< ADDED */
      opacity: 1;
      transform: scale(1);
    }

    .vm-swatch {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      border: 1px solid rgba(0,0,0,.15);
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.4);
    }

    .vm-actions {
      display: flex;
      gap: 8px;
      justify-content: space-between;
    }
    .vm-btn {
      flex: 1;
      text-align: center;
      padding: 6px 8px;
      border-radius: 8px;
      border: 1px solid rgba(0,0,0,.12);
      background: #fff;
      cursor: pointer;
      transition: background .12s, box-shadow .12s;
    }
    .vm-btn:hover {
      background: #f7f7f7;
      box-shadow: 0 4px 10px rgba(0,0,0,.12);
    }
    .vm-btn.vm-danger {
      color: #b20000;
      border-color: rgba(178,0,0,.25);
    }

    .vm-hidden { display: none !important; }
  `;

  /*** ---------- EARLY EXIT (optional host filter) ---------- ***/
  if (ONLY_IF_HOST_CONTAINS_TTSU) {
    const here = location.hostname + location.pathname;
    const ok = TTSU_HOST_SNIPPETS.some(s => here.includes(s));
    if (!ok) return;
  }

  /*** ---------- STORAGE ---------- ***/
  const STORE_KEY = "vm_lingq_words_v1";
  function loadStore() {
    try {
      const raw = (typeof GM_getValue === "function") ? GM_getValue(STORE_KEY, "{}") : localStorage.getItem(STORE_KEY) || "{}";
      const parsed = JSON.parse(raw);
      return (parsed && typeof parsed === "object") ? parsed : {};
    } catch { return {}; }
  }
  function saveStore(obj) {
    const s = JSON.stringify(obj);
    if (typeof GM_setValue === "function") GM_setValue(STORE_KEY, s);
    else localStorage.setItem(STORE_KEY, s);
  }

  /*** ---------- UTIL ---------- ***/
const toKey = (s) => (s || "")
  .normalize("NFKC")
  .replace(/[\u00A0\s]+/g, " ")                // NBSP + all whitespace → single space
  .replace(/[’‘‛`´]/g, "'")                    // apostrophe zoo → '
  .replace(/[–—−]/g, "-")                      // dash zoo → -
  .trim()
  .toLocaleLowerCase();
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapeWordPattern = (w) => {
  // Build a regex pattern that matches common typography variants in-page
  const k = toKey(w); // normalized canonical
  let esc = escapeRegExp(k);

  // canonical space should match spaces/NBSP/newlines between words
  esc = esc.replace(/ /g, "(?:[\\s\\u00A0]+)");

  // canonical ' should match curly quotes too (in case page uses them)
  esc = esc.replace(/'/g, "(?:'|’|‘|‛|`|´)");

  // canonical - should match dash variants
  esc = esc.replace(/-/g, "(?:-|–|—|−)");

  return esc;
};
  const isLatinish = (w) => /[A-Za-z\u00C0-\u024F]/.test(w);
  const scopeRoot = () => (CONTENT_SCOPE_SELECTOR && document.querySelector(CONTENT_SCOPE_SELECTOR)) || document.body;

  // Idle API (polyfill)
  const ric = window.requestIdleCallback || function (cb, {timeout} = {}) {
    const id = setTimeout(() => cb({ didTimeout: !!timeout, timeRemaining: () => 0 }), timeout || 50);
    return id;
  };
  const cic = window.cancelIdleCallback || clearTimeout;

  // Contrast helpers
  const hexToRgb = (h) => {
    const s = h.replace('#','');
    const v = s.length === 3 ? s.split('').map(c=>c+c).join('') : s;
    const n = parseInt(v,16);
    return { r:(n>>16)&255, g:(n>>8)&255, b:(n>>0)&255 };
  };
  const relLum = ({r,g,b}) => {
    const f = (u)=>{ u/=255; return u<=0.03928 ? u/12.92 : Math.pow((u+0.055)/1.055,2.4); };
    const R=f(r), G=f(g), B=f(b);
    return 0.2126*R + 0.7152*G + 0.0722*B;
  };
  const textOn = (hex) => (relLum(hexToRgb(hex)) > 0.55 ? "#111" : "#fff");

  /*** ---------- TEXT NODE WALKER ---------- ***/
  function walker(root, fnTextNode) {
    const reject = new Set(["SCRIPT","STYLE","NOSCRIPT","TEXTAREA","INPUT","SELECT","CODE","PRE"]);
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (reject.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (p.closest(".vm-lingq, .vm-palette")) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (tw.nextNode()) nodes.push(tw.currentNode);
    for (const tn of nodes) fnTextNode(tn);
  }

  /*** ---------- PAGE-AWARE CANDIDATES ---------- ***/
  function collectCandidates(root) {
    const seen = new Set();
    walker(root, (tn) => {
      const s = tn.nodeValue;

      for (const m of s.matchAll(/\p{L}[\p{L}\p{M}\p{N}'’-]*/gu)) {
        seen.add(toKey(m[0]));
      }

      const runs = s.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\u30FC\u309D\u309E\u30FD\u30FE\u3005]+/gu);
      if (runs) for (const r of runs) {
        for (let i = 0; i < r.length; i++) {
          for (let L = 1; L <= MAX_NGRAM && i + L <= r.length; L++) {
            seen.add(toKey(r.slice(i, i + L)));
          }
        }
      }
    });
    return seen;
  }

  /*** ---------- REGEX BUILDER ---------- ***/
 function buildRegex(dictObj, candidates = null) {
  let words = Object.keys(dictObj);

  if (candidates) {
    words = words.filter(w => {
      const k = toKey(w);
      if (candidates.has(k)) return true;

      // If it's a multiword expression, include it if ALL component tokens appear on page.
      if (/\s/.test(k)) {
        const parts = k.split(/\s+/).filter(Boolean);
        return parts.length && parts.every(p => candidates.has(p));
      }
      return false;
    });
  }

  if (!words.length) return null;

  // Use normalized keys for ordering & matching
  words = words.map(toKey);

  // Dedup
  words = Array.from(new Set(words));

  // Longest first (phrases win over single words)
  words.sort((a, b) => b.length - a.length);

  const latin = [], other = [];
  for (const w of words) {
    const pat = escapeWordPattern(w);
    (isLatinish(w) ? latin : other).push(pat);
  }

  const parts = [];
  if (latin.length) parts.push(`(?<![\\p{L}\\p{N}])(?:${latin.join("|")})(?![\\p{L}\\p{N}])`);
  if (other.length) parts.push(`(?:${other.join("|")})`);
  return new RegExp(parts.join("|"), "giu");
}


  /*** ---------- HIGHLIGHTING CORE ---------- ***/
  let dict = loadStore();
  (function migrateStoreKeys() {
  const next = {};
  let changed = false;

  for (const [k, v] of Object.entries(dict)) {
    const nk = toKey(k);
    if (!nk) continue;
    if (nk !== k) changed = true;

    // If collisions occur, keep the higher level
    next[nk] = (next[nk] === undefined) ? v : Math.max(next[nk], v);
  }

  if (changed) {
    dict = next;
    saveStore(dict);
  }
})();
  let compiled = null;

  const COLORS = Object.fromEntries(LEVELS.map(l => [String(l.id), l.color]));

  function spanFor(normalized, shownText) {
    const level = String(dict[normalized]);
    const span = document.createElement("span");
    span.className = "vm-lingq";
    span.dataset.word = normalized;
    span.dataset.level = level;
    span.textContent = shownText;
    const bg = COLORS[level] || "#e0e0e0";
    span.style.backgroundColor = bg;
    span.style.color = textOn(bg);
    span.style.boxShadow = "inset 0 0 0 1px rgba(0,0,0,.06)";
    return span;
  }

  function clearAllHighlights(root = scopeRoot()) {
    const spans = root.querySelectorAll(".vm-lingq");
    for (const s of spans) s.replaceWith(document.createTextNode(s.textContent || ""));
  }

  function highlightIn(root) {
    if (!compiled) return;
    walker(root, (tn) => {
      const text = tn.nodeValue;
      compiled.lastIndex = 0;
      let m, last = 0;
      const frag = document.createDocumentFragment();
      while ((m = compiled.exec(text)) !== null) {
        const start = m.index, end = start + m[0].length;
        if (start > last) frag.appendChild(document.createTextNode(text.slice(last, start)));
        const shown = text.slice(start, end);
        const normalized = toKey(shown);
        if (dict[normalized] !== undefined) frag.appendChild(spanFor(normalized, shown));
        else frag.appendChild(document.createTextNode(shown));
        last = end;
      }
      if (last === 0) return;
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      tn.parentNode.replaceChild(frag, tn);
    });
  }

  /*** ---------- RE/COMPILE ---------- ***/
  function recalcCompiled() {
    const root = scopeRoot();
    const candidates = PAGE_AWARE ? collectCandidates(root) : null;
    compiled = buildRegex(dict, candidates);
  }

  const rehighlightAll = (() => {
    let h = null;
    return () => {
      if (h) { cic(h); h = null; }
      h = ric(() => {
        withObserverPaused(() => {
          clearAllHighlights();
          recalcCompiled();
          if (compiled) highlightIn(scopeRoot());
        });
        h = null;
      }, { timeout: 500 });
    };
  })();

  /*** ---------- OBSERVER + BATCHING ---------- ***/
  let observerPaused = false;
  const observeTarget = document.documentElement;
  const observeOpts = { childList: true, subtree: true };
  let mo;

  function pauseObserver() { if (!observerPaused) { mo.disconnect(); observerPaused = true; } }
  function resumeObserver() { if (observerPaused) { mo.observe(observeTarget, observeOpts); observerPaused = false; } }
  function withObserverPaused(fn) { pauseObserver(); try { fn(); } finally { resumeObserver(); } }

  const pending = new Set();
  let idleHandle = null;
  let addedTextHint = 0;

  function scheduleNode(n) {
    if (!n) return;
    const target = (n.nodeType === Node.TEXT_NODE) ? (n.parentNode || scopeRoot()) : n;
    if (target && target.closest && target.closest(".vm-palette")) return;
    pending.add(target);
    addedTextHint++;
    pump();
  }

  function pump() {
    if (idleHandle) return;
    idleHandle = ric(() => {
      const nodes = Array.from(pending);
      pending.clear();

      if (PAGE_AWARE && nodes.length > 50) recalcCompiled();

      withObserverPaused(() => {
        if (!compiled) recalcCompiled();
        if (!compiled) return;

        if (nodes.length > 50) highlightIn(scopeRoot());
        else for (const n of nodes) highlightIn(n);
      });
      idleHandle = null;
    }, { timeout: 300 });
  }

  mo = new MutationObserver((muts) => {
    if (!compiled && !PAGE_AWARE) return;
    let count = 0;
    for (const m of muts) {
      for (const n of m.addedNodes) {
        if (n.nodeType !== 1 && n.nodeType !== 3) continue;
        scheduleNode(n);
        count++;
        if (count > 200) {
          pending.clear();
          scheduleNode(scopeRoot());
          return;
        }
      }
    }
  });
  mo.observe(observeTarget, observeOpts);

  /*** ---------- PERIODIC REFRESHER (optional) ---------- ***/
  // if (ENABLE_PERIODIC_RECALC) {
  //   let lastHint = 0;
  //   setInterval(() => {
  //     if (!PAGE_AWARE) return;             // only useful in page-aware mode
  //     if (addedTextHint === lastHint) return; // no new text since last check
  //     lastHint = addedTextHint;
  //     // Lightweight refresh: update candidates and pass once over the scope.
  //     withObserverPaused(() => {
  //       recalcCompiled();
  //       if (compiled) highlightIn(scopeRoot());
  //     });
  //   }, PERIODIC_INTERVAL_MS);
  // }

  /*** ---------- PALETTE UI ---------- ***/
  if (typeof GM_addStyle === "function") GM_addStyle(HIGHLIGHT_CSS);
  else {
    const s = document.createElement("style"); s.textContent = HIGHLIGHT_CSS; document.head.appendChild(s);
  }

  const palette = (() => {
    const el = document.createElement("div");
    el.className = "vm-palette vm-hidden";
    el.innerHTML = `
      <h4>
        <span class="vm-title-text">Mark “…”</span>
        <span class="vm-current-label"></span> <!-- <<< ADDED -->
      </h4>
      <div class="vm-row vm-levels"></div>
      <div class="vm-actions">
        <div class="vm-btn vm-remove">Remove word</div>
        <div class="vm-btn vm-cancel">Cancel</div>
      </div>`;
    document.documentElement.appendChild(el);

    const levelsWrap = el.querySelector(".vm-levels");
    LEVELS.forEach(l => {
      const item = document.createElement("div");
      item.className = "vm-level";
      item.dataset.level = String(l.id);
      item.innerHTML = `
        <span class="vm-swatch" style="background:${l.color}"></span>
        <span>${l.id} — ${l.name}</span>
        <span class="vm-active-check">✓</span> <!-- <<< ADDED -->
      `;
      levelsWrap.appendChild(item);
    });
    return el;
  })();

  // <<< ADDED: helper to update which level tile is active
  function updatePaletteSelection(wordKey) {
    const levelVal = dict[wordKey]; // may be undefined
    const all = palette.querySelectorAll(".vm-level");
    all.forEach(node => {
      if (String(levelVal) === node.dataset.level) {
        node.classList.add("active");
      } else {
        node.classList.remove("active");
      }
    });

    // update little label in header: "Current: 2 — Familiar"
    const labelEl = palette.querySelector(".vm-current-label");
    if (labelEl) {
      if (levelVal === undefined) {
        labelEl.textContent = "Unmarked";
      } else {
        const L = LEVELS.find(L => L.id === levelVal);
        if (L) {
          labelEl.textContent = `Current: ${L.id} — ${L.name}`;
        } else {
          labelEl.textContent = "";
        }
      }
    }
  }

  let lastAnchor = { x: 20, y: 20 };
  let repositionHandlersAttached = false;

  function positionPalette(x, y) {
    const pad = 8;
    const vw = window.innerWidth, vh = window.innerHeight;

    palette.style.visibility = "hidden";
    palette.classList.remove("vm-hidden");
    const rect = palette.getBoundingClientRect();

    let left = x, top = y;

    if (left + rect.width + pad > vw) left = Math.max(pad, vw - rect.width - pad);
    if (top + rect.height + pad > vh) top = Math.max(pad, y - rect.height - pad);

    left = Math.max(pad, left);
    top  = Math.max(pad, top);

    palette.style.left = left + "px";
    palette.style.top  = top + "px";
    palette.style.visibility = "";
  }

  function showPalette(x, y, displayWord) {
    lastAnchor = { x, y };

    // update title text and active state // <<< MODIFIED
    const titleEl = palette.querySelector(".vm-title-text");
    if (titleEl) {
      titleEl.textContent = `Mark “${displayWord}”`;
    }

    // reflect the current selection in UI
    updatePaletteSelection(pendingWord); // <<< ADDED

    positionPalette(x, y);

    if (!repositionHandlersAttached) {
      const onReflow = () => positionPalette(lastAnchor.x, lastAnchor.y);
      window.addEventListener("resize", onReflow);
      window.addEventListener("scroll", onReflow, true);
      palette._onReflow = onReflow;
      repositionHandlersAttached = true;
    }
  }

  function hidePalette() {
    palette.classList.add("vm-hidden");
    if (repositionHandlersAttached) {
      window.removeEventListener("resize", palette._onReflow);
      window.removeEventListener("scroll", palette._onReflow, true);
      repositionHandlersAttached = false;
      delete palette._onReflow;
    }
  }

  let pendingWord = null;

  palette.addEventListener("click", (e) => {
    const t = e.target.closest(".vm-level, .vm-remove, .vm-cancel");
    if (!t) return;
    if (t.classList.contains("vm-cancel")) { hidePalette(); pendingWord = null; return; }
    if (!pendingWord) { hidePalette(); return; }
    if (t.classList.contains("vm-remove")) {
      if (dict[pendingWord] !== undefined) { delete dict[pendingWord]; saveStore(dict); rehighlightAll(); }
      hidePalette(); pendingWord = null; return;
    }
    if (t.classList.contains("vm-level")) {
      dict[pendingWord] = parseInt(t.dataset.level, 10);
      saveStore(dict);
      rehighlightAll();
      hidePalette(); pendingWord = null;
    }
  });

  document.addEventListener("mousedown", (e) => {
    if (!palette.classList.contains("vm-hidden") && !palette.contains(e.target)) hidePalette();
  }, true);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hidePalette(); });

  function getWordFromPoint(clientX, clientY) {
    const sel = window.getSelection(); const selected = sel && sel.toString().trim();
    if (selected) return selected;
    let range = null;
    if (document.caretRangeFromPoint) range = document.caretRangeFromPoint(clientX, clientY);
    else if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(clientX, clientY);
      if (pos) { range = document.createRange(); range.setStart(pos.offsetNode, pos.offset); range.setEnd(pos.offsetNode, pos.offset); }
    }
    if (!range) return null;
    const node = range.startContainer; if (!node || node.nodeType !== Node.TEXT_NODE) return null;
    const text = node.nodeValue; const i = range.startOffset;
    const isWordChar = (ch) => /\p{L}|\p{N}|\p{M}|[-'’]/u.test(ch);
    let a = i, b = i;
    while (a > 0 && isWordChar(text[a - 1])) a--;
    while (b < text.length && isWordChar(text[b])) b++;
    const candidate = text.slice(a, b).trim(); return candidate || null;
  }

  document.addEventListener("contextmenu", (e) => {
    if (!ALWAYS_INTERCEPT_RIGHT_CLICK && !e.altKey) return;
    const w = getWordFromPoint(e.clientX, e.clientY); if (!w) return;
    e.preventDefault();
    pendingWord = toKey(w);

    // When opening palette, make sure header + highlight reflect saved level // <<< ADDED
    showPalette(e.clientX, e.clientY, w);
  }, true);

  /*** ---------- INIT ---------- ***/
  recalcCompiled();
  if (compiled) withObserverPaused(() => highlightIn(scopeRoot()));

  window.addEventListener("popstate", () => ric(rehighlightAll, { timeout: 200 }));
  const _pushState = history.pushState;
  history.pushState = function () { _pushState.apply(this, arguments); ric(rehighlightAll, { timeout: 200 }); };
})();
