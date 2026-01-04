// ==UserScript==
// @name         知识库助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  添加网页到小程序助手知识库
// @author       Pober Wong
// @match        https://km.sankuai.com/*
// @match        https://aigc.sankuai.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/522303/%E7%9F%A5%E8%AF%86%E5%BA%93%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522303/%E7%9F%A5%E8%AF%86%E5%BA%93%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
  'use strict';


  // 配置参数
  const DEFAULT_CONFIG = {
    targetFolderId: "2702432279",
    datasetId: "396192383074305",
    spaceId: "1274492",
    baseUrl: "https://aigc.sankuai.com",
    defaultRules: {
        mode: "automatic",
        rules: {
            chunkSize: 500,
            separators: "",
            removeExtraSpace: true,
            removeUrlEmails: false,
            ignoreMultiTitle: false
        }
    }
  };

  // 从localStorage获取用户配置
  function getUserConfig() {
    const savedConfig = localStorage.getItem('kmAssistantConfig');
    return savedConfig ? JSON.parse(savedConfig) : {};
  }

  // 合并默认配置和用户配置
  const CONFIG = { ...DEFAULT_CONFIG, ...getUserConfig() };

  function showLoadingOverlay() {
      // 创建遮罩层
      const overlay = document.createElement('div');
      overlay.className = 'km-loading-overlay';
      overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
  `;

      // 创建旋转的圆形按钮
      const spinner = document.createElement('div');
      spinner.className = 'km-loading-spinner';
      spinner.innerHTML = '加入<br>知识库';
      spinner.style.cssText = `
      width: 60px;
      height: 60px;
      background-color: #1877F2;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      text-align: center;
      line-height: 1.2;
      animation: spin3D 2s infinite linear;
      transform-style: preserve-3d;
      perspective: 1000px;
  `;

      // 添加动画样式
      const style = document.createElement('style');
      style.textContent = `
      @keyframes spin3D {
          0% {
              transform: rotateY(0deg);
          }
          100% {
              transform: rotateY(360deg);
          }
      }
  `;
      document.head.appendChild(style);

      overlay.appendChild(spinner);
      document.body.appendChild(overlay);

      // 返回一个包含关闭方法的对象
      return {
          close: () => {
              overlay.style.transition = 'opacity 0.5s';
              overlay.style.opacity = '0';
              setTimeout(() => overlay.remove(), 500);
          },
          updateText: (text) => {
              spinner.innerHTML = text;
          }
      };
  }

  function showToast(message, type = "normal", duration = 3000) {
      const toast = document.createElement('div');
      toast.style.cssText = `
          position: fixed;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);
          background-color: ${type === "error" ? 'red': 'rgba(0, 0, 0, 0.7)'};
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          z-index: 10000;
      `;
      toast.textContent = message;
      document.body.appendChild(toast);

      // 3秒后移除
      setTimeout(() => toast.remove(), duration);
  }

  async function request(url, options = {}) {
      const response = await fetch(url, {
          method: options.method || 'GET',
          credentials: 'include', // 自动带上 cookie
          headers: {
              'Content-Type': 'application/json',
              'Origin': CONFIG.baseUrl,
              'Referer': `${CONFIG.baseUrl}/app/knowledge/detail/${CONFIG.datasetId}/${CONFIG.spaceId}/upload`,
              'm-appkey': 'fe_com.sankuai.speechfe.ai.factory',
              ...options.headers
          },
          body: options.data ? JSON.stringify(options.data) : undefined
      });

      if (!response.ok) {
          throw new Error(response.statusText);
      }

      const data = await response.json();
      if (data.status !== 0) {
          throw new Error(data.data?.msg || data.message || '请求失败');
      }

      return data;
  }

  // 查找是否已经上传过
  async function findDocument(link) {
      const checkUrl = new URL(`${CONFIG.baseUrl}/appfactory/dataset/document/list`);
      checkUrl.searchParams.append('datasetId', CONFIG.datasetId);
      checkUrl.searchParams.append('spaceId', CONFIG.spaceId);
      checkUrl.searchParams.append('paging.offset', 1);
      checkUrl.searchParams.append('paging.limit', 100000);

      const response = await request(checkUrl.toString());
      debugger;
      return (response.data.items || []).find(item => item.link === link)?.id
  }

  async function deleteDocument(documentId) {
      await request(`${CONFIG.baseUrl}/appfactory/dataset/document/delete`, {
          method: 'POST',
          data: {
              datasetId: CONFIG.datasetId,
              documentId: documentId,
              spaceId: CONFIG.spaceId,
              sourceFormat: 'url'
          }
      });
  }

  async function executeUpload(targetUrl, pageName) {
      // 第一个请求：URL检查
      const checkUrl = new URL(`${CONFIG.baseUrl}/appfactory/dataset/document/url-check`);
      checkUrl.searchParams.append('datasetId', CONFIG.datasetId);
      checkUrl.searchParams.append('spaceId', CONFIG.spaceId);
      checkUrl.searchParams.append('url', targetUrl);

      const response1 = await request(checkUrl.toString());
      console.log('1. URL检查响应:', response1);

      // 第二个请求：批量URL上传
      const response2 = await request(`${CONFIG.baseUrl}/appfactory/dataset/document/batchurl-crawl-upload`, {
          method: 'POST',
          data: {
              datasetId: CONFIG.datasetId,
              spaceId: CONFIG.spaceId,
              urlList: [{
                  name: pageName,
                  url: targetUrl,
                  autoRefresh: true,
                  inputLoading: false
              }]
          }
      });
      console.log('2. 批量URL上传响应:', response2);

      const documentId = response2.data?.[0]?.id

      // 第三个请求：文件索引评估
      const response3 = await request(`${CONFIG.baseUrl}/appfactory/dataset/document/file-indexing-estimate`, {
          method: 'POST',
          data: {
              datasetId: CONFIG.datasetId,
              documentId: documentId,
              spaceId: CONFIG.spaceId,
              openAuth: false,
              processRule: CONFIG.defaultRules
          }
      });
      console.log('3. 文件索引评估响应:', response3);

      // 第四个请求：批量保存
      const response4 = await request(`${CONFIG.baseUrl}/appfactory/dataset/document/batchsave`, {
          method: 'POST',
          data: {
              datasetId: CONFIG.datasetId,
              spaceId: CONFIG.spaceId,
              documentList: [{
                  documentId: documentId,
                  indexingTechnique: "economy",
                  processRule: CONFIG.defaultRules
              }]
          }
      });
      console.log('4. 批量保存响应:', response4);
  }

  async function copyDocument(sourceId, targetParentId) {
      const response = await fetch('https://km.sankuai.com/api/docs/10740/add', {
          method: 'POST',
          headers: {
              'accept': '*/*',
              'content-type': 'application/json; charset=utf-8',
              'x-requested-with': 'XMLHttpRequest',
              'x-locale': 'zh-CN',
              'x-time-zone': 'UTC+8'
          },
          credentials: 'include',
          body: JSON.stringify({
              parentId: targetParentId,
              type: 3,
              templateId: null,
              width: 0,
              copyFromContentId: sourceId
          })
      });

      if (!response.ok) {
          throw new Error('复制文档失败');
      }

      const data = await response.json();
      if (data.status !== 0) {
          throw new Error(data.message || '复制文档失败');
      }
      return data.data;
  }

   // 在 AIGC 域名下
  if (window.location.hostname === 'aigc.sankuai.com') {
      const urlParams = new URLSearchParams(window.location.search);
      const isXcxLibrary = urlParams.get('isXcxLibrary');
      if(!isXcxLibrary) return;

      // 先显示 loading
//        const loading = showToast('正在添加到知识库，请稍候...', 'normal', 1000);

      const loadingHandler = showLoadingOverlay()
      let type = 0 // 新增
      const returnUrl = urlParams.get('returnUrl');
      const pageTitle = urlParams.get('title');

      if (returnUrl) {
          findDocument(returnUrl).then(documentId => {
              if (documentId) {
                  type = 1 // 刷新
                  return deleteDocument(documentId).then(() => executeUpload(returnUrl, pageTitle))
              } else {
                  return executeUpload(returnUrl, pageTitle)
              }
          })
          .then(() => {
              loadingHandler.close()
              showToast(`知识库${type ? '已刷新' : '添加成功'}，3s 后关闭当前页面`)
          })
          .catch(err => {
              loadingHandler.close()
              showToast((err.message || "添加知识库失败") + "，3s 后关闭当前页面", "error")
          }).finally(() => {
              setTimeout(() => {
                 window.close()
              }, 4000)
          })
      }
  }

  // 在 KM 域名下
  if (window.location.hostname === 'km.sankuai.com') {
      createConfigPanel();
      // 创建按钮容器
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
          position: fixed;
          top: 140px;
          right: 40px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
      `;

      // 创建"加入知识库"按钮
      const button = document.createElement('button');
      button.innerHTML = '加入<br>知识库';
      button.style.cssText = `
          width: 60px;
          height: 60px;
          background-color: #1877F2;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 12px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1.2;
          text-align: center;
          padding: 0;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
      `;

      // 创建配置按钮
      const configButton = document.createElement('button');
      configButton.innerHTML = '⚙️';
      configButton.style.cssText = `
          width: 20px;
          height: 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
          position: absolute;
          bottom: -8px;
          left: -8px;
      `;

      // 添加按钮的hover效果
      button.addEventListener('mouseover', () => {
          button.style.backgroundColor = '#0d6efd';
          button.style.transform = 'scale(1.05)';
      });

      button.addEventListener('mouseout', () => {
          button.style.backgroundColor = '#1877F2';
          button.style.transform = 'scale(1)';
      });

      configButton.addEventListener('mouseover', () => {
          configButton.style.transform = 'rotate(30deg)';
      });

      configButton.addEventListener('mouseout', () => {
          configButton.style.transform = 'rotate(0deg)';
      });

      // 组装按钮
      buttonContainer.appendChild(button);
      buttonContainer.appendChild(configButton);
      document.body.appendChild(buttonContainer);

      // 添加配置按钮的点击事件
      configButton.addEventListener('click', () => {
          const panel = document.querySelector('div[style*="position: fixed"][style*="top: 210px"]');
          if (panel) {
              panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
          }
      });

      button.addEventListener('click', async () => {
          const loadingHandler = showLoadingOverlay();
          try {
              const ownerName = document.querySelector(".ct-user-name").textContent;
              const currentUser = unsafeWindow.__USER_INFO__.name;

              // 获取当前页面URL和文档ID
              const currentUrl = window.location.href;
              const match = currentUrl.match(/\/(\d+)(?:\?|$)/);
              if (!match) {
                  throw new Error('无法获取文档ID');
              }
              const sourceId = match[1];

              let targetUrl = currentUrl;

              // 如果不是文档所有者，需要先复制文档
              if (ownerName !== currentUser) {
                  loadingHandler.updateText('正在复制文档...');
                  const copyId = await copyDocument(sourceId, CONFIG.targetFolderId);
                  if (!copyId) {
                      throw new Error('复制文档失败');
                  }
                  // 更新为新文档的URL
                  targetUrl = `https://km.sankuai.com/collabpage/${copyId}`;
              }

              // 打开知识库页面
              const params = new URLSearchParams({
                  returnUrl: targetUrl,
                  title: document.title || '[未命名页面]',
                  isXcxLibrary: true
              });
              window.open(`${CONFIG.baseUrl}/app/knowledge/detail/${CONFIG.datasetId}/${CONFIG.spaceId}/upload?${params.toString()}`, '_blank');
          } catch (error) {
              showToast(error.message || '操作失败', 'error');
          } finally {
              loadingHandler.close();
          }
      });
  }

  // 创建配置面板
  function createConfigPanel() {
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        top: 210px;
        right: 110px;
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 9999;
        display: none;
        width: 280px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        transition: all 0.3s ease;
    `;

    panel.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <h3 style="margin: 0; font-size: 18px; color: #333; flex: 1;">知识库助手配置</h3>
            <button id="closeConfig" style="background: none; border: none; cursor: pointer; padding: 5px; font-size: 20px;">×</button>
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 8px; color: #666; font-size: 14px;">Friday 知识库 ID</label>
            <input type="text" id="datasetId" value="${CONFIG.datasetId}"
                style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;
                transition: border-color 0.3s ease; outline: none;">
        </div>
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; color: #666; font-size: 14px;">Friday 空间 ID</label>
            <input type="text" id="spaceId" value="${CONFIG.spaceId}"
                style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;
                transition: border-color 0.3s ease; outline: none;">
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 8px; color: #666; font-size: 14px;">学城临时目录</label>
            <input type="text" id="targetFolderId" value="${CONFIG.targetFolderId}"
                style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;
                transition: border-color 0.3s ease; outline: none;">
        </div>
        <button id="saveConfig"
            style="width: 100%; padding: 10px; background: #1877F2; color: white; border: none; border-radius: 6px;
            cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease;">
            保存配置
        </button>
    `;

    document.body.appendChild(panel);

    // 事件处理
    document.getElementById('closeConfig').onclick = () => {
        panel.style.display = 'none';
    };

    document.getElementById('saveConfig').onclick = () => {
        const newConfig = {
            targetFolderId: document.getElementById('targetFolderId').value,
            datasetId: document.getElementById('datasetId').value,
            spaceId: document.getElementById('spaceId').value
        };
        localStorage.setItem('kmAssistantConfig', JSON.stringify(newConfig));
        Object.assign(CONFIG, newConfig);
        panel.style.display = 'none';
        showToast('配置已保存');
    };
  }
})();