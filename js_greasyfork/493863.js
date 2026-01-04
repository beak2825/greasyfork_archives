// ==UserScript==
// @name         CSDN质量分显示按钮-优化版
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  用于快速查询编辑页CSDN博客质量分的浏览器脚本，UI优化版，支持伸缩按钮
// @author       shandianchengzi
// @match        https://editor.csdn.net/*
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://*.blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/493863/CSDN%E8%B4%A8%E9%87%8F%E5%88%86%E6%98%BE%E7%A4%BA%E6%8C%89%E9%92%AE-%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/493863/CSDN%E8%B4%A8%E9%87%8F%E5%88%86%E6%98%BE%E7%A4%BA%E6%8C%89%E9%92%AE-%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 添加样式
  GM_addStyle(`
      .csdn-qc-container {
          position: fixed;
          top: 20px;
          left: 10px;
          z-index: 9999;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 25px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          padding: 5px;
          max-width: 45px;
          overflow: hidden;
      }

      .csdn-qc-container.expanded {
          max-width: 300px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      }

      .csdn-qc-toggle {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff7e5f, #feb47b);
          border: none;
          color: white;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 3px 8px rgba(255, 126, 95, 0.4);
          transition: all 0.3s ease;
      }

      .csdn-qc-toggle:hover {
          transform: rotate(90deg);
          box-shadow: 0 5px 12px rgba(255, 126, 95, 0.5);
      }

      .csdn-qc-buttons {
          display: flex;
          gap: 8px;
          margin-left: 10px;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
      }

      .csdn-qc-container.expanded .csdn-qc-buttons {
          opacity: 1;
          transform: translateX(0);
      }

      .csdn-qc-btn {
          background: linear-gradient(135deg, #ff7e5f, #feb47b);
          border: none;
          border-radius: 16px;
          color: white;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 3px 8px rgba(255, 126, 95, 0.3);
          transition: all 0.3s ease;
          white-space: nowrap;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      .csdn-qc-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 12px rgba(255, 126, 95, 0.4);
          background: linear-gradient(135deg, #ff6b47, #ff946b);
      }

      .csdn-qc-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 5px rgba(255, 126, 95, 0.3);
      }

      .csdn-qc-btn.loading {
          opacity: 0.8;
          cursor: not-allowed;
          background: linear-gradient(135deg, #ccc, #bbb);
      }

      .csdn-qc-toast {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.85);
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          z-index: 10000;
          font-size: 16px;
          font-weight: 500;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
          animation: fadeIn 0.3s ease;
          max-width: 80%;
          text-align: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      .csdn-qc-config-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          z-index: 10001;
          padding: 24px;
          width: 400px;
          max-width: 90%;
          animation: modalFadeIn 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      .csdn-qc-config-modal h3 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 20px;
          text-align: center;
      }

      .csdn-qc-config-group {
          margin-bottom: 16px;
      }

      .csdn-qc-config-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #555;
      }

      .csdn-qc-config-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border 0.3s;
      }

      .csdn-qc-config-group input:focus {
          border-color: #ff7e5f;
          outline: none;
          box-shadow: 0 0 0 2px rgba(255, 126, 95, 0.2);
      }

      .csdn-qc-config-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
      }

      .csdn-qc-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 10000;
          animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
      }

      @keyframes modalFadeIn {
          from {
              opacity: 0;
              transform: translate(-50%, -48%);
          }
          to {
              opacity: 1;
              transform: translate(-50%, -50%);
          }
      }

      /* 文章列表中的按钮样式 */
      .article-csdn-qc-btn {
          background: linear-gradient(135deg, #ff7e5f, #feb47b);
          border: none;
          border-radius: 14px;
          color: white;
          padding: 5px 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(255, 126, 95, 0.3);
          transition: all 0.2s ease;
          margin-left: 10px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      .article-csdn-qc-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(255, 126, 95, 0.4);
      }
  `);

  // 主要配置项
  const CONFIG = {
      "CSDN_QC_X-Ca-Key": {
          "hint": "X-Ca-Key",
          "storage_method": "gm"
      },
      "CSDN_QC_X-Ca-Nonce": {
          "hint": "X-Ca-Nonce",
          "storage_method": "gm"
      },
      "CSDN_QC_X-Ca-Signature": {
          "hint": "X-Ca-Signature",
          "storage_method": "gm"
      },
      "CSDN_QC_ID": {
          "hint": "CSDN ID (个人主页地址中的ID)",
          "storage_method": "gm",
          "null_ok_if": "CSDN_QC_DOMAIN_ID"
      },
      "CSDN_QC_DOMAIN_ID": {
          "hint": "CSDN Domain ID (个人域名地址中的ID)",
          "storage_method": "gm",
          "null_ok_if": "CSDN_QC_ID"
      },
  };

  // 工具函数
  const utils = {
      isNull(value) {
          const specialNull = [null, "null", "", undefined, NaN, "undefined"];
          return specialNull.includes(value);
      },

      debounce(func, wait) {
          let timeout;
          return function executedFunction(...args) {
              const later = () => {
                  clearTimeout(timeout);
                  func(...args);
              };
              clearTimeout(timeout);
              timeout = setTimeout(later, wait);
          };
      }
  };

  // UI组件
  const UI = {
      createButton(text, onClick, className = '', isSmall = false) {
          const button = document.createElement('button');
          button.textContent = text;
          button.className = `csdn-qc-btn ${className}`.trim();
          button.addEventListener('click', onClick);

          if (isSmall) {
              button.style.padding = '6px 12px';
              button.style.fontSize = '12px';
          }

          return button;
      },

      showToast(message, duration = 3000) {
          // 移除现有的toast
          const existingToast = document.querySelector('.csdn-qc-toast');
          if (existingToast) {
              document.body.removeChild(existingToast);
          }

          const toast = document.createElement('div');
          toast.className = 'csdn-qc-toast';
          toast.textContent = message;

          document.body.appendChild(toast);

          setTimeout(() => {
              if (toast.parentNode) {
                  toast.style.opacity = '0';
                  toast.style.transition = 'opacity 0.5s ease';
                  setTimeout(() => {
                      if (toast.parentNode) {
                          document.body.removeChild(toast);
                      }
                  }, 500);
              }
          }, duration);

          return toast;
      },

      showConfigModal() {
          // 创建遮罩层
          const overlay = document.createElement('div');
          overlay.className = 'csdn-qc-modal-overlay';

          // 创建模态框
          const modal = document.createElement('div');
          modal.className = 'csdn-qc-config-modal';

          // 添加标题
          const title = document.createElement('h3');
          title.textContent = '配置CSDN质量分查询参数';
          modal.appendChild(title);

          // 添加配置项输入框
          const configForm = document.createElement('div');

          Object.keys(CONFIG).forEach(key => {
              const group = document.createElement('div');
              group.className = 'csdn-qc-config-group';

              const label = document.createElement('label');
              label.textContent = CONFIG[key].hint;
              label.htmlFor = key;

              const input = document.createElement('input');
              input.id = key;
              input.type = 'text';
              input.value = user.getValue(key) || '';
              input.placeholder = `请输入${CONFIG[key].hint}`;

              group.appendChild(label);
              group.appendChild(input);
              configForm.appendChild(group);
          });

          modal.appendChild(configForm);

          // 添加按钮组
          const buttonGroup = document.createElement('div');
          buttonGroup.className = 'csdn-qc-config-buttons';

          const cancelBtn = this.createButton('取消', () => {
              document.body.removeChild(overlay);
              document.body.removeChild(modal);
          }, '', true);

          const saveBtn = this.createButton('保存', () => {
              Object.keys(CONFIG).forEach(key => {
                  const input = document.getElementById(key);
                  if (input) {
                      user.setValue(key, input.value, CONFIG[key].storage_method);
                  }
              });

              this.showToast('配置已保存');

              setTimeout(() => {
                  document.body.removeChild(overlay);
                  document.body.removeChild(modal);
              }, 800);
          }, '', true);

          saveBtn.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
          saveBtn.style.boxShadow = '0 3px 10px rgba(76, 175, 80, 0.3)';

          buttonGroup.appendChild(cancelBtn);
          buttonGroup.appendChild(saveBtn);
          modal.appendChild(buttonGroup);

          // 添加到页面
          document.body.appendChild(overlay);
          document.body.appendChild(modal);

          // 点击遮罩层关闭
          overlay.addEventListener('click', () => {
              document.body.removeChild(overlay);
              document.body.removeChild(modal);
          });
      },

      // 创建可伸缩按钮容器
      createCollapsibleButtonContainer() {
          const container = document.createElement('div');
          container.className = 'csdn-qc-container';

          // 创建切换按钮
          const toggleBtn = document.createElement('button');
          toggleBtn.className = 'csdn-qc-toggle';
          toggleBtn.innerHTML = '≡';
          toggleBtn.title = '展开/收起质量分查询工具';

          // 创建按钮容器
          const buttonsContainer = document.createElement('div');
          buttonsContainer.className = 'csdn-qc-buttons';

          // 添加功能按钮
          const queryBtn = this.createButton('质量分查询', () => {
              core.href = window.location.href;
              core.queryQualityScore(queryBtn);
          });

          const configBtn = this.createButton('配置', () => {
              this.showConfigModal();
          });

          buttonsContainer.appendChild(queryBtn);
          buttonsContainer.appendChild(configBtn);

          container.appendChild(toggleBtn);
          container.appendChild(buttonsContainer);

          // 切换按钮功能
          toggleBtn.addEventListener('click', () => {
              container.classList.toggle('expanded');

              // 更新切换按钮图标
              if (container.classList.contains('expanded')) {
                  toggleBtn.innerHTML = '×';
              } else {
                  toggleBtn.innerHTML = '≡';
              }
          });

          // 添加到页面
          document.body.appendChild(container);

          return container;
      }
  };

  // 用户配置管理
  const user = {
      getValue(key, mode = 'gm') {
          if (mode === 'gm') {
              return GM_getValue(key);
          } else if (mode === 'storage') {
              return localStorage.getItem(key);
          }
          return null;
      },

      setValue(key, value, mode = 'gm') {
          if (mode === 'gm') {
              GM_setValue(key, value);
          } else if (mode === 'storage') {
              localStorage.setItem(key, value);
          }
      },

      fillValues(onlyFillNull = false, showPrompt = true) {
          Object.keys(CONFIG).forEach(key => {
              const config = CONFIG[key];

              if (onlyFillNull && !utils.isNull(this.getValue(key, config.storage_method))) {
                  return;
              }

              if (!utils.isNull(config.null_ok_if) &&
                  !utils.isNull(this.getValue(config.null_ok_if, CONFIG[config.null_ok_if].storage_method))) {
                  return;
              }

              if (showPrompt) {
                  const value = window.prompt(config.hint, this.getValue(key, config.storage_method));
                  if (value !== null) {
                      this.setValue(key, value, config.storage_method);
                  }
              }
          });
      }
  };

  // API请求功能
  const api = {
      async request(url, method, headers, data) {
          return new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open(method, url, true);

              for (const key in headers) {
                  xhr.setRequestHeader(key, headers[key]);
              }

              xhr.onreadystatechange = function() {
                  if (xhr.readyState === 4) {
                      if (xhr.status === 200) {
                          resolve(JSON.parse(xhr.responseText));
                      } else {
                          reject(new Error(`请求失败: ${xhr.status}`));
                      }
                  }
              };

              xhr.onerror = () => reject(new Error('网络错误'));
              xhr.send(data);
          });
      },

      async getQualityScore(articleUrl, headers) {
          try {
              const url = "https://bizapi.csdn.net/trends/api/v1/get-article-score";
              const data = `url=${encodeURIComponent(articleUrl)}`;

              const response = await this.request(url, "POST", headers, data);
              return response.data.score;
          } catch (error) {
              console.error('获取质量分失败:', error);
              throw error;
          }
      }
  };

  // 核心功能
  const core = {
      href: window.location.href,

      getCSDNId() {
          let id = this.href.match(/blog\.csdn\.net\/(\w+)/);
          let idType = "CSDN_QC_ID";

          if (!id) {
              id = this.href.match(/(\w+)\.blog\.csdn\.net/);
              idType = "CSDN_QC_DOMAIN_ID";
          }

          return {
              id: id ? id[1] : null,
              type: idType
          };
      },

      getArticleId() {
          let id = this.href.match(/articleId=(\d+)/);
          if (!id) {
              id = this.href.match(/details\/(\d+)/);
          }
          return id ? id[1] : null;
      },

      getArticleUrl() {
          const articleId = this.getArticleId();
          if (utils.isNull(articleId)) {
              UI.showToast("请先进入文章页面或编辑页再点击查询！", 3000);
              return null;
          }

          const csdnId = user.getValue("CSDN_QC_ID");
          const domainId = user.getValue("CSDN_QC_DOMAIN_ID");

          if (!utils.isNull(csdnId)) {
              return `https://blog.csdn.net/${csdnId}/article/details/${articleId}`;
          }

          if (!utils.isNull(domainId)) {
              return `https://${domainId}.blog.csdn.net/article/details/${articleId}`;
          }

          UI.showToast("请先配置CSDN ID再重新查询！", 3000);
          return null;
      },

      getHeaders() {
          const headers = {
              "Content-Type": "application/x-www-form-urlencoded",
              "Accept": "application/json, text/plain, */*",
              "X-Ca-Key": user.getValue("CSDN_QC_X-Ca-Key"),
              "X-Ca-Nonce": user.getValue("CSDN_QC_X-Ca-Nonce"),
              "X-Ca-Signature": user.getValue("CSDN_QC_X-Ca-Signature"),
              "X-Ca-Signature-Headers": "x-ca-key,x-ca-nonce",
              "X-Ca-Signed-Content-Type": "multipart/form-data",
          };

          if (utils.isNull(headers["X-Ca-Key"]) ||
              utils.isNull(headers["X-Ca-Nonce"]) ||
              utils.isNull(headers["X-Ca-Signature"])) {
              UI.showToast("请先配置API密钥再重新查询！", 3000);
              return null;
          }

          return headers;
      },

      async queryQualityScore(button = null) {
          if (button) {
              button.classList.add('loading');
              button.textContent = '查询中...';
          }

          try {
              const articleUrl = this.getArticleUrl();
              if (!articleUrl) return;

              const headers = this.getHeaders();
              if (!headers) return;

              const score = await api.getQualityScore(articleUrl, headers);
              UI.showToast(`文章质量分: ${score}`, 3000);
          } catch (error) {
              console.error('查询质量分失败:', error);
              UI.showToast('查询失败，请检查配置或网络', 3000);
          } finally {
              if (button) {
                  button.classList.remove('loading');
                  button.textContent = '质量分查询';

                  // 3秒后恢复原始文本
                  setTimeout(() => {
                      if (button) button.textContent = '质量分查询';
                  }, 3000);
              }
          }
      },

      addArticleButtons() {
          const articles = document.querySelectorAll("article");

          articles.forEach(article => {
              if (article.querySelector('.article-csdn-qc-btn')) return;

              const link = article.querySelector("a");
              if (!link) return;

              const button = document.createElement('button');
              button.className = 'article-csdn-qc-btn';
              button.textContent = '质量分';

              button.addEventListener('click', () => {
                  this.href = link.href;
                  this.queryQualityScore(button);
              });

              article.appendChild(button);
          });
      },

      init() {
          const idInfo = this.getCSDNId();
          if (idInfo.id) {
              user.setValue(idInfo.type, idInfo.id, CONFIG[idInfo.type].storage_method);
          }

          user.fillValues(true, false);

          // 创建可伸缩按钮容器
          UI.createCollapsibleButtonContainer();

          if (this.href.match(/(blog\.csdn\.net\/[^\/]+\?type=(blog|lately)|\.blog\.csdn\.net\/?\?type=(blog|lately))/)) {
              this.addArticleButtons();

              const debouncedAddButtons = utils.debounce(() => {
                  this.addArticleButtons();
              }, 500);

              window.addEventListener("scroll", debouncedAddButtons);

              // 使用MutationObserver监听DOM变化
              const observer = new MutationObserver(debouncedAddButtons);
              observer.observe(document.body, { childList: true, subtree: true });
          }
      }
  };

  // 初始化脚本
  function initScript() {
      // 注册菜单命令
      GM_registerMenuCommand("配置参数", () => UI.showConfigModal());
      GM_registerMenuCommand("手动填写参数", () => user.fillValues(false, true));

      // 页面加载完成后初始化
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => core.init());
      } else {
          core.init();
      }
  }

  // 启动脚本
  initScript();
})();