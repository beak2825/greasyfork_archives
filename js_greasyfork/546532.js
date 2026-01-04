// ==UserScript==
// @name          B站添加收藏面板优化
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  监听动态生成的div.group-list元素并应用网格布局
// @author       你的名字
// @match        https://www.bilibili.com/*
// @match        https://m.bilibili.com/*
// @match        https://www.bilibili.com/video/*
// @match        https://m.bilibili.com/video/*
// @grant        GM_addStyle
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/546532/B%E7%AB%99%E6%B7%BB%E5%8A%A0%E6%94%B6%E8%97%8F%E9%9D%A2%E6%9D%BF%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/546532/B%E7%AB%99%E6%B7%BB%E5%8A%A0%E6%94%B6%E8%97%8F%E9%9D%A2%E6%9D%BF%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 增强调试日志
  GM_log("脚本开始执行 - 版本0.4");
  console.group("[B站收藏优化] 初始化");
  console.log("当前URL:", location.href);
  console.log("用户代理:", navigator.userAgent);
  console.groupEnd();

  // 定义样式函数
  function applyGridStyles() {
    const css = `
            .collection-m-exp {
                width: 90vw !important;
                height: 90vh !important;
            }
            .collection-m-exp .content {
                height: 85% !important;
                overflow: hidden !important;
            }
            .collection-m-exp .group-list ul {
                display: grid !important;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important;
                gap: 10px !important;
                padding: 10px !important;
            }
            .collection-m-exp .content .group-list li {
                padding-bottom: 0px;
            }
            .fav-title {
                max-width: 70px;
            }
            .group-list {
                max-height: 100% !important;
                overflow: auto; /* 关键属性：内容超出时显示滚动条 */
            }
            .collection-m-exp .content .group-list li input[type='checkbox'] + i {
                margin-right: 0px !important;
            }
        `;
    GM_addStyle(css);
    console.log("[样式] 网格样式已应用");
  }

  // 主逻辑
  function main() {
    console.group("[主逻辑]");
    try {
      applyGridStyles();

      // 检查现有元素
      const existing = document.querySelector(
        ".collection-m-exp .group-list ul"
      );
      if (existing) {
        console.log("[元素] 找到现有收藏面板");
        return;
      }

      // 设置MutationObserver
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            const target = document.querySelector(
              ".collection-m-exp .group-list ul"
            );
            if (target) {
              console.log("[元素] 检测到动态加载的收藏面板");
              observer.disconnect();
            }
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      console.log("[监听] 已开始监听DOM变化");
    } catch (e) {
      console.error("[错误]", e);
    } finally {
      console.groupEnd();
    }
  }

  // 初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      console.log("[事件] DOM已加载");
      main();
    });
  } else {
    console.log("[状态] DOM已就绪");
    main();
  }

  // 点击事件监听
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".collect-btn, .ops-collect");
    if (btn) {
      console.log("[事件] 检测到收藏按钮点击");
      setTimeout(main, 300); // 延迟执行确保弹窗加载
    }
  });
})();
