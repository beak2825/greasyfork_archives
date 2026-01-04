// ==UserScript==
// @name         AI无水印下载-终极稳定版
// @version      1.7.2
// @description  独家AI内容下载工具　未经授权禁止任何形式的修改和使用
// @copyright    元亨利贞
// @author       元亨利贞
// @icon         https://www.google.com/s2/favicons?domain=jimeng.jianying.com
// @license      Proprietary
// @license      Copyright (C) 2025 元亨利贞 All rights reserved.
// @license      Unauthorized copying, modification, distribution or use is strictly prohibited.
// @match        https://www.doubao.com/*
// @match        https://jimeng.jianying.com/ai-tool/*
// @match        https://www.meijian.com/mj-box/*
// @match        https://www.meijian.com/ai/*
// @match        https://meijian.com/mj-box/*
// @match        https://meijian.com/ai/*
// @match        https://www.gaoding.com/editor/design?*
// @match        https://www.focodesign.com/editor/design?*
// @match        https://www.focodesign.com/editor/odyssey?template_id=*
// @match        https://*.nipic.com/*
// @match        https://*.ntimg.cn/*
// @match        https://*.huitu.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_notification
// @run-at       document-start
// @noframes
// @namespace    https://greasyfork.org/users/1372325
// @connect      *
// @connect      *.byteimg.com
// @connect      byteimg.com
// @connect      vlabvod.com
// @connect      meijian.com
// @connect      jianying.com
// @connect      *.jianying.com
// @connect      doubao.com
// @connect      gd-filems.dancf.com
// @connect      ntimg.cn
// @connect      nipic.com
// @connect      huitu.com
// @downloadURL https://update.greasyfork.org/scripts/535085/AI%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD-%E7%BB%88%E6%9E%81%E7%A8%B3%E5%AE%9A%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/535085/AI%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD-%E7%BB%88%E6%9E%81%E7%A8%B3%E5%AE%9A%E7%89%88.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // 拦截SVG水印
    const blockedImageReplacement = 'data:image/webp;base64,UklGRpYAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAIAAAAAAFZQOCAYAAAAMAEAnQEqAQABAA/A/iWkAANwAP7lagAAUFNBSU4AAAA4QklNA+0AAAAAABAASAAAAAEAAgBIAAAAAQACOEJJTQQoAAAAAAAMAAAAAj/wAAAAAAAAOEJJTQRDAAAAAAAOUGJlVwEQAAYAAAAAAAA=';
    const originalSetSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set;
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
        set(value) {
            if (value.startsWith('data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyNTAiIHZpZXdCb3g9IjAgMCAzMDAgMjUwIiBmaWxsPSJub25lIi')) {
                originalSetSrc.call(this, blockedImageReplacement);
                return;
            }
            originalSetSrc.call(this, value);
        },
    });

    // 创建下载按钮
    function createDownloadButton() {
        const container = document.createElement('div');
        container.id = 'gaoding-downloader';
        container.style.position = 'fixed';
        container.style.left = '20px';
        container.style.bottom = '20px';
        container.style.zIndex = '9999';

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = '高清下载';
        downloadBtn.style.padding = '8px 16px';
        downloadBtn.style.background = '#ff4d4f';
        downloadBtn.style.color = 'white';
        downloadBtn.style.border = 'none';
        downloadBtn.style.borderRadius = '4px';
        downloadBtn.style.cursor = 'pointer';
        downloadBtn.style.fontWeight = 'bold';
        downloadBtn.addEventListener('click', downloadHandler);

        container.appendChild(downloadBtn);
        document.body.appendChild(container);
    }

    // 下载处理函数
    async function downloadHandler() {
        const urlParams = getUrlParams(window.location.href);
        if (!urlParams.mode || urlParams.mode !== 'user') {
            showNotification('请先保存您的设计', 'error');
            return;
        }

        try {
            const templateId = urlParams.id;
            const currentPage = getCurrentPage();
            const contentUrl = await getContentUrl(templateId);
            
            if (!contentUrl) {
                throw new Error('无法获取下载链接');
            }

            const fileName = `gaoding_design_${templateId}_${currentPage}.png`;
            GM_download({
                url: contentUrl,
                name: fileName,
                onload: () => showNotification('下载成功', 'success'),
                onerror: (e) => showNotification(`下载失败: ${e.details}`, 'error')
            });
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }

    // 获取内容URL
    function getContentUrl(templateId) {
        return new Promise((resolve, reject) => {
            const apiUrl = `https://www.gaoding.com/api/tb-dam/v2/editors/materials/${templateId}/info`;
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        resolve(data.content_url);
                    } else {
                        reject(new Error('API请求失败'));
                    }
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }

    // 获取当前页码
    function getCurrentPage() {
        const pageIndicator = document.querySelector('.dbu-page-indicator');
        if (!pageIndicator) return 1;
        
        const titleElement = pageIndicator.querySelector('.dbu-page-indicator__button__title span');
        return titleElement ? titleElement.textContent.trim().split('/')[0] : 1;
    }

    // 获取URL参数
    function getUrlParams(url) {
        const params = new URL(url).searchParams;
        const result = {};
        
        for (const [key, value] of params.entries()) {
            result[key] = value;
        }
        
        return result;
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const color = {
            'info': '#1890ff',
            'success': '#52c41a',
            'error': '#ff4d4f'
        }[type] || '#1890ff';

        GM_notification({
            text: message,
            title: '稿定设计下载器',
            highlight: true,
            timeout: 3000,
            onclick: () => {},
            image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${encodeURIComponent(color)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
        });
    }

    // 初始化
    function init() {
        createDownloadButton();
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


// 透明图片，用于替换水印
const blockedImageReplacement = 'data:image/webp;base64,UklGRpYAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAIAAAAAAFZQOCAYAAAAMAEAnQEqAQABAA/A/iWkAANwAP7lagAAUFNBSU4AAAA4QklNA+0AAAAAABAASAAAAAEAAgBIAAAAAQACOEJJTQQoAAAAAAAMAAAAAj/wAAAAAAAAOEJJTQRDAAAAAAAOUGJlVwEQAAYAAAAAAAA=';

// 拦截SVG水印
const originalSetSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set;
Object.defineProperty(HTMLImageElement.prototype, 'src', {
  set(value) {
    if (value.startsWith('data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyNTAiIHZpZXdCb3g9IjAgMCAzMDAgMjUwIiBmaWxsPSJub25lIi')) {
      console.log('拦截到SVG水印:', value);
      originalSetSrc.call(this, blockedImageReplacement);
      return;
    }
    originalSetSrc.call(this, value);
  },
});

// 水印处理模块
class WatermarkRemover {
  constructor() {
    this.niTuObserver = null;
    this.huiTuObserver = null;
    this.init();
  }

  init() {
    if (this.isNiTuSite()) {
      this.handleNiTuWatermark();
    }
    if (this.isHuiTuSite()) {
      this.handleHuiTuImages();
    }
  }

  isNiTuSite() {
    return window.location.hostname.includes('nipic.com') ||
           window.location.hostname.includes('ntimg.cn');
  }

  isHuiTuSite() {
    return window.location.hostname.includes('huitu.com');
  }

  // 昵图网水印处理
  handleNiTuWatermark() {
    this.niTuObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            this.processNiTuImages(node);
          }
        });
      });
    });

    this.niTuObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.processNiTuImages(document);
  }

  processNiTuImages(container) {
    // 处理图片容器
    const watermarkContainers = container.querySelectorAll(
      'div[style*="position: relative"], div[style*="position:relative"], ' +
      '.img-container, .image-container, .pic-container'
    );

    watermarkContainers.forEach(imgContainer => {
      const watermarkImg = imgContainer.querySelector(
        'img.watermark, img[src*="watermark"], ' +
        'img[src*="mark"], img[src*="nx_mark"]'
      );
      const mainImg = imgContainer.querySelector(
        'img.works-img, img.main-image, ' +
        'img[src*="ntimg.cn"], img[src*="nipic.com"]'
      );

      if (watermarkImg && mainImg) {
        this.removeWatermark(watermarkImg);
        this.processMainImage(mainImg, 'nitu');
      }
    });

    // 处理所有昵图网图片
    const allNiTuImages = container.querySelectorAll(
      'img[src*="ntimg.cn"], img[src*="nipic.com"]'
    );
    allNiTuImages.forEach(img => {
      if (!img.hasAttribute('data-watermark-cleaned')) {
        this.processMainImage(img, 'nitu');
      }
    });

    // 处理独立水印
    const standaloneWatermarks = container.querySelectorAll(
      'img[src*="nx_mark.png"], ' +
      'img[src*="watermark"], img.watermark'
    );
    standaloneWatermarks.forEach(watermark => {
      this.removeWatermark(watermark);
    });
  }

  // 汇图网图片处理
  handleHuiTuImages() {
    this.huiTuObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            this.processHuiTuImages(node);
          }
        });
      });
    });

    this.huiTuObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.processHuiTuImages(document);
  }

  processHuiTuImages(container) {
    // 处理图片列表
    const imageContainers = container.querySelectorAll(
      '.img-list, div[class*="img-list"]'
    );

    imageContainers.forEach(imgContainer => {
      const img = imgContainer.querySelector('img[src*="pic.huitu.com"]');
      const link = imgContainer.querySelector('a[href*="huitu.com/design/show"]');

      if (img && link) {
        this.processMainImage(img, 'huitu', link.href);
      }
    });

    // 处理独立图片
    const standaloneImages = container.querySelectorAll(
      'img[src*="pic.huitu.com"]'
    );
    standaloneImages.forEach(img => {
      if (!img.hasAttribute('data-watermark-cleaned')) {
        this.processMainImage(img, 'huitu');
      }
    });

    // 处理CSS水印
    const watermarkElements = container.querySelectorAll(
      'div[style*="watermark"], ' +
      'div[style*="skin.huitu.com"]'
    );
    watermarkElements.forEach(watermark => {
      if (watermark.style.backgroundImage &&
          (watermark.style.backgroundImage.includes('watermark') ||
           watermark.style.backgroundImage.includes('skin.huitu.com'))) {
        this.removeWatermark(watermark);
      }
    });

    // 处理内联样式水印
    const allElements = container.querySelectorAll('*');
    allElements.forEach(element => {
      const style = element.getAttribute('style');
      if (style &&
          (style.includes('watermark') ||
           style.includes('skin.huitu.com/images/v3/www/watermark0.png'))) {
        this.removeWatermark(element);
      }
    });
  }

  removeWatermark(element) {
    element.style.display = 'none';
    element.style.visibility = 'hidden';
    element.style.opacity = '0';
    if (element.style.backgroundImage) {
      element.style.backgroundImage = 'none';
    }
    console.log('已移除水印:', element);
  }

  processMainImage(img, siteType, detailUrl = null) {
    img.setAttribute('data-watermark-cleaned', 'true');
    img.setAttribute('data-site-type', siteType);

    // 处理原始URL
    let originalSrc = img.src;
    if (siteType === 'nitu' && originalSrc.includes('nipic.com') && !originalSrc.includes('pic.ntimg.cn')) {
      originalSrc = originalSrc.replace(/https?:\/\/[^/]*nipic\.com/, 'https://pic.ntimg.cn');
    } else if (siteType === 'huitu' && originalSrc.includes('huitu.com') && !originalSrc.includes('pic.huitu.com')) {
      originalSrc = originalSrc.replace(/https?:\/\/[^/]*huitu\.com/, 'https://pic.huitu.com');
    }

    img.setAttribute('data-original-src', originalSrc);

    if (detailUrl) {
      img.setAttribute('data-detail-url', detailUrl);
    }

    // 移除限制
    img.removeAttribute('ondragstart');
    img.style.pointerEvents = 'auto';
    console.log('已处理主图片:', originalSrc);
  }
}

