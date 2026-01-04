// ==UserScript==
// @name         哔哩哔哩直播显示平均码率
// @namespace    bili_live_average_bitrate_display
// @version      1.1.1
// @author       Raven-tu
// @description  A userscript to display the average bitrate of Bilibili live streams.
// @license      MIT
// @icon         https://live.bilibili.com/favicon.ico
// @match        *://live.bilibili.com/*
// @connect      live.bilibili.com
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537141/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E6%98%BE%E7%A4%BA%E5%B9%B3%E5%9D%87%E7%A0%81%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/537141/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E6%98%BE%E7%A4%BA%E5%B9%B3%E5%9D%87%E7%A0%81%E7%8E%87.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
  var _currentVideoSrc, _averageBitrate, _bitrateRecord, _panel, _bitrateDisplayElement, _VideoMetricsMonitor_instances, setupUpdateVideoTemplateProxy_fn, processStreamInfo_fn, renderBitrateDisplay_fn, createBitrateDisplayElement_fn;
  const name = "bili_live_average_bitrate_display";
  const version = "1.1.1";
  const Package = {
    name,
    version
  };
  const PROJECT_NAME = Package.name;
  const PROJECT_VERSION = Package.version;
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const BITRATE_RECORD_MAX_LENGTH = 30;
  const BYTES_TO_KBPS_FACTOR = 8 / 1024;
  const VIDEO_INFO_CONTAINER_ID = "p-video-info-videoInfo";
  const VIDEO_BITRATE_DISPLAY_ID = "p-video-info-videobitrate";
  class VideoMetricsMonitor {
    /**
     * `VideoMetricsMonitor` 类的构造函数。
     * @param {VideoPanel} panel - 视频面板对象。
     * @throws {Error} 如果传入的 `panel` 对象无效。
     */
    constructor(panel) {
      __privateAdd(this, _VideoMetricsMonitor_instances);
      /** 当前正在播放的视频源 URL。 */
      __privateAdd(this, _currentVideoSrc, "");
      /** 平均码率，单位：千比特每秒 (Kbps)。 */
      __privateAdd(this, _averageBitrate, 0);
      /** 码率记录数组，存储最近的码率样本。 */
      __privateAdd(this, _bitrateRecord, []);
      /** 对 `VideoPanel` 实例的引用。 */
      __privateAdd(this, _panel);
      /** 缓存的码率显示 DOM 元素。 */
      __privateAdd(this, _bitrateDisplayElement, null);
      if (!panel || typeof panel.updateVideoTemplate !== "function") {
        throw new Error("VideoMetricsMonitor: 构造函数参数无效。传入的 panel 对象必须包含 updateVideoTemplate 方法。");
      }
      __privateSet(this, _panel, panel);
      __privateMethod(this, _VideoMetricsMonitor_instances, setupUpdateVideoTemplateProxy_fn).call(this);
      console.debug("VideoMetricsMonitor: 实例已创建并成功代理 updateVideoTemplate 方法。");
    }
    /**
     * 获取当前的平均码率。
     * @returns {number} 平均码率，单位：Kbps。
     */
    getAverageBitrate() {
      return __privateGet(this, _averageBitrate);
    }
    /**
     * 获取当前的码率记录数组的副本。
     * @returns {number[]} 码率记录数组。
     */
    getBitrateRecord() {
      return [...__privateGet(this, _bitrateRecord)];
    }
    /**
     * 获取当前监控的视频源 URL。
     * @returns {string} 视频源 URL。
     */
    getCurrentVideoSrc() {
      return __privateGet(this, _currentVideoSrc);
    }
  }
  _currentVideoSrc = new WeakMap();
  _averageBitrate = new WeakMap();
  _bitrateRecord = new WeakMap();
  _panel = new WeakMap();
  _bitrateDisplayElement = new WeakMap();
  _VideoMetricsMonitor_instances = new WeakSet();
  /** 设置 `panel.updateVideoTemplate` 的代理。 */
  setupUpdateVideoTemplateProxy_fn = function() {
    __privateGet(this, _panel).updateVideoTemplate = new Proxy(__privateGet(this, _panel).updateVideoTemplate, {
      /**
       * 拦截 `updateVideoTemplate` 方法的调用。
       * @param {Function} target - 原始的 `updateVideoTemplate` 方法。
       * @param {object} thisArg - 原始方法被调用时的 `this` 上下文。
       * @param {Array<any>} args - 传递给原始方法的参数数组。
       * @returns {any} 原始方法的返回值。
       */
      apply: (target, thisArg, args) => {
        const streamInfo = args[0];
        __privateMethod(this, _VideoMetricsMonitor_instances, processStreamInfo_fn).call(this, streamInfo);
        __privateMethod(this, _VideoMetricsMonitor_instances, renderBitrateDisplay_fn).call(this);
        return Reflect.apply(target, thisArg, args);
      }
    });
  };
  /**
   * 处理传入的视频流信息，计算当前码率并更新内部的码率记录和平均码率。
   * @param {StreamInfo} streamInfo - 包含实时视频数据的对象。
   */
  processStreamInfo_fn = function(streamInfo) {
    const { realtimeInfo, mediaInfo } = streamInfo;
    const currentBitrate = realtimeInfo.videoNetworkActivity * BYTES_TO_KBPS_FACTOR;
    const newVideoSrc = mediaInfo.videoSrc;
    if (__privateGet(this, _currentVideoSrc).length === 0 || __privateGet(this, _currentVideoSrc) !== newVideoSrc) {
      __privateSet(this, _currentVideoSrc, newVideoSrc);
      __privateSet(this, _bitrateRecord, []);
      console.debug(`VideoMetricsMonitor: 视频源已更改为: ${__privateGet(this, _currentVideoSrc)}，码率记录已重置。`);
    }
    __privateGet(this, _bitrateRecord).unshift(currentBitrate);
    if (__privateGet(this, _bitrateRecord).length > BITRATE_RECORD_MAX_LENGTH) {
      __privateGet(this, _bitrateRecord).pop();
    }
    const sumBitrate = __privateGet(this, _bitrateRecord).reduce((sum, bitrate) => sum + bitrate, 0);
    __privateSet(this, _averageBitrate, Number.parseFloat((sumBitrate / __privateGet(this, _bitrateRecord).length).toFixed(2)));
  };
  /** 在页面上创建或更新码率显示元素。 */
  renderBitrateDisplay_fn = function() {
    if (!__privateGet(this, _bitrateDisplayElement)) {
      __privateSet(this, _bitrateDisplayElement, document.getElementById(VIDEO_BITRATE_DISPLAY_ID));
      if (!__privateGet(this, _bitrateDisplayElement)) {
        __privateMethod(this, _VideoMetricsMonitor_instances, createBitrateDisplayElement_fn).call(this);
      }
    }
    if (__privateGet(this, _bitrateDisplayElement)) {
      const dataElement = __privateGet(this, _bitrateDisplayElement).querySelector(".web-player-line-data");
      if (dataElement) {
        dataElement.textContent = ` [${__privateGet(this, _bitrateRecord).length}s] ${__privateGet(this, _averageBitrate)} Kbps.`;
      } else {
        console.warn(`VideoMetricsMonitor: 码率显示元素 (ID: ${VIDEO_BITRATE_DISPLAY_ID}) 缺少 '.web-player-line-data' 子元素。`);
      }
    } else {
      console.warn(`VideoMetricsMonitor: 无法找到或创建码率显示元素 (ID: ${VIDEO_BITRATE_DISPLAY_ID})。`);
    }
  };
  /** 创建码率显示 DOM 元素并将其插入到页面中指定位置。 */
  createBitrateDisplayElement_fn = function() {
    const targetElement = document.getElementById(VIDEO_INFO_CONTAINER_ID);
    if (targetElement) {
      const newDiv = document.createElement("div");
      newDiv.id = VIDEO_BITRATE_DISPLAY_ID;
      newDiv.style.minWidth = "290px";
      newDiv.style.lineHeight = "18px";
      newDiv.style.fontSize = "12px";
      const labelDiv = document.createElement("div");
      labelDiv.style.display = "inline-block";
      labelDiv.style.whiteSpace = "nowrap";
      labelDiv.style.width = "100px";
      labelDiv.style.textAlign = "right";
      labelDiv.style.fontWeight = "500";
      labelDiv.style.marginRight = "15px";
      labelDiv.textContent = "Video Bitrate:";
      newDiv.appendChild(labelDiv);
      const dataDiv = document.createElement("div");
      dataDiv.style.display = "inline-block";
      dataDiv.style.minWidth = "58px";
      dataDiv.classList.add("web-player-line-data");
      newDiv.appendChild(dataDiv);
      targetElement.insertAdjacentElement("afterend", newDiv);
      __privateSet(this, _bitrateDisplayElement, newDiv);
      console.debug(`VideoMetricsMonitor: 码率显示元素 (ID: ${VIDEO_BITRATE_DISPLAY_ID}) 已成功创建并插入。`);
    } else {
      console.warn(`VideoMetricsMonitor: 未找到 id 为 "${VIDEO_INFO_CONTAINER_ID}" 的目标元素，无法创建码率显示 div。`);
    }
  };
  function initializeScriptHook() {
    console.log(`${PROJECT_NAME} ${PROJECT_VERSION} - 脚本已加载，正在尝试捕获 VideoPanel 实例...`);
    const originalWeakMapSet = WeakMap.prototype.set;
    let isHookActive = true;
    const isVideoPanelCandidate = (obj) => {
      return obj && typeof obj === "object" && typeof obj.updateVideoTemplate === "function" && typeof obj.createTemplateProxy === "function";
    };
    WeakMap.prototype.set = new Proxy(originalWeakMapSet, {
      /**
       * 拦截 `WeakMap.prototype.set` 的调用。
       * @param {Function} target - 原始的 `WeakMap.prototype.set` 方法。
       * @param {WeakMap} thisArg - 调用 `set` 方法的 `WeakMap` 实例。
       * @param {Array<any>} args - 传递给 `set` 方法的参数 `[key, value]`。
       * @returns {any} 原始 `set` 方法的返回值。
       */
      apply(target, thisArg, args) {
        if (isHookActive) {
          const [key, value] = args;
          let panelObject = null;
          if (isVideoPanelCandidate(key)) {
            panelObject = key;
          } else if (isVideoPanelCandidate(value)) {
            panelObject = value;
          }
          if (panelObject) {
            isHookActive = false;
            console.debug("Hook: 成功捕获到 VideoPanel 实例。");
            try {
              _unsafeWindow.debugVideoMetrics = new VideoMetricsMonitor(panelObject);
              console.debug("Hook: VideoMetricsMonitor 初始化成功，可通过 unsafeWindow.debugVideoMetrics 访问调试信息。");
            } catch (e) {
              console.error("Hook: VideoMetricsMonitor 初始化失败:", e);
            }
          }
        }
        return Reflect.apply(target, thisArg, args);
      }
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeScriptHook);
  } else {
    initializeScriptHook();
  }

})();