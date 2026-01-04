// ==UserScript==
// @name         百度网盘 - 自动加载全部文件 + 倒序显示 + 自动取消全选
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  还原旧版显示方式，模拟手动操作
// @match        https://pan.baidu.com/s/*
// @grant        none
// @run-at       document-start
// @license      CC-BY-NC
// @downloadURL https://update.greasyfork.org/scripts/541127/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%20-%20%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E5%85%A8%E9%83%A8%E6%96%87%E4%BB%B6%20%2B%20%E5%80%92%E5%BA%8F%E6%98%BE%E7%A4%BA%20%2B%20%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E5%85%A8%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541127/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%20-%20%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E5%85%A8%E9%83%A8%E6%96%87%E4%BB%B6%20%2B%20%E5%80%92%E5%BA%8F%E6%98%BE%E7%A4%BA%20%2B%20%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E5%85%A8%E9%80%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

    // 自动滚动加载所有文件
  const enableAutoScroll = false;
    // 自动取消全选
  const enableAutoUncheckAll = true;

  // === 劫持请求，添加倒序参数 ===
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (typeof url === 'string' && url.includes('/share/list')) {
      const u = new URL(url, location.origin);
      u.searchParams.set('num', '100');
      u.searchParams.set('desc', '1');
      arguments[1] = u.toString();
    }
    return origOpen.apply(this, arguments);
  };

  const origFetch = window.fetch;
  window.fetch = function (input, init) {
    let url = input;
    let isRequest = false;
    if (input instanceof Request) {
      url = input.url;
      isRequest = true;
    }
    if (typeof url === 'string' && url.includes('/share/list')) {
      const u = new URL(url, location.origin);
      u.searchParams.set('num', '100');
      u.searchParams.set('desc', '1');
      const newUrl = u.toString();
      input = isRequest ? new Request(newUrl, input) : newUrl;
    }
    return origFetch.call(this, input, init);
  };

  // === 自动滚动加载全部内容 ===
  function autoScrollLoad(container) {
    if (!enableAutoScroll || !container || window.__panScrollRunning__) return;
    window.__panScrollRunning__ = true;

    let lastScrollTop = -1;
    let stableCount = 0;

    const loop = setInterval(() => {
      container.scrollTop = container.scrollHeight;

      if (container.scrollTop === lastScrollTop) {
        stableCount++;
      } else {
        stableCount = 0;
        lastScrollTop = container.scrollTop;
      }

      if (stableCount >= 5) {
        clearInterval(loop);
        setTimeout(() => {
          container.scrollTop = 0;
          window.__panScrollRunning__ = false;
        }, 100);
      }
    }, 200);
  }

  // === 自动取消“全选”状态 ===
  function uncheckAllSelection() {
    if (!enableAutoUncheckAll) return;
    const selectedCheckbox = document.querySelector('.Qxyfvg.fydGNC.checked');
    if (selectedCheckbox) {
      selectedCheckbox.click();
    }
  }

  function waitAndUncheckAll() {
  if (!enableAutoUncheckAll) return;

  const tryClick = () => {
    const fullSelect = document.querySelector('div[node-type="fydGNC"].Qxyfvg.fydGNC');
    if (fullSelect) {
      fullSelect.click();
      return true;
    }
    return false;
  };

  // 初始尝试
  if (tryClick()) return;

  // DOM 出现后再点
  const observer = new MutationObserver(() => {
    if (tryClick()) observer.disconnect();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  }

  // === 等待容器加载后执行逻辑 ===
  function waitForContainerAndScroll() {
    const timer = setInterval(() => {
      const container = document.querySelector('.NHcGw');
      if (container && container.scrollHeight > 1000) {
        clearInterval(timer);
        setTimeout(() => {
          autoScrollLoad(container);
          waitAndUncheckAll();
        }, 500);
      }
    }, 500);
  }

  // === 监听路径变化（用于单页应用刷新） ===
  function monitorPathChange() {
    let lastPath = location.pathname + location.search + location.hash;

    setInterval(() => {
      const nowPath = location.pathname + location.search + location.hash;
      if (nowPath !== lastPath) {
        lastPath = nowPath;
        waitForContainerAndScroll();
        waitAndUncheckAll();
      }
    }, 1000);
  }

  // === 初始化入口 ===
  window.addEventListener('load', () => {
    waitForContainerAndScroll();
    waitAndUncheckAll();
    monitorPathChange();
  });
})();
