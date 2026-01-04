// ==UserScript==
// @name         【牧神】bilibili分段视频跳转
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  B站视频分段视频跳转
// @author       mushen
// @match        https://www.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant    GM_registerMenuCommand
// @grant    GM_unregisterMenuCommand
// @grant    GM_addValueChangeListener
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/496337/%E3%80%90%E7%89%A7%E7%A5%9E%E3%80%91bilibili%E5%88%86%E6%AE%B5%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/496337/%E3%80%90%E7%89%A7%E7%A5%9E%E3%80%91bilibili%E5%88%86%E6%AE%B5%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

function ms_pathByPlayTime() {
  return "#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-left > div.bpx-player-ctrl-btn.bpx-player-ctrl-time > div > span.bpx-player-ctrl-time-current";
}

function ms_pathByTotalTime() {
  return "#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-left > div.bpx-player-ctrl-btn.bpx-player-ctrl-time > div > span.bpx-player-ctrl-time-duration";
}

function ms_pathByNextBtn() {
  return "#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-left > div.bpx-player-ctrl-btn.bpx-player-ctrl-next";
}

(function () {
  "use strict";
  ms_getTabId();
  GM_registerMenuCommand("设置正片时长", ms_MenuPositiveTimeClick);
  GM_registerMenuCommand("设置混淆视频时长", ms_MenuOtherTimeClick);
  // const time_element = document.querySelector("#viewbox_report > div.video-info-meta > div")
  // ms_add_time_select(time_element);

  let totalTimePath = ms_pathByTotalTime();
  let playTimePath = ms_pathByPlayTime();
  ms_setTotalTimeValue(totalTimePath);
  ms_waitForElement(playTimePath, (element) => {
    let skipTime = ms_getSkipTime();
    let playTime = element.textContent;
    if (skipTime != null && skipTime != "00:00" && playTime == skipTime) {
      nextVideo();
      ms_setTotalTimeValue(totalTimePath);
    }
  });

  ms_waitForElement(totalTimePath, (element) => {
    let time = element.textContent;
    GM_setValue(ms_getTotalTimeKey(), time);
    ms_setSkipTime();
  });
})();

// 监听元素变化
function ms_waitForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "childList" ||
          mutation.type === "characterData"
        ) {
          callback(element);
        }
      });
    });

    // 观察者的配置（观察目标节点的子节点的变化和节点内容的变化）
    const config = {
      attributes: false,
      childList: true,
      subtree: true,
      characterData: true,
    };

    // 传入目标节点和观察选项并开始观察
    observer.observe(element, config);
  } else {
    setTimeout(function () {
      ms_waitForElement(selector, callback);
    }, 500);
  }
}

function ms_MenuPositiveTimeClick() {
  let skip_time = getPositiveTime();
  let playTimePath = ms_pathByPlayTime();
  let playTime = ms_getElementTextContent(playTimePath);
  skip_time = window.prompt(
    "请输入正片时长，示例：05:01\n当前播放时长：" + playTime,
    skip_time
  );
  if (skip_time) {
    setPositiveTime(skip_time);
    ms_setSkipTime();
  }
}

function ms_MenuOtherTimeClick() {
  let time = ms_getOtherTimeValue()
  let totalTime = ms_getTotalTime();
  let playTimePath = ms_pathByPlayTime();
  let playTime = ms_getElementTextContent(playTimePath)
  time = window.prompt(
    "请输入混淆视频时长，示例：04:05\n当前播放时长：" +
      playTime +
      "\n视频总时长：" +
      totalTime,
    time
  );
  if (time) {
    ms_setOtherTimeValue(time);
    delPositiveTime();
    ms_setSkipTime();
  }
}

function ms_setSkipTime() {
  // 获取当前视频总时长
  // 判断正片时长是否存在
  let skipTime = "00:00";
  if (getPositiveTime() != null) {
    skipTime = getPositiveTime();
  } else if (ms_getOtherTimeValue() != null) {
    let time = ms_getOtherTimeValue();
    let total = ms_getTotalTime();
    // 使用总时长减去混淆视频时长
    skipTime = ms_timeSubtract(time, total);
  }
  GM_log("跳转时间点：" + skipTime);
  GM_setValue(ms_getSkipTimeKey, skipTime);
}

function ms_getSkipTime() {
  return GM_getValue(ms_getSkipTimeKey);
}

function ms_getTotalTimeKey() {
  return ms_getTabId() + ":total_time";
}

function ms_getTotalTime() {
  return GM_getValue(ms_getTotalTimeKey());
}
function ms_setTotalTimeValue(selector) {
  let element = document.querySelector(selector);
  if (element) {
    let time = element.textContent;
    GM_log("视频总时长：" + time);
    GM_setValue(ms_getTotalTimeKey(), time);
  } else {
    setTimeout(() => {
      ms_setTotalTimeValue(selector);
    },500);
  }
}

function ms_getElementTextContent(selector){
  let element
  while (!element) {
    sleep(500)
    element = document.querySelector(selector);
  }
  return element.textContent
}

function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds));
}

function ms_getSkipTimeKey() {
  return ms_getTabId() + ":skip_time";
}

function ms_getPositiveTimeKey() {
  return ms_getTabId() + ":positive_time";
}
function getPositiveTime() {
  return GM_getValue(ms_getPositiveTimeKey());
}

function setPositiveTime(time) {
  GM_log(ms_getPositiveTimeKey());
  GM_setValue(ms_getPositiveTimeKey(), time);
}

function delPositiveTime(){
  GM_deleteValue(ms_getPositiveTimeKey())
}

function ms_getOtherTimeKey() {
  return ms_getTabId + ":other_time";
}

function ms_getOtherTimeValue() {
  return GM_getValue(ms_getOtherTimeKey);
}

function ms_setOtherTimeValue(time) {
  GM_setValue(ms_getOtherTimeKey, time);
}
function ms_setPlayTimeValue(time) {
  GM_setValue(ms_getPlayTimeKey(), time);
}

function ms_getPlayTimeValue() {
  GM_getValue(ms_getPlayTimeKey());
}

function ms_getPlayTimeKey() {
  return ms_getTabId + ":play_time";
}

function ms_getTabId() {
  // 尝试获取现有的标签页ID
  let tabId = sessionStorage.getItem("tabId");

  // 如果没有找到，创建一个新的ID
  if (!tabId) {
    tabId = new Date().getTime(); // 使用当前时间作为唯一ID
    sessionStorage.setItem("tabId", tabId); // 存储ID以便将来访问
  }

  console.log("当前标签页的ID是:", tabId);
  return tabId;
}

// time2 - time1, 格式mm:ss
function ms_timeSubtract(time1, time2) {
  let time =
    convertToSecondsFromString(time2) - convertToSecondsFromString(time1);
  return secondsToMinutes(time);
}

// mm:ss 转换成秒
function convertToSecondsFromString(timeString) {
  var parts = timeString.split(":");
  return convertToSeconds(parseInt(parts[0], 10), parseInt(parts[1], 10));
}

// 秒转 mm:ss
function secondsToMinutes(seconds) {
  var minutes = Math.floor(seconds / 60); // 取整数部分
  var remainingSeconds = seconds % 60; // 余下的秒数
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (remainingSeconds < 10) {
    remainingSeconds = "0" + remainingSeconds;
  }
  return minutes + ":" + remainingSeconds;
}

function convertToSeconds(minutes, seconds) {
  return minutes * 60 + seconds;
}

function nextVideo() {
  let nextBthPath = ms_pathByNextBtn()
  document
    .querySelector(nextBthPath)
    .dispatchEvent(new MouseEvent("click", { bubbles: true }));
}
