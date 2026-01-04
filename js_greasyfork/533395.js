// ==UserScript==
// @name         切换搜索引擎
// @description  在搜索引擎之间快速切换搜索内容
// @author       Jack back
// @namespace    search-engine-switcher
// @license      GPL-3.0
// @include      https://www.baidu.com/*
// @include      *.bing.com/*
// @include      /^https?://[a-z]+\.google\.[a-z,\.]+/.+$/
// @include      https://www.zhihu.com/search*
// @include      https://www.bilibili.com/search*
// @include      https://www.xiaohongshu.com/search*
// @include      https://www.youtube.com/results*
// @include      https://metaso.cn/*
// @run-at       document_body
// @version      1.1.3
// @downloadURL https://update.greasyfork.org/scripts/533395/%E5%88%87%E6%8D%A2%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/533395/%E5%88%87%E6%8D%A2%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let sites = [
      {
          name: "百度",
          host: "baidu.com",
          link: "https://www.baidu.com/s",
          key: "wd",
          hide: false,
      },
      {
          name: "必应",
          host: "bing.com",
          link: "https://bing.com/search",
          key: "q",
          hide: false,
      },
      {
          name: "谷歌",
          host: "google.com",
          link: "https://www.google.com.hk/search",
          key: "q",
          hide: false,
      },
      {
          name: "知乎",
          host: "zhihu.com",
          link: "https://www.zhihu.com/search",
          key: "q",
          hide: false,
      },
      {
          name: "B站",
          host: "bilibili.com",
          link: "https://www.bilibili.com/search",
          key: "keyword",
          hide: false,
      },
      {
          name: "小红书",
          host: "xiaohongshu.com",
          link: "https://www.xiaohongshu.com/search",
          key: "keyword",
          hide: false,
      },
      {
          name: "YouTube",
          host: "youtube.com",
          link: "https://www.youtube.com/results",
          key: "search_query",
          hide: false,
      },
      {
          name: "秘塔",
          host: "metaso.cn",
          link: "https://metaso.cn/",
          key: "q",
          hide: false,
      },
      {
          name: "GitHub",
          host: "github.com",
          link: "https://github.com/search",
          key: "q",
          hide: false,
      },
  ];

  const css = `
      /* 全局字体优化 */
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        font-family: -apple-system, BlinkMacSystemFont,
          "Segoe UI", "PingFang SC", "Microsoft YaHei",
          sans-serif;
      }

      .search-switcher {
        position: fixed;
        opacity: 0.12;
        top: 50%;
        transform: translateY(-50%);
        left: -100px;
        z-index: 9999999;
        transition: all 800ms cubic-bezier(0.19, 1, 0.22, 1);
        filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.2));
      }

      .search-switcher:hover {
        left: 0;
        opacity: 1;
        filter: drop-shadow(0 0 30px rgba(0, 0, 0, 0.25));
      }

      .search-list {
        display: flex;
        flex-direction: column;
        gap: 7px;
        background: rgba(23, 23, 33, 0.92);
        backdrop-filter: blur(20px) saturate(180%) brightness(95%);
        -webkit-backdrop-filter: blur(20px) saturate(180%) brightness(95%);
        border-radius: 0 18px 18px 0;
        padding: 12px 10px;
        box-shadow:
          0 4px 24px -1px rgba(0, 0, 0, 0.25),
          0 0 0 1px rgba(255, 255, 255, 0.1) inset,
          0 0 0 1px rgba(255, 255, 255, 0.05);
        width: 100px;
        position: relative;
        overflow: hidden;
      }

      .search-list::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
          linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.03) 0%,
            transparent 50%
          ),
          radial-gradient(
            circle at top right,
            rgba(255, 255, 255, 0.12),
            transparent 80%
          );
        z-index: 0;
      }

      .search-list a {
        color: rgba(255, 255, 255, 0.85);
        text-decoration: none;
        padding: 9px 14px;
        border-radius: 9px;
        transition: all 500ms cubic-bezier(0.19, 1, 0.22, 1);
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.3px;
        text-align: center;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        position: relative;
        overflow: hidden;
        z-index: 1;
        backdrop-filter: blur(4px);
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
      }

      .search-list a:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
        transform: translateX(3px) scale(1.02);
        letter-spacing: 0.5px;
        text-shadow: 0 2px 20px rgba(255, 255, 255, 0.4);
        border-color: rgba(255, 255, 255, 0.2);
        box-shadow:
          0 4px 20px -2px rgba(0, 0, 0, 0.3),
          0 0 0 1px rgba(255, 255, 255, 0.15) inset,
          0 0 20px rgba(255, 255, 255, 0.06);
      }

      @keyframes glow {
        0% {
          box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
        }
        50% {
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        }
        100% {
          box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
        }
      }

      .search-switcher:hover .search-list {
        animation: glow 2s infinite;
      }

      @media (prefers-reduced-motion) {
        .search-switcher,
        .search-list a {
          transition: none;
        }
      }

      @supports not (backdrop-filter: blur(12px)) {
        .search-list {
          background: rgba(28, 28, 35, 0.95);
        }
      }

      /* 齿轮图标样式 */
      .settings-gear {
        width: 20px;
        height: 20px;
        padding: 4px;
        margin: 4px auto 0;
        cursor: pointer;
        opacity: 0.6;
        transition: all 0.3s ease;
      }

      .settings-gear:hover {
        opacity: 1;
        transform: rotate(45deg);
      }

      /* 弹窗样式优化 */
      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(8px) saturate(180%);
        -webkit-backdrop-filter: blur(8px) saturate(180%);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10000000;
        animation: modalFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes modalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .modal-content {
        background: linear-gradient(
          135deg,
          rgba(35, 35, 45, 0.85) 0%,
          rgba(23, 23, 33, 0.9) 100%
        );
        backdrop-filter: blur(25px) saturate(180%);
        padding: 32px;
        border-radius: 24px;
        min-width: 360px;
        box-shadow:
          0 20px 60px -10px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(255, 255, 255, 0.1) inset,
          0 0 0 1px rgba(255, 255, 255, 0.05);
        transform: scale(0.95);
        animation: modalPop 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .modal-buttons {
        display: flex;
        gap: 12px;
        margin-bottom: 20px;
      }

      .modal-btn {
        flex: 1;
        padding: 13px 20px;
        border: none;
        border-radius: 12px;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.08),
          rgba(255, 255, 255, 0.03)
        );
        box-shadow:
          0 2px 5px rgba(0, 0, 0, 0.1),
          0 0 0 1px rgba(255, 255, 255, 0.06) inset;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 500ms cubic-bezier(0.19, 1, 0.22, 1);
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(4px);
        font-size: 13.5px;
        letter-spacing: 0.3px;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
      }

      .modal-btn:hover {
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.12),
          rgba(255, 255, 255, 0.06)
        );
        transform: translateY(-2px);
        box-shadow:
          0 8px 25px -5px rgba(0, 0, 0, 0.3),
          0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      }

      .modal-btn:active {
        transform: translateY(0);
      }

      .add-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        animation: formSlideIn 0.3s ease-out;
      }

      @keyframes formSlideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .add-form > div:first-child {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        margin-bottom: 5px;
        font-weight: 550;
        letter-spacing: 0.2px;
        text-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
      }

      /* 设置表单标签样式 */
      .add-form > div {
        color: #ffffff;
        font-size: 16px;
        margin-bottom: 5px;
        font-weight: 700;
        letter-spacing: 0.3px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }

      .add-form input {
        padding: 14px 18px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.2);
        color: white;
        font-size: 13.5px;
        font-weight: 500;
        letter-spacing: 0.3px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        width: 100%;
        backdrop-filter: blur(4px);
        box-shadow:
          0 2px 5px rgba(0, 0, 0, 0.1),
          0 0 0 1px rgba(255, 255, 255, 0.05) inset;
      }

      .add-form input:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.2);
        box-shadow:
          0 0 0 3px rgba(255, 255, 255, 0.1),
          0 0 30px rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.25);
      }

      .add-form input::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }

      .delete-list {
        max-height: 300px;
        overflow-y: auto;
        margin-top: 10px;
        padding-right: 10px;
      }

      .delete-list::-webkit-scrollbar {
        width: 6px;
      }

      .delete-list::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
      }

      .delete-list::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }

      .delete-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-radius: 14px;
        margin-bottom: 8px;
        background: rgba(255, 255, 255, 0.04);
        transition: all 500ms cubic-bezier(0.19, 1, 0.22, 1);
        border: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      }

      .delete-item:hover {
        background: rgba(255, 255, 255, 0.06);
        transform: translateX(3px);
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow:
          0 4px 15px rgba(0, 0, 0, 0.1),
          0 0 0 1px rgba(255, 255, 255, 0.08) inset;
      }

      .delete-item span {
        color: rgba(255, 255, 255, 0.9);
        font-size: 13.5px;
        font-weight: 500;
        letter-spacing: 0.2px;
        text-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
      }

      .delete-btn {
        padding: 7px 14px;
        background: linear-gradient(
          135deg,
          rgba(255, 59, 48, 0.12),
          rgba(255, 59, 48, 0.08)
        );
        color: #ff3b30;
        border: 1px solid rgba(255, 59, 48, 0.15);
        border-radius: 10px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.2px;
        transition: all 500ms cubic-bezier(0.19, 1, 0.22, 1);
        backdrop-filter: blur(4px);
        box-shadow:
          0 2px 5px rgba(255, 59, 48, 0.1),
          0 0 0 1px rgba(255, 59, 48, 0.05) inset;
      }

      .delete-btn:hover {
        background: linear-gradient(
          135deg,
          rgba(255, 59, 48, 0.18),
          rgba(255, 59, 48, 0.12)
        );
        transform: translateX(2px);
        box-shadow:
          0 4px 15px rgba(255, 59, 48, 0.15),
          0 0 0 1px rgba(255, 59, 48, 0.1) inset;
      }

      #confirmAdd {
        margin-top: 15px;
        padding: 12px;
        width: 100%;
        background: rgba(255, 255, 255, 0.15);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      #confirmAdd:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 255, 255, 0.4);
      }

      #confirmAdd:active {
        transform: translateY(0);
      }

      .settings-section {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .settings-section h3 {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        margin-bottom: 15px;
        font-weight: 500;
      }
  `;

  // 添加本地存储功能
  function saveCustomSites() {
      try {
          localStorage.setItem('customSites', JSON.stringify(sites));
          return true;
      } catch (e) {
          console.error('保存站点数据失败:', e);
          return false;
      }
  }

  function loadCustomSites() {
      try {
          const saved = localStorage.getItem('customSites');
          if (saved) {
              try {
                  const loadedSites = JSON.parse(saved);
                  if (Array.isArray(loadedSites) && loadedSites.length > 0) {
                      // 验证站点数据的有效性
                      const validSites = loadedSites.filter(site =>
                          site &&
                          typeof site === 'object' &&
                          site.name &&
                          site.host &&
                          site.link &&
                          site.key !== undefined
                      );

                      if (validSites.length > 0) {
                          sites = validSites;
                          console.log(`成功加载${validSites.length}个自定义站点`);
                          return true;
                      } else {
                          console.warn('加载的站点数据无效');
                      }
                  }
              } catch (e) {
                  console.error('无法解析保存的站点数据', e);
              }
          }
          return false;
      } catch (e) {
          console.error('读取本地存储失败:', e);
          return false;
      }
  }

  // 修改创建弹窗的HTML结构
  function createSettingsModal() {
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';

      modal.innerHTML = `
          <div class="modal-content">
              <div class="modal-buttons">
                  <button class="modal-btn" id="addSiteBtn">添加站点</button>
                  <button class="modal-btn" id="deleteSiteBtn">管理站点</button>
                  <button class="modal-btn" id="closeModalBtn">关闭</button>
              </div>
              <div id="settingsContainer"></div>
          </div>
      `;

      document.body.appendChild(modal);

      // 绑定按钮事件
      document.getElementById('addSiteBtn').addEventListener('click', () => {
          const container = document.getElementById('settingsContainer');
          container.innerHTML = `
              <div class="add-form">
                  <div>搜索URL解析</div>
                  <input type="text" id="searchUrl" placeholder="输入完整搜索URL自动识别">
                  <button class="modal-btn" id="parseUrlBtn">解析URL</button>

                  <div style="margin-top:15px">站点名称</div>
                  <input type="text" id="siteName" placeholder="例如: 百度">

                  <div>站点域名</div>
                  <input type="text" id="siteHost" placeholder="例如: baidu.com">

                  <div>搜索链接</div>
                  <input type="text" id="siteLink" placeholder="例如: https://www.baidu.com/s">

                  <div>搜索参数</div>
                  <input type="text" id="siteKey" placeholder="例如: wd">

                  <button id="confirmAdd" class="modal-btn">添加</button>
              </div>
          `;

          document.getElementById('confirmAdd').addEventListener('click', () => {
              const name = document.getElementById('siteName').value;
              const host = document.getElementById('siteHost').value;
              const link = document.getElementById('siteLink').value;
              const key = document.getElementById('siteKey').value;

              if (name && host && link && key) {
                  addNewSite(name, host, link, key);
                  alert('添加成功');
                  container.innerHTML = '';
              } else {
                  alert('请填写完整信息');
              }
          });

          document.getElementById('parseUrlBtn').addEventListener('click', () => {
              const url = document.getElementById('searchUrl').value;
              if (url) {
                  const parsedData = parseSearchUrl(url);
                  if (parsedData) {
                      document.getElementById('siteName').value = parsedData.name || '';
                      document.getElementById('siteHost').value = parsedData.host || '';
                      document.getElementById('siteLink').value = parsedData.link || '';
                      document.getElementById('siteKey').value = parsedData.key || '';
                  } else {
                      alert('无法解析该URL，请确保是有效的搜索URL');
                  }
              } else {
                  alert('请输入URL');
              }
          });
      });

      document.getElementById('deleteSiteBtn').addEventListener('click', () => {
          const container = document.getElementById('settingsContainer');
          showDeleteList(container);
      });

      document.getElementById('closeModalBtn').addEventListener('click', () => {
          modal.style.display = 'none';
      });

      return modal;
  }

  function setup() {
      // 添加CSS样式
      const styleElement = document.createElement('style');
      styleElement.textContent = css;
      document.head.appendChild(styleElement);

      // 创建搜索引擎切换器
      const switcherDiv = document.createElement('div');
      switcherDiv.className = 'search-switcher';

      // 创建搜索引擎列表
      const listDiv = document.createElement('div');
      listDiv.className = 'search-list';

      // 获取当前搜索词
      const searchTerm = getCurrentSearchTerm();

      // 填充搜索引擎列表
      sites.filter(site => !site.hide).forEach(site => {
          const link = document.createElement('a');
          link.href = `${site.link}?${site.key}=${encodeURIComponent(searchTerm)}`;
          link.textContent = site.name;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          listDiv.appendChild(link);
      });

      // 添加设置图标
      const settingsIcon = document.createElement('div');
      settingsIcon.className = 'settings-gear';
      settingsIcon.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
          </svg>
      `;

      // 创建并设置模态框
      const modal = createSettingsModal();

      // 点击设置图标显示模态框
      settingsIcon.addEventListener('click', () => {
          showSettingsModal(modal);
      });

      listDiv.appendChild(settingsIcon);
      switcherDiv.appendChild(listDiv);
      document.body.appendChild(switcherDiv);
  }

  // 添加设置相关功能
  function showSettingsModal(modal) {
      modal.style.display = 'flex';
  }

  function addNewSite(name, host, link, key) {
      // 输入验证
      if (!name || typeof name !== 'string' || name.trim() === '') {
          alert('站点名称不能为空');
          return false;
      }

      if (!host || typeof host !== 'string' || host.trim() === '') {
          alert('站点域名不能为空');
          return false;
      }

      if (!link || typeof link !== 'string' || !link.startsWith('http')) {
          alert('搜索链接必须是有效的URL');
          return false;
      }

      if (!key || typeof key !== 'string' || key.trim() === '') {
          alert('搜索参数不能为空');
          return false;
      }

      // 检查是否已存在相同站点
      const existingSite = sites.findIndex(s => s.host === host);
      if (existingSite !== -1) {
          const confirmReplace = confirm(`已存在域名为 ${host} 的站点，是否替换？`);
          if (confirmReplace) {
              sites[existingSite] = {
                  name: name.trim(),
                  host: host.trim(),
                  link: link.trim(),
                  key: key.trim(),
                  hide: false
              };
              saveCustomSites();
              return true;
          } else {
              return false;
          }
      }

      const newSite = {
          name: name.trim(),
          host: host.trim(),
          link: link.trim(),
          key: key.trim(),
          hide: false
      };

      sites.push(newSite);
      return saveCustomSites();
  }

  function showDeleteList(container) {
      container.innerHTML = '<div class="delete-list"></div>';
      const deleteList = container.querySelector('.delete-list');

      sites.forEach((site, index) => {
          const item = document.createElement('div');
          item.className = 'delete-item';
          item.innerHTML = `
              <span>${site.name} (${site.host})</span>
              <button class="delete-btn" data-index="${index}">移除</button>
          `;
          deleteList.appendChild(item);
      });

      // 添加删除事件监听器
      const deleteButtons = container.querySelectorAll('.delete-btn');
      deleteButtons.forEach(btn => {
          btn.addEventListener('click', function() {
              const index = parseInt(this.getAttribute('data-index'));
              sites.splice(index, 1);
              saveCustomSites();
              showDeleteList(container); // 刷新删除列表
          });
      });
  }

  // 获取当前搜索关键词
  function getCurrentSearchTerm() {
      try {
          const currentHost = window.location.hostname;
          const site = sites.find(s => currentHost.includes(s.host));

          if (!site) return '';

          const urlParams = new URLSearchParams(window.location.search);
          return urlParams.get(site.key) || '';
      } catch (error) {
          console.error('获取搜索关键词时出错:', error);
          return '';
      }
  }

  // 解析搜索URL的函数
  function parseSearchUrl(url) {
      if (!url || typeof url !== 'string') {
          console.error('URL不是有效的字符串');
          return null;
      }

      try {
          const urlObj = new URL(url);
          const searchParams = new URLSearchParams(urlObj.search);

          // 提取域名作为host
          const hostParts = urlObj.hostname.split('.');
          let host = hostParts.length >= 2 ?
                  `${hostParts[hostParts.length-2]}.${hostParts[hostParts.length-1]}` :
                  urlObj.hostname;

          // 尝试找出搜索参数
          let searchKey = '';
          let searchValue = '';

          // 常见搜索参数名列表
          const commonSearchParams = ['q', 'query', 'search', 'keyword', 'keywords', 'wd', 'kw', 'search_query', 'term', 'text'];

          // 首先检查常见参数
          for (const param of commonSearchParams) {
              if (searchParams.has(param)) {
                  searchKey = param;
                  searchValue = searchParams.get(param);
                  break;
              }
          }

          // 如果没有找到常见参数，尝试找第一个非空的参数
          if (!searchKey) {
              for (const [key, value] of searchParams.entries()) {
                  if (value && value.length > 0) {
                      searchKey = key;
                      searchValue = value;
                      break;
                  }
              }
          }

          if (!searchKey) {
              console.warn('无法在URL中找到搜索参数');
              return null;
          }

          // 基础链接不包括查询参数
          const baseLink = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;

          // 猜测网站名称
          let siteName = hostParts[0];
          if (hostParts.length > 2 && hostParts[0] !== 'www') {
              siteName = hostParts[0].charAt(0).toUpperCase() + hostParts[0].slice(1);
          } else if (hostParts.length > 2 && hostParts[0] === 'www') {
              siteName = hostParts[1].charAt(0).toUpperCase() + hostParts[1].slice(1);
          } else {
              siteName = host.split('.')[0].charAt(0).toUpperCase() + host.split('.')[0].slice(1);
          }

          return {
              name: siteName,
              host: host,
              link: baseLink,
              key: searchKey
          };
      } catch (e) {
          console.error('解析URL失败:', e);
          return null;
      }
  }

  // 初始化时加载自定义站点
  loadCustomSites();

  // 监听 pushState 和 replaceState 方法
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function() {
      originalPushState.apply(this, arguments);
      window.dispatchEvent(new Event('urlChange'));
  };

  history.replaceState = function() {
      originalReplaceState.apply(this, arguments);
      window.dispatchEvent(new Event('urlChange'));
  };

  // 监听 popstate 事件（用于处理浏览器后退和前进）
  window.addEventListener('popstate', () => {
      window.dispatchEvent(new Event('urlChange'));
  });

  // 自定义的 URL 变化事件处理函数
  const handleUrlChange = () => {
      // 移除旧的搜索切换器
      const oldSwitcher = document.querySelector('.search-switcher');
      if (oldSwitcher) {
          oldSwitcher.remove();
      }

      // 如果当前页面是搜索页面，则重新创建搜索切换器
      const currentHost = window.location.hostname;
      const isSearchPage = sites.some(site =>
          currentHost.includes(site.host) &&
          window.location.search.includes(site.key)
      );

      if (isSearchPage) {
          setTimeout(setup, 500); // 延迟执行以确保DOM已更新
      }
  };

  // 监听自定义的 urlChange 事件
  window.addEventListener('urlChange', handleUrlChange);

  // 初始加载时也触发一次
  handleUrlChange();
})();