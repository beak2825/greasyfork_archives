// ==UserScript==
// @name         Nidin(你訂) 訂單一鍵複製 & 下載
// @namespace    https://aliyang.greasyfork.org
// @version      1.1
// @description  於 Nidin(你訂) 訂單頁面加入「複製」與「匯出 CSV」按鈕，方便貼到 Excel／Google Sheets 或下載保存
// @author       aliyang
// @match        https://order.nidin.shop/orderListInfo/*
// @grant        none
// @license      MIT © 2025 Ali Yang
// @downloadURL https://update.greasyfork.org/scripts/534694/Nidin%28%E4%BD%A0%E8%A8%82%29%20%E8%A8%82%E5%96%AE%E4%B8%80%E9%8D%B5%E8%A4%87%E8%A3%BD%20%20%E4%B8%8B%E8%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/534694/Nidin%28%E4%BD%A0%E8%A8%82%29%20%E8%A8%82%E5%96%AE%E4%B8%80%E9%8D%B5%E8%A4%87%E8%A3%BD%20%20%E4%B8%8B%E8%BC%89.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /** 等待商品列表與小計列渲染完成後插入按鈕 */
  const wait = setInterval(() => {
    const rows = document.querySelectorAll('.prod-list');
    const subtotal = document.querySelector('.subtotal_price');
    if (rows.length && subtotal) {
      clearInterval(wait);
      addButtons(rows, subtotal);
    }
  }, 350);

  /** 新增「複製」與「匯出」按鈕 */
  function addButtons(rows, subtotal) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText =
      'display:inline-flex;gap:8px;margin-left:8px;vertical-align:middle;';

    wrapper.appendChild(createButton('複製', () => copyToClipboard(buildTable(rows, subtotal))));
    wrapper.appendChild(
      createButton('匯出 CSV', () => downloadCsv(arrayToCsv(buildTable(rows, subtotal)), 'order.csv'))
    );

    (subtotal.parentElement || document.body).appendChild(wrapper);
  }

  /** 建立按鈕元素 */
  const createButton = (text, handler) =>
    Object.assign(document.createElement('button'), {
      textContent: text,
      style:
        'padding:4px 12px;border:1px solid #888;border-radius:4px;'+
        'background:#1976d2;color:#fff;cursor:pointer;font-size:14px;',
      onclick: handler
    });

  /* ----------------  資料處理  ---------------- */

  /** 將畫面中的訂單資訊轉成二維陣列 */
  function buildTable(rows, subtotal) {
    const table = [['品項', '額外資訊(冰/糖/加料)', '價格', '訂購者', '數量']];

    rows.forEach(row => {
      const name = row.querySelector('.text-bold')?.textContent.trim() || '';

      const detail = row.querySelector('.prod-detail-font span')?.textContent.trim() || '';
      const extra  = detail.replace(/\s*\$[\d.]+.*$/, '').replace(/\/\s*$/, '').trim();
      const price  = (detail.match(/\$([\d.]+)/) || [])[1] || '';
      const qty    = (detail.match(/\/\s*(\d+)\s*份/) || [])[1] || '';

      const buyer = row
        .querySelector('.text-gray-2.font-size-caption i.material-icons')
        ?.parentElement.textContent.replace('account_circle', '').trim() || '';

      table.push([name, extra, price, buyer, qty]);
    });

    const sum = subtotal.textContent.replace(/\s+/g, '');
    table.push([
      '合計',
      '',
      (sum.match(/\$([\d.]+)/) || [])[1] || '',
      '',
      (sum.match(/\/(\d+)份/) || [])[1] || ''
    ]);
    return table;
  }

  /** 轉成含 UTF‑8 BOM 的 CSV 字串 */
  const arrayToCsv = data =>
    '\uFEFF' + data.map(r => r.map(csvEscape).join(',')).join('\n');
  const csvEscape = s => /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;

  /* ----------------  複製至剪貼簿  ---------------- */

  async function copyToClipboard(table) {
    const tsv  = table.map(r => r.join('\t')).join('\n');
    const html = '<table>' + table.map(r =>
      '<tr>' + r.map(c => `<td>${htmlEscape(c)}</td>`).join('') + '</tr>'
    ).join('') + '</table>';

    if (navigator.clipboard?.write && window.ClipboardItem) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': new Blob([tsv],  { type: 'text/plain' }),
            'text/html' : new Blob([html], { type: 'text/html'  })
          })
        ]);
        alert('已複製！直接貼到 Excel／Google Sheets 即可。');
        return;
      } catch { /* 若失敗則 fallback */ }
    }

    navigator.clipboard.writeText(tsv).then(() =>
      alert('已複製 (僅純文字)。若貼上仍合併在同欄，請更新瀏覽器版本。')
    );
  }

  /* ----------------  下載 CSV 檔  ---------------- */

  function downloadCsv(text, filename) {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8;' }));
    Object.assign(document.createElement('a'), { href: url, download: filename }).click();
    URL.revokeObjectURL(url);
  }

  /* ----------------  小工具  ---------------- */

  const htmlEscape = s =>
    s.replace(/[&<>"']/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]));
})();