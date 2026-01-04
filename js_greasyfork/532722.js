// ==UserScript==
// @name         ChatGPT-批量对话删除器
// @namespace    https://chatgpt.com/
// @version      2.2
// @description  美化版界面 | 批量删除 | 搜索过滤 | 自动深色模式 | 完美跳转 | 选中状态持久化 | 自动加载 | 主题色实时同步
// @author       meroneko & gemini 3
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532722/ChatGPT-%E6%89%B9%E9%87%8F%E5%AF%B9%E8%AF%9D%E5%88%A0%E9%99%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532722/ChatGPT-%E6%89%B9%E9%87%8F%E5%AF%B9%E8%AF%9D%E5%88%A0%E9%99%A4%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // =========================
  // 配置与状态
  // =========================
  let authToken = null;
  let allConversations = [];
  let filteredConversations = [];
  let selectedIds = new Set();
  let isDrawerOpen = false;
  let isLoading = false;
  const GLOBAL_Z = 9999;

  // =========================
  // 图标资源 (SVG)
  // =========================
  const ICONS = {
    close: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>`,
    clear: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
    jump: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
    menu: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`
  };

  // =========================
  // 样式表 (主题同步核心)
  // =========================
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    /* 1. 基础变量 (默认浅色模式) */
    :root {
      --cm-bg: #ffffff;
      --cm-bg-sec: #f9fafb;
      --cm-border: #e5e7eb;
      --cm-text-main: #111827;
      --cm-text-sec: #6b7280;
      --cm-shadow: -5px 0 25px rgba(0,0,0,0.1);
      --cm-overlay: transparent;
      
      /* 默认主题色 (GPT-3.5 Green) */
      --cm-primary: #10a37f;
      --cm-primary-hover: #0d8a6a;
      
      --cm-danger: #ef4444;
      --cm-danger-hover: #dc2626;
    }

    /* 2. 深色模式适配 (监听 html 标签的 class="dark") */
    html.dark {
      --cm-bg: #171717;       /* ChatGPT 原生深色背景 */
      --cm-bg-sec: #212121;   /* 侧边栏/次级背景 */
      --cm-border: #424242;   /* 边框颜色 */
      --cm-text-main: #ececf1;
      --cm-text-sec: #b4b4b4;
      --cm-shadow: -5px 0 25px rgba(0,0,0,0.6);
      
      /* 在深色模式下，我们可以微调危险按钮的颜色使其不那么刺眼，或者保持一致 */
    }

    /* 3. 品牌色实时同步 (监听 html 标签的 data-chat-theme 属性) */
    
    /* GPT-4 / Plus (Purple) */
    html[data-chat-theme="purple"] {
      --cm-primary: #ab68ff;
      --cm-primary-hover: #9652eb;
    }

    /* 某些特定的 Alpha/Beta 模型 (Orange) */
    html[data-chat-theme="orange"] {
      --cm-primary: #f59e0b;
      --cm-primary-hover: #d97706;
    }

    /* 如果未来有蓝色主题 (Blue) */
    html[data-chat-theme="blue"] {
      --cm-primary: #3b82f6;
      --cm-primary-hover: #2563eb;
    }

    /* --- 组件样式 --- */

    /* 浮动按钮 */
    #cm-toggle-btn {
      position: fixed; bottom: 20px; right: 20px;
      width: 50px; height: 50px;
      background: var(--cm-primary);
      color: white; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: ${GLOBAL_Z}; transition: transform 0.2s, background 0.2s;
    }
    #cm-toggle-btn:hover { transform: scale(1.1); background: var(--cm-primary-hover); }

    /* 遮罩层 - 穿透模式 */
    #cm-overlay {
      position: fixed; inset: 0; background: transparent;
      z-index: ${GLOBAL_Z}; pointer-events: none;
    }

    /* 抽屉主体 */
    #cm-drawer {
      position: fixed; top: 0; right: 0; bottom: 0;
      width: 420px; max-width: 90vw;
      background: var(--cm-bg);
      box-shadow: var(--cm-shadow);
      z-index: ${GLOBAL_Z + 1};
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex; flex-direction: column;
      border-left: 1px solid var(--cm-border);
      pointer-events: auto; 
    }
    #cm-drawer.open { transform: translateX(0); }

    /* 头部 */
    .cm-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--cm-border);
      display: flex; justify-content: space-between; align-items: center;
      background: var(--cm-bg);
    }
    .cm-title { font-size: 16px; font-weight: 600; color: var(--cm-text-main); }
    .cm-close { cursor: pointer; color: var(--cm-text-sec); padding: 4px; border-radius: 4px; }
    .cm-close:hover { background: var(--cm-bg-sec); color: var(--cm-text-main); }

    /* 搜索栏 */
    .cm-search-box {
      padding: 12px 20px;
      border-bottom: 1px solid var(--cm-border);
      position: relative;
    }
    .cm-search-input {
      width: 100%; 
      padding: 8px 36px 8px 36px; 
      border-radius: 6px; border: 1px solid var(--cm-border);
      background: var(--cm-bg-sec); color: var(--cm-text-main);
      font-size: 14px; outline: none;
    }
    .cm-search-input:focus { border-color: var(--cm-primary); }
    .cm-search-icon {
      position: absolute; left: 30px; top: 50%; transform: translateY(-50%);
      color: var(--cm-text-sec); pointer-events: none;
    }
    .cm-search-clear {
      position: absolute; right: 30px; top: 50%; transform: translateY(-50%);
      color: var(--cm-text-sec); cursor: pointer; display: none;
      padding: 4px; border-radius: 50%; transition: all 0.2s;
      background: transparent;
    }
    .cm-search-clear:hover { background: #e5e7eb; color: var(--cm-text-main); }
    /* 在深色模式下清除按钮 hover 背景也要适配 */
    html.dark .cm-search-clear:hover { background: #40414f; }

    /* 列表区域 */
    #cm-list-container {
      flex: 1; overflow-y: auto; padding: 0 0 20px 0;
    }
    .cm-group-title {
      padding: 12px 20px 8px; font-size: 12px; font-weight: 600;
      color: var(--cm-text-sec); text-transform: uppercase; letter-spacing: 0.5px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .cm-group-action { color: var(--cm-primary); cursor: pointer; font-size: 12px; }
    .cm-group-action:hover { text-decoration: underline; }

    .cm-item {
      padding: 10px 20px; display: flex; align-items: center;
      cursor: pointer; transition: background 0.15s;
      border-bottom: 1px solid transparent;
    }
    .cm-item:hover { background: var(--cm-bg-sec); }
    .cm-item.deleted { opacity: 0.4; pointer-events: none; text-decoration: line-through; }
    
    .cm-checkbox {
      width: 16px; height: 16px; margin-right: 12px;
      accent-color: var(--cm-primary); cursor: pointer;
    }
    .cm-info { flex: 1; overflow: hidden; }
    .cm-name {
      font-size: 14px; color: var(--cm-text-main);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      margin-bottom: 2px;
    }
    .cm-time { font-size: 12px; color: var(--cm-text-sec); }
    
    .cm-btn-icon {
      padding: 6px; border-radius: 4px; color: var(--cm-text-sec);
      cursor: pointer; margin-left: 4px; opacity: 0; transition: opacity 0.2s;
    }
    .cm-item:hover .cm-btn-icon { opacity: 1; }
    .cm-btn-icon:hover { background: #e5e7eb; color: #000; }
    html.dark .cm-btn-icon:hover { background: #40414f; color: #fff; }

    /* 底部操作栏 */
    .cm-footer {
      padding: 16px 20px; border-top: 1px solid var(--cm-border);
      background: var(--cm-bg); display: flex; gap: 10px;
      justify-content: flex-end;
    }
    .cm-btn {
      padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 500;
      cursor: pointer; border: none; transition: opacity 0.2s;
    }
    .cm-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .cm-btn-primary { background: var(--cm-primary); color: white; }
    .cm-btn-danger { background: var(--cm-danger); color: white; }
    .cm-btn-ghost { background: transparent; color: var(--cm-text-sec); border: 1px solid var(--cm-border); }
    
    /* 加载动画 */
    .cm-loader {
      width: 100%; height: 3px; background: var(--cm-bg-sec);
      overflow: hidden; display: none;
    }
    .cm-loader.active { display: block; }
    .cm-loader-bar {
      width: 50%; height: 100%; background: var(--cm-primary);
      animation: swipe 1s infinite ease-in-out;
    }
    @keyframes swipe { 0% {transform: translateX(-100%);} 100% {transform: translateX(200%);} }
  `;
  document.head.appendChild(styleSheet);

  // =========================
  // 核心逻辑：Token 捕获 & 自动触发加载
  // =========================
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    const url = args[0];
    if (typeof url === 'string' && url.includes('chatgpt.com/backend-api')) {
      try {
        const headers = args[1]?.headers || {};
        const token = headers.Authorization || headers.authorization;
        if (token && token !== authToken) {
          authToken = token;
          console.log('🔑 Token Captured');
          
          // 如果抽屉是打开的，且还没有数据，且没有正在加载，则捕获到 Token 后立即加载
          if (isDrawerOpen && allConversations.length === 0 && !isLoading) {
             loadAllData();
          }
        }
      } catch (e) {}
    }
    return response;
  };

  // =========================
  // 核心逻辑：数据加载
  // =========================
  async function fetchConversations(progressCallback) {
    const limit = 50;
    let offset = 0;
    let results = [];
    const maxLimit = 50; 
    let loop = 0;

    while (loop < maxLimit) {
      if(progressCallback) progressCallback(results.length);
      try {
        const res = await fetch(`/backend-api/conversations?offset=${offset}&limit=${limit}&order=updated`, {
          headers: { 'Authorization': authToken }
        });
        const data = await res.json();
        if (!data.items || data.items.length === 0) break;
        
        results = results.concat(data.items);
        if (data.items.length < limit) break;
        offset += limit;
        loop++;
        await new Promise(r => setTimeout(r, 200));
      } catch (err) {
        console.error(err);
        break;
      }
    }
    return results;
  }

  async function deleteConversationAPI(id) {
    const res = await fetch(`/backend-api/conversation/${id}`, {
      method: 'PATCH',
      headers: { 
        'Authorization': authToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ is_visible: false })
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  }

  // =========================
  // 核心逻辑：加载控制
  // =========================
  async function loadAllData() {
    if (isLoading) return;
    if (!authToken) {
        renderList([], "请先在页面上随便发一条消息<br>以激活 Token 捕获");
        return;
    }

    const loader = document.getElementById('cm-loader');
    isLoading = true;
    if (loader) loader.classList.add('active');
    
    try {
        allConversations = await fetchConversations((count) => {
            renderList([], `正在加载... 已获取 ${count} 条`);
        });
        filteredConversations = [...allConversations];
        renderList(filteredConversations);
    } catch(e) {
        renderList([], "加载失败，请刷新页面重试");
    } finally {
        isLoading = false;
        if (loader) loader.classList.remove('active');
    }
  }

  // =========================
  // 核心逻辑：跳转
  // =========================
  function trySpaNavigate(path) {
    try {
        const nextRouter = window.next?.router || window.__NEXT_ROUTER__ || window.__NUXT__?.$router;
        if (nextRouter?.push) {
            nextRouter.push(path);
            return true;
        }
        history.pushState({}, '', path);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new PopStateEvent('popstate'));
        return true;
    } catch { return false; }
  }

  function handleJump(id, newTab) {
    const path = `/c/${id}`;
    const listEl = document.getElementById('cm-list-container');
    const scrollTop = listEl ? listEl.scrollTop : 0;

    if (newTab) {
      window.open(path, '_blank');
    } else {
      if (!trySpaNavigate(path)) window.location.href = path;
      let tries = 0;
      const restore = () => {
        const el = document.getElementById('cm-list-container');
        if (el) el.scrollTop = scrollTop;
        if (++tries < 20) requestAnimationFrame(restore);
      };
      requestAnimationFrame(restore);
    }
  }

  // =========================
  // UI 构建与渲染
  // =========================
  function createUI() {
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'cm-toggle-btn';
    toggleBtn.innerHTML = ICONS.menu;
    toggleBtn.title = "管理对话历史";
    toggleBtn.onclick = toggleDrawer;
    document.body.appendChild(toggleBtn);

    const overlay = document.createElement('div');
    overlay.id = 'cm-overlay';
    overlay.onclick = toggleDrawer;
    document.body.appendChild(overlay);

    const drawer = document.createElement('div');
    drawer.id = 'cm-drawer';
    drawer.innerHTML = `
      <div class="cm-header">
        <span class="cm-title">历史对话管理</span>
        <div class="cm-close" id="cm-close-btn">${ICONS.close}</div>
      </div>
      
      <div class="cm-loader" id="cm-loader"><div class="cm-loader-bar"></div></div>

      <div class="cm-search-box">
        <div class="cm-search-icon">${ICONS.search}</div>
        <input type="text" class="cm-search-input" id="cm-search" placeholder="搜索标题...">
        <div class="cm-search-clear" id="cm-search-clear" title="清除搜索">${ICONS.clear}</div>
      </div>

      <div id="cm-list-container">
        <div style="padding:40px; text-align:center; color:var(--cm-text-sec); font-size:14px;">
          点击加载数据<br>请确保已登录
        </div>
      </div>

      <div class="cm-footer">
        <button class="cm-btn cm-btn-ghost" id="cm-sel-all">全选</button>
        <button class="cm-btn cm-btn-danger" id="cm-del-btn" disabled>删除选中</button>
      </div>
    `;
    document.body.appendChild(drawer);

    document.getElementById('cm-close-btn').onclick = toggleDrawer;
    
    const searchInput = document.getElementById('cm-search');
    const clearBtn = document.getElementById('cm-search-clear');
    
    searchInput.oninput = (e) => {
        handleSearch(e);
        clearBtn.style.display = e.target.value ? 'block' : 'none';
    };
    
    clearBtn.onclick = () => {
        searchInput.value = '';
        searchInput.focus();
        clearBtn.style.display = 'none';
        handleSearch({ target: searchInput });
    };

    document.getElementById('cm-sel-all').onclick = handleSelectAll;
    document.getElementById('cm-del-btn').onclick = handleBatchDelete;
  }

  function toggleDrawer() {
    const drawer = document.getElementById('cm-drawer');
    const overlay = document.getElementById('cm-overlay');
    
    isDrawerOpen = !isDrawerOpen;
    
    if (isDrawerOpen) {
      drawer.classList.add('open');
      overlay.classList.add('active');
      if (allConversations.length === 0) {
         loadAllData();
      }
    } else {
      drawer.classList.remove('open');
      overlay.classList.remove('active');
    }
  }

  function handleSearch(e) {
    const keyword = e.target.value.toLowerCase();
    filteredConversations = allConversations.filter(c => 
      (c.title || "").toLowerCase().includes(keyword)
    );
    renderList(filteredConversations);
  }

  function renderList(list, emptyMsg) {
    const container = document.getElementById('cm-list-container');
    container.innerHTML = '';

    if (list.length === 0) {
      container.innerHTML = `<div style="padding:40px; text-align:center; color:var(--cm-text-sec);">${emptyMsg || '无匹配结果'}</div>`;
      updateFooterState();
      return;
    }

    const groups = { '今天': [], '昨天': [], '7天内': [], '30天内': [], '更早': [] };
    const now = new Date();
    
    list.forEach(item => {
      const d = new Date(item.update_time);
      const diff = now - d;
      const days = diff / (1000 * 60 * 60 * 24);
      
      if (d.toDateString() === now.toDateString()) groups['今天'].push(item);
      else if (days < 2 && d.getDate() !== now.getDate()) groups['昨天'].push(item);
      else if (days <= 7) groups['7天内'].push(item);
      else if (days <= 30) groups['30天内'].push(item);
      else groups['更早'].push(item);
    });

    Object.entries(groups).forEach(([key, items]) => {
      if (items.length === 0) return;

      const groupHeader = document.createElement('div');
      groupHeader.className = 'cm-group-title';
      groupHeader.innerHTML = `<span>${key} (${items.length})</span>`;
      
      const groupAction = document.createElement('span');
      groupAction.className = 'cm-group-action';
      groupAction.textContent = '组全选';
      groupAction.onclick = () => toggleGroup(items);
      groupHeader.appendChild(groupAction);
      container.appendChild(groupHeader);

      items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cm-item';
        div.dataset.id = item.id;
        
        const isChecked = selectedIds.has(item.id) ? 'checked' : '';

        div.innerHTML = `
          <input type="checkbox" class="cm-checkbox" value="${item.id}" ${isChecked}>
          <div class="cm-info">
            <div class="cm-name" title="${item.title}">${item.title || '无标题'}</div>
            <div class="cm-time">${new Date(item.update_time).toLocaleString()}</div>
          </div>
          <div class="cm-btn-icon jump-btn" title="跳转">${ICONS.jump}</div>
        `;

        div.onclick = (e) => {
          if (e.target.closest('.jump-btn')) return;
          
          const cb = div.querySelector('.cm-checkbox');
          if (e.target.type !== 'checkbox') {
            cb.checked = !cb.checked;
          }
          
          if (cb.checked) selectedIds.add(item.id);
          else selectedIds.delete(item.id);
          
          updateFooterState();
        };

        div.querySelector('.jump-btn').onclick = (e) => {
            e.stopPropagation();
            const isNewTab = e.ctrlKey || e.metaKey || e.button === 1;
            handleJump(item.id, isNewTab);
        };

        container.appendChild(div);
      });
    });
    updateFooterState();
  }

  function toggleGroup(items) {
    const allChecked = items.every(i => selectedIds.has(i.id));
    
    items.forEach(item => {
        if (allChecked) selectedIds.delete(item.id);
        else selectedIds.add(item.id);
    });
    
    renderList(filteredConversations);
  }

  function handleSelectAll() {
    const allChecked = filteredConversations.every(item => selectedIds.has(item.id));
    
    filteredConversations.forEach(item => {
        if (allChecked) selectedIds.delete(item.id);
        else selectedIds.add(item.id);
    });
    
    renderList(filteredConversations);
  }

  function updateFooterState() {
    const count = selectedIds.size;
    const btn = document.getElementById('cm-del-btn');
    const selBtn = document.getElementById('cm-sel-all');
    
    btn.textContent = count > 0 ? `删除 ${count} 条` : '删除选中';
    btn.disabled = count === 0;
    
    const currentViewCount = filteredConversations.length;
    const isCurrentViewAllChecked = currentViewCount > 0 && filteredConversations.every(item => selectedIds.has(item.id));
    
    selBtn.textContent = isCurrentViewAllChecked ? '取消本页' : '全选本页';
  }

  async function handleBatchDelete() {
    const count = selectedIds.size;
    if (count === 0 || !confirm(`⚠️ 警告：确定要永久删除这 ${count} 条对话吗？\n此操作不可恢复！`)) return;

    const btn = document.getElementById('cm-del-btn');
    btn.disabled = true;

    const idsToDelete = Array.from(selectedIds);
    let success = 0;

    for (let i = 0; i < idsToDelete.length; i++) {
      const id = idsToDelete[i];
      btn.textContent = `删除中 ${i+1}/${count}`;
      
      try {
        await deleteConversationAPI(id);
        success++;
        
        const row = document.querySelector(`.cm-item[data-id="${id}"]`);
        if (row) {
            row.classList.add('deleted');
            row.querySelector('.cm-checkbox').checked = false;
        }
        
        selectedIds.delete(id);
      } catch (e) {
        console.error(e);
      }
      await new Promise(r => setTimeout(r, 100)); 
    }

    allConversations = allConversations.filter(c => !idsToDelete.includes(c.id) || selectedIds.has(c.id));
    
    btn.textContent = `完成！成功删除 ${success} 条`;
    setTimeout(() => {
        btn.textContent = '删除选中';
        handleSearch({target: {value: document.getElementById('cm-search').value}});
    }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createUI);
  } else {
    createUI();
  }

})();