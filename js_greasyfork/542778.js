// ==UserScript==
// @name         Zabbix Copy Problem Info
// @namespace    https://example.com/
// @version      0.4
// @author       bespredel
// @description  Добавляет кнопку «Copy» к каждой строке проблем в Zabbix by bespredel
// @match        *://*/zabbix.php*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542778/Zabbix%20Copy%20Problem%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/542778/Zabbix%20Copy%20Problem%20Info.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.log('Zabbix Copy Problem Info loaded...');

  GM_addStyle(`
    .zb-copy-btn {
      margin-left: 6px;
      cursor: pointer;
      padding: 2px 6px;
      font-size: 11px;
      color: #fff;
      background: #5b9;
      border: none;
      border-radius: 3px;
    }
    .zb-copy-btn:hover {
      background: #48a;
    }
    .zb-copy-btn.copied {
      background: #6c6;
    }
  `);

  function getProblemInfo(row) {
    const hostCell = row.querySelector('td:nth-child(5), td[class*="host"]');
    const problemCell = row.querySelector('td:nth-child(6), td[class*="problem"]');
    const dataCell = row.querySelector('td:nth-child(7), td[class*="data"]');

    return {
      host: hostCell?.innerText.trim() || 'N/A',
      problem: problemCell?.innerText.trim() || 'N/A',
      data: dataCell?.innerText.trim() || 'N/A'
    };
  }

  function addCopyButton(row) {
    if (row.querySelector('.zb-copy-btn')) return;

    const actionCell = row.querySelector('td:last-child');
    if (!actionCell) return;

    const btn = document.createElement('button');
    btn.className = 'zb-copy-btn';
    btn.textContent = 'Copy';

    btn.addEventListener('click', async () => {
      try {
        const {host, problem, data} = getProblemInfo(row);
        const text = `Host: ${host}\nProblem: ${problem}\nData: ${data}`;

        await navigator.clipboard.writeText(text);

        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1500);
      } catch (err) {
        console.error('Failed to copy:', err);
        btn.textContent = 'Error';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
      }
    });

    actionCell.prepend(btn);
  }

  function processRows() {
    const rows = document.querySelectorAll('tr:has(td), .list-table tr');

    rows.forEach(row => {
      if (!row.dataset.copyAdded) {
        row.dataset.copyAdded = 'true';
        addCopyButton(row);
      }
    });
  }

  // Initial processing
  processRows();

  // Observe dynamic changes
  const observer = new MutationObserver((mutations) => {
    let shouldProcess = mutations.some(mutation =>
      mutation.addedNodes.length > 0 ||
      mutation.type === 'attributes'
    );

    if (shouldProcess) {
      processRows();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false
  });

  // Fallback interval
  setInterval(processRows, 2000);
})();