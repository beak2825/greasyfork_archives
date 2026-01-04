// ==UserScript==
// @name         图片爬虫|图片批量自动打包下载|网页图片批量下载器V2
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  自动爬取网页图片并支持预览下载
// @author       白虎万岁
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      *
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/523357/%E5%9B%BE%E7%89%87%E7%88%AC%E8%99%AB%7C%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E8%87%AA%E5%8A%A8%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%7C%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8V2.user.js
// @updateURL https://update.greasyfork.org/scripts/523357/%E5%9B%BE%E7%89%87%E7%88%AC%E8%99%AB%7C%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E8%87%AA%E5%8A%A8%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%7C%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8V2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 全局变量声明
  let imageUrls = new Set();
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  // DOM 元素声明
  let status, modal, overlay, downloadBtn;

  // 添加初始化状态标记和重试机制
  let initAttempts = 0;
  const MAX_INIT_ATTEMPTS = 10;
  const RETRY_INTERVAL = 500;

  // 初始化DOM元素
  function createElements () {
    // 创建状态显示元素
    status = document.createElement('div');
    status.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        z-index: 2147483647;
        padding: 10px;
        background: rgba(0,0,0,0.7);
        color: white;
        border-radius: 4px;
        font-size: 14px;
        display: none;
      `;

    // 创建模态框
    modal = document.createElement('div');
    modal.className = 'image-preview-modal';
    modal.innerHTML = `
        <div class="modal-header">
          <span class="modal-title">图片预览</span>
          <span class="modal-close">×</span>
        </div>
        <div class="modal-content"></div>
        <div class="modal-footer">
          <button class="modal-button select-all">全选</button>
          <span class="selected-count">已选择: 0</span>
          <button class="modal-button download-selected" disabled>下载选中</button>
        </div>
      `;

    // 创建遮罩层
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    // 创建下载按钮
    downloadBtn = document.createElement('div');
    downloadBtn.className = 'image-downloader-btn';
    downloadBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="white">
          <path d="M512 1015.125333c-129.024 0-250.88-31.402667-343.04-88.746666-95.573333-59.392-148.138667-139.605333-148.138667-225.621334 0-28.672 5.802667-57.002667 17.408-83.968 17.066667-39.936 25.258667-79.872 24.576-118.101333v-9.216c0-118.442667 45.738667-230.058667 128.341334-314.368 82.602667-84.309333 193.194667-132.096 311.296-134.485333 245.077333-5.12 450.56 190.122667 458.069333 434.858666 0.341333 7.509333 0.341333 15.018667 0 22.528-0.682667 41.301333 6.826667 79.530667 22.528 114.005334 12.970667 28.672 19.797333 58.709333 19.797333 89.088 0 86.016-52.565333 166.229333-148.138666 225.621333-91.818667 57.002667-213.674667 88.405333-342.698667 88.405333z"/>
          <path d="M132.437333 354.986667l-24.234666-19.456C64.512 300.373333 39.594667 248.149333 39.594667 192.512c0-101.034667 82.261333-183.637333 183.637333-183.637333 57.685333 0 110.933333 26.282667 146.090667 72.362666l18.773333 24.576-28.672 11.946667C263.168 157.354667 187.392 231.424 145.066667 326.656l-12.629334 28.330667z"/>
          <path d="M891.221333 354.986667l-12.629333-28.330667c-41.642667-93.525333-119.808-169.301333-214.357333-208.554667l-28.672-11.946666 18.773333-24.576C689.493333 35.498667 742.741333 8.874667 800.768 8.874667c101.034667 0 183.637333 82.261333 183.637333 183.637333 0 55.978667-25.258667 108.202667-68.949333 143.36l-24.234667 19.114667z"/>
          <path d="M479.232 64.170667h47.786667V368.64h-47.786667z"/>
          <path d="M603.477333 195.584c-55.296-55.296-145.066667-55.296-200.362666 0l-33.792-33.792c73.728-73.728 194.218667-73.728 267.946666 0l-33.792 33.792z"/>
          <path d="M583.68 293.546667c-47.786667-34.133333-112.64-35.157333-161.450667-2.730667L395.946667 250.88c65.194667-43.349333 151.893333-41.984 215.722666 4.096L583.68 293.546667z"/>
          <path d="M564.906667 403.456c-38.912-20.821333-84.309333-22.186667-124.586667-4.437333l-19.456-43.690667c53.589333-23.893333 114.346667-21.845333 166.570667 5.802667l-22.528 42.325333z"/>
          <path d="M503.125333 678.570667c-20.48 0-38.912-10.581333-49.152-28.330667l-17.066666-29.696c-10.24-17.749333-10.24-38.912 0-56.661333 10.24-17.749333 28.672-28.330667 49.152-28.330667h34.474666c20.48 0 38.912 10.581333 49.152 28.330667 10.24 17.749333 10.24 38.912 0 56.661333l-17.066666 29.696c-10.581333 17.749333-29.013333 28.330667-49.493334 28.330667z"/>
          <path d="M365.909333 808.96c-42.325333 0-82.261333-15.701333-112.64-44.714667l32.768-34.816c21.504 20.138667 49.834667 31.402667 79.872 31.402667 62.464 0 113.322667-48.810667 113.322667-108.544h47.786667c0 86.357333-72.021333 156.672-161.109334 156.672z"/>
          <path d="M640.341333 808.96c-88.746667 0-161.109333-69.973333-161.109333-156.330667h47.786667c0 59.733333 50.858667 108.544 113.322666 108.544 30.037333 0 58.368-11.264 79.872-31.402666l32.768 34.816c-30.037333 28.330667-69.973333 44.373333-112.64 44.373333z"/>
        </svg>
      `;
  }

  // 添加样式
  function addStyles () {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .image-downloader-btn {
        position: fixed;
        top: 50%;  /* 垂直居中 */
        right: 0;  /* 固定在右侧 */
        z-index: 2147483647;
        width: 50px;
        height: 50px;
        border-radius: 8px 0 0 8px;  /* 只设置左侧圆角 */
        background: linear-gradient(145deg, #FF9800, #F57C00);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
        user-select: none;
        transition: all 0.3s;
        border: none;
        padding: 10px;
        transform: translateY(-50%);  /* 垂直居中偏移 */
      }
      .image-downloader-btn svg {
        width: 100%;
        height: 100%;
        transition: transform 0.3s;
        filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2));
      }
      .image-downloader-btn:hover {
        background: linear-gradient(145deg, #FFA726, #FB8C00);
        box-shadow: 0 6px 16px rgba(255, 152, 0, 0.6);
      }
      .image-downloader-btn:hover svg {
        transform: scale(1.1);
      }
            .image-preview-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2147483646;
        width: 70vw;
        height: 70vh;
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
      }
      .modal-header {
        padding: 16px 24px;
        background: #fff;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .modal-title {
        font-size: 18px;
        font-weight: 600;
        color: #1976D2;
      }
      .modal-close {
        cursor: pointer;
        font-size: 24px;
        color: #666;
        transition: all 0.2s;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #f5f5f5;
      }
      .modal-close:hover {
        color: #333;
        background: #e0e0e0;
        transform: rotate(90deg);
      }
      .modal-content {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 16px;
        background: #fff;
      }
      .modal-content::-webkit-scrollbar {
        width: 8px;
      }
      .modal-content::-webkit-scrollbar-track {
        background: #f5f5f5;
        border-radius: 4px;
      }
      .modal-content::-webkit-scrollbar-thumb {
        background: #ddd;
        border-radius: 4px;
      }
      .modal-content::-webkit-scrollbar-thumb:hover {
        background: #ccc;
      }
      .image-item {
        position: relative;
        padding-top: 100%;
        border: 2px solid transparent;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
        background: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      }
      .image-item::before {
        content: '';
        position: absolute;
        top: 10px;
        right: 10px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid #fff;
        background: transparent;
        z-index: 1;
        transition: all 0.2s;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .image-item.selected::before {
        background: #2196F3;
        border-color: #fff;
      }
      .image-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      .image-item img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
        transition: all 0.2s;
      }
      .image-item.selected {
        border-color: #2196F3;
        box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
      }
      .modal-footer {
        padding: 16px 24px;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
      }
      .modal-button {
        padding: 8px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        background: #2196F3;
        color: white;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
        min-width: 100px;
        text-align: center;
      }
      .modal-button:hover {
        background: #1976D2;
        transform: translateY(-1px);
      }
      .modal-button:disabled {
        background: #e0e0e0;
        cursor: not-allowed;
        transform: none;
      }
      .selected-count {
        color: #666;
        font-size: 14px;
        background: #f5f5f5;
        padding: 6px 12px;
        border-radius: 6px;
      }
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
        z-index: 2147483645;
        display: none;
      }
    `;
    document.head.appendChild(styleSheet);
  }
  // 修改图片获取逻辑
  function getPageImages () {
    const images = new Set();

    // 1. 获取普通图片
    document.querySelectorAll('img').forEach(img => {
      if (isValidImage(img)) {
        // 检查所有可能的图片源
        const sources = [
          img.src,
          img.dataset.src,
          img.dataset.original,
          img.getAttribute('data-original'),
          img.getAttribute('data-src'),
          img.getAttribute('data-actualsrc'),
          img.getAttribute('data-echo'),
          img.getAttribute('data-lazy'),
          img.getAttribute('data-url'),
          img.getAttribute('data-original-src')
        ];

        sources.forEach(src => {
          if (src && isValidImageUrl(src)) {
            images.add(src);
          }
        });
      }
    });

    // 2. 获取背景图片
    document.querySelectorAll('*').forEach(el => {
      try {
        const style = window.getComputedStyle(el);
        const bgImage = style.backgroundImage;
        if (bgImage && bgImage !== 'none') {
          const urls = bgImage.match(/url\(['"]?(.*?)['"]?\)/g);
          if (urls) {
            urls.forEach(url => {
              const cleanUrl = url.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
              if (isValidImageUrl(cleanUrl)) {
                images.add(cleanUrl);
              }
            });
          }
        }
      } catch (e) { }
    });

    // 3. 获取 picture 元素中的图片
    document.querySelectorAll('picture source').forEach(source => {
      const srcset = source.srcset;
      if (srcset) {
        srcset.split(',').forEach(src => {
          const url = src.trim().split(' ')[0];
          if (isValidImageUrl(url)) {
            images.add(url);
          }
        });
      }
    });

    return Array.from(images);
  }

  // 优化图片验证函数
  function isValidImage (img) {
    if (!img) return false;

    // 检查图片是否加载
    if (img.complete) {
      return img.naturalWidth > 0 || img.naturalHeight > 0;
    }

    // 如果图片未加载，检查显示尺寸
    const rect = img.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0;
  }

  function isValidImageUrl (url) {
    if (!url || typeof url !== 'string') return false;

    try {
      // 如果是相对路径，转换为绝对路径
      if (url.startsWith('/')) {
        url = location.origin + url;
      } else if (url.startsWith('./') || url.startsWith('../')) {
        url = new URL(url, location.href).href;
      }

      // 清理URL
      url = url.split('?')[0].split('#')[0].toLowerCase();

      // 检查文件扩展名
      const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico'];
      const ext = getImageExtension(url);

      return extensions.includes(ext);
    } catch {
      return false;
    }
  }

  // 获取图片扩展名
  function getImageExtension (url) {
    const match = url.match(/\.([^\.]+)(?:[\?#]|$)/);
    return match ? match[1].toLowerCase() : 'jpg';
  }
  // 显示预览窗口
  function showPreview () {
    const images = Array.from(imageUrls);
    const content = modal.querySelector('.modal-content');

    // 保存已选中的图片
    const selectedUrls = new Set(
      Array.from(content.querySelectorAll('.image-item.selected img'))
        .map(img => img.src)
    );

    content.innerHTML = '';

    images.forEach((url, index) => {
      const item = document.createElement('div');
      item.className = 'image-item';
      if (selectedUrls.has(url)) {
        item.classList.add('selected');
      }
      item.innerHTML = `<img src="${url}" data-index="${index}">`;

      item.addEventListener('click', () => {
        item.classList.toggle('selected');
        updateSelectedCount();
      });

      content.appendChild(item);
    });

    modal.style.display = 'flex';
    overlay.style.display = 'block';
    updateSelectedCount();
  }

  // 更新选中数量
  function updateSelectedCount () {
    const selectedCount = modal.querySelectorAll('.image-item.selected').length;
    modal.querySelector('.selected-count').textContent = `已选择: ${selectedCount}`;
    modal.querySelector('.download-selected').disabled = selectedCount === 0;
  }

  // 设置事件监听
  function setupEventListeners () {
    // 只保留点击事件
    downloadBtn.addEventListener('click', showPreview);

    // 关闭按钮事件
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.style.display = 'none';
      overlay.style.display = 'none';
    });

    // 全选按钮事件
    modal.querySelector('.select-all').addEventListener('click', function () {
      const items = modal.querySelectorAll('.image-item');
      const allSelected = Array.from(items).every(item => item.classList.contains('selected'));

      items.forEach(item => {
        if (allSelected) {
          item.classList.remove('selected');
        } else {
          item.classList.add('selected');
        }
      });

      this.textContent = allSelected ? '全选' : '取消全选';
      updateSelectedCount();
    });

    // 下载选中图片事件
    modal.querySelector('.download-selected').addEventListener('click', async () => {
      const selectedItems = modal.querySelectorAll('.image-item.selected img');
      if (selectedItems.length === 0) return;

      try {
        showStatus(`准备下载 ${selectedItems.length} 张图片...`);

        const images = Array.from(selectedItems).map(img => ({
          src: img.src,
          index: img.dataset.index
        }));

        const pageTitle = document.title.replace(/[\\/:*?"<>|]/g, '_');
        const date = new Date().toISOString().split('T')[0];
        const zipName = `${pageTitle}_${date}`;

        const zip = new JSZip();
        let processedCount = 0;
        let failedCount = 0;

        for (const img of images) {
          try {
            showStatus(`正在下载第 ${processedCount + 1}/${images.length} 张图片...`);
            const blob = await downloadImage(img.src);
            const fileName = `image_${img.index}.${getImageExtension(img.src)}`;
            zip.file(fileName, blob);
            processedCount++;
          } catch (error) {
            console.error('下载图片失败:', img.src, error);
            failedCount++;
          }
        }

        if (processedCount === 0) {
          throw new Error('没有成功下载任何图片');
        }

        if (failedCount > 0) {
          showStatus(`有 ${failedCount} 张图片下载失败，正在打包其他图片...`);
        } else {
          showStatus('正在生成压缩包...');
        }

        const content = await zip.generateAsync({ type: 'blob' });
        const downloadUrl = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${zipName}.zip`;
        link.click();

        URL.revokeObjectURL(downloadUrl);
        modal.style.display = 'none';
        overlay.style.display = 'none';

        if (failedCount > 0) {
          showStatus(`下载完成，但有 ${failedCount} 张图片下载失败`);
        } else {
          showStatus('下载完成！');
        }
        setTimeout(hideStatus, 3000);

      } catch (error) {
        console.error('下载过程出错:', error);
        showStatus('下载失败: ' + error.message);
        setTimeout(hideStatus, 3000);
      }
    });
  }

  // 状态显示函数
  function showStatus (message) {
    status.textContent = message;
    status.style.display = 'block';
  }

  function hideStatus () {
    status.style.display = 'none';
  }

  // 修改下载图片的逻辑
  async function downloadImage (url, retryCount = 0) {
    const MAX_RETRIES = 3;

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: 'blob',
        headers: {
          'Referer': location.href,
          'User-Agent': navigator.userAgent
        },
        timeout: 30000, // 30秒超时
        onload: function (response) {
          if (response.status === 200) {
            resolve(response.response);
          } else if (retryCount < MAX_RETRIES) {
            // 如果失败但未达到最大重试次数，则重试
            setTimeout(() => {
              downloadImage(url, retryCount + 1)
                .then(resolve)
                .catch(reject);
            }, 1000 * (retryCount + 1)); // 递增延迟
          } else {
            reject(new Error(`下载失败: ${response.status}`));
          }
        },
        onerror: function (error) {
          if (retryCount < MAX_RETRIES) {
            // 如果失败但未达到最大重试次数，则重试
            setTimeout(() => {
              downloadImage(url, retryCount + 1)
                .then(resolve)
                .catch(reject);
            }, 1000 * (retryCount + 1));
          } else {
            reject(new Error('下载失败: ' + error.message));
          }
        },
        ontimeout: function () {
          if (retryCount < MAX_RETRIES) {
            setTimeout(() => {
              downloadImage(url, retryCount + 1)
                .then(resolve)
                .catch(reject);
            }, 1000 * (retryCount + 1));
          } else {
            reject(new Error('下载超时'));
          }
        }
      });
    });
  }

  // 初始化函数
  function init () {
    try {
      createElements();
      addStyles();
      document.body.appendChild(status);
      document.body.appendChild(downloadBtn);
      document.body.appendChild(modal);
      document.body.appendChild(overlay);
      setupEventListeners();

      // 初始获取页面图片
      const newImages = getPageImages();
      imageUrls = new Set(newImages);

      console.log('图片下载器初始化成功');
    } catch (error) {
      console.error('初始化失败:', error);
    }
  }

  // 根据浏览器类型调整初始化时机
  if (navigator.userAgent.includes('Edg/')) {
    // Edge浏览器特殊处理
    window.addEventListener('load', () => {
      setTimeout(init, 500);
    });
  } else {
    // 其他浏览器正常处理
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

})();
