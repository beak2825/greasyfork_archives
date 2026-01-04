// ==UserScript==
// @name            E-Hentai上傳圖片排序
// @name:en         E-Hentai Upload Sort
// @namespace       https://greasyfork.org/users/753365
// @version         1.1.3
// @description     幫助上傳圖片到E-hentai的工具
// @description:en  An upload tool for E-hentai
// @author          wxy
// @license         CC-BY-NC-SA-4.0
// @match           *://upld.e-hentai.org/upld/managegallery?ulgid=*
// @match           *://upld.exhentai.org/upld/managegallery?ulgid=*
// @match           *://exhentai.org/stats.php?gid=*
// @grant           none
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/534415/E-Hentai%E4%B8%8A%E5%82%B3%E5%9C%96%E7%89%87%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/534415/E-Hentai%E4%B8%8A%E5%82%B3%E5%9C%96%E7%89%87%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // **新增功能：ExHentai 統計頁面重定向**
  if (window.location.hostname === 'exhentai.org' && window.location.pathname.includes('stats.php')) {
    const newURL = window.location.href.replace('exhentai.org', 'e-hentai.org');
    if (newURL !== window.location.href) {
      console.log(`[Redirect] 正在將 ExHentai 統計頁面重定向至 E-Hentai: ${newURL}`);
      window.location.replace(newURL);
      return; // 立即停止腳本執行，等待重定向
    }
  }
  // 如果不是上傳管理頁面，這裡也停止執行，避免在統計頁面載入後續功能
  if (!window.location.pathname.includes('upld/managegallery')) {
      return;
  }

  // *** 以下為圖片排序功能代碼 ***

  function waitForElement(selector, callback) {
    const el = document.querySelector(selector);
    if (el) return callback(el);
    const observer = new MutationObserver(() => {
      const elNow = document.querySelector(selector);
      if (elNow) {
        observer.disconnect();
        callback(elNow);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

    function parseFilename(name) {
        // 去掉副檔名
        const baseName = name.replace(/\.[^/.]+$/, '');

        // 嘗試找日期（開頭最多三段底線分隔的數字）
        const dateMatch = baseName.match(/^(\d{4})(?:[_\-]?)(\d{1,2})(?:[_\-]?)(\d{1,2})[_\-]/);
        let date = 0;
        let rest = baseName;
        if (dateMatch) {
            const [fullMatch, y, m, d] = dateMatch;
            date = parseInt(`${y.padStart(4, '0')}${m.padStart(2, '0')}${d.padStart(2, '0')}`, 10);
            rest = baseName.slice(fullMatch.length);
        }

        let postID = rest;
        let index = 0;
        let series = 0;

        // 依據第一個底線來切割 Post ID 和 Index
        const firstUnderscoreIndex = rest.indexOf('_');

        if (firstUnderscoreIndex !== -1) {
            // Post ID 是第一個底線前的所有內容
            postID = rest.substring(0, firstUnderscoreIndex);
            // Index 候選是第一個底線後的所有內容
            const indexCandidateStr = rest.substring(firstUnderscoreIndex + 1);

            // 從 Index 候選字串中，從後往前找第一個可解析的數字作為 Index
            const indexParts = indexCandidateStr.split('_');
            for (let i = indexParts.length - 1; i >= 0; i--) {
                const indexStr = indexParts[i];
                const parsedIndex = parseInt(indexStr, 10);

                // 檢查是否是有效的數字，包含 0
                if (!isNaN(parsedIndex) && parsedIndex >= 0) {
                    index = parsedIndex;
                    break;
                }
            }
        }

        // 區分純數字和非純數字 Post ID
        if (/^\d+$/.test(postID)) {
            // 如果 Post ID 是純數字，直接轉成數字以便正確的數值排序
            series = parseInt(postID, 10);
        } else {
            // 如果 Post ID 包含文字，則使用字串哈希值進行分組排序
            series = postID
            .split('')
            .reduce((sum, ch) => sum + ch.charCodeAt(0), postID.length * 100);
        }


        // 【輸出】: 輸出檔名解析結果到 Console
        console.log(`檔名: ${name}`);
        console.log(`  日期: ${date || 0} / PostID: "${postID}" / 索引: ${index}`);

        return { date, series, index, postID };
    }


  function smartSortByDate() {
    console.clear();
    console.log('--- 🔎 依日期排序開始 ---');
    smartSortItems((a, b) => {
      // 依據 Date (新到舊), Series (小到大), Index (小到大) 排序
      if (a.sortKey[0] !== b.sortKey[0]) return b.sortKey[0] - a.sortKey[0];
      if (a.sortKey[1] !== b.sortKey[1]) return a.sortKey[1] - b.sortKey[1];
      return a.sortKey[2] - b.sortKey[2];
    }, '[SmartSort] 排序完成（依日期），請手動點擊 Save Changes', false);
  }

  function smartSortBySeries() {
    console.clear();
    console.log('--- 🔎 依 Post ID 排序開始 (Post ID 降序) ---'); // 標記為降序
    if (typeof submit_reorder === 'function') {
        hide_dropbox();
    } else {
        console.warn('⚠️ 找不到 hide_dropbox() 函數');
    }
    smartSortItems((a, b) => {
      // 依據 Series (大到小), Index (小到大) 排序
      // Series 降序：b - a
      if (a.sortKey[0] !== b.sortKey[0]) return b.sortKey[0] - a.sortKey[0];
      return a.sortKey[1] - b.sortKey[1]; // Index 升序：a - b
    }, '[SmartSort] 排序完成（依 series/index），請手動點擊 Save Changes', true);
  }

  function smartSortItems(compareFn, doneMsg, skipDate = false) {
    if (typeof submit_reorder === 'function') {
        hide_dropbox();
    } else {
        console.warn('⚠️ 找不到 hide_dropbox() 函數');
    }
    const cells = Array.from(document.querySelectorAll('div[id^="cell_"]'));
    const items = cells.map(cell => {
      const filename = cell.querySelector('.n')?.textContent.trim();
      const input = cell.querySelector('input[id^="pagesel_"]');
      const parsed = parseFilename(filename);
      if (!parsed) {
        console.warn('[SmartSort] 無法解析檔名:', filename);
        return { cell, input, sortKey: [-Infinity, -Infinity, Infinity] };
      }

      const sortKey = skipDate ? [parsed.series, parsed.index] : [parsed.date, parsed.series, parsed.index];

      // 【新增偵錯輸出】: 輸出 Sort Key
      const keyName = skipDate ? 'Series/Index' : 'Date/Series/Index';
      console.log(`  SortKey (${keyName}): [ ${sortKey.join(', ')} ]`);

      return {
        cell,
        input,
        sortKey: sortKey,
        postID: parsed.postID
      };
    });

    items.sort(compareFn);

    // 【新增偵錯輸出】: 排序後的列表（依據 PostID 和 Index）
    console.log('--- 🔎 排序後預覽 (依 Post ID/Index) ---');
    items.forEach((item, i) => {
        if (skipDate) {
            console.log(`預計順序 ${String(i + 1).padStart(2, '0')}: [PostID: "${item.postID}", Index: ${item.sortKey[1]}] - 檔名: ${item.cell.querySelector('.n')?.textContent.trim()}`);
        } else {
            console.log(`預計順序 ${String(i + 1).padStart(2, '0')}: [Date: ${item.sortKey[0]}, PostID: "${item.postID}", Index: ${item.sortKey[2]}] - 檔名: ${item.cell.querySelector('.n')?.textContent.trim()}`);
        }
    });
    console.log('-------------------------------------------');

    for (let i = 0; i < items.length; i++) {
      if (items[i].input) items[i].input.value = i + 1;
    }
    if (typeof submit_reorder === 'function') {
      submit_reorder('manual');
    } else {
      console.warn('⚠️ 找不到 submit_reorder() 函數，請手動儲存變更');
    }
    console.log(doneMsg);
  }

  function simulateClick(element) {
    const rect = element.getBoundingClientRect();
    const opts = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2
    };
    element.dispatchEvent(new MouseEvent('mouseover', opts));
    element.dispatchEvent(new MouseEvent('mousedown', opts));
    element.dispatchEvent(new MouseEvent('mouseup', opts));
    element.dispatchEvent(new MouseEvent('click', opts));
  }

  function deleteAllImages() {
    if (!confirm("⚠️ 確定要刪除畫廊中的所有圖片嗎？此操作不可逆！")) {
        return;
    }

    const cells = Array.from(document.querySelectorAll('div[id^="cell_"]'));
    let count = 0;
    const delay = 50;

    function processNext(index) {
      if (index >= cells.length) {
          console.log(`[SmartDelete] 已嘗試刪除 ${count} 張圖片。`);
          return;
      }

      const cell = cells[index];
      const xBtn = cell.querySelector('div.x');

      if (!xBtn) {
        console.warn(`[SmartDelete] 找不到刪除按鈕，跳過 index ${index}`);
        processNext(index + 1);
        return;
      }

      simulateClick(cell);

      setTimeout(() => {
        try {
          simulateClick(xBtn);
          count++;
        } catch (e) {
          console.error(`[SmartDelete] 錯誤於 index ${index}`, e);
        }

        setTimeout(() => processNext(index + 1), delay);
      }, 150);
    }

    processNext(0);
  }

  function insertButton() {
    const targetDiv = document.querySelector('#t');
    if (!targetDiv) return;

    // 按鈕樣式還原
    const styleButton = (btn) => {
        if (btn) {
            btn.style.fontSize = '16px';
            btn.style.margin = '8px';
            btn.style.fontFamily = 'Calibri';
        }
    };

    const btnDate = document.createElement('button');
    btnDate.textContent = '🗓️ Sort by Date';
    styleButton(btnDate);
    btnDate.addEventListener('click', e => {
      e.preventDefault();
      smartSortByDate();
    });

    const btnSeries = document.createElement('button');
    btnSeries.textContent = '✨ Sort by Post ID';
    styleButton(btnSeries);
    btnSeries.addEventListener('click', e => {
      e.preventDefault();
      smartSortBySeries();
    });

    const btnDelete = document.createElement('button');
    btnDelete.textContent = '🗑️ Delete All';
    styleButton(btnDelete);
    btnDelete.addEventListener('click', e => {
      e.preventDefault();
      deleteAllImages();
    });

    const container = document.createElement('div');
    container.appendChild(btnSeries);
    container.appendChild(btnDate);
    container.appendChild(btnDelete);

    targetDiv.parentElement.insertBefore(container, targetDiv);
  }

  // 僅在上傳管理頁面執行排序功能部分的初始化
  if (window.location.pathname.includes('upld/managegallery')) {
      waitForElement('#t', insertButton);
  }
})();