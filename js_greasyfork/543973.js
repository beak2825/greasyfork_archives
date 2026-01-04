// ==UserScript==
// @name         YouTube Chat Jump Button
// @namespace    https://example.com/youtube-chat-jump
// @version      1.0.0
// @description  🔼 クリックでチャットのタイムスタンプ ±OFFSET 秒へシーク。右クリックでその位置の URL をコピー。（ライブではジャンプ無効／順位ボタンは常時消去）
// @author       @rrrrikiOW
// @license      MIT
// @match        https://www.youtube.com/*
// @match        https://www.youtube-nocookie.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @noframes
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543973/YouTube%20Chat%20Jump%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/543973/YouTube%20Chat%20Jump%20Button.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

/*
───────────────────────────────────────────────────────────────
  概要（要点）
───────────────────────────────────────────────────────────────
■ モード管理
  MODE = 'replay' | 'live' | 'vod' | 'unknown'
  - 'replay' のみジャンプボタン有効（ENABLED=true）
  - ライブ/通常ではジャンプボタンを全撤去。
  - 順位バッジ(#1/#2/#3)は設定で「常時非表示」にできる（ライブ/リプレイ問わず）。

■ 判定の優先度
  1) chatframe の URL（/live_chat_replay / /live_chat）で最終確定
  2) ytInitialPlayerResponse は初期ヒント（SPA遷移で古いことがある）

■ DOM対応
  - closed Shadow DOM 対策：attachShadow をフックして #before-content-buttons を除去
  - 監視を永続（persist）と揮発（volatile）に分離。SPAとiframe差し替えに強く

■ SPA・全画面・可視状態
  - yt-navigate-finish, fullscreenchange, 可視属性の変化で再同期
───────────────────────────────────────────────────────────────
*/


/* ========= 設定値（保存付き） ========= */
const CFG = {
  get offset() { return Number(GM_getValue('offset', -5)); },
  set offset(v) { GM_setValue('offset', Number(v) || 0); },
  get btnText() { return GM_getValue('btnText', '🔼'); },
  get hideRanks() { return !!GM_getValue('hideRanks', true); }, // ← 追加: 順位バッジ非表示
  set hideRanks(v){ GM_setValue('hideRanks', !!v); }
};
/* メニュー */
GM_registerMenuCommand(`OFFSET を変更 (現在 ${CFG.offset})`, () => {
  const v = prompt('ジャンプ時に加える秒数 (負値可)', CFG.offset);
  if (v !== null) { CFG.offset = v; }
});
GM_registerMenuCommand(`順位バッジ表示を切替(要更新) (現在 ${CFG.hideRanks ? '非表示' : '表示'})`, () => {
  CFG.hideRanks = !CFG.hideRanks;
  console.log('%c[YCJ]', 'color:#0af', 'hideRanks =', CFG.hideRanks);
  if (CFG.hideRanks) {
    purgeRankBadges(); // いま表示中のものも即消す
  } else {
    console.log('%c[YCJ]', 'color:#0af', '非表示をOFFにしました。既に除去済みは復活しません（再読込で復帰）。');
  }
});
/* ===================================== */

/* ---------------- ログヘルパ ---------------- */
const log = (...a)=>console.log ('%c[YCJ]', 'color:#0af', ...a);
const dbg = (...a)=>console.debug('%c[YCJ]', 'color:#888', ...a);
const warn = (...a)=>console.warn ('%c[YCJ]', 'color:#fa0', ...a);

/* 行要素セレクタ */
const MSG_SELECTOR = [
  'yt-live-chat-text-message-renderer',
  'yt-live-chat-paid-message-renderer',
  'chat-text-message-renderer',
  'chat-paid-message-renderer'
].join(',');

/* ========= モード管理 ========= */
let MODE = 'unknown'; // 'replay' | 'live' | 'vod' | 'unknown'
let ENABLED = false; // ジャンプボタン（replay の時だけ true）

