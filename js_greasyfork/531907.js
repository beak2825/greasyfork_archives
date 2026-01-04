// ==UserScript==
// @name         动画疯跳过广告和年龄确认
// @namespace    Schwi
// @version      1.0
// @description  巴哈姆特动画疯 跳过各种麻烦的东西
// @author       Schwi
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @icon         https://i2.bahamut.com.tw/favicon.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @noframes
// @supportURL   https://github.com/cyb233/script
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/531907/%E5%8A%A8%E7%94%BB%E7%96%AF%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A%E5%92%8C%E5%B9%B4%E9%BE%84%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/531907/%E5%8A%A8%E7%94%BB%E7%96%AF%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A%E5%92%8C%E5%B9%B4%E9%BE%84%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const defaultConfig = {
    debug: false,
    skipAgreement: true,
    skipAd: true,
    muteAd: true,
    autoNext: false
  };

  const config = GM_getValue('config', defaultConfig);

  const menuIds = [];
  const resetMenus = () => {
    menuIds.forEach((id) => GM_unregisterMenuCommand(id));
    menuIds.length = 0;
    menuIds.push(
      GM_registerMenuCommand(`跳过年龄确认：${config.skipAgreement ? '开' : '关'}`, () => {
        config.skipAgreement = !config.skipAgreement;
        GM_setValue('config', config);
        resetMenus();
      }),
      GM_registerMenuCommand(`跳过广告：${config.skipAd ? '开' : '关'}`, () => {
        config.skipAd = !config.skipAd;
        GM_setValue('config', config);
        resetMenus();
      }),
      GM_registerMenuCommand(`广告静音：${config.muteAd ? '开' : '关'}`, () => {
        config.muteAd = !config.muteAd;
        GM_setValue('config', config);
        resetMenus();
      }),
      GM_registerMenuCommand(`自动下一集：${config.autoNext ? '开' : '关'}`, () => {
        config.autoNext = !config.autoNext;
        GM_setValue('config', config);
        resetMenus();
      }),
    );
  };

  resetMenus();

  const status = {
    adSkipped: false,
    userMuted: null,
    adMuted: false
  };

  const adCssList = [
    '#adSkipButton.vast-skip-button',
    '.nativeAD-skip-button:not(.vjs-hidden)',
    '.videoAdUiSkipContainer.html5-stop-propagation>button'
  ];

  const skipAgreement = () => {
    const accAgreement = document.querySelector('#adult');
    if (accAgreement) {
      console.log('跳过年龄确认');
      accAgreement.click();
    } else {
      if (config.debug) console.debug('年龄确认已跳过或不存在');
    }
  };

  const skipAd = (video) => {
    const adSkipButton = document.querySelector(adCssList.join(','));
    if (adSkipButton) {
      if (config.debug) console.debug('找到广告跳过按钮:', adSkipButton);
      if (adSkipButton.classList.contains('enable')) {
        console.log('跳过广告');
        adSkipButton.click();
        status.adSkipped = true;
      } else if (config.muteAd && !status.adMuted) {
        if (config.debug) console.debug('广告未跳过，静音广告');
        video.muted = true;
        status.adMuted = true;
      }
    } else {
      if (config.debug) console.debug('广告跳过按钮不存在或已被点击');
    }
  };

  const restoreMuteStatus = (video) => {
    if (status.userMuted !== null) {
      console.log('恢复用户静音状态', status.userMuted);
      video.muted = status.userMuted; // 修正变量名称
      status.userMuted = null;
      status.adSkipped = false;
      status.adMuted = false;
    }
  };

  const autoNext = () => {
    const nextButton = document.querySelector('.stop:not(.vjs-hidden) #nextEpisode');
    if (nextButton) {
      console.log('下一集');
      nextButton.click();
    } else {
      if (config.debug) console.debug('下一集按钮不存在');
    }
  };

  // 使用 MutationObserver 替换 setInterval 进行 DOM 变化监控
  const observer = new MutationObserver(() => {
    const video = document.querySelector('#ani_video_html5_api');
    if (!video) {
      if (config.debug) console.debug('未找到视频元素');
      return;
    }

    // 第一次检测记录用户静音状态
    if (status.userMuted === null) {
      console.log('记录用户初始静音状态:', video.muted);
      status.userMuted = video.muted;
    }

    if (config.skipAgreement) {
      skipAgreement();
    }

    if (config.skipAd) {
      skipAd(video);
    }

    if (status.adSkipped) {
      restoreMuteStatus(video);
    }

    if (config.autoNext) {
      autoNext();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });

})();