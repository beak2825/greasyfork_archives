// ==UserScript==
// @name         Nginx Autoindex 智能美化 + 搜索
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动识别 Nginx autoindex 页面并格式化显示完整文件名与下载链接，支持模糊搜索
// @author       凡雲
// @match        http://*/*
// @match        https://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539062/Nginx%20Autoindex%20%E6%99%BA%E8%83%BD%E7%BE%8E%E5%8C%96%20%2B%20%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/539062/Nginx%20Autoindex%20%E6%99%BA%E8%83%BD%E7%BE%8E%E5%8C%96%20%2B%20%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const h1 = document.querySelector('body > h1');
  const pre = document.querySelector('pre');
  if (!h1 || !pre) return;

  const isNginxIndexPage = h1.textContent.trim().startsWith('Index of /');
  if (!isNginxIndexPage) return;

  const links = [...pre.querySelectorAll('a')];
  const files = links.filter(a => !a.getAttribute('href').endsWith('/../'));

  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    table tbody tr:hover {
      background-color: #f0f8ff;
    }
    .icon-cell {
      width: 40px;
      text-align: center;
      font-size: 18px;
    }
    .filename-cell {
      font-family: monospace;
    }
    .download-button {
      padding: 4px 10px;
      font-size: 14px;
      border: 1px solid #3a87ad;
      border-radius: 4px;
      background-color: #3a87ad;
      color: white;
      cursor: pointer;
    }
    .download-button:hover {
      background-color: #2d6a8c;
    }
  `;
  document.head.appendChild(style);

  // 搜索框
  const searchBox = document.createElement('input');
  searchBox.type = 'text';
  searchBox.placeholder = '搜索文件名...';
  searchBox.style.width = '300px';
  searchBox.style.margin = '10px 0';
  searchBox.style.padding = '6px';
  searchBox.style.fontSize = '16px';
  searchBox.style.border = '1px solid #ccc';
  searchBox.style.borderRadius = '6px';
  document.body.insertBefore(searchBox, pre);

  // 表格
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.innerHTML = `
    <thead>
      <tr>
        <th class="icon-cell"></th>
        <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ccc;">文件名</th>
        <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ccc;">操作</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');

  function renderTable(filter = '') {
    tbody.innerHTML = '';
    files.forEach(link => {
      const href = link.getAttribute('href');
      const fullName = decodeURIComponent(href);
      if (!fullName.toLowerCase().includes(filter.toLowerCase())) return;

      const isDirectory = href.endsWith('/');
      const row = document.createElement('tr');
      row.style.cursor = isDirectory ? 'pointer' : 'default';

      const icon = isDirectory ? '📁' : '📄';

      row.innerHTML = `
        <td class="icon-cell">${icon}</td>
        <td class="filename-cell" style="padding: 6px; border-bottom: 1px solid #eee;">${fullName}</td>
        <td style="padding: 6px; border-bottom: 1px solid #eee;">
          ${isDirectory ? '' : `<button class="download-button">下载</button>`}
        </td>
      `;

      if (isDirectory) {
        row.addEventListener('click', () => {
          window.location.href = href;
        });
      } else {
        const btn = row.querySelector('.download-button');
        btn?.addEventListener('click', e => {
          e.stopPropagation(); // 防止触发行点击
          const a = document.createElement('a');
          a.href = href;
          a.download = '';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
      }

      tbody.appendChild(row);
    });
  }

  searchBox.addEventListener('input', () => {
    renderTable(searchBox.value);
  });

  pre.replaceWith(table);
  renderTable();
  document.title = '文件下载列表';
})();