/* ========= オブザーバ管理（永続/揮発）========= */
const OBS = { persist: [], volatile: [] };
const addObs = (obs, kind = 'volatile') => { OBS[kind].push(obs); return obs; };
function resetObservers() {
  OBS.volatile.forEach(o => { try{ o.disconnect(); }catch{} });
  OBS.volatile.length = 0;
  dbg('Observers reset (volatile only)');
}

/* ========= ユーティリティ ========= */
function purgeRankBadges() {
  const sweep = (doc) => {
    doc.querySelectorAll(MSG_SELECTOR).forEach(row => {
      const root = row.shadowRoot || row;
      removeBeforeContentButtons(root);
    });
  };
  try { sweep(document); } catch {}
  try {
    const f = document.getElementById('chatframe');
    if (f?.contentDocument) sweep(f.contentDocument);
  } catch {}
}
// ライブ/通常に切り替わった時の保険：全ジャンプボタン撤去
function tryRemoveAllJumpButtons() {
  const kill = (doc) => doc.querySelectorAll('.ycj-btn').forEach(el => el.remove());
  try { kill(document); } catch {}
  try {
    const f = document.getElementById('chatframe');
    if (f?.contentDocument) kill(f.contentDocument);
  } catch {}
}
// デバウンス
function debounce(fn, ms = 150) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
// PR（ytInitialPlayerResponse）からの初期推定
function detectModeFromPlayerResponse(pr) {
  if (!pr) return 'unknown';
  const isLiveContent = pr.videoDetails?.isLiveContent;
  const liveStreamActive= !!pr.playabilityStatus?.liveStreamability;
  if (!isLiveContent) return 'vod';
  return liveStreamActive ? 'live' : 'replay';
}
// モード切替の単一窓口
function setMode(next) {
  if (MODE === next) return;
  MODE = next;
  ENABLED = (next === 'replay');
  dbg('setMode:', MODE, 'ENABLED=', ENABLED);
  resetObservers(); // 揮発監視をクリア
  if (ENABLED) {
    bootstrapWithRetry();
  } else {
    tryRemoveAllJumpButtons();
    if (CFG.hideRanks) purgeRankBadges();
  }
}

/* ========= 順位ボタン消去 & closed Shadow対策 ========= */
function removeBeforeContentButtons(root) {
  if (!CFG.hideRanks) return; // ← 設定トグル
  try {
    root.querySelectorAll('#before-content-buttons').forEach(el => {
      el.style.display = 'none';
      el.remove();
    });
  } catch {}
}
function hookClosedShadowAPI(win) {
  if (!win || win.__ycjShadowHooked) return;
  win.__ycjShadowHooked = true;
  const orig = win.Element.prototype.attachShadow;
  win.Element.prototype.attachShadow = function(init) {
    const root = orig.call(this, init);
    try {
      if (/YT-LIVE-CHAT-(TEXT|PAID)-MESSAGE-RENDERER|CHAT-(TEXT|PAID)-MESSAGE-RENDERER/i.test(this.tagName)) {
        new win.MutationObserver(() => removeBeforeContentButtons(root))
          .observe(root, { childList: true, subtree: true });
        removeBeforeContentButtons(root);
      }
    } catch {}
    return root;
  };
}

/* ========= チャット行の拡張（ジャンプボタン付与） ========= */
function hms2sec(txt) {
  const sign = txt.trim().startsWith('-') ? -1 : 1;
  const parts = txt.replace(/^[-+]/,'').split(':').map(Number).reverse();
  let sec = 0;
  if (parts[0]) sec += parts[0];
  if (parts[1]) sec += parts[1]*60;
  if (parts[2]) sec += parts[2]*3600;
  if (parts[3]) sec += parts[3]*86400;
  return sec * sign;
}
const seek = s => { const v = document.querySelector('video'); if (v) v.currentTime = Math.max(0, s); };

