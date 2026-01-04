// ==UserScript==
// @name         必应搜索首页净化
// @namespace    BingSearchHomeClean
// @version      1.3.2
// @description  针对必应搜索的首页进行体验优化，隐藏繁杂的新闻资讯、今日热点等内容，可根据选项进行个性化的配置，还你一个干净简洁的必应搜索页面！
// @author       Lee
// @match        *://*.bing.com/*
// @exclude      /^https?:\/\/.*bing\.com\/.+\?[a-z]+=.+/
// @grant        GM_registerMenuCommand
// @license      GPL-3.0
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiMxNDg2QzkiIGQ9Im0xMC4xMjkgOC41OTZsMS43MzUgNC4zMjhsMi43NyAxLjI5TDE5IDE2LjI0N1YxMS43eiIgb3BhY2l0eT0iLjciLz48cGF0aCBmaWxsPSIjMTQ4NkM5IiBkPSJNMTQuNjM0IDE0LjIxNEw5IDE3LjQ1N1YzLjRMNSAydjE3Ljc2TDkgMjJsMTAtNS43NTNWMTEuN3oiLz48L3N2Zz4=
// @downloadURL https://update.greasyfork.org/scripts/514951/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E9%A6%96%E9%A1%B5%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/514951/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E9%A6%96%E9%A1%B5%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let userSettings = {
    hideScrollContainer: true,
    hideHeader: true,
    hideMicrophone: true,
    hideGold: true,
    hideQrCode: true,
    hideScrollbar: true,
    hideInputTip: true,
    hideHotNewsInput: true,
    hideMobilePhoneLogo: true,
    hideQrCodeMobile: true,
    hideHotNews: true,
    hideSearchEdition: true,
  };

  // 初始化用户设置，没有则创建默认设置
  function initUserSettings() {
    if (localStorage.getItem('bingUserSettings')) {
      userSettings = JSON.parse(localStorage.getItem('bingUserSettings'));
    } else {
      localStorage.setItem('bingUserSettings', JSON.stringify(userSettings));
    }
  }
  initUserSettings();

  // 注册设置面板
  function registerMenuCommand() {
    GM_registerMenuCommand('自定义隐藏栏目', () => {
      // 解决多次点击设置项导致无法关闭面板的问题
      if (document.querySelector('.setting__panel')) {
        return;
      }
      const settingsPanel = document.createElement('div');
      settingsPanel.innerHTML = `
        <div class="setting__panel">
          <h4 class="setting__panel__title">选择要隐藏的栏目</h4>
          <label><input type="checkbox" id="hideScrollContainer" ${userSettings.hideScrollContainer ? 'checked' : ''}>隐藏发现内容</label>
          <label><input type="checkbox" id="hideHeader" ${userSettings.hideHeader ? 'checked' : ''}>隐藏图片/视频等头部五栏</label>
          <label><input type="checkbox" id="hideGold" ${userSettings.hideGold ? 'checked' : ''}>隐藏奖杯数</label>
          <label><input type="checkbox" id="hideQrCode" ${userSettings.hideQrCode ? 'checked' : ''}>隐藏二维码</label>
          <label><input type="checkbox" id="hideInputTip" ${userSettings.hideInputTip ? 'checked' : ''}>隐藏输入框提示</label>
          <label><input type="checkbox" id="hideHotNewsInput" ${userSettings.hideHotNewsInput ? 'checked' : ''}>隐藏输入框内今日热点</label>
          <label><input type="checkbox" id="hideMicrophone" ${userSettings.hideMicrophone ? 'checked' : ''}>隐藏输入框麦克风图标</label>
          <label><input type="checkbox" id="hideHotNews" ${userSettings.hideHotNews ? 'checked' : ''}>隐藏今日热点</label>
          <label><input type="checkbox" id="hideSearchEdition" ${userSettings.hideSearchEdition ? 'checked' : ''}>隐藏国内外版本</label>
          <button id="closeSetting" class="setting__panel__close">关闭设置</button>
        </div>`;
      document.body.appendChild(settingsPanel);

      const userStyleSheet = document.createElement('style');
      userStyleSheet.id = 'userStyleSheet';
      userStyleSheet.innerHTML = `
        .setting__panel {
          position: fixed;
          top: 10%;
          right: 10px;
          z-index: 9999;
          width: 300px;
          padding: 10px;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
        .setting__panel__title {
          margin: 0 0 12px 0;
          text-align: center;
        }
        label {
          display: block;
          cursor: pointer;
        }
        input {
          margin-right: 6px;
        }
        .setting__panel__close {
          width: 100%;
          margin-top: 10px;
          cursor: pointer;
        }
      `;
      document.head.appendChild(userStyleSheet);

      const list = ['hideScrollContainer', 'hideHeader', 'hideMicrophone', 'hideGold', 'hideQrCode', 'hideScrollbar', 'hideInputTip', 'hideHotNewsInput', 'hideMobilePhoneLogo', 'hideQrCodeMobile', 'hideHotNews', 'hideSearchEdition'];

      list.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('change', function (e) {
            userSettings[id] = e.target.checked;
            localStorage.setItem('bingUserSettings', JSON.stringify(userSettings));
            startBingSearchClean();
          });
        }
      });

      document.getElementById('closeSetting').addEventListener('click', () => {
        document.body.removeChild(settingsPanel);
      });
    });
  }
  registerMenuCommand();

  // 执行净化操作
  function startBingSearchClean() {
    // 发现内容
    const container = document.querySelector('#scroll_cont');
    if (container) {
      userSettings.hideScrollContainer ? (container.style.display = 'none') : (container.style.display = 'revert');
    }
    // 头部五栏
    const headerSection = document.querySelector('.scope_cont');
    if (headerSection) {
      userSettings.hideHeader ? (headerSection.style.display = 'none') : (headerSection.style.display = 'revert');
    }
    // 输入框麦克风图标
    const microphone = document.querySelector('.mic_cont.icon');
    if (microphone) {
      userSettings.hideMicrophone ? (microphone.style.display = 'none') : (microphone.style.display = 'inline-block');
    }
    // 奖杯数
    const gold = document.querySelector('#id_rh_w');
    if (gold) {
      userSettings.hideGold ? (gold.style.display = 'none') : (gold.style.display = 'revert');
    }
    // 必应app二维码
    const qrCode = document.querySelector('#id_qrcode');
    if (qrCode) {
      userSettings.hideQrCode ? (qrCode.style.display = 'none') : (qrCode.style.display = 'revert');
    }
    // 隐藏溢出滚动条
    const scrollbar = document.documentElement;
    if (scrollbar && container) {
      userSettings.hideScrollContainer ? (scrollbar.style.overflow = 'hidden') : (scrollbar.style.overflow = 'auto');
    }
    // 输入框内提示
    const inputTip = document.querySelector('.sb_form_placeholder');
    if (inputTip) {
      userSettings.hideInputTip ? (inputTip.style.display = 'none') : (inputTip.style.display = 'revert');
    }
    // 输入框内今日热点
    const hotNewsInput = document.querySelector('#sa_pn_block');
    if (hotNewsInput) {
      userSettings.hideHotNewsInput ? (hotNewsInput.style.display = 'none') : (hotNewsInput.style.display = 'revert');
    }
    // 今日上的热点
    const hotNews = document.querySelector('.below_sbox');
    if (hotNews) {
      userSettings.hideHotNews ? (hotNews.style.display = 'none') : (hotNews.style.display = 'revert');
    }
    // 国内外搜索不同版本
    const searchEdition = document.querySelector('#est_switch');
    if (searchEdition) {
      userSettings.hideSearchEdition ? (searchEdition.style.display = 'none') : (searchEdition.style.display = 'revert');
    }
    // 搜索结果右侧手机端标识
    const mobilePhoneLogo = document.querySelector('.id_mobile');
    if (mobilePhoneLogo) {
      mobilePhoneLogo.style.display = 'none';
    }
    // 下载手机端二维码推荐
    const qrCodeMobile = document.querySelector('#id_qrcode_popup_container');
    if (qrCodeMobile) {
      qrCodeMobile.style.display = 'none';
    }
  }

  // 初次加载页面时就执行净化操作
  const observer = new MutationObserver(() => {
    startBingSearchClean();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
