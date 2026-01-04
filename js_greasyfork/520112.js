// ==UserScript==
// @name         Ecosia Search Redirector
// @name:zh-CN   Ecosia 搜索引擎重定向器
// @name:zh-TW   Ecosia 搜尋引擎重定向器
// @namespace    https://www.ecosia.org/
// @version      1.4
// @description  A Safari-focused userscript that redirects Ecosia searches to other engines using keywords, providing search engine customization that Safari lacks
// @description:zh-cn 这是一个将 Ecosia 重定向到其他搜索引擎的脚本。主要是解决 Safari 自定义搜索引擎能力缺失的问题。
// @description:zh-tw 這是一個將 Ecosia 重定向到其他搜尋引擎的腳本。主要是解決 Safari 自定義搜尋引擎能力缺失的問題。
// @author       https://github.com/hxueh
// @match        *://*.ecosia.org/search*
// @match        *://*.ecosia.org/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @icon         https://www.ecosia.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/520112/Ecosia%20Search%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/520112/Ecosia%20Search%20Redirector.meta.js
// ==/UserScript==

const STORAGE_KEY = "ecosia_redirector_default";
const searchEngines = {
  g: `https://www.google.com/search?q=%s`,
  google: `https://www.google.com/search?q=%s`,
  sp: `https://www.startpage.com/search?q=%s`,
  startpage: `https://www.startpage.com/search?q=%s`,
  ecosia: `https://www.ecosia.org/search?q=%s`,
  kagi: `https://kagi.com/search?q=%s`,
  caixin: `https://search.caixin.com/newsearch/caixinsearch?keyword=%s`,
  ndb: `https://neodb.social/search?q=%s`,
  brave: `https://search.brave.com/search?q=%s`,
  gpt: `https://chatgpt.com/?temporary-chat=true&q=%s`,
  chatgpt: `https://chatgpt.com/?temporary-chat=true&q=%s`,
  claude: `https://claude.ai/new?q=%s`,
  dict: `https://www.collinsdictionary.com/us/dictionary/english/%s`,
  neodb: `https://neodb.social/search?q=%s`,
  podcast: `https://www.listennotes.com/search/?q=%s`,
  pp: `https://www.perplexity.ai/search?q=%s`,
  perplexity: `https://www.perplexity.ai/search?q=%s`,
  reddit: `https://www.reddit.com/search?q=%s`,
  so: `https://stackoverflow.com/search?q=%s`,
  twitter: `https://twitter.com/search?q=%s`,
  yt: `https://youtube.com/results?search_query=%s`,
  youtube: `https://youtube.com/results?search_query=%s`,
  taobao: `https://s.taobao.com/search?q=%s`,
  jd: `https://search.jd.com/Search?keyword=%s`,
  bili: `https://www.bilibili.com/search?keyword=%s`,
  xhs: `https://www.xiaohongshu.com/search_result?keyword=%s`,
  weibo: `https://s.weibo.com/weibo/%s`,
  youdao: `https://dict.youdao.com/search?q=%s`,
  zhihu: `https://www.zhihu.com/search?type=content&q=%s`,
  douban: `https://www.douban.com/search/?q=%s`,
};

// Add CSS for the settings window
GM_addStyle(`
  .search-settings-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .search-settings-window {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 300px;
  }

  .search-settings-window h2 {
    margin: 0 0 20px 0;
    font-size: 18px;
    color: #333;
  }

  .search-settings-window select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .search-settings-window .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .search-settings-window button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .search-settings-window .save-btn {
    background: #4CAF50;
    color: white;
  }

  .search-settings-window .cancel-btn {
    background: #f5f5f5;
    color: #333;
  }

  .search-settings-window button:hover {
    opacity: 0.9;
  }
`);

function getDefaultEngine() {
  return GM_getValue(STORAGE_KEY, "kagi");
}

function showSettingsWindow() {
  const overlay = document.createElement("div");
  overlay.className = "search-settings-overlay";

  const window = document.createElement("div");
  window.className = "search-settings-window";
  window.innerHTML = `
    <h2>Default Search Engine Settings</h2>
    <select id="default-engine">
      ${Object.entries(searchEngines)
        .map(
          ([key]) => `
          <option value="${key}" ${
            key === getDefaultEngine() ? "selected" : ""
          }>
            ${key}
          </option>
        `
        )
        .join("")}
    </select>
    <div class="buttons">
      <button class="cancel-btn">Cancel</button>
      <button class="save-btn">Save</button>
    </div>
  `;

  function closeSettings() {
    document.body.removeChild(overlay);
  }

  // Event Handlers
  window.querySelector(".save-btn").addEventListener("click", () => {
    const engine = window.querySelector("#default-engine").value;
    GM_setValue(STORAGE_KEY, engine);
    closeSettings();
  });

  window.querySelector(".cancel-btn").addEventListener("click", closeSettings);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSettings();
  });

  overlay.appendChild(window);
  document.body.appendChild(overlay);
}

// Register settings menu command
GM_registerMenuCommand("⚙️ Default Search Engine Settings", showSettingsWindow);

(function () {
  "use strict";

  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Check if the safari refer argument is present
  // if present, do redirect
  const ttsParam = urlParams.get("tts");
  if (!ttsParam) {
    return;
  }

  const defaultSearchEngine = getDefaultEngine();
  if (defaultSearchEngine === "ecosia") {
    return;
  }

  // Clear the document content
  document.documentElement.innerHTML = "<html></html>";

  // Get the search query from the URL
  const query = urlParams.get("q");

  if (query) {
    // Check if the query starts with a keyword in the searchEngines mapping
    const keyword = Object.keys(searchEngines).find((k) =>
      query.toLowerCase().startsWith(k + " ")
    );

    let redirectUrl;
    if (keyword) {
      // Get the search term after the keyword
      const searchTerm = query.slice(keyword.length).trim();
      redirectUrl = searchEngines[keyword].replace(
        "%s",
        encodeURIComponent(searchTerm)
      );
    } else {
      // Default search engine
      redirectUrl = searchEngines[defaultSearchEngine].replace(
        "%s",
        encodeURIComponent(query)
      );
    }

    window.location.href = redirectUrl;
  }
})();