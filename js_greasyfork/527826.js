// ==UserScript==
// @name         自用广告拦截器
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  广告拦截器
// @author       FlanChan
// @match   https://www.zkk79.com/*
// @match   http://www.zkk79.com/*
// @match   https://kemono.su/*
// @match   http://kemono.su/*
// @icon    https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant   none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527826/%E8%87%AA%E7%94%A8%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/527826/%E8%87%AA%E7%94%A8%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  // 时间单位
  class TimeUnit {
    constructor() {
      if (new.target === TimeUnit) {
        throw new Error("该类无法被实例化");
      }
    }

    static Hours(time) {
      return time * 1000 * 60 * 60;
    }

    static Minutes(time) {
      return time * 1000 * 60;
    }

    static Second(time) {
      return time * 1000;
    }
  }

  function addEventListeners() {
    document.addEventListener("click", handleAd);
    window.addEventListener("load", handleAd);
    window.addEventListener("hashchange", handleAd);
    window.addEventListener("pushState", handleAd);
    window.addEventListener("popstate", handleAd);
    window.addEventListener("replaceState", handleAd);
  }

  // 记录删除的广告数量
  let deletedAdCount = 0;

  function handleKemomoSuAd() {
    const adContainers = document.getElementsByClassName("ad-container");

    //关闭上下广告容器
    for (let adTag of adContainers) {
      adTag.style.display = "none";
      deletedAdCount++;
    }

    const adCloseBtn = document.getElementsByClassName(
      "close-button--wsOv0"
    )[0];

    if (adCloseBtn) {
      adCloseBtn.click();
      deletedAdCount++;
    }

    if (deletedAdCount < 3) {
      setTimeout(() => handleKemomoSuAd(), 500);
    } else {
      deletedAdCount = 0;
    }
  }

  function handleZkk79ComAd() {
    //获取广告标签
    const adTag = document.getElementsByTagName("divz")[0];

    //删除广告标签
    if (adTag) {
      adTag.remove();
    }

    if (deletedAdCount === 0) {
      setTimeout(() => handleZkk79ComAd(), 500);
    } else {
      deletedAdCount = 0;
    }
  }

  function handleEhentaiOrgAd() {
    //获取广告标签
    const adTag = document.getElementsByClassName("ad-container")[0];

    //删除广告标签
    if (adTag) {
      adTag.remove();
    }

    if (deletedAdCount === 0) {
      setTimeout(() => handleEhentaiOrgAd(), 500);
    } else {
      deletedAdCount = 0;
    }
  }

  // 域名对应的处理函数
  const domainFuncMap = {
    "kemono.su": handleKemomoSuAd,
    "www.zkk79.com": handleZkk79ComAd,
  };

  function handleAd() {
    const currentDomain = window.location.hostname;
    setTimeout(() => {
      if (domainFuncMap[currentDomain]) {
        domainFuncMap[currentDomain]();
      }
    }, 500);
  }

  function downloadText(text) {
    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });
    const objectUrl = URL.createObjectURL(blob);
    const aTag = document.createElement("a");
    aTag.href = objectUrl;
    aTag.download = "H5.txt";
    aTag.click();
    URL.revokeObjectURL(objectUrl);
    aTag.remove();
  }

  // 增加监听函数
  addEventListeners();
})();
