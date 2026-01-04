// ==UserScript==
// @name         xiaobaotong-monkey
// @namespace    npm/vite-plugin-monkey
// @version      0.0.1
// @author       Hn
// @description  自动记录和恢复小报童观看位置。
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        https://xiaobot.net/*
// @downloadURL https://update.greasyfork.org/scripts/500669/xiaobaotong-monkey.user.js
// @updateURL https://update.greasyfork.org/scripts/500669/xiaobaotong-monkey.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getColumnName() {
    const titleElement = document.querySelector(".paper_title .name");
    return titleElement ? titleElement.innerText.trim() : null;
  }
  function restoreScrollPosition(columnName) {
    const scrollTop = localStorage.getItem(`scrollPosition_${columnName}`);
    if (scrollTop !== null) {
      const targetScrollTop = parseInt(scrollTop);
      const intervalId = setInterval(() => {
        const documentHeight = document.documentElement.scrollHeight;
        const currentScrollTop = window.scrollY;
        if (currentScrollTop >= targetScrollTop) {
          clearInterval(intervalId);
        } else if (targetScrollTop > documentHeight) {
          window.scrollTo(0, documentHeight);
        } else {
          window.scrollTo(0, targetScrollTop);
        }
      }, 1e3);
    }
  }
  let scrollHandler;
  function recordScrollPosition(columnName) {
    scrollHandler = () => {
      const scrollTop = window.scrollY;
      const screenHeight = window.innerHeight;
      const recordedScrollTop = localStorage.getItem(`scrollPosition_${columnName}`);
      const recordedScrollTopValue = recordedScrollTop ? parseInt(recordedScrollTop) : 0;
      if (scrollTop > screenHeight && scrollTop > recordedScrollTopValue) {
        localStorage.setItem(`scrollPosition_${columnName}`, scrollTop.toString());
      }
    };
    window.addEventListener("scroll", scrollHandler);
  }
  function isColumnPage() {
    return /https:\/\/xiaobot.net\/p\/.+/.test(window.location.href);
  }
  function handlePageLoad() {
    console.log("load");
    if (isColumnPage()) {
      const observer = new MutationObserver((mutations, observer2) => {
        const columnName = getColumnName();
        if (columnName) {
          console.log("isPage");
          console.log("name=", columnName);
          restoreScrollPosition(columnName);
          recordScrollPosition(columnName);
          observer2.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      if (scrollHandler) {
        window.removeEventListener("scroll", scrollHandler);
      }
    }
  }
  function checkPageLoadAndHandle() {
    if (isColumnPage()) {
      const columnName = getColumnName();
      if (columnName) {
        restoreScrollPosition(columnName);
        recordScrollPosition(columnName);
      } else {
        requestAnimationFrame(checkPageLoadAndHandle);
      }
    }
  }
  window.addEventListener("load", () => {
    handlePageLoad();
    checkPageLoadAndHandle();
  });
  window.addEventListener("popstate", handlePageLoad);
  window.addEventListener("pushstate", handlePageLoad);
  const originalPushState = history.pushState;
  history.pushState = function(...args) {
    const result = originalPushState.apply(this, args);
    window.dispatchEvent(new Event("pushstate"));
    return result;
  };
  const originalReplaceState = history.replaceState;
  history.replaceState = function(...args) {
    const result = originalReplaceState.apply(this, args);
    window.dispatchEvent(new Event("pushstate"));
    return result;
  };

})();