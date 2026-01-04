// ==UserScript==
// @name               Kemono Original Image Helper
// @name:ja            Kemono オリジナル画像ダウンローダー
// @name:zh-cn         Kemono 原图下载助手
// @name:zh-tw         Kemono 原圖下載助手
// @description        Add download buttons to Kemono images with auto naming and viewer.
// @description:ja     Kemono画像にダウンロードボタンを追加し、自動命名とビューアをサポートします。
// @description:zh-cn  Kemono 图片添加下载按钮，自动命名并支持图片查看器。
// @description:zh-tw  Kemono 圖片添加下載按鈕，自動命名並支援圖片檢視器。
// @namespace          http://tampermonkey.net/
// @version            1.7.1
// @author             LY
// @match              https://kemono.cr/*
// @grant              GM_download
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_setValue
// @grant              GM_getResourceText
// @license            MIT
// @require            https://cdn.jsdelivr.net/npm/@fancyapps/ui@6.0/dist/fancybox/fancybox.umd.js
// @resource           FANCY_CSS https://cdn.jsdelivr.net/npm/@fancyapps/ui@6.0/dist/fancybox/fancybox.css
// @downloadURL https://update.greasyfork.org/scripts/540422/Kemono%20%E3%82%AA%E3%83%AA%E3%82%B8%E3%83%8A%E3%83%AB%E7%94%BB%E5%83%8F%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%80%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/540422/Kemono%20%E3%82%AA%E3%83%AA%E3%82%B8%E3%83%8A%E3%83%AB%E7%94%BB%E5%83%8F%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%80%E3%83%BC.meta.js
// ==/UserScript==

/**
 * 应用配置项
 * @type {Object}
 * @property {boolean} enableImageViewer
 *    是否启用图片浏览模式。
 *    - true: 点击图片时进入图片浏览器。
 *    - false: 点击后直接显示原图，并单独占一行。
 *
 * @property {(author: string, title: string, time: string, index: number) => string} getDownloadFileName
 *    生成下载文件名的函数。
 *    参数：
 *      @param {string} author 图片作者
 *      @param {string} title  图片标题
 *      @param {string} time   创建或发布时间
 *      @param {number} index  当前图片索引（从 0 开始）
 *    返回：
 *      @returns {string} 拼接后的文件名，例如 "作者_标题_时间_序号.png"
 */
const config = {
  enableImageViewer: true,
  getDownloadFileName: (author, title, time, index) => `${author}_${title}_${time}_${index + 1}.png`,
};

