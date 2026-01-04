// ==UserScript==
// @name         ChatGPT 智商监控 + 深度研究Deep Research剩余次数，刷新时间
// @namespace    https://chatgpt.com/
// @version      3.7
// @description  右下角实时显示 Deep-Research 剩余额度（0 时附下次重置）；正上方显示 PoW 算力
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://chat.chatgpt.com/*
// @match        https://*.openai.com/*
// @grant        unsafeWindow
// @license      GPT Plus升级 & 降智解决+V：ChatGPT4V
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528312/ChatGPT%20%E6%99%BA%E5%95%86%E7%9B%91%E6%8E%A7%20%2B%20%E6%B7%B1%E5%BA%A6%E7%A0%94%E7%A9%B6Deep%20Research%E5%89%A9%E4%BD%99%E6%AC%A1%E6%95%B0%EF%BC%8C%E5%88%B7%E6%96%B0%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/528312/ChatGPT%20%E6%99%BA%E5%95%86%E7%9B%91%E6%8E%A7%20%2B%20%E6%B7%B1%E5%BA%A6%E7%A0%94%E7%A9%B6Deep%20Research%E5%89%A9%E4%BD%99%E6%AC%A1%E6%95%B0%EF%BC%8C%E5%88%B7%E6%96%B0%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

/* ───────────────────────────────
   深度 Research 角标（透明绿色）
   ─────────────────────────────── */
(function () {
  'use strict';

  /* 主动轮询间隔（5 min） */
  const POLL_INTERVAL = 5 * 60_000;

  /* —— UI —— */
  const drBadge = (() => {
    const el = document.createElement('div');
    el.id = 'dr-quota-badge';
    el.style.cssText = `
      position: fixed; bottom: 0px; right: 0px; z-index: 9999;
      padding: 10px 14px; border-radius: 12px;
      background: transparent; font: 600 14px/1 system-ui, sans-serif;
      color: #10a37f; pointer-events: none; user-select: none;
      backdrop-filter: none; border: none;
      box-shadow: none;
    `;
    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(el));
    return el;
  })();

  /* ISO → 本地 “MM-DD HH:mm” */
  const fmtLocal = iso => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d)) return '';
    const pad = n => n.toString().padStart(2, '0');
    return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  /* 更新文本 / 颜色 */
  function setDRBadge(remain, resetISO) {
    if (remain === 0) {
      drBadge.textContent = `深度研究(Deep Research) 剩余：0  |  重置：${fmtLocal(resetISO)}`;
      drBadge.style.color = '#00FF00';     // 红字
    } else {
      drBadge.textContent = `深度研究(Deep Research) 剩余：${remain}`;
      drBadge.style.color = '#00FF00';     // 绿字
    }
  }

  /* 解析接口中的 limits_progress */
  function parseDR(json) {
    if (!json || typeof json !== 'object') return;
    const item = (json.limits_progress || []).find(x => x.feature_name === 'deep_research');
    if (item && typeof item.remaining === 'number') {
      setDRBadge(item.remaining, item.reset_after);
    }
  }

  /* —— 网络拦截 —— */
  const W = unsafeWindow;
  let bearer = null;
  const fetch0 = W.fetch.bind(W);      // 原生 fetch
  W.fetch = (input, init = {}) => {
    /* 捕获 Bearer */
    const hdrs = init.headers || (input instanceof Request && input.headers) || null;
    if (hdrs) {
      const tok = hdrs.get?.('authorization') || hdrs.Authorization || hdrs.authorization;
      if (tok) bearer = tok;
    }

    const url = typeof input === 'string' ? input : input.url || '';
    const p = fetch0(input, init);

    if (/\/backend-api\/conversation\//.test(url)) {
      p.then(res => res.clone().json().then(parseDR).catch(() => {})).catch(() => {});
    }
    return p;
  };

  /* XHR 备份拦截 */
  const open0 = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, url, ...rest) {
    this._trackDR = /\/backend-api\/conversation\//.test(url);
    return open0.call(this, m, url, ...rest);
  };
  const send0 = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (...args) {
    if (this._trackDR) {
      this.addEventListener('load', () => {
        try { parseDR(JSON.parse(this.responseText)); } catch {}
      });
    }
    return send0.apply(this, args);
  };

  /* 主动轮询兜底 */
  async function poll() {
    if (!bearer) return;
    try {
      const r = await fetch0('/backend-api/conversation/init', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json', authorization: bearer },
        body: '{}'
      });
      parseDR(await r.json());
    } catch {}
  }
  setTimeout(poll, 5000);
  setInterval(poll, POLL_INTERVAL);
})();

/* ───────────────────────────────
   原来的 PoW 智商监控部分
   （保持原样，只挪到下方）
   ─────────────────────────────── */
