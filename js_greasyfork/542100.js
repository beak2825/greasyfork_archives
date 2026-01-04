// ==UserScript==
// @name         小红书笔记勾选收藏 (终极优化版)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  [终极优化] 高性能、秒加载！给小红书笔记增加勾选功能，并在右侧用Handsontable表格显示已选笔记。
// @author       qjj
// @match        https://www.xiaohongshu.com/*
// @require      https://cdn.jsdelivr.net/npm/handsontable@15.3.0/dist/handsontable.full.min.js
// @resource     HOT_CSS https://cdn.bootcdn.net/ajax/libs/handsontable/15.2.0/handsontable.full.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-idle
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/542100/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%AC%94%E8%AE%B0%E5%8B%BE%E9%80%89%E6%94%B6%E8%97%8F%20%28%E7%BB%88%E6%9E%81%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542100/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%AC%94%E8%AE%B0%E5%8B%BE%E9%80%89%E6%94%B6%E8%97%8F%20%28%E7%BB%88%E6%9E%81%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- 1. 立即注入CSS ---
  const hotCss = GM_getResourceText('HOT_CSS');
  GM_addStyle(hotCss);
  GM_addStyle(`

 /* --- 方案一：精致对勾动画 --- */


.xhs-checkbox {
    /* 移除原生input外观 */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    /* 基础样式 */
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 100;
    cursor: pointer;

    /* 尺寸和形状 */
    width: 22px;
    height: 22px;
    border-radius: 50%; /* 圆形 */
    border: 2px solid rgba(0, 0, 0, 0.2); /* 默认边框 */
    background-color: rgba(255, 255, 255, 0.7); /* 半透明背景 */

    /* 过渡动画 */
    transition: all 0.2s ease-in-out;
}



/* 选中状态的样式 */
.xhs-checkbox.checked {
    background-color: #ff2442; /* 小红书红色 */
    border-color: #ff2442;
}

/* 使用 ::after 伪元素来创建“对勾” */
.xhs-checkbox.checked::after {
    content: '';
    position: absolute;
    left: 7px;
    top: 3px;

    /* 对勾的形状 */
    width: 6px;
    height: 12px;
    border: solid white;
    border-width: 0 3px 3px 0;

    /* 旋转和动画 */
    transform: rotate(45deg);
    animation: checkmark-animation 0.2s ease-in-out forwards;
}

/* 对勾出现的动画 */
@keyframes checkmark-animation {
    0% {
        height: 0;
        width: 0;
        opacity: 0;
    }
    50% {
        height: 0;
        width: 6px; /* 先画短边 */
        opacity: 0.5;
    }
    100% {
        height: 12px; /* 再画长边 */
        width: 6px;
        opacity: 1;
    }
}

    .xhs-note-card { position: relative; }
    .hot-table-wrapper {
        position: fixed; top: 60px; right: 0px; width: 700px;
        height: calc(100vh - 120px); background-color: white; z-index: 9999;
        border-radius: 8px 0 0 8px; box-shadow: -2px 0 10px rgba(0,0,0,0.1);
        transition: right 0.3s ease; overflow: hidden; display: flex; flex-direction: column;
    }
    .hot-table-wrapper.minimized { height: 40px !important; overflow: hidden; }
    .hot-table-header {
        padding: 12px 16px; background-color: #ff2442; color: white;
        font-weight: bold; display: flex; justify-content: space-between; align-items: center;
    }
    .hot-table-btns span {
        color: white; cursor: pointer; font-size: 12px; padding: 4px 8px;
        border-radius: 4px; transition: background-color 0.2s; margin-left: 10px;
    }
    .hot-table-btns span:hover { background-color: rgba(255,255,255,0.2); }
    .hot-table-toggle {
        position: absolute; left: -40px; top: 20px; width: 40px; height: 40px;
        background-color: #ff2442; color: white; border-radius: 8px 0 0 8px;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; box-shadow: -2px 2px 5px rgba(0,0,0,0.1);
    }
    .hot-table-content { flex: 1; overflow-y: auto; padding: 0; }
    .hot-empty-state { text-align: center; padding: 30px 0; color: #999; }
    .hot-delete-btn {
        background: none; border: none; color: #ff2442; cursor: pointer;
        font-size: 14px; padding: 4px 8px; border-radius: 4px; transition: all 0.2s;
    }
    .hot-delete-btn:hover { background-color: #ff2442; color: white; transform: scale(1.1); }
    .hot-table-wrapper .handsontable .htCore th { background-color: #f8f9fa; font-weight: bold; text-align: center; }
    .hot-table-wrapper .handsontable .htCore td { vertical-align: middle; }
    .hot-pagination {
        display: flex; justify-content: space-between; align-items: center;
        padding: 10px 16px; background-color: #f8f9fa; border-top: 1px solid #dee2e6;
    }
    .page-info { font-size: 14px; color: #666; }
    .page-controls { display: flex; gap: 8px; }
    .page-btn {
        padding: 6px 12px; border: 1px solid #ddd; background-color: white; color: #333;
        border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.2s;
    }
    .page-btn:hover:not(:disabled) { background-color: #ff2442; color: white; border-color: #ff2442; }
    .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .page-btn.active { background-color: #ff2442; color: white; border-color: #ff2442; }
  `);

  // --- 2. 立即注册中文语言包 ---
  if (window.Handsontable && window.Handsontable.languages) {
    window.Handsontable.languages.registerLanguageDictionary('zh-CN', {
      language: 'zh-CN',
      dictionary: {
        'Copy': '复制', 'Cut': '剪切', 'Paste': '粘贴', 'Undo': '撤销', 'Redo': '重做',
        'Insert row above': '在上方插入行', 'Insert row below': '在下方插入行', 'Remove row': '删除行',
        'Insert column left': '在左侧插入列', 'Insert column right': '在右侧插入列', 'Remove column': '删除列',
        'Clear column': '清空列', 'Select all': '全选', 'No data available': '暂无数据'
        // ... (可以添加更多翻译)
      }
    });
  }

  // --- 全局变量 ---
  let selectedNotes = [];
  let currentPage = 0;
  const pageSize = 20;
  let hot = null;

  // --- IndexedDB 存储封装 ---
  const indexedDBStorage = {
    dbName: "XHSNotesDB",
    storeName: "notes",
    version: 3,
    _db: null,
    async openDB() {
      if (this._db) return this._db;
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: "id" });
          }
        };
        request.onsuccess = (event) => {
          this._db = event.target.result;
          resolve(this._db);
        };
        request.onerror = (event) => reject(event.target.error);
      });
    },
    async addNote(note) { const db = await this.openDB(); return new Promise((resolve, reject) => { const tx = db.transaction(this.storeName, "readwrite"); tx.objectStore(this.storeName).add(note).onsuccess = () => resolve(note); tx.onerror = (e) => reject(e.target.error); }); },
    async deleteNote(noteId) { const db = await this.openDB(); return new Promise((resolve, reject) => { const tx = db.transaction(this.storeName, "readwrite"); tx.objectStore(this.storeName).delete(noteId).onsuccess = resolve; tx.onerror = (e) => reject(e.target.error); }); },
    async getAllNotes() { const db = await this.openDB(); return new Promise((resolve) => { const tx = db.transaction(this.storeName, "readonly"); tx.objectStore(this.storeName).getAll().onsuccess = (e) => resolve(e.target.result); tx.onerror = () => resolve([]); }); },
    async updateNote(note) { const db = await this.openDB(); return new Promise((resolve, reject) => { const tx = db.transaction(this.storeName, "readwrite"); tx.objectStore(this.storeName).put(note).onsuccess = () => resolve(note); tx.onerror = (e) => reject(e.target.error); }); },
    async clearAllNotes() { const db = await this.openDB(); return new Promise((resolve, reject) => { const tx = db.transaction(this.storeName, "readwrite"); tx.objectStore(this.storeName).clear().onsuccess = resolve; tx.onerror = (e) => reject(e.target.error); }); }
  };

  // --- UI & 表格核心函数 ---
  function createHotTableWrapper() {
    let wrapper = document.querySelector('.hot-table-wrapper');
    if (wrapper) return wrapper;
    wrapper = document.createElement('div');
    wrapper.className = 'hot-table-wrapper';
    wrapper.innerHTML = `
      <div class="hot-table-toggle">≡</div>
      <div class="hot-table-header">
        已选笔记 (<span class="note-count">0</span>)
        <div class="hot-table-btns">
          <span class="click-all" title="勾选当前页面所有可见笔记">全选当前页</span>
          <span class="delete-selected" title="删除表格中高亮选中的行">删除选中</span>
          <span class="download-btn" title="将所有已选笔记数据下载为Excel文件">下载数据</span>
          <span class="paste-btn" title="从剪贴板粘贴数据到“账号”列">粘贴数据</span>
          <span class="minimize-btn" title="最小化">—</span>
          <span class="restore-btn" title="恢复">+</span>
          <span class="clear-all" title="清空所有已选笔记和数据">清空</span>
        </div>
      </div>
      <div class="hot-table-content">
        <div id="hot-table"></div>
        <div class="hot-pagination">
          <span class="page-info">第 <span class="current-page">1</span> 页 / 共 <span class="total-pages">1</span> 页</span>
          <div class="page-controls">
            <button class="page-btn" data-action="first">首页</button>
            <button class="page-btn" data-action="prev">上一页</button>
            <button class="page-btn" data-action="next">下一页</button>
            <button class="page-btn" data-action="last">末页</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrapper);

    // 事件绑定
    wrapper.querySelector('.hot-table-toggle').addEventListener('click', () => wrapper.classList.toggle('open'));
    wrapper.querySelector('.minimize-btn').addEventListener('click', () => wrapper.classList.add('minimized'));
    wrapper.querySelector('.restore-btn').addEventListener('click', () => wrapper.classList.remove('minimized'));
    wrapper.querySelector('.clear-all').addEventListener('click', clearAllNotes);
    wrapper.querySelector('.click-all').addEventListener('click', selectAllVisibleNotes);
    wrapper.querySelector('.delete-selected').addEventListener('click', deleteSelectedHotRows);
    wrapper.querySelector('.download-btn').addEventListener('click', downloadAllData);
    wrapper.querySelector('.paste-btn').addEventListener('click', handlePasteData);
    wrapper.querySelectorAll('.page-btn').forEach(btn => btn.addEventListener('click', handlePageChange));
    return wrapper;
  }

  function renderHotTable() {
    const container = document.getElementById('hot-table');
    if (!container) return;

    const currentPageData = getCurrentPageData();

    if (hot) {
      hot.loadData(currentPageData);
    } else {
      hot = new Handsontable(container, {
        data: currentPageData,
        colHeaders: ['封面', '标题', '作者', '账号', '商品', '操作'],
        columns: [
          { data: 'cover', renderer: (instance, td, row, col, prop, value) => { td.innerHTML = `<img src="${value}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;">`; }, readOnly: true, width: 60 },
          { data: 'title', readOnly: true, width: 180 },
          { data: 'author', readOnly: true, width: 100 },
          { data: 'account', width: 100 },
          { data: 'product', width: 100 },
          { data: 'id', renderer: (instance, td, row, col, prop, value) => { td.innerHTML = `<button class="hot-delete-btn" title="删除此行" data-note-id="${value}">🗑️</button>`; td.style.textAlign = 'center'; }, readOnly: true, width: 60 }
        ],
        stretchH: 'all', width: '100%', height: '100%', licenseKey: 'non-commercial-and-evaluation',
        rowHeights: 44, manualRowResize: true, manualColumnResize: true, wordWrap: false,
        language: 'zh-CN',
        afterChange: async (changes, source) => {
          if (source === 'loadData' || !changes) return;
          for (const [rowIndex, prop, oldVal, newVal] of changes) {
            if (oldVal !== newVal) {
              const actualIndex = currentPage * pageSize + rowIndex;
              if (selectedNotes[actualIndex]) {
                selectedNotes[actualIndex][prop] = newVal;
                await indexedDBStorage.updateNote(selectedNotes[actualIndex]);
              }
            }
          }
        },
        afterOnCellMouseDown: (event, coords) => {
          if (coords.col === 5 && event.target.classList.contains('hot-delete-btn')) {
            const noteId = event.target.dataset.noteId;
            deleteNoteById(noteId);
          }
        },
      });
    }
    updateNoteCount();
    updatePagination();
  }

  // --- 数据与状态更新函数 ---
  function getCurrentPageData() { return selectedNotes.slice(currentPage * pageSize, (currentPage + 1) * pageSize); }
  function updateNoteCount() { const el = document.querySelector('.note-count'); if (el) el.textContent = selectedNotes.length; }
  function updateCheckboxState(noteId, isChecked) {
    const checkbox = document.querySelector(`.xhs-checkbox[data-id="${noteId}"]`);
    if (checkbox) {
        checkbox.checked = isChecked;
        checkbox.classList.toggle('checked', isChecked);
    }
  }

  // --- 分页逻辑 ---
  function updatePagination() {
    const wrapper = document.querySelector('.hot-table-wrapper');
    if (!wrapper) return;
    const totalPages = Math.ceil(selectedNotes.length / pageSize) || 1;
    wrapper.querySelector('.current-page').textContent = currentPage + 1;
    wrapper.querySelector('.total-pages').textContent = totalPages;
    wrapper.querySelectorAll('.page-btn').forEach(btn => {
      const action = btn.dataset.action;
      btn.disabled = (action === 'first' || action === 'prev') ? currentPage === 0 : currentPage >= totalPages - 1;
    });
  }

  function handlePageChange(e) {
    const action = e.target.dataset.action;
    const totalPages = Math.ceil(selectedNotes.length / pageSize) || 1;
    const oldPage = currentPage;
    switch (action) {
      case 'first': currentPage = 0; break;
      case 'prev': currentPage = Math.max(0, currentPage - 1); break;
      case 'next': currentPage = Math.min(totalPages - 1, currentPage + 1); break;
      case 'last': currentPage = totalPages - 1; break;
    }
    if (oldPage !== currentPage) renderHotTable();
  }

  // --- 核心交互逻辑 ---
  async function toggleNoteSelection(e) {
    e.stopPropagation(); e.preventDefault();
    const checkbox = e.currentTarget;
    const note = {
      id: checkbox.dataset.id, title: checkbox.dataset.title, author: checkbox.dataset.author,
      cover: checkbox.dataset.cover, href: checkbox.dataset.href, account: '', product: '', isUse: 0
    };
    const isCurrentlyChecked = checkbox.classList.contains('checked');

    try {
      if (isCurrentlyChecked) {
        await indexedDBStorage.deleteNote(note.id);
        selectedNotes = selectedNotes.filter(n => n.id !== note.id);
      } else {
        await indexedDBStorage.addNote(note);
        selectedNotes.push(note);
      }
      updateCheckboxState(note.id, !isCurrentlyChecked);
      renderHotTable();
    } catch (error) { console.error('切换笔记选中状态失败:', error); alert('操作失败，请重试！'); }
  }

  async function deleteNoteById(noteId) {
    const note = selectedNotes.find(n => n.id === noteId);
    if (note && confirm(`确定要删除笔记 "${note.title}" 吗？`)) {
      try {
        await indexedDBStorage.deleteNote(noteId);
        selectedNotes = selectedNotes.filter(n => n.id !== noteId);
        const totalPages = Math.ceil(selectedNotes.length / pageSize);
        if (currentPage >= totalPages && currentPage > 0) currentPage = totalPages - 1;
        renderHotTable();
        updateCheckboxState(noteId, false);
      } catch (error) { console.error('删除笔记失败:', error); alert('删除失败，请重试！'); }
    }
  }

  async function deleteSelectedHotRows() {
    if (!hot) return;
    const selectedRanges = hot.getSelected();
    if (!selectedRanges || selectedRanges.length === 0) return alert('请先在表格中选择要删除的行！');

    const rowsToDelete = new Set();
    selectedRanges.forEach(range => {
      for (let i = Math.min(range[0], range[2]); i <= Math.max(range[0], range[2]); i++) {
        rowsToDelete.add(i);
      }
    });

    if (confirm(`确定要删除表格中选中的 ${rowsToDelete.size} 行笔记吗？`)) {
        const noteIdsToDelete = Array.from(rowsToDelete).map(rowIndex => getCurrentPageData()[rowIndex]?.id).filter(Boolean);
        for (const noteId of noteIdsToDelete) {
            await indexedDBStorage.deleteNote(noteId);
            updateCheckboxState(noteId, false);
        }
        selectedNotes = selectedNotes.filter(note => !noteIdsToDelete.includes(note.id));
        renderHotTable();
    }
  }

  function selectAllVisibleNotes() {
    document.querySelectorAll('.note-item:not(:has(.xhs-checkbox.checked)) .xhs-checkbox').forEach(cb => cb.click());
  }

  async function clearAllNotes() {
    if (confirm("警告：此操作将永久清空所有已选笔记数据，无法恢复！\n\n确定要继续吗？")) {
      await indexedDBStorage.clearAllNotes();
      selectedNotes = [];
      currentPage = 0;
      renderHotTable();
      document.querySelectorAll('.xhs-checkbox.checked').forEach(cb => updateCheckboxState(cb.dataset.id, false));
    }
  }

  async function downloadAllData() {
    if (selectedNotes.length === 0) return alert('暂无数据可下载！');
    try {
      const excelData = selectedNotes.map(note => ({
        '笔记ID': note.id || '', '标题': note.title || '', '作者': note.author || '',
        '封面链接': note.cover || '', '笔记链接': note.href || '', '账号': note.account || '',
        '商品': note.product || '', '使用状态': note.isUse || "未使用",
        '导出时间': new Date().toISOString()
      }));
      const csvContent = [
        Object.keys(excelData[0]).join(','),
        ...excelData.map(row => Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `小红书笔记数据_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) { console.error('下载数据失败:', error); alert('下载失败: ' + error.message); }
  }

  async function handlePasteData() {
    try {
      const text = await navigator.clipboard.readText();
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length === 0) return;

      const currentPageData = getCurrentPageData();
      for (let i = 0; i < Math.min(lines.length, currentPageData.length); i++) {
        const actualIndex = currentPage * pageSize + i;
        if (selectedNotes[actualIndex]) {
            selectedNotes[actualIndex].account = lines[i].trim();
            await indexedDBStorage.updateNote(selectedNotes[actualIndex]);
        }
      }
      renderHotTable();
    } catch (error) { alert('粘贴数据失败: ' + error.message); }
  }

  // --- DOM 观察与动态添加 ---
  function addCheckboxToCard(card) {
      if (card.querySelector('.xhs-checkbox')) return;
      const link = card.querySelector('a + a[href*="/user/"]');
      const noteId = link?.href.split("/").pop().split("?")[0];
      if (noteId) {
          const title = card.querySelector('[class*="title"]')?.textContent.trim() || card.querySelector('img')?.alt || '未知标题';
          const author = card.querySelector('[class*="author-name"]')?.textContent.trim() || '未知作者';
          const cover = card.querySelector('img')?.src;
          const href = link.href;

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'xhs-checkbox';
          Object.assign(checkbox.dataset, { id: noteId, title, author, cover, href });

          checkbox.checked = selectedNotes.some(note => note.id === noteId);
          checkbox.classList.toggle('checked', checkbox.checked);

          checkbox.addEventListener('click', toggleNoteSelection);


        checkbox.addEventListener('mouseenter', (e) => {
            e.stopPropagation(); // 阻止 mouseenter 事件冒泡到父级卡片
        });

        checkbox.addEventListener('mouseleave', (e) => {
            e.stopPropagation(); // 阻止 mouseleave 事件冒泡到父级卡片
        });


          card.classList.add('xhs-note-card');
          card.appendChild(checkbox);
      }
  }

  function setupMutationObserver() {
    const observerCallback = (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // 确保是元素节点
              if (node.matches('.note-item')) addCheckboxToCard(node);
              else node.querySelectorAll('.note-item').forEach(addCheckboxToCard);
            }
          });
        }
      }
    };
    const observer = new MutationObserver(observerCallback);
    const intervalId = setInterval(() => {
      const targetNode = document.querySelector('#exploreFeeds,.feeds-container, .note-list-container, .content-container');
      if (targetNode) {
        clearInterval(intervalId);
        observer.observe(targetNode, { childList: true, subtree: true });
        // 首次加载时，也处理一下已存在的笔记
        targetNode.querySelectorAll('.note-item').forEach(addCheckboxToCard);
      }
    }, 500);
    setTimeout(() => clearInterval(intervalId), 15000); // 15秒后超时
  }

  // --- 初始化函数 ---
  async function init() {
    console.log('小红书助手脚本 v1.0 初始化...');
    const notesPromise = indexedDBStorage.getAllNotes();
    createHotTableWrapper();
    setupMutationObserver();
    selectedNotes = await notesPromise;
    console.log(`从IndexedDB加载了 ${selectedNotes.length} 条笔记`);
    renderHotTable();
    console.log('脚本初始化完毕。');
  }

  init();

})();