(function () {
  'use strict';

  // 注入样式：旋转动画 + 限制原图宽度
  GM_addStyle(`
    .kemono-download-btn .loading {
      animation: spin 1s linear infinite;
      transform-origin: center;
    }
    @keyframes spin {
      0% { transform: rotate(0deg);}
      100% { transform: rotate(360deg);}
    }
    .post__thumbnail ._expanded_425d1db img {
      width: 100% !important;
    }
    .post__files {
      display: grid;
      grid-template-columns: repeat(auto-fill, 400px);
      grid-row-gap: 20px;
      grid-column-gap: 20px;
      align-items: start;
    }
    .post__thumbnail:hover .batch-right-btn {
      display: flex !important;
    }
  `);

  const fancyCss = GM_getResourceText("FANCY_CSS");
  GM_addStyle(fancyCss);

  // 获取作者与标题
  const getAuthor = () =>
    document.querySelector('.post__user-name')?.textContent.trim() || 'unknown';

  const getTitle = () =>
    document.querySelector('h1.post__title span')?.textContent.trim().replace(/[\\/:*?"<>|]/g, '') || 'untitled';

  const getTimestamp = () => {
    const d = new Date();
    const pad = n => n.toString().padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  };

  const getImageKey = url => {
    const match = url.match(/\/([^\/?#]+)\?f=/);
    return match ? match[1] : null;
  };

  async function hasDownloaded (key) {
    if (!key) return false;
    const history = await GM_getValue('download_history', []);
    return history.includes(key);
  }

  async function markDownloaded (key) {
    if (!key) return;
    const history = await GM_getValue('download_history', []);
    if (!history.includes(key)) {
      history.push(key);
      await GM_setValue('download_history', history);
    }
  }

  // SVG 图标模版（四状态）
  const svgIcon = `
<svg viewBox="0 0 24 24" style="width: 20px; height: 20px;">
  <g class="download" fill="none">
    <path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/>
    <path fill='#FFFFFF' d='M20 15a1 1 0 0 1 1 1v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a1 1 0 1 1 2 0v4h14v-4a1 1 0 0 1 1-1M12 2a1 1 0 0 1 1 1v10.243l2.536-2.536a1 1 0 1 1 1.414 1.414l-4.066 4.066a1.25 1.25 0 0 1-1.768 0L7.05 12.121a1 1 0 1 1 1.414-1.414L11 13.243V3a1 1 0 0 1 1-1'/>
  </g>
  <g class="completed" style="display:none" fill="none" fill-rule="evenodd">
    <path d="M5 13l4 4L19 7" fill="none" stroke="#E56F2E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g class="loading" style="display:none" fill="none" fill-rule="evenodd">
    <circle cx="12" cy="12" r="10" stroke="#E56F2E" stroke-width="4" opacity="0.3" fill="none"/>
    <path d="M12 2a10 10 0 0 1 10 10" stroke="#E56F2E" stroke-width="4" stroke-linecap="round" fill="none"/>
  </g>
  <g class="failed" style="display:none" fill="none" fill-rule="evenodd">
    <path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/>
    <path fill='#F6200A' d='m12 13.414 5.657 5.657a1 1 0 0 0 1.414-1.414L13.414 12l5.657-5.657a1 1 0 0 0-1.414-1.414L12 10.586 6.343 4.929A1 1 0 0 0 4.93 6.343L10.586 12l-5.657 5.657a1 1 0 1 0 1.414 1.414z'/>
  </g>
</svg>`;

  function setIcon (svg, state) {
    ['download', 'loading', 'completed', 'failed'].forEach(s => {
      const el = svg.querySelector(`.${s}`);
      if (el) el.style.display = (s === state ? 'inline' : "none");
    });
  }

  function createBtn (thumbnail, index, author, title, downloadFn) {
    if (thumbnail.querySelector('.kemono-download-btn')) return;

    const link = thumbnail.querySelector('a.fileThumb');
    if (!link) return;

    const btn = document.createElement('div');
    btn.className = 'kemono-download-btn';
    btn.innerHTML = svgIcon;
    const svg = btn.querySelector('svg');

    Object.assign(btn.style, {
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: '32px',
      height: '32px',
      cursor: 'pointer',
      borderRadius: '999px',
      backgroundColor: 'rgba(0,0,0,0.75)',
      'backdrop-filter': 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    });

    downloadFn[index] = async () => {
      const originalURL = link.href;
      const key = getImageKey(originalURL);
      const filename = config.getDownloadFileName(author, title, getTimestamp(), index);

      setIcon(svg, 'loading');
      return new Promise((resolve) => {
        GM_download({
          url: originalURL,
          name: filename,
          onload: async () => {
            await markDownloaded(key);
            setIcon(svg, 'completed');
            resolve(true);
          },
          onerror: (e, d) => {
            console.log(e);
            console.log(d);

            setIcon(svg, 'failed');
            resolve(false);
          },
          ontimeout: () => {
            setIcon(svg, 'failed');
            resolve(false);
          },
        });
      })
    }

    btn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      downloadFn[index]();
    };

    // 初始时判断是否已下载
    const originalHref = link.href;
    const key = getImageKey(originalHref);
    if (key) {
      hasDownloaded(key).then(done => {
        if (done) setIcon(svg, 'completed');
      });
    }

    thumbnail.style.position = 'relative';
    thumbnail.appendChild(btn);

    const batchBtn = document.createElement('div');
    batchBtn.className = 'batch-right-btn';
    batchBtn.title = '下载从此图开始的右侧所有图';

    // 下载按钮下方添加批量下载右侧图片
    Object.assign(batchBtn.style, {
      position: 'absolute',
      top: '44px',
      right: '8px',
      width: '32px',
      height: '32px',
      borderRadius: '999px',
      backgroundColor: 'rgba(0,0,0,0.75)',
      display: 'none',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
    });
    batchBtn.classList.add('batch-right-btn');

    // SVG 箭头图标（向右）
    batchBtn.innerHTML = `
  <svg viewBox="0 0 24 24" width="18" height="18">
    <path d="M10 6l6 6-6 6" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

    batchBtn.onclick = async e => {
      e.stopPropagation();
      e.preventDefault();
      for (let left = index; left < downloadFn.length; left++) {
        const downloadOk = await downloadFn[left]();
        if (!downloadOk) break;
      }
    };

    thumbnail.appendChild(batchBtn);
  }

  function enhanceImageViewer (thumbnails) {
    const imageItems = [];

    thumbnails.forEach((thumb, i) => {
      const link = thumb.querySelector('a.fileThumb');
      const img = thumb.querySelector('img');

      if (link && img && !img.dataset.viewerEnhanced) {
        // 避免多次绑定点击事件
        img.dataset.viewerEnhanced = true;

        if (!config.enableImageViewer) {
          img.addEventListener('click', e => {
            thumb.style.gridColumn = '1 / -1';
          });
        } else {
          const originalUrl = link.href;
          const thumbSrc = img.src.startsWith('//') ? location.protocol + img.src : img.src;

          const item = {
            src: originalUrl,
            thumbSrc: thumbSrc,
            caption: img.alt || '', // 可添加图片描述
          };
          imageItems.push(item);

          // 绑定点击事件
          img.style.cursor = 'zoom-in';
          img.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            Fancybox.show(imageItems, { startIndex: i });
          });
        }
      }
    });
  }


  function init () {
    const all = document.querySelectorAll('.post__thumbnail');
    if (all.length === 0) return false;

    const author = getAuthor();
    const title = getTitle();
    const downloadFn = [];
    all.forEach((thumb, i) => createBtn(thumb, i, author, title, downloadFn));
    enhanceImageViewer(all);
    return true;
  }

  init();

  const observer = new MutationObserver((mutations) => {
    init();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
