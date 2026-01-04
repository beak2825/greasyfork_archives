// ==UserScript==
// @name         哔哩哔哩（bilibili）播放器辅助设置
// @namespace    bilibili
// @version      1.0.1
// @description  B站播放器增强设置，自动宽屏，默认最高画质，默认关闭弹幕等
// @author       darkless
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429133/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibili%EF%BC%89%E6%92%AD%E6%94%BE%E5%99%A8%E8%BE%85%E5%8A%A9%E8%AE%BE%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/429133/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibili%EF%BC%89%E6%92%AD%E6%94%BE%E5%99%A8%E8%BE%85%E5%8A%A9%E8%AE%BE%E7%BD%AE.meta.js
// ==/UserScript==

'use strict';

(async function () {
  console.group('哔哩哔哩（bilibili）播放器初始化开始');
  const config = {
    closeBarrage: true, // true表示关闭弹幕，false表示开启弹幕
    autoWidescreen: true, // true表示开启自动宽屏，false表示关闭自动宽屏
    autoPlayList: [], // 开启自动连播白名单，目前仅支持BV号，如 ['BV123445']
    redundantElements: [
      '#bannerAd', 
      '#activity_vote', /*  */
      '.ad-report', /*  */
      '.video-page-special-card', 
      'reportFirst1',
      'reportFirst2',
      'reportFirst3',
    ],
  };

  const document = this.document;

  const handleSettingLoaded = (e) => {
    console.log('加载播放器设置');
    const videoControl = e.detail.videoControl;
    const videoSendBar = e.detail.videoSendBar;

    // 切换弹幕开关
    switchBarrage(config.closeBarrage, videoSendBar);

    // 最高画质
    hightQuality(videoControl);

    // 自动宽屏
    autoWidescreen(config.autoWidescreen, videoControl);

    // 自动播放列表
    autoPlayList(config.autoPlayList, this);

    // 展开简介
    expandDescription(document);

    // 删除部分元素
    removeElements(config.redundantElements, document);

    console.log('初始化结束');
    console.groupEnd();
  };

  const handlePlayerLoaded = (e) => {
    const { data } = e;
    if (data.type === 'PlayerLoaded' || data.type === 'VideoLoaded') {
      console.log(data)
      getRoots(document);
    }
  };

  document.addEventListener('SettingLoaded', handleSettingLoaded);
  this.addEventListener('message', handlePlayerLoaded);

  observePlayerStatus(this);
}.bind(window)());

function removeElements(selectors, document) {

  selectors.forEach((selector) => {
    let elements;
    if (selector.indexOf('.') === 0) {
      elements = document.querySelectorAll(selector);
    } else {
      elements = document.querySelector(selector);
    }

    if (elements && Array.isArray(elements)) {
      elements.forEach((element) => {
        if (typeof element.remove === 'function') {
          element.remove();
        }
      });
    } else {
      if (typeof elements.remove === 'function') {
        elements.remove();
      }
    }
  });
  console.log('部分推广元素已删除');
}

function expandDescription(document) {
  const element = document.getElementsByClassName('desc-info')[0];
  if (!/open/.test(element.className)) {
    document.getElementsByClassName('toggle-btn')[0].click();
  }
  console.log('简介已展开');
}

function autoPlayList(videos, window) {
  const button = window.document.getElementsByClassName('switch-button').item(0);
  const bv = window.location.pathname.split('/')[2];
  const isAutoPlayVideo = videos.includes(bv);
  let timer;

  let isOpen = button.className === 'switch-button on';
  let needOpen = !isOpen && isAutoPlayVideo;
  let needClose = isOpen && !isAutoPlayVideo;

  const observer = new window.MutationObserver((_, observer) => {
    clearTimeout(timer);
    isOpen = button.className === 'switch-button on';
    needOpen = needOpen = !isOpen && isAutoPlayVideo;
    needClose = isOpen && !isAutoPlayVideo;

    if (!needOpen && !needClose) {
      observer.disconnect();
      console.log('自动连P已切换');
      return;
    }

    if (needOpen || needClose) {
      timer = setTimeout(() => {
        button.click();
      }, 3000);
      return;
    }
  });

  observer.observe(button, {
    attributes: true,
    attributeFilter: ['class'],
    attributeOldValue: true,
  });

  if (needOpen || needClose) {
    timer = setTimeout(() => button.click(), 0);
  }
}

function autoWidescreen(autoWidescreen, element) {
  const widescreenElement = element.getElementsByClassName('bilibili-player-video-btn-widescreen').item(0);
  if (autoWidescreen && !/closed/.test(widescreenElement.className)) {
    widescreenElement.click();
    console.log('已开启宽屏');
  }
}

function hightQuality(element) {
  const isVip = document.querySelector('.profile-info .vip') !== null;
  const isLogin = document.getElementById('bilibiliPlayer').getAttribute('data-login') === 'true';

  const list = element.querySelectorAll('.bilibili-player-video-btn-quality .bui-select-list .bui-select-item');
  const newList = Array.prototype.slice.call(list);
  newList.some((item) => {
    let result = true;

    const children = item.children;
    if (children.length >= 3) {
      const className = children.item(2).className;
      switch (className) {
        case 'bilibili-player-bigvip':
          result = isVip;
          break;
        case 'bilibili-player-needlogin':
          result = isLogin;
          break;
        default:
          result = true;
          break;
      }
    }

    if (result) {
      console.log('画质已切换至最高');
      item.click();
    }
    return result;
  });
}

function switchBarrage(close, root) {
  const element = root.getElementsByClassName('bui-switch-input').item(0);

  if (close === element.checked) {
    element.click();
  }
  console.log('弹幕开关已切换');
}

function getRoots(document) {
  const videoControls = document.getElementsByClassName('bilibili-player-video-control');
  const videoSendBars = document.getElementsByClassName('bilibili-player-video-sendbar');

  if (videoControls.length > 0 && videoSendBars.length > 0) {
    document.dispatchEvent(new CustomEvent('SettingLoaded', {
      detail: {
        videoControl: videoControls[0],
        videoSendBar: videoSendBars[0],
      },
    }));
  } else {
    setTimeout(() => {
      getRoots(document);
    }, 500);
  }
}

function observePlayerStatus(window) {
  const rootElement = window.document.getElementById('bilibiliPlayer');
  const videoElement = rootElement.getElementsByClassName('bilibili-player-video')[0].children[0];

  const rootObserver = new window.MutationObserver((_, observer) => {
    window.postMessage({
      type: 'PlayerLoaded',
      timestamp: Date.now(),
    }, '*');
    observer.disconnect();
  });

  rootObserver.observe(rootElement, {
    attributes: true,
    attributeFilter: ['data-login'],
    childList: true,
  });

  const videoObserver = new window.MutationObserver(() => {
    setTimeout(() => {
      window.postMessage({
        type: 'VideoLoaded',
        timestamp: Date.now(),
      }, '*');
    }, 3000);
  });

  videoObserver.observe(videoElement, {
    attributes: true,
    attributeFilter: ['src'],
  });
}
