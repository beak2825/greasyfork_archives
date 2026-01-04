// ==UserScript==
// @name         Approve Max
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  自动添加评审人并Approve
// @author       Pober Wong
// @match        https://dev.sankuai.com/code/repo-detail/*/pr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523577/Approve%20Max.user.js
// @updateURL https://update.greasyfork.org/scripts/523577/Approve%20Max.meta.js
// ==/UserScript==



(function() {
  'use strict';

  // 从URL获取PR信息
  function getPRInfoFromUrl() {
      const urlParts = window.location.pathname.split('/');
      return {
          group: urlParts[3],
          projectKey: urlParts[4],
          repoSlug: urlParts[5],
          prId: urlParts[6]
      };
  }

  // 等待DOM加载完成
  function waitForElement(selector) {
      return new Promise(resolve => {
          if (document.querySelector(selector)) {
              return resolve(document.querySelector(selector));
          }

          const observer = new MutationObserver(mutations => {
              if (document.querySelector(selector)) {
                  observer.disconnect();
                  resolve(document.querySelector(selector));
              }
          });

          observer.observe(document.body, {
              childList: true,
              subtree: true
          });
      });
  }

  // 获取title节点的内容
  function getTitle() {
      const titleElement = document.querySelector('.title');
      if (!titleElement) {
          console.warn('未找到title元素');
          return null;
      }
      return titleElement.textContent.trim();
  }

  // 获取title节点的内容
  function isAlreadyApproved() {
    const spanElements = document.querySelectorAll('span');
    return Array.from(spanElements).some(span => span.textContent.trim().toLowerCase() === 'approved');
  }

  function getTargetBranch() {
      const elements = document.querySelectorAll('.branch-info-text');
      if (!elements || elements.length < 2) {
          console.warn('未找到足够的分支元素');
          return null;
      }
      return elements[1].textContent.trim();
  }

  // 优化 request 函数,统一处理响应状态码
  async function request(path, options = {}) {
      const defaultHeaders = {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'M-APPKEY': 'fe_devtools-code-fe',
          'X-Requested-With': 'XMLHttpRequest',
          'stash-area': 'mcode',
          'web-type': 'devtools',
          'devtools-host': 'dev.sankuai.com'
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      try {
          const config = {
              headers: { ...defaultHeaders, ...options.headers },
              signal: controller.signal,
              ...options
          };

          if (config.body && typeof config.body === 'object') {
              config.body = JSON.stringify(config.body);
          }

          // 检查 path 是否以 http:// 或 https:// 开头
          const url = path.startsWith('http://') || path.startsWith('https://')
          ? path
          : `https://dev.sankuai.com${path}`;

          const response = await fetch(url, config);

          const data = await response.json();

          // 统一处理状态码
          if (response.ok && (data.code === 0 || data.code === 200)) {
              return data.data || data.result || data;
          }

          throw new Error(data.message || `请求失败: ${response.status}`);
      } catch (error) {
          if (error.name === 'AbortError') {
              throw new Error('请求超时');
          }
          throw error;
      } finally {
          clearTimeout(timeout);
      }
  }

  // 添加上报数据的方法
  async function reportMetric(value) {
    const url = 'https://catfront.dianping.com/api/metric?v=2&sdk=1.2.7&p=wxapp-zhenguo';
    const data = [{
        key: "approve_max",
        vs: [value]
    }];

    try {
        const response = await request(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Referer': 'https://servicewechat.com/wxc147016e2b3bf9d6/devtools/page-frame.html'
            },
            body: 'data=' + encodeURIComponent(JSON.stringify(data))
        });

        console.log('Metric reported successfully:', response);
    } catch (error) {
        console.error('Error reporting metric:', error);
    }
  }

  // 添加评审人，rs
  async function setReviewers(misIds) {
      const { group, repoSlug, projectKey, prId } = getPRInfoFromUrl();
      const path = `/rest/api/2.0/projects/${group}/repos/${projectKey}/pull-requests/${prId}`;

      const reviewers = misIds.map(name => ({ user: { name } }));

      try {
          await request(path, {
              method: 'PUT',
              body: {
                  toRef: {
                      id: `refs/heads/${getTargetBranch()}`,
                      repository: {
                          slug: projectKey,
                          project: {
                              key: group
                          }
                      }
                  },
                  title: getTitle(),
                  reviewExpiredDate: 0,
                  reviewers: reviewers,
                  topics: [],
                  version: 1,
                  deleteSourceRefAfterMerge: false,
                  allowInMergeQueue: false
              }
          });
      } catch (err) {
      }
  }

  // 简化 getCurrentUserId，不需要再判断状态码
  async function getCurrentUserId() {
      try {
          const data = await request('/api/2.0/auth/userInfo', { method: 'GET' });
          return data.login;
      } catch (error) {
          console.error('获取用户信息失败:', error);
          return '';
      }
  }

  // 简化 getCurrentReviewers，不需要再判断状态码
  async function getCurrentReviewers() {
      const { group, projectKey, prId } = getPRInfoFromUrl();
      const path = `/rest/api/2.0/projects/${group}/repos/${projectKey}/pull-requests/${prId}/reviewers`;

      try {
          const data = await request(path, { method: 'GET' });
          return data.values?.map(item => item.user.name) || [];
      } catch (error) {
          console.error('获取评审人列表失败:', error);
          return [];
      }
  }

  // 显示提示信息
  function showToast(message, duration = 1800) {
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.cssText = `
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #333;
          color: #fff;
          padding: 10px 20px;
          border-radius: 5px;
          z-index: 9999;
      `;
      document.body.appendChild(toast);

      return new Promise(resolve => {
          setTimeout(() => {
              document.body.removeChild(toast);
              resolve();
          }, duration);
      });
  }

  // 初始化
  async function init() {
      // 等待 Approve 按钮加载完成
      const approveBtn = await waitForElement('.approve-btn button');
      if (approveBtn) {
          // 移除禁用状态
          if (approveBtn.disabled) {
              approveBtn.disabled = false;
              approveBtn.classList.remove('mtd-btn-disabled');
          }

          // 添加高科技科幻风格的按钮样式
          const style = document.createElement('style');
          style.textContent = `
              @keyframes neon-pulse {
                  0% {
                      box-shadow: 0 0 5px #00F0FF, 0 0 10px #00F0FF;
                      border-color: #00F0FF;
                  }
                  50% {
                      box-shadow: 0 0 15px #00F0FF, 0 0 20px #00F0FF, 0 0 30px #00F0FF;
                      border-color: #00CFFF;
                  }
                  100% {
                      box-shadow: 0 0 5px #00F0FF, 0 0 10px #00F0FF;
                      border-color: #00F0FF;
                  }
              }

              @keyframes scan-line {
                  0% {
                      transform: translateY(-100%);
                  }
                  100% {
                      transform: translateY(100%);
                  }
              }

              .approve-max-button {
                  width: 145px;
                  position: relative;
                  color: white !important;
                  background: linear-gradient(45deg, #0B132B, #1C2541) !important;
                  border: 1px solid #00F0FF !important;
                  box-shadow: 0 0 10px #00F0FF !important;
                  animation: neon-pulse 2s infinite ease-in-out !important;
                  overflow: hidden !important;
                  border-radius: 4px !important;
              }

              .approve-max-button::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 10px;
                  background: linear-gradient(to bottom,
                      rgba(0, 240, 255, 0.5),
                      rgba(0, 240, 255, 0)
                  ) !important;
                  z-index: 1;
                  animation: scan-line 2s infinite ease-in-out !important;
              }

              .approve-max-button::after {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background:
                      linear-gradient(90deg, transparent 50%, rgba(0, 240, 255, 0.1) 50%),
                      linear-gradient(rgba(0, 240, 255, 0.05), rgba(0, 240, 255, 0.05)) !important;
                  background-size: 4px 100%, 100% 4px !important;
                  z-index: 0;
                  pointer-events: none;
              }

              .approve-max-button span {
                  position: relative;
                  z-index: 2;
                  letter-spacing: 1px;
                  font-weight: bold !important;
              }
          `;
          document.head.appendChild(style);

          // 添加类名，应用高科技科幻风格样式
          approveBtn.classList.add('approve-max-button');

          // 修改按钮文本
          const textSpan = approveBtn.querySelector('.mtd-button-content span:not(.mtdicon)');
          if (textSpan) {
              textSpan.textContent = 'Approve Max';
          }

          // 监听DOM变化，确保样式和类名不会丢失
          const observer = new MutationObserver(mutations => {
              // 如果按钮丢失了类名，重新添加
              if (!approveBtn.classList.contains('approve-max-button')) {
                  approveBtn.classList.add('approve-max-button');
              }

              // 确保按钮没有被禁用
              if (approveBtn.disabled) {
                  approveBtn.disabled = false;
                  approveBtn.classList.remove('mtd-btn-disabled');
              }
          });

          // 监听属性变化和子元素变化
          observer.observe(approveBtn, {
              attributes: true,
              childList: true,
              subtree: true
          });

          // 拦截点击事件
          approveBtn.addEventListener('click', async function handleApproveClick(e) {
              // 检查是否是程序模拟的点击
              if (e._isCustomEvent) {
                  return; // 如果是程序模拟的点击，不做任何处理
              }

              // 阻止默认事件
              e.preventDefault();
              e.stopPropagation();

              try {
                  // 首先检查是否已经Approved
                  if (isAlreadyApproved()) {
                      reportMetric(0)
                      showToast('PR已经是Approved状态');
                      return;
                  }

                  // 获取当前评审人列表和当前用户
                  const currentReviewers = await getCurrentReviewers();
                  const currentUserId = await getCurrentUserId();

                  // 如果当前用户不在评审人列表中，添加进去
                  if (!currentReviewers.includes(currentUserId)) {
                      await setReviewers(currentReviewers.concat([currentUserId]));
                  }

                  // 创建一个带有标记的鼠标事件
                  const customEvent = new MouseEvent('click', {
                      bubbles: true,
                      cancelable: true,
                      view: window
                  });

                  // 添加自定义标记
                  customEvent._isCustomEvent = true;

                  // 确保按钮保持我们的样式
                  setTimeout(() => {
                      if (!approveBtn.classList.contains('approve-max-button')) {
                          approveBtn.classList.add('approve-max-button');
                      }
                  }, 100);

                  // 触发点击事件
                  approveBtn.dispatchEvent(customEvent);

                  reportMetric(1);
              } catch (error) {
                  console.error('操作失败:', error);
                  reportMetric(0);
                  showToast('自动审批失败，请重试: ' + error.message);
              }
          }, true); // 使用捕获阶段来确保我们的处理程序最先执行
      }
  }

  init();
})();