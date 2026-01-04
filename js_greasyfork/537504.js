// ==UserScript==
// @name         KING OF TIME Timerecorder status Enhancer
// @namespace    https://example.com/
// @version      2025-05-28
// @description  KING OF TIME 打刻画面を色と巨大文字でわかりやすく
// @match        https://s4.ta.kingoftime.jp/independent/recorder2/personal/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537504/KING%20OF%20TIME%20Timerecorder%20status%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/537504/KING%20OF%20TIME%20Timerecorder%20status%20Enhancer.meta.js
// ==/UserScript==

(() => {
  console.log('[TM] timerecorder helper started');

  /* ---------------- 1. 直近ステータスを取得 ---------------- */
  function getLatestStatus () {
    const key = Object.keys(localStorage)
      .find(k => k.startsWith('PARSONAL_BROWSER_RECORDER@RECORD_HISTORY_'));
    if (!key) return null;

    let logs;
    try { logs = JSON.parse(localStorage[key]); }
    catch { return null; }

    if (!Array.isArray(logs) || !logs.length) return null;

    const latest = logs.find(r => r.status === 1) || logs[0];

    switch (latest.name) {
      case '出勤': return 'working';// 勤務中
      case '休始': return 'break';// 休憩中
      case '休終': return 'working';// 休憩→勤務
      case '退勤': return 'checkedOut'; // 退勤済
      default:return 'unknown';
    }
  }

  /* ---------------- 2. 画面を更新 ---------------- */
  const COLORS = { working:'#C8E6C9', break:'#FFE0B2', checkedOut:'#E0E0E0', unknown:'#FFCDD2' };
  const FONTCOL = { working:'#2E7D32', break:'#EF6C00', checkedOut:'#616161', unknown:'#C62828' };
  const LABELS = { working:'勤務中', break:'休憩中', checkedOut:'退勤済', unknown:'状態不明' };

  function updateUI () {
    const state = getLatestStatus();
    if (!state) return;

    /* 2-1  背景色変更 */
    document.body.style.backgroundColor = COLORS[state];

    /* 2-2  デカ文字ラベル（位置情報取得済みの直下）*/
    let label = document.getElementById('tm-status-label');
    if (!label) {
      label = document.createElement('div');
      label.id = 'tm-status-label';
      label.style.cssText = `
        margin-top:20px;
        text-align:center;
        font-size:48px;
        font-weight:900;
      `;
      // #location_area が常にある想定。無い場合は .wrapper-all に append でも可
      const anchor = document.getElementById('location_area');
      (anchor ? anchor : document.body).after(label);
    }
    label.style.color = FONTCOL[state];
    label.textContent = LABELS[state];

    /* 2-3  打刻ボタンの enable/disable */
    const buttons = document.querySelectorAll('#buttons input[type="button"], #buttons button');
    buttons.forEach(btn => {
      const text = (btn.value || btn.textContent).trim();

      const disable =
          (state === 'working' && /出勤/.test(text)) ||
          (state === 'break' && /退勤/.test(text)) ||
          (state === 'checkedOut' && /休始|休終/.test(text));

      btn.disabled = disable;
      btn.style.opacity = disable ? '0.35' : '1';
      btn.style.cursor = disable ? 'not-allowed' : '';
    });
  }

  /* ---------------- 3. 監視 & トリガ ---------------- */
  window.addEventListener('load', () => {
    updateUI(); // 初回

    /* 1 秒ポーリング */
    setInterval(updateUI, 1_000);

    /* 他タブで localStorage が変わった時 */
    window.addEventListener('storage', updateUI);

    /* 同じタブでボタンを押した瞬間にも即反映 */
    const btnArea = document.getElementById('buttons');
    if (btnArea) {
      btnArea.addEventListener('click', (e) => {
        if (e.target.matches('input[type="button"], button')) {
          // localStorage の書き込み完了は非同期なので 100 ms 待つ
          setTimeout(updateUI, 100);
        }
      });
    }
  });
})();
