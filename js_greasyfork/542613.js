// ==UserScript==
// @name         抖音自动选择最高画质
// @namespace    douyin-auto-hd
// @author       loerise
// @version      0.11
// @description  在抖音推荐和直播页面自动选择最高画质，净化直播界面
// @license      MIT
// @icon         data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALmSURBVHgBxVdLaxNRFP4Sq4u6yCxEcNOM6MKFxSC4EIqZbLoRbLY+KHEjCJZ06UaS/oFG3bmqIPhYtRE3SsukS0VMUReC6KRdKC1iptAWbUyO595MHk1mJjN5tB98mQncO+e7557HvQHYQ2NOWE+liX5gWiwwV5hZZq7TJJWpM2lANCwbtogwiwM0XmPRstW28v0w3ixC2ETAEmDAxTWuuHe38V5YA5489ThRxkNMCNBQ3ffusGsiGTzCEcqfKvyAeXocD/DN6+yY+MmgF3fummRUylRDMXLHz/xMEDYB0QuU1A126TGvwzXxY6CPHhDIpx/5Scseo99GgMDch/ekTF4nRMc6ZUMPxl0ECBhUpuS/HeItIQWHnb4xOAF1IE5hDNvOD8IrlBBwbhSYvAZcGrMfk/sM3HzI6bgBP3BfoRIiLjaEjVVSSpuklbYosbhMcZxo94D+iQyMUwIjlI9OEaWecTAsuXrAXUB4hPD1ozScLv+hIlX2GHISUJsfQYiSOEUZjDrGwJCrbxZfQVEU6ENHuVgcgl+sYFPSDc4CxF6HRzDfbFzs8cJb7vLb6BecBXCTSXCN1wLWkPRzYOYFd5BfeIw19BP2gcd7q1dKVkKvy0BK4Yx7GrbEgBfap2EoJB/11bPrC9jBDL6g33CuA6tNblaPSwFtEHVhIAKEccsLEtpZqNqF9nFTt6EGgpIS7CkTJfiFfTPi4lOPAQvTs7PV5nLlMnGKyv1P/15vDFBv0RzO+4kB2YwMOARiYulNe5cr/5XVMF7a3isw81IGapQbjw8BwjbycKmEeeM7dQRHvzDuc/WCuhDgeiRTVZXy86/tDRe3qvWejecRc2u5Tsx4OpSqGEZSvYjpiasyI0zThFLg7cu+k+/3+RAqDqJdBKBWO5brlhB0EiLOe9zZ5H+Rmln87CryUb2ynWx8+4AuJs040KtZsyeMARrX0bLygIOQKDNuKRUTermeC+aYC8zl1kH/AfsYpWDDoykoAAAAAElFTkSuQmCC
// @match        https://www.douyin.com/*
// @match        https://live.douyin.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/542613/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542613/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const CONFIG = {
    DELAY: 300,
    DELAY_DEBOUNCE: 300,
    DELAY_DOM: 1000,
    RETRY_MAX: 5,
    NAV_KEYS: ["w", "W", "s", "S", "ArrowUp", "ArrowDown", "KeyW", "KeyS"],
  };

  const RULES = [
    {
      selectors: [
        "[data-e2e='feed-item'] .xgplayer-playclarity-setting > .gear > .virtual > .item:first-child",
        '.live-main [data-e2e="quality-selector"] > div:nth-child(1)',
        ".live-main .chatroom_close",
      ],
      actions: (selectors) => {
        selectors.forEach((selector) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => el.click());
        });
      },
    },
    {
      selectors: "[data-e2e='feed-item'] .xgplayer-page-full-screen",
      actions: (selector) => {
        const container = document.querySelector(selector);
        const tips = container.querySelector(".xgTips");

        if (tips.innerText === "网页全屏Y") {
          container.querySelector(".xgplayer-icon").click();
        }
      },
    },
    {
      selectors: [
        ".live-main #BottomLayout",
        ".live-main #EcmoCardLayout",
        ".live-main #GiftEffectLayout",
        ".live-main #GiftMenuLayout",
        ".live-main #GiftTrayLayout",
        ".live-main #LikeLayout",
        ".live-main #LinkMicAnimationLayout",
        ".live-main #LinkMicBackgroundLayout",
        ".live-main #LinkMicLayout",
        ".live-main #PlayerControlLayout",
        ".live-main #ServiceCenterLayout",
        ".live-main #ShortTouchLayout",
        ".live-main #TipsLayout",
        ".live-main #WaterMarkLayout",
        ".live-main .__leftContainer > div:not(:first-child)",
        '.live-main [data-e2e="hour-rank-entrance"]',
        '.live-main [data-e2e="exhibition-banner"]',
      ],
      actions: (selectors) => {
        selectors.forEach((selector) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => el.remove());
        });
      },
    },
    {
      selectors: [".live-main .__livingPlayer__"],
      actions: (selectors) => {
        selectors.forEach((selector) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            el.setAttribute("style", "padding: 0 !important;");
          });
        });
      },
    },
  ];

  const log = (...args) => console.log("[抖音高清]", ...args);
  const logSuccess = (...args) => log("✅", ...args);
  const logFail = (...args) => log("❎", ...args);

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  let timeoutId = null;

  // Debounce工具函数
  const debounce = (fn, delay = CONFIG.DELAY_DEBOUNCE) => {
    let debounceTimer = null;
    return (...args) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => fn(...args), delay);
    };
  };

  // 延迟函数
  const delay = (fn, ms = CONFIG.DELAY_DOM) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = fn();
        resolve(result);
      }, ms);
    });
  };

  // 处理规则
  const run = async (retry = 1) => {
    log(`执行规则 (第${retry}次)`);

    const done = await delay(() => {
      RULES.forEach((rule) => {
        rule.actions(rule.selectors);
      });
      return true;
    });

    if (done) {
      logSuccess("规则执行成功");
      return true;
    }

    if (retry < CONFIG.RETRY_MAX) {
      log(`规则执行失败，${CONFIG.DELAY}ms后重试`);
      await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY));
      return run(retry + 1);
    }

    logFail("达到最大重试次数，中断执行");
    return false;
  };

  // 画质检查
  const check = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(run, CONFIG.DELAY);
  };

  // 导航事件监听
  const isNavEvent = (event) =>
    CONFIG.NAV_KEYS.includes(event.key) || CONFIG.NAV_KEYS.includes(event.code);

  // 按键事件监听
  document.addEventListener(
    "keydown",
    debounce((e) => {
      if (isNavEvent(e)) {
        check();
      }
    })
  );

  // 滚轮事件监听
  document.addEventListener(
    "wheel",
    debounce((e) => {
      if (Math.abs(e.deltaY) > 0) {
        check();
      }
    })
  );

  // 路由变化事件监听
  window.addEventListener("popstate", debounce(check));

  // 路由变化事件监听
  window.addEventListener("hashchange", debounce(check));

  // 拦截 history.pushState
  history.pushState = (...args) => {
    originalPushState.apply(history, args);
    check();
  };

  // 拦截 history.replaceState
  history.replaceState = (...args) => {
    originalReplaceState.apply(history, args);
    check();
  };

  // 初始化
  check();
})();
