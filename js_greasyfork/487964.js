// ==UserScript==
// @name         B站录播同步视听
// @namespace    simultaneous-hearing-and-sight
// @version      0.0.3
// @author       icinggslits
// @description  在B站视频内外挂本地视频，主要用于看录播时和主播同步看B站直播不能放出画面的视频
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @match        *://www.bilibili.com/video/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/487964/B%E7%AB%99%E5%BD%95%E6%92%AD%E5%90%8C%E6%AD%A5%E8%A7%86%E5%90%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/487964/B%E7%AB%99%E5%BD%95%E6%92%AD%E5%90%8C%E6%AD%A5%E8%A7%86%E5%90%AC.meta.js
// ==/UserScript==

/*
* 该脚本由Vite构建，源码见 https://github.com/icinggslits/simultaneous-hearing-and-sight
*/

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const n=document.createElement("style");n.textContent=e,document.head.append(n)})(" :root{--measuringBlockResizeSize: 15px }.__sign_SHAS_panel{position:absolute;display:flex;flex-direction:column;background-color:#fff;box-shadow:0 1px 1px #0000000f,0 2px 4px #0000000f,0 4px 4px #0000000f,0 8px 8px #0000000f,0 16px 16px #0000000f,0 -4px 16px #00000012;z-index:100000}.__sign_SHAS_panel.hide{display:none}.__sign_SHAS_panel .top,.__sign_SHAS_panel .bottom{display:flex;width:100%;flex-basis:24px;background-color:#dcdcdc}.__sign_SHAS_panel .top .left{position:relative;display:flex;flex-grow:1}.__sign_SHAS_panel .top .left .back{flex-basis:24px;position:relative;cursor:pointer;display:none}.__sign_SHAS_panel .top .left .back .back_line_1{position:absolute;width:35%;height:1px;background-color:gray;left:7px;top:15px;transform:rotate(45deg)}.__sign_SHAS_panel .top .left .back .back_line_2{position:absolute;width:35%;height:1px;background-color:gray;left:7px;top:9px;transform:rotate(135deg)}.__sign_SHAS_panel .top .right{position:relative;flex-basis:24px;cursor:pointer}.__sign_SHAS_panel .top .right .close_line_1{position:absolute;width:65%;height:1px;background-color:gray;left:3px;top:11px;transform:rotate(45deg)}.__sign_SHAS_panel .top .right .close_line_2{position:absolute;width:65%;height:1px;background-color:gray;left:3px;top:11px;transform:rotate(-45deg)}.__sign_SHAS_panel .main{width:100%;flex-grow:1;flex-direction:column;flex-basis:100%;overflow:auto}.__sign_SHAS_panel .main .listPage .create_new_line{margin-top:4px}.__sign_SHAS_panel .main .listPage .create_new_line .create_new_line_button{font-size:20px;cursor:pointer;margin-left:22px;margin-top:8px;transition:background-color .3s;padding:0 4px;border-radius:4px}.__sign_SHAS_panel .main .listPage .create_new_line .create_new_line_button:hover{background-color:#dcdcdc}.__sign_SHAS_panel .main .listPage .content{display:flex;flex-direction:column;margin-top:10px;-webkit-user-select:none;user-select:none}.__sign_SHAS_panel .main .page.hide{display:none}.__sign_SHAS_panel .main .content .content_line,.__sign_SHAS_panel .main .content .content_column_line{display:flex;padding:10px 10px 0 20px}.__sign_SHAS_panel .main .content .content_line>div,.__sign_SHAS_panel .main .content .content_column_line>div{display:flex;justify-content:center;font-size:16px}.__sign_SHAS_panel .main .content .content_line .content_line_name{position:relative;cursor:pointer;padding-right:6px}.__sign_SHAS_panel .main .content .content_line .content_line_videoEdit{color:#dcdcdc;transition:color .3s}.__sign_SHAS_panel .main .content .content_line .content_line_videoEdit.editable{cursor:pointer;color:#000}.__sign_SHAS_panel .main .content .content_line .content_line_videoEdit.editable:hover{color:#00bfff}.__sign_SHAS_panel .main .content .content_line .content_line_name,.__sign_SHAS_panel .main .content .content_column_line .content_column_name{flex-basis:40%}.__sign_SHAS_panel .main .content .content_line .content_line_videoInput{flex-basis:60%;display:block;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;cursor:pointer;transition:all .3s;text-align:center}.__sign_SHAS_panel .main .content .content_column_line .content_column_videoInput{flex-basis:60%}.__sign_SHAS_panel .main .content .content_line .content_line_videoInput:hover{color:#00bfff}.__sign_SHAS_panel .main .content .content_line .content_line_videoEdit,.__sign_SHAS_panel .main .content .content_line .content_line_volume,.__sign_SHAS_panel .main .content .content_column_line .content_column_edit,.__sign_SHAS_panel .main .content .content_column_line .content_column_volume{flex-basis:80px}.__sign_SHAS_panel .main .content .content_column_line .content_column_delete,.__sign_SHAS_panel .main .content .content_line .content_line_delete{flex-basis:36px}.__sign_SHAS_panel .main .content .content_line .content_line_delete{transition:all .3s;cursor:pointer;text-align:center;border-radius:12px}.__sign_SHAS_panel .main .content .content_line .content_line_delete:hover{background-color:#dcdcdc}.__sign_SHAS_panel .user_input,.__sign_SHAS_panel .user_input:focus{position:absolute;left:0;top:-1px;width:100%;height:100%;font-size:16px;display:block;outline:0;border:0;text-align:center}.__sign_SHAS_panel .main .editPage{display:block;flex-direction:column}.__sign_SHAS_panel .main .editPage .editPage_title{padding:10px 0;font-size:18px;text-align:center}.__sign_SHAS_panel .main .editPage .editPage_column{display:flex;padding:4px 0}.__sign_SHAS_panel .main .editPage .editPage_column .editPage_column_descriptions{text-align:center;justify-content:center;flex-basis:50%;font-size:16px}.__sign_SHAS_panel .main .editPage .editPage_column .editPage_column_occupy{padding:0 6px;flex-basis:20px;margin-right:30px}.__sign_SHAS_panel .main .editPage .content{padding:10px 0}.__sign_SHAS_panel .main .editPage .editPage_tool{display:flex;padding:0 4px;height:24px}.__sign_SHAS_panel .main .editPage .editPage_newPoint{display:inline;padding:0 4px;margin:0 10px;cursor:pointer;transition:all .3s;border-radius:4px;line-height:24px}.__sign_SHAS_panel .main .editPage .editPage_newPoint:hover{background-color:#dcdcdc}.__sign_SHAS_panel .main .editPage .editPage_export{position:relative;top:1px;font-size:14px;color:gray;cursor:pointer;transition:all .3s;padding:0 4px}.__sign_SHAS_panel .main .editPage .editPage_export:hover{color:#87ceeb}.__sign_SHAS_panel .main .editPage .editPage_export:active{outline:gainsboro 1px solid}.__sign_SHAS_panel .main .editPage .editPage_bottom{position:absolute;bottom:0;left:0;width:100%;height:24px;display:flex}.__sign_SHAS_panel .main .editPage .editPage_bottom .editPage_bottom_externalVideoTime{text-align:center;flex-basis:120px;font-size:12px;color:gray;line-height:24px}.__sign_SHAS_measuringBlock{position:absolute;cursor:grab;display:flex;opacity:0;pointer-events:none;transition:opacity .3s}.__sign_SHAS_measuringBlock.edit{pointer-events:all}.__sign_SHAS_measuringBlock.edit video{outline:gainsboro 1px solid;opacity:.5}.__sign_SHAS_measuringBlock.show,.__sign_SHAS_measuringBlock.alwaysShow{opacity:1;z-index:1}.__sign_SHAS_measuringBlock.alwaysShow{z-index:2}.__sign_SHAS_measuringBlock video{position:absolute;width:100%;height:100%;pointer-events:none;outline:transparent 1px solid;transition:opacity .3s,outline-color .3s}.__sign_SHAS_measuringBlock.edit .__sign_SHAS_measuringBlock_resize{background-color:#0000001a;position:absolute;right:0;bottom:0;cursor:nwse-resize;border-top:gainsboro 1px solid;border-left:gainsboro 1px solid;width:var(--measuringBlockResizeSize);height:var(--measuringBlockResizeSize)}.__sign_SHAS_videoArea{position:absolute;pointer-events:none}.__sign_SHAS_timestampEditor{width:200px;display:flex;flex-grow:1;flex-basis:80px;margin-left:10px}.__sign_SHAS_timestampEditor_hours,.__sign_SHAS_timestampEditor_minutes,.__sign_SHAS_timestampEditor_seconds,.__sign_SHAS_timestampEditor_milliseconds{position:relative;flex-grow:1;font-size:16px;text-align:center}.__sign_SHAS_referencePointLine{display:flex}.__sign_SHAS_referencePointLine_timestampEditorOfExternalVideo,.__sign_SHAS_referencePointLine_timestampEditorOfOriginalVideo{justify-content:center;flex-basis:50%}.__sign_SHAS_referencePointLine_delete{text-align:center;padding:0 2px;flex-basis:20px;margin-right:30px;cursor:pointer;transition:all .3s;border-radius:6px;line-height:24px}.__sign_SHAS_referencePointLine_delete:hover{background-color:#dcdcdc}.bpx-player-video-area video.ban{pointer-events:none}.__sign_SHAS_replyListImport{cursor:pointer;text-decoration:underline;transition:color .3s}.__sign_SHAS_replyListImport:hover{color:gray}.__sign_SHAS_replyListImport:active{transition:color 0s;color:#8b0000} ");

