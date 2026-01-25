// ==UserScript==
// @name         标题批量导出DBLP的BibTeX
// @namespace    http://tampermonkey.net/
// @version      3.1
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
    padding-top: 35px;
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
    min-height: 5px;
}

#dblp-failed-section {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid rgba(255,255,255,0.2);
    display: none;
    text-align: left;
}

#dblp-failed-title {
    font-size: 13px;
    color: #ff6b6b;
    margin-bottom: 8px;
    font-weight: bold;
}

#dblp-failed-textarea {
    width: 100%;
    min-height: 80px;
    max-height: 150px;
    background: rgba(255,255,255,0.1);
    color: #ffcccc;
    border: 1px solid rgba(255,107,107,0.3);
    border-radius: 6px;
    padding: 10px;
    font-family: monospace;
    font-size: 12px;
    resize: vertical;
    box-sizing: border-box;
    outline: none;
}

#dblp-failed-textarea:focus {
    border-color: rgba(255,107,107,0.6);
    background: rgba(255,255,255,0.15);
}

#dblp-close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(128, 128, 128, 0.3);
    border: 1px solid rgba(255,255,255,0.2);
    color: #ddd;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    padding: 0;
}

#dblp-close-btn:hover {
    background: rgba(128, 128, 128, 0.5);
    color: white;
    transform: scale(1.1);
}

#dblp-failed-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

#dblp-success-section {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid rgba(255,255,255,0.2);
    display: none;
    text-align: left;
}

#dblp-success-title {
    font-size: 13px;
    color: #51cf66;
    margin-bottom: 8px;
    font-weight: bold;
}

#dblp-success-textarea {
    width: 100%;
    min-height: 100px;
    max-height: 200px;
    background: rgba(255,255,255,0.1);
    color: #ccffdd;
    border: 1px solid rgba(81, 207, 102, 0.3);
    border-radius: 6px;
    padding: 10px;
    font-family: monospace;
    font-size: 12px;
    resize: vertical;
    box-sizing: border-box;
    outline: none;
}

#dblp-success-textarea:focus {
    border-color: rgba(81, 207, 102, 0.6);
    background: rgba(255,255,255,0.15);
}

#dblp-result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.dblp-action-btn {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 4px;
    color: #ddd;
    cursor: pointer;
    padding: 4px 10px;
    font-size: 12px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 4px;
}

.dblp-action-btn:hover {
    background: rgba(255,255,255,0.2);
    color: white;
    transform: translateY(-1px);
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

/* Scholar Confirm Modal */
#dblp-scholar-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 20px;
    border-radius: 10px;
    z-index: 100004;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    text-align: center;
    max-width: 500px;
    width: 90%;
    display: none;
    backdrop-filter: blur(5px);
}
#dblp-scholar-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
}
#dblp-scholar-list {
    background: rgba(255,255,255,0.1);
    padding: 10px;
    margin: 10px 0;
    border-radius: 6px;
    max-height: 200px;
    overflow-y: auto;
    text-align: left;
    font-size: 12px;
    font-family: monospace;
}
#dblp-scholar-item {
    padding: 4px 8px;
    margin: 2px 0;
    background: rgba(255,255,255,0.05);
    border-radius: 4px;
    word-break: break-all;
}
#dblp-scholar-item:hover {
    background: rgba(255,255,255,0.15);
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

/* Citation Format Modal */
#dblp-citation-modal {
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9); color: white; padding: 25px;
    border-radius: 10px; z-index: 100003; display: none;
    width: 450px; max-width: 90%; text-align: left;
    backdrop-filter: blur(5px); box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}
