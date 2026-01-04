// ==UserScript==
// @name        专注 Udemy 视频学习
// @namespace    http://tampermonkey.net/
// @version     1.0.4
// @description 删除一些在全屏下不需要的按钮和交互（如进度条、前进后退按钮等）
// @author      吴仙杰
// @match       https://www.udemy.com/course/*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460295/%E4%B8%93%E6%B3%A8%20Udemy%20%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/460295/%E4%B8%93%E6%B3%A8%20Udemy%20%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
(() => {
  let warningThreshold = 0;
  let completedUrl = window.location.href;

  window.onload = async () => {
    await hideUnnecessaryVideoInfo();
  };

  async function hideUnnecessaryVideoInfo() {
    await hideUnnecessaryVideoAfterVideoTagCreated();
    await urlChangeHandler();
  }

  async function urlChangeHandler() {
    await wait(5);

    const currentUrl = window.location.href;
    if (currentUrl === completedUrl) {
      await urlChangeHandler();
      return;
    }

    completedUrl = currentUrl;
    await hideUnnecessaryVideoInfo();
  }

  async function hideUnnecessaryVideoAfterVideoTagCreated() {
    const videoClass = ".vjs-tech";

    await wait(5);

    if (warningThreshold > 10) {
      warningThreshold = 0;
      console.error(`无法定位视频元素 ${videoClass}，请联系脚本开发者修复`);
    }

    const videoElement = document.querySelector(videoClass);
    if (!videoElement) {
      warningThreshold++;
      await hideUnnecessaryVideoAfterVideoTagCreated();
      return;
    }

    warningThreshold = 0;
    hideUnnecessaryElementsOnTheVideo();
    hideMouseCursor(videoElement);
  }

  function wait(seconds) {
    return new Promise(resolve => {
      setTimeout(resolve, seconds * 1000);
    });
  }

  function hideMouseCursor(element) {
    element.style.cursor = "none";
  }

  function hideUnnecessaryElementsOnTheVideo() {
    hideVideoControlBar();
    hideVideoPauseIcon();
    hidePreNextButton();
    hideShowCourseContentButton();
    hideVideoTitleBar();
  }

  function hideVideoTitleBar() {
    hideElements(".user-activity--hide-when-user-inactive--pDPGx", "无法找到视频标题条");
  }

  function hideShowCourseContentButton() {
    hideElements(".ud-btn-black-solid", "无法找到显示课程按钮");
    hideElements("[data-purpose='open-course-content']", "无法找到显示课程按钮");
  }

  function hidePreNextButton() {
    hideElements(".next-and-previous--container--1bSoH", "无法找到前进后退按钮");
  }

  function hideVideoPauseIcon() {
    hideElements(".video-player--center--2vS3g", "无法找到视频播放暂停提示图标");
  }

  function hideVideoControlBar() {
    hideElements(".control-bar--control-bar-container--16vzi", "无法找到视频播放控制条");
  }

  function hideElements(elementClass, errorMessage) {
    const elements = document.querySelectorAll(elementClass);
    if (elements.length === 0) {
      console.error(`${errorMessage}：${elementClass}`);
      return;
    }

    elements.forEach(element => {
      element.style.display = "none";
    });
  }
})();
