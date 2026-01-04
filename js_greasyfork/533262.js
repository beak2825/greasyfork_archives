// ==UserScript==
// @name         匯入人員休宿設定（修正欄位與測試按鈕）
// @namespace    http://tampermonkey.net/
// @version      4.7
// @description  精準對應 E40~E60, E62~E64, E66~E78 → gridVacation_listVacationType_0~36，並提供測試點擊功能
// @match        http://172.31.150.13:8078/WebForm2.aspx?s=edit&k=*
// @match        http://172.31.150.13:8078/WebForm*
// @grant        GM_xmlhttpRequest
// @connect      docs.google.com
// @downloadURL https://update.greasyfork.org/scripts/533262/%E5%8C%AF%E5%85%A5%E4%BA%BA%E5%93%A1%E4%BC%91%E5%AE%BF%E8%A8%AD%E5%AE%9A%EF%BC%88%E4%BF%AE%E6%AD%A3%E6%AC%84%E4%BD%8D%E8%88%87%E6%B8%AC%E8%A9%A6%E6%8C%89%E9%88%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533262/%E5%8C%AF%E5%85%A5%E4%BA%BA%E5%93%A1%E4%BC%91%E5%AE%BF%E8%A8%AD%E5%AE%9A%EF%BC%88%E4%BF%AE%E6%AD%A3%E6%AC%84%E4%BD%8D%E8%88%87%E6%B8%AC%E8%A9%A6%E6%8C%89%E9%88%95%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function trulySimulateSelection(selectId, targetValue) {
    const select = document.querySelector(`#gridVacation_listVacationType_${selectId}`);
    if (!select) return;

    const options = [...select.options];
    const targetOption = options.find(opt => opt.value === targetValue);
    if (!targetOption) return;

    select.selectedIndex = options.indexOf(targetOption);
    const event = new Event('change', { bubbles: true });
    select.dispatchEvent(event);

    console.log(`✔️ 選取第 ${selectId} 筆 → value=${targetValue}`);
  }

  async function startImport(allLines, btn) {
    const mappings = [
      { index: 35, id: 0 }, { index: 36, id: 1 }, { index: 37, id: 2 }, { index: 38, id: 3 }, { index: 39, id: 4 },
      { index: 40, id: 5 }, { index: 41, id: 6 }, { index: 42, id: 7 }, { index: 43, id: 8 }, { index: 44, id: 9 },
      { index: 45, id: 10 }, { index: 46, id: 11 }, { index: 47, id: 12 }, { index: 48, id: 13 }, { index: 49, id: 14 },
      { index: 50, id: 15 }, { index: 51, id: 16 }, { index: 52, id: 17 }, { index: 53, id: 18 }, { index: 54, id: 19 },
      { index: 55, id: 20 }, { index: 57, id: 21 }, { index: 58, id: 22 }, { index: 59, id: 23 }, { index: 61, id: 24 },
      { index: 62, id: 25 }, { index: 63, id: 26 }, { index: 64, id: 27 }, { index: 65, id: 28 }, { index: 66, id: 29 },
      { index: 67, id: 30 }, { index: 68, id: 31 }, { index: 69, id: 32 }, { index: 70, id: 33 }, { index: 71, id: 34 },
      { index: 72, id: 35 }, { index: 73, id: 36 },
    ];

    for (let i = 0; i < mappings.length; i++) {
      const { index, id } = mappings[i];
      const line = allLines[index];
      if (!line) {
        console.warn(`⚠️ 第 ${index + 1} 行無資料`);
        continue;
      }

      const value = line.split(',')[4]?.trim().replace(/"/g, '') || '';
      if (value === '上班') {
        trulySimulateSelection(id, '0');
      } else if (value === '放假') {
        trulySimulateSelection(id, '3');
      } else if (value === '外宿') {
        trulySimulateSelection(id, '13');
      } else {
        console.warn(`⚠️ 第 ${index + 1} 行資料不明: ${value}`);
      }

      await sleep(100);
    }

    btn.textContent = '✅ 匯入完成';
    alert('✅ 請檢查匯入人員是否正確');
  }

  function addFloatingButton(labelText = '匯入人員休宿設定') {
    if (document.querySelector('#importBtn')) return;

    const btn = document.createElement('button');
    btn.textContent = labelText;
    btn.id = 'importBtn';
    btn.style.position = 'fixed';
    btn.style.top = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '99999';
    btn.style.padding = '8px 14px';
    btn.style.background = '#007bff';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';

    btn.addEventListener('click', () => {
      btn.textContent = '匯入中...';
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://docs.google.com/spreadsheets/d/1cfESzb6rhzSBpMalDkjtEwl6-zRxvaWHyzSyf71NIUY/gviz/tq?tqx=out:csv&gid=2018941189',
        onload: function (response) {
          const allLines = response.responseText.trim().split('\n');
          startImport(allLines, btn);
        },
        onerror: function () {
          alert('❌ 無法讀取 Google Sheet');
          btn.textContent = labelText;
        }
      });
    });

    document.body.appendChild(btn);
  }

  function addTestButton() {
    const btn = document.createElement('button');
    btn.textContent = '測試點擊按鈕';
    btn.style.position = 'fixed';
    btn.style.top = '60px';
    btn.style.right = '20px';
    btn.style.zIndex = '99999';
    btn.style.padding = '8px 14px';
    btn.style.background = '#28a745';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';

    btn.addEventListener('click', async () => {
      for (let i = 0; i <= 36; i++) {
        trulySimulateSelection(i, '8');
        await sleep(100);
      }
      alert('✅ 所有欄位已模擬選擇產假(陪產假)');
    });

    document.body.appendChild(btn);
  }

  function fetchDateAndAddButton() {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://docs.google.com/spreadsheets/d/1cfESzb6rhzSBpMalDkjtEwl6-zRxvaWHyzSyf71NIUY/gviz/tq?tqx=out:csv&gid=2018941189',
      onload: function (response) {
        const allLines = response.responseText.trim().split('\n');
        const lineB40 = allLines[39];
        const cols = lineB40.split(',');
        const rawDate = cols[1]?.trim();
        let dateDisplay = '';

        if (rawDate) {
          if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(rawDate)) {
            const [, month, day] = rawDate.split('/');
            dateDisplay = `${parseInt(month)}/${parseInt(day)}`;
          } else if (!isNaN(rawDate)) {
            const baseDate = new Date(1899, 11, 30);
            const calcDate = new Date(baseDate.getTime() + (Number(rawDate) * 86400000));
            dateDisplay = `${calcDate.getMonth() + 1}/${calcDate.getDate()}`;
          }
        }

        const btnText = dateDisplay ? `匯入${dateDisplay}人員休宿設定` : '匯入人員休宿設定';
        addFloatingButton(btnText);
        addTestButton();
      },
      onerror: function () {
        console.warn('⚠️ 無法取得 B40 日期，使用預設文字');
        addFloatingButton();
        addTestButton();
      }
    });
  }

  window.addEventListener('load', () => {
    setTimeout(fetchDateAndAddButton, 1000);
  });
})();
