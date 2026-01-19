// ==UserScript==
// @name         标题批量导出DBLP的BibTeX
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  在网页左下角生成一个按钮，从dblp中获取选定文本的BibTeX并复制到剪贴板。支持批量获取，支持从剪贴板读取，支持随时下载，支持导出URL和CSV。
// @author       shandianchengzi
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      GPL-3.0
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/522825/%E6%A0%87%E9%A2%98%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BADBLP%E7%9A%84BibTeX.user.js
// @updateURL https://update.greasyfork.org/scripts/522825/%E6%A0%87%E9%A2%98%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BADBLP%E7%9A%84BibTeX.meta.js
// ==/UserScript==

// Inject Custom CSS
const css = `
#dblp-batch-overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 25px;
    border-radius: 10px;
    z-index: 100000;
    text-align: center;
    min-width: 400px;
    max-width: 90%;
    backdrop-filter: blur(5px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    display: none;
}

#dblp-batch-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #fff;
}

#dblp-batch-current {
    font-size: 14px;
    margin-bottom: 20px;
    color: #ccc;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 450px;
    margin-left: auto;
    margin-right: auto;
    min-height: 20px;
}

.dblp-btn {
    border: none;
    border-radius: 6px;
    padding: 8px 15px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s;
    margin: 5px;
    outline: none;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

#dblp-btn-download {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}
#dblp-btn-download:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(118, 75, 162, 0.4); }

#dblp-btn-copy-urls {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: white;
}
#dblp-btn-copy-urls:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(56, 239, 125, 0.4); }

#dblp-btn-csv {
    background: linear-gradient(135deg, #ff9966 0%, #ff5e62 100%);
    color: white;
}
#dblp-btn-csv:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(255, 94, 98, 0.4); }

#dblp-btn-close {
    background: rgba(255, 255, 255, 0.15);
    color: #ddd;
    border: 1px solid rgba(255,255,255,0.2);
}
#dblp-btn-close:hover { background: rgba(255, 255, 255, 0.25); color: white; }

/* Confirm Modal */
#dblp-confirm-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    color: #333;
    padding: 20px;
    border-radius: 8px;
    z-index: 100001;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    text-align: center;
    max-width: 400px;
    display: none;
}
#dblp-confirm-text {
    background: #f5f5f5;
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
    font-family: monospace;
    text-align: left;
    max-height: 100px;
    overflow-y: auto;
    font-size: 12px;
}

/* Close Modal */
#dblp-close-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    color: #333;
    padding: 25px;
    border-radius: 10px;
    z-index: 100002;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    text-align: center;
    min-width: 320px;
    display: none;
}
.dblp-close-option {
    background: #f5f5f5;
    border: none;
    border-radius: 6px;
    padding: 12px 20px;
    margin: 8px 0;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
    text-align: center;
    transition: all 0.2s;
}
.dblp-close-option:hover {
    background: #e0e0e0;
    transform: translateY(-2px);
}

/* Config Modal */
#dblp-config-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    color: #333;
    padding: 25px;
    border-radius: 10px;
    z-index: 100003;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    text-align: center;
    min-width: 500px;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
    display: none;
}
.dblp-config-section {
    text-align: left;
    margin: 20px 0;
}
.dblp-config-label {
    font-weight: bold;
    margin-bottom: 8px;
    display: block;
}
.dblp-config-textarea {
    width: 100%;
    height: 120px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-family: monospace;
    font-size: 13px;
    resize: vertical;
}
.dblp-config-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
}
`;

if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(css);
} else {
    const styleNode = document.createElement('style');
    styleNode.innerHTML = css;
    document.head.appendChild(styleNode);
}

// Toast function
function Toast(msg, duration) {
  duration = isNaN(duration) ? 3000 : duration;
  var m = document.createElement('div');
  m.innerHTML = msg;
  m.style.cssText = "font-family: 'siyuan'; max-width: 60%; min-width: 150px; padding: 10px 14px; height: auto; color: rgb(255, 255, 255); line-height: 1.5; text-align: center; border-radius: 4px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 999999; background: rgba(0, 0, 0, 0.7); font-size: 16px;";
  document.body.appendChild(m);
  setTimeout(function() {
      m.style.transition = 'opacity 0.5s ease-in';
      m.style.opacity = '0';
      setTimeout(function() {
          if(m.parentNode) document.body.removeChild(m);
      }, 500);
  }, duration);
}

