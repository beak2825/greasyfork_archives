// ==UserScript==
// @name         MoneyFoward
// @namespace    https://greasyfork.org/ja/users/570127
// @version      0.5.0
// @description  MoneyFoward MEを便利にするユーザースクリプト
// @description:ja MoneyFoward MEを便利にするユーザースクリプト
// @author       universato
// @match        https://moneyforward.com/bs/portfolio
// @match        https://moneyforward.com/cf
// @match        https://moneyforward.com/accounts/show/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456072/MoneyFoward.user.js
// @updateURL https://update.greasyfork.org/scripts/456072/MoneyFoward.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ------------------------------
   * 共通ユーティリティ
   * ------------------------------ */

  function parseYen(text) {
    if (!text) return 0;
    return Number(
      text
        .replace(/,/g, '')
        .replace(/\n.*/, '')
        .replace('円', '')
        .trim()
    ) || 0;
  }

  function numberFromCell(cell) {
    return cell ? parseYen(cell.innerText) : 0;
  }

  function numberFromTable(rows, rowIndex, colIndex) {
    const row = rows[rowIndex];
    return row ? numberFromCell(row.cells[colIndex]) : 0;
  }

  function colorClassByValue(value) {
    return value > 0 ? 'plus-color' : 'minus-color';
  }

  function appendHtml(container, html) {
    if (!container) return;
    const div = document.createElement('div');
    div.innerHTML = html;
    container.appendChild(div);
  }

  /* ------------------------------
   * PNS（投資信託など）
   * ------------------------------ */

  function buildPnsSummary() {
    const table = document.querySelector('table.table-bordered.table-pns');
    if (!table) return;

    const rows = table.rows;
    let acquisitionCost = 0;
    let presentValue = 0;
    let profitLoss = 0;

    for (let i = 1; i < rows.length; i++) {
      acquisitionCost += numberFromTable(rows, i, 1);
      presentValue += numberFromTable(rows, i, 2);
      profitLoss += numberFromTable(rows, i, 3);
    }

    const container = document.querySelector('#portfolio_det_pns');
    const colorClass = colorClassByValue(profitLoss);
    const rate = acquisitionCost
      ? (profitLoss / acquisitionCost * 100).toFixed(2)
      : '0.00';

    appendHtml(
      container,
      `
      <table class="table table-bordered table-pns" style="width:80%;">
        <tbody>
          <tr>
            <td>　　　　　　　　合　　　　計　　　　　　</td>
            <td class="number">${acquisitionCost.toLocaleString()}円</td>
            <td class="number">${presentValue.toLocaleString()}円</td>
            <td class="number"><span class="${colorClass}">${profitLoss.toLocaleString()}円</span></td>
            <td class="number"><span class="${colorClass}">　　${rate}%</span></td>
            <td class="entry-date">　　　　　　</td>
          </tr>
        </tbody>
      </table>
      `
    );
  }

  /* ------------------------------
   * EQ（株式）
   * ------------------------------ */

  function buildEqSummary() {
    const table = document.querySelector('table.table-bordered.table-eq');
    if (!table) return;

    const rows = table.rows;
    let acquisitionCost = 0;
    let marketValue = 0;
    let dayBefore = 0;
    let profitLoss = 0;

    for (let i = 1; i < rows.length; i++) {
      const quantity = numberFromTable(rows, i, 2);
      const avgCost = numberFromTable(rows, i, 3);

      acquisitionCost += avgCost * quantity;
      marketValue += numberFromTable(rows, i, 5);
      dayBefore += numberFromTable(rows, i, 6);
      profitLoss += numberFromTable(rows, i, 7);
    }

    const container = document.querySelector('#portfolio_det_eq');
    const colorClass = colorClassByValue(profitLoss);
    const rate = acquisitionCost
      ? (profitLoss / acquisitionCost * 100).toFixed(2)
      : '0.00';

    appendHtml(
      container,
      `
      <table class="table table-bordered table-pns">
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td class="number">取得原価${acquisitionCost.toLocaleString()}円</td>
            <td class="number">${marketValue.toLocaleString()}円</td>
            <td class="number">${dayBefore.toLocaleString()}円</td>
            <td class="number"><span class="${colorClass}">${profitLoss.toLocaleString()}円</span></td>
            <td class="number"><span class="${colorClass}">　　${rate}%</span></td>
            <td class="entry-date">　　　　　　</td>
          </tr>
        </tbody>
      </table>
      `
    );
  }

  /* ------------------------------
   * CF（キャッシュフロー）
   * ------------------------------ */

  function getCfRows() {
    return document.querySelectorAll('.transaction_list.js-cf-edit-container');
  }

  function hideZeros() {
    for (const row of getCfRows()) {
      if (row.children[3]?.innerText === '0') {
        row.style.display = 'none';
      }
    }
  }

  function hideSmalls() {
    for (const row of getCfRows()) {
      if (Math.abs(numberFromCell(row.children[3])) < 1000) {
        row.style.display = 'none';
      }
    }
  }

  function showAll() {
    for (const row of getCfRows()) {
      row.style.display = 'table-row';
    }
  }

  function buildFooterButtons() {
    const footer = document.querySelector('.footer_links');
    if (!footer) return;

    const buttons = [
      { label: 'ゼロ円を非表示', handler: hideZeros },
      { label: '1000円未満を非表示', handler: hideSmalls },
      { label: '全て表示', handler: showAll },
    ];

    for (const { label, handler } of buttons) {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.className = 'button';
      btn.addEventListener('click', handler);
      footer.appendChild(btn);
    }
  }

  /* ------------------------------
   * 新規入力ボタン固定
   * ------------------------------ */

  function fixNewButtonPosition() {
    const buttons = document.querySelectorAll('button.cf-new-btn.btn.modal-switch.btn-warning');
    const button = buttons[buttons.length - 1];
    if (!button) return;

    Object.assign(button.style, {
      position: 'fixed',
      right: '20px',
      bottom: '200px',
    });
  }

  /* ------------------------------
   * 実行
   * ------------------------------ */

  buildPnsSummary();
  buildEqSummary();
  hideZeros();
  buildFooterButtons();
  fixNewButtonPosition();

})();
