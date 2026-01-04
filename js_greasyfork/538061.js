// ==UserScript==
// @name         T3Chat Table Copier
// @namespace    wearifulpoet.com
// @version      0.1.1
// @description  Add "Copy Table" buttons to tables in T3Chat to Office tools
// @match        https://t3.chat/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538061/T3Chat%20Table%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/538061/T3Chat%20Table%20Copier.meta.js
// ==/UserScript==

(() => {
  const TABLE_SELECTOR = 'table';
  const CONTENT_SELECTOR = '[role="article"], .prose, [data-testid="message-content"]';
  const processedTables = new WeakSet();

  const createCopyButton = () => {
    const button = document.createElement('button');
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
      </svg>
      Copy Table
    `;
    button.className = `
      inline-flex items-center gap-2 px-3 py-1.5
      text-xs font-medium text-muted-foreground
      bg-muted hover:bg-muted/80
      border border-border rounded-md
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
    `.replace(/\s+/g, ' ').trim();
    button.setAttribute('data-table-copy-button', '1');
    button.setAttribute('aria-label', 'Copy table to clipboard');
    button.setAttribute('title', 'Copy table with formatting for pasting into documents');
    return button;
  };

  const createButtonContainer = () => {
    const container = document.createElement('div');
    container.className = 'flex justify-end mt-2 mb-2';
    container.setAttribute('data-table-button-container', '1');
    return container;
  };

  const processTableForCopy = (table) => {
    const clone = table.cloneNode(true);
    clone.querySelectorAll('[data-table-copy-button],[data-table-button-container]').forEach(el => el.remove());
    clone.querySelectorAll('*').forEach(el => {
      if (el.tagName.match(/^(TABLE|THEAD|TBODY|TFOOT|TR|TH|TD|CAPTION|COLGROUP|COL)$/)) {
        el.removeAttribute('class');
        el.removeAttribute('style');
        el.removeAttribute('data-testid');
        Array.from(el.attributes).forEach(attr => {
          if (!['colspan', 'rowspan', 'scope', 'headers'].includes(attr.name.toLowerCase())) el.removeAttribute(attr.name);
        });
      } else {
        const text = (el.textContent || '').trim();
        if (text) {
          el.replaceWith(document.createTextNode(text));
        } else {
          el.remove();
        }
      }
    });

    const cleanTable = document.createElement('table');
    cleanTable.border = '1';
    cleanTable.cellPadding = '4';
    cleanTable.cellSpacing = '0';
    Object.assign(cleanTable.style, { borderCollapse: 'collapse', width: '100%' });

    let hasHeader = false;
    clone.querySelectorAll('tr').forEach((row, rowIndex) => {
      const newRow = document.createElement('tr');
      row.querySelectorAll('th,td').forEach(cell => {
        const isHeader = cell.tagName === 'TH' || (rowIndex === 0 && !hasHeader);
        const newCell = document.createElement(isHeader ? 'th' : 'td');
        if (isHeader) {
          hasHeader = true;
          Object.assign(newCell.style, { fontWeight: 'bold', backgroundColor: '#f0f0f0' });
        }
        Object.assign(newCell.style, {
          border: '1px solid #ccc',
          padding: '8px',
          textAlign: 'left',
          verticalAlign: 'top'
        });
        if (cell.hasAttribute('colspan')) newCell.setAttribute('colspan', cell.getAttribute('colspan'));
        if (cell.hasAttribute('rowspan')) newCell.setAttribute('rowspan', cell.getAttribute('rowspan'));
        newCell.textContent = (cell.textContent || '').trim();
        newRow.appendChild(newCell);
      });
      cleanTable.appendChild(newRow);
    });
    return cleanTable;
  };

  const generateTSV = (table) =>
    Array.from(table.querySelectorAll('tr'))
      .map(row =>
        Array.from(row.querySelectorAll('th,td'))
          .map(cell => (cell.textContent || '').trim().replace(/[\t\n\r]+/g, ' ').replace(/\s+/g, ' '))
          .join('\t')
      )
      .join('\n');

  const copyTableToClipboard = async (table) => {
    const processed = processTableForCopy(table);
    const html = processed.outerHTML;
    const tsv = generateTSV(processed);

    try {
      if (navigator.clipboard?.write) {
        const fullHTML = `
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                table{border-collapse:collapse;width:100%}
                th,td{border:1px solid #ccc;padding:8px;text-align:left;vertical-align:top}
                th{font-weight:bold;background:#f0f0f0}
              </style>
            </head>
            <body>${html}</body>
          </html>
        `.trim();
        await navigator.clipboard.write([new ClipboardItem({
          'text/html': new Blob([fullHTML], { type: 'text/html' }),
          'text/plain': new Blob([tsv], { type: 'text/plain' })
        })]);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(tsv);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = tsv;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showCopyFeedback(table);
    } catch {
      showCopyError(table);
    }
  };

  const showCopyFeedback = (table) => {
    const button = table.parentElement?.querySelector('[data-table-copy-button]');
    if (!button) return;
    const original = button.innerHTML;
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Copied!
    `;
    button.style.color = 'rgb(34,197,94)';
    setTimeout(() => {
      button.innerHTML = original;
      button.style.color = '';
    }, 2000);
  };

  const showCopyError = (table) => {
    const button = table.parentElement?.querySelector('[data-table-copy-button]');
    if (!button) return;
    const original = button.innerHTML;
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
      Error
    `;
    button.style.color = 'rgb(239,68,68)';
    setTimeout(() => {
      button.innerHTML = original;
      button.style.color = '';
    }, 2000);
  };

  const addCopyButton = (table) => {
    if (processedTables.has(table) || table.rows.length < 2) return;
    const button = createCopyButton();
    const container = createButtonContainer();
    button.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      copyTableToClipboard(table);
    });
    container.appendChild(button);
    table.parentNode.insertBefore(container, table.nextSibling);
    processedTables.add(table);
  };

  const scanTables = () => {
    document.querySelectorAll(CONTENT_SELECTOR).forEach(area =>
      area.querySelectorAll(TABLE_SELECTOR).forEach(addCopyButton)
    );
  };

  const observer = new MutationObserver(mutations => {
    const added = mutations.some(m =>
      Array.from(m.addedNodes).some(node =>
        node.nodeType === 1 && (node.tagName === 'TABLE' || node.querySelector?.(TABLE_SELECTOR))
      )
    );
    if (added) setTimeout(scanTables, 100);
  });

  const init = () => {
    scanTables();
    observer.observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
