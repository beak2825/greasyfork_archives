// ==UserScript==
// @name         Bilibili - 在未登录的情况下自动并无限试用最高画质
// @namespace    https://bilibili.com/
// @version      1.5
// @description  在未登录的情况下自动并无限试用最高画质 | V1.5 代码优化 & 新增自定义设置面板
// @license      GPL-3.0
// @author       DD1969
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/festival/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/467511/Bilibili%20-%20%E5%9C%A8%E6%9C%AA%E7%99%BB%E5%BD%95%E7%9A%84%E6%83%85%E5%86%B5%E4%B8%8B%E8%87%AA%E5%8A%A8%E5%B9%B6%E6%97%A0%E9%99%90%E8%AF%95%E7%94%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/467511/Bilibili%20-%20%E5%9C%A8%E6%9C%AA%E7%99%BB%E5%BD%95%E7%9A%84%E6%83%85%E5%86%B5%E4%B8%8B%E8%87%AA%E5%8A%A8%E5%B9%B6%E6%97%A0%E9%99%90%E8%AF%95%E7%94%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  // initialize options
  const options = {
    // 偏好分辨率
    preferQuality: GM_getValue('preferQuality', '1080'),

    // 是否暂停播放视频直至画质切换完成(以此规避音画不同步现象)
    isWaitUntilHighQualityLoaded: GM_getValue('isWaitUntilHighQualityLoaded', false),
  }

  // essential keys
  const keys = ['bilibili_player_codec_prefer_type', 'b_miniplayer', 'recommend_auto_play', 'bpx_player_profile'];

  // apply configs from scriptStorage to localStorage
  keys.forEach(key => {
    const value = GM_getValue(key);
    if (value) window.localStorage.setItem(key, value);
  });

  // override 'setItem'
  const originSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    // fix TypeError: Cannot read properties of null (reading 'offLoudness') at turnOffLoudnessNormalization
    if (key === 'bpx_player_profile') {
      const profile = JSON.parse(value);
      if (!profile.audioEffect) profile.audioEffect = {};
      value = JSON.stringify(profile);
    }
    originSetItem.call(this, key, value);

    // save configs into scriptStorage
    if (keys.includes(key)) {
      setTimeout(() => {
        GM_setValue('bilibili_player_codec_prefer_type', window.localStorage.getItem('bilibili_player_codec_prefer_type') || '0');
        GM_setValue('b_miniplayer', window.localStorage.getItem('b_miniplayer') || '1');
        GM_setValue('recommend_auto_play', window.localStorage.getItem('recommend_auto_play') || 'open');
        GM_setValue('bpx_player_profile', window.localStorage.getItem('bpx_player_profile') || `{ lastView: ${Date.now() - 864e5}, lastUid: 0 }`);
      }, 100);
    }
  }

  // no need to continue this script if user has logged in
  if (document.cookie.includes('DedeUserID')) return;

  // setup setting panel & entry
  setupSettingPanel();
  setupSettingPanelEntry();

  // enable trial every time a new video loaded
  const originDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj, prop, descriptor) {
    if (prop === 'isViewToday' || prop === 'isVideoAble') {
      descriptor = {
        get: () => true,
        enumerable: !1,
        configurable: !0
      }
    }
    return originDefineProperty.call(this, obj, prop, descriptor);
  }

  // extend trial time by overriding "setTimeout"
  const originSetTimeout = unsafeWindow.setTimeout;
  unsafeWindow.setTimeout = function(func, delay) {
    if (delay === 3e4) delay = 3e8;
    return originSetTimeout.call(this, func, delay);
  }

  // click the trial button automatically
  setInterval(async () => {
    const trialBtn = document.querySelector('.bpx-player-toast-confirm-login');
    if (!trialBtn) return;

    // start trialling
    await new Promise(resolve => setTimeout(resolve, 1000));
    trialBtn.click();

    // avoid audio and video out of sync
    if (options.isWaitUntilHighQualityLoaded) {
      // pause if playing
      const isPlaying = !unsafeWindow.player.mediaElement().paused;
      if (isPlaying) unsafeWindow.player.mediaElement().pause();

      // search for end signal
      const timer4Toast = setInterval(() => {
        const toasts = Array.from(document.querySelectorAll('.bpx-player-toast-text'));
        if (toasts.some(toast => toast.textContent.endsWith('试用中'))) {
          if (isPlaying) unsafeWindow.player.mediaElement().play();;
          clearInterval(timer4Toast);
        }
      }, 100);
    }

    // switch to preferred video quality
    const preferQualityNum = ({ '1080': 80, '720': 64, '480': 32, '360': 16 })[options.preferQuality] || 80;
    setTimeout(() => {
      if (unsafeWindow.player.getSupportedQualityList()?.includes(preferQualityNum) && preferQualityNum < unsafeWindow.player.getQuality().nowQ) {
        unsafeWindow.player.requestQuality(preferQualityNum);
      }
    }, 5000);
  }, 1500);

  // ---------- functions below ----------

  function setupSettingPanel() {
    // CSS
    const settingPanelCSS = document.createElement('style');
    settingPanelCSS.textContent = `
      #userscript-467511-setting-panel-container {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999999999;
        width: 100vw;
        height: 100vh;
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5);
      }

      .userscript-467511-setting-panel-wrapper {
        width: 600px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        background-color: #FFFFFF;
        border-radius: 8px;
        user-select: none;
      }

      .userscript-467511-setting-panel-title {
        margin-top: 0;
        margin-bottom: 8px;
        padding-top: 16px;
        padding-left: 12px;
        font-size: 28px;
      }

      .userscript-467511-setting-panel-option-group {
        display: flex;
        flex-direction: column;
        width: 100%;
        font-size: 16px;
      }

      .userscript-467511-setting-panel-option-item {
        padding: 16px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 4px;
      }

      .userscript-467511-setting-panel-option-item:hover {
        background-color: #FAFAFA;
      }

      .userscript-467511-setting-panel-option-item-switch {
        display: flex;
        align-items: center;
        width: 40px;
        height: 20px;
        padding: 2px;
        cursor: pointer;
        border-radius: 4px;
      }

      .userscript-467511-setting-panel-option-item-switch[data-status="off"] {
        justify-content: flex-start;
        background-color: #CCCCCC;
      }

      .userscript-467511-setting-panel-option-item-switch[data-status="on"] {
        justify-content: flex-end;
        background-color: #00AEEC;
      }

      .userscript-467511-setting-panel-option-item-switch:after {
        content: '';
        width: 20px;
        height: 20px;
        background-color: #FFFFFF;
        border-radius: 4px;
      }

      #userscript-467511-setting-panel-close-btn {
        margin-top: 16px;
        padding: 2px;
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: #FFFFFF;
        border: 2px solid #FFFFFF;
        border-radius: 100%;
        cursor: pointer;
        user-select: none;
      }
    `;

    // HTML
    const containerElement = document.createElement('div');
    containerElement.id = 'userscript-467511-setting-panel-container';
    containerElement.innerHTML = `
      <div class="userscript-467511-setting-panel-wrapper">
        <p class="userscript-467511-setting-panel-title">自定义设置</p>
        <div class="userscript-467511-setting-panel-option-group">
          <div class="userscript-467511-setting-panel-option-item">
            <span class="userscript-467511-setting-panel-option-item-title">偏好分辨率</span>
            <select class="userscript-467511-setting-panel-option-item-select" data-key="preferQuality" name="preferQuality">
              <option value="1080" ${options.preferQuality === '1080' ? 'selected' : ''}>1080p</option>
              <option value="720" ${options.preferQuality === '720' ? 'selected' : ''}>720p</option>
              <option value="480" ${options.preferQuality === '480' ? 'selected' : ''}>480p</option>
              <option value="360" ${options.preferQuality === '360' ? 'selected' : ''}>360p</option>
            </select>
          </div>
          <div class="userscript-467511-setting-panel-option-item">
            <span class="userscript-467511-setting-panel-option-item-title">暂停播放视频直至画质切换完成(以此规避音画不同步现象)</span>
            <span class="userscript-467511-setting-panel-option-item-switch" data-key="isWaitUntilHighQualityLoaded" data-status="${options.isWaitUntilHighQualityLoaded ? 'on' : 'off'}"></span>
          </div>
        </div>
        <div style="margin-top: 16px; align-self: center; font-size: 14px;">
          <span style="display: inline-block; transform: translateY(-1.5px);">⚠️</span>
          <span style="color: #AAAAAA;">所有改动将在页面刷新后生效</span>
        </div>
      </div>
      <span id="userscript-467511-setting-panel-close-btn">×</span>
    `;

    // setup event handler
    containerElement.querySelectorAll('.userscript-467511-setting-panel-option-item-select').forEach(selectElement => {
      selectElement.onchange = function(e) {
        const { key } = this.dataset;
        GM_setValue(key, e.target.value);
      }
    });

    containerElement.querySelectorAll('.userscript-467511-setting-panel-option-item-switch').forEach(switchElement => {
      switchElement.onclick = function(e) {
        const { key, status } = this.dataset;
        this.dataset.status = status === 'off' ? 'on' : 'off';
        GM_setValue(key, this.dataset.status === 'on');
      }
    });

    containerElement.querySelector('#userscript-467511-setting-panel-close-btn').onclick = () => containerElement.style.display = 'none';

    // append to document
    const timer = setInterval(() => {
      if (document.head && document.body) {
        document.head.appendChild(settingPanelCSS);
        document.body.appendChild(containerElement);
        clearInterval(timer);
      }
    }, 1000);
  }

  function setupSettingPanelEntry() {
    const timer = setInterval(() => {
      const otherSettingElement = document.querySelector('.bpx-player-ctrl-setting-others-content');
      if (otherSettingElement) {
        const entryElement = document.createElement('div');
        entryElement.textContent = '脚本设置 >';
        entryElement.style = `height: 20px; line-height: 20px; cursor: pointer;`;
        entryElement.onclick = () => document.querySelector('#userscript-467511-setting-panel-container').style.display = 'flex';
        otherSettingElement.appendChild(entryElement);
        clearInterval(timer);
      }
    }, 1000);
  }

})();