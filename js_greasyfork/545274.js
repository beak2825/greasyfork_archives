// ==UserScript==
// @name         Notion标题真实编号工具
// @namespace    https://floritange.github.io/
// @version      1.0.1
// @description  为Notion页面提供标题编号和目录管理功能，支持一键添加/移除编号、创建/删除目录，直接修改文本内容，永久保存到文档中
// @author       goutan
// @match        https://www.notion.so/*
// @grant        none
// @run-at       document-end
// @license      Apache-2.0
// @noframes
// @icon         https://www.notion.so/front-static/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/545274/Notion%E6%A0%87%E9%A2%98%E7%9C%9F%E5%AE%9E%E7%BC%96%E5%8F%B7%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/545274/Notion%E6%A0%87%E9%A2%98%E7%9C%9F%E5%AE%9E%E7%BC%96%E5%8F%B7%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 全局状态管理
  const state = {
    isEnabled: false, // 当前是否启用真实编号
    processedHeadings: new Map(), // 记录已处理的标题 {blockId: originalText}
    isProcessing: false, // 防止重复处理
  };

  // console.log("[HeadingNumbering] 脚本启动");

  // 工具函数：延迟执行
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 检查文本是否已有编号 - 扩展匹配模式
  const hasNumbering = (text) => {
    const trimmed = text.trim();
    // 匹配 "1. " "1.1 " "1.1.1 " 等各种编号格式，包括末尾可能没有空格的情况
    return (
      /^\d+(\.\d+)*\.(\s|$)/.test(trimmed) || /^\d+(\.\d+)*\s/.test(trimmed)
    );
  };

  // 移除文本中的编号 - 扩展替换模式
  const stripNumbering = (text) => {
    // 移除 "1. " "1.1 " "1.1.1 " 等格式，处理末尾空格变化
    return text.replace(/^\d+(\.\d+)*\.?\s*/, "").trim();
  };

  // 模拟用户输入到元素
  const simulateInput = async (element, newText) => {
    try {
      element.focus(); // 聚焦元素
      await sleep(20);

      // 全选现有内容
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
      await sleep(10);

      // 触发输入事件序列
      element.dispatchEvent(
        new InputEvent("beforeinput", {
          bubbles: true,
          inputType: "insertReplacementText",
          data: newText,
        })
      );

      element.textContent = newText; // 设置新文本
      element.dispatchEvent(new InputEvent("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));

      // 光标移到末尾
      range.setStart(element, element.childNodes.length);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      return true;
    } catch (error) {
      return false;
    }
  };

  // 获取页面所有标题元素，按DOM顺序排序
  const getHeadingElements = () => {
    const allHeadings = []; // 存储所有找到的标题
    const processedIds = new Set();

    // 获取所有标题元素（不分类型）
    const headingElements = document.querySelectorAll(
      [
        '.notion-page-content [placeholder="Heading 1"]',
        '.notion-page-content [placeholder="Heading 2"]',
        '.notion-page-content [placeholder="Heading 3"]',
      ].join(", ")
    );

    headingElements.forEach((element) => {
      // 跳过隐藏或不可编辑的元素
      if (
        element.closest('[aria-hidden="true"]') ||
        element.getAttribute("contenteditable") === "false"
      )
        return;

      const blockElement = element.closest("[data-block-id]");
      if (!blockElement) return;

      const blockId = blockElement.getAttribute("data-block-id");
      if (!blockId || processedIds.has(blockId)) return;
      processedIds.add(blockId);

      // 确定标题级别
      const placeholder = element.getAttribute("placeholder");
      let level = 0;
      if (placeholder === "Heading 1") level = 1;
      else if (placeholder === "Heading 2") level = 2;
      else if (placeholder === "Heading 3") level = 3;

      if (level > 0) {
        allHeadings.push({
          id: blockId,
          level: level,
          element: element,
          text: element.textContent || "",
          position: element.getBoundingClientRect().top, // 添加位置信息用于排序
        });
      }
    });

    // 按页面位置排序，确保编号顺序正确
    return allHeadings.sort((a, b) => a.position - b.position);
  };

  // 生成编号文本
  const generateNumbers = (headings) => {
    const counters = [0, 0, 0]; // [H1, H2, H3] 计数器
    const numberedHeadings = [];

    headings.forEach((heading) => {
      let numberText = "";

      if (heading.level === 1) {
        counters[0]++;
        counters[1] = 0;
        counters[2] = 0;
        numberText = `${counters[0]}. `;
      } else if (heading.level === 2) {
        counters[1]++;
        counters[2] = 0;
        numberText = `${counters[0]}.${counters[1]} `;
      } else if (heading.level === 3) {
        counters[2]++;
        numberText = `${counters[0]}.${counters[1]}.${counters[2]} `;
      }

      numberedHeadings.push({
        ...heading,
        numberText: numberText,
        originalText: stripNumbering(heading.text),
      });
    });

    return numberedHeadings;
  };

  // 模拟Ctrl+S保存操作
  const saveDocument = async () => {
    try {
      // 模拟Ctrl+S快捷键
      const saveEvent = new KeyboardEvent("keydown", {
        key: "s",
        code: "KeyS",
        ctrlKey: true,
        metaKey: navigator.platform.includes("Mac"), // Mac使用Cmd键
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(saveEvent);
    } catch (error) {
      // 保存失败静默处理
    }
  };

  // 添加/刷新编号到所有标题 - 智能处理已有编号
  const addOrRefreshNumbering = async () => {
    if (state.isProcessing) return;
    state.isProcessing = true;

    try {
      // console.log("[HeadingNumbering] 开始处理编号");

      const headings = getHeadingElements();
      if (headings.length === 0) return;

      // 先清理所有现有编号，获取纯净文本
      const cleanHeadings = headings.map((heading) => ({
        ...heading,
        originalText: stripNumbering(heading.text), // 统一清理编号
      }));

      const numberedHeadings = generateNumbers(cleanHeadings);
      let processedCount = 0;

      // 逐个添加编号
      for (const heading of numberedHeadings) {
        const newText = heading.numberText + heading.originalText;
        if (heading.text !== newText) {
          // 只处理需要更新的标题
          const success = await simulateInput(heading.element, newText);
          if (success) {
            processedCount++;
            await sleep(50);
          }
        }
      }

      state.isEnabled = true;
      // console.log(
      //   `[HeadingNumbering] 编号完成，处理了 ${processedCount} 个标题`
      // );

      // 操作完成后保存文档
      await sleep(100); // 等待DOM更新
      await saveDocument();
    } catch (error) {
      console.error("[HeadingNumbering] 编号失败:", error);
    } finally {
      state.isProcessing = false;
    }
  };

  // 移除所有标题编号
  const clearNumbering = async () => {
    if (state.isProcessing) return;
    state.isProcessing = true;

    try {
      // console.log("[HeadingNumbering] 开始移除编号");

      const headings = getHeadingElements();
      let processedCount = 0;

      for (const heading of headings) {
        const currentText = heading.text;
        if (hasNumbering(currentText)) {
          const cleanText = stripNumbering(currentText);
          const success = await simulateInput(heading.element, cleanText);
          if (success) {
            processedCount++;
            await sleep(50);
          }
        }
      }

      state.isEnabled = false;
      state.processedHeadings.clear();
      // console.log(
      //   `[HeadingNumbering] 移除完成，处理了 ${processedCount} 个标题`
      // );

      // 操作完成后保存文档
      await sleep(100);
      await saveDocument();
    } catch (error) {
      console.error("[HeadingNumbering] 移除编号失败:", error);
    } finally {
      state.isProcessing = false;
    }
  };

  // 查找目录块和分割线块
  const findTocAndDivider = () => {
    // 查找目录块：使用更精确的选择器
    const tocBlock =
      document
        .querySelector("[data-block-id] .notion-table_of_contents-block")
        ?.closest("[data-block-id]") ||
      document.querySelector(".notion-table_of_contents-block");

    if (!tocBlock) {
      return { tocBlock: null, dividerBlock: null };
    }

    // 查找下一个分割线块
    let dividerBlock = null;
    let nextSibling = tocBlock.nextElementSibling;

    // 查找紧邻的分割线块
    while (nextSibling && !dividerBlock) {
      // 检查是否为分割线块
      if (
        nextSibling.querySelector(".notion-divider-block") ||
        nextSibling.classList.contains("notion-divider-block") ||
        nextSibling.querySelector('[role="separator"]')
      ) {
        dividerBlock = nextSibling;
        break;
      }
      nextSibling = nextSibling.nextElementSibling;
    }

    return { tocBlock, dividerBlock };
  };

  // 获取页面标题（h1元素）
  const getPageTitle = () => {
    // 查找页面标题 h1 元素
    const pageTitle = document.querySelector(
      'h1[placeholder="New page"][contenteditable="true"]'
    );
    return pageTitle;
  };

  // 字符输入函数 - 使用更直接的方式
  const typeCharacters = async (element, text) => {
    try {
      // 确保元素处于编辑状态
      element.click();
      element.focus();
      await sleep(50);

      // 逐字符输入
      for (const char of text) {
        // 使用document.execCommand插入字符（更可靠）
        if (document.execCommand) {
          document.execCommand("insertText", false, char);
        } else {
          // 备用方案：直接操作textContent
          const currentText = element.textContent || "";
          element.textContent = currentText + char;

          // 触发input事件
          element.dispatchEvent(
            new InputEvent("input", {
              bubbles: true,
              inputType: "insertText",
              data: char,
            })
          );
        }

        // 特殊字符延时
        if (char === "/") {
          await sleep(200); // 斜杠后等待菜单
        } else {
          await sleep(20); // 普通字符延时
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  // 回车函数
  const pressEnter = async (element) => {
    try {
      element.focus();
      await sleep(20);

      // 使用更简单的回车事件
      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        bubbles: true,
        cancelable: true,
      });

      element.dispatchEvent(enterEvent);
      await sleep(100);

      return true;
    } catch (error) {
      return false;
    }
  };

  // 创建目录
  const createTableOfContents = async () => {
    if (state.isProcessing) return;
    state.isProcessing = true;

    try {
      // console.log("[TOC] 开始创建目录");

      const { tocBlock } = findTocAndDivider();
      if (tocBlock) return;

      // 1. 找到页面标题
      const pageTitle = getPageTitle();
      if (!pageTitle) return;

      // 2. 点击标题进入编辑，光标到末尾
      pageTitle.click();
      pageTitle.focus();
      await sleep(100);

      // 光标移到末尾
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(pageTitle);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      await sleep(50);

      // 3. 回车创建新行
      await pressEnter(pageTitle);
      await sleep(300);

      // 4. 重新定位到第一个空行
      let targetElement = null;
      const editableElements = document.querySelectorAll(
        '[contenteditable="true"]'
      );

      // 查找第一个空的可编辑元素
      for (const elem of editableElements) {
        if (!elem.textContent.trim() && elem !== pageTitle) {
          targetElement = elem;
          break;
        }
      }

      if (!targetElement) return;

      // 5. 点击目标元素进入编辑状态
      targetElement.click();
      targetElement.focus();
      await sleep(100);

      // 6. 输入斜杠命令
      await typeCharacters(targetElement, "/table of contents");
      await sleep(100); // 等待菜单

      // 7. 回车选择
      await pressEnter(targetElement);
      await sleep(200);

      // 8. 查找下一个空行输入分割线
      const nextEditableElements = document.querySelectorAll(
        '[contenteditable="true"]'
      );
      let dividerTarget = null;

      for (const elem of nextEditableElements) {
        if (
          !elem.textContent.trim() &&
          elem !== targetElement &&
          elem !== pageTitle
        ) {
          dividerTarget = elem;
          break;
        }
      }

      if (dividerTarget) {
        dividerTarget.click();
        dividerTarget.focus();
        await sleep(100);
        await typeCharacters(dividerTarget, "---");
      }

      // console.log("[TOC] 创建完成");
      await saveDocument();
    } catch (error) {
      console.error("[TOC] 创建失败:", error);
    } finally {
      state.isProcessing = false;
    }
  };

  // 检测页面内容中是否有目录和紧跟的分割线
  const detectTocAndDivider = () => {
    // 在页面内容区域查找目录块
    const tocBlock = document
      .querySelector(".notion-page-content .notion-table_of_contents-block")
      ?.closest("[data-block-id]");

    if (!tocBlock) {
      return {
        hasToc: false,
        hasDivider: false,
        tocBlock: null,
        dividerBlock: null,
      };
    }

    // 检查目录块的直接下一个兄弟元素是否为分割线
    const nextSibling = tocBlock.nextElementSibling;
    let dividerBlock = null;

    // 严格检查：必须是直接相邻且包含分割线标识
    if (
      nextSibling &&
      nextSibling.classList.contains("notion-divider-block") &&
      nextSibling.querySelector('[role="separator"]')
    ) {
      dividerBlock = nextSibling;
    }

    return {
      hasToc: true,
      hasDivider: !!dividerBlock,
      tocBlock,
      dividerBlock,
    };
  };

  // 删除目录
  const removeTableOfContents = async () => {
    if (state.isProcessing) return;
    state.isProcessing = true;

    try {
      // console.log("[TOC] 开始删除目录");

      // 检测目录和分割线
      const { hasToc, hasDivider, tocBlock, dividerBlock } =
        detectTocAndDivider();

      if (hasDivider) {
        // 步骤1：先删除分割线块
        dividerBlock.click(); // 聚焦到分割线
        await sleep(50);

        const deleteEvent1 = new KeyboardEvent("keydown", {
          key: "Backspace",
          code: "Backspace",
          keyCode: 8,
          bubbles: true,
          cancelable: true,
        });
        document.dispatchEvent(deleteEvent1);
        await sleep(200); // 等待分割线删除完成

        // 步骤2：点击目录块重新聚焦
        tocBlock.click(); // 重新点击目录块获得焦点
        await sleep(200); // 等待焦点切换

        // 步骤3：删除目录块
        const deleteEvent2 = new KeyboardEvent("keydown", {
          key: "Backspace",
          code: "Backspace",
          keyCode: 8,
          bubbles: true,
          cancelable: true,
        });
        document.dispatchEvent(deleteEvent2);
        await sleep(200); // 等待目录删除完成
      } else {
        // 只有目录，直接删除目录
        tocBlock.click();
        await sleep(50);

        const deleteEvent = new KeyboardEvent("keydown", {
          key: "Backspace",
          code: "Backspace",
          keyCode: 8,
          bubbles: true,
          cancelable: true,
        });
        document.dispatchEvent(deleteEvent);
        await sleep(200);
      }

      // console.log("[TOC] 删除完成");
      await saveDocument();
    } catch (error) {
      console.error("[TOC] 删除失败:", error);
    } finally {
      state.isProcessing = false;
    }
  };

  // 创建四个控制按钮
  const createControlButtons = () => {
    if (document.getElementById("heading-add-btn")) return;

    const container = document.createElement("div");
    container.style.cssText = `
      position: fixed;
      top: 40px;
      right: 20px;
      display: flex;
      gap: 2px;
      z-index: 9999;
    `;

    // 创建按钮
    const addButton = document.createElement("button");
    addButton.id = "heading-add-btn";
    addButton.innerHTML = "✨";
    addButton.title = "添加/刷新标题编号";

    const clearButton = document.createElement("button");
    clearButton.id = "heading-clear-btn";
    clearButton.innerHTML = "🧹";
    clearButton.title = "移除标题编号";

    const tocButton = document.createElement("button");
    tocButton.id = "toc-add-btn";
    tocButton.innerHTML = "📄";
    tocButton.title = "创建目录";

    const tocRemoveButton = document.createElement("button");
    tocRemoveButton.id = "toc-remove-btn";
    tocRemoveButton.innerHTML = "🔖";
    tocRemoveButton.title = "删除目录";

    const buttonStyle = `
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 2px solid #e1e5e9;
      background: white;
      color: #37352f;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    [addButton, clearButton, tocButton, tocRemoveButton].forEach((btn) => {
      btn.style.cssText = buttonStyle;
    });

    // 绑定按钮事件
    addButton.addEventListener("click", async () => {
      if (state.isProcessing) return;
      addButton.style.opacity = "0.5";
      try {
        await addOrRefreshNumbering();
        addButton.style.background = "#e8f5e8";
      } finally {
        addButton.style.opacity = "1";
      }
    });

    clearButton.addEventListener("click", async () => {
      if (state.isProcessing) return;
      clearButton.style.opacity = "0.5";
      try {
        await clearNumbering();
        addButton.style.background = "white";
      } finally {
        clearButton.style.opacity = "1";
      }
    });

    tocButton.addEventListener("click", async () => {
      if (state.isProcessing) return;
      tocButton.style.opacity = "0.5";
      try {
        await createTableOfContents();
      } finally {
        tocButton.style.opacity = "1";
      }
    });

    tocRemoveButton.addEventListener("click", async () => {
      if (state.isProcessing) return;
      tocRemoveButton.style.opacity = "0.5";
      try {
        await removeTableOfContents();
      } finally {
        tocRemoveButton.style.opacity = "1";
      }
    });

    container.appendChild(addButton);
    container.appendChild(clearButton);
    container.appendChild(tocButton);
    container.appendChild(tocRemoveButton);
    document.body.appendChild(container);
    // console.log("[HeadingNumbering] 按钮创建完成");
  };

  // 检查是否在Notion页面
  const isNotionPage = () => {
    return (
      window.location.hostname.includes("notion.so") ||
      window.location.hostname.includes("notion.site")
    );
  };

  // 等待页面加载完成
  const waitForPageLoad = () => {
    return new Promise((resolve) => {
      if (document.querySelector(".notion-page-content")) {
        resolve();
      } else {
        const observer = new MutationObserver(() => {
          if (document.querySelector(".notion-page-content")) {
            observer.disconnect();
            resolve();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // 设置超时保护，防止无限等待
        setTimeout(() => {
          observer.disconnect();
          resolve();
        }, 10000);
      }
    });
  };

  // 初始化脚本
  const initialize = async () => {
    if (!isNotionPage()) return;

    // console.log("[HeadingNumbering] 页面加载中...");
    await waitForPageLoad();

    setTimeout(() => {
      createControlButtons();
      // console.log("[HeadingNumbering] 初始化完成");
    }, 1500);
  };

  // 启动脚本
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
