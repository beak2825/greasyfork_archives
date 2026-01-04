// ==UserScript==
// @license MIT
// @name         Biligame Wiki Audio Collector (Fixed Header + Glass Button)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  提取标题与音频资源，优化UI：固定表头、毛玻璃按钮、白字、标题左对齐等优化样式（iOS风格）
// @author       taku
// @match        https://wiki.biligame.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540290/Biligame%20Wiki%20Audio%20Collector%20%28Fixed%20Header%20%2B%20Glass%20Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540290/Biligame%20Wiki%20Audio%20Collector%20%28Fixed%20Header%20%2B%20Glass%20Button%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 注入样式
  const style = document.createElement('style');
  style.textContent = `
    .tg-container {
      position: fixed;
      top: 12px;
      right: 12px;
      background: #ffffffcc;
      backdrop-filter: blur(10px);
      border: 1px solid #e2e2e2;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      padding: 16px;
      z-index: 9999;
      max-height: 80vh;
      overflow-y: auto;
      min-width: 440px;
      max-width: 600px;
    }

    .tg-audio-table {
      width: 100%;
      border-collapse: collapse;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 13px;
    }

    .tg-audio-table th,
    .tg-audio-table td {
      border: 1px solid #ddd;
      padding: 6px 8px;
    }

    .tg-audio-table th {
      background-color: #f7f7f7;
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 1;
      opacity: 0.5;
    }

    .tg-audio-table td:first-child {
      text-align: left;
    }

    .tg-audio-table td {
      text-align: center;
    }

    .tg-download-btn {
      display: inline-block;
      background-color: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(6px);
      color: white;
      padding: 4px 12px;
      font-size: 12px;
      border-radius: 14px;
      text-decoration: none;
      border: 1px solid rgba(255,255,255,0.3);
      transition: background-color 0.3s;
    }

    .tg-download-btn:hover {
      background-color: rgba(255, 255, 255, 0.35);
    }
  `;
  document.head.appendChild(style);

  // 主逻辑执行
  window.addEventListener('load', function () {
    const container = document.createElement('div');
    container.className = 'tg-container';

    const table = document.createElement('table');
    table.className = 'tg-audio-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>标题</th>
          <th>音频1</th>
          <th>音频2</th>
          <th>音频3</th>
          <th>音频4</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');

    const blocks = document.querySelectorAll('.resp-tabs-container .visible-md.visible-sm.visible-lg');
    blocks.forEach(block => {
      try {
        const titleElem = block.children[0]?.children[0];
        const title = titleElem ? titleElem.innerText.trim() : '（无标题）';

        const audioDivs = block.querySelectorAll('.bikited-audio.default-player');
        const srcs = Array.from(audioDivs).map(div => div.querySelector('audio')?.src || '');

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${title}</td>
          ${[0, 1, 2, 3].map(i => {
            const src = srcs[i] || '';
            return `<td>
                      ${src ? `<a class="tg-download-btn" href="${src}" download target="_blank">下载</a>` : '—'}
                    </td>`;
          }).join('')}
        `;
        tbody.appendChild(row);
      } catch (err) {
        console.error('解析失败：', err);
      }
    });

    container.appendChild(table);
    document.body.appendChild(container);
  });
})();
