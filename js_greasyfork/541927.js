// ==UserScript==
// @name         TouchGal VNDB链接转换器
// @namespace    https://github.com/dccif
// @version      1.0.6
// @author       dccif
// @description  自动将TouchGal网站上的VNDB ID转换为可点击的链接
// @license      MIT
// @icon         https://www.touchgal.us/favicon.ico
// @source       https://github.com/dccif/touchgal-script.git
// @match        https://www.touchgal.io/*
// @match        https://www.touchgal.us/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541927/TouchGal%20VNDB%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541927/TouchGal%20VNDB%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let executed = false;
  let stylesCached = false;
  let cachedRefClass = "";
  let cachedRefRole = null;
  let styleAttempts = 0;
  let vndbAttempts = 0;
  let pollCount = 0;
  let currentInterval = 300;
  const maxStyleAttempts = 5;
  const maxVndbAttempts = 8;
  const maxPollCount = 30;
  const intervals = [300, 500, 800, 1200, 2e3];
  function shouldRun() {
    const { href, pathname } = location;
    return href.includes("?") || href.includes("#") || pathname !== "/";
  }
  function tryCacheStyles() {
    if (stylesCached || styleAttempts >= maxStyleAttempts) return;
    styleAttempts++;
    const refLink = document.querySelector(".kun-prose a");
    if (refLink) {
      cachedRefClass = refLink.className || "";
      cachedRefRole = refLink.getAttribute("role");
      stylesCached = true;
      console.log("✅ 样式信息已缓存");
    } else if (styleAttempts >= maxStyleAttempts) {
      stylesCached = true;
      console.log("⚠️ 未找到参考样式，使用默认样式");
    }
  }
  function isPageReady() {
    const hasGrid = document.querySelector('div[class*="grid"]');
    const hasFlex = document.querySelector('div[class*="flex"]');
    return !!(hasGrid && hasFlex);
  }
  function replaceVNDBIds() {
    if (executed) return true;
    vndbAttempts++;
    const vndbSpans = document.querySelectorAll("span");
    if (!vndbSpans.length) {
      if (vndbAttempts >= maxVndbAttempts) {
        console.log("⚠️ 多次尝试后未找到VNDB ID，页面上可能没有相关内容");
        return true;
      }
      return false;
    }
    const vndbRegex = /VNDB ID:\s*(v\d+)/;
    let hasChanges = false;
    for (let i = 0; i < vndbSpans.length; i++) {
      const span = vndbSpans[i];
      const text = span.textContent;
      if (!(text == null ? void 0 : text.includes("VNDB ID:"))) continue;
      const match = text.match(vndbRegex);
      if (!match) continue;
      const vndbId = match[1];
      const parentNode = span.parentNode;
      if (parentNode) {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createTextNode("VNDB ID: "));
        const link = document.createElement("a");
        link.href = `https://vndb.org/${vndbId}`;
        link.textContent = vndbId;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        if (cachedRefClass) {
          link.className = cachedRefClass;
        }
        if (cachedRefRole) {
          link.setAttribute("role", cachedRefRole);
        }
        fragment.appendChild(link);
        parentNode.replaceChild(fragment, span);
        hasChanges = true;
        console.log(`替换VNDB ID: ${vndbId}`);
      }
    }
    if (hasChanges) {
      executed = true;
      console.log("✅ VNDB链接替换完成");
      return true;
    }
    if (vndbAttempts >= maxVndbAttempts) {
      console.log("⚠️ 多次尝试后未找到VNDB ID，页面上可能没有相关内容");
      return true;
    }
    return false;
  }
  function execute() {
    if (!shouldRun() || executed) return;
    tryCacheStyles();
    if (!isPageReady()) return;
    if (!stylesCached) return;
    const shouldStop = replaceVNDBIds();
    if (shouldStop) {
      executed = true;
    }
  }
  function poll() {
    pollCount++;
    if (pollCount > maxPollCount) {
      console.log("⚠️ 轮询超时，停止执行");
      return;
    }
    execute();
    if (!executed) {
      const intervalIndex = Math.min(
        Math.floor(pollCount / 6),
        intervals.length - 1
      );
      currentInterval = intervals[intervalIndex];
      console.log(`🔄 轮询第${pollCount}次，间隔${currentInterval}ms`);
      setTimeout(poll, currentInterval);
    }
  }
  poll();

})();