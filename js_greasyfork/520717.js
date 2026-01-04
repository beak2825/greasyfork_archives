// ==UserScript==
// @name         bilibili统计观看时长
// @version      0.0.2
// @description  统计bilibili合集总时长与观看百分比，支持倍速计算
// @author       stone
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @namespace  347386437@qq.com
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/520717/bilibili%E7%BB%9F%E8%AE%A1%E8%A7%82%E7%9C%8B%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/520717/bilibili%E7%BB%9F%E8%AE%A1%E8%A7%82%E7%9C%8B%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function () {
  "use strict";

  setTimeout(function () {
    // 添加倍速输入框
    function addSpeedInput() {
      const header = document.querySelector(".video-pod .header-top");
      if (!header) return;
    
      const speedInput = document.createElement("input");
      speedInput.type = "number";
      speedInput.value = "1.0";
      speedInput.min = "0.1";
      speedInput.max = "16";
      speedInput.style.cssText = `
          width: 20px;
          height: 20px;
          margin-left: 5px;
          font-size: 12px;
          border: 1px solid #e3e5e7;
          border-radius: 2px;
          padding: 0 4px;
          color: #18191c;
          background: #f1f2f3;
          outline: none;
          /* 隐藏步进控制器 */
          -webkit-appearance: none;
          -moz-appearance: textfield;
      `;
      speedInput.id = "speed-input";
    
      // 隐藏步进控制器的额外样式
      const style = document.createElement("style");
      style.textContent = `
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `;
      document.head.appendChild(style);
    
      const speedLabel = document.createElement("span");
      speedLabel.textContent = "倍速:";
      speedLabel.style.cssText = `
                font-size: 12px;
                color: #61666d;
                margin-left: 10px;
            `;
    
      header.appendChild(speedLabel);
      header.appendChild(speedInput);
    
      // 添加失去焦点事件
      speedInput.addEventListener("blur", () => count());
    
      // 监听视频播放速度变化
      const video = document.querySelector("video");
      if (video) {
        video.addEventListener("ratechange", function () {
          speedInput.value = video.playbackRate;
          count();
        });
    
        // 初始化时同步视频速度
        speedInput.value = video.playbackRate;
      }
    }

    let lis = document.querySelectorAll(".video-pod__list .video-pod__item");
    let timer = null;

    if (lis.length > 0) {
      addSpeedInput();
      count();
    }

    function count() {
      clearTimeout(timer);
      timer = setTimeout(function () {
        let totalSec = 0;
        let watchedSec = 0;
        let flag = true;

        // 获取当前倍速
        const speedInput = document.getElementById("speed-input");
        const speed = speedInput ? parseFloat(speedInput.value) : 1.0;

        for (let i = 0; i < lis.length; i++) {
          let TimeStr = lis[i].querySelector(".stat-item.duration").innerHTML;
          const TimeArr = TimeStr.split(":");

          // 计算总秒数
          if (TimeArr.length === 3) {
            totalSec += Number(TimeArr[0]) * 3600;
            totalSec += Number(TimeArr[1]) * 60;
            totalSec += Number(TimeArr[2]);
          } else if (TimeArr.length === 2) {
            totalSec += Number(TimeArr[0]) * 60;
            totalSec += Number(TimeArr[1]);
          } else if (TimeArr.length === 1) {
            totalSec += Number(TimeArr[0]);
          }

          if (flag) {
            watchedSec = totalSec;
          }

          if (
            lis[i].className.indexOf("active") != -1 ||
            lis[i].querySelector(".active") != null
          ) {
            flag = false;
          }
        }

        // 考虑倍速计算实际时长
        const actualTotalHours = (totalSec / 3600).toFixed(1);
        const actualWatchedHours = (watchedSec / 3600).toFixed(1);
        const adjustedTotalHours = (totalSec / (3600 * speed)).toFixed(1);
        const adjustedWatchedHours = (watchedSec / (3600 * speed)).toFixed(1);
        const rate = ((watchedSec / totalSec) * 100).toFixed(2);

        // 获取当前视频序号和总集数
        const currentNum = document
          .querySelector(".video-pod__header .amt")
          .innerText.match(/\d+/g);
        const current = currentNum ? currentNum[0] : "";
        const total = currentNum ? currentNum[1] : "";

        // 隐藏原有的集数显示
        const amtElement = document.querySelector(".video-pod__header .amt");
        if (amtElement) {
          amtElement.style.display = "none";
        }

        // 更新显示，加入集数信息
        const title = document.querySelector(".video-pod .header-top .title");
        title.style.cssText = `
                font-size: 13px;
                color: #18191c;
                display: inline-block;
                margin-right: 10px;
            `;
        title.innerHTML = `(${current}/${total}) ${adjustedWatchedHours}/${adjustedTotalHours}h (${rate}%)`;

        // 更新进度条
        updateProgressBar(rate);
      }, 500);
    }

    function updateProgressBar(rate) {
      const bar = document.querySelector(".header-top");
      let oldProgress = bar.querySelector(".progressBar");
      if (oldProgress) {
        bar.removeChild(oldProgress);
      }

      const progress = document.createElement("div");
      progress.className = "progressBar";
      progress.style.cssText = `
                background-color: #00aeec;
                width: ${bar.offsetWidth * (rate / 100)}px;
                height: 4px;
                position: absolute;
                bottom: -4px;
                left: 0;
                z-index: 999;
                border-radius: 2px;
            `;

      // 添加背景条
      const bgBar = document.createElement("div");
      bgBar.style.cssText = `
                background-color: #e3e5e7;
                width: 100%;
                height: 4px;
                position: absolute;
                bottom: -4px;
                left: 0;
                border-radius: 2px;
            `;

      bar.style.position = "relative";
      bar.appendChild(bgBar);
      bar.appendChild(progress);
    }

    // 监听视频切换
    const targetNode = document.querySelector(".video-pod__list");
    if (targetNode) {
      const observer = new MutationObserver(() => {
        debounce(count, 200)();
      });

      observer.observe(targetNode, {
        childList: true,
        attributes: true,
        subtree: true,
      });
    }
  }, 2500);
})();

function debounce(fn, delay = 500) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(null, args);
      timer = null;
    }, delay);
  };
}
