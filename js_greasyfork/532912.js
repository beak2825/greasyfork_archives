// ==UserScript==
// @name         Google Sheets Helper - Copy Key-Value Range (Corrected)
// @namespace    https://www.fiverr.com/web_coder_nsd
// @version      1.2
// @description  Copy selected Google Sheets range as A1: Value using DOM-only cell navigation and your helper stack (clean + accurate)
// @author       Noushad
// @match        https://docs.google.com/spreadsheets/*
// @icon         https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png
// @grant        GM_setClipboard
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/532912/Google%20Sheets%20Helper%20-%20Copy%20Key-Value%20Range%20%28Corrected%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532912/Google%20Sheets%20Helper%20-%20Copy%20Key-Value%20Range%20%28Corrected%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  function getCurrentCellValue() {
    const cellValue = document.querySelector('.cell-input')?.innerText || '';
    return cellValue.trim();
  }

  function getCurrentCellIndex() {
    return document.querySelector('.waffle-name-box')?.value || '';
  }

  async function setCurrentCellIndex(cellIndex) {
    const inputBox = document.querySelector('.waffle-name-box');
    if (!inputBox) return;

    if (typeof cellIndex === 'string') {
      inputBox.value = cellIndex;
    } else if (typeof cellIndex === 'object') {
      const column = cellIndex.column || '';
      const row = cellIndex.row || '';
      inputBox.value = column + row;
    }

    inputBox.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await delay(80);
    inputBox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
  }

  async function getValueFromCell(cellIndex, goPreviousCell = true) {
    const previous = getCurrentCellIndex();
    await setCurrentCellIndex(cellIndex);
    const val = getCurrentCellValue();
    if (goPreviousCell) await setCurrentCellIndex(previous);
    return val;
  }

  const colToIndex = (col) => col.split('').reduce((s, c) => s * 26 + c.charCodeAt(0) - 64, 0);
  const indexToCol = (index) => {
    let col = '';
    while (index > 0) {
      const mod = (index - 1) % 26;
      col = String.fromCharCode(65 + mod) + col;
      index = Math.floor((index - mod) / 26);
    }
    return col;
  };

  const parseRange = (str) => {
    const match = str.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
    if (!match) return null;
    const [, startCol, startRow, endCol, endRow] = match;
    return {
      startCol, startRow: +startRow,
      endCol, endRow: +endRow
    };
  };

  const runCopyKV = async () => {
    const rawRange = getCurrentCellIndex(); // ✅ Corrected here
    const parsed = parseRange(rawRange);
    if (!parsed) return alert('Invalid range selected.');

    const { startCol, startRow, endCol, endRow } = parsed;
    const colStartIdx = colToIndex(startCol);
    const colEndIdx = colToIndex(endCol);

    const previous = getCurrentCellIndex();
    const kvLines = [];

    for (let row = startRow; row <= endRow; row++) {
      for (let col = colStartIdx; col <= colEndIdx; col++) {
        const cell = `${indexToCol(col)}${row}`;
        const val = await getValueFromCell(cell, false);
        kvLines.push(`${cell}: ${val}`);
      }
    }

    if (previous) await setCurrentCellIndex(previous);
    GM_setClipboard(kvLines.join('\n'));
    alert('Copied as key-value pairs!');
  };

  const createButton = () => {
    const btn = document.createElement('button');
    btn.innerText = '📋';
    btn.title = ' Copy Range:Value'
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '60px',
      right: '0px',
      zIndex: '9999',
      padding: '10px 14px',
      background: '#202124',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      fontSize: '14px',
      cursor: 'pointer'
    });
    btn.onclick = runCopyKV;
    document.body.appendChild(btn);
  };

  window.addEventListener('load', () => setTimeout(createButton, 2000));
})();
