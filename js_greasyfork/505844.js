// ==UserScript==
// @name         English Corpora Export
// @name:en      English Corpora Export
// @name:es      Exportación de English Corpora
// @name:fr      Exportation de English Corpora
// @name:de      English Corpora Export
// @name:zh-CN   English Corpora 导出
// @name:ja      English Corpora エクスポート
// @name:ar      تصدير English Corpora
// @name:ru      Экспорт English Corpora

// @description         Add a button to export KWIC of english-corpora.org to csv file
// @description:en      Add a button to export KWIC of english-corpora.org to csv file
// @description:es      Añade un botón para exportar los resultados KWIC de english-corpora.org a un archivo CSV
// @description:fr      Ajoute un bouton pour exporter les résultats KWIC de english-corpora.org vers un fichier CSV
// @description:de      Fügt eine Schaltfläche hinzu, um KWIC-Ergebnisse von english-corpora.org in eine CSV-Datei zu exportieren
// @description:zh-CN   在english-corpora.org网站上添加一个按钮，将KWIC结果导出为CSV文件
// @description:ja      english-corpora.orgにKWIC結果をCSVファイルとしてエクスポートするボタンを追加
// @description:ar      إضافة زر لتصدير نتائج KWIC من english-corpora.org إلى ملف CSV
// @description:ru      Добавляет кнопку для экспорта результатов KWIC с english-corpora.org в файл CSV

// @namespace    https://mkpo.li/
// @version      0.2.0
// @author       mkpoli
// @match        https://www.english-corpora.org/coca/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=english-corpora.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505844/English%20Corpora%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/505844/English%20Corpora%20Export.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // #region Consts
  const BUTTON_ID = 'csv-button';
  const BUTTON_TEXT = 'Download CSV';
  // #endregion

  // #region Utils
  function tableToCSV(table) {
    return Array.from(table.rows)
      .map((row) =>
        Array.from(row.cells)
          .map((cell) => `"${cell.textContent.trim().replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');
  }

  function download(data, filename, type) {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  // #endregion

  // #region Main
  console.log('[user-script] loaded');
  const contextFrame = parent.frames[5];
  console.log('[user-script] `contextFrame` found:', contextFrame);

  function insertDownloadButton() {
    console.log('[user-script] checking for button');
    if (!contextFrame.document.getElementById(BUTTON_ID)) {
      console.log('[user-script] button not found, creating one');
      const contextTable = [...contextFrame.document.querySelectorAll('table')].at(-1);
      if (!contextTable) throw new Error('table not found');
      console.log('[user-script] `contextTable` found:', contextTable);

      const button = contextFrame.document.createElement('button');
      button.textContent = BUTTON_TEXT;
      button.id = BUTTON_ID;
      button.addEventListener('click', () => {
        const csv = tableToCSV(contextTable).replaceAll(`"A","B","C","","","",`, '');
        download(csv, 'table.csv', 'text/csv');
      });

      contextTable.parentNode.insertBefore(button, contextTable);
      console.log('[user-script] button added');
    } else {
      console.log('[user-script] button already exists, skipping...');
    }
  }

  contextFrame.addEventListener('load', () => {
    console.log(`[user-script] contextFrame loaded`);
    insertDownloadButton();
    setInterval(insertDownloadButton, 5000);
  });
  // #endregion
})();