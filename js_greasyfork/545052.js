// ==UserScript==
// @name         ChatGPT PoW
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  右下角显示 PoW；自动适配浅/深色模式前景色；数字随数值渐变；无背景；使用iPhone UA
// @match        https://chatgpt.com/*
// @match        https://*.openai.com/*
// @icon         https://chatgpt.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545052/ChatGPT%20PoW.user.js
// @updateURL https://update.greasyfork.org/scripts/545052/ChatGPT%20PoW.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const MAX_VAL = 500000n;           // 颜色映射上限
  const UPDATE_INTERVAL = 2000;      // 每 2 秒更新（修正为 2000ms）
  
  // iPhone User Agent
  const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';

  // 样式：仅使用前景色；通过 CSS 变量适配浅/深色
  const css = `
  :root{ --pow-fg:#333; }
  @media (prefers-color-scheme: dark){
    :root{ --pow-fg:#f0f0f0; }
  }

  #pow-mini{
    position:fixed; right:10px; bottom:8px;
    font:12px/1.2 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial;
    z-index:99999; user-select:none; cursor:pointer; white-space:nowrap;
    color:var(--pow-fg);

    opacity:0; transform:translateY(-6px); visibility:hidden;
    transition:opacity .4s ease, transform .4s ease, visibility 0s linear .4s;
  }
  #pow-mini.show{
    opacity:1; transform:translateY(0); visibility:visible;
    transition:opacity .4s ease, transform .4s ease, visibility 0s;
  }
  #pow-mini .digit{ display:inline-block; perspective:500px; transition:color .2s linear; }
  #pow-mini .digit.flip{
    transform:rotateX(90deg); opacity:.3;
    transition:transform .3s ease, opacity .3s ease, color .2s linear;
  }
  #pow-mini .digit.flip-back{
    transform:rotateX(0); opacity:1;
    transition:transform .3s ease, opacity .3s ease, color .2s linear;
  }`;
  document.head.appendChild(Object.assign(document.createElement('style'), { textContent: css }));

  // UI
  const box = document.createElement('div');
  box.id = 'pow-mini';
  box.innerHTML = `<span id="pow-label">PoW:</span> <span class="digit" id="pow-digit">N/A</span>`;

  // 挂载
  (function ready(fn) {
    if (document.body) return fn();
    const t = setInterval(() => {
      if (document.body) { clearInterval(t); fn(); }
    }, 50);
  })(() => {
    document.body.appendChild(box);
    box.addEventListener('click', () => {
      if (lastVal != null) {
        navigator.clipboard.writeText(`PoW: ${lastVal.toString(10)}`).catch(() => {});
      }
    });
  });

  // 深/浅色检测
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  let isDark = mql.matches;
  mql.addEventListener?.('change', (e) => {
    isDark = e.matches;
    // 主题切换后根据上次值立刻重绘颜色
    if (lastVal != null) render(lastVal, /*force*/ true);
  });

  let lastVal = null; // BigInt，最后一次有效值
  let shown = false;  // 是否已经做过首显动画

  const parseHex = (h) => {
    try { return BigInt(h.startsWith('0x') ? h : '0x' + h); }
    catch { return null; }
  };

  // 数值 -> 颜色（HSL）：Hue 0~120；根据主题调整 Lightness 以适配前景对比度
  function valueToColor(val) {
    const ratio = Number(val) / Number(MAX_VAL);
    const clamped = Math.max(0, Math.min(1, ratio));
    const hue = clamped * 120;              // 0=红 -> 120=绿
    const sat = 85;                          // 饱和度
    const light = isDark ? 65 : 40;          // 深色背景更亮，浅色背景更暗
    return `hsl(${hue}, ${sat}%, ${light}%)`;
  }

  function render(val, force=false) {
    const el = document.getElementById('pow-digit');
    if (!el) return;

    if (val == null && lastVal == null) return;   // 没历史值且本次无效 => 继续隐藏
    if (val == null) val = lastVal;               // 容错：无效则沿用上次值

    if (!shown) {                                 // 首次显示做淡入动画
      requestAnimationFrame(() => box.classList.add('show'));
      shown = true;
    }

    const nextText = val.toString(10);
    const prevText = lastVal?.toString?.();
    if (!force && nextText === prevText) return;

    const color = valueToColor(val);
    el.classList.remove('flip-back');
    el.classList.add('flip');
    setTimeout(() => {
      el.textContent = nextText;
      el.style.color = color;     // 仅前景色
      el.classList.remove('flip');
      el.classList.add('flip-back');
      lastVal = val;
    }, 150);
  }

  function updatePow() {
    GM_xmlhttpRequest({
      method: 'POST',
      url: 'https://chatgpt.com/backend-api/sentinel/chat-requirements',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': IPHONE_UA
      },
      data: '{}',
      withCredentials: true,
      onload: function(response) {
        try {
          const j = JSON.parse(response.responseText);
          render(parseHex(j?.proofofwork?.difficulty || ''));
        } catch {
          render(null);
        }
      },
      onerror: function() {
        render(null);
      }
    });
  }

  setInterval(updatePow, UPDATE_INTERVAL);
})();