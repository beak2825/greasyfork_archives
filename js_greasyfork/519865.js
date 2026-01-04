// ==UserScript==
// @name         ✨ OpenWebUI提示词助手(兼容v0.5.20)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为OpenWebUI的高级系统提示词加入类似nextchat的面具功能
// @author       tutrabbit
// @match        https://127.0.0.1:8080/*
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://s2.loli.net/2024/12/05/lrYpNuECMKzHwOb.png
// @supportURL   https://github.com/susmouse/open-webui-prompt-helper
// @license      CC-BY-NC-4.0
// @downloadURL https://update.greasyfork.org/scripts/519865/%E2%9C%A8%20OpenWebUI%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%8A%A9%E6%89%8B%28%E5%85%BC%E5%AE%B9v0520%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519865/%E2%9C%A8%20OpenWebUI%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%8A%A9%E6%89%8B%28%E5%85%BC%E5%AE%B9v0520%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 默认提示词配置
  const defaultPrompts = [
    {
      name: "通用助手",
      prompt:
        "我希望你作为一个专业的助手，帮助我解决各种问题。请用简洁、清晰的语言回答我的问题。",
    },
    {
      name: "外卖好评助手",
      prompt:
        "请你帮我写一则外卖好评，要求语言自然、真诚，突出商家的特色和优点，字数在50-100字之间。",
    },
  ];

  // 初始化提示词
  function initPrompts() {
    const savedPrompts = GM_getValue("prompts");
    if (!savedPrompts) {
      GM_setValue("prompts", defaultPrompts);
    }
    return GM_getValue("prompts");
  }

  // 创建按钮样式
  const style = document.createElement("style");
  style.textContent = `
        .prompt-helper-btn {
            color: #000;
            margin: 3px;
            padding: 3px 6px;
            border: 1px solid #ccc;
            border-radius: 3px;
            background-color: #f8f9fa;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            font-size: 12px;
        }
        .prompt-helper-btn:hover {
            background-color: #e9ecef;
        }
        .prompt-name {
            color: #000;
            margin-right: 3px;
            cursor: pointer;
        }
        .delete-btn {
            cursor: pointer;
            color: #dc3545;
            padding: 0 3px;
            border-left: 1px solid #ccc;
        }
        .prompt-helper-container {
            margin: 6px 0;
            display: flex;
            flex-wrap: wrap;
            gap: 3px;
        }
        @media (max-width: 768px) {
            .prompt-helper-btn {
                padding: 2px 4px;
                font-size: 10px;
            }
            .prompt-helper-container {
                margin: 4px 0;
            }
        }
    `;
  document.head.appendChild(style);

  // 创建按钮容器
  function createButtonContainer(textarea) {
    const container = document.createElement("div");
    container.className = "prompt-helper-container";
    return container;
  }

  // 创建单个按钮
  function createButton(prompt, container, textarea) {
    const btn = document.createElement("div");
    btn.className = "prompt-helper-btn";

    const nameSpan = document.createElement("span");
    nameSpan.className = "prompt-name";
    nameSpan.textContent = prompt.name;
    nameSpan.onclick = () => {
      textarea.value = prompt.prompt;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";

      // 模拟用户输入，实现对提示词的保存
      const event = new Event("input", { bubbles: true });
      textarea.dispatchEvent(event);
    };

    const deleteSpan = document.createElement("span");
    deleteSpan.className = "delete-btn";
    deleteSpan.textContent = "-";
    deleteSpan.onclick = () => {
      const prompts = GM_getValue("prompts");
      const newPrompts = prompts.filter((p) => p.name !== prompt.name);
      GM_setValue("prompts", newPrompts);
      refreshButtons(container, textarea);
    };

    btn.appendChild(nameSpan);
    btn.appendChild(deleteSpan);
    return btn;
  }

  // 创建添加按钮
  function createAddButton(container, textarea) {
    const btn = document.createElement("button");
    btn.className = "prompt-helper-btn";
    btn.textContent = "+";
    btn.onclick = () => {
      const name = prompt("请输入提示词名称：");
      if (!name) return;
      const promptText = prompt("请输入提示词内容：");
      if (!promptText) return;

      const prompts = GM_getValue("prompts");
      prompts.push({ name, prompt: promptText });
      GM_setValue("prompts", prompts);
      refreshButtons(container, textarea);
    };
    return btn;
  }

  // 刷新按钮
  function refreshButtons(container, textarea) {
    container.innerHTML = "";
    const prompts = GM_getValue("prompts");
    prompts.forEach((prompt) => {
      container.appendChild(createButton(prompt, container, textarea));
    });
    container.appendChild(createAddButton(container, textarea));
  }

  // 主函数
  function init() {
    // 使用更通用的选择器来定位文本框，忽略动态ID部分
    const textarea = document.querySelector(
      "div.pt-8 div.dark\\:text-gray-200.text-sm.font-primary.py-0\\.5.px-0\\.5 > div:nth-child(3) > div:nth-child(2) > div > textarea"
    );

    if (!textarea) {
      //   console.log("没有找到文本框");
      setTimeout(init, 500);
      return;
    }

    // 检查是否已经初始化
    if (textarea.getAttribute("data-prompt-helper-initialized")) {
      return;
    }

    console.log("找到文本框:", textarea);

    // 标记该textarea已经初始化
    textarea.setAttribute("data-prompt-helper-initialized", "true");

    initPrompts();
    const container = createButtonContainer(textarea);
    // 将按钮容器插入到文本框之前
    textarea.parentElement.insertBefore(container, textarea);
    refreshButtons(container, textarea);
  }

  // 创建MutationObserver来监听DOM变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" || mutation.type === "subtree") {
        init();
      }
    });
  });

  // 监听整个文档的变化
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // 启动脚本
  init();
})();
