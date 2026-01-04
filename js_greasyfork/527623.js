// ==UserScript==
// @name         ChatGPT GPTs Exporter
// @name:zh-CN   ChatGPT GPTs 导出工具
// @name:zh-TW   ChatGPT GPTs 導出工具
// @namespace    https://github.com/lroolle/chatgpt-degraded
// @version      0.1.1
// @description  Export your GPTs data from ChatGPT
// @description:zh-CN  从 ChatGPT 导出你的 GPTs 数据
// @description:zh-TW  從 ChatGPT 導出你的 GPTs 數據
// @author       lroolle
// @license      AGPL-3.0
// @match        *://chat.openai.com/gpts/*
// @match        *://chatgpt.com/gpts/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-start
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMmE5ZDhmO3N0b3Atb3BhY2l0eToxIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzJhOWQ4ZjtzdG9wLW9wYWNpdHk6MC44Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8Zz4KICAgIDxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjI4IiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz4KPCEtLU91dGVyIGNpcmNsZSBtb2RpZmllZCB0byBsb29rIGxpa2UgIkMiLS0+CiAgICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1kYXNoYXJyYXk9IjEyNSA1NSIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjIwIi8+CiAgICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIxMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiNmZmYiLz4KICA8L2c+Cjwvc3ZnPg==
// @homepageURL  https://github.com/lroolle/chatgpt-degraded
// @supportURL   https://github.com/lroolle/chatgpt-degraded/issues
// @downloadURL https://update.greasyfork.org/scripts/527623/ChatGPT%20GPTs%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/527623/ChatGPT%20GPTs%20Exporter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Store GPTs data
  let gptsData = [];
  let isExporting = false;

  // Storage key for persisted data
  const STORAGE_KEY = 'chatgpt_gpts_data';

  // Load persisted data
  function loadPersistedData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading persisted GPTs data:', error);
      return [];
    }
  }

  // Save data to persistence
  function persistData(data) {
    try {
      // Create a map of existing data by ID
      const existingData = loadPersistedData();
      const dataMap = new Map(existingData.map(item => [item.id, item]));
      
      // Update or add new data
      data.forEach(item => {
        dataMap.set(item.id, item);
      });
      
      // Convert map back to array and save
      const mergedData = Array.from(dataMap.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
      
      return mergedData;
    } catch (error) {
      console.error('Error persisting GPTs data:', error);
      return data;
    }
  }

  // Clear persisted data
  function clearPersistedData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing persisted GPTs data:', error);
    }
  }

  // i18n support
  const i18n = {
    'en': {
      exportBtn: 'Export GPTs',
      exportJSON: 'Export as JSON',
      exportCSV: 'Export as CSV',
      clearData: 'Clear Data',
      exporting: 'Exporting...',
      copied: 'Copied to clipboard!',
      noData: 'No GPTs data found',
      error: 'Error exporting GPTs',
      dataCleared: 'Data cleared successfully',
      totalGPTs: 'Total GPTs: '
    },
    'zh-CN': {
      exportBtn: '导出 GPTs',
      exportJSON: '导出为 JSON',
      exportCSV: '导出为 CSV',
      clearData: '清除数据',
      exporting: '导出中...',
      copied: '已复制到剪贴板！',
      noData: '未找到 GPTs 数据',
      error: '导出 GPTs 时出错',
      dataCleared: '数据已清除',
      totalGPTs: '总计 GPTs: '
    },
    'zh-TW': {
      exportBtn: '導出 GPTs',
      exportJSON: '導出為 JSON',
      exportCSV: '導出為 CSV',
      clearData: '清除數據',
      exporting: '導出中...',
      copied: '已複製到剪貼板！',
      noData: '未找到 GPTs 數據',
      error: '導出 GPTs 時出錯',
      dataCleared: '數據已清除',
      totalGPTs: '總計 GPTs: '
    }
  };

  // Get user language
  const userLang = (navigator.language || 'en').toLowerCase();
  const lang = i18n[userLang] ? userLang : 
               userLang.startsWith('zh-tw') ? 'zh-TW' :
               userLang.startsWith('zh') ? 'zh-CN' : 'en';
  const t = key => i18n[lang][key] || i18n.en[key];

  // Intercept fetch requests
  const originalFetch = unsafeWindow.fetch;
  unsafeWindow.fetch = async function(resource, options) {
    const response = await originalFetch(resource, options);
    const url = typeof resource === 'string' ? resource : resource?.url;

    // Check if this is the GPTs list request
    if (url && url.includes('/public-api/gizmos/discovery/mine')) {
      try {
        const clonedResponse = response.clone();
        const data = await clonedResponse.json();
        if (data?.list?.items) {
          const newGPTsData = data.list.items.map(item => {
            const gpt = item.resource.gizmo;
            return {
              id: gpt.id,
              name: gpt.display.name || '',
              description: gpt.display.description || '',
              instructions: gpt.instructions || '',
              created_at: gpt.created_at,
              updated_at: gpt.updated_at,
              version: gpt.version,
              tools: item.resource.tools.map(tool => tool.type),
              prompt_starters: gpt.display.prompt_starters || [],
              share_recipient: gpt.share_recipient,
              num_interactions: gpt.num_interactions
            };
          });
          
          // Persist and update the data
          gptsData = persistData(newGPTsData);
          
          // Update the counter in UI
          updateGPTsCounter(gptsData.length);
        }
      } catch (error) {
        console.error('Error intercepting GPTs data:', error);
      }
    }
    return response;
  };

  // Update GPTs counter in UI
  function updateGPTsCounter(count) {
    const counter = document.getElementById('gpts-counter');
    if (counter) {
      counter.textContent = `${t('totalGPTs')}${count}`;
    }
  }

  // Convert GPTs data to CSV
  function convertToCSV(data) {
    const headers = [
      'ID',
      'Name',
      'Description',
      'Instructions',
      'Created At',
      'Updated At',
      'Version',
      'Tools',
      'Prompt Starters',
      'Share Recipient',
      'Interactions'
    ];

    const rows = data.map(gpt => [
      gpt.id,
      `"${(gpt.name || '').replace(/"/g, '""')}"`,
      `"${(gpt.description || '').replace(/"/g, '""')}"`,
      `"${(gpt.instructions || '').replace(/"/g, '""')}"`,
      gpt.created_at,
      gpt.updated_at,
      gpt.version,
      `"${(gpt.tools || []).join(', ')}"`,
      `"${(gpt.prompt_starters || []).join(', ').replace(/"/g, '""')}"`,
      gpt.share_recipient,
      gpt.num_interactions
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  // Export GPTs data
  function exportGPTs(format = 'json') {
    if (isExporting) return;
    isExporting = true;

    try {
      // Load all persisted data
      const allData = loadPersistedData();
      
      if (!allData.length) {
        alert(t('noData'));
        isExporting = false;
        return;
      }

      let exportContent, filename, mimeType;

      if (format === 'csv') {
        exportContent = convertToCSV(allData);
        filename = `chatgpt-gpts-export-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else {
        const exportData = {
          exported_at: new Date().toISOString(),
          total_gpts: allData.length,
          gpts: allData
        };
        exportContent = JSON.stringify(exportData, null, 2);
        filename = `chatgpt-gpts-export-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      }

      GM_setClipboard(exportContent);

      // Create and download file
      const blob = new Blob([exportContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert(t('copied'));
    } catch (error) {
      console.error('Error exporting GPTs:', error);
      alert(t('error'));
    } finally {
      isExporting = false;
    }
  }

  // Register menu commands
  GM_registerMenuCommand(t('exportJSON'), () => exportGPTs('json'));
  GM_registerMenuCommand(t('exportCSV'), () => exportGPTs('csv'));

  // Add export button to UI
  function addExportButton() {
    const styles = document.createElement('style');
    styles.textContent = `
      .gpts-exporter {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: var(--surface-primary, rgba(255, 255, 255, 0.9));
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--border-light, rgba(0, 0, 0, 0.1));
        transition: transform 0.2s ease, opacity 0.2s ease;
      }
      .gpts-exporter:hover {
        transform: translateY(-2px);
      }
      .gpts-exporter.collapsed {
        transform: translateX(calc(100% + 20px));
      }
      .gpts-exporter button {
        padding: 8px 16px;
        background-color: var(--success-color, #10a37f);
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-width: 140px;
      }
      .gpts-exporter button:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      .gpts-exporter button:active {
        transform: translateY(0);
      }
      .gpts-exporter .toggle-btn {
        position: absolute;
        left: -32px;
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 24px;
        background: var(--success-color, #10a37f);
        border: none;
        border-radius: 4px 0 0 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        min-width: unset;
      }
      .gpts-exporter .toggle-btn svg {
        width: 16px;
        height: 16px;
        fill: #fff;
        transition: transform 0.2s ease;
      }
      .gpts-exporter.collapsed .toggle-btn svg {
        transform: rotate(180deg);
      }
      .gpts-exporter button.json-btn {
        background-color: var(--success-color, #10a37f);
      }
      .gpts-exporter button.csv-btn {
        background-color: var(--primary-color, #0ea5e9);
      }
      .gpts-exporter .counter {
        font-size: 12px;
        color: var(--text-secondary, #666);
        text-align: center;
        margin-bottom: 4px;
      }
      .gpts-exporter button.clear-btn {
        background-color: var(--error-color, #dc2626);
        font-size: 12px;
        padding: 4px 8px;
      }
    `;
    document.head.appendChild(styles);

    const container = document.createElement('div');
    container.className = 'gpts-exporter';

    // Add GPTs counter
    const counter = document.createElement('div');
    counter.id = 'gpts-counter';
    counter.className = 'counter';
    counter.textContent = `${t('totalGPTs')}${loadPersistedData().length}`;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-btn';
    toggleBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
    toggleBtn.addEventListener('click', () => {
      container.classList.toggle('collapsed');
    });

    const jsonBtn = document.createElement('button');
    jsonBtn.className = 'json-btn';
    jsonBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      ${t('exportJSON')}
    `;
    jsonBtn.addEventListener('click', () => exportGPTs('json'));

    const csvBtn = document.createElement('button');
    csvBtn.className = 'csv-btn';
    csvBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
      ${t('exportCSV')}
    `;
    csvBtn.addEventListener('click', () => exportGPTs('csv'));

    // Add clear data button
    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear-btn';
    clearBtn.textContent = t('clearData');
    clearBtn.addEventListener('click', () => {
      if (confirm(t('clearData') + '?')) {
        clearPersistedData();
        gptsData = [];
        updateGPTsCounter(0);
        alert(t('dataCleared'));
      }
    });

    container.appendChild(counter);
    container.appendChild(toggleBtn);
    container.appendChild(jsonBtn);
    container.appendChild(csvBtn);
    container.appendChild(clearBtn);
    document.body.appendChild(container);
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addExportButton);
  } else {
    addExportButton();
  }
})(); 