// 主脚本
(function() {
  'use strict';

  // 初始化水印移除
  new WatermarkRemover();

  // 清屏功能
  var checkInterval = 800;
  var intervalId = setInterval(function() {
    var exportImg = document.querySelector('.dc-header__export-actions');
    if (exportImg) {
      clearInterval(intervalId);

      // 创建"清屏"按钮
      var clearScreenNode = document.createElement("div");
      clearScreenNode.className = "dc-header__clear-screen";
      clearScreenNode.innerHTML = `
        <div style="margin-right: 8px;">
          <div class="gda-btn-group">
            <button type="button" class="download-popover__primary gda-btn gda-btn-secondary clear-screen-btn">
              <span>清屏</span>
            </button>
          </div>
        </div>`;
      exportImg.parentNode.insertBefore(clearScreenNode, exportImg);

      // 添加"清屏"按钮事件
      var clearScreenBtn = document.querySelector('.clear-screen-btn');
      var isHidden = false;
      clearScreenBtn.addEventListener('click', function() {
        var elementsToToggle = [
          ...document.querySelectorAll('.resource-station, .right-panel, .main__bottom, .dui-noob-guide-index')
        ];

        if (!isHidden) {
          // 隐藏指定元素
          elementsToToggle.forEach(element => {
            if (element) element.style.display = 'none';
          });
          clearScreenBtn.querySelector('span').textContent = '恢复';
        } else {
          // 显示指定元素
          elementsToToggle.forEach(element => {
            if (element) element.style.display = '';
          });
          clearScreenBtn.querySelector('span').textContent = '清屏';
        }

        isHidden = !isHidden;
      });
    }
  }, checkInterval);

  // 全局样式
  GM_addStyle(`
    .download-context-menu {
      position: fixed;
      background: white;
      border: 1px solid #e1e1e1;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.12);
      z-index: 9999;
      min-width: 200px;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 6px 0;
    }
    .menu-item {
      padding: 10px 16px;
      cursor: pointer;
      font-size: 14px;
      color: #333;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
    }
    .menu-item:hover {
      background-color: #f8f8f8;
    }
    .floating-tip {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.85);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      max-width: 80%;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateX(-50%) translateY(10px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    .retry-btn {
      color: #69c0ff;
      font-weight: bold;
      margin-left: 8px;
      cursor: pointer;
    }
    .error-tip {
      background-color: #ff4d4f;
    }
    .success-tip {
      background-color: #52c41a;
    }
    .menu-item svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      color: #555;
    }
    .menu-item:hover svg {
      color: #1890ff;
    }
  `);

  // 图标库
  const ICONS = {
    download: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15V3M12 15L8 11M12 15L16 11M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    video: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 12L10 9V15L15 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    copy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
      <path d="M16 8V6C16 4.89543 15.1046 4 14 4H6C4.89543 4 4 4.89543 4 6V14C4 15.1046 4.89543 16 6 16H8" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    open: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  };

  // 全局状态
  const state = {
    activeDownloads: 0,
    maxParallelDownloads: 3,
    retryQueue: [],
    isOnline: navigator.onLine
  };

  // 网络状态检测
  function initNetworkMonitor() {
    window.addEventListener('online', () => {
      state.isOnline = true;
      showTip('网络已恢复', 'success');
      processRetryQueue();
    });

    window.addEventListener('offline', () => {
      state.isOnline = false;
      showTip('网络连接已断开', 'error');
    });

    if (!state.isOnline) {
      showTip('当前处于离线状态', 'error');
    }
  }

  // 显示提示
  function showTip(message, type = 'normal', duration = 2000) {
    const tip = document.createElement('div');
    tip.className = `floating-tip ${type}-tip`;
    tip.innerHTML = message;
    document.body.appendChild(tip);

    setTimeout(() => {
      tip.style.opacity = '0';
      setTimeout(() => tip.remove(), 300);
    }, duration);
  }

  // 处理重试队列
  function processRetryQueue() {
    if (state.retryQueue.length > 0 && state.isOnline) {
      const item = state.retryQueue.shift();
      if (item) {
        showTip('正在重试上次失败的操作...', 'normal');
        setTimeout(() => {
          item.fn.apply(null, item.args);
        }, 1000);
      }
    }
  }

  // 增强型网络请求
  function enhancedRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const defaultHeaders = {
        'Accept': '*/*',
        'Referer': window.location.href,
        'Origin': window.location.origin,
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site'
      };

      GM_xmlhttpRequest({
        method: options.method || 'GET',
        url: url,
        headers: {...defaultHeaders, ...options.headers},
        responseType: options.responseType || 'blob',
        timeout: 20000,
        anonymous: true,
        onload: function(response) {
          if (response.status >= 200 && response.status < 400) {
            resolve(response);
          } else {
            reject(new Error(`HTTP ${response.status}`));
          }
        },
        onerror: function(error) {
          reject(new Error('网络请求失败'));
        },
        ontimeout: function() {
          reject(new Error('请求超时 (20秒)'));
        },
        onabort: function() {
          reject(new Error('请求被中止'));
        }
      });
    });
  }

  // 下载管理器
  async function downloadManager(url, fileName, retries = 3) {
    while (retries > 0) {
      try {
        if (state.activeDownloads >= state.maxParallelDownloads) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        state.activeDownloads++;
        const response = await enhancedRequest(url);
        const blobUrl = URL.createObjectURL(response.response);

        await new Promise((resolve, reject) => {
          GM_download({
            url: blobUrl,
            name: fileName,
            onload: () => {
              URL.revokeObjectURL(blobUrl);
              state.activeDownloads--;
              resolve();
            },
            onerror: (e) => {
              URL.revokeObjectURL(blobUrl);
              state.activeDownloads--;
              reject(new Error(e.details || '下载失败'));
            }
          });
        });

        return true;
      } catch (error) {
        retries--;
        if (retries > 0) {
          const delay = Math.pow(2, 3 - retries) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
  }

  // 高级图像复制
  async function enhancedCopy(imageUrl) {
    try {
      if (typeof navigator.permissions !== 'undefined') {
        const result = await navigator.permissions.query({name: 'clipboard-write'});
        if (result.state === 'denied') {
          throw new Error('剪贴板写入权限被拒绝');
        }
      }

      const response = await enhancedRequest(imageUrl, {
        headers: {
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.9'
        }
      });

      return await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(async (blob) => {
              try {
                await navigator.clipboard.write([
                  new ClipboardItem({
                    'image/png': blob
                  })
                ]);
                resolve();
              } catch (err) {
                reject(new Error('写入剪贴板失败'));
              }
            }, 'image/png');
          } catch (e) {
            reject(new Error('图像处理失败'));
          }
        };
        img.onerror = () => reject(new Error('图像加载失败'));
        img.src = URL.createObjectURL(response.response);
      });
    } catch (error) {
      try {
        const response = await enhancedRequest(imageUrl);
        await GM_setClipboard(response.response, 'image');
        return;
      } catch (e) {
        throw new Error(`${error.message}，且备用方案也失败`);
      }
    }
  }

  // 右键菜单创建
  function createContextMenu(event) {
    document.querySelectorAll('.download-context-menu').forEach(el => el.remove());

    const menu = document.createElement('div');
    menu.className = 'download-context-menu';
    menu.style.left = `${Math.min(event.clientX, window.innerWidth - 220)}px`;
    menu.style.top = `${Math.min(event.clientY, window.innerHeight - 200)}px`;

    const target = event.target;
    let mediaUrl = null;
    let isVideo = false;

    // 图片检测
    if (target.tagName === 'IMG') {
      mediaUrl = target.getAttribute('data-original-src') || target.src;
    }
    // 视频检测
    else if (target.tagName === 'VIDEO' || target.closest('video')) {
      const video = target.tagName === 'VIDEO' ? target : target.closest('video');
      mediaUrl = video.src || video.querySelector('source')?.src;
      isVideo = true;
    }
    // 背景图检测
    else {
      const bgElement = target.closest('[style*="background-image"]');
      if (bgElement) {
        const bgStyle = window.getComputedStyle(bgElement).backgroundImage;
        if (bgStyle && bgStyle !== 'none') {
          mediaUrl = bgStyle.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
        }
      }
    }

    // 构建菜单
    if (mediaUrl) {
      if (isVideo) {
        menu.innerHTML = `
          <div class="menu-item" data-action="download" data-url="${encodeURIComponent(mediaUrl)}">
            ${ICONS.video} 下载视频
          </div>
        `;
      } else {
        menu.innerHTML = `
          <div class="menu-item" data-action="copy" data-url="${encodeURIComponent(mediaUrl)}">
            ${ICONS.copy} 复制图像
          </div>
          <div class="menu-item" data-action="download" data-url="${encodeURIComponent(mediaUrl)}">
            ${ICONS.download} 下载图像
          </div>
          <div class="menu-item" data-action="open" data-url="${encodeURIComponent(mediaUrl)}">
            ${ICONS.open} 打开原图
          </div>
        `;
      }

      document.body.appendChild(menu);
      return true;
    }
    return false;
  }

  // 初始化
  function init() {
    initNetworkMonitor();

    // 右键菜单事件
    document.addEventListener('contextmenu', (event) => {
      if (createContextMenu(event)) {
        event.preventDefault();

        setTimeout(() => {
          document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', async () => {
              const action = item.dataset.action;
              const url = decodeURIComponent(item.dataset.url);
              const menu = document.querySelector('.download-context-menu');
              if (menu) menu.remove();

              try {
                switch (action) {
                  case 'copy':
                    await enhancedCopy(url);
                    showTip('✓ 图像已复制', 'success');
                    break;
                  case 'download':
                    const ext = url.includes('video') ? 'mp4' : 'png';
                    const name = `AI_${Date.now()}.${ext}`;
                    await downloadManager(url, name);
                    showTip('✓ 下载成功', 'success');
                    break;
                  case 'open':
                    window.open(url, '_blank');
                    break;
                }
              } catch (error) {
                showTip(`${error.message} <span class="retry-btn">重试</span>`, 'error');
                document.querySelector('.retry-btn')?.addEventListener('click', () => {
                  item.click();
                });
              }
            });
          });
        }, 10);
      }
    });

    // 点击关闭菜单
    document.addEventListener('click', () => {
      document.querySelectorAll('.download-context-menu').forEach(el => el.remove());
    });

    // ESC关闭菜单
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.download-context-menu').forEach(el => el.remove());
      }
    });
  }

  // 启动脚本
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();