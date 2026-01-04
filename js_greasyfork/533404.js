// ==UserScript==
// @name         ChatGPT Timer
// @namespace    https://github.com/lueluelue2006
// @version      3.1
// @description  发送后右下角开始计时，回复完成即停止；通过 fetch/XHR 拦截 + DOM 观察，适配 ChatGPT 动态页面
// @author       schweigen
// @match        https://chatgpt.com/*
// @run-at       document-start
// @grant        none
// @inject-into  page
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533404/ChatGPT%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/533404/ChatGPT%20Timer.meta.js
// ==/UserScript==

/*
  设计要点（简述）：
  - 主信号：拦截 window.fetch / XMLHttpRequest，识别对会话接口的请求，开始计时；当响应流结束（SSE 流完）时停止计时。
  - 兜底信号：DOM 观察 [data-testid="stop-button"] 按钮的出现/消失；出现→忙碌，消失→空闲。
  - 合并逻辑：任一信号认为“忙碌”则启动计时，全部空闲才停止，避免误判/并发请求。
  - 以 postMessage 在页面上下文与内容脚本之间通信，确保跨沙箱稳定；同时 @inject-into page 让 fetch 补丁尽早生效。
*/

(function () {
  'use strict';

  // ---------------------- 工具：字符串匹配 ----------------------
  const GEN_URL_PATTERNS = [
    /\/backend-api\/conversation(\b|\/)/i,
    /\/backend-api\/messages(\b|\/)/i,
    /\/client-bff\/conversation(\b|\/)/i,
    /\/backend-api\/generate(\b|\/)/i,
    /\/api\/conversation(\b|\/)/i,
    /\/api\/messages(\b|\/)/i,
    /\/v1\/messages(\b|\/)/i
  ];

  function likelyGeneration(url, method, headers, body) {
    try {
      const m = (method || 'GET').toUpperCase();
      if (!(m === 'POST' || m === 'PATCH')) return false;
      if (typeof url === 'string') {
        if (!GEN_URL_PATTERNS.some(re => re.test(url))) return false;
      } else if (url && typeof url.url === 'string') {
        if (!GEN_URL_PATTERNS.some(re => re.test(url.url))) return false;
      } else {
        return false;
      }
      // 额外温和的启发式：Accept/Content-Type
      const h = normalizeHeaders(headers);
      const accept = (h['accept'] || '').toLowerCase();
      const ctype = (h['content-type'] || '').toLowerCase();
      if (accept.includes('text/event-stream')) return true;
      if (ctype.includes('application/json')) return true;
      return true; // 保守：匹配到 URL 即认为是生成
    } catch (_) {
      return false;
    }
  }

  function normalizeHeaders(h) {
    const out = {};
    if (!h) return out;
    try {
      // Headers 对象
      if (typeof Headers !== 'undefined' && h instanceof Headers) {
        for (const [k, v] of h.entries()) out[k.toLowerCase()] = String(v);
        return out;
      }
    } catch (_) {}
    // 普通对象/数组
    try {
      if (Array.isArray(h)) {
        for (const [k, v] of h) out[String(k).toLowerCase()] = String(v);
        return out;
      }
      if (typeof h === 'object') {
        for (const k of Object.keys(h)) out[k.toLowerCase()] = String(h[k]);
        return out;
      }
    } catch (_) {}
    return out;
  }

  // ---------------------- 页面内注入：拦截 fetch/XHR ----------------------
  // 用 <script> 注入到 page 上下文，这样能可靠补丁 window.fetch，不影响页面原逻辑。
  function injectNetworkHooks() {
    const s = document.createElement('script');
    s.textContent = `(() => {
      const post = (type, detail) => {
        try { window.postMessage({ source: 'gpt-reply-timer', type, detail }, '*'); } catch (_) {}
      };

      const patterns = [${GEN_URL_PATTERNS.map(r => r.toString()).join(',')}];
      const normHeaders = ${normalizeHeaders.toString()};
      const isGen = (url, method, headers, body) => {
        try {
          const m = (method || 'GET').toUpperCase();
          if (!(m === 'POST' || m === 'PATCH')) return false;
          const urlStr = (typeof url === 'string') ? url : (url && url.url) || '';
          if (!patterns.some(re => re.test(urlStr))) return false;
          const h = normHeaders(headers);
          const accept = (h['accept'] || '').toLowerCase();
          const ctype = (h['content-type'] || '').toLowerCase();
          if (accept.includes('text/event-stream')) return true;
          if (ctype.includes('application/json')) return true;
          return true;
        } catch (_) { return false; }
      };

      // ---- fetch ----
      try {
        const origFetch = window.fetch;
        if (origFetch) {
          window.fetch = function(input, init) {
            let url = input;
            let method = (init && init.method) || (input && input.method) || 'GET';
            const headers = (init && init.headers) || (input && input.headers);
            const body = (init && init.body) || (input && input.body);
            const track = isGen(url, method, headers, body);
            if (track) post('start', { via: 'fetch' });
            const p = origFetch.apply(this, arguments);
            if (track) {
              p.then(res => {
                try {
                  const c = res.clone();
                  if (c.body && c.body.getReader) {
                    const reader = c.body.getReader();
                    const readLoop = () => reader.read().then(({ done }) => {
                      if (done) { post('stop', { via: 'fetch', how: 'stream-end' }); return; }
                      return readLoop();
                    }).catch(() => post('stop', { via: 'fetch', how: 'stream-error' }));
                    readLoop();
                  } else {
                    c.text().finally(() => post('stop', { via: 'fetch', how: 'no-body' }));
                  }
                } catch (_) {
                  post('stop', { via: 'fetch', how: 'clone-failed' });
                }
              }).catch(() => post('stop', { via: 'fetch', how: 'rejected' }));
            }
            return p;
          };
        }
      } catch (_) {}

      // ---- XHR 兜底 ----
      try {
        const OrigXHR = window.XMLHttpRequest;
        if (OrigXHR) {
          const Proto = OrigXHR.prototype;
          const _open = Proto.open;
          const _send = Proto.send;
          let last = new WeakMap();
          Proto.open = function(method, url) {
            this.__gpt_timer_meta = { method, url };
            return _open.apply(this, arguments);
          };
          Proto.send = function(body) {
            const meta = this.__gpt_timer_meta || {};
            const track = isGen(meta.url, meta.method, this._headers, body);
            if (track) post('start', { via: 'xhr' });
            this.addEventListener('loadend', () => { if (track) post('stop', { via: 'xhr', how: 'loadend' }); });
            return _send.apply(this, arguments);
          };
          const _setReqHeader = Proto.setRequestHeader;
          Proto.setRequestHeader = function(k, v) {
            this._headers = this._headers || {};
            this._headers[k] = v;
            return _setReqHeader.apply(this, arguments);
          };
        }
      } catch (_) {}
    })();`;
    (document.head || document.documentElement).appendChild(s);
    s.remove();
  }

  // ---------------------- UI：右下角计时器 ----------------------
  function createTimerUI() {
    if (document.getElementById('gpt-reply-timer')) return;
    const wrap = document.createElement('div');
    wrap.id = 'gpt-reply-timer';
    Object.assign(wrap.style, {
      position: 'fixed',
      right: '12px',
      bottom: '12px',
      zIndex: '2147483647',
      background: 'rgba(20,20,20,0.9)',
      color: '#e6e6e6',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      fontSize: '14px',
      lineHeight: '1',
      padding: '10px 12px',
      borderRadius: '10px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
      userSelect: 'none',
      display: 'none',
      alignItems: 'center',
      gap: '8px',
      border: '1px solid rgba(255,255,255,0.12)'
    });

    const dot = document.createElement('span');
    Object.assign(dot.style, {
      display: 'inline-block',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: '#ff5252',
      boxShadow: '0 0 6px rgba(255,82,82,0.8) inset'
    });

    const text = document.createElement('span');
    text.textContent = '00:00.0';
    text.style.minWidth = '64px';
    text.style.textAlign = 'right';

    const label = document.createElement('span');
    label.textContent = 'Replying';
    label.style.opacity = '0.8';

    wrap.appendChild(dot);
    wrap.appendChild(text);
    wrap.appendChild(label);
    document.documentElement.appendChild(wrap);

    return { wrap, dot, text, label };
  }

  function formatElapsed(ms) {
    const total = Math.max(0, ms|0);
    const m = Math.floor(total / 60000);
    const s = Math.floor((total % 60000) / 1000);
    const d = Math.floor((total % 1000) / 100); // 1/10 秒
    const mm = m.toString().padStart(2, '0');
    const ss = s.toString().padStart(2, '0');
    return `${mm}:${ss}.${d}`;
  }

  // ---------------------- 状态机：合并网络 + DOM 信号 ----------------------
  let ui = null;
  let running = false;
  let startAt = 0;
  let rafId = 0;
  let netActive = 0; // 网络拦截活跃计数
  let domBusy = false; // DOM 观察到 "Stop" 按钮存在
  // 每条回复的定位与耗时记录
  let currentTurnEl = null;     // 本次生成对应的 assistant article
  let replyStartAt = 0;         // 本次生成起始时间戳

  function ensureUI() { if (!ui) ui = createTimerUI(); return ui; }

  function startTimer() {
    if (running) return;
    running = true;
    startAt = performance.now();
    replyStartAt = startAt;
    currentTurnEl = null; // 等待观察器捕捉到本次新增的 assistant turn
    const { wrap, dot, text, label } = ensureUI();
    wrap.style.display = 'flex';
    dot.style.background = '#ff5252';
    dot.style.boxShadow = '0 0 6px rgba(255,82,82,0.8) inset';
    label.textContent = 'Replying';
    const loop = () => {
      const now = performance.now();
      text.textContent = formatElapsed(now - startAt);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
  }

  function stopTimer() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(rafId);
    const { dot, label } = ensureUI();
    dot.style.background = '#4caf50';
    dot.style.boxShadow = '0 0 6px rgba(76,175,80,0.8) inset';
    label.textContent = 'Done';
    // 不自动隐藏：保留耗时，便于查看；下次开始时复用

    // 在对应的 assistant 消息工具栏上标注本次用时
    try {
      const target = resolveReplyTarget();
      if (target && replyStartAt) {
        const spent = Math.max(0, (performance.now() - replyStartAt) | 0);
        annotateTurnDuration(target, spent);
      }
    } catch (_) {}
  }

  function recompute() {
    const busy = (netActive > 0) || domBusy;
    if (busy) startTimer(); else stopTimer();
  }

  // ---------------------- 监听：页面消息（来自 fetch/XHR 注入） ----------------------
  window.addEventListener('message', (ev) => {
    const d = ev && ev.data;
    if (!d || d.source !== 'gpt-reply-timer') return;
    if (d.type === 'start') { netActive += 1; recompute(); }
    else if (d.type === 'stop') { netActive = Math.max(0, netActive - 1); recompute(); }
  });

  // ---------------------- 监听：DOM（stop 按钮） ----------------------
  function observeDom() {
    const update = () => {
      // ChatGPT 一直使用 data-testid 做测试钩子，相对稳定
      const stopBtn = document.querySelector('[data-testid="stop-button"]');
      domBusy = !!stopBtn;
      recompute();
    };
    const mo = new MutationObserver((muts) => {
      // 变更频繁，做一次聚合判断即可
      update();
    });
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
    // 初始探测
    update();
  }

  // ---------------------- 监听：DOM（assistant 新消息 + 标注恢复） ----------------------
  function isAssistantArticle(el) {
    return el && el.tagName === 'ARTICLE' && el.getAttribute('data-turn') === 'assistant';
  }

  function getLastAssistant() {
    const list = Array.from(document.querySelectorAll('article[data-turn="assistant"]'));
    return list.at(-1) || null;
  }

  function findToolbar(article) {
    if (!article) return null;
    const divs = article.querySelectorAll('div');
    const candidates = Array.from(divs).filter(d =>
      d.classList && d.classList.contains('flex') && d.classList.contains('justify-start') &&
      d.querySelector('button[aria-haspopup="menu"]')
    );
    return candidates.at(-1) || null;
  }

  function annotateTurnDuration(article, ms) {
    try {
      article.dataset.replyMs = String(ms);
      const tb = findToolbar(article);
      if (!tb) return;
      let btn = tb.querySelector('button[data-reply-duration="true"]');
      if (!btn) {
        btn = document.createElement('button');
        btn.dataset.replyDuration = 'true';
        btn.setAttribute('aria-label', '回复耗时');
        btn.className = 'text-token-text-secondary hover:bg-token-bg-secondary rounded-lg';
        const inner = document.createElement('span');
        inner.className = 'flex items-center justify-center h-8 px-2';
        inner.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
        inner.style.fontVariantNumeric = 'tabular-nums';
        inner.style.fontSize = '12px';
        btn.appendChild(inner);
        // 插到“三点”按钮左侧；否则追加到末尾
        const kebab = tb.querySelector('button[aria-haspopup="menu"]') || Array.from(tb.querySelectorAll('button')).at(-1);
        if (kebab && kebab.parentElement === tb) tb.insertBefore(btn, kebab); else tb.appendChild(btn);
      }
      const seconds = (ms / 1000).toFixed(1);
      const label = `⏱ ${seconds}s`;
      const span = btn.firstElementChild || btn;
      span.textContent = label;
    } catch (_) {}
  }

  function resolveReplyTarget() {
    // 优先使用观察到的本次新建 turn；否则回退到当前最后一条 assistant
    if (currentTurnEl && document.contains(currentTurnEl)) return currentTurnEl;
    return getLastAssistant();
  }

  function observeAssistantTurns() {
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type !== 'childList') continue;
        for (const n of m.addedNodes) {
          if (isAssistantArticle(n)) {
            // 记录本次生成对应的节点
            if (running && !currentTurnEl) currentTurnEl = n;
            // 若该节点已有耗时数据但未渲染徽标，尝试恢复
            const ms = Number(n?.dataset?.replyMs || '');
            if (ms > 0) annotateTurnDuration(n, ms);
          }
          // 深层嵌套新增时，尝试自底向上找到 article
          if (n.nodeType === 1) {
            const a = n.closest && n.closest('article[data-turn="assistant"]');
            if (a && isAssistantArticle(a)) {
              if (running && !currentTurnEl) currentTurnEl = a;
              const ms = Number(a?.dataset?.replyMs || '');
              if (ms > 0) annotateTurnDuration(a, ms);
            }
          }
        }
      }
    });
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
    // 初始恢复：已存在的消息
    const last = getLastAssistant();
    if (last && last.dataset.replyMs) annotateTurnDuration(last, Number(last.dataset.replyMs));
  }

  // ---------------------- 初始化 ----------------------
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }

  // 先注入网络拦截，尽量抢在 App 初始化之前
  try { injectNetworkHooks(); } catch (_) {}
  // DOM 就绪后再安装 UI 与观察器
  onReady(() => { ensureUI(); observeDom(); observeAssistantTurns(); });

})();
w
