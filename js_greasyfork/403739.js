// ==UserScript==
// @name         mlpnlp Table Sorter
// @namespace    https://github.com/kyunashige/mlpnlp-table-sorter
// @version      0.3
// @description  mlpnlp の正誤表をページ番号順にソートする
// @author       kyuna
// @match        https://github.com/mlpnlp/mlpnlp
// @license      MIT
// @supportURL   https://github.com/kyunashige/mlpnlp-table-sorter/issues
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403739/mlpnlp%20Table%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/403739/mlpnlp%20Table%20Sorter.meta.js
// ==/UserScript==

(() => {
  "use strict";
  /**
   * fetch correct/incorrect table
   */
  const $ = document.querySelector.bind(document);
  const coricTable = $("#readme > div > article > table > tbody");
  // console.log(toString.call(coricTable));
  /**
   * sort by PageNo
   */
  const rows = Array.prototype.slice.call(
    coricTable.getElementsByTagName("tr")
  );
  const getPageNo = (row) => {
    return parseInt(row.cells[2].innerText.match(/\d+/g)[0]);
  };
  rows.sort((a, b) => {
    return getPageNo(a) - getPageNo(b);
  });
  /**
   * create table
   */
  const tbody = $("tbody");
  for (const row of rows) {
    tbody.appendChild(row);
  }
  /**
   * replace table
   */
  $("#readme > div > article > table").appendChild(tbody);
})();
