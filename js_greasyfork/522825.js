// ==UserScript==
// @name         标题批量导出DBLP的BibTeX
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在网页左下角生成一个按钮，从dblp中获取选定文本的BibTeX并复制到剪贴板。支持批量获取，支持从剪贴板读取，支持随时下载，支持导出URL和CSV。白名单模式。
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

/* Whitelist Modal */
#dblp-whitelist-modal {
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9); color: white; padding: 25px;
    border-radius: 10px; z-index: 100002; display: none;
    width: 400px; max-width: 90%; text-align: center;
    backdrop-filter: blur(5px); box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}
#dblp-whitelist-textarea {
    width: 100%; height: 150px; background: rgba(255,255,255,0.1); color: #fff;
    border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 10px;
    margin: 15px 0; font-family: monospace; resize: vertical; box-sizing: border-box; outline: none;
}
#dblp-whitelist-textarea:focus { border-color: #007BFF; }
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
    // 白名单相关提示
    menu_whitelist_config: "设置站点白名单",
    menu_add_current: "将本域名添加到白名单",
    menu_disable: "全局禁用",
    menu_enable: "启用功能",
    whitelist_prompt: "请输入白名单域名（每行一个）：",
    whitelist_saved: "白名单已保存",
    domain_added: "域名已添加到白名单",
    domain_already_exists: "该域名已在白名单中",
    feature_disabled: "功能已全局禁用",
    feature_enabled: "功能已启用"
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
          // 白名单相关提示
          menu_whitelist_config: "Configure Site Whitelist",
          menu_add_current: "Add Current Domain to Whitelist",
          menu_disable: "Disable Globally",
          menu_enable: "Enable Feature",
          whitelist_prompt: "Enter whitelist domains (one per line):",
          whitelist_saved: "Whitelist saved",
          domain_added: "Domain added to whitelist",
          domain_already_exists: "Domain already in whitelist",
          feature_disabled: "Feature disabled globally",
          feature_enabled: "Feature enabled"
      };
  }

  // --- 白名单配置管理函数 ---
  const DEFAULT_WHITELIST = ['dblp.org', 'scholar.google.com'];

  function getWhitelist() {
    const saved = GM_getValue('dblp_whitelist', '');
    if (!saved) {
      return DEFAULT_WHITELIST;
    }
    return saved.split('\n').filter(domain => domain.trim() !== '');
  }

  function saveWhitelist(domains) {
    GM_setValue('dblp_whitelist', domains.join('\n'));
  }

  function isInWhitelist() {
    const currentDomain = window.location.hostname;
    const whitelist = getWhitelist();

    return whitelist.some(domain => {
      // 支持完整匹配或子域名匹配
      return currentDomain === domain || currentDomain.endsWith('.' + domain);
    });
  }

  function isGloballyEnabled() {
    return GM_getValue('dblp_enabled', true);
  }

  function setGlobalEnabled(enabled) {
    GM_setValue('dblp_enabled', enabled);
  }

  // --- UI Elements Creation ---

  // 1. Trigger Button (不再需要关闭按钮)
  const button = document.createElement('button');
  button.innerText = lang_hint.default_btn;
  button.style.cssText = "position: fixed; bottom: 10px; left: 10px; z-index: 9999; padding: 10px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer; white-space: pre; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);";
  document.body.appendChild(button);

  // 2. Batch Overlay
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

  // 3. Confirm Modal
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

  // 4. Whitelist Modal (新增面板)
  const whitelistModal = document.createElement('div');
  whitelistModal.id = 'dblp-whitelist-modal';
  whitelistModal.innerHTML = `
      <div style="font-size:18px; font-weight:bold; margin-bottom:10px;">${lang_hint.menu_whitelist_config}</div>
      <div style="font-size:12px; color:#aaa; margin-bottom:5px; text-align:left;">${lang_hint.whitelist_prompt}</div>
      <textarea id="dblp-whitelist-textarea"></textarea>
      <div style="display:flex; justify-content:center; gap:10px;">
          <button id="dblp-whitelist-save" class="dblp-btn" style="background:#28a745; color:white;">Save</button>
          <button id="dblp-whitelist-cancel" class="dblp-btn" style="background:#6c757d; color:white;">Cancel</button>
      </div>
  `;
  document.body.appendChild(whitelistModal);

  // 面板按钮事件
  const whitelistTextarea = document.getElementById('dblp-whitelist-textarea');

  document.getElementById('dblp-whitelist-save').onclick = () => {
      const text = whitelistTextarea.value;
      const domains = text.split('\n').map(d => d.trim()).filter(d => d !== '');
      saveWhitelist(domains);
      Toast(lang_hint.whitelist_saved);
      updateButtonVisibility();
      whitelistModal.style.display = 'none';
  };

  document.getElementById('dblp-whitelist-cancel').onclick = () => {
      whitelistModal.style.display = 'none';
  };

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

  // --- Event Handlers ---

  const titleEl = document.getElementById('dblp-batch-title');
  const currentEl = document.getElementById('dblp-batch-current');
  const downloadBtn = document.getElementById('dblp-btn-download');
  const csvBtn = document.getElementById('dblp-btn-csv');
  const copyUrlsBtn = document.getElementById('dblp-btn-copy-urls');
  const closeBtn = document.getElementById('dblp-btn-close');

  // Helper to get valid results so far
  function getResultsSoFar() {
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

      let csvContent = "\uFEFF原始搜索词,提取标题,URL,BibTeX\n";

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
      isBatchProcessing = false;
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

  // 主按钮点击事件
  button.addEventListener('click', async function() {
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

        overlay.style.display = 'block';
        closeBtn.style.display = 'none';

        titleEl.innerText = lang_hint.batch_title(0, lines.length);
        currentEl.innerText = "Initializing...";

        lines.forEach((line, index) => {
            setTimeout(() => {
                if (!isBatchProcessing) return;

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

                        const finalContent = batchResults.map(r => r === "None" ? "% Failed" : r).join('\n\n');
                        GM_setClipboard(finalContent);
                        Toast(lang_hint.done_copy);
                    }
                });
            }, index * 800);
        });
    }
  });

  // --- 注册菜单命令 ---

  // 1. 设置站点白名单
  // 1. 设置站点白名单 (已修改为面板模式)
  GM_registerMenuCommand(lang_hint.menu_whitelist_config, function() {
    const currentWhitelist = getWhitelist().join('\n');
    whitelistTextarea.value = currentWhitelist;
    whitelistModal.style.display = 'block';
  });

  // 2. 将本域名添加到白名单
  GM_registerMenuCommand(lang_hint.menu_add_current, function() {
    const currentDomain = window.location.hostname;
    const whitelist = getWhitelist();

    if (whitelist.includes(currentDomain)) {
      Toast(lang_hint.domain_already_exists);
      return;
    }

    whitelist.push(currentDomain);
    saveWhitelist(whitelist);
    Toast(lang_hint.domain_added);

    // 刷新按钮显示状态
    updateButtonVisibility();
  });

  // 3. 全局禁用/启用（动态切换）
  let disableMenuId = null;

  function updateDisableMenu() {
    const isEnabled = isGloballyEnabled();
    const menuText = isEnabled ? lang_hint.menu_disable : lang_hint.menu_enable;

    if (disableMenuId !== null) {
      // Tampermonkey 不支持直接更新菜单，所以我们只能重新注册
      // 但由于 GM_registerMenuCommand 会累积菜单项，这里采用简单方案
    }

    disableMenuId = GM_registerMenuCommand(menuText, function() {
      const currentState = isGloballyEnabled();
      setGlobalEnabled(!currentState);
      Toast(!currentState ? lang_hint.feature_enabled : lang_hint.feature_disabled);

      // 刷新按钮显示状态
      updateButtonVisibility();

      // 刷新页面以更新菜单文本
      setTimeout(() => window.location.reload(), 1000);
    });
  }

  // 初始化禁用/启用菜单
  updateDisableMenu();

  // --- 按钮显示逻辑 ---
  function updateButtonVisibility() {
    if (!isGloballyEnabled()) {
      button.style.display = 'none';
      return;
    }

    if (isInWhitelist()) {
      button.style.display = 'block';
    } else {
      button.style.display = 'none';
    }
  }

  // 初始化按钮显示状态
  updateButtonVisibility();

})();
