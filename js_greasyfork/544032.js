// ==UserScript==
// @name         OpenMindClub 标题导航器
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  为 OpenMindClub 网页提供悬浮标题导航功能，支持自动主题切换
// @author       awyugan
// @match        https://m.openmindclub.com/stu/*/homework*
// @match        https://m.openmindclub.com/stu/*/discussion
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544032/OpenMindClub%20%E6%A0%87%E9%A2%98%E5%AF%BC%E8%88%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/544032/OpenMindClub%20%E6%A0%87%E9%A2%98%E5%AF%BC%E8%88%AA%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 配置
  const CONFIG = {
    storageKey: "omc_heading_navigator_collapsed",
    refreshInterval: 1500, // 2秒检查一次DOM变化
    maxRetries: 30, // 最多重试30次（1分钟）
  };

  let floatingPanel = null;
  let retryCount = 0;
  let lastHeadingCount = 0;
  let currentTheme = "dark";

  // 获取本地存储的折叠状态
  function getCollapsedState() {
    return GM_getValue(CONFIG.storageKey, false);
  }

  // 保存折叠状态到本地存储
  function saveCollapsedState(collapsed) {
    GM_setValue(CONFIG.storageKey, collapsed);
  }

  // 检测页面主题
  function detectTheme() {
    // 检测系统暗色模式偏好
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // 检测页面背景色
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const htmlBg = window.getComputedStyle(document.documentElement).backgroundColor;

    // 检测页面是否有暗色类名
    const hasDarkClass =
      document.documentElement.classList.contains("dark") ||
      document.body.classList.contains("dark") ||
      document.documentElement.classList.contains("theme-dark") ||
      document.body.classList.contains("theme-dark");

    // 综合判断
    if (hasDarkClass) return "dark";

    // 检查背景色亮度
    const getBrightness = (color) => {
      if (color === "rgba(0, 0, 0, 0)" || color === "transparent") return null;
      const rgb = color.match(/\d+/g);
      if (!rgb) return null;
      return (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
    };

    const bodyBrightness = getBrightness(bodyBg);
    const htmlBrightness = getBrightness(htmlBg);

    // 如果能检测到背景色且较暗，使用深色主题
    if (bodyBrightness !== null && bodyBrightness < 128) return "dark";
    if (htmlBrightness !== null && htmlBrightness < 128) return "dark";

    // 如果检测不到明确的背景色，使用系统偏好
    if (bodyBrightness === null && htmlBrightness === null && prefersDark) return "dark";

    return "light";
  }

  // 获取主题样式
  function getThemeStyles(theme) {
    if (theme === "dark") {
      return {
        background: "#2d2d2d",
        border: "#404040",
        headerBg: "#3a3a3a",
        headerHover: "#434343",
        textColor: "#e8e8e8",
        itemColor: "#d0d0d0",
        itemHover: "rgba(255, 255, 255, 0.05)",
        toggleColor: "#b8b8b8",
        arrowColor: "#888",
        emptyColor: "#888",
        scrollTrack: "#333",
        scrollThumb: "#555",
        scrollThumbHover: "#777",
      };
    } else {
      return {
        background: "#ffffff",
        border: "#e0e0e0",
        headerBg: "#f8f9fa",
        headerHover: "#f0f1f2",
        textColor: "#333333",
        itemColor: "#555555",
        itemHover: "rgba(0, 0, 0, 0.05)",
        toggleColor: "#666666",
        arrowColor: "#999999",
        emptyColor: "#6c757d",
        scrollTrack: "#f1f1f1",
        scrollThumb: "#c1c1c1",
        scrollThumbHover: "#a8a8a8",
      };
    }
  }

  // 创建悬浮窗样式
  function createStyles(theme = "dark") {
    const colors = getThemeStyles(theme);
    const style = document.createElement("style");
    style.id = "omc-navigator-styles";
    style.textContent = `
            #omc-heading-navigator {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 280px;
                max-height: 80vh;
                background: ${colors.background};
                border: 1px solid ${colors.border};
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, ${theme === "dark" ? "0.3" : "0.15"});
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 13px;
                overflow: hidden;
                transition: all 0.3s ease;
                color: ${colors.textColor};
            }

            #omc-heading-navigator.collapsed {
                height: 36px !important;
            }

            .omc-nav-header {
                background: ${colors.headerBg};
                padding: 8px 12px;
                border-bottom: 1px solid ${colors.border};
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                user-select: none;
            }

            .omc-nav-header:hover {
                background: ${colors.headerHover};
            }

            .omc-nav-title {
                font-weight: 500;
                color: ${colors.textColor};
                margin: 0;
                font-size: 13px;
            }

            .omc-nav-toggle {
                background: none;
                border: none;
                font-size: 12px;
                cursor: pointer;
                color: ${colors.toggleColor};
                padding: 2px;
                transition: transform 0.3s ease;
            }

            .omc-nav-toggle.collapsed {
                transform: rotate(-90deg);
            }

            .omc-nav-content {
                max-height: calc(80vh - 50px);
                overflow-y: auto;
                padding: 6px 0;
                background: ${colors.background};
            }

            .omc-nav-content.collapsed {
                display: none;
            }

            .omc-heading-item {
                padding: 6px 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                position: relative;
                color: ${colors.itemColor};
                line-height: 1.3;
            }

            .omc-heading-item:hover {
                background: ${colors.itemHover};
                color: ${colors.textColor};
            }

            .omc-heading-item.has-children {
                cursor: pointer;
            }

            .omc-heading-toggle {
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 4px;
                color: ${colors.arrowColor};
                font-size: 10px;
                transition: transform 0.2s ease;
                flex-shrink: 0;
            }

            .omc-heading-toggle.expanded {
                transform: rotate(90deg);
            }

            .omc-heading-toggle:hover {
                color: ${colors.textColor};
            }

            .omc-heading-text {
                flex: 1;
                color: inherit;
                font-size: 13px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            /* 层级缩进样式 */
            .omc-heading-item[data-level="1"] { padding-left: 12px; }
            .omc-heading-item[data-level="2"] { padding-left: 28px; }
            .omc-heading-item[data-level="3"] { padding-left: 44px; }
            .omc-heading-item[data-level="4"] { padding-left: 60px; }
            .omc-heading-item[data-level="5"] { padding-left: 76px; }
            .omc-heading-item[data-level="6"] { padding-left: 92px; }

            /* 折叠状态 */
            .omc-heading-children.collapsed {
                display: none;
            }

            .omc-nav-empty {
                padding: 20px 12px;
                text-align: center;
                color: ${colors.emptyColor};
                font-style: italic;
                font-size: 12px;
            }

            .omc-nav-loading {
                padding: 15px 12px;
                text-align: center;
                color: ${colors.emptyColor};
                font-size: 12px;
            }

            /* 滚动条样式 */
            .omc-nav-content::-webkit-scrollbar {
                width: 4px;
            }

            .omc-nav-content::-webkit-scrollbar-track {
                background: ${colors.scrollTrack};
            }

            .omc-nav-content::-webkit-scrollbar-thumb {
                background: ${colors.scrollThumb};
                border-radius: 2px;
            }

            .omc-nav-content::-webkit-scrollbar-thumb:hover {
                background: ${colors.scrollThumbHover};
            }
        `;

    // 移除旧样式
    const oldStyle = document.getElementById("omc-navigator-styles");
    if (oldStyle) {
      oldStyle.remove();
    }

    document.head.appendChild(style);
  }

  // 更新主题
  function updateTheme() {
    const newTheme = detectTheme();
    if (newTheme !== currentTheme) {
      currentTheme = newTheme;
      createStyles(currentTheme);
      console.log(`OpenMindClub 标题导航器切换到${currentTheme === "dark" ? "深色" : "浅色"}主题`);
    }
  }

  // 创建悬浮窗HTML结构
  function createFloatingPanel() {
    const panel = document.createElement("div");
    panel.id = "omc-heading-navigator";

    const collapsed = getCollapsedState();
    if (collapsed) {
      panel.classList.add("collapsed");
    }

    panel.innerHTML = `
            <div class="omc-nav-header">
                <h3 class="omc-nav-title">大纲</h3>
                <button class="omc-nav-toggle ${collapsed ? "collapsed" : ""}">▼</button>
            </div>
            <div class="omc-nav-content ${collapsed ? "collapsed" : ""}">
                <div class="omc-nav-loading">正在加载标题...</div>
            </div>
        `;

    // 添加点击事件
    const header = panel.querySelector(".omc-nav-header");
    const content = panel.querySelector(".omc-nav-content");
    const toggle = panel.querySelector(".omc-nav-toggle");

    header.addEventListener("click", function () {
      const isCollapsed = panel.classList.toggle("collapsed");
      content.classList.toggle("collapsed", isCollapsed);
      toggle.classList.toggle("collapsed", isCollapsed);
      saveCollapsedState(isCollapsed);
    });

    document.body.appendChild(panel);
    return panel;
  }

  // 获取页面中的所有标题
  function getHeadings() {
    const headings = [];
    const headingElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

    headingElements.forEach((heading, index) => {
      // 排除我们自己的导航器中的标题
      if (heading.closest("#omc-heading-navigator")) {
        return;
      }

      const text = heading.textContent.trim();
      if (text) {
        const level = parseInt(heading.tagName.charAt(1));
        headings.push({
          element: heading,
          level: level,
          tagName: heading.tagName.toLowerCase(),
          text: text,
          id: heading.id || `heading-${index}`,
          children: [],
          collapsed: GM_getValue(`collapsed_${heading.id || `heading-${index}`}`, false),
        });
      }
    });

    return buildHeadingTree(headings);
  }

  // 构建标题树结构
  function buildHeadingTree(headings) {
    const tree = [];
    const stack = [];

    headings.forEach((heading) => {
      // 找到合适的父级
      while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
        stack.pop();
      }

      if (stack.length === 0) {
        tree.push(heading);
      } else {
        stack[stack.length - 1].children.push(heading);
      }

      stack.push(heading);
    });

    return tree;
  }

  // 渲染标题树
  function renderHeadingTree(headings, level = 1) {
    let html = "";

    headings.forEach((heading) => {
      const hasChildren = heading.children && heading.children.length > 0;
      const isCollapsed = heading.collapsed;

      html += `
        <div class="omc-heading-item ${hasChildren ? "has-children" : ""}"
             data-target="${heading.id}"
             data-level="${level}">
          ${
            hasChildren
              ? `<span class="omc-heading-toggle ${!isCollapsed ? "expanded" : ""}" data-heading-id="${heading.id}">▶</span>`
              : '<span class="omc-heading-toggle"></span>'
          }
          <span class="omc-heading-text">${heading.text}</span>
        </div>
      `;

      if (hasChildren) {
        html += `<div class="omc-heading-children ${isCollapsed ? "collapsed" : ""}" data-parent="${heading.id}">`;
        html += renderHeadingTree(heading.children, level + 1);
        html += "</div>";
      }
    });

    return html;
  }

  // 更新悬浮窗内容
  function updateFloatingPanel() {
    if (!floatingPanel) return;

    const headingTree = getHeadings();
    const content = floatingPanel.querySelector(".omc-nav-content");

    if (headingTree.length === 0) {
      content.innerHTML = '<div class="omc-nav-empty">暂未发现页面标题</div>';
      return false;
    }

    // 计算总标题数
    function countHeadings(tree) {
      let count = 0;
      tree.forEach((heading) => {
        count++;
        if (heading.children) {
          count += countHeadings(heading.children);
        }
      });
      return count;
    }

    lastHeadingCount = countHeadings(headingTree);

    const html = renderHeadingTree(headingTree);
    content.innerHTML = html;

    // 添加事件监听
    addEventListeners(content, headingTree);

    return true;
  }

  // 添加事件监听器
  function addEventListeners(content, headingTree) {
    // 点击切换折叠状态
    content.querySelectorAll(".omc-heading-toggle").forEach((toggle) => {
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        const headingId = this.getAttribute("data-heading-id");
        if (!headingId) return;

        const childrenContainer = content.querySelector(`[data-parent="${headingId}"]`);
        const isCollapsed = childrenContainer.classList.contains("collapsed");

        childrenContainer.classList.toggle("collapsed", !isCollapsed);
        this.classList.toggle("expanded", isCollapsed);

        // 保存折叠状态
        GM_setValue(`collapsed_${headingId}`, !isCollapsed);
      });
    });

    // 点击标题跳转
    content.querySelectorAll(".omc-heading-text").forEach((textElement) => {
      textElement.addEventListener("click", function () {
        const item = this.closest(".omc-heading-item");
        const targetId = item.getAttribute("data-target");

        // 查找目标元素
        function findHeadingById(tree, id) {
          for (const heading of tree) {
            if (heading.id === id) return heading;
            if (heading.children) {
              const found = findHeadingById(heading.children, id);
              if (found) return found;
            }
          }
          return null;
        }

        const targetHeading = findHeadingById(headingTree, targetId);
        if (targetHeading && targetHeading.element) {
          targetHeading.element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // 高亮效果
          targetHeading.element.style.transition = "background-color 0.3s ease";
          targetHeading.element.style.backgroundColor = "#fff3cd";
          setTimeout(() => {
            targetHeading.element.style.backgroundColor = "";
          }, 2000);
        }
      });
    });
  }

  // 检查页面内容变化
  function checkForChanges() {
    const currentHeadingCount = document.querySelectorAll("h1, h2, h3, h4, h5, h6").length;

    if (currentHeadingCount !== lastHeadingCount) {
      updateFloatingPanel();
    }

    // 如果还没有找到标题且重试次数未超限，继续检查
    if (currentHeadingCount === 0 && retryCount < CONFIG.maxRetries) {
      retryCount++;
      setTimeout(checkForChanges, CONFIG.refreshInterval);
    } else if (currentHeadingCount > 0) {
      retryCount = 0; // 重置重试计数
      // 找到标题后，定期检查变化
      setTimeout(checkForChanges, CONFIG.refreshInterval);
    }
  }

  // 初始化脚本
  function init() {
    // 检测并设置初始主题
    currentTheme = detectTheme();
    createStyles(currentTheme);

    // 创建悬浮窗
    floatingPanel = createFloatingPanel();

    // 初始更新
    updateFloatingPanel();

    // 开始检查变化
    setTimeout(checkForChanges, 1000);

    // 监听主题变化
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addListener(updateTheme);

    // 监听页面类名变化
    const observer = new MutationObserver(() => {
      setTimeout(updateTheme, 100); // 延迟检测，确保样式已应用
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    console.log(`OpenMindClub 标题导航器已启动 (${currentTheme === "dark" ? "深色" : "浅色"}主题)`);
  }

  // 等待页面完全加载后初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