function enhance(row) {
  const root = row.shadowRoot || row;
  // ライブ/通常でも順位ボタンは設定次第で常時消す
  removeBeforeContentButtons(root);
  // ジャンプボタンはリプレイの時だけ
  if (!ENABLED) return;

  const ts = root.querySelector('#timestamp, yt-formatted-string#time');
  const box = root.querySelector('#content');
  if (!ts || !box) return;

  const base = hms2sec(ts.textContent);
  if (isNaN(base)) return;

  const btns = root.querySelectorAll('.ycj-btn');
  btns.forEach((b,i)=> i < btns.length-1 && b.remove());
  const btn = btns[btns.length-1] || document.createElement('span');
  if (!btn.className) {
    btn.className = 'ycj-btn';
    btn.style.cssText =
      'cursor:pointer;user-select:none;font-weight:bold;margin-right:4px;' +
      'display:inline-flex;align-items:center;';
    (ts.parentNode || box).insertBefore(btn, ts);
  }
  const target = Math.max(0, base + CFG.offset);
  btn.textContent = CFG.btnText;
  btn.title = `Jump to ${target}s`;
  btn.onclick = e => { e.stopPropagation(); seek(target); };
  btn.oncontextmenu = e => {
    e.preventDefault();
    const u = new URL(location.href);
    u.searchParams.set('t', `${target}s`);
    GM_setClipboard(u.href);
  };
  dbg('btn updated:', ts.textContent.trim());
}

/* ========= チャット DOM 監視 ========= */
const applyEnhance = n => {
  if (n.nodeType !== 1) return;
  if (n.matches?.(MSG_SELECTOR)) enhance(n);
  n.querySelectorAll?.(MSG_SELECTOR).forEach(enhance);
};
function startIn(doc) {
  dbg('startIn on', doc===document?'main':'iframe');
  const list = doc.querySelector('yt-live-chat-item-list-renderer');
  const sc = doc.querySelector('#item-scroller');
  if (!list || !sc) { dbg('list/scroller 無し → false'); return false; }

  if (sc.dataset.ycjScHooked === '1') {
    dbg('scroller already hooked');
  } else {
    sc.dataset.ycjScHooked = '1';
    addObs(new MutationObserver(m => m.forEach(mu => mu.addedNodes.forEach(applyEnhance))))
      .observe(sc, { childList:true, subtree:true });
    doc.querySelectorAll(MSG_SELECTOR).forEach(enhance);
    addObs(new MutationObserver(() => {
      dbg('item list replaced → reattach');
      sc.dataset.ycjScHooked = '';
      startIn(doc);
    })).observe(list.parentNode, { childList:true });
  }
  dbg('observer attach 完了');
  return true;
}

/* 動画シーク後に再同期（replayのみ） */
function hookVideoSeek() {
  const v = document.querySelector('video');
  if (v && !v.dataset.ycjHooked) {
    v.dataset.ycjHooked = '1';
    v.addEventListener('seeked', () => {
      const frame = document.getElementById('chatframe');
      const d = frame?.contentDocument || document;
      d.querySelectorAll(MSG_SELECTOR).forEach(enhance);
    });
  }
}

/* 初期化（ENABLED=true のときだけ） */
function bootstrap() {
  if (!ENABLED) { dbg('ENABLED=false'); return false; }
  const frame = document.getElementById('chatframe');
  if (frame?.contentDocument) {
    dbg('iframe contentDocument 取得');
    return startIn(frame.contentDocument) && (hookVideoSeek(), true);
  }
  dbg('iframe.contentDocument 未準備');
  return false;
}
function bootstrapWithRetry(max = 10, intervalMs = 1000) {
  let n = 0;
  const tryBoot = () => {
    dbg('bootstrap attempt', n, 'MODE=', MODE, 'ENABLED=', ENABLED);
    if (!ENABLED) return;
    if (bootstrap()) return;
    n += 1;
    if (n > max) { warn(`bootstrap ${max} 回失敗 → 打切り`); return; }
    setTimeout(tryBoot, intervalMs);
  };
  tryBoot();
}

