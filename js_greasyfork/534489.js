// ==UserScript==
// @name         聚合索引
// @namespace    http://tampermonkey.net/
// @version      v1.08
// @description  支持位置切换的聚合搜索引擎导航栏
// @author       summer
// @match        *://*/*q=*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534489/%E8%81%9A%E5%90%88%E7%B4%A2%E5%BC%95.user.js
// @updateURL https://update.greasyfork.org/scripts/534489/%E8%81%9A%E5%90%88%E7%B4%A2%E5%BC%95.meta.js
// ==/UserScript==

// 初始化配置
const defaultConfig = {
  position: GM_getValue('navPosition', 'bottom'), // top/bottom
  lastUpdate: Date.now()
};

// 添加Font Awesome CSS
const faCSS = document.createElement('link');
faCSS.rel = 'stylesheet';
faCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
document.head.appendChild(faCSS);

// 动态样式
GM_addStyle(`
.search-bar {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255,255,255,0.95);
  padding: 12px;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  gap: 1rem;
  z-index: 9999;
  transition: all 0.3s ease;
}

/* 底部定位 */
.search-bar.bottom-bar {
  bottom: 0;
  border-radius: 24px 24px 0 0;
}

/* 顶部定位 */
.search-bar.top-bar {
  top: 0;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.search-btn {
  background: none;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Microsoft YaHei', sans-serif;
}

.active-engine {
  background: #007bff!important;
  color: white!important;
}
`);

const searchEngines = [
  {
    name: "Google",
    icon: "fab fa-google",
    domain: "google.com",
    urlTemplate: "https://www.google.com/search?q=%s"
  },
  {
    name: "Bing",
    icon: "fab fa-microsoft",
    domain: "bing.com",
    urlTemplate: "https://www.bing.com/search?q=%s"
  },
  {
    name: "度ds",
    icon: "fas fa-comment",
    domain: "chat.baidu.com",
    urlTemplate: "https://chat.baidu.com/search?word=%s"
  },
  {
    name: "秘塔AI",
    icon: "fas fa-search-plus",
    domain: "metaso.cn",
    urlTemplate: "https://metaso.cn/?s=&q=%s"
  },
  {
    name: "Kimi",
    icon: "fas fa-comment-alt",
    domain: "kimi.moonshot.cn",
    urlTemplate: "https://kimi.moonshot.cn/_prefill_chat?send_immediately=true&prefill_prompt=%s"
  },
      {
    name: "百度",
    icon: "fab fa-baidu",
    domain: "baidu.com",
    urlTemplate: "https://www.baidu.com/s?wd=%s"
  },
];

// 位置切换功能
function togglePosition() {
  const current = GM_getValue('navPosition', 'bottom');
  const newPos = current === 'bottom' ? 'top' : 'bottom';
  GM_setValue('navPosition', newPos);
  applyPosition();
}

function applyPosition() {
  const bar = document.querySelector('.search-bar');
  if (!bar) return;

  const position = GM_getValue('navPosition', 'bottom');
  bar.classList.remove('bottom-bar', 'top-bar');
  bar.classList.add(`${position}-bar`);
}

// 创建导航栏
function createSearchBar() {
  const currentUrl = new URL(window.location.href);
  const bar = document.createElement('div');
  bar.className = `search-bar ${defaultConfig.position}-bar`;

  searchEngines.forEach(engine => {
    const btn = document.createElement('button');
    btn.className = `search-btn ${currentUrl.host.includes(engine.domain) ? 'active-engine' : ''}`;
    btn.innerHTML = `<i class="${engine.icon}"></i><span>${engine.name}</span>`;

    btn.onclick = () => {
      const query = encodeURIComponent(getSearchQuery());
      window.location.href = engine.urlTemplate.replace('%s', query);
    };

    bar.appendChild(btn);
  });

  document.body.appendChild(bar);
  GM_registerMenuCommand("切换导航栏位置", togglePosition);
}

// 获取搜索关键词
function getSearchQuery() {
  const queryKeys = ['q', 'query', 'search', 'wd', 'keyword'];
  const urlParams = new URLSearchParams(window.location.search);
  return queryKeys.map(k => urlParams.get(k)).find(v => v);
}

// 初始化
window.addEventListener('load', () => {
  if (getSearchQuery()) {
    createSearchBar();
    applyPosition();
  }
});
