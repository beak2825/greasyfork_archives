// ==UserScript==
// @name         555视频网：自动切换线路
// @version      1.5
// @description  播放视频时，如播放失败自动点击“切换线路”按钮。成功后 / 两分钟后自动停止。扩展所有相似域名。
// @match        https://*.wuwu559.space/*
// @match        https://*.wiki/*
// @match        https://*.shop/*
// @match        https://*.space/*
// @match        https://*.life/*
// @namespace    https://greasyfork.org/users/1171320
// @author       yzcjd
// @author2      ChatGPT4 辅助
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535573/555%E8%A7%86%E9%A2%91%E7%BD%91%EF%BC%9A%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E7%BA%BF%E8%B7%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/535573/555%E8%A7%86%E9%A2%91%E7%BD%91%EF%BC%9A%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E7%BA%BF%E8%B7%AF.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MAX_DURATION = 2 * 60 * 1000; // 最多运行2分钟
  const startTime = Date.now();
  let lastClickTime = 0;
  let stopped = false;

  // === 域名检测 ===
  const alwaysRunHost = 'www.wuwu559.space';
  const validHostPattern = /^[a-z0-9]{8,10}\.(wiki|shop|space|life)$/;

  if (location.hostname !== alwaysRunHost && !validHostPattern.test(location.hostname)) {
    console.log('[自动切换线路] 非 wuwu559.space 且域名不匹配，脚本终止');
    return;
  }

  function clickLineSwitchButton() {
    if (stopped) return;

    const now = Date.now();
    if (now - startTime > MAX_DURATION) {
      console.log('[自动切换线路] 已达2分钟上限，停止尝试');
      stopScript();
      return;
    }

    const failTip = document.querySelector('div, span, p, strong');
    if (failTip && /加载失败|播放失败|无法播放/i.test(failTip.textContent)) {
      console.log('[自动切换线路] 检测到“播放失败”提示，尝试切换线路');

      const btn = Array.from(document.querySelectorAll('a.btn.bg-line'))
        .find(el => el.textContent.includes('切换线路') && el.offsetParent !== null);

      if (btn && now - lastClickTime > 3000) {
        console.log('[自动切换线路] 点击切换线路按钮');
        btn.click();
        lastClickTime = now;
      }
    } else {
      console.log('[自动切换线路] 未检测到“播放失败”提示，可能已成功，停止脚本');
      stopScript();
    }
  }

  function stopScript() {
    stopped = true;
    observer.disconnect();
    clearInterval(timer);
    if (intersectionObserver) intersectionObserver.disconnect();
    console.log('[自动切换线路] 已停止');
  }

  // MutationObserver：监听DOM变化
  const observer = new MutationObserver(() => {
    clickLineSwitchButton();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // IntersectionObserver：监控切换按钮是否可见（保险机制）
  let intersectionObserver = null;
  const btnObserverTarget = document.createElement('div');
  document.body.appendChild(btnObserverTarget);

  intersectionObserver = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      console.log('[自动切换线路] IntersectionObserver 触发');
      clickLineSwitchButton();
    }
  });

  intersectionObserver.observe(btnObserverTarget);

  // 定时器保险机制（低频执行）
  const timer = setInterval(() => {
    clickLineSwitchButton();
  }, 5000);
})();
