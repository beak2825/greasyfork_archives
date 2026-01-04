// ==UserScript==
// @name         youtube新标签页打开
// @namespace    neo_world_js
// @version      0.16
// @description  支持首页，搜索，频道，个人主页等在新标签打开，你懂的
// @author       neoWorld
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @github       https://github.com/lzuliuyun/open-in-new-tab
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425740/youtube%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/425740/youtube%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const updateAEle = function (selector) {
    const aEle = [...document.querySelectorAll(selector)];

    aEle.forEach((ele) => {
      ele.setAttribute("target", "_blank");
      const href = ele.getAttribute("href");
      ele.onclick = (e) => {
        e.stopPropagation();
        window.open(href, "_blank");
        return false;
      };

      ele.setAttribute("href", "#");
    });
  };

  const updateAEleBatch = function (aEleList) {
    if (intervalTimes !== intervalDefaultTimes) return; // 避免重复更新

    aEleList.forEach((curSelector) => {
      updateAEle(curSelector);
    });
  };

  const getCurPath = () => {
    const { pathname } = window.location;
    const secondIndex = pathname.indexOf("/", 2);
    const path =
      secondIndex === -1 ? pathname : pathname.substr(0, secondIndex);
    return path;
  };

  const getSelectorAtCurPath = function () {
    const path = getCurPath();

    return (
      selectorPathMap[path] || {
        observeEle: "#page-manager",
        aEle: ['#dismissible a[href^="/"]'],
      }
    );
  };

  const initObserver = function (selector) {
    const observeEle = document.querySelector(selector.observeEle);
    if (!observeEle) return;

    new MutationObserver(() => {
      updateAEleBatch(selector.aEle);
    }).observe(observeEle, {
      childList: true,
      subtree: true, // 监视子孙节点
    });
  };

  const watchPathChange = function (cb = () => {}) {
    setInterval(() => {
      const path = window.location.pathname;
      if (intervalTimes === 0) {
        initPath = path;
        intervalTimes = intervalDefaultTimes;
      }

      if (initPath !== path) {
        intervalTimes--;
        cb();
      }
    }, 100);
  };


  // init
  const selectorPathMap = {
    "/": {
      observeEle: "#page-manager",
      aEle: ['#dismissible a[href^="/"]'],
    },
    "/results": {
      observeEle: "#page-manager",
      aEle: ['#dismissible a[href^="/"]'],
    },
    "/channel": {
      observeEle: "#page-manager",
      aEle: ['#dismissible a[href^="/"]', 'ytd-grid-playlist-renderer a[href^="/"]', '#channel a[href^="/"]'],
    },
    "/watch": {
      observeEle: "#page-manager",
      aEle: ['#dismissible a[href^="/"]', 'ytd-video-owner-renderer a[href^="/"]'],
    },
    "/playlist": {
      observeEle: "#page-manager",
      aEle: ['#content a[href^="/"]'],
    },
    "/user": {
      observeEle: "#page-manager",
      aEle: ['#dismissible a[href^="/"]'],
    },
    "/c": {
      observeEle: "#page-manager",
      aEle: ['ytd-grid-playlist-renderer a[href^="/"]', '#dismissible a[href^="/"]'],
    },
    "/feed": {
      observeEle: "#page-manager",
      aEle: ['#dismissible a[href^="/"]'],
    },
  };

  const selector = getSelectorAtCurPath();
  let initPath = window.location.pathname;
  let intervalDefaultTimes = 10;
  let intervalTimes = intervalDefaultTimes;

  window.onload = () => {
    initObserver(selector);
    updateAEleBatch(selector.aEle);
  };

  watchPathChange(() => {
    initObserver(selector);
    updateAEleBatch(selector.aEle);
  });
})();
