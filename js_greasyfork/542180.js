// ==UserScript==
// @name         磁力链接收集栏
// @namespace    https://yourdomain.example.com/
// @version      0.0.3
// @description  磁力链接收集 + 实时同步 + 回退 + 清空 + 美观按钮 + 元素内嵌 + 导出txt/json
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @run-at       document-end
// @author       andychai
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542180/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E6%94%B6%E9%9B%86%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/542180/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E6%94%B6%E9%9B%86%E6%A0%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'magnet_collector_links';

  const panel = document.createElement('div');
  panel.id = 'magnet-collection-bar';
  panel.innerHTML = `
    <div id="magnet-header">
      <span id="magnet-header-title">磁力收集栏 (<span id="magnet-count">0</span>)</span>
      <div>
        <button id="magnet-toggle-btn">–</button>
        <button id="magnet-close-btn">✕</button>
      </div>
    </div>
    <div id="magnet-body">
      <div id="magnet-list"></div>
      <button id="copy-btn">复制</button>
      <button id="undo-btn">↩ 回退</button>
      <button id="clear-btn">清空</button>
      <button id="export-txt-btn">导出txt</button>
      <button id="export-json-btn">导出json</button>
    </div>
  `;
  panel.style.display = 'none';
  document.body.appendChild(panel);

  const countSpan = document.getElementById('magnet-count');
  const listDiv = document.getElementById('magnet-list');
  const toggleBtn = document.getElementById('magnet-toggle-btn');
  const closeBtn = document.getElementById('magnet-close-btn');
  const copyBtn = document.getElementById('copy-btn');
  const clearBtn = document.getElementById('clear-btn');
  const undoBtn = document.getElementById('undo-btn');
  const exportTxtBtn = document.getElementById('export-txt-btn');
  const exportJsonBtn = document.getElementById('export-json-btn');

  let collectedLinks = [];

  async function loadLinks(syncToDOM = true) {
    const saved = await GM_getValue(STORAGE_KEY, []);
    collectedLinks = Array.isArray(saved) ? saved : [];
    if (syncToDOM) {
      listDiv.innerHTML = '';
      collectedLinks.forEach(addToListDOM);
      updateCount();
      panel.style.display = collectedLinks.length > 0 ? 'block' : 'none';
    }
  }

  function saveLinks() {
    GM_setValue(STORAGE_KEY, collectedLinks);
  }

  function addToListDOM(link) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'magnet-link-item';
    itemDiv.textContent = link;
    listDiv.appendChild(itemDiv);
  }

  function updateCount() {
    countSpan.textContent = collectedLinks.length;
  }

  function insertInlineButtons() {
    let hasMagnet = false;
    const anchors = document.querySelectorAll('a[href^="magnet:?"]');
    anchors.forEach(anchor => {
      const href = anchor.href || anchor.textContent;
      if (!href.startsWith('magnet:?')) return;
      hasMagnet = true;
      if (anchor.nextSibling?.classList?.contains('magnet-collect-btn')) return;

      const btn = document.createElement('button');
      btn.textContent = '📥 收集';
      btn.className = 'magnet-collect-btn';
      btn.type = 'button';

      if (collectedLinks.includes(href)) {
        btn.disabled = true;
        btn.textContent = '✅ 已收集';
      }

      btn.addEventListener('click', () => {
        if (!collectedLinks.includes(href)) {
          collectedLinks.push(href);
          addToListDOM(href);
          updateCount();
          saveLinks();
          panel.style.display = 'block';
          btn.textContent = '✅ 已收集';
          btn.disabled = true;
        }
      });

      anchor.insertAdjacentElement('afterend', btn);
    });
    if (!hasMagnet && collectedLinks.length === 0) {
      panel.style.display = 'none';
    }
  }

  toggleBtn.onclick = () => {
    panel.classList.toggle('collapsed');
    toggleBtn.textContent = panel.classList.contains('collapsed') ? '+' : '–';
  };

  closeBtn.onclick = () => {
    panel.style.display = 'none';
  };

  copyBtn.onclick = () => {
    if (collectedLinks.length === 0) return;
    GM_setClipboard(collectedLinks.join('\n'), 'text');
  };

  clearBtn.onclick = () => {
    collectedLinks = [];
    listDiv.innerHTML = '';
    updateCount();
    saveLinks();
    panel.style.display = 'none';
  };

  undoBtn.onclick = () => {
    if (collectedLinks.length === 0) return;
    collectedLinks.pop();
    listDiv.removeChild(listDiv.lastChild);
    updateCount();
    saveLinks();
    if (collectedLinks.length === 0) panel.style.display = 'none';
  };

  exportTxtBtn.onclick = () => {
    if (collectedLinks.length === 0) return;
    const content = collectedLinks.join('\n');
    downloadFile('磁力链接.txt', content, 'text/plain');
  };

  exportJsonBtn.onclick = () => {
    if (collectedLinks.length === 0) return;
    const content = JSON.stringify(collectedLinks, null, 2);
    downloadFile('磁力链接.json', content, 'application/json');
  };

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  GM_addValueChangeListener(STORAGE_KEY, async (name, oldVal, newVal, remote) => {
    if (remote) await loadLinks(true);
  });

  insertInlineButtons();
  loadLinks();

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) insertInlineButtons();
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  GM_addStyle(`
    #magnet-collection-bar {
      position: fixed !important;
      bottom: 10px;
      right: 10px;
      background: rgba(255,255,255,0.95);
      border: 1px solid #aaa;
      border-radius: 6px;
      font-size: 13px;
      font-family: sans-serif;
      color: #333;
      box-shadow: 0 0 5px rgba(0,0,0,0.2);
      z-index: 2147483647;
      width: 320px;
    }
    #magnet-header {
      background: #eee;
      padding: 5px 10px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #magnet-body {
      padding: 10px;
    }
    #magnet-collection-bar.collapsed #magnet-body {
      display: none;
    }
    #magnet-list {
      max-height: 160px;
      overflow-y: auto;
      margin: 8px 0;
      word-break: break-word;
    }
    .magnet-link-item {
      margin-bottom: 6px;
    }
    .magnet-collect-btn {
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 2px 8px;
      margin-left: 6px;
      font-size: 12px;
      cursor: pointer;
    }
    .magnet-collect-btn:disabled {
      background: #ccc;
      cursor: default;
    }
    #copy-btn, #clear-btn, #undo-btn, #export-txt-btn, #export-json-btn {
      background: #f4f4f4;
      border: 1px solid #aaa;
      border-radius: 4px;
      padding: 3px 6px;
      margin: 3px 4px 3px 0;
      cursor: pointer;
    }
    #magnet-close-btn {
      font-size: 14px;
      font-weight: bold;
      background: none;
      border: none;
      cursor: pointer;
      margin-left: 6px;
    }
  `);
})();
