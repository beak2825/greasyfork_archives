// ==UserScript==
// @name         浙江省高等学校在线开放课程共享平台自动刷课
// @namespace    Hclle
// @version      0.6
// @description  自动倍速播放课程，自动阅读PDF课程，切换课程
// @author       Hclle
// @match        *://www.zjooc.cn/ucenter/student/course/study/*/plan/detail/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440883/%E6%B5%99%E6%B1%9F%E7%9C%81%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1%E5%9C%A8%E7%BA%BF%E5%BC%80%E6%94%BE%E8%AF%BE%E7%A8%8B%E5%85%B1%E4%BA%AB%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/440883/%E6%B5%99%E6%B1%9F%E7%9C%81%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1%E5%9C%A8%E7%BA%BF%E5%BC%80%E6%94%BE%E8%AF%BE%E7%A8%8B%E5%85%B1%E4%BA%AB%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const settings = {
    videoId: "video", // video播放器的ID
    rate: "4", // 视频播放速度 1 - 16
    jump: 1, // 自动切换课程 0 否 1 是
    delay: 5000, // 自动播放下一课的延迟时间 单位毫秒
    delayPDF: 10 * 60 * 1000, // 阅读PDF章节延迟时间 单位毫秒，默认为10分钟
  };

  let videoDom = null; // 播放器
  let menuItems = []; // 所有章节
  let activeMenuItem = 0; // 当前播放的章节
  let tabs = []; // 当前播放的章节列表
  let activeTab = 0; // 当前播放的章节的小节

  let _getVideoDomTimeout = null; // 递归获取video元素句柄

  // 获取播放器
  const getVideoDom = () => {
    videoDom = document.querySelector(settings.videoId);

    if (!videoDom) {
      _getVideoDomTimeout = setTimeout(() => {
        getVideoDom();
        // 判断是不是阅读PDF
        if (hasPDF()) {
          clearTimeout(_getVideoDomTimeout);
          setTimeout(() => {
            document
              .querySelector(`#${getCurrentTabID()}`)
              .querySelector("button")
              .click();
            jumpNext();
          }, settings.delayPDF);
        }
      }, settings.delay);
      return false;
    }

    videoDom.autoplay = true;
    setVideoRate();
    setVideoMuted();

    if (videoDom.readyState >= 2) videoDom.play();
    else {
      // 数据加载完毕
      videoDom.addEventListener("canplay", () => {
        videoDom.play();
      });
    }

    if (!!settings.jump) {
      // 播放完毕
      videoDom.addEventListener("ended", () => {
        jumpNext();
      });
    }
  };

  // 设置播放速度
  const setVideoRate = (rate = settings.rate) => {
    videoDom.playbackRate = rate;
  };

  // 设置播放静音
  const setVideoMuted = (muted = true) => {
    videoDom.muted = muted;
  };

  // 获取章节的小节
  const getTabs = () => {
    tabs = Array.from(
      document.querySelector(
        "#app > div > section > section > section > main > div > div > div.el-tabs__header.is-top > div > div > div"
      ).childNodes
    );
  };

  // 判断当前章节的小节是否播放完毕
  const hasTabsEnd = () => {
    activeTab = tabs.findIndex((item) => item.className.includes("active"));

    return activeTab === tabs.length - 1;
  };

  // 获取当前播放小节的ID
  const getCurrentTabID = () => {
    const container = tabs.filter((item) =>
      item.className.includes("active")
    )[0];
    return container.getAttribute("aria-controls");
  };

  // 判断当前章节是不是阅读PDF
  const hasPDF = () => {
    return !!document
      .querySelector(`#${getCurrentTabID()}`)
      .querySelector("iframe");
  };

  // 跳转章节的小节
  const jumpTab = () => {
    activeTab++;
    tabs[activeTab].click();
  };

  // 跳转章节
  const jumpMenuItem = () => {
    return new Promise((resolve, reject) => {
      if (activeMenuItem !== menuItems.length - 1) {
        activeMenuItem++;
        menuItems[activeMenuItem] && menuItems[activeMenuItem].click();
        setTimeout(() => {
          getTabs();
          resolve()
        }, settings.delay);
      }
      resolve()
    });
  };

  // 跳转下一个课程
  const jumpNext = async () => {
    if (hasTabsEnd()) await jumpMenuItem();
    else jumpTab();

    setTimeout(() => {
      getVideoDom();
    }, settings.delay);
  };

  // 创建开始按钮
  const createContainer = () => {
    const container = document.createElement("div");
    container.style = `position: fixed;
    top: 0;
    right: 0;
    z-index: 999999999999;
    padding: 9px;
    background-color: #ccc;
    `;

    const btn = document.createElement("button");
    btn.textContent = "开始";
    btn.addEventListener("click", () => {
      btn.disabled = true;
      btn.textContent = "正在运行";
      start();
    });

    container.appendChild(btn);
    document.body.appendChild(container);
  };

  // 开始运行
  const start = () => {
    menuItems = Array.from(
      document.querySelectorAll("#pane-Chapter > div > ul > li > ul > li")
    );
    activeMenuItem = menuItems.findIndex((item) =>
      item.className.includes("active")
    );

    getTabs();
    getVideoDom();
  };

  window.addEventListener("load", () => {
    createContainer();
  });

  // Your code here...
})();
