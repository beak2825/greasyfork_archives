// ==UserScript==
// @name         Maersk 自动订舱助手
// @namespace    http://tampermonkey.net/
// @version      2.1.4
// @description  自动检测订舱状态，支持页面跳转判断、系统通知、页面刷新自动恢复，异常页面强提醒
// @match        https://www.maersk.com.cn/book/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538894/Maersk%20%E8%87%AA%E5%8A%A8%E8%AE%A2%E8%88%B1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/538894/Maersk%20%E8%87%AA%E5%8A%A8%E8%AE%A2%E8%88%B1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 定义本地存储的键名（已废弃，改为sessionStorage控制）
  // const LOOP_KEY = '__maersk_auto_loop__';
  // const ACTIVE_TAB_KEY = '__maersk_active_tab__';

  // 用 sessionStorage 生成和获取 tabId
  if (!sessionStorage.getItem('maersk_tab_id')) {
    sessionStorage.setItem('maersk_tab_id', 'maersk_tab_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6));
  }
  const tabId = sessionStorage.getItem('maersk_tab_id');
  window.stopLoop = sessionStorage.getItem('maersk_stop_loop') !== 'false'; // 默认 true
  window.routeInfo = '';
  // 定义模式参数
  let timeoutMode = 'normal'; // normal 或 fast
  let timeoutBase = 5000

  // 系统通知和标题闪烁函数
  function sendNotificationAndFlash(title, message) {
    if (window.routeInfo) {
      message += `\n航线：${window.routeInfo}`;
    }
    if (Notification.permission === "granted") {
      new Notification(title, { body: message, requireInteraction: true });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, { body: message });
        }
      });
    }

    const originalTitle = document.title;
    let visible = false;
    if (!window.flashTitleTimer) {
      window.flashTitleTimer = setInterval(() => {
        document.title = visible ? originalTitle : title;
        visible = !visible;
      }, 1000);
    }
  }

  // 多层 Shadow DOM 嵌套结构下的文本搜索函数
  function searchTextInShadow(root, targetText) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.textContent && node.textContent.includes(targetText)) {
        return true;
      }
    }
    const elements = root.querySelectorAll('*');
    for (const el of elements) {
      if (el.shadowRoot) {
        const found = searchTextInShadow(el.shadowRoot, targetText);
        if (found) return true;
      }
    }
    return false;
  }

  function waitForTextInPage(targetText, timeout = 30000) {
    return new Promise(resolve => {
      const start = Date.now();
      const interval = setInterval(() => {
        const found = searchTextInShadow(document, targetText);
        if (found) {
          clearInterval(interval);
          resolve(true);
        } else if (Date.now() - start > timeout) {
          clearInterval(interval);
          resolve(false);
        }
      }, 1000);
    });
  }

  function setTimeoutParamsByMode() {
    if (timeoutMode === 'normal') {
      timeoutBase = 30000;
    } else if (timeoutMode === 'fast') {
      timeoutBase = 5000;
    }
  }

  function randomTimeout(base, delta) {
    return base + Math.random() * delta * 2 - delta;
  }

  function startLoop() {
    if (window.stopLoop) {
      sendNotificationAndFlash("⛔ 脚本已停止", "脚本检测到 stopLoop 为 true，已终止循环！");
      console.log("⛔ 脚本已停止，不再继续。");
      return;
    }

    const currentURL = window.location.href;

    if (currentURL === "https://www.maersk.com.cn/book/") {
      console.log("📄 当前在预订页，准备点击【继续订舱】");

      const btn = document.querySelector('mc-button#od3cpContinueButton');
      if (!btn) {
        console.log("🔍 未找到继续订舱按钮，等待 5 秒重试");
        setTimeout(startLoop, randomTimeout(timeoutBase, 1000));
        return;
      }

      if (btn.getAttribute('loading') === 'true') {
        console.log("⏳ 继续订舱按钮正在加载中（loading=true），等待 5 秒再试...");
        setTimeout(startLoop, randomTimeout(timeoutBase, 1000));
        return;
      }

      const plainMcCards = Array.from(document.querySelectorAll('mc-card')).filter(card => {
        const cls = card.getAttribute('class');
        return cls === null || cls.trim() === '';
      });

      if (plainMcCards.length < 6) {
        sendNotificationAndFlash('⚠️ 信息不完整', '输入信息不完整，请停止脚本后重新输入！');
        window.stopLoop = true;
        sessionStorage.setItem('maersk_stop_loop', 'true');
        return;
      }

      const isDisabled = btn.hasAttribute('disabled');
      if (isDisabled) btn.removeAttribute('disabled');
      btn.click();
      console.log("👉 点击继续订舱，等待跳转到 sailings 页...");
      setTimeout(startLoop, randomTimeout(timeoutBase, 1000));
    }

    else if (currentURL.startsWith("https://www.maersk.com.cn/book/sailings")) {
      const routeHeader = document.querySelector('h2[data-test="origin-destination-header"]');
      if (routeHeader) {
        const parts = [];
        routeHeader.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text) parts.push(text);
          }
        });
        if (parts.length === 2) {
          window.routeInfo = `${parts[0]} → ${parts[1]}`;
        }
      }
      console.log("📄 当前为订舱结果页，航线信息：", window.routeInfo);

      waitForTextInPage('加载更多航次选项', 30000).then(found => {
        if (!found) {
          console.log("⚠️ 加载更多航次选项按钮不存在，返回上一页等待下一轮...");
          window.history.back();
          setTimeout(startLoop, randomTimeout(180000, 10000));
          return;
        }
        setTimeout(() => {
          const bookButton = document.querySelector('mc-button[data-test="book-button"][label="订舱"]');
          if (bookButton) {
            sendNotificationAndFlash('✅ 订舱可用！', '检测到订舱按钮，请立即处理');
            window.stopLoop = true;
            sessionStorage.setItem('maersk_stop_loop', 'true');
            return;
          }

          console.log(`[${new Date().toLocaleTimeString()}] ❌ 没有可用航线，返回上一页等待下一轮...`);
          window.history.back();
          setTimeout(startLoop, randomTimeout(180000, 10000));
        },5000);
      });
    }

    else {
      const msg = `页面地址异常：${currentURL}`;
      console.log("🚨 页面状态未知，可能是被登出/系统错误，已终止脚本");
      sendNotificationAndFlash("❌ 页面异常", msg);
      window.stopLoop = true;
      sessionStorage.setItem('maersk_stop_loop', 'true');
    }
  }

  GM_registerMenuCommand("🚀 启动自动处理（模拟人工）", () => {
    if (!window.stopLoop) {
      alert("⚠️ 本标签页已在运行中！");
      return;
    }
    timeoutMode = 'normal';
    setTimeoutParamsByMode();
    window.stopLoop = false;
    sessionStorage.setItem('maersk_stop_loop', 'false');
    startLoop();
    alert("订舱检测已启动！");
  });

  GM_registerMenuCommand("⚡ 启动自动处理（超载模式）", () => {
    if (!window.stopLoop) {
      alert("⚠️ 本标签页已在运行中！");
      return;
    }
    timeoutMode = 'fast';
    setTimeoutParamsByMode();
    window.stopLoop = false;
    sessionStorage.setItem('maersk_stop_loop', 'false');
    startLoop();
    alert("订舱检测已启动！");
  });

  GM_registerMenuCommand("🛑 停止脚本", () => {
    window.stopLoop = true;
    sessionStorage.setItem('maersk_stop_loop', 'true');
    if (window.flashTitleTimer) {
      clearInterval(window.flashTitleTimer);
      window.flashTitleTimer = null;
      document.title = "Maersk Booking";
    }
    alert("订舱脚本已停止！");
  });

  if (sessionStorage.getItem('maersk_stop_loop') === 'false') {
    console.log("🔄 页面发生初始化刷新");
    window.stopLoop = false;
    startLoop();
  }

})();
