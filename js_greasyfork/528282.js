// ==UserScript==
// @name         奇讯影视解析 (2025最新优化版) - 悬浮面板 - 多源同时解析
// @namespace    qx-vip-video
// @version      1.7.5
// @description  优酷、爱奇艺、腾讯、B站等视频网站VIP视频解析，悬浮面板，多源解析（可选6/4/1个源），单源放大并替换
// @author       xnone
// @icon         data:image/webp;base64,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
// @match        *://*.youku.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.iq.com/*
// @match        *://v.qq.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.mgtv.com/*
// @match        *://*.le.com/*
// @match        *://*.tudou.com/*
// @match        *://*.pptv.com/*
// @match        *://*.1905.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/528282/%E5%A5%87%E8%AE%AF%E5%BD%B1%E8%A7%86%E8%A7%A3%E6%9E%90%20%282025%E6%9C%80%E6%96%B0%E4%BC%98%E5%8C%96%E7%89%88%29%20-%20%E6%82%AC%E6%B5%AE%E9%9D%A2%E6%9D%BF%20-%20%E5%A4%9A%E6%BA%90%E5%90%8C%E6%97%B6%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/528282/%E5%A5%87%E8%AE%AF%E5%BD%B1%E8%A7%86%E8%A7%A3%E6%9E%90%20%282025%E6%9C%80%E6%96%B0%E4%BC%98%E5%8C%96%E7%89%88%29%20-%20%E6%82%AC%E6%B5%AE%E9%9D%A2%E6%9D%BF%20-%20%E5%A4%9A%E6%BA%90%E5%90%8C%E6%97%B6%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

  // 解析线路配置
  const parseUrls = [
    "https://jx.dmflv.cc/?url=",
    "https://www.yemu.xyz/?url=",
    "https://jx.nnxv.cn/tv.php?url=",
    "https://jx.playerjy.com/?ads=0&url=",
    "https://jx.xmflv.com/?url=",
    "https://videocdn.ihelpy.net/jiexi/m1907.html?m1907jx=",

    // "https://im1907.top/?jx=",
    // "https://jx.jsonplayer.com/player/?url=",
    // "https://jx.yangtu.top/?url=",
    // "https://vip.bljiex.com/?v=",
    // "https://www.ckplayer.vip/jiexi/?url=",
    // "https://jx.m3u8.tv/jiexi/?url="
  ];

  // 网站与解析规则的映射
  const siteRules = {
    'v.qq.com': { node: ['.player__container', '#player-container'], area: 'playlist-list' },
    'iqiyi.com': { node: ['#video'], area: '' },
    'iq.com': { node: ['.intl-video-wrap'], area: 'm-sliding-list' },
    'youku.com': { node: ['#ykPlayer'], area: 'new-box-anthology-items' },
    'bilibili.com': { node: ['#bilibili-player', '.bpx-player-primary-area'], area: 'video-episode-card' },
    'mgtv.com': { node: ['#mgtv-player-wrap'], area: 'episode-items' },
    'le.com': { node: ['#le_playbox'], area: 'juji_grid' },
    'tudou.com': { node: ['#player'], area: '' },
    'pptv.com': { node: ['#pptv_playpage_box'], area: '' },
    '1905.com': { node: ['#player', '#vodPlayer'], area: '' },
  };

  let originalVideoContainer = null;
  let originalVideoContainerSelector = null;
  let currentIframeContainer = null;
  let videoContainerWidth = null;
  let videoContainerHeight = null;
  let hidePanelTimeout = null; // 隐藏面板的定时器

  function getSiteRule(host) {
    return siteRules[Object.keys(siteRules).find(key => host.includes(key))] || null;
  }

  function createParseElements() {
    const iconSize = isMobile ? 40 : GM_getValue('iconWidth', 40);
    const iconTop = isMobile ? 360 : GM_getValue('iconTop', 360);
    const iconPosition = isMobile ? 'left' : GM_getValue('iconPosition', 'left');

    const iconStyle = `
    #vipParseIcon {
          position: fixed;
          top: ${iconTop}px;
          ${iconPosition}: 5px;
          z-index: 999999;
          cursor: pointer;
          display: flex;
          flex-direction: ${iconPosition === 'left' ? 'row' : 'row-reverse'};
      }
      #vipParseIcon img {
          width: ${iconSize}px;
          height: ${iconSize * 1.5}px;
          opacity: ${isMobile ? 1 : GM_getValue('iconOpacity', 100) / 100};
          transition: transform 0.3s ease;
      }
      #vipParseIcon:hover img {
          transform: scale(1.2);
      }

      #parsePanel {
          position: absolute; /* 绝对定位 */
          top: ${iconSize * 1.5}px; /*  图标高度+5px的间距*/
          ${iconPosition === 'left' ? 'left: 0;' : 'right: 0;'} /* 根据图标位置调整 */
          z-index: 999998;
          background-color: #fff;
          border: 1px solid #ccc;
          padding: 15px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          border-radius: 5px;
          width: 280px; /* 调整面板宽度 */
          display: none; /* 初始隐藏 */
      }

      #parsePanel button {
          margin: 8px 0;
          padding: 10px 18px;
          background-color: #2871a6;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
          width: 100%;
          box-sizing: border-box;
      }
      #parsePanel button:hover {
          background-color: #1e5a88;
      }

      #parsePanel .warning-tips {
          background: #ffeeee; /* 红色背景 */
          color: #ff0000; /* 红色字体 */
          padding: 15px; /* 内边距 */
          border-radius: 5px; /* 圆角 */
          box-shadow: 0 0 10px rgba(0,0,0,0.1); /* 投影效果 */
          z-index: 1000; /* 确保提示显示在最前面 */
          font-size: 12px; /* 字体大小 */
          line-height: 1.5; /* 行间距 */
      }
      
      #parsePanel .warning-tips p {
          margin: 5px 0; /* 段落间距 */
      }
    

      #configPanel {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #eee;
      }

      #configPanel label {
          display: block;
          margin-bottom: 8px;
          color: #333;
      }
      #configPanel input[type="radio"] {
          margin-right: 6px;
      }

      #saveConfigBtn {
          background-color: #4CAF50 !important;
      }
      #saveConfigBtn:hover {
          background-color: #45a049 !important;
      }

      #aboutPanel {
          margin-top: 15px;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 4px;
      }

      #aboutPanel h3 {
          margin-top: 0;
          color: #2c3e50;
      }

      #aboutPanel p {
          color: #34495e;
          line-height: 1.6;
      }

      #telegramLink {
          color: #007bff;
          text-decoration: underline;
          cursor: pointer;
      }

      /* ... 其他样式保持不变 ... */
      .iframe-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, auto);
          grid-auto-rows: minmax(200px, auto);
          grid-gap: 1px;
          width: 100%;
          height: 100%;
      }
      .iframe-container iframe {
          width: 100%;
          height: 100%;
          border: 1px solid #ddd;
      }
          /* 可选：添加响应式设计 */
      @media (max-width: 768px) {
          .iframe-container {
              grid-template-columns: repeat(2, 1fr); /* 在小屏幕上显示两列 */
          }
      }

      @media (max-width: 480px) {
          .iframe-container {
              grid-template-columns: 1fr; /* 在非常小的屏幕上显示一列 */
          }
      }

      .iframe-wrapper {
          position: relative;
      }

      .expand-button {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          text-align: center;
          padding: 5px 0;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s;
      }
      .iframe-wrapper:hover .expand-button {
          opacity: 1;
      }
      `;

    const styleEl = document.createElement('style');
    styleEl.textContent = iconStyle;
    document.head.appendChild(styleEl);

    const iconHtml = `
        <img src="data:image/webp;base64,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" />
        <div id="parsePanel">
            <div>
                <button id="parseBtn">👉解析</button>
                <button id="gotoSiteBtn" style="background:#5a6268;">去奇讯边聊边看</button>
                <button id="restoreBtn" style="background:#5a6268;">还原</button>
            </div>
            <div id="configPanel">
                <label><input type="radio" name="iframeCount" value="6"> 6个格子解析</label>
                <label><input type="radio" name="iframeCount" value="4"> 4个格子解析</label>
                <label><input type="radio" name="iframeCount" value="1"> 1个格子解析</label>
                <button id="saveConfigBtn">保存配置</button>
                <div id="configTips" style="margin-top: 10px; padding: 5px 10px; color: red; display: none;font-size:12px;">配置已保存并生效！</div>
            </div>
            <div class="warning-tips">
                <p>⚠️ 注意：</p>
                <p>如果全部解析失败请过段时间再试</p>
                <p>请勿相信视频中的任何广告，都是假的</p>
            </div>

            <div id="aboutPanel">
                <h3>🎥 奇讯视频解析工具</h3>
                <p>一键解析多平台视频，支持多源选择，提供便捷的观看体验。</p>
                <a id="telegramLink" href="https://t.me/qixunyingshi" target="_blank">点击加入 Telegram 群组</a>
            </div>
        </div>
    `;


    const container = document.createElement('div');
    container.id = 'vipParseIcon';
    container.innerHTML = iconHtml;
    document.body.appendChild(container);

    const parsePanel = document.getElementById('parsePanel');
    const vipParseIcon = document.getElementById('vipParseIcon');
    const parseBtn = document.getElementById('parseBtn');
    const configPanel = document.getElementById('configPanel');
    const saveConfigBtn = document.getElementById('saveConfigBtn');
    const restoreBtn = document.getElementById('restoreBtn');
    const gotoSiteBtn = document.getElementById('gotoSiteBtn');
    const icon = container.querySelector('img');
    const telegramLink = document.getElementById('telegramLink');

    // 初始化配置
    const iframeCount = GM_getValue('iframeCount', '6');
    configPanel.querySelector(`input[value="${iframeCount}"]`).checked = true;

    // 鼠标移入图标：显示面板，清除隐藏定时器
    icon.addEventListener('mouseover', () => {
      clearTimeout(hidePanelTimeout);
      parsePanel.style.display = 'block';
    });

    // 鼠标移出图标：启动隐藏面板定时器
    icon.addEventListener('mouseleave', () => {
      hidePanelTimeout = setTimeout(() => {
        parsePanel.style.display = 'none';
      }, 300);
    });

    // 鼠标移入面板：清除隐藏定时器
    parsePanel.addEventListener('mouseover', () => {
      clearTimeout(hidePanelTimeout);
    });

    // 鼠标移出面板：启动隐藏面板定时器
    parsePanel.addEventListener('mouseleave', () => {
      hidePanelTimeout = setTimeout(() => {
        parsePanel.style.display = 'none';
      }, 300);
    });

    // 保存配置
    saveConfigBtn.addEventListener('click', () => {
      const newIframeCount = configPanel.querySelector('input[name="iframeCount"]:checked').value;
      GM_setValue('iframeCount', newIframeCount);
      if (originalVideoContainer) {
        parseVideoMulti();
      }
      // 获取提示元素
      const tips = document.getElementById('configTips');
      tips.style.display = 'block';
      // 3秒后隐藏
      setTimeout(() => {
        tips.style.display = 'none';
      }, 3000);
    });

    parsePanel.addEventListener('click', (e) => {
      e.stopPropagation()
    });
    parseBtn.addEventListener('click', parseVideoMulti);
    vipParseIcon.addEventListener('click', parseVideoMulti);
    restoreBtn.addEventListener('click', restoreVideo);
    gotoSiteBtn.addEventListener('click', () => window.open(`https://qx.bluu.pl/#/?url=${encodeURIComponent(location.href)}`, '_blank'));
    telegramLink.addEventListener('click', (e) => {
      e.stopPropagation();
      window.open('https://t.me/qixunyingshi', '_blank');
    });

    makeDraggable(container, icon);
  }

  function getVideoContainer() {
    const siteRule = getSiteRule(location.hostname);
    if (!siteRule) {
      console.log('未找到匹配的网站规则');
      return null;
    }
    let videoContainer = null;
    for (const node of siteRule.node) {
      videoContainer = document.querySelector(node);
      if (videoContainer) {
        originalVideoContainerSelector = node;
        videoContainerWidth = videoContainer.offsetWidth;
        videoContainerHeight = videoContainer.offsetHeight;
        break;
      }
    }
    return videoContainer;
  }

  function expandAndReplaceIframe(iframe) {
    const videoContainer = getVideoContainer();
    if (!videoContainer) return;

    const newIframe = document.createElement('iframe');
    newIframe.src = iframe.src;
    newIframe.allowFullscreen = iframe.allowFullscreen;
    newIframe.allowTransparency = iframe.allowTransparency;

    newIframe.style.width = videoContainerWidth + 'px';
    newIframe.style.height = videoContainerHeight + 'px';
    newIframe.style.border = 'none';

    videoContainer.innerHTML = '';
    videoContainer.appendChild(newIframe);
    currentIframeContainer = null;
  }

  function parseVideoMulti() {
    const videoContainer = getVideoContainer();
    if (!videoContainer) return;

    if (!originalVideoContainer) {
      originalVideoContainer = videoContainer.innerHTML;
    }

    const iframeCount = parseInt(GM_getValue('iframeCount', '6'));
    const urls = parseUrls.slice(0, iframeCount);

    let gridColumns = 1;
    if (iframeCount === 6) {
      gridColumns = 3;
    } else if (iframeCount === 4) {
      gridColumns = 2;
    }

    let iframeHTML = `<div class="iframe-container" style="grid-template-columns: repeat(${gridColumns}, 1fr);">`;
    urls.forEach(url => {
      iframeHTML += `
              <div class="iframe-wrapper">
                  <iframe src="${url}${encodeURIComponent(location.href)}" allowfullscreen allowtransparency></iframe>
                  <div class="expand-button">⬆️用这个视频继续播放</div>
              </div>
          `;
    });
    iframeHTML += '</div>';

    videoContainer.innerHTML = iframeHTML;
    currentIframeContainer = videoContainer.querySelector('.iframe-container');

    const expandButtons = videoContainer.querySelectorAll('.expand-button');
    expandButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        expandAndReplaceIframe(videoContainer.querySelectorAll('iframe')[index]);
      });
    });

    const siteRule = getSiteRule(location.hostname);
    if (siteRule && siteRule.area) {
      const areaSelector = `.${siteRule.area}`;
      if (!videoContainer.dataset.eventBound) {
        const bindAreaEvent = () => {
          const areaElement = document.querySelector(areaSelector);
          if (areaElement) {
            areaElement.addEventListener('click', () => {
              setTimeout(parseVideoMulti, 1000); // 延时并重新解析
            });
            videoContainer.dataset.eventBound = 'true';
          }
        };
        bindAreaEvent();
        const observer = new MutationObserver(bindAreaEvent);
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }
  }

  function restoreVideo() {
    if (!originalVideoContainer) return;
    const videoContainer = document.querySelector(originalVideoContainerSelector);
    if (videoContainer) {
      videoContainer.innerHTML = originalVideoContainer;
      currentIframeContainer = null;
    } else {
      console.error("找不到原始视频容器:", originalVideoContainerSelector);
    }
  }

  function makeDraggable(element, handle) {
    let isDragging = false;
    let startX, startY, startTop;

    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (e.button !== 0) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startTop = element.offsetTop;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
      if (!isDragging) return;

      const deltaY = e.clientY - startY;
      let newTop = startTop + deltaY;
      const maxHeight = window.innerHeight - element.offsetHeight - 10;
      newTop = Math.max(0, Math.min(newTop, maxHeight));
      element.style.top = `${newTop}px`;
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      GM_setValue('iconTop', element.offsetTop);
    }
  }

  window.addEventListener('load', () => {
    if (getSiteRule(location.hostname)) {
      createParseElements();

      const siteRule = getSiteRule(location.hostname);
      if (siteRule && siteRule.area) {
        const areaSelector = `.${siteRule.area}`;
        const videoContainer = getVideoContainer();
        if (videoContainer && !videoContainer.dataset.eventBound) {
          const bindAreaEvent = () => {
            const areaElement = document.querySelector(areaSelector);
            if (areaElement) {
              areaElement.addEventListener('click', () => {
                setTimeout(parseVideoMulti, 1000);
              });
              videoContainer.dataset.eventBound = 'true';
            }
          };

          bindAreaEvent();
          const observer = new MutationObserver(bindAreaEvent);
          observer.observe(document.body, { childList: true, subtree: true });
        }
      }
    }
  });

  GM_registerMenuCommand("设置解析线路", () => {
    const selectedLine = prompt("请选择或输入解析线路的URL：", localStorage.getItem('preferredParseLine') || parseUrls[0]);
    if (selectedLine) {
      localStorage.setItem('preferredParseLine', selectedLine);
      location.reload();
    }
  });
})();