/* ========= ライフサイクル監視：chatframe URLで最終確定 ========= */
function watchChatframeLifecycle() {
  const onFrameReady = (ifr) => {
    if (!ifr || ifr.dataset.ycjLifeHooked) return;
    ifr.dataset.ycjLifeHooked = '1';

    const hook = () => hookClosedShadowAPI(ifr.contentWindow);
    const decideFromUrl = (url) => {
      if (/\/live_chat_replay\b/.test(url)) setMode('replay');
      else if (/\/live_chat\b/.test(url)) setMode('live');
    };
    const safeStartInIframe = () => {
      const d = ifr.contentDocument || ifr.contentWindow?.document;
      if (d) startIn(d); else dbg('iframe document not ready yet');
    };

    addObs(new MutationObserver(() => {
      const url = ifr.src || ifr.contentWindow?.location?.href || '';
      if (!url) return;
      dbg('chatframe src mut:', url.slice(0, 100));
      hook();
      decideFromUrl(url);
      safeStartInIframe();
    }), 'persist').observe(ifr, { attributes: true, attributeFilter: ['src'] });

    ifr.addEventListener('load', () => {
      const url = ifr.contentWindow?.location?.href || ifr.src || '';
      dbg('chatframe load', url.slice(0, 100));
      hook();
      decideFromUrl(url);
      safeStartInIframe();
    }, true);
  };

  const attachIfExists = () => {
    const f = document.getElementById('chatframe');
    if (f) onFrameReady(f);
  };
  attachIfExists();

  const host = document.querySelector('#chat') || document.body;
  addObs(new MutationObserver(() => attachIfExists()), 'persist')
    .observe(host, { childList: true, subtree: true });
}

/* ========= チャットのリプレイボタン自動クリック（replay時） ========= */
function ensureChatReplay() {
  const TEXT_RE = /チャットのリプレイを表示|Show chat replay|显示聊天室回放|Mostrar repetición del chat|Mostrar repetição do chat/i;
  const SEL = 'ytd-toggle-button-renderer,tp-yt-paper-button,ytd-button-shape button,button';
  const clickIfFound = () => {
    for (const btn of document.querySelectorAll(SEL)) {
      const label = (btn.innerText || btn.getAttribute('aria-label') || '').trim();
      if (TEXT_RE.test(label)) { btn.click(); log('replay ボタンをクリック:', label); return true; }
    }
    return false;
  };
  if (clickIfFound()) return;
  const mo = addObs(new MutationObserver(()=>{ if (clickIfFound()) mo.disconnect(); }));
  mo.observe(document, { subtree:true, childList:true });
}

/* ========= 可視化・全画面などの補助監視 ========= */
function watchChatVisibility() {
  const host = document.querySelector('ytd-live-chat-frame, ytd-watch-flexy');
  if (!host) return;
  addObs(new MutationObserver(() => {
    dbg('chat visibility changed → rebootstrap');
    if (ENABLED) bootstrapWithRetry();
  }), 'persist').observe(host, {
    attributes: true,
    attributeFilter: ['hidden', 'collapsed', 'style'],
    subtree: false
  });
}
function watchFullscreen() {
  const reb = debounce(() => {
    dbg('fullscreenchange → rebootstrap');
    if (ENABLED) bootstrapWithRetry();
  }, 150);
  document.addEventListener('fullscreenchange', reb, true);
}

/* ========= 初期判定（PRで推定→以後は chatframe が確定） ========= */
function judgeStateAndInit() {
  const pr = unsafeWindow.ytInitialPlayerResponse;
  if (!pr) {
    warn('playerResponse null → 再試行');
    setTimeout(judgeStateAndInit, 300);
    return;
  }
  const guessed = detectModeFromPlayerResponse(pr);
  dbg('PR guessed mode =', guessed);
  setMode(guessed);
  if (MODE === 'replay') ensureChatReplay();
  watchChatframeLifecycle(); // 常時
}

/* ========= SPA 遷移対応 ========= */
window.addEventListener('yt-navigate-finish', () => {
  dbg('yt-navigate-finish');
  resetObservers(); // 揮発だけ
  setMode('unknown'); // 次で確定
  judgeStateAndInit();
}, true);

/* ========= 初期ロード時 ========= */
judgeStateAndInit();
watchChatVisibility();
watchFullscreen();

/*
MIT License

Copyright (c) 2025 pueka_3
Copyright (c) 2025 rrrriki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/