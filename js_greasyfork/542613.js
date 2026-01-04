// ==UserScript==
// @name         抖音自动选择最高画质
// @namespace    douyin-auto-hd
// @author       loerise
// @version      0.4
// @description  在抖音推荐和直播页面自动选择最高画质
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
    RETRY_DELAY: 300,
    MAX_RETRY: 5,
    CONTAINER: ".basePlayerContainer",
    SELECTORS: [
      "xg-icon.xgplayer-playclarity-setting > .gear > .virtual > .item:first-child",
      '[data-e2e="quality-selector"] div:first-child',
    ],
    NAV_KEYS: ["w", "W", "s", "S", "ArrowUp", "ArrowDown", "KeyW", "KeyS"],
  };

  const log = (message) => console.log("[抖音高清]", `${message}`);

  let timeoutId = null;

  // 获取容器并查找画质选项
  const findQualityTargets = () => {
    const containers = Array.from(
      document.querySelectorAll(CONFIG.CONTAINER) || []
    );

    return CONFIG.SELECTORS.map((selector) => {
      return containers.map((container) => container.querySelector(selector));
    })
      .flat()
      .filter((el) => el);
  };

  // 查找画质选项并点击
  const switchQuality = async (retry = 0) => {
    log(`检查画质 (第${retry + 1}次)`);

    const targets = findQualityTargets();

    log(findQualityTargets().length);

    if (targets.length) {
      targets.forEach((target) => target.click());
      log(
        `画质切换成功: ${targets.map((t) => t.textContent?.trim()).join(", ")}`
      );
      return true;
    }

    if (retry < CONFIG.MAX_RETRY) {
      log(`未找到画质选项，${CONFIG.RETRY_DELAY}ms后重试`);
      await new Promise((resolve) => setTimeout(resolve, CONFIG.RETRY_DELAY));
      return switchQuality(retry + 1);
    }

    log("达到最大重试次数，放弃");
    return false;
  };

  // 延时执行画质检查
  const scheduleCheck = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(switchQuality, CONFIG.DELAY);
  };

  // 检测导航事件
  const isNavEvent = (event) =>
    CONFIG.NAV_KEYS.includes(event.key) || CONFIG.NAV_KEYS.includes(event.code);

  // 事件监听
  document.addEventListener("keydown", (e) => {
    if (isNavEvent(e)) {
      log(`键盘导航: ${e.key || e.code}`);
      scheduleCheck();
    }
  });

  document.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) > 0) {
      log(`滚轮导航: ${e.deltaY}`);
      scheduleCheck();
    }
  });

  // 初始化
  log("脚本启动");
  switchQuality();
})();