#dblp-citation-modal h3 {
    font-size: 18px; font-weight: bold; margin-bottom: 15px; text-align: center;
}
#dblp-citation-presets {
    display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;
}
.dblp-citation-preset {
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    border-radius: 6px; padding: 10px; cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; gap: 10px;
}
.dblp-citation-preset:hover { background: rgba(255,255,255,0.2); }
.dblp-citation-preset.active {
    background: rgba(0, 123, 255, 0.3); border-color: #007BFF;
}
.dblp-citation-preset input[type="radio"] {
    margin: 0; cursor: pointer;
}
.dblp-citation-preset-label {
    flex: 1; font-size: 13px;
}
.dblp-citation-preset-example {
    font-size: 11px; color: #aaa; font-family: monospace;
}
#dblp-citation-custom-section {
    border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; margin-top: 10px;
}
#dblp-citation-custom-input {
    width: 100%; background: rgba(255,255,255,0.1); color: #fff;
    border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 10px;
    margin: 10px 0; font-family: monospace; box-sizing: border-box; outline: none;
}
#dblp-citation-custom-input:focus { border-color: #007BFF; }
#dblp-citation-help {
    font-size: 11px; color: #aaa; line-height: 1.6; margin-bottom: 15px;
}
#dblp-citation-preview {
    background: rgba(0, 123, 255, 0.2); border-radius: 6px; padding: 10px;
    margin: 10px 0; font-family: monospace; font-size: 12px; text-align: center;
    min-height: 40px; display: flex; align-items: center; justify-content: center;
}
.dblp-modal-buttons {
    display: flex; justify-content: center; gap: 10px; margin-top: 15px;
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
    batch_done_title: (total) => `批量提取完成（${total}条）`,
    download_btn: "下载 BibTeX (.bib)",
    copy_urls_btn: "仅复制 URL",
    csv_btn: "下载表格 (.csv)",
    close_btn: "关闭面板",
    current_prefix: "正在搜索: ",
    default_btn: "获取 BibTeX",
    urls_copied: "URLs 已复制到剪贴板！",
    // 失败提示
    failed_summary: (failed) => `以下是获取失败的（${failed} 条），点击谷歌搜索：`,
    success_summary: (total) => `成功提取结果（${total} 条）：`,
    copied_to_clipboard: "已复制到剪贴板",
    scholar_confirm_title: "确认打开以下 Google Scholar 搜索？",
    scholar_confirm_open: "打开",
    scholar_confirm_cancel: "取消",
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
    feature_enabled: "功能已启用",
    // 引用格式相关提示
    menu_citation_config: "设置引用标志格式",
    citation_title: "引用标志格式设置",
    citation_preset_default: "默认（DBLP原始）",
    citation_preset_author_year: "作者姓氏 + 年份",
    citation_preset_firstword_year_author: "题目首词 + 年份 + 作者首词",
    citation_preset_author_year_title: "作者 + 年份 + 题目关键词",
    citation_custom_label: "自定义模板",
    citation_help: "可用占位符：{firstAuthor}第一作者姓氏, {year}年份, {firstWord}标题首词, {titleWords:N}标题前N词",
    citation_preview: "预览：",
    citation_saved: "引用格式已保存",
    citation_example_title: "示例：Deep Learning for NLP (2024, 作者: Smith, Johnson)"
  };

  if (!lang.startsWith('zh')) {
      lang_hint = {
          error_no_text: "No text selected and clipboard is empty!",
          clipboard_confirm: "No text selected. Use clipboard content?",
          clipboard_read_err: "Cannot read clipboard.",
          fetching_one: "Fetching...",
          done_copy: "Done & Copied!",
          batch_title: (cur, total) => `Processing: ${cur} / ${total}`,
          batch_done_title: (total) => `Batch Complete (${total} items)`,
          download_btn: "Download BibTeX",
          copy_urls_btn: "Copy URLs",
          csv_btn: "Download CSV",
          close_btn: "Close",
          current_prefix: "Searching: ",
          default_btn: "Get BibTeX",
          urls_copied: "URLs copied to clipboard!",
          // 失败提示
          failed_summary: (failed) => `Failed items (${failed}), click to Google Scholar:`,
          success_summary: (total) => `Successful results (${total} items):`,
          copied_to_clipboard: "Copied to clipboard",
          scholar_confirm_title: "Open the following Google Scholar searches?",
          scholar_confirm_open: "Open",
          scholar_confirm_cancel: "Cancel",
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
          feature_enabled: "Feature enabled",
          // 引用格式相关提示
          menu_citation_config: "Configure Citation Key Format",
          citation_title: "Citation Key Format Settings",
          citation_preset_default: "Default (DBLP Original)",
          citation_preset_author_year: "Author Surname + Year",
          citation_preset_firstword_year_author: "First Word + Year + First Author",
          citation_preset_author_year_title: "Author + Year + Title Keyword",
          citation_custom_label: "Custom Template",
          citation_help: "Available placeholders: {firstAuthor} first author surname, {year} year, {firstWord} first title word, {titleWords:N} first N title words",
          citation_preview: "Preview: ",
          citation_saved: "Citation format saved",
          citation_example_title: "Example: Deep Learning for NLP (2024, Authors: Smith, Johnson)"
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

  // --- 引用格式配置管理函数 ---

  // 预设格式定义
  const CITATION_PRESETS = {
    default: {
      name: 'citation_preset_default',
      template: null, // null表示保持原始格式
      example: 'DBLP:conf/aaai/Smith2024'
    },
    author_year: {
      name: 'citation_preset_author_year',
      template: '{firstAuthor}{year}',
      example: 'Smith2024'
    },
    firstword_year_author: {
      name: 'citation_preset_firstword_year_author',
      template: '{firstWord}{year}{firstAuthor}',
      example: 'Deep2024Smith'
    },
    author_year_title: {
      name: 'citation_preset_author_year_title',
      template: '{firstAuthor}{year}{firstWord}',
      example: 'Smith2024Deep'
    }
  };

  function getCitationFormat() {
    return GM_getValue('dblp_citation_format', 'default');
  }

  function getCustomTemplate() {
    return GM_getValue('dblp_custom_template', '{firstAuthor}{year}');
  }

  function saveCitationFormat(format) {
    GM_setValue('dblp_citation_format', format);
  }

  function saveCustomTemplate(template) {
    GM_setValue('dblp_custom_template', template);
  }

  // 解析BibTeX字段并生成新的引用标志
  function generateCitationKey(bibtex) {
    if (!bibtex || bibtex === "None") return null;

    const format = getCitationFormat();
    let template = null;

    if (format === 'custom') {
      template = getCustomTemplate();
    } else if (CITATION_PRESETS[format]) {
      template = CITATION_PRESETS[format].template;
    }

    // 如果模板为null，保持原始格式
    if (!template) return null;

    // 提取BibTeX字段
    const author = extractBibField(bibtex, "author");
    const title = extractBibField(bibtex, "title");
    const year = extractBibField(bibtex, "year");

    // 解析作者
    let firstAuthorSurname = "Unknown";
    if (author && author !== "None") {
      // 作者格式通常是 "Surname, Name" 或 "Surname, Name and Surname, Name"
      const firstAuthor = author.split(' and ')[0].trim();
      const surnameMatch = firstAuthor.match(/^([A-Za-z]+),/);
      if (surnameMatch) {
        firstAuthorSurname = surnameMatch[1];
      } else {
        // 如果没有逗号，取整个第一个部分
        firstAuthorSurname = firstAuthor.split(' ')[0];
      }
    }

    // 解析年份
    let citationYear = year && year !== "None" ? year : "n.d.";

    // 解析标题首词
    let firstWord = "Unknown";
    if (title && title !== "None") {
      // 移除特殊字符，取第一个单词
      const cleanTitle = title.replace(/[{}]/g, '').trim();
      const words = cleanTitle.split(/\s+/);
      if (words.length > 0) {
        firstWord = words[0].replace(/[^a-zA-Z0-9]/g, '');
      }
    }

    // 替换模板占位符
    let newKey = template
      .replace(/{firstAuthor}/g, firstAuthorSurname)
      .replace(/{year}/g, citationYear)
      .replace(/{firstWord}/g, firstWord);

    // 处理 {titleWords:N} 占位符
    const titleWordsMatch = template.match(/{titleWords:(\d+)}/g);
    if (titleWordsMatch && title && title !== "None") {
      const cleanTitle = title.replace(/[{}]/g, '').trim();
      const words = cleanTitle.split(/\s+/).map(w => w.replace(/[^a-zA-Z0-9]/g, '')).filter(w => w);

      titleWordsMatch.forEach(match => {
        const n = parseInt(match.match(/{titleWords:(\d+)}/)[1]);
        const selectedWords = words.slice(0, Math.min(n, words.length));
        const wordsStr = selectedWords.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
        newKey = newKey.replace(match, wordsStr);
      });
    }

    // 确保首字母大写，其余小写（对于作者和首词）
    newKey = newKey.replace(/(^|[^a-zA-Z])([a-z])/g, (_, prefix, letter) => {
      return prefix + letter.toUpperCase();
    });

    return newKey;
  }

  // 替换BibTeX中的引用标志
  function rewriteBibTeXCitationKey(bibtex) {
    if (!bibtex || bibtex === "None") return bibtex;

    const newKey = generateCitationKey(bibtex);
    if (!newKey) return bibtex;

    // 匹配 @type {oldKey, 替换为 @type {newKey,
    const citeKeyMatch = bibtex.match(/^@\w+\s*\{([^,]+),/);
    if (citeKeyMatch) {
      const oldKey = citeKeyMatch[1];
      return bibtex.replace(/^@\w+\s*\{([^,]+),/, `@${citeKeyMatch[0].match(/^@(\w+)/)[1]} {${newKey},`);
    }

    return bibtex;
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
      <button id="dblp-close-btn">&times;</button>
      <div id="dblp-batch-title"></div>
      <div id="dblp-batch-current"></div>
      <div id="dblp-success-section">
          <div id="dblp-result-header">
              <div id="dblp-success-title"></div>
              <button id="dblp-copy-success" class="dblp-action-btn">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style="display:block"><path d="M6.14923 4.02032C7.11191 4.02032 7.87977 4.02017 8.49591 4.07599C9.12122 4.1327 9.65786 4.25188 10.1414 4.53107C10.7201 4.8653 11.2008 5.34591 11.535 5.92462C11.8142 6.40818 11.9333 6.94482 11.9901 7.57013C12.0459 8.18625 12.0457 8.9542 12.0457 9.91681C12.0457 10.8795 12.0459 11.6474 11.9901 12.2635C11.9333 12.8888 11.8142 13.4254 11.535 13.909C11.2008 14.4877 10.7201 14.9683 10.1414 15.3026C9.65786 15.5817 9.12122 15.7009 8.49591 15.7576C7.87977 15.8134 7.1119 15.8133 6.14923 15.8133C5.18661 15.8133 4.41868 15.8134 3.80255 15.7576C3.17724 15.7009 2.6406 15.5817 2.15704 15.3026C1.57834 14.9684 1.09772 14.4877 0.763489 13.909C0.484305 13.4254 0.365123 12.8888 0.308411 12.2635C0.252587 11.6474 0.252747 10.8795 0.252747 9.91681C0.252747 8.95419 0.252603 8.18625 0.308411 7.57013C0.365123 6.94482 0.484305 6.40818 0.763489 5.92462C1.09771 5.3459 1.57833 4.86529 2.15704 4.53107C2.6406 4.25188 3.17724 4.1327 3.80255 4.07599C4.41868 4.02018 5.1866 4.02032 6.14923 4.02032ZM6.14923 5.37775C5.16175 5.37775 4.46628 5.37761 3.9256 5.42657C3.39428 5.47473 3.07853 5.56574 2.83575 5.70587C2.46313 5.92106 2.15348 6.23071 1.93829 6.60333C1.79817 6.84611 1.70715 7.16185 1.659 7.69318C1.61004 8.23385 1.61017 8.92934 1.61017 9.91681C1.61017 10.9043 1.61002 11.5998 1.659 12.1404C1.70715 12.6717 1.79817 12.9875 1.93829 13.2303C2.15349 13.6029 2.46315 13.9126 2.83575 14.1277C3.07853 14.2679 3.39428 14.3589 3.9256 14.407C4.46628 14.456 5.16176 14.4559 6.14923 14.4559C7.13675 14.4559 7.83218 14.456 8.37286 14.407C8.90419 14.3589 9.21993 14.2679 9.46271 14.1277C9.83529 13.9126 10.145 13.6029 10.3602 13.2303C10.5003 12.9875 10.5913 12.6718 10.6395 12.1404C10.6884 11.5998 10.6883 10.9043 10.6883 9.91681C10.6883 8.92935 10.6884 8.23385 10.6395 7.69318C10.5913 7.16185 10.5003 6.84611 10.3602 6.60333C10.145 6.23072 9.8353 5.92107 9.46271 5.70587C9.21993 5.56574 8.90418 5.47473 8.37286 5.42657C7.83218 5.3776 7.13676 5.37775 6.14923 5.37775ZM9.80157 0.367981C10.7637 0.367981 11.5313 0.367886 12.1473 0.423645C12.7725 0.480313 13.3093 0.598765 13.7928 0.877747C14.3716 1.21192 14.852 1.69355 15.1863 2.27228C15.4655 2.75575 15.5857 3.29165 15.6424 3.91681C15.6982 4.53301 15.6971 5.30161 15.6971 6.26447V7.8299C15.6971 8.29265 15.6989 8.58994 15.6649 8.84845C15.4667 10.3525 14.4009 11.5738 12.9832 11.9988V10.5467C13.6973 10.1903 14.2104 9.49662 14.3192 8.67169C14.3387 8.52348 14.3406 8.3358 14.3406 7.8299V6.26447C14.3406 5.27707 14.3398 4.58149 14.2908 4.04083C14.2427 3.50969 14.1526 3.19373 14.0125 2.95099C13.7974 2.5785 13.4875 2.2687 13.1151 2.05353C12.8723 1.91347 12.5563 1.82237 12.0252 1.77423C11.4846 1.72528 10.7888 1.7254 9.80157 1.7254H7.71466C6.75614 1.72559 5.92659 2.27697 5.52325 3.07892H4.07013C4.54215 1.51132 5.99314 0.368192 7.71466 0.367981H9.80157Z" fill="currentColor"></path></svg>
                  复制
              </button>
          </div>
          <textarea id="dblp-success-textarea" readonly></textarea>
      </div>
      <div id="dblp-failed-section">
          <div id="dblp-failed-header">
              <div id="dblp-failed-title"></div>
              <div style="display:flex; gap:8px;">
                  <button id="dblp-retry-btn" class="dblp-action-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:block"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      Scholar
                  </button>
                  <button id="dblp-copy-failed" class="dblp-action-btn">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style="display:block"><path d="M6.14923 4.02032C7.11191 4.02032 7.87977 4.02017 8.49591 4.07599C9.12122 4.1327 9.65786 4.25188 10.1414 4.53107C10.7201 4.8653 11.2008 5.34591 11.535 5.92462C11.8142 6.40818 11.9333 6.94482 11.9901 7.57013C12.0459 8.18625 12.0457 8.9542 12.0457 9.91681C12.0457 10.8795 12.0459 11.6474 11.9901 12.2635C11.9333 12.8888 11.8142 13.4254 11.535 13.909C11.2008 14.4877 10.7201 14.9683 10.1414 15.3026C9.65786 15.5817 9.12122 15.7009 8.49591 15.7576C7.87977 15.8134 7.1119 15.8133 6.14923 15.8133C5.18661 15.8133 4.41868 15.8134 3.80255 15.7576C3.17724 15.7009 2.6406 15.5817 2.15704 15.3026C1.57834 14.9684 1.09772 14.4877 0.763489 13.909C0.484305 13.4254 0.365123 12.8888 0.308411 12.2635C0.252587 11.6474 0.252747 10.8795 0.252747 9.91681C0.252747 8.95419 0.252603 8.18625 0.308411 7.57013C0.365123 6.94482 0.484305 6.40818 0.763489 5.92462C1.09771 5.3459 1.57833 4.86529 2.15704 4.53107C2.6406 4.25188 3.17724 4.1327 3.80255 4.07599C4.41868 4.02018 5.1866 4.02032 6.14923 4.02032ZM6.14923 5.37775C5.16175 5.37775 4.46628 5.37761 3.9256 5.42657C3.39428 5.47473 3.07853 5.56574 2.83575 5.70587C2.46313 5.92106 2.15348 6.23071 1.93829 6.60333C1.79817 6.84611 1.70715 7.16185 1.659 7.69318C1.61004 8.23385 1.61017 8.92934 1.61017 9.91681C1.61017 10.9043 1.61002 11.5998 1.659 12.1404C1.70715 12.6717 1.79817 12.9875 1.93829 13.2303C2.15349 13.6029 2.46315 13.9126 2.83575 14.1277C3.07853 14.2679 3.39428 14.3589 3.9256 14.407C4.46628 14.456 5.16176 14.4559 6.14923 14.4559C7.13675 14.4559 7.83218 14.456 8.37286 14.407C8.90419 14.3589 9.21993 14.2679 9.46271 14.1277C9.83529 13.9126 10.145 13.6029 10.3602 13.2303C10.5003 12.9875 10.5913 12.6718 10.6395 12.1404C10.6884 11.5998 10.6883 10.9043 10.6883 9.91681C10.6883 8.92935 10.6884 8.23385 10.6395 7.69318C10.5913 7.16185 10.5003 6.84611 10.3602 6.60333C10.145 6.23072 9.8353 5.92107 9.46271 5.70587C9.21993 5.56574 8.90418 5.47473 8.37286 5.42657C7.83218 5.3776 7.13676 5.37775 6.14923 5.37775ZM9.80157 0.367981C10.7637 0.367981 11.5313 0.367886 12.1473 0.423645C12.7725 0.480313 13.3093 0.598765 13.7928 0.877747C14.3716 1.21192 14.852 1.69355 15.1863 2.27228C15.4655 2.75575 15.5857 3.29165 15.6424 3.91681C15.6982 4.53301 15.6971 5.30161 15.6971 6.26447V7.8299C15.6971 8.29265 15.6989 8.58994 15.6649 8.84845C15.4667 10.3525 14.4009 11.5738 12.9832 11.9988V10.5467C13.6973 10.1903 14.2104 9.49662 14.3192 8.67169C14.3387 8.52348 14.3406 8.3358 14.3406 7.8299V6.26447C14.3406 5.27707 14.3398 4.58149 14.2908 4.04083C14.2427 3.50969 14.1526 3.19373 14.0125 2.95099C13.7974 2.5785 13.4875 2.2687 13.1151 2.05353C12.8723 1.91347 12.5563 1.82237 12.0252 1.77423C11.4846 1.72528 10.7888 1.7254 9.80157 1.7254H7.71466C6.75614 1.72559 5.92659 2.27697 5.52325 3.07892H4.07013C4.54215 1.51132 5.99314 0.368192 7.71466 0.367981H9.80157Z" fill="currentColor"></path></svg>
                      复制
                  </button>
              </div>
          </div>
          <textarea id="dblp-failed-textarea"></textarea>
      </div>
      <div style="display:flex; flex-direction:column; gap:10px; align-items:center;">
        <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
             <button id="dblp-btn-download" class="dblp-btn">${lang_hint.download_btn}</button>
             <button id="dblp-btn-csv" class="dblp-btn">${lang_hint.csv_btn}</button>
             <button id="dblp-btn-copy-urls" class="dblp-btn">${lang_hint.copy_urls_btn}</button>
        </div>
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

  // 3.1. Scholar Confirm Modal
  const scholarModal = document.createElement('div');
  scholarModal.id = 'dblp-scholar-modal';
  scholarModal.innerHTML = `
      <div id="dblp-scholar-title">${lang_hint.scholar_confirm_title}</div>
      <div id="dblp-scholar-list"></div>
      <div style="display:flex; justify-content:center; gap:10px; margin-top:15px;">
          <button id="dblp-scholar-confirm" class="dblp-btn" style="background:#28a745; color:white;">${lang_hint.scholar_confirm_open}</button>
          <button id="dblp-scholar-cancel" class="dblp-btn" style="background:#6c757d; color:white;">${lang_hint.scholar_confirm_cancel}</button>
      </div>
  `;
  document.body.appendChild(scholarModal);

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

  // 5. Citation Format Modal (引用格式配置面板)
  const citationModal = document.createElement('div');
  citationModal.id = 'dblp-citation-modal';
  citationModal.innerHTML = `
      <h3>${lang_hint.citation_title}</h3>

      <div id="dblp-citation-presets"></div>

      <div id="dblp-citation-custom-section" style="display:none;">
          <div style="font-size:14px; font-weight:bold; margin-bottom:5px;">${lang_hint.citation_custom_label}</div>
          <input type="text" id="dblp-citation-custom-input" placeholder="{firstAuthor}{year}" />
          <div id="dblp-citation-help">${lang_hint.citation_help}</div>
      </div>

      <div id="dblp-citation-preview">${lang_hint.citation_preview}</div>

      <div class="dblp-modal-buttons">
          <button id="dblp-citation-save" class="dblp-btn" style="background:#28a745; color:white;">Save</button>
          <button id="dblp-citation-cancel" class="dblp-btn" style="background:#6c757d; color:white;">Cancel</button>
      </div>
  `;
  document.body.appendChild(citationModal);

  // 生成预设选项
  function renderCitationPresets() {
      const container = document.getElementById('dblp-citation-presets');
      container.innerHTML = '';

      const currentFormat = getCitationFormat();

      Object.entries(CITATION_PRESETS).forEach(([key, preset]) => {
          const label = lang_hint[preset.name];
          const div = document.createElement('div');
          div.className = 'dblp-citation-preset' + (currentFormat === key ? ' active' : '');
          div.innerHTML = `
              <input type="radio" name="citation-preset" value="${key}" ${currentFormat === key ? 'checked' : ''} />
              <div style="flex:1;">
                  <div class="dblp-citation-preset-label">${label}</div>
                  <div class="dblp-citation-preset-example">${preset.example}</div>
              </div>
          `;
          div.onclick = (e) => {
              if (e.target.type !== 'radio') {
                  const radio = div.querySelector('input[type="radio"]');
                  radio.checked = true;
              }
              // 更新选中状态
              document.querySelectorAll('.dblp-citation-preset').forEach(el => el.classList.remove('active'));
              div.classList.add('active');

              // 显示/隐藏自定义输入框
              const customSection = document.getElementById('dblp-citation-custom-section');
              if (key === 'custom') {
                  customSection.style.display = 'block';
                  const customInput = document.getElementById('dblp-citation-custom-input');
                  customInput.value = getCustomTemplate();
                  updateCitationPreview(customInput.value);
              } else {
                  customSection.style.display = 'none';
                  updateCitationPreview(preset.template);
              }
          };
          container.appendChild(div);
      });

      // 添加自定义选项
      const customDiv = document.createElement('div');
      customDiv.className = 'dblp-citation-preset' + (currentFormat === 'custom' ? ' active' : '');
      customDiv.innerHTML = `
          <input type="radio" name="citation-preset" value="custom" ${currentFormat === 'custom' ? 'checked' : ''} />
          <div style="flex:1;">
              <div class="dblp-citation-preset-label">${lang_hint.citation_custom_label}</div>
          </div>
      `;
      customDiv.onclick = (e) => {
          if (e.target.type !== 'radio') {
              const radio = customDiv.querySelector('input[type="radio"]');
              radio.checked = true;
          }
          document.querySelectorAll('.dblp-citation-preset').forEach(el => el.classList.remove('active'));
          customDiv.classList.add('active');

          const customSection = document.getElementById('dblp-citation-custom-section');
          customSection.style.display = 'block';
          const customInput = document.getElementById('dblp-citation-custom-input');
          customInput.value = getCustomTemplate();
          updateCitationPreview(customInput.value);
      };
      container.appendChild(customDiv);

      // 如果当前是自定义格式，显示自定义输入框
      if (currentFormat === 'custom') {
          document.getElementById('dblp-citation-custom-section').style.display = 'block';
          document.getElementById('dblp-citation-custom-input').value = getCustomTemplate();
      }
  }

  // 更新预览
  function updateCitationPreview(template) {
      const previewEl = document.getElementById('dblp-citation-preview');

      if (!template) {
          previewEl.textContent = lang_hint.citation_preview + ' ' + lang_hint.citation_preset_default;
          return;
      }

      // 生成示例
      const example = template
          .replace(/{firstAuthor}/g, 'Smith')
          .replace(/{year}/g, '2024')
          .replace(/{firstWord}/g, 'Deep')
          .replace(/{titleWords:(\d+)}/g, (_, n) => {
              const words = ['Deep', 'Learning', 'for', 'NLP'];
              return words.slice(0, parseInt(n)).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
          });

      previewEl.textContent = lang_hint.citation_preview + ' ' + example;
  }

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

  // 引用格式模态框按钮事件
  const customInput = document.getElementById('dblp-citation-custom-input');

  customInput.addEventListener('input', (e) => {
      updateCitationPreview(e.target.value);
  });

  document.getElementById('dblp-citation-save').onclick = () => {
      // 获取选中的格式
      const selectedPreset = document.querySelector('input[name="citation-preset"]:checked');
      if (!selectedPreset) return;

      const format = selectedPreset.value;

      if (format === 'custom') {
          const template = customInput.value.trim();
          if (!template) {
              Toast(lang.startsWith('zh') ? '请输入自定义模板' : 'Please enter custom template');
              return;
          }
          saveCustomTemplate(template);
      }

      saveCitationFormat(format);
      Toast(lang_hint.citation_saved);
      citationModal.style.display = 'none';
  };

  document.getElementById('dblp-citation-cancel').onclick = () => {
      citationModal.style.display = 'none';
  };

  // --- Logic Variables ---
  let batchResults = []; // Stores BibTeX strings
  let batchLines = [];   // Stores original queries
  let isBatchProcessing = false;

  // --- Helper Functions ---

  // 清理中文字符和中文标点符号
  function cleanChineseText(text) {
    if (!text) return text;
    // 移除中文字符、中文标点符号和全角字符
    return text.replace(/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/g, '').trim();
  }

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
                    let bibtex = bibResponse.responseText;
                    // 应用引用格式转换
                    bibtex = rewriteBibTeXCitationKey(bibtex);
                    callback(bibtex);
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
  const closeBtn = document.getElementById('dblp-close-btn');
  const retryBtn = document.getElementById('dblp-retry-btn');

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

  // Scholar重试按钮
  retryBtn.onclick = () => {
      const failedTextarea = document.getElementById('dblp-failed-textarea');
      const failedText = failedTextarea.value.trim();
      if (!failedText) {
          Toast(lang.startsWith('zh') ? '没有失败的项目' : 'No failed items');
          return;
      }

      const failedLines = failedText.split('\n').map(s => s.trim()).filter(s => s);
      if (failedLines.length === 0) return;

      // 生成搜索URL列表
      const searchUrls = failedLines.map(line => ({
          query: line,
          url: `https://scholar.google.com/scholar?q=${encodeURIComponent(line)}`
      }));

      // 显示确认对话框
      const scholarList = document.getElementById('dblp-scholar-list');
      scholarList.innerHTML = searchUrls.map((item, idx) =>
          `<div class="dblp-scholar-item">${idx + 1}. ${item.url}</div>`
      ).join('');

      scholarModal.style.display = 'block';

      // 确认按钮
      document.getElementById('dblp-scholar-confirm').onclick = () => {
          scholarModal.style.display = 'none';

          // 打开多个标签页
          searchUrls.forEach(item => {
              window.open(item.url, '_blank');
          });
      };

      // 取消按钮
      document.getElementById('dblp-scholar-cancel').onclick = () => {
          scholarModal.style.display = 'none';
      };
  };

  // 复制成功结果按钮
  document.getElementById('dblp-copy-success').onclick = () => {
      const successTextarea = document.getElementById('dblp-success-textarea');
      const content = successTextarea.value;
      if (!content) return;
      GM_setClipboard(content);
      Toast(lang_hint.copied_to_clipboard);
  };

  // 复制失败结果按钮
  document.getElementById('dblp-copy-failed').onclick = () => {
      const failedTextarea = document.getElementById('dblp-failed-textarea');
      const content = failedTextarea.value;
      if (!content) return;
      GM_setClipboard(content);
      Toast(lang_hint.copied_to_clipboard);
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

    const lines = selection.split(/[\r\n]+/).map(s => cleanChineseText(s.trim())).filter(s => s);

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

        // 隐藏结果区域，重置状态
        document.getElementById('dblp-success-section').style.display = 'none';
        document.getElementById('dblp-failed-section').style.display = 'none';

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
                        titleEl.innerText = lang_hint.batch_done_title(lines.length);
                        currentEl.innerText = "";
                        closeBtn.style.display = 'flex';

                        // 分离成功和失败的结果
                        const successResults = [];
                        const failedLines = [];

                        batchLines.forEach((line, idx) => {
                            if (batchResults[idx] === "None") {
                                failedLines.push(line);
                            } else {
                                successResults.push(batchResults[idx]);
                            }
                        });

                        // 显示成功结果
                        const successSection = document.getElementById('dblp-success-section');
                        const successTextarea = document.getElementById('dblp-success-textarea');
                        const successTitle = document.getElementById('dblp-success-title');

                        if (successResults.length > 0) {
                            successSection.style.display = 'block';
                            successTextarea.value = successResults.join('\n\n');
                            successTitle.innerText = lang_hint.success_summary(successResults.length);
                        } else {
                            successSection.style.display = 'none';
                        }

                        // 显示失败结果
                        const failedSection = document.getElementById('dblp-failed-section');
                        const failedTextarea = document.getElementById('dblp-failed-textarea');
                        const failedTitle = document.getElementById('dblp-failed-title');

                        if (failedLines.length > 0) {
                            failedSection.style.display = 'block';
                            failedTextarea.value = failedLines.join('\n');
                            failedTitle.innerText = lang_hint.failed_summary(failedLines.length);
                        } else {
                            failedSection.style.display = 'none';
                        }
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

  // 3. 设置引用标志格式
  GM_registerMenuCommand(lang_hint.menu_citation_config, function() {
    renderCitationPresets();
    citationModal.style.display = 'block';
  });

  // 4. 全局禁用/启用（动态切换）
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