(function () {
  'use strict';

  function ready(fn) {
    if (document.body) return fn();
    const timer = setInterval(() => {
      if (document.body) {
        clearInterval(timer);
        fn();
      }
    }, 50);
  }

  ready(() => {
    let powDifficulty = 'N/A';
    let lastRenderedPow = '';
    let containerInitialized = false;

    function tryUpdatePoW(val) {
      if (val && val !== powDifficulty) {
        powDifficulty = val;
        updatePowText();
      }
    }

    /* fetch hook（嵌套在上面的 Deep-Research 包装之上） */
    const origFetch = window.fetch;
    window.fetch = function (...args) {
      return origFetch.apply(this, args).then(res => {
        if (
          (typeof args[0] === 'string' && args[0].includes('/sentinel/chat-requirements')) ||
          (typeof args[0]?.url === 'string' && args[0].url.includes('/sentinel/chat-requirements'))
        ) {
          res.clone().json().then(data => {
            tryUpdatePoW(data?.proofofwork?.difficulty || 'N/A');
          }).catch(()=>{});
        }
        return res;
      }).catch(() => {}); // 捕捉 fetch 自身异常
    };

    /* XHR hook */
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) {
      this.addEventListener('load', function () {
        if (this.responseURL?.includes('/sentinel/chat-requirements')) {
          try {
            const data = JSON.parse(this.responseText);
            tryUpdatePoW(data?.proofofwork?.difficulty || 'N/A');
          } catch {}
        }
      });
      return origOpen.apply(this, args);
    };

    /* 首屏兜底请求 */
    setTimeout(() => {
      fetch('https://chatgpt.com/backend-api/sentinel/chat-requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
        credentials: 'include',
      })
        .then(r => r.json())
        .then(d => tryUpdatePoW(d?.proofofwork?.difficulty || 'N/A'))
        .catch(() => {});
    }, 1000);

    /* —— PoW 浮窗 —— */
    function initPowUI() {
      if (containerInitialized) return;
      containerInitialized = true;

      const floatContainer = document.createElement('div');
      floatContainer.id = 'pow-float-container';
      Object.assign(floatContainer.style, {
        position: 'fixed',
        bottom: '16px',
        right: '0px',
        zIndex: 9999,
        padding: '12px 16px',
        borderRadius: '12px',
        backdropFilter: 'none',
        backgroundColor: 'transparent',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
        color: '#333',
        pointerEvents: 'none',
      });

      const powWrapper = document.createElement('div');
      powWrapper.id = 'pow-wrapper';
      powWrapper.style.position = 'relative';
      powWrapper.style.pointerEvents = 'auto';

      const powText = document.createElement('div');
      powText.id = 'pow-text';
      powText.style.fontWeight = 'bold';
      powText.style.display = 'inline-flex';
      powText.style.alignItems = 'center';
      powText.style.gap = '6px';
      powText.style.whiteSpace = 'nowrap';

      const tooltip = document.createElement('div');
      tooltip.id = 'custom-tooltip';
      Object.assign(tooltip.style, {
        display: 'none',
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translate(-50%, -8px)',
        background: '#333',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        whiteSpace: 'nowrap',
      });
      tooltip.innerHTML = `
        <div style="color:#00FF00;">绿色：全模型智商在线未降智</div>
        <div style="color:#FFFF00;">黄色：高风险IP - 降智概率高</div>
        <div style="color:#FF0000;">红色：全模型降智堪比免费版</div>
      `;

      powWrapper.appendChild(powText);
      powWrapper.appendChild(tooltip);
      floatContainer.appendChild(powWrapper);
      document.body.appendChild(floatContainer);

      powWrapper.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
        requestAnimationFrame(() => {
          const rect = tooltip.getBoundingClientRect();
          const margin = 8;
          if (rect.right > window.innerWidth - margin) {
            const overflow = rect.right - (window.innerWidth - margin);
            tooltip.style.transform = `translate(calc(-50% - ${overflow}px), -8px)`;
          }
        });
      });
      powWrapper.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
        tooltip.style.transform = 'translate(-50%, -8px)';
      });
    }

    function parsePowDifficulty(difficulty) {
      if (difficulty === 'N/A') {
        return { color: '#00FF00', label: 'N/A', trimmedHex: 'N/A' };
      }
      const trimmed = difficulty.replace(/^0x/i, '').replace(/^0+/, '') || '0';
      const len = trimmed.length;
      if (len >= 5) return { color: '#00FF00', label: '智商在线', trimmedHex: trimmed };
      if (len === 4) return { color: '#FFFF00', label: '边缘降智', trimmedHex: trimmed };
      return { color: '#FF0000', label: '智商下线', trimmedHex: trimmed };
    }

    function getPulseExpandIcon(color) {
      return `
        <svg width="16" height="16" viewBox="0 0 64 64" style="vertical-align:middle">
          <circle cx="32" cy="32" r="4" fill="${color}">
            <animate attributeName="r" dur="1.5s" values="4;10;4" repeatCount="indefinite"/>
          </circle>
          <circle cx="32" cy="32" r="10" fill="none" stroke="${color}" stroke-width="2">
            <animate attributeName="r" dur="2s" values="10;20;10" repeatCount="indefinite"/>
          </circle>
          <circle cx="32" cy="32" r="20" fill="none" stroke="${color}" stroke-width="2">
            <animate attributeName="r" dur="3s" values="20;30;20" repeatCount="indefinite"/>
          </circle>
        </svg>`;
    }

    function updatePowText() {
      const el = document.getElementById('pow-text');
      if (!el) return;
      /*只有 difficulty 真的变了才重绘，避免 SVG 周期性重置导致闪动 */
      if (powDifficulty === lastRenderedPow) return;
      lastRenderedPow = powDifficulty;

      const { color, label, trimmedHex } = parsePowDifficulty(powDifficulty);
      el.innerHTML = `${getPulseExpandIcon(color)}
        <span style="color:${color};">${trimmedHex} ${label}</span>`;
    }

    new MutationObserver(() => {
      if (!document.getElementById('pow-float-container')) {
        containerInitialized = false;
        initPowUI();
        updatePowText();
      }
    }).observe(document.documentElement, { childList: true, subtree: true });

    setInterval(updatePowText, 1000);

    initPowUI();
    updatePowText();
  });
})();
