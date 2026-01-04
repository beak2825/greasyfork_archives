// ==UserScript==
// @name         Claude 对话导航
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Claude官网对话导航工具：紧凑导航 + 实时定位；快捷键 Command+↑/↓ 与 Alt+[ / Alt+]；回到顶部/到底部单击即用
// @author       schweigen
// @license      MIT
// @match        https://claude.ai/*
// @match        https://claude.ai/chat/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546259/Claude%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/546259/Claude%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG = { maxPreviewLength: 12, animation: 250, refreshInterval: 2000, forceRefreshInterval: 10000, anchorOffset: 8 };
  const BOUNDARY_EPS = 28;
  const DEBUG = false;

  // 全局调试函数，用户可在控制台调用
  window.claudeNavDebug = {
    forceRefresh: () => {
      console.log('Claude Navigation: 手动强制刷新');
      TURN_SELECTOR = null;
      const ui = document.getElementById('claude-compact-nav')?._ui;
      if (ui) scheduleRefresh(ui);
      else console.log('导航面板未找到');
    },
    showCurrentSelector: () => {
      console.log('当前使用的选择器:', TURN_SELECTOR || '无');
      console.log('当前对话数量:', qsTurns().length);
    },
    testAllSelectors: () => {
      const originalSelector = TURN_SELECTOR;
      TURN_SELECTOR = null;
      qsTurns(); // 这会触发调试输出
      TURN_SELECTOR = originalSelector;
    },
    getCurrentTurns: () => {
      const turns = qsTurns();
      console.log('当前检测到的对话元素:', turns);
      return turns;
    },
    checkOverlap: () => {
      const panels = document.querySelectorAll('#claude-compact-nav');
      const styles = document.querySelectorAll('#claude-compact-nav-style');
      console.log(`找到 ${panels.length} 个导航面板`);
      console.log(`找到 ${styles.length} 个样式节点`);
      console.log(`键盘事件已绑定: ${!!window.__claudeKeysBound}`);
      console.log(`正在启动中: ${__claudeBooting}`);
      if (panels.length > 1) {
        console.warn('检测到重叠面板！清理中...');
        panels.forEach((panel, index) => {
          if (index > 0) {
            panel.remove();
            console.log(`已删除重复面板 ${index}`);
          }
        });
      }
      return { panels: panels.length, styles: styles.length, keysBound: !!window.__claudeKeysBound, booting: __claudeBooting };
    }
  };

  GM_registerMenuCommand("重置问题栏位置", resetPanelPosition);
  function resetPanelPosition() {
    const nav = document.getElementById('claude-compact-nav');
    if (nav) {
      nav.style.top = '60px';
      nav.style.right = '10px';
      nav.style.left = 'auto';
      nav.style.bottom = 'auto';
      const originalBg = nav.style.background;
      nav.style.background = 'rgba(0, 255, 0, 0.2)';
      setTimeout(() => { nav.style.background = originalBg; }, 500);
    }
  }

  let pending = false, rafId = null, idleId = null;
  let forceRefreshTimer = null;
  let lastTurnCount = 0;
  let TURN_SELECTOR = null;
  let scrollTicking = false;
  let currentActiveId = null;
  let __claudeBooting = false;
  let refreshTimer = 0;

  function scheduleRefresh(ui, { delay = 80, force = false } = {}) {
    if (force) {
      if (refreshTimer) { clearTimeout(refreshTimer); refreshTimer = 0; }
      run();
      return;
    }
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(run, delay);

    function run() {
      refreshTimer = 0;
      pending = false;
      try {
        const oldCount = cacheIndex.length;
        refreshIndex(ui);
        const newCount = cacheIndex.length;

        if (newCount !== oldCount) {
          setTimeout(() => {
            refreshIndex(ui);
            scheduleActiveUpdateNow();
          }, 120);
        } else {
          scheduleActiveUpdateNow();
        }
      } catch (e) {
        if (DEBUG || window.DEBUG_TEMP) console.error('scheduleRefresh error:', e);
      }
    }
  }

  function init() {
    if (document.getElementById('claude-compact-nav')) return;
    const checkContentLoaded = () => {
      const turns = document.querySelectorAll('[data-testid="user-message"], .font-claude-response, [data-test-render-count]');
      return turns.length > 0;
    };
    const boot = () => {
      if (document.getElementById('claude-compact-nav')) {
        if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 面板已存在，跳过创建');
        return;
      }
      if (__claudeBooting) {
        if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 正在启动中，跳过重复创建');
        return;
      }
      
      __claudeBooting = true;
      try {
        if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 开始创建面板');
        const ui = createPanel();
        wirePanel(ui);
        observeChat(ui);
        bindActiveTracking();
        watchSendEvents(ui);
        scheduleRefresh(ui);
        if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 面板创建完成');
      } finally {
        __claudeBooting = false;
      }
    };
    if (checkContentLoaded()) boot();
    else {
      const observer = new MutationObserver(() => {
        if (checkContentLoaded()) { observer.disconnect(); boot(); }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  let currentUrl = location.href;
  function detectUrlChange() {
    if (location.href !== currentUrl) {
      if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: URL变化，清理旧实例', currentUrl, '->', location.href);
      currentUrl = location.href;
      const oldNav = document.getElementById('claude-compact-nav');
      if (oldNav) {
        if (oldNav._ui) {
          if (oldNav._ui._forceRefreshTimer) {
            clearInterval(oldNav._ui._forceRefreshTimer);
            if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 已清理定时器');
          }
          if (oldNav._ui._mo) {
            try { 
              oldNav._ui._mo.disconnect(); 
              if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 已断开MutationObserver');
            } catch (e) {
              if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 断开MutationObserver失败', e);
            }
          }
        }
        oldNav.remove();
        if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 已移除旧面板');
      }
      __claudeBooting = false;
      window.__claudeKeysBound = false;
      lastTurnCount = 0;
      TURN_SELECTOR = null;
      setTimeout(init, 100);
    }
  }
  window.addEventListener('popstate', detectUrlChange);
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  history.pushState = function (...args) { originalPushState.apply(this, args); setTimeout(detectUrlChange, 0); };
  history.replaceState = function (...args) { originalReplaceState.apply(this, args); setTimeout(detectUrlChange, 0); };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  function qsTurns(root = document) {
    if (TURN_SELECTOR) return Array.from(root.querySelectorAll(TURN_SELECTOR));
    
    // Claude 特定的选择器
    const selectors = [
      // 主要对话容器选择器
      '.flex-1.flex.flex-col.gap-3 > div',
      '.flex-1 > div[data-test-render-count]',
      'div[data-test-render-count]',
      
      // 备用选择器
      '[data-testid="user-message"]',
      '.font-claude-response',
      'div[class*="group"][class*="relative"]',
      '.flex.flex-col.gap-3 > div',
      'main div[class*="group"]',
      
      // 更广泛的备用选择器
      'div[class*="mb-1"][class*="mt-1"]',
      'div[style*="opacity: 1; transform: none"]',
      '.max-w-3xl div[class*="group"]'
    ];
    
    if (DEBUG || window.DEBUG_TEMP) {
      console.log('Claude Navigation Debug: 检测对话选择器');
      for (const selector of selectors) {
        const els = root.querySelectorAll(selector);
        console.log(`- ${selector}: ${els.length} 个元素`);
        if (els.length > 0) {
          console.log('  样本元素:', els[0]);
        }
      }
    }
    
    for (const selector of selectors) {
      const els = root.querySelectorAll(selector);
      // 过滤出包含对话内容的元素
      const validEls = Array.from(els).filter(el => {
        return el.querySelector('[data-testid="user-message"]') || 
               el.querySelector('.font-claude-response') ||
               el.querySelector('.whitespace-pre-wrap') ||
               (el.textContent && el.textContent.trim().length > 20);
      });
      
      if (validEls.length) { 
        TURN_SELECTOR = selector; 
        if (DEBUG || window.DEBUG_TEMP) console.log(`Claude Navigation: 使用选择器 ${selector}, 找到 ${validEls.length} 个对话`);
        return validEls; 
      }
    }
    
    if (DEBUG || window.DEBUG_TEMP) {
      console.log('Claude Navigation Debug: 所有预设选择器都失效，尝试智能检测');
    }
    
    // 智能检测 fallback
    const fallbackSelectors = [
      'div[class*="group"], div[class*="relative"]',
      'div[class*="mb-1"], div[class*="mt-1"]',
      '.max-w-3xl > div > div',
      'main > div > div'
    ];
    
    for (const fallbackSelector of fallbackSelectors) {
      const candidates = [...root.querySelectorAll(fallbackSelector)].filter(el => {
        return (
          el.querySelector('[data-testid="user-message"]') ||
          el.querySelector('.font-claude-response') ||
          el.querySelector('.whitespace-pre-wrap') ||
          (el.textContent && el.textContent.trim().length > 20 && 
           !el.querySelector('button') && 
           !el.querySelector('input'))
        );
      });
      
      if (candidates.length > 0) {
        if (DEBUG || window.DEBUG_TEMP) console.log(`Claude Navigation: Fallback选择器 ${fallbackSelector} 找到 ${candidates.length} 个候选对话`);
        return candidates;
      }
    }
    
    if (DEBUG) console.log('Claude Navigation: 所有检测方法均失效');
    return [];
  }

  function getTextPreview(el) {
    if (!el) return '';
    const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return '...';
    let width = 0, result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charWidth = /[\u4e00-\u9fa5]/.test(char) ? 2 : 1;
      if (width + charWidth > CONFIG.maxPreviewLength) { result += '…'; break; }
      result += char; width += charWidth;
    }
    return result || text.slice(0, CONFIG.maxPreviewLength) || '...';
  }

  function buildIndex() {
    const turns = qsTurns();
    if (!turns.length) {
      if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 没有找到任何对话元素');
      return [];
    }
    
    if (DEBUG) console.log(`Claude Navigation: 开始分析 ${turns.length} 个对话元素`);
    
    let u = 0, a = 0;
    const list = [];
    for (let i = 0; i < turns.length; i++) {
      const el = turns[i];
      el.setAttribute('data-claude-turn', '1');
      
      // 检测是否为用户消息
      const isUser = !!(
        el.querySelector('[data-testid="user-message"]') ||
        el.querySelector('.text-text-100') ||
        el.querySelector('div[class*="bg-bg-300"]')
      );
      
      // 检测是否为Claude回复
      const isAssistant = !!(
        el.querySelector('.font-claude-response') ||
        el.querySelector('[data-is-streaming]') ||
        (!isUser && el.querySelector('.whitespace-normal'))
      );
      
      if (DEBUG && i < 3) {
        console.log(`Claude Navigation Debug - 元素 ${i}:`, {
          element: el,
          isUser,
          isAssistant,
          userSelectors: {
            userMessage: !!el.querySelector('[data-testid="user-message"]'),
            textColor: !!el.querySelector('.text-text-100'),
            bgColor: !!el.querySelector('div[class*="bg-bg-300"]')
          },
          assistantSelectors: {
            claudeResponse: !!el.querySelector('.font-claude-response'),
            streaming: !!el.querySelector('[data-is-streaming]'),
            whitespace: !!el.querySelector('.whitespace-normal')
          }
        });
      }
      
      let block = null;
      if (isUser) {
        block = el.querySelector('[data-testid="user-message"] .whitespace-pre-wrap, [data-testid="user-message"] p, [data-testid="user-message"]');
      } else if (isAssistant) {
        block = el.querySelector('.font-claude-response .whitespace-normal, .font-claude-response p, .font-claude-response');
      } else {
        if (DEBUG && i < 5) console.log(`Claude Navigation: 元素 ${i} 角色识别失败`);
        continue;
      }
      
      const preview = getTextPreview(block || el);
      if (!preview || preview === '...') {
        if (DEBUG && i < 5) console.log(`Claude Navigation: 元素 ${i} 无法提取预览文本`);
        continue;
      }
      
      if (!el.id) el.id = `claude-turn-${i + 1}`;
      const role = isUser ? 'user' : 'assistant';
      const seq = isUser ? ++u : ++a;
      list.push({ id: el.id, idx: i, role, preview, seq });
    }
    
    if (DEBUG) console.log(`Claude Navigation: 成功识别 ${list.length} 个对话 (用户: ${u}, 助手: ${a})`);
    return list;
  }

  function createPanel() {
    const styleId = 'claude-compact-nav-style';
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
#claude-compact-nav { position: fixed; top: 60px; right: 10px; width: auto; min-width: 80px; max-width: 210px; z-index: 2147483647 !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; font-size: 13px; pointer-events: auto; background: transparent; -webkit-user-select:none; user-select:none; -webkit-tap-highlight-color: transparent; }
#claude-compact-nav * { -webkit-user-select:none; user-select:none; }
.compact-header { display:flex; align-items:center; justify-content:space-between; padding:4px 8px; margin-bottom:4px; background:transparent; border-radius:6px; pointer-events:auto; cursor:move; box-shadow:0 1px 3px rgba(0,0,0,.08); min-width:100px; }
.compact-title { font-size:11px; font-weight:600; color: rgb(147, 51, 234); display:flex; align-items:center; gap:3px; }
.compact-title svg { width:12px; height:12px; opacity:.5; }
.compact-toggle { background:rgba(255,255,255,.9); border:1px solid rgba(0,0,0,.15); color:rgba(0,0,0,.6); cursor:pointer; width:26px; height:26px; display:flex; align-items:center; justify-content:center; border-radius:4px; transition:all .2s; font-size:20px; font-weight:bold; line-height:1; }
.compact-toggle:hover { background:rgba(0,0,0,.1); color:rgba(0,0,0,.8); border-color:rgba(0,0,0,.25); }
.compact-refresh { background:rgba(255,255,255,.9); border:1px solid rgba(0,0,0,.15); color:rgba(0,0,0,.6); cursor:pointer; width:26px; height:26px; display:flex; align-items:center; justify-content:center; border-radius:4px; transition:all .2s; font-size:14px; font-weight:bold; line-height:1; margin-left:4px; }
.compact-refresh:hover { background:rgba(0,0,0,.1); color:rgba(0,0,0,.8); border-color:rgba(0,0,0,.25); }
.toggle-text { display:block; font-family:monospace; }
.compact-list { max-height:400px; overflow-y:auto; overflow-x:hidden; padding:0; pointer-events:auto; display:flex; flex-direction:column; gap:8px; }
.compact-list::-webkit-scrollbar { width:3px; }
.compact-list::-webkit-scrollbar-thumb { background:rgba(0,0,0,.2); border-radius:2px; }
.compact-list::-webkit-scrollbar-thumb:hover { background:rgba(0,0,0,.3); }
.compact-item { display:block; padding:3px 8px; margin:0; border-radius:4px; cursor:pointer; transition:all .15s ease; font-size:12px; line-height:1.4; min-height:20px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; pointer-events:auto; background:rgba(255,255,255,.85); box-shadow:0 1px 2px rgba(0,0,0,.05); width:auto; min-width:60px; max-width:190px; }
.compact-item:hover { background:rgba(255,255,255,.95); transform:translateX(2px); box-shadow:0 2px 4px rgba(0,0,0,.1); }
.compact-item.user { color: rgb(139, 69, 19); border-left:2px solid rgba(139,69,19,.7); font-weight: 500; }
.compact-item.assistant { color: rgb(25, 25, 112); border-left:2px solid rgba(25,25,112,.7); font-weight: 500; }
.compact-item.active { outline:2px solid rgba(147,51,234,.5); background: rgba(147,51,234,.07); }
.compact-text { display:inline-block; }
.compact-number { display:inline-block; margin-right:4px; font-weight:600; opacity:.7; font-size:11px; }
.compact-empty { padding:10px; text-align:center; color:#999; font-size:11px; background:rgba(255,255,255,.85); border-radius:6px; pointer-events:auto; min-height:20px; line-height:1.4; }

/* 底部导航条 */
.compact-footer { margin-top:6px; display:flex; gap:6px; }
.nav-btn { flex:1 1 auto; padding:6px 8px; font-size:14px; border-radius:6px; border:1px solid rgba(0,0,0,.15); background:rgba(255,255,255,.9); cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,.05); line-height:1; }
.nav-btn:hover { background:rgba(0,0,0,.06); }
.nav-btn:active { transform: translateY(1px); }

/* 上下箭头为橙色系 */
.nav-btn.arrow { background: rgba(255, 127, 80, 0.25); border-color: rgba(255, 127, 80, 0.35); }
.nav-btn.arrow:hover { background: rgba(255, 127, 80, 0.35); }

/* 移动端 */
@media (max-width: 768px) {
  #claude-compact-nav { right:5px; max-width:160px; }
  .compact-item { font-size:11px; padding:2px 5px; min-height:18px; }
  .nav-btn { padding:5px 6px; font-size:13px; }
}

.highlight-pulse { animation: pulse 1.5s ease-out; }
@keyframes pulse { 0% { background-color: rgba(255,243,205,0); } 20% { background-color: rgba(255,243,205,1); } 100% { background-color: rgba(255,243,205,0); } }
`;
      document.head.appendChild(style);
      if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 已创建样式');
    } else {
      if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 样式已存在，跳过创建');
    }

    const existingPanels = document.querySelectorAll('#claude-compact-nav');
    if (existingPanels.length > 0) {
      if (DEBUG || window.DEBUG_TEMP) console.log(`Claude Navigation: 发现 ${existingPanels.length} 个已存在的面板，清理中...`);
      existingPanels.forEach((panel, index) => {
        if (index > 0) {
          panel.remove();
          if (DEBUG || window.DEBUG_TEMP) console.log(`Claude Navigation: 已删除重复面板 ${index}`);
        }
      });
      if (existingPanels.length > 0) {
        const existingNav = existingPanels[0];
        if (existingNav._ui) {
          if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 返回已存在的面板');
          return existingNav._ui;
        }
      }
    }

    const nav = document.createElement('div');
    nav.id = 'claude-compact-nav';
    nav.innerHTML = `
      <div class="compact-header">
        <div style="display: flex; align-items: center; gap: 4px;">
          <button class="compact-toggle" type="button" title="收起/展开"><span class="toggle-text">−</span></button>
          <button class="compact-refresh" type="button" title="刷新对话列表">⟳</button>
        </div>
        <div class="compact-title" aria-live="polite" aria-atomic="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <span>对话栏</span>
        </div>
      </div>
      <div class="compact-list" role="listbox" aria-label="对话项"></div>
      <div class="compact-footer">
        <button class="nav-btn" type="button" id="claude-nav-top" title="回到顶部">⤒</button>
        <button class="nav-btn arrow" type="button" id="claude-nav-prev" title="上一条（Command+↑ / Alt+[）">↑</button>
        <button class="nav-btn arrow" type="button" id="claude-nav-next" title="下一条（Command+↓ / Alt+]）">↓</button>
        <button class="nav-btn" type="button" id="claude-nav-bottom" title="回到底部">⤓</button>
      </div>
    `;
    document.body.appendChild(nav);
    enableDrag(nav);

    nav.addEventListener('dblclick', (e) => { e.preventDefault(); e.stopPropagation(); }, { capture: true });
    nav.addEventListener('selectstart', (e) => { e.preventDefault(); }, { capture: true });
    nav.addEventListener('mousedown', (e) => { if (e.detail > 1) { e.preventDefault(); } }, { capture: true });

    nav._ui = { nav };
    return { nav };
  }

  function enableDrag(nav) {
    const header = nav.querySelector('.compact-header');
    let isDragging = false, startX, startY, startLeft, startTop;
    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.compact-toggle') || e.target.closest('.compact-refresh')) return;
      isDragging = true; startX = e.clientX; startY = e.clientY;
      const rect = nav.getBoundingClientRect(); startLeft = rect.left; startTop = rect.top; e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      nav.style.left = `${startLeft + dx}px`; nav.style.top = `${startTop + dy}px`; nav.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => { isDragging = false; });
  }

  let cacheIndex = [];

  function renderList(ui) {
    const list = ui.nav.querySelector('.compact-list');
    if (!list) return;
    const next = cacheIndex;
    if (!next.length) { list.innerHTML = `<div class="compact-empty">暂无对话</div>`; return; }
    list.innerHTML = '';
    for (const item of next) {
      const node = document.createElement('div');
      node.className = `compact-item ${item.role}`;
      node.dataset.id = item.id;
      node.innerHTML = `<span class="compact-number">${item.idx + 1}.</span><span class="compact-text" title="${escapeAttr(item.preview)}">${escapeHtml(item.preview)}</span>`;
      node.setAttribute('draggable', 'false');
      list.appendChild(node);
    }
    if (!list._eventBound) {
      list.addEventListener('click', (e) => {
        const item = e.target.closest('.compact-item');
        if (!item) return;
        const el = document.getElementById(item.dataset.id);
        if (el) {
          setActiveTurn(item.dataset.id);
          scrollToTurn(el);
        }
      });
      list._eventBound = true;
    }
    scheduleActiveUpdateNow();
  }

  function refreshIndex(ui) {
    const next = buildIndex();
    if (DEBUG) console.log('Claude Navigation: turns', next.length);
    lastTurnCount = next.length;
    cacheIndex = next;
    renderList(ui);
  }

  function getScrollRoot(start) {
    let el = start || null;
    while (el && el !== document.documentElement && el !== document.body) {
      const s = getComputedStyle(el);
      if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 1) return el;
      el = el.parentElement;
    }
    const doc = document.scrollingElement || document.documentElement;
    const candidates = [
      document.querySelector('.flex-1.flex.flex-col.gap-3'),
      document.querySelector('main'),
      doc
    ];
    for (const c of candidates) {
      if (!c) continue;
      const s = getComputedStyle(c);
      if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && c.scrollHeight > c.clientHeight + 1) return c;
    }
    return doc;
  }

  function getFixedHeaderHeight() {
    const h = document.querySelector('header, nav');
    if (!h) return 0;
    const r = h.getBoundingClientRect();
    return Math.max(0, r.height) + 12;
  }

  function findTurnAnchor(root) {
    if (!root) return null;
    const selectors = [
      '[data-testid="user-message"]',
      '.font-claude-response',
      '.whitespace-pre-wrap',
      '.whitespace-normal',
      'p','li','pre','code','blockquote'
    ];
    for (const s of selectors) {
      const n = root.querySelector(s);
      if (n && n.offsetParent !== null && n.offsetHeight > 0) return n;
    }
    return root;
  }

  function scrollToTurn(el) {
    const anchor = findTurnAnchor(el) || el;
    const margin = Math.max(0, getFixedHeaderHeight());
    try {
      anchor.style.scrollMarginTop = margin + 'px';
      requestAnimationFrame(() => {
        anchor.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
        postScrollNudge(el);
      });
    } catch {
      const scroller = getScrollRoot(anchor);
      const scRect = scroller.getBoundingClientRect ? scroller.getBoundingClientRect() : { top: 0 };
      const isWindow = (scroller === document.documentElement || scroller === document.body);
      const base = isWindow ? window.scrollY : scroller.scrollTop;
      const top = base + anchor.getBoundingClientRect().top - scRect.top - margin;
      if (isWindow) window.scrollTo({ top, behavior: 'smooth' });
      else scroller.scrollTo({ top, behavior: 'smooth' });
      postScrollNudge(el);
    }
    el.classList.add('highlight-pulse');
    anchor.classList.add('highlight-pulse');
    setTimeout(() => { el.classList.remove('highlight-pulse'); anchor.classList.remove('highlight-pulse'); }, 1600);
  }

  function postScrollNudge(targetEl) {
    let tries = 0;
    const step = () => {
      tries++;
      const y = getAnchorY();
      const r = targetEl.getBoundingClientRect();
      const diff = r.top - y;
      if (diff > 1 && tries <= 6) {
        const scroller = getScrollRoot(targetEl);
        const isWindow = (scroller === document.documentElement || scroller === document.body);
        if (isWindow) window.scrollBy(0, diff + 1);
        else scroller.scrollBy({ top: diff + 1 });
        requestAnimationFrame(step);
      } else {
        scheduleActiveUpdateNow();
      }
    };
    requestAnimationFrame(step);
  }

  function wirePanel(ui) {
    const toggleBtn = ui.nav.querySelector('.compact-toggle');
    const refreshBtn = ui.nav.querySelector('.compact-refresh');
    
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const list = ui.nav.querySelector('.compact-list');
        const toggleText = toggleBtn.querySelector('.toggle-text');
        const isHidden = list.getAttribute('data-hidden') === '1';
        if (isHidden) {
          list.style.visibility = 'visible'; list.style.height = ''; list.style.overflow = '';
          list.setAttribute('data-hidden', '0'); toggleText.textContent = '−';
        } else {
          list.style.visibility = 'hidden'; list.style.height = '0'; list.style.overflow = 'hidden';
          list.setAttribute('data-hidden', '1'); toggleText.textContent = '+';
        }
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', (e) => {
        if (e.shiftKey) {
          if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 强制重新扫描 (清除缓存选择器)');
          TURN_SELECTOR = null;
          refreshBtn.style.background = 'rgba(255, 0, 0, 0.2)';
          setTimeout(() => {
            refreshBtn.style.background = '';
          }, 300);
        }
        scheduleRefresh(ui);
      });
      
      refreshBtn.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 右键强制重新扫描');
        TURN_SELECTOR = null;
        refreshBtn.style.background = 'rgba(255, 0, 0, 0.2)';
        setTimeout(() => {
          refreshBtn.style.background = '';
        }, 300);
        scheduleRefresh(ui);
      });
      
      refreshBtn.title = "刷新对话列表 (Shift+点击 或 右键 = 强制重新扫描)";
    }

    const prevBtn = ui.nav.querySelector('#claude-nav-prev');
    const nextBtn = ui.nav.querySelector('#claude-nav-next');
    const topBtn  = ui.nav.querySelector('#claude-nav-top');
    const bottomBtn = ui.nav.querySelector('#claude-nav-bottom');

    if (prevBtn) prevBtn.addEventListener('click', () => jumpActiveBy(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => jumpActiveBy(+1));
    if (topBtn) topBtn.addEventListener('click', () => jumpToEdge('top'));
    if (bottomBtn) bottomBtn.addEventListener('click', () => jumpToEdge('bottom'));

    if (!window.__claudeKeysBound) {
      const onKeydown = (e) => {
        if (e.altKey && (e.key === '[' || e.key === ']')) {
          jumpActiveBy(e.key === ']' ? +1 : -1);
          e.preventDefault();
        }
        if (e.metaKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
          const t = e.target;
          const isEditable = t && ((t.tagName === 'INPUT') || (t.tagName === 'TEXTAREA') || (t.isContentEditable));
          if (!isEditable) {
            jumpActiveBy(e.key === 'ArrowDown' ? +1 : -1);
            e.preventDefault();
          }
        }
        if (e.altKey && e.key === '/') {
          const list = ui.nav.querySelector('.compact-list');
          const toggleText = ui.nav.querySelector('.compact-toggle .toggle-text');
          const isHidden = list.getAttribute('data-hidden') === '1';
          if (isHidden) { list.style.visibility = 'visible'; list.style.height = ''; list.style.overflow = ''; list.setAttribute('data-hidden', '0'); if (toggleText) toggleText.textContent = '−'; }
          else { list.style.visibility = 'hidden'; list.style.height = '0'; list.style.overflow = 'hidden'; list.setAttribute('data-hidden', '1'); if (toggleText) toggleText.textContent = '+'; }
          e.preventDefault();
        }
      };
      
      document.addEventListener('keydown', onKeydown, { passive: false });
      window.__claudeKeysBound = true;
      if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 已绑定键盘事件');
    } else {
      if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 键盘事件已存在，跳过绑定');
    }
  }

  function jumpToEdge(which) {
    const turns = qsTurns();
    if (turns && turns.length) {
      const el = which === 'top' ? turns[0] : turns[turns.length - 1];
      if (!el.id) el.id = `claude-turn-edge-${which}`;
      setActiveTurn(el.id);
      scrollToTurn(el);
      return;
    }
    const sc = getScrollRoot(document.body);
    const isWindow = (sc === document.documentElement || sc === document.body || sc === (document.scrollingElement || document.documentElement));
    const top = which === 'top' ? 0 : Math.max(0, (isWindow ? document.body.scrollHeight : sc.scrollHeight) - (isWindow ? window.innerHeight : sc.clientHeight));
    if (isWindow) window.scrollTo({ top, behavior: 'smooth' });
    else sc.scrollTo({ top, behavior: 'smooth' });
    scheduleActiveUpdateNow();
  }

  function observeChat(ui) {
    const target = document.body;
    const mo = new MutationObserver((muts) => {
      for (const mut of muts) {
        const t = mut.target && mut.target.nodeType === 1 ? mut.target : null;
        if (!t) continue;

        if (
          t.closest('.flex-1.flex.flex-col') ||
          t.closest('[data-testid="user-message"]') ||
          t.closest('.font-claude-response') ||
          t.closest('[data-test-render-count]') ||
          t.closest('.whitespace-pre-wrap') || 
          t.closest('.whitespace-normal')
        ) {
          TURN_SELECTOR = null;
          scheduleRefresh(ui, { delay: 80 });
          return;
        }
      }
    });

    mo.observe(target, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['data-testid', 'data-test-render-count', 'data-is-streaming', 'class']
    });

    ui._mo = mo;
    ui._moTarget = target;

    if (forceRefreshTimer) clearInterval(forceRefreshTimer);
    forceRefreshTimer = setInterval(() => {
      TURN_SELECTOR = null;
      scheduleRefresh(ui, { force: true });
    }, 10000);
    ui._forceRefreshTimer = forceRefreshTimer;
  }

  function bindActiveTracking() {
    document.addEventListener('scroll', onAnyScroll, { passive: true, capture: true });
    window.addEventListener('resize', onAnyScroll, { passive: true });
    scheduleActiveUpdateNow();
  }

  function startBurstRefresh(ui, ms = 6000, step = 160) {
    const end = Date.now() + ms;
    const tick = () => {
      scheduleRefresh(ui, { force: true });
      if (Date.now() < end) {
        setTimeout(tick, step);
      }
    };
    tick();
  }

  function watchSendEvents(ui) {
    // 监听可能的发送事件
    document.addEventListener('click', (e) => {
      // Claude 的发送按钮检测
      if (e.target && e.target.closest && (
        e.target.closest('button[type="submit"]') ||
        e.target.closest('[aria-label*="Send"]') ||
        e.target.closest('button[class*="send"]')
      )) {
        if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 检测到发送按钮点击，启动突发刷新');
        startBurstRefresh(ui);
      }
    }, true);

    document.addEventListener('keydown', (e) => {
      const t = e.target;
      if (!t) return;
      const isTextarea = t.tagName === 'TEXTAREA' || t.isContentEditable;
      if (isTextarea && e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 检测到快捷键发送，启动突发刷新');
        startBurstRefresh(ui);
      }
    }, true);

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        if (DEBUG || window.DEBUG_TEMP) console.log('Claude Navigation: 页面重新可见，强制刷新');
        scheduleRefresh(ui, { force: true });
      }
    });
  }

  function onAnyScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      updateActiveFromAnchor();
      scrollTicking = false;
    });
  }

  function scheduleActiveUpdateNow() { requestAnimationFrame(updateActiveFromAnchor); }

  function getAnchorY() {
    const h = getFixedHeaderHeight();
    return Math.max(0, Math.min(window.innerHeight - 20, h + CONFIG.anchorOffset));
  }

  function updateActiveFromAnchor() {
    if (!cacheIndex.length) return;
    const y = getAnchorY();
    const xs = [Math.floor(window.innerWidth * 0.40), Math.floor(window.innerWidth * 0.60)];
    let activeEl = null;

    for (const x of xs) {
      const stack = (document.elementsFromPoint ? document.elementsFromPoint(x, y) : []);
      if (!stack || !stack.length) continue;
      for (const el of stack) {
        if (!el) continue;
        if (el.id === 'claude-compact-nav' || (el.closest && el.closest('#claude-compact-nav'))) continue;
        const t = el.closest && el.closest('[data-claude-turn="1"]');
        if (t) { activeEl = t; break; }
      }
      if (activeEl) break;
    }

    const nearNext = findNearNextTop(y, BOUNDARY_EPS);
    if (nearNext) activeEl = nearNext;

    if (!activeEl) {
      const turns = qsTurns();
      for (const t of turns) { const r = t.getBoundingClientRect(); if (r.bottom >= y) { activeEl = t; break; } }
      if (!activeEl && turns.length) activeEl = turns[0];
    }

    if (activeEl) setActiveTurn(activeEl.id);
  }

  function findNearNextTop(y, eps) {
    for (const item of cacheIndex) {
      const el = document.getElementById(item.id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const d = r.top - y;
      if (d >= 0 && d <= eps) return el;
      if (r.top > y + eps) break;
    }
    return null;
  }

  function setActiveTurn(id) {
    if (!id || currentActiveId === id) return;
    currentActiveId = id;
    const list = document.querySelector('#claude-compact-nav .compact-list');
    if (!list) return;
    list.querySelectorAll('.compact-item.active').forEach(n => n.classList.remove('active'));
    const n = list.querySelector(`.compact-item[data-id="${id}"]`);
    if (n) {
      n.classList.add('active');
      const r = n.getBoundingClientRect();
      const lr = list.getBoundingClientRect();
      if (r.top < lr.top) list.scrollTop += (r.top - lr.top - 4);
      else if (r.bottom > lr.bottom) list.scrollTop += (r.bottom - lr.bottom + 4);
    }
  }

  function jumpActiveBy(delta) {
    if (!cacheIndex.length) return;
    let idx = cacheIndex.findIndex(x => x.id === currentActiveId);
    if (idx < 0) {
      updateActiveFromAnchor();
      idx = cacheIndex.findIndex(x => x.id === currentActiveId);
      if (idx < 0) idx = 0;
    }
    const nextIdx = Math.max(0, Math.min(cacheIndex.length - 1, idx + delta));
    const id = cacheIndex[nextIdx].id;
    const el = document.getElementById(id);
    if (el) { setActiveTurn(id); scrollToTurn(el); }
  }

  function escapeHtml(s) { return (s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
  function escapeAttr(s) { return escapeHtml(s).replace(/"/g, '&quot;'); }

  window.requestIdleCallback ||= (cb, opt = {}) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), opt.timeout || 1);
  window.cancelIdleCallback ||= (id) => clearTimeout(id);
})();