// ==UserScript==
// @name         PatreonExpander
// @namespace    https://github.com/frosn0w/iOSscripts
// @version      2.25.0803
// @description  Simplify elements, expand contents and comments
// @author       frosn0w
// @match        *://*.patreon.com/*
// @run-at       document-end
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MzYgNDc2Ij48dGl0bGU+UGF0cmVvbiBsb2dvPC90aXRsZT48cGF0aCBkYXRhLWZpbGw9IjEiIGQ9Ik00MzYgMTQzYy0uMDg0LTYwLjc3OC00Ny41Ny0xMTAuNTkxLTEwMy4yODUtMTI4LjU2NUMyNjMuNTI4LTcuODg0IDE3Mi4yNzktNC42NDkgMTA2LjIxNCAyNi40MjQgMjYuMTQyIDY0LjA4OS45ODggMTQ2LjU5Ni4wNTEgMjI4Ljg4M2MtLjc3IDY3LjY1MyA2LjAwNCAyNDUuODQxIDEwNi44MyAyNDcuMTEgNzQuOTE3Ljk0OCA4Ni4wNzItOTUuMjc5IDEyMC43MzctMTQxLjYyMyAyNC42NjItMzIuOTcyIDU2LjQxNy00Mi4yODUgOTUuNTA3LTUxLjkyOUMzOTAuMzA5IDI2NS44NjUgNDM2LjA5NyAyMTMuMDExIDQzNiAxNDNaIj48L3BhdGg+PC9zdmc+
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454728/PatreonExpander.user.js
// @updateURL https://update.greasyfork.org/scripts/454728/PatreonExpander.meta.js
// ==/UserScript==

// 常量统一管理
const CONFIG = {
  MAX_EXECUTIONS: 50,
  INTERVAL_DELAY: 5888,
  REMAIN_DAYS: 1,
  STYLE_ID: "patreon-expander-styles",
};

// 全局样式（合并所有样式，避免重复注入）
const globalStyles = `
    div[data-tag="comment-row"]::before,
    div[data-tag="comment-row"]::after {
      width: 0 !important;
      border-left: 0 !important;
    }
    #TAI-global-id p {
      margin: 8px 0 !important;
      font-size: 17px !important;
      line-height: 1.4 !important;
    }
    #TAI-global-id li p {
      margin: 6px 0 !important;
    }
    #TAI-global-id ul {
      margin: 6px 0 !important;
    }
    #TAI-global-id h3 {
      font-size: 20px !important;
    }
    #TAI-title-id a {
      font-size: 24px !important;
    }
    #TAI-comment-id p div {
    line-height: 1.3 !important;
    }
    #TAI-comment-id div button span {
    font-size: 17px !important;
    }
  `;
// 日期处理器（避免重复计算）
const DateFormatter = {
  currentDate: new Date(),

  refresh() {
    this.currentDate = new Date();
  },

  get formattedDate() {
    return `${this.currentMonth}月${this.currentDay}日`;
  },

  get yesterdayDate() {
    const date = new Date(this.currentDate);
    date.setDate(date.getDate() - 1);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  },

  get currentMonth() {
    return this.currentDate.getMonth() + 1;
  },

  get currentDay() {
    return this.currentDate.getDate();
  },
};
// 安全移除函数
const safeRemove = (() => {
  const removedCache = new WeakSet();
  return (element, selector = null, levels = 0) => {
    if (!element || !element?.parentElement || removedCache.has(element)) {
      return false;
    }
    try {
      const target = selector ? element.closest(selector) : element;
      if (!target) return false;
      let parent = target;
      for (let i = 0; i < levels; i++) parent = parent?.parentElement;
      if (!parent) return false;
      parent.remove();
      removedCache.add(element);
      return true;
    } catch (error) {
      console.error("Removal failed:", error);
      return false;
    }
  };
})();
// 移除过期发布
function shouldRemovePost(text) {
  const { currentMonth, currentDay } = DateFormatter;
  return (
    text.includes(" 天前") ||
    (text.includes(`${currentMonth}月`) &&
      parseInt(text.split(`${currentMonth}月`)[1]) <
        currentDay - CONFIG.REMAIN_DAYS) ||
    (text.includes(`${currentMonth}月`) &&
      parseInt(text.split(`${currentMonth}月`)[0]) === currentMonth - 1)
  );
}

