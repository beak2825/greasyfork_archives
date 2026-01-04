// ==UserScript==
// @name         Export PO Table
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Export PO table to CSV
// @author       LL
// @match        https://ubrta.csoftintl.com.cn/resource/invoice*
// @require      https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479420/Export%20PO%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/479420/Export%20PO%20Table.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 添加CSV导出按钮
  const exportCsvButton = document.createElement("button");
  exportCsvButton.textContent = "Export Data as CSV";
  exportCsvButton.style.position = "fixed";
  exportCsvButton.style.top = "10px";
  exportCsvButton.style.right = "10px";
  document.body.appendChild(exportCsvButton);

  // 添加Excel导出按钮
  const exportExcelButton = document.createElement("button");
  exportExcelButton.textContent = "Export Data as Excel";
  exportExcelButton.style.position = "fixed";
  exportExcelButton.style.top = "40px";
  exportExcelButton.style.right = "10px";
  document.body.appendChild(exportExcelButton);

  // 点击事件 - 导出CSV
  exportCsvButton.addEventListener("click", () => exportTable("csv"));

  // 点击事件 - 导出Excel
  exportExcelButton.addEventListener("click", () => exportTable("excel"));

  function exportTable(format) {
    // 检查是否有表格
    const table = document.querySelector("#poContent");

    if (table) {
      // 解析表格
      const rows = table.querySelectorAll("tr");
      const data = [];

      // 单独处理表头
      const headerCols = rows[0].querySelectorAll("th");
      const headerData = [];
      headerCols.forEach((headerCol, index) => {
        // 忽略最后一列
        if (index !== headerCols.length - 1) {
          headerData.push(headerCol.innerText);
        }
      });
      data.push(headerData);

      // 跳过表头处理数据行
      rows.forEach((row, rowIndex) => {
        if (rowIndex !== 0) {
          // 跳过表头的行
          const cols = row.querySelectorAll("td");
          const rowData = [];

          // 解析每一列，跳过最后一列
          cols.forEach((col, colIndex) => {
            if (colIndex !== cols.length - 1) {
              // 忽略最后一列
              // 如果存在title属性，使用title属性的值
              rowData.push(col.title || col.innerText);
            }
          });

          data.push(rowData);
        }
      });

      if (format === "csv") {
        // 生成CSV
        const csv = Papa.unparse(data);

        // 保存CSV文件
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "table_data.csv");
      } else if (format === "excel") {
        // 生成Excel文件
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        // 保存Excel文件
        XLSX.writeFile(workbook, "table_data.xlsx");
      }
    } else {
      console.error(`No table found`);
    }
  }
})();