var headers = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36 Edg/100.0.1185.36",
  'Referer': 'https://dblp.org/'
};

(function() {
  'use strict';

  var lang=navigator.appName=="Netscape"?navigator.language:navigator.userLanguage;
  var lang_hint = {
    error_no_text: "没有选中文本且剪贴板为空！",
    clipboard_confirm: "未选中文本。是否使用剪贴板内容？",
    clipboard_read_err: "无法读取剪贴板，请手动选择文本。",
    fetching_one: "正在获取...",
    done_copy: "已完成并复制！",
    batch_title: (cur, total) => `批量提取中: ${cur} / ${total}`,
    batch_done_title: "批量提取完成",
    download_btn: "下载 BibTeX (.bib)",
    copy_urls_btn: "仅复制 URL",
    csv_btn: "下载表格 (.csv)",
    close_btn: "关闭面板",
    current_prefix: "正在搜索: ",
    default_btn: "获取 BibTeX",
    urls_copied: "URLs 已复制到剪贴板！",
    // 新增的关闭相关提示
    close_temporarily: "暂时关闭",
    close_current_url: "当前网址关闭",
    close_current_domain: "当前域名关闭",
    close_config_menu: "配置屏蔽的网址或域名",
    config_modal_title: "屏蔽配置",
    config_url_label: "屏蔽的网址（每行一个）:",
    config_domain_label: "屏蔽的域名（每行一个）:",
    config_save: "保存",
    config_cancel: "取消",
    config_refresh_prompt: "配置已保存。是否刷新页面以应用更改？",
    url_blocked_toast: "按钮已在当前网址关闭，可从插件菜单中调整该配置。",
    domain_blocked_toast: "按钮已在当前域名关闭，可从插件菜单中调整该配置。",
    config_blocked_info: "按钮已被屏蔽。请通过插件菜单调整屏蔽配置。"
  };

  if (!lang.startsWith('zh')) {
      lang_hint = {
          error_no_text: "No text selected and clipboard is empty!",
          clipboard_confirm: "No text selected. Use clipboard content?",
          clipboard_read_err: "Cannot read clipboard.",
          fetching_one: "Fetching...",
          done_copy: "Done & Copied!",
          batch_title: (cur, total) => `Processing: ${cur} / ${total}`,
          batch_done_title: "Batch Complete",
          download_btn: "Download BibTeX",
          copy_urls_btn: "Copy URLs",
          csv_btn: "Download CSV",
          close_btn: "Close",
          current_prefix: "Searching: ",
          default_btn: "Get BibTeX",
          urls_copied: "URLs copied to clipboard!",
          // 新增的关闭相关提示
          close_temporarily: "Temporarily Close",
          close_current_url: "Close for Current URL",
          close_current_domain: "Close for Current Domain",
          close_config_menu: "Configure Blocked URLs or Domains",
          config_modal_title: "Block Configuration",
          config_url_label: "Blocked URLs (one per line):",
          config_domain_label: "Blocked Domains (one per line):",
          config_save: "Save",
          config_cancel: "Cancel",
          config_refresh_prompt: "Configuration saved. Refresh page to apply changes?",
          url_blocked_toast: "Button disabled for current URL. You can adjust this in the plugin menu.",
          domain_blocked_toast: "Button disabled for current domain. You can adjust this in the plugin menu.",
          config_blocked_info: "Button is blocked. Please adjust blocking configuration via plugin menu."
      };
  }

  // --- 屏蔽配置管理函数 ---
  function getBlockedUrls() {
    const urls = GM_getValue('dblp_blocked_urls', '');
    return urls.split('\n').filter(url => url.trim() !== '');
  }

  function getBlockedDomains() {
    const domains = GM_getValue('dblp_blocked_domains', '');
    return domains.split('\n').filter(domain => domain.trim() !== '');
  }

  function isBlocked() {
    const currentUrl = window.location.href;
    const currentDomain = window.location.hostname;

    const blockedUrls = getBlockedUrls();
    const blockedDomains = getBlockedDomains();

    return blockedUrls.includes(currentUrl) || blockedDomains.includes(currentDomain);
  }

  // --- UI Elements Creation ---

  // 1. Trigger Button (现在包装在容器中以便添加关闭按钮)
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = "position: fixed; bottom: 10px; left: 10px; z-index: 9999; background: transparent; display: flex; flex-direction: column; align-items: flex-start;";

  const button = document.createElement('button');
  button.innerText = lang_hint.default_btn;
  button.style.cssText = "padding: 10px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer; white-space: pre; text-align: center; margin: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.2);";

  // 添加右上角关闭按钮
  const closeBtnTop = document.createElement('button');
  closeBtnTop.innerHTML = '×';
  closeBtnTop.style.cssText = "position: absolute; top: -8px; right: -8px; width: 20px; height: 20px; background: #ff4444; color: white; border: none; border-radius: 50%; font-size: 14px; font-weight: bold; cursor: pointer; padding: 0; line-height: 1; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.3); z-index: 10000;";
  closeBtnTop.title = lang_hint.close_temporarily;

  buttonContainer.appendChild(button);
  buttonContainer.appendChild(closeBtnTop);
  document.body.appendChild(buttonContainer);

  // 2. 关闭选项模态框
  const closeModal = document.createElement('div');
  closeModal.id = 'dblp-close-modal';
  closeModal.innerHTML = `
      <div style="font-weight:bold; margin-bottom:15px; font-size:16px;">${lang_hint.close_temporarily}</div>
      <button class="dblp-close-option" id="dblp-close-temp">${lang_hint.close_temporarily}</button>
      <button class="dblp-close-option" id="dblp-close-url">${lang_hint.close_current_url}</button>
      <button class="dblp-close-option" id="dblp-close-domain">${lang_hint.close_current_domain}</button>
  `;
  document.body.appendChild(closeModal);

  // 3. 配置编辑模态框
  const configModal = document.createElement('div');
  configModal.id = 'dblp-config-modal';
  configModal.innerHTML = `
      <div style="font-weight:bold; margin-bottom:20px; font-size:16px;">${lang_hint.config_modal_title}</div>
      <div class="dblp-config-section">
          <label class="dblp-config-label">${lang_hint.config_url_label}</label>
          <textarea class="dblp-config-textarea" id="dblp-config-urls"></textarea>
      </div>
      <div class="dblp-config-section">
          <label class="dblp-config-label">${lang_hint.config_domain_label}</label>
          <textarea class="dblp-config-textarea" id="dblp-config-domains"></textarea>
      </div>
      <div class="dblp-config-buttons">
          <button id="dblp-config-save" class="dblp-btn" style="background:#28a745; color:white;">${lang_hint.config_save}</button>
          <button id="dblp-config-cancel" class="dblp-btn" style="background:#dc3545; color:white;">${lang_hint.config_cancel}</button>
      </div>
  `;
  document.body.appendChild(configModal);

  // 4. Batch Overlay
  const overlay = document.createElement('div');
  overlay.id = 'dblp-batch-overlay';
  overlay.innerHTML = `
      <div id="dblp-batch-title"></div>
      <div id="dblp-batch-current"></div>
      <div style="display:flex; flex-direction:column; gap:10px; align-items:center;">
        <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
             <button id="dblp-btn-download" class="dblp-btn">${lang_hint.download_btn}</button>
             <button id="dblp-btn-csv" class="dblp-btn">${lang_hint.csv_btn}</button>
             <button id="dblp-btn-copy-urls" class="dblp-btn">${lang_hint.copy_urls_btn}</button>
        </div>
        <button id="dblp-btn-close" class="dblp-btn" style="display:none; width: 120px;">${lang_hint.close_btn}</button>
      </div>
  `;
  document.body.appendChild(overlay);

  // 5. Confirm Modal
  const confirmModal = document.createElement('div');
  confirmModal.id = 'dblp-confirm-modal';
  confirmModal.innerHTML = `
      <div style="font-weight:bold; margin-bottom:10px;">${lang_hint.clipboard_confirm}</div>
      <div id="dblp-confirm-text"></div>
      <div style="display:flex; justify-content:center; gap:10px;">
          <button id="dblp-confirm-yes" class="dblp-btn" style="background:#28a745; color:white;">Yes</button>
          <button id="dblp-confirm-no" class="dblp-btn" style="background:#dc3545; color:white;">No</button>
      </div>
  `;
  document.body.appendChild(confirmModal);

  // --- Logic Variables ---
  let batchResults = []; // Stores BibTeX strings
  let batchLines = [];   // Stores original queries
  let isBatchProcessing = false;

  // --- Helper Functions ---

  function extractBibField(bibtex, fieldName) {
    if (!bibtex || bibtex === "None") return "None";

    const regex = new RegExp(`${fieldName}\\s*=\\s*\\{`, "i");
    const match = bibtex.match(regex);

    if (!match) return "None";

    let openCount = 1;
    let content = "";
    let startIndex = match.index + match[0].length;

    for (let i = startIndex; i < bibtex.length; i++) {
        const char = bibtex[i];
        if (char === '{') {
            openCount++;
        } else if (char === '}') {
            openCount--;
        }

        if (openCount === 0) {
            break;
        }
        content += char;
    }

    return content.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
  }

  function downloadContent(content, filename) {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'download.txt';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  }

  function fetchBibTeX(query, silent, callback) {
    const searchUrl = `https://dblp.org/search?q=${encodeURIComponent(query)}`;
    GM_xmlhttpRequest({
        method: 'GET',
        url: searchUrl,
        headers: headers,
        onload: function(response) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');
            const bibLink = doc.querySelector('a[href*="?view=bibtex"]');
            if (!bibLink) {
                if(!silent) Toast("BibTeX Not Found");
                callback("None");
                return;
            }
            const bibUrl = bibLink.href.replace('.html?view=bibtex', '.bib');
            GM_xmlhttpRequest({
                method: 'GET',
                url: bibUrl,
                headers: headers,
                onload: function(bibResponse) {
                    callback(bibResponse.responseText);
                },
                onerror: function() {
                    if(!silent) Toast("Error fetching bib file");
                    callback("None");
                }
            });
        },
        onerror: function() {
            if(!silent) Toast("Error searching DBLP");
            callback("None");
        }
    });
  }

  // --- 关闭相关函数 ---
  function showCloseOptions() {
    closeModal.style.display = 'block';
  }

  function hideCloseOptions() {
    closeModal.style.display = 'none';
  }

  function showConfigModal() {
    // 加载当前配置
    const blockedUrls = getBlockedUrls().join('\n');
    const blockedDomains = getBlockedDomains().join('\n');

    document.getElementById('dblp-config-urls').value = blockedUrls;
    document.getElementById('dblp-config-domains').value = blockedDomains;

    configModal.style.display = 'block';
  }

  function hideConfigModal() {
    configModal.style.display = 'none';
  }

  // --- Event Handlers ---

  const titleEl = document.getElementById('dblp-batch-title');
  const currentEl = document.getElementById('dblp-batch-current');
  const downloadBtn = document.getElementById('dblp-btn-download');
  const csvBtn = document.getElementById('dblp-btn-csv');
  const copyUrlsBtn = document.getElementById('dblp-btn-copy-urls');
  const closeBtn = document.getElementById('dblp-btn-close');

  // 关闭选项按钮事件
  closeBtnTop.addEventListener('click', function(e) {
    e.stopPropagation();
    showCloseOptions();
  });

  // 关闭选项事件
  document.getElementById('dblp-close-temp').addEventListener('click', function() {
    buttonContainer.style.display = 'none';
    hideCloseOptions();
  });

  document.getElementById('dblp-close-url').addEventListener('click', function() {
    const currentUrl = window.location.href;
    const blockedUrls = getBlockedUrls();

    if (!blockedUrls.includes(currentUrl)) {
      blockedUrls.push(currentUrl);
      GM_setValue('dblp_blocked_urls', blockedUrls.join('\n'));
    }

    buttonContainer.style.display = 'none';
    hideCloseOptions();
    Toast(lang_hint.url_blocked_toast);
  });

  document.getElementById('dblp-close-domain').addEventListener('click', function() {
    const currentDomain = window.location.hostname;
    const blockedDomains = getBlockedDomains();

    if (!blockedDomains.includes(currentDomain)) {
      blockedDomains.push(currentDomain);
      GM_setValue('dblp_blocked_domains', blockedDomains.join('\n'));
    }

    buttonContainer.style.display = 'none';
    hideCloseOptions();
    Toast(lang_hint.domain_blocked_toast);
  });

  // 配置模态框事件
  document.getElementById('dblp-config-save').addEventListener('click', function() {
    const urlsText = document.getElementById('dblp-config-urls').value;
    const domainsText = document.getElementById('dblp-config-domains').value;

    GM_setValue('dblp_blocked_urls', urlsText);
    GM_setValue('dblp_blocked_domains', domainsText);

    hideConfigModal();

    // 询问是否刷新
    if (confirm(lang_hint.config_refresh_prompt)) {
      window.location.reload();
    }
  });

  document.getElementById('dblp-config-cancel').addEventListener('click', function() {
    hideConfigModal();
  });

  // 点击模态框外部关闭
  document.addEventListener('click', function(e) {
    if (closeModal.style.display === 'block' && !closeModal.contains(e.target) && !closeBtnTop.contains(e.target)) {
      hideCloseOptions();
    }
    if (configModal.style.display === 'block' && !configModal.contains(e.target)) {
      hideConfigModal();
    }
  });

  // Helper to get valid results so far
  function getResultsSoFar() {
      // Return objects { line, bib } only for processed items
      return batchLines.map((line, idx) => ({
          line: line,
          bib: batchResults[idx]
      })).filter(item => item.bib !== null && item.bib !== undefined);
  }

  downloadBtn.onclick = () => {
      const results = getResultsSoFar();
      if(results.length === 0) { Toast("Nothing fetched yet."); return; }
      const content = results.map(r => r.bib === "None" ? `% Failed to fetch: ${r.line}` : r.bib).join('\n\n');
      downloadContent(content, 'dblp_bibtex.bib');
  };

  copyUrlsBtn.onclick = () => {
      const results = getResultsSoFar();
      if(results.length === 0) { Toast("Nothing fetched yet."); return; }

      const urlList = results.map(r => {
          if (r.bib === "None") return "None";
          return extractBibField(r.bib, "url");
      }).join('\n');

      GM_setClipboard(urlList);
      Toast(lang_hint.urls_copied);
  };

  csvBtn.onclick = () => {
      const results = getResultsSoFar();
      if(results.length === 0) { Toast("Nothing fetched yet."); return; }

      // CSV Header
      // BOM (\uFEFF) is added so Excel opens it in UTF-8 correctly
      let csvContent = "\uFEFF原始搜索词,提取标题,URL,BibTeX\n";

      // Escape CSV value: wrap in quotes, escape double quotes as ""
      const esc = (val) => {
          if (val === null || val === undefined) return "";
          val = String(val);
          if (val.search(/("|,|\n|\r)/g) >= 0) {
              return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
      };

      csvContent += results.map(r => {
          if (r.bib === "None") {
              return `${esc(r.line)},None,None,None`;
          }
          const title = extractBibField(r.bib, "title");
          const url = extractBibField(r.bib, "url");
          return `${esc(r.line)},${esc(title)},${esc(url)},${esc(r.bib)}`;
      }).join('\n');

      downloadContent(csvContent, 'dblp_results.csv');
  };

  closeBtn.onclick = () => {
      overlay.style.display = 'none';
      isBatchProcessing = false; // Stop if closed early? Or just hide.
  };

  // Clipboard Confirm Logic
  function askClipboard(text) {
      return new Promise((resolve) => {
          document.getElementById('dblp-confirm-text').innerText = text.length > 200 ? text.substring(0, 200) + '...' : text;
          confirmModal.style.display = 'block';

          document.getElementById('dblp-confirm-yes').onclick = () => {
              confirmModal.style.display = 'none';
              resolve(true);
          };
          document.getElementById('dblp-confirm-no').onclick = () => {
              confirmModal.style.display = 'none';
              resolve(false);
          };
      });
  }

  // 修改主按钮点击事件，添加屏蔽检查
  button.addEventListener('click', async function() {
    // 检查是否被屏蔽
    if (isBlocked()) {
      Toast(lang_hint.config_blocked_info);
      return;
    }

    if (isBatchProcessing) {
        Toast("正在批量处理中，请使用中间面板控制");
        return;
    }

    let selection = window.getSelection().toString().trim();

    // Fallback to clipboard
    if (!selection) {
        try {
            const clipText = await navigator.clipboard.readText();
            if (clipText && clipText.trim()) {
                const useClip = await askClipboard(clipText.trim());
                if (useClip) {
                    selection = clipText.trim();
                } else {
                    return;
                }
            } else {
                Toast(lang_hint.error_no_text);
                return;
            }
        } catch (e) {
            Toast(lang_hint.clipboard_read_err);
            return;
        }
    }

    if (!selection) return;

    const lines = selection.split(/[\r\n]+/).map(s => s.trim()).filter(s => s);

    if (lines.length === 0) return;

    if (lines.length === 1) {
        // Single Mode
        Toast(lang_hint.fetching_one, 1000);
        fetchBibTeX(lines[0], false, (res) => {
            if (res && res !== "None") {
                GM_setClipboard(res);
                Toast(lang_hint.done_copy);
            } else {
                Toast("Failed: " + lines[0]);
            }
        });
    } else {
        // Batch Mode
        isBatchProcessing = true;
        batchLines = lines;
        batchResults = new Array(lines.length).fill(null);
        let completedCount = 0;

        // Init UI
        overlay.style.display = 'block';
        closeBtn.style.display = 'none';
        // All buttons visible now to support "Download while fetching"
        // We assume user knows that incomplete items won't be in the download

        titleEl.innerText = lang_hint.batch_title(0, lines.length);
        currentEl.innerText = "Initializing...";

        lines.forEach((line, index) => {
            setTimeout(() => {
                if (!isBatchProcessing) return; // Stop if canceled/closed logic added later

                currentEl.innerText = lang_hint.current_prefix + line;

                fetchBibTeX(line, true, (result) => {
                    batchResults[index] = result === "None" ? "None" : result;
                    completedCount++;

                    if (isBatchProcessing) {
                        titleEl.innerText = lang_hint.batch_title(completedCount, lines.length);
                    }

                    if (completedCount === lines.length) {
                        isBatchProcessing = false;
                        titleEl.innerText = lang_hint.batch_done_title;
                        currentEl.innerText = "";
                        closeBtn.style.display = 'inline-block';

                        // Auto Copy BibTeX (optional, maybe annoying for huge lists, but requested in v1)
                        const finalContent = batchResults.map(r => r === "None" ? "% Failed" : r).join('\n\n');
                        GM_setClipboard(finalContent);
                        Toast(lang_hint.done_copy);
                    }
                });
            }, index * 800);
        });
    }
  });

  // 修改原有的显示/隐藏菜单
  GM_registerMenuCommand(lang_hint.default_btn === "Get BibTeX" ? "Show/Hide Button" : "显示/隐藏按钮", function() {
    // 如果被屏蔽，先提示
    if (isBlocked()) {
      Toast(lang_hint.config_blocked_info);
      return;
    }

    buttonContainer.style.display = buttonContainer.style.display === 'none' ? 'flex' : 'none';
    GM_setValue('showButton', buttonContainer.style.display === 'flex');
  });

  // 新增配置屏蔽菜单
  GM_registerMenuCommand(lang_hint.close_config_menu, function() {
    showConfigModal();
  });

  // 初始化时检查屏蔽状态
  if (isBlocked()) {
    buttonContainer.style.display = 'none';
  } else {
    // 原有的显示/隐藏逻辑
    if (!GM_getValue('showButton', true)) {
        buttonContainer.style.display = 'none';
    }
  }

})();