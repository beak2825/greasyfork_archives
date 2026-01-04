// ==UserScript==
// @name         GreasyFork 脚本过滤器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  根据标题关键字过滤 GreasyFork 脚本，并提供侧边栏管理过滤器，支持导入导出关键字txt文件
// @author       Yourname
// @match        https://greasyfork.org/zh-CN/scripts*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537740/GreasyFork%20%E8%84%9A%E6%9C%AC%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/537740/GreasyFork%20%E8%84%9A%E6%9C%AC%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 等待 DOM 元素加载完成
  function waitForElement(selector, callback) {
    const el = document.querySelector(selector);
    if (el) return callback(el);
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        callback(el);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  waitForElement('.script-list', initFilterUI);

  function initFilterUI() {
    const savedKeywords = JSON.parse(localStorage.getItem('gf_filter_keywords') || '[]');
    let keywords = savedKeywords;

    const sidebar = document.createElement('div');
    sidebar.id = 'gf-filter-sidebar';
    sidebar.innerHTML = `
  <h2>关键词过滤器</h2>
  <div id="input-container">
    <input id="new-keyword" type="text" placeholder="添加关键字">
    <label style="font-size: 12px; margin-left: 6px;">
      <input type="checkbox" id="case-sensitive"> 区分大小写
    </label>
    <button id="add-btn">添加</button>
  </div>
  <ul id="keyword-list"></ul>
  <div id="bottom-buttons" style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; gap: 10px; flex-wrap: wrap;">
    <div style="display: flex; gap: 10px;">
      <button id="delete-selected-btn" style="background: #d9534f; color: white; border-radius: 4px; padding: 6px 10px; border: none; cursor: pointer;">删除已选中</button>
      <button id="delete-all-btn" style="background: #c9302c; color: white; border-radius: 4px; padding: 6px 10px; border: none; cursor: pointer;">删除所有</button>
    </div>
    <div style="display: flex; gap: 10px;">
      <button id="export-btn" style="background: #007bff; color: white; border: none; border-radius: 4px; padding: 6px 10px; cursor: pointer;">导出关键字</button>
      <button id="import-btn" style="background: #28a745; color: white; border: none; border-radius: 4px; padding: 6px 10px; cursor: pointer;">导入关键字</button>
      <input type="file" id="import-file" accept=".txt" style="display:none">
    </div>
  </div>
`;
      // 添加“删除所有关键字”按钮事件
sidebar.querySelector('#delete-all-btn').addEventListener('click', () => {
  if (confirm('确定要删除所有关键字吗？此操作不可撤销！')) {
    keywords = [];
    saveKeywords();
    renderKeywords();
    applyFilter();
  }
});
    document.body.appendChild(sidebar);

    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'gf-filter-toggle';
    toggleBtn.innerText = '☰';
    document.body.appendChild(toggleBtn);

    const style = document.createElement('style');
    style.textContent = `
      #gf-filter-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 220px;
        max-width: 80vw;
        background: #ffffff;
        box-shadow: 2px 0 8px rgba(0,0,0,0.2);
        padding: 16px;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 9999;
        font-family: sans-serif;
        overflow-y: auto;
      }
      #gf-filter-sidebar.open {
        transform: translateX(0);
      }
      #gf-filter-toggle {
        position: fixed;
        top: 900px;
        left: 0;
        width: 40px;
        height: 40px;
        background: #007acc;
        color: white;
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        z-index: 10000;
        transition: background 0.3s;
      }
      #gf-filter-toggle:hover {
        background: #005fa3;
      }
      #input-container {
        position: sticky;
        top: 0;
        background: white;
        padding-bottom: 10px;
        z-index: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
        border-bottom: 1px solid #ddd;
        margin-bottom: 10px;
      }
      #input-container input[type="text"] {
        flex: 1;
        padding: 4px 6px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      #input-container button {
        padding: 4px 8px;
        background: #28a745;
        border: none;
        color: white;
        border-radius: 4px;
        cursor: pointer;
      }
      #keyword-list {
        list-style: none;
        padding: 0;
        margin: 0;
        max-height: calc(100vh - 260px);
        overflow-y: auto;
      }
      #keyword-list li {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 0;
        border-bottom: 1px dashed #ddd;
        font-size: 14px;
      }
      #keyword-list .remove-btn {
        margin-left: auto;
        background: transparent;
        border: none;
        color: #d00;
        cursor: pointer;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);

    function renderKeywords() {
      const list = sidebar.querySelector('#keyword-list');
      list.innerHTML = '';
      keywords.forEach((keyword, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <input type="checkbox" class="keyword-checkbox" data-index="${index}">
          <span class="keyword-text" title="${keyword.text}">${keyword.text}${keyword.caseSensitive ? ' (区分大小写)' : ''}</span>
          <button class="remove-btn" data-index="${index}">✕</button>
        `;
        list.appendChild(li);
      });

      list.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = Number(btn.dataset.index);
          keywords.splice(index, 1);
          saveKeywords();
          renderKeywords();
          applyFilter();
        });
      });
    }

    function saveKeywords() {
      localStorage.setItem('gf_filter_keywords', JSON.stringify(keywords));
    }

    function applyFilter() {
      const items = document.querySelectorAll('.script-list li');
      items.forEach(item => {
        const titleEl = item.querySelector('h2 a');
        if (!titleEl) return;
        const title = titleEl.textContent;
        const hidden = keywords.some(k => {
          return k.caseSensitive
            ? title.includes(k.text)
            : title.toLowerCase().includes(k.text.toLowerCase());
        });
        item.style.display = hidden ? 'none' : '';
      });
    }

    sidebar.querySelector('#add-btn').addEventListener('click', () => {
      const input = sidebar.querySelector('#new-keyword');
      const checkbox = sidebar.querySelector('#case-sensitive');
      const text = input.value.trim();
      const caseSensitive = checkbox.checked;
      if (text && !keywords.some(k => k.text === text && k.caseSensitive === caseSensitive)) {
        keywords.push({ text, caseSensitive });
        saveKeywords();
        renderKeywords();
        applyFilter();
        input.value = '';
        checkbox.checked = false;
      }
    });

    sidebar.querySelector('#new-keyword').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        sidebar.querySelector('#add-btn').click();
      }
    });

    sidebar.querySelector('#delete-selected-btn').addEventListener('click', () => {
      const checkedBoxes = sidebar.querySelectorAll('.keyword-checkbox:checked');
      if (checkedBoxes.length === 0) return;
      const toDeleteIndices = Array.from(checkedBoxes).map(box => Number(box.dataset.index));
      toDeleteIndices.sort((a, b) => b - a).forEach(i => keywords.splice(i, 1));
      saveKeywords();
      renderKeywords();
      applyFilter();
    });

    // 导出关键字
    sidebar.querySelector('#export-btn').addEventListener('click', () => {
      if (keywords.length === 0) {
        alert('没有关键字可导出！');
        return;
      }
      // 每行：关键字\t区分大小写(true/false)
      const content = keywords.map(k => `${k.text}\t${k.caseSensitive}`).join('\n');
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'gf_filter_keywords.txt';
      a.click();
      URL.revokeObjectURL(url);
    });

    // 导入关键字
    const importFileInput = sidebar.querySelector('#import-file');
    sidebar.querySelector('#import-btn').addEventListener('click', () => {
      importFileInput.value = null;
      importFileInput.click();
    });

    importFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target.result;
        // 按行解析，每行格式：关键字\t区分大小写(true/false)
        const lines = text.split(/\r?\n/);
        let addedCount = 0;
        lines.forEach(line => {
          const [word, cs] = line.split('\t');
          if (word && cs) {
            const caseSensitive = cs.trim().toLowerCase() === 'true';
            if (!keywords.some(k => k.text === word && k.caseSensitive === caseSensitive)) {
              keywords.push({ text: word, caseSensitive });
              addedCount++;
            }
          }
        });
        if (addedCount > 0) {
          saveKeywords();
          renderKeywords();
          applyFilter();
          alert(`成功导入 ${addedCount} 条关键字`);
        } else {
          alert('没有导入任何新关键字');
        }
      };
      reader.readAsText(file);
    });

    toggleBtn.addEventListener('click', e => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });

    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });

    renderKeywords();
    applyFilter();
  }
})();
