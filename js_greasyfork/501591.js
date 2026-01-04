// ==UserScript==
// @name         哔哩哔哩样式优化
// @namespace    https://bili.lib.ci
// @version      0.0.2407233.BETA
// @description  优化合集和选集列表样式、去除首页大屏
// @author       GantoHo
// @match        https://www.bilibili.com/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501591/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/501591/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 防抖函数
  const debounce = (func, delay) => {
    let timer = null;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay)
    }
  }
  // 合集、选集列表样式优化通用函数
  const utilFunc = (dom, callback, delay) => {
    if (dom) {
      const observer = new MutationObserver(() => callback(dom))
      observer.observe(dom, {
        attributes: true,
      })
      window.addEventListener("resize", debounce(() => callback(dom), delay));
    }
  }
  // 优化合集样式
  utilFunc(
    document.querySelector(".video-sections-content-list"),
    (dom) => {
      const videoDom = document.querySelector("#playerWrap");
      if (document.querySelector(".up-panel-container .up-info-container")) {
        dom.style.maxHeight = `${videoDom.clientHeight - 140}px`;
        dom.style.height = `${videoDom.clientHeight - 140}px`;
      }
      if (document.querySelector(".up-panel-container .members-info-container")) {
        dom.style.maxHeight = `${videoDom.clientHeight - 210}px`;
        dom.style.height = `${videoDom.clientHeight - 210}px`;
      }
    },
    200
  )
  // 优化选集样式
  utilFunc(
    document.querySelector(".cur-list"),
    (dom) => {
      const videoDom = document.querySelector("#playerWrap");
      if (document.querySelector(".up-panel-container .up-info-container")) {
        dom.style.maxHeight = `${videoDom.clientHeight - 110}px`;
        dom.style.height = `${videoDom.clientHeight - 110}px`;
      }
      if (document.querySelector(".up-panel-container .members-info-container")) {
        dom.style.maxHeight = `${videoDom.clientHeight - 180}px`;
        dom.style.height = `${videoDom.clientHeight - 180}px`;
      }
    },
    200
  )

  // 去除首页大屏
  if (document.querySelector(".recommended-swipe.grid-anchor")) {
    document.querySelector(".recommended-swipe.grid-anchor").remove();
    GM_addStyle(`
    .recommended-container_floor-aside .container > *:nth-of-type(n + 8) {
      margin-top: 0px !important;
    }
  
    .recommended-container_floor-aside .container.is-version8 > *:nth-of-type(n + 13) {
      margin-top: 0px !important;
    }
  
    @media (max-width: 1139.9px) {
      .recommended-container_floor-aside .container>*:nth-of-type(n + 6) {
        margin-top: 0px !important;
      }
    }
  
    @media (min-width: 1140px) and (max-width: 1299.9px) {
      .recommended-container_floor-aside .container>*:nth-of-type(n + 6) {
        margin-top: 0px !important;
      }
    }
  
    @media (min-width: 1300px) and (max-width: 1399.9px) {
      .recommended-container_floor-aside .container>*:nth-of-type(n + 6) {
        margin-top: 0px !important;
      }
    }
    `);
  }
})();