// 处理 a 标签
function processLinks(element) {
  const { textContent, href, dataset } = element;
  switch (true) {
    //格式化日期
    case dataset.tag === "post-published-at" && shouldRemovePost(textContent):
      safeRemove(element, 'div[data-tag="post-card"]', 2);
      break;
    case /小时前|分钟前/.test(textContent):
      element.textContent = DateFormatter.formattedDate;
      break;
    case textContent.includes("昨天"):
      element.textContent = DateFormatter.yesterdayDate;
      break;
    // 移除赠送卡片
    case href === "https://www.patreon.com/user/gift?u=80821958":
      safeRemove(element, null, 4);
      break;
    case textContent === "Skip navigation":
      element.remove();
      break;
    case dataset.tag === "comment-avatar-wrapper":
      safeRemove(element, null, 1);
      break;
  }
}
// 处理 button 标签
function processButtons(button) {
  const { textContent, ariaExpanded, ariaLabel, dataset } = button;
  const BUTTON_INTERVALS = {
    展开: 4888,
    加载更多留言: 1688,
    加载回复: 1888,
  };
  switch (true) {
    // 移除导航栏
    case ariaExpanded === "false" && ariaLabel === "打开导航":
      safeRemove(button, "header");
      break;
    // 移除小屏设备视图的筛选按钮
    case ariaLabel === "creator-public-page-post-all-filters-toggle":
      safeRemove(button, null, 4);
      break;
    case ["收起", "收起回复"].includes(textContent):
      safeRemove(button, null, 1);
      break;
    case textContent === "展开":
    case textContent === "加载更多留言":
    case textContent === "加载回复":
      if (!button.autoClicker) {
        button.autoClicker = setInterval(() => {
          document.contains(button)
            ? button.click()
            : clearInterval(button.autoClicker);
        }, BUTTON_INTERVALS[textContent]);
      }
      break;
    case dataset.tag === "commenter-name" &&
      textContent === "贝乐斯 Think Analyze Invest":
      button.textContent = "贝乐斯";
      break;
  }
}
// 处理 Div 标签
function processDivs(element) {
  const { dataset, id, ariaExpanded, textContent } = element;
  switch (true) {
    case id === "main-app-navigation":
      safeRemove(element, null, 1);
      break;
    // 移除导航栏
    case ariaExpanded === "false" && textContent.includes("我的会籍"):
      safeRemove(element, "nav", 3);
      break;
    // 移除头图
    case dataset.tag === "creation-name" &&
      textContent.includes("Love & Peace !"):
      safeRemove(element, null, 4);
      break;
    // 移除搜索框
    case dataset.tag === "search-input-box":
      safeRemove(element, null, 5);
      break;
    case dataset.tag === "chip-container":
      safeRemove(element, null, 2);
      break;
    case dataset.tag === "post-details":
      safeRemove(element);
      break;
    // 移除已移除留言区域
    case dataset.tag === "comment-body" &&
      textContent.includes("此留言已被移除。"):
      safeRemove(element, null, 3);
      break;
    // 移除评论相关功能组件
    case dataset.tag === "comment-actions":
      safeRemove(element);
      break;
    case dataset.tag === "comment-field-box":
      safeRemove(element, null, 3);
      break;
    // 缩窄页边距
    case dataset.tag === "post-stream-container":
      element.parentNode?.style.setProperty("padding-left", "4px");
      element.parentNode?.style.setProperty("padding-right", "4px");
      break;
    // 注入CSS,可单独调控评论区
    case dataset.tag === "comment-body":
      element.parentNode?.classList.add("TAI-comment");
      element.parentNode?.setAttribute("id", "TAI-comment-id");
      break;
  }
}
// 通过span插入CSS标签，控制正文部分格式
function processSpans(element) {
  if (element.getAttribute("data-tag") === "post-title") {
    const targetElement =
      element.parentNode?.parentNode?.parentNode?.parentNode?.parentNode;
    targetElement?.classList.add("TAI-global");
    targetElement?.setAttribute("id", "TAI-global-id");
    element.classList.add("TAI-title");
    element.setAttribute("id", "TAI-title-id");
  }
}
// 主逻辑
(function init() {
  const style = document.createElement("style");
  style.id = CONFIG.STYLE_ID;
  style.textContent = globalStyles;
  document.head.appendChild(style);
  // 主循环
  let executionCount = 0;
  const interval = setInterval(() => {
    if (executionCount >= CONFIG.MAX_EXECUTIONS) return clearInterval(interval);

    DateFormatter.refresh();
    document.querySelectorAll("a").forEach(processLinks);
    document.querySelectorAll("button").forEach(processButtons);
    document.querySelectorAll("div").forEach(processDivs);
    document.querySelectorAll("span").forEach(processSpans);

    executionCount++;
  }, CONFIG.INTERVAL_DELAY);
})();