// ==UserScript==
// @name         Notion标题视觉编号工具
// @namespace    https://floritange.github.io/
// @version      1.0.6
// @description  为Notion页面标题添加视觉编号效果，纯JS实现，不修改原始内容，支持目录同步更新
// @author       goutan
// @match        https://www.notion.so/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      Apache-2.0
// @noframes
// @icon         https://www.notion.so/front-static/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/545157/Notion%E6%A0%87%E9%A2%98%E8%A7%86%E8%A7%89%E7%BC%96%E5%8F%B7%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/545157/Notion%E6%A0%87%E9%A2%98%E8%A7%86%E8%A7%89%E7%BC%96%E5%8F%B7%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 使用 GM_addStyle 注入基础样式
  GM_addStyle(`
    .notion-page-content [placeholder^="Heading"] { 
      position: relative; 
    }
    .notion-page-content [placeholder^="Heading"]::before,
    .table_of_contents .text::before {
      content: "";
      margin-right: .1em;
      pointer-events: none;
      user-select: none;
      font-weight: bold;
    }
    .notion-page-content [placeholder^="Heading"]::before { 
      color: #37352F; 
    }
    h1[placeholder="New page"]::before,
    h1[placeholder*="Untitled"]::before { 
      content: "" !important; 
    }
  `);

  // 动态样式元素，用于添加编号规则
  const dynamicStyle = document.createElement("style");
  dynamicStyle.id = "notion-numbering-dynamic";

  // 确保动态样式已注入
  const ensureDynamicStyle = () => {
    if (!document.getElementById("notion-numbering-dynamic")) {
      (document.head || document.documentElement).appendChild(dynamicStyle);
    }
  };

  // DOM查询工具函数
  const querySelector = (selector, root = document) =>
    root.querySelector(selector);
  const querySelectorAll = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  // 32位字符串转UUID格式
  const formatToUUID = (str) => {
    if (!str || str.length !== 32) return str;
    return str.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
  };

  // 从目录获取标题列表
  const getTableOfContentsItems = () => {
    const tocContainer = querySelector(".table_of_contents");
    if (!tocContainer) return [];

    return querySelectorAll(".block[hash]", tocContainer).reduce(
      (accumulator, block) => {
        const hashValue = block.getAttribute("hash");
        if (!hashValue || hashValue.length !== 32) return accumulator;

        const alignElement = block.querySelector(".align");
        let headingLevel = 0;

        // 检测标题级别
        if (alignElement?.classList.contains("nb-h1")) headingLevel = 1;
        else if (alignElement?.classList.contains("nb-h2")) headingLevel = 2;
        else if (alignElement?.classList.contains("nb-h3")) headingLevel = 3;

        if (headingLevel > 0) {
          accumulator.push({
            id: formatToUUID(hashValue),
            rawId: hashValue,
            level: headingLevel,
          });
        }
        return accumulator;
      },
      []
    );
  };

  // 从页面内容获取标题元素
  const getPageHeadings = () => {
    const processedIds = new Set();
    const headingSelectors = [
      '.notion-page-content [placeholder="Heading 1"]',
      '.notion-page-content [placeholder="Heading 2"]',
      '.notion-page-content [placeholder="Heading 3"]',
    ].join(", ");

    return querySelectorAll(headingSelectors).reduce((accumulator, element) => {
      // 跳过隐藏元素
      if (element.closest('[aria-hidden="true"]')) return accumulator;

      const blockElement = element.closest("[data-block-id]");
      if (!blockElement) return accumulator;

      const blockId = blockElement.getAttribute("data-block-id");
      if (!blockId || processedIds.has(blockId)) return accumulator;

      processedIds.add(blockId);

      const placeholder = element.getAttribute("placeholder") || "";
      let level = 0;
      if (placeholder === "Heading 1") level = 1;
      else if (placeholder === "Heading 2") level = 2;
      else if (placeholder === "Heading 3") level = 3;

      if (level > 0) {
        accumulator.push({
          id: blockId,
          rawId: blockId.replace(/-/g, ""),
          level,
        });
      }
      return accumulator;
    }, []);
  };

  // 生成标题编号
  const generateNumbering = (headingItems) => {
    const counters = [0, 0, 0]; // [H1, H2, H3] 计数器
    const numberingMap = new Map();

    headingItems.forEach((item) => {
      if (item.level === 1) {
        counters[0]++;
        counters[1] = 0;
        counters[2] = 0;
        numberingMap.set(item.id, `${counters[0]}. `);
      } else if (item.level === 2) {
        counters[1]++;
        counters[2] = 0;
        numberingMap.set(item.id, `${counters[0]}.${counters[1]} `);
      } else if (item.level === 3) {
        counters[2]++;
        numberingMap.set(
          item.id,
          `${counters[0]}.${counters[1]}.${counters[2]} `
        );
      }
    });

    return numberingMap;
  };

  // 应用编号样式
  const applyNumberingStyles = (numberingMap, tocItems) => {
    const cssRules = [];

    // 为页面标题生成CSS规则
    numberingMap.forEach((numberLabel, blockId) => {
      cssRules.push(
        `[data-block-id="${blockId}"] [placeholder^="Heading"]::before { content: "${numberLabel}"; }`
      );
    });

    // 为目录标题生成CSS规则
    tocItems.forEach((item) => {
      const numberLabel = numberingMap.get(item.id);
      if (numberLabel) {
        cssRules.push(
          `.table_of_contents .block[hash="${item.rawId}"] .text::before { content: "${numberLabel}"; }`
        );
      }
    });

    // 更新动态样式
    dynamicStyle.textContent = cssRules.join("\n");
  };

  // 防抖控制
  let isScheduled = false;

  // 主要重建逻辑
  const rebuildNumbering = () => {
    ensureDynamicStyle();

    const tocItems = getTableOfContentsItems();
    const sourceItems = tocItems.length > 0 ? tocItems : getPageHeadings();

    if (sourceItems.length > 0) {
      const numberingMap = generateNumbering(sourceItems);
      applyNumberingStyles(numberingMap, tocItems);
    }
  };

  // 防抖调度器
  const scheduleRebuild = () => {
    if (!isScheduled) {
      isScheduled = true;
      setTimeout(() => {
        isScheduled = false;
        rebuildNumbering();
      }, 120);
    }
  };

  // 启动观察器
  const initializeObservers = () => {
    // DOM变化观察器
    const observer = new MutationObserver(scheduleRebuild);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["hash", "data-block-id", "placeholder"],
    });

    // 立即执行一次
    rebuildNumbering();

    // 延迟执行，确保页面完全加载
    setTimeout(rebuildNumbering, 800);

    // 定期检查更新
    setInterval(rebuildNumbering, 3000);
  };

  // 脚本初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeObservers, {
      once: true,
    });
  } else {
    initializeObservers();
  }
})();