(function () {
  'use strict';

  var __accessCheck = (obj, member, msg) => {
    if (!member.has(obj))
      throw TypeError("Cannot " + msg);
  };
  var __privateGet = (obj, member, getter) => {
    __accessCheck(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
  };
  var __privateAdd = (obj, member, value) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  };
  var __privateSet = (obj, member, value, setter) => {
    __accessCheck(obj, member, "write to private field");
    setter ? setter.call(obj, value) : member.set(obj, value);
    return value;
  };
  var __privateMethod = (obj, member, method) => {
    __accessCheck(obj, member, "access private method");
    return method;
  };
  var _intervals, _cb, _timeoutID, _inProgress, _execute, execute_fn;
  const Config = {
    // 面板开关按键
    code: "KeyP",
    // 是否需要按住Ctrl
    ctrlKey: false,
    // 是否需要按住Alt
    altKey: false,
    // 是否需要按住Shift
    shiftKey: true,
    // 测量方块边长
    measuringBlockResizeSize: 15,
    // 默认音量
    defaultVolume: 40
  };
  const Convert = {
    /**
     * 转换为数字
     * @param value {any}
     * @param unable {number}
     * @return {number}
     */
    toNumber(value, unable = 0) {
      let result = unable;
      switch (true) {
        case typeof value === "string":
          (() => {
            result = Number(value.replace(/[^\d.-]/ig, ""));
          })();
          break;
        case typeof value === "number":
          (() => {
            result = value;
          })();
          break;
      }
      if (isFinite(result)) {
        return result;
      } else {
        return unable;
      }
    },
    /**
     * 是否是数字
     *
     * 字符串'25' - true
     *
     * @param value {any}
     * @return {boolean}
     */
    isNumber(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
    },
    /**
     * 过滤虚值返回规定的值
     * @param value
     * @param unreal
     * @return {*|null}
     */
    toReal(value, unreal = null) {
      if (!Convert.isReal(value)) {
        return unreal;
      } else {
        return value;
      }
    },
    /**
     * 是否是实在的值
     * @param value {any}
     * @return {boolean}
     */
    isReal(value) {
      return !(value === void 0 || value === null || Number.isNaN(value));
    },
    /**
     * 转为Array
     * @template T
     * @param value {T}
     * @param arrayInArray {boolean} 是否包含数组
     * @return {T[]}
     */
    toList(value, arrayInArray = false) {
      if (Array.isArray(value) && Array.isArray(value[0]) === arrayInArray) {
        return value;
      } else {
        return [value];
      }
    },
    /**
     * 限制number在lower<=number<=upper之间，返回这个数
     * @param number {number}
     * @param lower {number}
     * @param upper {number}
     * @return {number}
     */
    limits(number, lower, upper) {
      return this.lowerLimit(this.upperLimit(number, upper), lower);
    },
    /**
     * 限制number在number<=upper之间，返回这个数
     * @param number
     * @param upper
     * @return {number}
     */
    upperLimit(number, upper) {
      if (number > upper) {
        return upper;
      } else {
        return number;
      }
    },
    /**
     * 限制number在lower<=number之间，返回这个数
     * @param number
     * @param lower
     * @return {number}
     */
    lowerLimit(number, lower) {
      if (number < lower) {
        return lower;
      } else {
        return number;
      }
    },
    /**
     * 是否是Error
     * @param object
     * @return {boolean}
     */
    isError(object) {
      return Error.prototype.isPrototypeOf(object);
    }
  };
  const Range = document.createRange();
  const createNode = (fragment) => {
    const contextualFragment = Range.createContextualFragment(fragment.trim());
    return contextualFragment.childNodes[0];
  };
  const mouseDrag = (() => {
    let press = false;
    let isTarget = false;
    let targetCb;
    let original_x = 0;
    let original_y = 0;
    let onceData;
    const targetDomList = [];
    document.addEventListener("pointerdown", (event) => {
      const { x, y } = event;
      press = true;
      original_x = x;
      original_y = y;
      for (const [el, cb, onceCb] of targetDomList) {
        if (document.elementFromPoint(x, y) === el) {
          isTarget = true;
          targetCb = cb;
          onceData = onceCb == null ? void 0 : onceCb();
          event.preventDefault();
          break;
        }
      }
    });
    document.addEventListener("pointerup", (event) => {
      press = false;
      isTarget = false;
    });
    document.addEventListener("pointermove", (event) => {
      if (press && isTarget) {
        const { x, y } = event;
        targetCb({
          original_x,
          original_y,
          x,
          y,
          diff_x: x - original_x,
          diff_y: y - original_y,
          onceData
        });
      }
    });
    return (el, cb, onceCb) => {
      targetDomList.push([el, cb, onceCb]);
    };
  })();
  const barDrag = /* @__PURE__ */ (() => {
    return (bar, body, limitNode = null) => {
      let original_left = 0;
      let original_top = 0;
      document.addEventListener("pointerdown", (event) => {
        const { x, y } = event;
        if (document.elementFromPoint(x, y) === bar) {
          original_left = Convert.toNumber(body.style.left);
          original_top = Convert.toNumber(body.style.top);
        }
      });
      mouseDrag(bar, (dragInfo) => {
        const { diff_x, diff_y } = dragInfo;
        body.style.left = `${original_left + diff_x}px`;
        body.style.top = `${original_top + diff_y}px`;
      });
    };
  })();
  const userSelectFile = (suffix) => {
    return new Promise((resolve, reject) => {
      const inputFileNode = createNode(`<input type="file" accept="${suffix}" />`);
      inputFileNode.addEventListener("change", () => {
        resolve(inputFileNode.files[0]);
        inputFileNode.remove();
      });
      inputFileNode.click();
    });
  };
  const parseTime = {
    /**
     *
     * @param {number} seconds
     * @return {{milliseconds: number, hours: number, seconds: number, minutes: number}}
     */
    secondsToTime(seconds) {
      const milliseconds = Math.floor(seconds * 1e3);
      const date = new Date(milliseconds);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const remainderSeconds = date.getUTCSeconds();
      const remainderMilliseconds = date.getUTCMilliseconds();
      return {
        hours,
        minutes,
        seconds: remainderSeconds,
        milliseconds: remainderMilliseconds
      };
    }
  };
  class Trigger {
    /**
     *
     * @param {function} cb
     * @param {number} intervals
     */
    constructor(cb, intervals) {
      __privateAdd(this, _execute);
      __privateAdd(this, _intervals, 10);
      /** @type function */
      __privateAdd(this, _cb, void 0);
      __privateAdd(this, _timeoutID, void 0);
      __privateAdd(this, _inProgress, false);
      __privateSet(this, _intervals, intervals);
      __privateSet(this, _cb, cb);
    }
    stop() {
      if (__privateGet(this, _inProgress)) {
        __privateSet(this, _inProgress, false);
        clearTimeout(__privateGet(this, _timeoutID));
      }
    }
    start() {
      if (!__privateGet(this, _inProgress)) {
        __privateSet(this, _inProgress, true);
        __privateGet(this, _cb).call(this);
        __privateMethod(this, _execute, execute_fn).call(this);
      }
    }
  }
  _intervals = new WeakMap();
  _cb = new WeakMap();
  _timeoutID = new WeakMap();
  _inProgress = new WeakMap();
  _execute = new WeakSet();
  execute_fn = function() {
    __privateSet(this, _timeoutID, setTimeout(() => {
      __privateGet(this, _cb).call(this);
      __privateMethod(this, _execute, execute_fn).call(this);
    }, __privateGet(this, _intervals)));
  };
  const triggerBuilder = (cb, intervals = 100) => new Trigger(cb, intervals);
  const findInsertIndex = (numberList, x) => {
    let low = 0;
    let high = numberList.length - 1;
    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      if (numberList[mid] === x) {
        return mid;
      } else if (numberList[mid] < x) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return low;
  };
  const debounceExecuteBuilder = (fn, milliseconds = 300) => {
    const timeoutIDAttr = Symbol();
    const debounceFn = () => {
      clearTimeout(debounceFn[timeoutIDAttr]);
      debounceFn[timeoutIDAttr] = setTimeout(() => fn(), milliseconds);
    };
    debounceFn[timeoutIDAttr] = -1;
    return debounceFn;
  };
  const triggerSource = {
    PLAY: Symbol("play"),
    PAUSE: Symbol("pause"),
    SEEKING: Symbol("seeking"),
    TRIGGER: Symbol("trigger")
  };
  const videoProportions = () => {
    const bilibiliPlayerVideo2 = document.querySelector(".bpx-player-video-area video");
    if (bilibiliPlayerVideo2) {
      return {
        videoWidth: bilibiliPlayerVideo2.videoWidth,
        videoHeight: bilibiliPlayerVideo2.videoHeight
      };
    } else {
      return {
        videoWidth: 1920,
        videoHeight: 1080
      };
    }
  };
  const { area, videoArea } = (() => {
    const area2 = document.querySelector(".bpx-player-video-area");
    const videoArea2 = createNode(`<div class="__sign_SHAS_videoArea"></div>`);
    area2.appendChild(videoArea2);
    const { width, height } = area2.getBoundingClientRect();
    area2.dataset.lastWidth = width.toString();
    area2.dataset.lastHeight = height.toString();
    return { area: area2, videoArea: videoArea2 };
  })();
  const updateArea = () => {
    const { width: areaWidth, height: areaHeight } = area.getBoundingClientRect();
    const { videoWidth, videoHeight } = videoProportions();
    const { width, height } = area.getBoundingClientRect();
    if (videoHeight * (areaWidth / areaHeight) >= videoWidth) {
      const videoAreaWidth = areaHeight * (videoWidth / videoHeight);
      videoArea.style.left = `${(areaWidth - videoAreaWidth) / 2}px`;
      videoArea.style.top = `0`;
      videoArea.style.width = `${videoAreaWidth}px`;
      videoArea.style.height = "100%";
    } else {
      const videoAreaHeight = areaWidth * (videoHeight / videoWidth);
      videoArea.style.top = `${(areaHeight - videoAreaHeight) / 2}px`;
      videoArea.style.left = `0`;
      videoArea.style.width = "100%";
      videoArea.style.height = `${videoAreaHeight}px`;
    }
    area.dataset.lastWidth = width.toString();
    area.dataset.lastHeight = height.toString();
  };
  {
    const ob = new ResizeObserver(() => {
      updateArea();
    });
    ob.observe(area);
  }
  const bilibiliPlayerVideo = document.querySelector(".bpx-player-video-area video");
  const syncVideo = (source) => {
    const currentTime = bilibiliPlayerVideo.currentTime;
    const awaitingPlaybackList = [];
    const videoRange = externalVideoHub$1.allVideoRange();
    for (const { targetMeasuringBlock, keyframeList: keyframeList2 } of videoRange) {
      let latestStartTime = null;
      let targetOriginalTime = 0;
      let targetExternalVideoTime = 0;
      const maxEndTime = (() => {
        let max = Number.MIN_VALUE;
        keyframeList2.forEach(({ endTime }) => endTime > max ? max = endTime : null);
        return max;
      })();
      for (const keyframe of keyframeList2) {
        const { startTime, endTime, originalTime, externalVideoTime } = keyframe;
        if (currentTime >= originalTime && currentTime < maxEndTime) {
          if (latestStartTime === null) {
            latestStartTime = originalTime;
            targetOriginalTime = originalTime;
            targetExternalVideoTime = externalVideoTime;
          } else {
            if (latestStartTime < originalTime) {
              latestStartTime = originalTime;
              targetOriginalTime = originalTime;
              targetExternalVideoTime = externalVideoTime;
            }
          }
        }
      }
      if (latestStartTime !== null) {
        awaitingPlaybackList.push({
          measuringBlock: targetMeasuringBlock,
          currentTime: targetExternalVideoTime + currentTime - targetOriginalTime
        });
      }
    }
    that:
      for (const oneOfMeasuringBlock of externalVideoHub$1.allMeasuringBlock()) {
        for (const { measuringBlock, currentTime: currentTime2 } of awaitingPlaybackList) {
          if (oneOfMeasuringBlock === measuringBlock) {
            MeasuringBlock$1.show(measuringBlock);
            MeasuringBlock$1.videoSetCurrentTime(measuringBlock, currentTime2);
            switch (source) {
              case triggerSource.PAUSE:
                {
                  MeasuringBlock$1.videoPause(measuringBlock);
                }
                break;
              case triggerSource.PLAY:
                {
                  MeasuringBlock$1.videoPlay(measuringBlock);
                }
                break;
              case triggerSource.SEEKING:
                {
                  MeasuringBlock$1.videoPause(measuringBlock);
                  bilibiliPlayerVideo.addEventListener("canplay", () => {
                    MeasuringBlock$1.videoPlay(measuringBlock);
                  }, { once: true });
                }
                break;
              case triggerSource.TRIGGER:
                {
                  MeasuringBlock$1.videoPlay(measuringBlock);
                }
                break;
            }
            continue that;
          }
        }
        MeasuringBlock$1.videoPause(oneOfMeasuringBlock);
        MeasuringBlock$1.hide(oneOfMeasuringBlock);
      }
  };
  let keyframeList = [];
  let nextKeyframeIndex = 0;
  const triggerCallback = [];
  const trigger = triggerBuilder(() => {
    const currentTime = bilibiliPlayerVideo.currentTime;
    const nextKeyframe = keyframeList[nextKeyframeIndex];
    if (currentTime >= nextKeyframe) {
      syncVideo(triggerSource.TRIGGER);
      nextKeyframeIndex++;
    }
    triggerCallback.forEach((cb) => cb());
  });
  const videoTrigger = (callback) => {
    triggerCallback.push(callback);
  };
  const resetTriggerPointer = () => {
    const referencePointList = externalVideoHub$1.allReferencePoint();
    const currentTime = bilibiliPlayerVideo.currentTime;
    {
      keyframeList = [];
      for (const { originalTime, measuringBlock, externalVideoTime } of referencePointList) {
        keyframeList.push(originalTime);
      }
      nextKeyframeIndex = findInsertIndex(keyframeList, currentTime);
    }
  };
  bilibiliPlayerVideo.addEventListener("play", () => {
    resetTriggerPointer();
    syncVideo(triggerSource.PLAY);
    trigger.start();
  });
  bilibiliPlayerVideo.addEventListener("pause", () => {
    resetTriggerPointer();
    syncVideo(triggerSource.PAUSE);
    trigger.stop();
  });
  bilibiliPlayerVideo.addEventListener("seeking", () => {
    resetTriggerPointer();
    syncVideo(triggerSource.SEEKING);
  });
  bilibiliPlayerVideo.addEventListener("ratechange", (event) => {
    MeasuringBlock$1.setAllVideoPlaybackRate(bilibiliPlayerVideo.playbackRate);
  });
  let lastVideoPaused = false;
  let isBan = false;
  const bilibiliPlayerVideoController = {
    // 暂停b站视频并禁用交互
    pauseAndBan() {
      isBan = true;
      lastVideoPaused = bilibiliPlayerVideo.paused;
      bilibiliPlayerVideo.pause();
      bilibiliPlayerVideo.classList.add("ban");
    },
    // 解除禁用
    relieve() {
      if (isBan) {
        isBan = false;
        bilibiliPlayerVideo.classList.remove("ban");
        if (lastVideoPaused) {
          bilibiliPlayerVideo.pause();
        } else {
          bilibiliPlayerVideo.play().then();
        }
      }
    },
    syncVideo() {
      resetTriggerPointer();
      syncVideo();
    },
    /**
     *
     * @param {function} callback
     */
    videoTrigger(callback) {
      videoTrigger(callback);
    }
  };
  const regularExpression = {
    // 原本打算使用方括号，但是b站评论会自动把半角方括号变全角方括号（[] -> 【】），所以换成了半角花括号
    // // 匹配主体的正则
    // patternMain: /(\[1v(.*?)])|(\{1v(.*?)})/g,
    //
    // // 匹配描述的正则
    // patternDescription: /(\[(.*?)]$)|(\{(.*?)}$)/,
    //
    // // 匹配包含可能存在的描述的正则
    // patternCompletely: /((\[(.*?)])?\[1v(.*?)])|((\{(.*?)})?\[1v(.*?)})/g,
    // 匹配主体的正则
    patternMain: /\{1v(.*?)}/g,
    // 匹配描述的正则
    patternDescription: /\{(.*?)}$/,
    // 匹配包含可能存在的描述的正则
    patternCompletely: /(\{(.*?)})?\{1v(.*?)}/g
  };
  const searchDeserializingData = (text) => {
    const list = [];
    const patternMain = regularExpression.patternMain;
    const patternDescription = regularExpression.patternDescription;
    let lastSliceIndex = 0;
    for (const regExpMatchArray of text.matchAll(patternMain)) {
      const frontText = regExpMatchArray.input.slice(lastSliceIndex, regExpMatchArray.index);
      const deserializingData = regExpMatchArray[1];
      lastSliceIndex = regExpMatchArray.index + regExpMatchArray[0].length;
      let description = null;
      const descriptionMatch = frontText.match(patternDescription);
      if (descriptionMatch) {
        description = descriptionMatch[1];
      }
      list.push({
        description,
        deserializingData
      });
    }
    return list;
  };
  const contentLineMappingConfig = /* @__PURE__ */ new Map();
  const contentLineMappingMeasuringBlock = /* @__PURE__ */ new Map();
  let referencePointOfCache = [];
  const contentLineMappingFile = /* @__PURE__ */ new Map();
  const serializeV1 = (contentLine) => {
    const { referencePointList } = contentLineMappingConfig.get(contentLine);
    const measuringBlock = contentLineMappingMeasuringBlock.get(contentLine);
    const list = [];
    for (const { originalTime, externalVideoTime } of referencePointList) {
      list.push(`${originalTime}>${externalVideoTime}`);
    }
    const listString = (() => {
      if (list.length === 0) {
        return "null";
      } else {
        return list.join(",");
      }
    })();
    return `{${ListContentLine.getName(contentLine)}}{1v${MeasuringBlock$1.serialize(measuringBlock)};${listString}}`;
  };
  const targetReferencePoint = (referencePointLine) => {
    const { panelNode: panel2, editingContentLine: editingContentLine2 } = Panel;
    const referencePointLineList = panel2.querySelectorAll(".__sign_SHAS_referencePointLine");
    for (let i = 0; i < referencePointLineList.length; i++) {
      const referencePointLineElement = referencePointLineList[i];
      if (referencePointLineElement === referencePointLine) {
        const externalVideo1 = contentLineMappingConfig.get(editingContentLine2);
        if (externalVideo1) {
          const { versions, referencePointList } = externalVideo1;
          return [referencePointList[i], i];
        }
        return null;
      }
    }
    return null;
  };
  const updateReferencePointOfCache = () => {
    referencePointOfCache = [];
    const panel2 = Panel.panelNode;
    const contentLineList = panel2.querySelectorAll(".content_line");
    let i = 0;
    for (const { versions, referencePointList } of contentLineMappingConfig.values()) {
      for (const { originalTime, externalVideoTime } of referencePointList) {
        referencePointOfCache.push({
          originalTime,
          externalVideoTime,
          measuringBlock: contentLineMappingMeasuringBlock.get(contentLineList[i])
        });
      }
      i++;
    }
    referencePointOfCache.sort(({ originalTime: a }, { originalTime: b }) => a - b);
  };
  const externalVideoHub = {
    addByContentLine(contentLine, measuringBlock) {
      contentLineMappingConfig.set(contentLine, {
        versions: "1",
        referencePointList: []
      });
      contentLineMappingMeasuringBlock.set(contentLine, measuringBlock);
      updateReferencePointOfCache();
    },
    /**
     *
     * @param contentLine
     * @return {?any}
     */
    getMeasuringBlock(contentLine) {
      return contentLineMappingMeasuringBlock.get(contentLine);
    },
    /**
     *
     * @param contentLine
     * @param {referencePoint} referencePoint
     * @return {boolean}
     */
    addReferencePoint(contentLine, referencePoint) {
      const referencePointList = contentLineMappingConfig.get(contentLine);
      if (referencePointList) {
        referencePointList.referencePointList.push(referencePoint);
        updateReferencePointOfCache();
        return true;
      }
      return false;
    },
    /**
     *
     * @param contentLine
     * @return {externalVideo1}
     */
    getReferencePointAll(contentLine) {
      return contentLineMappingConfig.get(contentLine);
    },
    setOriginalTimeOfReferencePoint(referencePointLine, seconds) {
      const ok = targetReferencePoint(referencePointLine);
      if (ok) {
        const [referencePoint] = ok;
        referencePoint.originalTime = seconds;
        updateReferencePointOfCache();
      }
    },
    setExternalVideoTimeBySeconds(referencePointLine, seconds) {
      const ok = targetReferencePoint(referencePointLine);
      if (ok) {
        const [referencePoint] = ok;
        referencePoint.externalVideoTime = seconds;
        updateReferencePointOfCache();
      }
    },
    deleteReferencePoint(referencePointLine) {
      const ok = targetReferencePoint(referencePointLine);
      if (ok) {
        const [referencePoint, i] = ok;
        const { versions, referencePointList } = contentLineMappingConfig.get(Panel.editingContentLine);
        referencePointList.splice(i, 1);
      }
    },
    /**
     *
     * @param contentLine
     * @param {File} file
     */
    setFile(contentLine, file) {
      contentLineMappingFile.set(contentLine, file);
    },
    /**
     *
     * @param contentLine
     * @return {?File}
     */
    getFile(contentLine) {
      return contentLineMappingFile.get(contentLine);
    },
    /**
     * 返回全部的referencePoint数组，根据originalTime按从小到大排序
     * @return {{originalTime: number, externalVideoTime: number, measuringBlock}[]}
     */
    allReferencePoint() {
      return referencePointOfCache;
    },
    /**
     *
     * @return {any[]}
     */
    allMeasuringBlock() {
      return [...contentLineMappingMeasuringBlock.values()];
    },
    /**
     *
     * @return {any[]}
     */
    allContentLine() {
      return [...contentLineMappingMeasuringBlock.keys()];
    },
    /**
     *
     * @return {{targetMeasuringBlock, keyframeList: {startTime: number, endTime: number, originalTime: number, externalVideoTime: number}[]}[]}
     */
    allVideoRange() {
      const videoRange = [];
      for (const [contentLine, measuringBlock] of contentLineMappingMeasuringBlock) {
        const { versions, referencePointList } = contentLineMappingConfig.get(contentLine);
        const measuringBlock2 = contentLineMappingMeasuringBlock.get(contentLine);
        const { currentTime, duration } = MeasuringBlock$1.getVideoInfo(measuringBlock2);
        const keyframeList2 = [];
        if (referencePointList.length > 0) {
          for (const { externalVideoTime, originalTime } of referencePointList) {
            const startTime = originalTime - externalVideoTime;
            const endTime = startTime + duration;
            keyframeList2.push({
              startTime,
              endTime,
              originalTime,
              externalVideoTime
            });
          }
        }
        videoRange.push({
          targetMeasuringBlock: measuringBlock2,
          keyframeList: keyframeList2
        });
      }
      videoRange.sort(({ startTime: a }, { startTime: b }) => a - b);
      return videoRange;
    },
    deleteContentLine(contentLine) {
      contentLineMappingConfig.delete(contentLine);
      contentLineMappingMeasuringBlock.delete(contentLine);
      contentLineMappingFile.delete(contentLine);
    },
    /**
     *
     * @param contentLine
     * @return {?string}
     */
    serialize(contentLine) {
      const { versions, referencePointList } = contentLineMappingConfig.get(contentLine);
      contentLineMappingMeasuringBlock.get(contentLine);
      return (() => {
        switch (versions) {
          case "1": {
            return serializeV1(contentLine);
          }
        }
        return null;
      })();
    },
    deserializeTo(contentLine) {
    }
  };
  const externalVideoHub$1 = externalVideoHub;
  const videoAttr = Symbol();
  const targetNodeAttr = Symbol();
  const importedCreateAttr = Symbol("Marked as imported to create");
  const measuringBlockMappingResize = /* @__PURE__ */ new Map();
  const measuringBlockMappingPosition = /* @__PURE__ */ new Map();
  const updateVideoRatios = (measuringBlock) => {
    const video = measuringBlock.querySelector("video");
    measuringBlock.dataset.videoWidth = video.videoWidth;
    measuringBlock.dataset.videoHeight = video.videoHeight;
    updateArea();
  };
  const MeasuringBlock = {
    /**
     * 是否是MeasuringBlock对象
     * @param measuringBlock
     * @return {boolean}
     */
    is(measuringBlock) {
      var _a;
      return !!((_a = measuringBlock == null ? void 0 : measuringBlock.classList) == null ? void 0 : _a.contains(".__sign_SHAS_measuringBlock"));
    },
    /**
     *
     * @param targetNode - 插入到targetNode
     */
    create(targetNode) {
      const measuringBlock = createNode(`
			<div class="__sign_SHAS_measuringBlock">
				<video></video>
				<div class="__sign_SHAS_measuringBlock_resize"></div>
			</div>
		`);
      measuringBlock.style.width = "300px";
      measuringBlock.style.height = "200px";
      measuringBlock.style.top = "0";
      measuringBlock.style.left = "0";
      const video = measuringBlock.querySelector("video");
      measuringBlock[videoAttr] = video;
      measuringBlock[targetNodeAttr] = targetNode;
      video.addEventListener("loadedmetadata", () => {
        MeasuringBlock.setVideoRatios(measuringBlock, video.videoWidth, video.videoHeight);
        if (measuringBlock[importedCreateAttr] !== true) {
          MeasuringBlock.setPositionByRatio(measuringBlock, [0, 1], [0, 1]);
        }
      });
      video.addEventListener("ended", () => {
        MeasuringBlock.hide(measuringBlock);
      });
      const resizeBlock = measuringBlock.querySelector(".__sign_SHAS_measuringBlock_resize");
      mouseDrag(resizeBlock, ({ diff_x, diff_y, onceData: { width, height } }) => {
        const { left: measuringBlockLeft, top: measuringBlockTop } = measuringBlock.getBoundingClientRect();
        const {
          right: targetNodeRight,
          bottom: targetNodeBottom,
          width: targetNodeWidth,
          height: targetNodeHeight
        } = targetNode.getBoundingClientRect();
        const maxResizeWidth = targetNodeRight - measuringBlockLeft;
        const maxResizeHeight = targetNodeBottom - measuringBlockTop;
        const resizeWidth = Convert.limits(
          width + diff_x,
          Config.measuringBlockResizeSize,
          maxResizeWidth
        );
        if (Convert.isNumber(measuringBlock.dataset.videoWidth)) {
          const aspectRatio = Convert.toNumber(measuringBlock.dataset.videoHeight) / Convert.toNumber(measuringBlock.dataset.videoWidth);
          const resizeHeight = Convert.limits(
            height + diff_x * aspectRatio,
            Config.measuringBlockResizeSize,
            maxResizeHeight
          );
          if (resizeHeight !== maxResizeHeight && resizeWidth !== maxResizeWidth) {
            this.setVideoRatioWidthAndKeepAspectRatio(measuringBlock, [resizeWidth, targetNodeWidth]);
          }
        } else {
          const resizeHeight = Convert.upperLimit(
            Convert.lowerLimit(height + diff_y, Config.measuringBlockResizeSize),
            maxResizeHeight
          );
          measuringBlock.style.width = `${resizeWidth / targetNodeWidth * 100}%`;
          measuringBlock.style.height = `${resizeHeight / targetNodeHeight * 100}%`;
        }
      }, () => {
        const { width, height } = measuringBlock.getBoundingClientRect();
        return {
          width,
          height
        };
      });
      mouseDrag(measuringBlock, ({ diff_x, diff_y, onceData: { top: originalTop, left: originalLeft, width: originalWidth, height: originalHeight } }) => {
        measuringBlock.getBoundingClientRect();
        const {
          width: targetNodeWidth,
          height: targetNodeHeight,
          left: targetNodeLeft,
          right: targetNodeRight,
          top: targetNodeTop,
          bottom: targetNodeBottom
        } = targetNode.getBoundingClientRect();
        const leftOfPx = originalLeft + diff_x;
        const topOfPx = originalTop + diff_y;
        const left = Convert.limits(leftOfPx - targetNodeLeft, 0, targetNodeWidth - originalWidth);
        const top = Convert.limits(topOfPx - targetNodeTop, 0, targetNodeHeight - originalHeight);
        this.setPositionByRatio(measuringBlock, [left, targetNodeWidth], [top, targetNodeHeight]);
      }, () => {
        const { top, left, width, height } = measuringBlock.getBoundingClientRect();
        return {
          top,
          left,
          width,
          height
        };
      });
      targetNode.appendChild(measuringBlock);
      return measuringBlock;
    },
    /**
     *
     * @param measuringBlock
     * @param {[number, number]} ratio
     */
    setVideoRatioWidthAndKeepAspectRatio(measuringBlock, ratio) {
      const videoWidth = Convert.toNumber(measuringBlock.dataset.videoWidth);
      const videoHeight = Convert.toNumber(measuringBlock.dataset.videoHeight);
      const [width, parentWidth] = ratio;
      const aspectRatio = videoHeight / videoWidth;
      const { height: parentHeight } = measuringBlock[targetNodeAttr].getBoundingClientRect();
      measuringBlock.style.width = `${width / parentWidth * 100}%`;
      measuringBlock.style.height = `${width * aspectRatio / parentHeight * 100}%`;
      measuringBlockMappingResize.set(measuringBlock, { width, parentWidth });
    },
    /**
     *
     * @param measuringBlock
     * @param {[number, number]} ratioX
     * @param {[number, number]} ratioY
     */
    setPositionByRatio(measuringBlock, ratioX, ratioY) {
      const [leftOfPx, targetNodeWidth] = ratioX;
      const [topOfPx, targetNodeHeight] = ratioY;
      const left = leftOfPx / targetNodeWidth;
      const top = topOfPx / targetNodeHeight;
      measuringBlock.style.left = `${left * 100}%`;
      measuringBlock.style.top = `${top * 100}%`;
      measuringBlockMappingPosition.set(measuringBlock, {
        left: leftOfPx,
        top: topOfPx,
        parentWidth: targetNodeWidth,
        parentHeight: targetNodeHeight
      });
    },
    /**
     * 设置对应的视频尺寸比例
     * @param measuringBlock
     * @param {number} width
     * @param {number} height
     */
    setVideoRatios(measuringBlock, width, height) {
      measuringBlock.dataset.videoWidth = width.toString();
      measuringBlock.dataset.videoHeight = height.toString();
      const { width: parentWidth } = measuringBlock[targetNodeAttr].getBoundingClientRect();
      const { width: measuringBlockWidth } = measuringBlock.getBoundingClientRect();
      this.setVideoRatioWidthAndKeepAspectRatio(measuringBlock, [measuringBlockWidth, parentWidth]);
    },
    show(measuringBlock) {
      var _a;
      (_a = measuringBlock == null ? void 0 : measuringBlock.classList) == null ? void 0 : _a.add("show");
    },
    alwaysShow(measuringBlock) {
      var _a;
      (_a = measuringBlock == null ? void 0 : measuringBlock.classList) == null ? void 0 : _a.add("alwaysShow");
    },
    closeAlwaysShow(measuringBlock) {
      var _a;
      (_a = measuringBlock == null ? void 0 : measuringBlock.classList) == null ? void 0 : _a.remove("alwaysShow");
    },
    editMode(measuringBlock) {
      var _a;
      (_a = measuringBlock == null ? void 0 : measuringBlock.classList) == null ? void 0 : _a.add("edit");
    },
    exitEditMode(measuringBlock) {
      var _a;
      (_a = measuringBlock == null ? void 0 : measuringBlock.classList) == null ? void 0 : _a.remove("edit");
    },
    allExitEditMode() {
      for (const measuringBlock of document.querySelectorAll(".__sign_SHAS_measuringBlock.edit")) {
        this.exitEditMode(measuringBlock);
        this.closeAlwaysShow(measuringBlock);
      }
    },
    hide(measuringBlock) {
      var _a, _b, _c;
      if (((_a = measuringBlock == null ? void 0 : measuringBlock.classList) == null ? void 0 : _a.contains("alwaysShow")) === false) {
        (_b = measuringBlock == null ? void 0 : measuringBlock.classList) == null ? void 0 : _b.remove("show");
        (_c = measuringBlock == null ? void 0 : measuringBlock.classList) == null ? void 0 : _c.remove("alwaysShow");
      }
    },
    hideAll() {
      for (const measuringBlock of document.querySelectorAll(".__sign_SHAS_measuringBlock")) {
        this.hide(measuringBlock);
      }
    },
    /**
     *
     * @param measuringBlock
     * @param {string} videoFileUrl
     */
    importVideo(measuringBlock, videoFileUrl) {
      const video = measuringBlock[videoAttr];
      video.src = videoFileUrl;
      updateVideoRatios(measuringBlock);
    },
    /**
     *
     * @param measuringBlock
     * @return {{currentTime: number, duration: number}}
     */
    getVideoInfo(measuringBlock) {
      const { currentTime, duration } = measuringBlock[videoAttr];
      return {
        currentTime,
        duration
      };
    },
    videoPlay(measuringBlock) {
      measuringBlock[videoAttr].play().then();
    },
    videoPause(measuringBlock) {
      measuringBlock[videoAttr].pause();
    },
    videoSetCurrentTime(measuringBlock, currentTime) {
      measuringBlock[videoAttr].currentTime = currentTime;
    },
    videoAllPause() {
      for (const measuringBlock of document.querySelectorAll(".__sign_SHAS_measuringBlock")) {
        this.videoPause(measuringBlock);
      }
    },
    /**
     *
     * @param measuringBlock
     * @param {number} volume
     */
    setVideoVolume(measuringBlock, volume) {
      measuringBlock[videoAttr].volume = volume;
    },
    /**
     *
     * @param measuringBlock
     * @param {number} playbackRate
     */
    setVideoPlaybackRate(measuringBlock, playbackRate) {
      measuringBlock[videoAttr].playbackRate = playbackRate;
    },
    /**
     *
     * @param {number} playbackRate
     */
    setAllVideoPlaybackRate(playbackRate) {
      externalVideoHub$1.allMeasuringBlock().forEach((measuringBlock) => this.setVideoPlaybackRate(measuringBlock, playbackRate));
    },
    remove(measuringBlock) {
      measuringBlockMappingResize.delete(measuringBlock);
      measuringBlockMappingPosition.delete(measuringBlock);
      measuringBlock.remove();
    },
    /**
     *
     * @param measuringBlock
     * @return {string}
     */
    serialize(measuringBlock) {
      const { width, parentWidth: parentWidthOfResize } = measuringBlockMappingResize.get(measuringBlock);
      const { left, top, parentWidth: parentWidthOfPosition, parentHeight } = measuringBlockMappingPosition.get(measuringBlock);
      return `${width},${parentWidthOfResize};${left},${parentWidthOfPosition},${top},${parentHeight}`;
    },
    markAsImportedCreate(measuringBlock) {
      measuringBlock[importedCreateAttr] = true;
    }
  };
  const MeasuringBlock$1 = MeasuringBlock;
  const numberNodeAttr = Symbol();
  const editingCallbackList = [];
  const NumberEditor = {
    is(numberEditor) {
      var _a;
      return !!((_a = numberEditor == null ? void 0 : numberEditor.classList) == null ? void 0 : _a.contains("content_line"));
    },
    create(defaultNumber = 60) {
      const numberEditor = createNode(`
			<div class="__sign_SHAS_numberEditor">
				<div class="__sign_SHAS_numberEditor_number">
				  ${defaultNumber}
				</div>
			</div>
		`);
      numberEditor[numberNodeAttr] = numberEditor.querySelector(".__sign_SHAS_numberEditor_number");
      numberEditor.addEventListener("wheel", (event) => {
        const { deltaY, shiftKey } = event;
        const number = (() => {
          if (shiftKey) {
            return 1;
          } else {
            return 5;
          }
        })();
        if (deltaY > 0) {
          this.add(numberEditor, -number);
        } else if (deltaY < 0) {
          this.add(numberEditor, number);
        }
        event.preventDefault();
      });
      return numberEditor;
    },
    /**
     *
     * @param numberEditor
     * @param {number} number
     */
    add(numberEditor, number) {
      const originalNumber = Convert.toNumber(numberEditor[numberNodeAttr].textContent);
      const currentNumber = Convert.limits(originalNumber + number, 0, 100);
      if (originalNumber !== currentNumber) {
        numberEditor[numberNodeAttr].textContent = currentNumber;
        editingCallbackList.forEach((cb) => cb({ originalNumber, currentNumber }));
      }
    },
    /**
     *
     * @param numberEditor
     * @param {numberEditorCallback} cb
     */
    editing(numberEditor, cb) {
      editingCallbackList.push(cb);
    },
    /**
     *
     * @param numberEditor
     * @return {number}
     */
    getNumber(numberEditor) {
      return Convert.toNumber(numberEditor[numberNodeAttr].textContent);
    }
  };
  const videoInputCallbackAttr = Symbol();
  const videoEditCallbackAttr = Symbol();
  const videoDeleteCallbackAttr = Symbol();
  const bindMeasuringBlockAttr = Symbol();
  const ListContentLine = {
    /**
     *
     * @param contentLine
     * @return {boolean}
     */
    is(contentLine) {
      var _a;
      return !!((_a = contentLine == null ? void 0 : contentLine.classList) == null ? void 0 : _a.contains("content_line"));
    },
    /**
     *
     * @param measuringBlock - 绑定的measuringBlock
     */
    create(measuringBlock) {
      const contentLine = createNode(`
				<div class="content_line">
					<div class="content_line_name">视频${document.querySelectorAll(".content_line").length + 1}</div>
					<div class="content_line_videoInput">点击选择视频源</div>
					<div class="content_line_volume"></div>
					<div class="content_line_videoEdit">编辑</div>
					<div class="content_line_delete">✖</div>
				</div>
			`);
      contentLine[bindMeasuringBlockAttr] = measuringBlock;
      {
        const defaultVolume = Config.defaultVolume;
        const numberEditor = NumberEditor.create(defaultVolume);
        MeasuringBlock$1.setVideoVolume(measuringBlock, defaultVolume / 100);
        NumberEditor.editing(numberEditor, ({ currentNumber }) => {
          MeasuringBlock$1.setVideoVolume(measuringBlock, currentNumber / 100);
        });
        contentLine.querySelector(".content_line_volume").appendChild(numberEditor);
      }
      {
        const videoInput = contentLine.querySelector(".content_line_videoInput");
        videoInput.dataset.videoUrl = "null";
        videoInput.addEventListener("click", () => {
          userSelectFile(".mp4, .mkv, .flv").then((file) => {
            var _a;
            URL.revokeObjectURL(videoInput.dataset.videoUrl);
            const videoFileUrl = URL.createObjectURL(file);
            videoInput.dataset.videoUrl = videoFileUrl;
            contentLine.querySelector(".content_line_videoEdit").classList.add("editable");
            videoInput.textContent = file.name;
            (_a = contentLine == null ? void 0 : contentLine[videoInputCallbackAttr]) == null ? void 0 : _a.call(contentLine, { videoFileUrl, file });
          });
        });
      }
      {
        const lineNameNode = contentLine.querySelector(".content_line_name");
        lineNameNode.addEventListener("click", () => {
          const input = createNode(`<input class="user_input" type="text" autocomplete="off" />`);
          input.value = lineNameNode.textContent;
          lineNameNode.appendChild(input);
          input.focus();
          input.addEventListener("blur", () => {
            if (input.value.trim().length > 0) {
              this.setName(contentLine, input.value);
            }
            input.remove();
          });
        });
      }
      {
        const videoEdit = contentLine.querySelector(".content_line_videoEdit");
        videoEdit.addEventListener("click", () => {
          var _a;
          if (videoEdit.classList.contains("editable")) {
            (_a = contentLine == null ? void 0 : contentLine[videoEditCallbackAttr]) == null ? void 0 : _a.call(contentLine);
          }
        });
      }
      {
        const videoDelete = contentLine.querySelector(".content_line_delete");
        videoDelete.addEventListener("click", () => {
          var _a;
          (_a = contentLine == null ? void 0 : contentLine[videoDeleteCallbackAttr]) == null ? void 0 : _a.call(contentLine);
        });
      }
      return contentLine;
    },
    /**
     * 获取描述
     * @param contentLine
     * @return {string}
     */
    getName(contentLine) {
      return contentLine.querySelector(".content_line_name").textContent;
    },
    /**
     *
     * @param contentLine
     * @param {string} name
     */
    setName(contentLine, name) {
      const lineNameNode = contentLine.querySelector(".content_line_name");
      lineNameNode.textContent = name;
    },
    /**
     * 获取视频文件url
     * @param contentLine
     * @return {?string}
     */
    getVideoUrl(contentLine) {
      var _a, _b;
      const url = (_b = (_a = contentLine.querySelector(".content_line_videoInput")) == null ? void 0 : _a.dataset) == null ? void 0 : _b.videoUrl;
      if ((url == null ? void 0 : url.length) > 4) {
        return url;
      }
      return null;
    },
    /**
     *
     * @param contentLine
     * @param {videoInputCallback} cb
     */
    setVideoInputCallback(contentLine, cb) {
      contentLine[videoInputCallbackAttr] = cb;
    },
    /**
     *
     * @param contentLine
     * @param {function} cb
     */
    setVideoEditCallback(contentLine, cb) {
      contentLine[videoEditCallbackAttr] = cb;
    },
    /**
     *
     * @param contentLine
     * @param {function} cb
     */
    setVideoDeleteCallback(contentLine, cb) {
      contentLine[videoDeleteCallbackAttr] = cb;
    },
    remove(contentLine) {
      MeasuringBlock$1.remove(contentLine[bindMeasuringBlockAttr]);
      contentLine.remove();
    }
  };
  const editingCb = Symbol();
  const TimestampEditor = {
    create() {
      const timestampEditor = createNode(`
				<div class="__sign_SHAS_timestampEditor">
					<div class="__sign_SHAS_timestampEditor_hours" data-hours="0">00</div>
					<div class="__sign_SHAS_timestampEditor_semicolon">：</div>
					<div class="__sign_SHAS_timestampEditor_minutes" data-minutes="0">00</div>
					<div class="__sign_SHAS_timestampEditor_semicolon">：</div>
					<div class="__sign_SHAS_timestampEditor_seconds" data-seconds="0">00</div>
					<div class="__sign_SHAS_timestampEditor_semicolon">，</div>
					<div class="__sign_SHAS_timestampEditor_milliseconds" data-milliseconds="0">000</div>
				</div>
			`);
      const syncVideo2 = debounceExecuteBuilder(() => {
        bilibiliPlayerVideoController.syncVideo();
      }, 100);
      const editing = () => {
        var _a;
        (_a = timestampEditor == null ? void 0 : timestampEditor[editingCb]) == null ? void 0 : _a.call(timestampEditor);
        syncVideo2();
      };
      timestampEditor.querySelector(".__sign_SHAS_timestampEditor_hours").addEventListener("wheel", (event) => {
        const { deltaY, shiftKey } = event;
        const hours = (() => {
          if (shiftKey) {
            return 10;
          } else {
            return 1;
          }
        })();
        if (deltaY > 0) {
          TimestampEditor.hours(timestampEditor, -hours);
        } else if (deltaY < 0) {
          TimestampEditor.hours(timestampEditor, hours);
        }
        event.preventDefault();
        editing();
      });
      timestampEditor.querySelector(".__sign_SHAS_timestampEditor_minutes").addEventListener("wheel", (event) => {
        const { deltaY, shiftKey } = event;
        const minutes = (() => {
          if (shiftKey) {
            return 10;
          } else {
            return 1;
          }
        })();
        if (deltaY > 0) {
          TimestampEditor.minutes(timestampEditor, -minutes);
        } else if (deltaY < 0) {
          TimestampEditor.minutes(timestampEditor, minutes);
        }
        event.preventDefault();
        editing();
      });
      timestampEditor.querySelector(".__sign_SHAS_timestampEditor_seconds").addEventListener("wheel", (event) => {
        const { deltaY, shiftKey } = event;
        const seconds = (() => {
          if (shiftKey) {
            return 10;
          } else {
            return 1;
          }
        })();
        if (deltaY > 0) {
          TimestampEditor.seconds(timestampEditor, -seconds);
        } else if (deltaY < 0) {
          TimestampEditor.seconds(timestampEditor, seconds);
        }
        event.preventDefault();
        editing();
      });
      timestampEditor.querySelector(".__sign_SHAS_timestampEditor_milliseconds").addEventListener("wheel", (event) => {
        const { deltaY, shiftKey, altKey } = event;
        const milliseconds = (() => {
          if (shiftKey && altKey) {
            return 1;
          } else if (shiftKey) {
            return 10;
          } else {
            return 100;
          }
        })();
        if (deltaY > 0) {
          TimestampEditor.milliseconds(timestampEditor, -milliseconds);
        } else if (deltaY < 0) {
          TimestampEditor.milliseconds(timestampEditor, milliseconds);
        }
        event.preventDefault();
        editing();
      });
      return timestampEditor;
    },
    /**
     * 获取时间
     * @param timestampEditor
     * @return {{hours: number, minutes: number, seconds: number, milliseconds: number}}
     */
    getTime(timestampEditor) {
      const hoursNode = timestampEditor.querySelector(".__sign_SHAS_timestampEditor_hours");
      const minutesNode = timestampEditor.querySelector(".__sign_SHAS_timestampEditor_minutes");
      const secondsNode = timestampEditor.querySelector(".__sign_SHAS_timestampEditor_seconds");
      const millisecondsNode = timestampEditor.querySelector(".__sign_SHAS_timestampEditor_milliseconds");
      const hours = Convert.toNumber(hoursNode.dataset.hours);
      const minutes = Convert.toNumber(minutesNode.dataset.minutes);
      const seconds = Convert.toNumber(secondsNode.dataset.seconds);
      const milliseconds = Convert.toNumber(millisecondsNode.dataset.milliseconds);
      return { hours, minutes, seconds, milliseconds };
    },
    /**
     * 获取表示总秒数的时间
     * @param timestampEditor
     * @return {number}
     */
    getTimeOfSeconds(timestampEditor) {
      const { hours, minutes, seconds, milliseconds } = this.getTime(timestampEditor);
      return hours * 3600 + minutes * 60 + seconds + milliseconds / 1e3;
    },
    /**
     *
     * @param timestampEditor
     * @param {number} hours
     */
    setHours(timestampEditor, hours) {
      const hoursNode = timestampEditor.querySelector(".__sign_SHAS_timestampEditor_hours");
      const hoursString = hours.toString();
      hoursNode.textContent = hoursString.padStart(2, "0");
      hoursNode.dataset.hours = hoursString;
    },
    /**
     *
     * @param timestampEditor
     * @param {number} minutes
     */
    setMinutes(timestampEditor, minutes) {
      const minutesNode = timestampEditor.querySelector(".__sign_SHAS_timestampEditor_minutes");
      const minutesString = minutes.toString();
      minutesNode.textContent = minutesString.padStart(2, "0");
      minutesNode.dataset.minutes = minutesString;
    },
    /**
     *
     * @param timestampEditor
     * @param {number} seconds
     */
    setSeconds(timestampEditor, seconds) {
      const secondsNode = timestampEditor.querySelector(".__sign_SHAS_timestampEditor_seconds");
      const secondsString = seconds.toString();
      secondsNode.textContent = secondsString.padStart(2, "0");
      secondsNode.dataset.seconds = secondsString;
    },
    /**
     *
     * @param timestampEditor
     * @param {number} milliseconds
     */
    setMilliseconds(timestampEditor, milliseconds) {
      const millisecondsNode = timestampEditor.querySelector(".__sign_SHAS_timestampEditor_milliseconds");
      const millisecondsString = milliseconds.toString();
      millisecondsNode.textContent = millisecondsString.padStart(3, "0");
      millisecondsNode.dataset.milliseconds = millisecondsString;
    },
    /**
     *
     * @param timestampEditor
     * @param {number} seconds
     */
    setTimeBySeconds(timestampEditor, seconds) {
      const { hours, minutes, seconds: remainderSeconds, milliseconds } = parseTime.secondsToTime(seconds);
      this.setHours(timestampEditor, hours);
      this.setMinutes(timestampEditor, minutes);
      this.setSeconds(timestampEditor, remainderSeconds);
      this.setMilliseconds(timestampEditor, milliseconds);
    },
    hours(timestampEditor, hours) {
      const { hours: currentHours } = this.getTime(timestampEditor);
      this.setHours(timestampEditor, Convert.limits(currentHours + hours, 0, 99));
    },
    minutes(timestampEditor, minutes) {
      const { hours, minutes: currentMinutes } = this.getTime(timestampEditor);
      const totalMinutes = Convert.limits(hours * 60 + currentMinutes + minutes, 0, 5999);
      this.setHours(timestampEditor, Math.floor(totalMinutes / 60));
      this.setMinutes(timestampEditor, totalMinutes % 60);
    },
    seconds(timestampEditor, seconds) {
      const { hours, minutes, seconds: currentSeconds } = this.getTime(timestampEditor);
      const totalSeconds = Convert.limits(hours * 3600 + minutes * 60 + currentSeconds + seconds, 0, 359940);
      this.setHours(timestampEditor, Math.floor(totalSeconds / 3600));
      this.setMinutes(timestampEditor, Math.floor(totalSeconds % 3600 / 60));
      this.setSeconds(timestampEditor, totalSeconds % 60);
    },
    milliseconds(timestampEditor, milliseconds) {
      const { hours, minutes, seconds, milliseconds: currentMilliseconds } = this.getTime(timestampEditor);
      const totalSeconds = Convert.limits(hours * 3600 + minutes * 60 + seconds + (currentMilliseconds + milliseconds) / 1e3, 0, 359940);
      this.setHours(timestampEditor, Math.floor(totalSeconds / 3600));
      this.setMinutes(timestampEditor, Math.floor(totalSeconds % 3600 / 60));
      this.setSeconds(timestampEditor, Math.floor(totalSeconds % 60));
      if (seconds >= 1 || minutes >= 1 || hours >= 1) {
        this.setMilliseconds(timestampEditor, (currentMilliseconds + Math.ceil(Math.abs(milliseconds / 1e3)) * 1e3 + milliseconds) % 1e3);
      } else {
        if (currentMilliseconds + milliseconds < 0) {
          this.setMilliseconds(timestampEditor, 0);
        } else {
          this.setMilliseconds(timestampEditor, (currentMilliseconds + Math.ceil(Math.abs(milliseconds / 1e3)) * 1e3 + milliseconds) % 1e3);
        }
      }
    },
    /**
     *
     * @param timestampEditor
     * @param {function} cb
     */
    editing(timestampEditor, cb) {
      timestampEditor[editingCb] = cb;
    }
  };
  const originalVideoAttr = Symbol();
  const externalVideoAttr = Symbol();
  const deleteCallbackAttr = Symbol();
  const ReferencePointLine = {
    /**
     * 是否是ReferencePointLine对象
     * @param referencePointLine
     * @return {boolean}
     */
    is(referencePointLine) {
      var _a;
      return !!((_a = referencePointLine == null ? void 0 : referencePointLine.classList) == null ? void 0 : _a.contains(".__sign_SHAS_referencePointLine"));
    },
    create() {
      const referencePointLine = createNode(`
				<div class="__sign_SHAS_referencePointLine">
					<div class="__sign_SHAS_referencePointLine_timestampEditorOfOriginalVideo"></div>
					<div class="__sign_SHAS_referencePointLine_timestampEditorOfExternalVideo"></div>
					<div class="__sign_SHAS_referencePointLine_delete">✖</div>
				</div>
			`);
      const timestampEditorOfOriginalVideo = TimestampEditor.create();
      referencePointLine[originalVideoAttr] = timestampEditorOfOriginalVideo;
      TimestampEditor.editing(timestampEditorOfOriginalVideo, () => {
        const timeOfSeconds = TimestampEditor.getTimeOfSeconds(timestampEditorOfOriginalVideo);
        externalVideoHub$1.setOriginalTimeOfReferencePoint(referencePointLine, timeOfSeconds);
      });
      referencePointLine.querySelector(".__sign_SHAS_referencePointLine_timestampEditorOfOriginalVideo").appendChild(timestampEditorOfOriginalVideo);
      const timestampEditorOfExternalVideo = TimestampEditor.create();
      referencePointLine[externalVideoAttr] = timestampEditorOfExternalVideo;
      TimestampEditor.editing(timestampEditorOfExternalVideo, () => {
        const timeOfSeconds = TimestampEditor.getTimeOfSeconds(timestampEditorOfExternalVideo);
        externalVideoHub$1.setExternalVideoTimeBySeconds(referencePointLine, timeOfSeconds);
      });
      referencePointLine.querySelector(".__sign_SHAS_referencePointLine_timestampEditorOfExternalVideo").appendChild(timestampEditorOfExternalVideo);
      referencePointLine.querySelector(".__sign_SHAS_referencePointLine_delete").addEventListener("click", () => {
        var _a;
        externalVideoHub$1.deleteReferencePoint(referencePointLine);
        (_a = referencePointLine == null ? void 0 : referencePointLine[deleteCallbackAttr]) == null ? void 0 : _a.call(referencePointLine);
      });
      return referencePointLine;
    },
    setOriginalTimeBySeconds(referencePointLine, seconds) {
      const timestampEditorOfOriginalVideo = referencePointLine[originalVideoAttr];
      TimestampEditor.setTimeBySeconds(timestampEditorOfOriginalVideo, seconds);
    },
    setExternalVideoTimeBySeconds(referencePointLine, seconds) {
      const timestampEditorOfExternalVideo = referencePointLine[externalVideoAttr];
      TimestampEditor.setTimeBySeconds(timestampEditorOfExternalVideo, seconds);
    },
    setTimeBySeconds(referencePointLine, originalTime, externalVideoTime) {
      this.setOriginalTimeBySeconds(referencePointLine, originalTime);
      this.setExternalVideoTimeBySeconds(referencePointLine, externalVideoTime);
    },
    /**
     *
     * @param referencePointLine
     * @param {function} cb
     */
    setDeleteCallback(referencePointLine, cb) {
      referencePointLine[deleteCallbackAttr] = cb;
    }
  };
  const panelConfig = {
    width: 500,
    height: 400
  };
  let isOpen = false;
  let firstOpen = true;
  const panel = createNode(`
		<div class="__sign_SHAS_panel">
		  <div class="top">
		    <div class="left">
			  <div class="back">
                <div class="back_line_1"></div>
                <div class="back_line_2"></div>
              </div>
			</div>
		  	<div class="right">
		      <div class="close_line_1"></div>
		      <div class="close_line_2"></div>
            </div>
		  </div>
		  <div class="main">
		  	<div class="listPage page">
		  		<div class="content">
				  <div class="content_column_line">
				    <div class="content_column_name">描述</div>
				    <div class="content_column_videoInput">视频源</div>
				    <div class="content_column_volume">音量</div>
				    <div class="content_column_edit">轴对轴</div>
				    <div class="content_column_delete"></div>
				  </div>
		  		  
				</div>
				<div class="create_new_line">
				  <span class="create_new_line_button">✚</span>
				</div>
			</div>
			<div class="editPage page hide">
			  <div class="editPage_title"></div>
			  <div class="editPage_column">
			  	<div class="editPage_column_descriptions">网站视频</div>
			  	<div class="editPage_column_descriptions">挂载视频</div>
			  	<div class="editPage_column_occupy"></div>
			  </div>
			  <div class="content"></div>
			  <div class="editPage_tool">
			    <div class="editPage_newPoint">✚</div>
			    <div class="editPage_export">复制配置</div>
			  </div>
			  <div class="editPage_bottom">
			  	<div class="editPage_bottom_externalVideoTime"></div>
			  </div>
			</div>
		  </div>
		</div>
	`);
  panel.querySelector(".main");
  let editingContentLine;
  const createLine = () => {
    const measuringBlock = MeasuringBlock$1.create(document.querySelector(".__sign_SHAS_videoArea"));
    const contentLine = ListContentLine.create(measuringBlock);
    ListContentLine.setVideoEditCallback(contentLine, () => {
      panelPage.toEdit(contentLine);
    });
    ListContentLine.setVideoInputCallback(contentLine, ({ videoFileUrl, file }) => {
      MeasuringBlock$1.importVideo(measuringBlock, videoFileUrl);
      externalVideoHub$1.setFile(contentLine, file);
    });
    ListContentLine.setVideoDeleteCallback(contentLine, () => {
      externalVideoHub$1.deleteContentLine(contentLine);
      ListContentLine.remove(contentLine);
    });
    externalVideoHub$1.addByContentLine(contentLine, measuringBlock);
    const content = panel.querySelector(".listPage .content");
    content.appendChild(contentLine);
    return contentLine;
  };
  const createLineByDeserialize = (deserializingData, description = null) => {
    const contentLine = createLine();
    const measuringBlock = externalVideoHub$1.getMeasuringBlock(contentLine);
    const {
      width,
      parentWidthOfResize,
      left,
      parentWidthOfPosition,
      top,
      parentHeight,
      referencePointList
    } = deserializeV1(deserializingData);
    MeasuringBlock$1.markAsImportedCreate(measuringBlock);
    MeasuringBlock$1.setVideoRatioWidthAndKeepAspectRatio(measuringBlock, [width, parentWidthOfResize]);
    MeasuringBlock$1.setPositionByRatio(measuringBlock, [left, parentWidthOfPosition], [top, parentHeight]);
    referencePointList.forEach((referencePoint) => externalVideoHub$1.addReferencePoint(contentLine, referencePoint));
    if (description) {
      ListContentLine.setName(contentLine, description);
    }
  };
  const deserializeV1 = (deserializingData) => {
    const infoBlockList = deserializingData.split(";");
    const resizeInfo = infoBlockList[0];
    const resizeList = resizeInfo.split(",");
    const width = Convert.toNumber(resizeList[0]);
    const parentWidthOfResize = Convert.toNumber(resizeList[1]);
    const positionInfo = infoBlockList[1];
    const positionList = positionInfo.split(",");
    const left = Convert.toNumber(positionList[0]);
    const parentWidthOfPosition = Convert.toNumber(positionList[1]);
    const top = Convert.toNumber(positionList[2]);
    const parentHeight = Convert.toNumber(positionList[3]);
    const referencePointListInfo = infoBlockList[2];
    const referencePointList = [];
    for (const referencePointString of referencePointListInfo.split(",")) {
      const list = referencePointString.split(">");
      const originalTime = Convert.toNumber(list[0]);
      const externalVideoTime = Convert.toNumber(list[1]);
      referencePointList.push({
        originalTime,
        externalVideoTime
      });
    }
    return {
      width,
      parentWidthOfResize,
      left,
      parentWidthOfPosition,
      top,
      parentHeight,
      referencePointList
    };
  };
  const createReferencePointLineNodeOnly = (originalTime, externalVideoTime) => {
    const referencePointLine = ReferencePointLine.create();
    ReferencePointLine.setTimeBySeconds(referencePointLine, originalTime, externalVideoTime);
    ReferencePointLine.setDeleteCallback(referencePointLine, () => {
      buildEditPage(editingContentLine);
    });
    panel.querySelector(".__sign_SHAS_panel .main .editPage .content").appendChild(referencePointLine);
    return referencePointLine;
  };
  const buildEditPage = (contentLine) => {
    clearReferencePointLineNode();
    const { versions, referencePointList } = externalVideoHub$1.getReferencePointAll(contentLine);
    for (const { originalTime, externalVideoTime } of referencePointList) {
      createReferencePointLineNodeOnly(originalTime, externalVideoTime);
    }
  };
  const clearReferencePointLineNode = () => {
    [...panel.querySelectorAll(".__sign_SHAS_referencePointLine")].forEach((node) => node.remove());
  };
  const pageType = {
    list: Symbol("list"),
    edit: Symbol("edit")
  };
  const panelPage = (() => {
    let currentPage = pageType.list;
    const hideAllPage = () => {
      for (const page of panel.querySelectorAll(".page")) {
        page.classList.add("hide");
      }
    };
    const backButton = {
      hide() {
        panel.querySelector(".back").style.display = "none";
      },
      display() {
        panel.querySelector(".back").style.display = "block";
      }
    };
    return {
      // 切换到列表页
      toList() {
        currentPage = pageType.list;
        hideAllPage();
        panel.querySelector(".listPage").classList.remove("hide");
        editingContentLine = null;
        backButton.hide();
        MeasuringBlock$1.allExitEditMode();
      },
      // 切换到编辑页
      toEdit(contentLine) {
        currentPage = pageType.edit;
        hideAllPage();
        editingContentLine = contentLine;
        const name = ListContentLine.getName(contentLine);
        {
          buildEditPage(contentLine);
        }
        {
          const measuringBlock = externalVideoHub$1.getMeasuringBlock(contentLine);
          if (measuringBlock) {
            MeasuringBlock$1.alwaysShow(measuringBlock);
            MeasuringBlock$1.editMode(measuringBlock);
          }
        }
        panel.querySelector(".editPage").classList.remove("hide");
        panel.querySelector(".editPage_title").textContent = name;
        backButton.display();
      },
      get currentPage() {
        return currentPage;
      }
    };
  })();
  const initPanel = () => {
    {
      panel.style.left = `${(window.innerWidth - panelConfig.width) / 2}px`;
      panel.style.top = "100px";
      panel.style.width = `${panelConfig.width}px`;
      panel.style.height = `${panelConfig.height}px`;
    }
    document.body.appendChild(panel);
    {
      const showExternalVideoTimeNode = panel.querySelector(".editPage_bottom_externalVideoTime");
      bilibiliPlayerVideoController.videoTrigger(() => {
        if (panelPage.currentPage === pageType.edit) {
          const { currentTime, duration } = MeasuringBlock$1.getVideoInfo(externalVideoHub$1.getMeasuringBlock(editingContentLine));
          const { milliseconds, seconds, minutes, hours } = parseTime.secondsToTime(currentTime);
          showExternalVideoTimeNode.textContent = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")},${milliseconds.toString().padStart(3, "0")}`;
        }
      });
    }
    {
      const dragRegion = panel.querySelector(".top .left");
      barDrag(dragRegion, panel);
    }
    panel.querySelector(".top .right").addEventListener("click", Panel.close);
    {
      panel.querySelector(".create_new_line_button").addEventListener("click", () => {
        createLine();
      });
      panel.querySelector(".editPage_newPoint").addEventListener("click", () => {
        const { currentTime } = MeasuringBlock$1.getVideoInfo(externalVideoHub$1.getMeasuringBlock(editingContentLine));
        const originalTime = Convert.toNumber(bilibiliPlayerVideo.currentTime.toFixed(3));
        const externalVideoTime = Convert.toNumber(currentTime.toFixed(3));
        createReferencePointLineNodeOnly(originalTime, externalVideoTime);
        externalVideoHub$1.addReferencePoint(editingContentLine, {
          originalTime,
          externalVideoTime
        });
        bilibiliPlayerVideoController.syncVideo();
      });
      panel.querySelector(".back").addEventListener("click", () => {
        panelPage.toList();
        bilibiliPlayerVideoController.syncVideo();
      });
      panel.querySelector(".editPage_export").addEventListener("click", () => {
        const configText = externalVideoHub$1.serialize(editingContentLine);
        if (configText) {
          const list = externalVideoHub$1.getReferencePointAll(editingContentLine);
          if (list.referencePointList.length > 0) {
            navigator.clipboard.writeText(configText).then();
          }
        }
      });
    }
    {
      window.addEventListener("paste", (event) => {
        const { clipboardData } = event;
        if (panelPage.currentPage === pageType.list && isOpen) {
          const text = clipboardData.getData("text/plain");
          searchDeserializingData(text).forEach(({ deserializingData, description }) => createLineByDeserialize(deserializingData, description));
        }
      });
    }
  };
  const Panel = {
    /**
     * @return {boolean}
     */
    get initialised() {
      return !firstOpen;
    },
    get panelNode() {
      return panel;
    },
    get editingContentLine() {
      return editingContentLine;
    },
    open() {
      isOpen = true;
      if (firstOpen) {
        firstOpen = false;
        initPanel();
      }
      panel.classList.remove("hide");
    },
    close() {
      panelPage.toList();
      isOpen = false;
      panel.classList.add("hide");
    },
    toggle() {
      if (isOpen) {
        this.close();
      } else {
        this.open();
      }
    },
    toList() {
      panelPage.toList();
    },
    /**
     * 导入配置字符串创建挂载视频
     * @param {string} deserializingData
     * @param {?string} description
     */
    createLineByDeserialize(deserializingData, description = null) {
      createLineByDeserialize(deserializingData, description);
    }
  };
  const replyList = document.querySelector(".left-container-under-player");
  if (replyList) {
    const options = { childList: true, subtree: true };
    const replyContentNode = /* @__PURE__ */ new Set();
    const ob = new MutationObserver((mutations, observer) => {
      const nodeList = [];
      for (const mutation of mutations) {
        const { target } = mutation;
        if (target.classList.contains("reply-content") && !replyContentNode.has(target)) {
          replyContentNode.add(target);
          nodeList.push(target);
        }
      }
      observer.disconnect();
      nodeList.forEach((node) => {
        const pattern = regularExpression.patternCompletely;
        node.innerHTML = node.innerHTML.replaceAll(pattern, (text) => `<span class="__sign_SHAS_replyListImport">${text}</span>`);
        for (const clickNode of node.querySelectorAll(".__sign_SHAS_replyListImport")) {
          clickNode.addEventListener("click", () => {
            const data = searchDeserializingData(clickNode.textContent);
            if (data.length > 0) {
              const [{ deserializingData, description }] = data;
              Panel.createLineByDeserialize(deserializingData, description);
              Panel.open();
              Panel.toList();
            }
          });
        }
      });
      observer.observe(replyList, options);
    });
    ob.observe(replyList, options);
  }
  window.addEventListener("keydown", (event) => {
    const { code, ctrlKey, shiftKey, altKey } = event;
    if (code === Config.code && ctrlKey === Config.ctrlKey && shiftKey === Config.shiftKey && altKey === Config.altKey) {
      const focusNode = document.body.querySelector("*:focus");
      if (!focusNode) {
        Panel.toggle();
      }
    }
  });

})();