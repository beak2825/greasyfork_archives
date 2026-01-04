// ==UserScript==
// @name         Export/Import Filter List
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Export and import filter list
// @author       Eleven
// @match        https://www.phind.com/filters
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474538/ExportImport%20Filter%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/474538/ExportImport%20Filter%20List.meta.js
// ==/UserScript==

let table = document.querySelector("table");

let listToExport = Array.from(table.rows).map((row) =>
  Array.from(row.cells).map((cell) => cell.textContent)
);
GM_setValue("exportedList", JSON.stringify(listToExport));

let importedList = JSON.parse(GM_getValue("exportedList"));


importedList.forEach((rowData) => {
  let row = table.insertRow();
  rowData.forEach((cellData) => {
    let cell = row.insertCell();
    cell.textContent = cellData;
  });
});

GM_registerMenuCommand("Export List", () => {
  let table = document.querySelector("table");
  let listToExport = Array.from(table.rows).map((row) =>
    Array.from(row.cells).map((cell) => cell.textContent)
  );
  GM_setValue("exportedList", JSON.stringify(listToExport));
});

GM_registerMenuCommand("Import List", () => {
  let importedList = JSON.parse(GM_getValue("exportedList"));
  let table = document.querySelector("table");
  importedList.forEach((rowData) => {
    let row = table.insertRow();
    rowData.forEach((cellData) => {
      let cell = row.insertCell();
      cell.textContent = cellData;
    });
  });
});
