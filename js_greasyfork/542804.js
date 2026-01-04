// ==UserScript==
// @name         Bilibili - 未登录自由看
// @namespace    https://bilibili.com/
// @version      1.0-fusion
// @description  未登录自动无限试用最高画质 + 阻止登录弹窗/自动暂停
// @license      GPL-3.0
// @author       zhikanyeye
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/festival/*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542804/Bilibili%20-%20%E6%9C%AA%E7%99%BB%E5%BD%95%E8%87%AA%E7%94%B1%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542804/Bilibili%20-%20%E6%9C%AA%E7%99%BB%E5%BD%95%E8%87%AA%E7%94%B1%E7%9C%8B.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  /* ========== 0. 公共配置 ========== */
  const options = {
    preferQuality: GM_getValue('preferQuality', '1080'),
    isWaitUntilHighQualityLoaded: GM_getValue('isWaitUntilHighQualityLoaded', false)
  };

  /* ========== 1. 如果已登录直接退出 ========== */
  if (document.cookie.includes('DedeUserID')) return;

  /* ========== 2. 阻止登录弹窗 / 自动暂停 ========== */
  (function blockLoginAndAutoPause() {
    /* 2-1 拦截 miniLogin.js 加载 */
    const originAppend = Node.prototype.appendChild;
    Node.prototype.appendChild = function (el) {
      if (el.tagName === 'SCRIPT' && el.src && el.src.includes('miniLogin')) return el;
      return originAppend.call(this, el);
    };

    /* 2-2 等待播放器就绪后屏蔽 getMediaInfo 返回值 */
    const waitPlayer = () => new Promise(r => {
      const t = setInterval(() => {
        if (unsafeWindow.player && unsafeWindow.player.getMediaInfo) {
          clearInterval(t);
          r();
        }
      }, 300);
    });

    waitPlayer().then(() => {
      const originGet = unsafeWindow.player.getMediaInfo;
      unsafeWindow.player.getMediaInfo = function () {
        const { relativePlayTime, playUrl } = originGet.call(this);
        return { absolutePlayTime: 0, relativePlayTime, playUrl };
      };

      /* 2-3 禁止脚本自动暂停 */
      let clicked = false;
      document.addEventListener('click', () => {
        clicked = true;
        setTimeout(() => (clicked = false), 500);
      });
      const originPause = unsafeWindow.player.pause;
      unsafeWindow.player.pause = function () {
        if (!clicked) return;
        return originPause.apply(this, arguments);
      };
    });
  })();

  /* ========== 3. 无限试用核心 ========== */
  /* 3-1 放行试用标识 */
  const originDef = Object.defineProperty;
  Object.defineProperty = function (obj, prop, desc) {
    if (prop === 'isViewToday' || prop === 'isVideoAble') {
      desc = { get: () => true, enumerable: false, configurable: true };
    }
    return originDef.call(this, obj, prop, desc);
  };

  /* 3-2 把 30s 试用倒计时延长到 3 亿秒 */
  const originSetTimeout = unsafeWindow.setTimeout;
  unsafeWindow.setTimeout = (fn, delay) => {
    if (delay === 30000) delay = 3e8;
    return originSetTimeout.call(unsafeWindow, fn, delay);
  };

  /* 3-3 自动点击试用按钮 + 画质切换 */
  setInterval(async () => {
    const btn = document.querySelector('.bpx-player-toast-confirm-login');
    if (!btn) return;

    await new Promise(r => setTimeout(r, 800));
    btn.click();

    /* 可选：暂停→切画质→继续播放 */
    if (options.isWaitUntilHighQualityLoaded) {
      const wasPlaying = !unsafeWindow.player.mediaElement().paused;
      if (wasPlaying) unsafeWindow.player.mediaElement().pause();

      const t2 = setInterval(() => {
        if ([...document.querySelectorAll('.bpx-player-toast-text')]
            .some(el => el.textContent.endsWith('试用中'))) {
          if (wasPlaying) unsafeWindow.player.mediaElement().play();
          clearInterval(t2);
        }
      }, 100);
    }

    /* 画质切换 */
    const qMap = { 1080: 80, 720: 64, 480: 32, 360: 16 };
    const target = qMap[options.preferQuality] || 80;
    setTimeout(() => {
      if (unsafeWindow.player?.getSupportedQualityList()?.includes(target)) {
        unsafeWindow.player.requestQuality(target);
      }
    }, 5000);
  }, 1500);

  /* ========== 4. 设置面板 ========== */
  GM_addStyle(`#qp-panel{position:fixed;inset:0;z-index:999999;display:none;place-items:center;background:rgba(0,0,0,.5)}
.qp-wrapper{width:90%;max-width:400px;padding:16px;background:#fff;border-radius:8px;display:flex;flex-direction:column;gap:12px;font-size:14px}
.qp-title{margin:0 0 8px;font-size:20px;font-weight:600}
select{padding:4px;border:1px solid #ccc;border-radius:4px}
.switch{cursor:pointer;display:inline-block;width:40px;height:20px;background:#ccc;border-radius:10px;position:relative;transition:.3s}
.switch[data-status='on']{background:#00aeec}
.switch:after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;background:#fff;border-radius:50%;transition:.3s}
.switch[data-status='on']:after{left:22px}`);

  const panel = document.createElement('div');
  panel.id = 'qp-panel';
  panel.innerHTML = `
    <div class="qp-wrapper">
      <div class="qp-title">画质设置</div>
      <label>偏好分辨率
        <select data-key="preferQuality">
          <option value="1080">1080p</option>
          <option value="720">720p</option>
          <option value="480">480p</option>
          <option value="360">360p</option>
        </select>
      </label>
      <label>切换时暂停播放
        <span class="switch" data-key="isWaitUntilHighQualityLoaded" data-status="${options.isWaitUntilHighQualityLoaded ? 'on' : 'off'}"></span>
      </label>
      <button onclick="this.parentElement.parentElement.style.display='none'">关闭</button>
    </div>`;
  document.body.appendChild(panel);

  /* 注册 GM 菜单 & 播放器入口 */
  GM_registerMenuCommand('画质设置', () => (panel.style.display = 'flex'));
  const addEntry = () => {
    const others = document.querySelector('.bpx-player-ctrl-setting-others-content');
    if (!others) return;
    const entry = document.createElement('div');
    entry.textContent = '脚本设置 >';
    entry.style = 'cursor:pointer;height:20px;line-height:20px';
    entry.onclick = () => (panel.style.display = 'flex');
    others.appendChild(entry);
  };
  setInterval(addEntry, 1000);

  /* 事件绑定：即时存储 */
  panel.querySelectorAll('[data-key]').forEach(el => {
    if (el.tagName === 'SELECT') {
      el.onchange = e => GM_setValue(el.dataset.key, e.target.value);
    } else {
      el.onclick = () => {
        el.dataset.status = el.dataset.status === 'on' ? 'off' : 'on';
        GM_setValue(el.dataset.key, el.dataset.status === 'on');
      };
    }
  });
})();