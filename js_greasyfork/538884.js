// ==UserScript==
// @name         摸鱼室图片模糊加载
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  默认模糊显示聊天图片，鼠标悬停或点击时显示清晰图片，支持一键屏蔽全部图片
// @author       You
// @match        https://fish.codebug.icu/chat
// @match        https://yucoder.cn/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codebug.icu
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/538884/%E6%91%B8%E9%B1%BC%E5%AE%A4%E5%9B%BE%E7%89%87%E6%A8%A1%E7%B3%8A%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/538884/%E6%91%B8%E9%B1%BC%E5%AE%A4%E5%9B%BE%E7%89%87%E6%A8%A1%E7%B3%8A%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 配置项
  const config = {
    blurLevel: GM_getValue("blurLevel", 10), // 模糊程度
    hideAllImages: GM_getValue("hideAllImages", false), // 是否完全隐藏所有图片
    enableBlur: GM_getValue("enableBlur", true), // 是否启用模糊效果
  };

  // 保存配置
  function saveConfig() {
    GM_setValue("blurLevel", config.blurLevel);
    GM_setValue("hideAllImages", config.hideAllImages);
    GM_setValue("enableBlur", config.enableBlur);
    updateStyles();
    processAllImages();
  }

  // 更新样式
  function updateStyles() {
    // 移除旧样式
    const oldStyle = document.querySelector("style[data-moyu-style]");
    if (oldStyle) {
      oldStyle.remove();
    }

    let imageStyle = "";

    if (config.hideAllImages) {
      imageStyle = "display: none !important;";
    } else if (config.enableBlur) {
      imageStyle = `filter: blur(${config.blurLevel}px); transition: filter 0.3s ease;`;
    } else {
      imageStyle = "filter: blur(0px);";
    }

    const styleContent = `
      .messageImage___L8FDo {
        ${imageStyle}
      }

      ${
        !config.hideAllImages && config.enableBlur
          ? `
      .messageImage___L8FDo:hover,
      .messageImage___L8FDo.clear-image {
        filter: blur(0px);
      }
      `
          : ""
      }

      .image-control {
        position: absolute;
        top: 5px;
        right: 40px;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 12px;
        cursor: pointer;
        z-index: 100;
        display: ${
          config.hideAllImages || !config.enableBlur ? "none" : "block"
        };
      }

      .imageContainer___JmzJP {
        position: relative;
      }

      .moyu-control-panel {
        position: fixed;
        top: 10px;
        right: 10px;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 10px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        display: none;
      }

      .moyu-control-panel.visible {
        display: block;
      }

      .moyu-control-panel h3 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 14px;
      }

      .moyu-control-panel label {
        display: block;
        margin-bottom: 8px;
      }

      .moyu-control-panel button {
        margin-top: 10px;
        padding: 3px 8px;
      }
    `;

    const style = document.createElement("style");
    style.setAttribute("data-moyu-style", "true");
    style.textContent = styleContent;
    document.head.appendChild(style);
  }

  // 注册油猴菜单
  function registerMenuCommands() {
    GM_registerMenuCommand("✅ 启用/禁用模糊效果", toggleBlurEffect);
    GM_registerMenuCommand("🔍 调整模糊程度", adjustBlurLevel);
    GM_registerMenuCommand("⛔ 一键屏蔽所有图片", toggleHideAllImages);
    GM_registerMenuCommand("⚙️ 打开设置面板", showControlPanel);
  }

  // 切换模糊效果
  function toggleBlurEffect() {
    config.enableBlur = !config.enableBlur;
    if (config.hideAllImages && config.enableBlur) {
      config.hideAllImages = false;
    }
    saveConfig();
    alert(`模糊效果已${config.enableBlur ? "启用" : "禁用"}`);
  }

  // 调整模糊程度
  function adjustBlurLevel() {
    const level = prompt("请输入模糊程度 (1-20):", config.blurLevel);
    const newLevel = parseInt(level);
    if (!isNaN(newLevel) && newLevel >= 1 && newLevel <= 20) {
      config.blurLevel = newLevel;
      saveConfig();
      alert(`模糊程度已设置为 ${newLevel}`);
    }
  }

  // 切换隐藏所有图片
  function toggleHideAllImages() {
    config.hideAllImages = !config.hideAllImages;
    if (config.hideAllImages) {
      // 保存当前的模糊状态，以便恢复时使用
      config.previousBlurState = config.enableBlur;
      config.enableBlur = false;
    } else {
      // 当关闭隐藏图片功能时，不自动应用模糊效果
      // 保持模糊效果关闭状态
      config.enableBlur = false;
    }
    saveConfig();

    // 强制重新应用样式
    const styleElement = document.querySelector("style[data-moyu-style]");
    if (styleElement) {
      styleElement.remove();
    }
    updateStyles();
    processAllImages();

    alert(`${config.hideAllImages ? "已屏蔽" : "已显示"}所有图片`);
  }

  // 创建控制面板
  function createControlPanel() {
    const panel = document.createElement("div");
    panel.className = "moyu-control-panel";
    panel.innerHTML = `
      <h3>摸鱼室图片控制面板</h3>
      <label>
        <input type="checkbox" id="enable-blur" ${
          config.enableBlur ? "checked" : ""
        }>
        启用模糊效果
      </label>
      <label>
        <input type="checkbox" id="hide-all-images" ${
          config.hideAllImages ? "checked" : ""
        }>
        屏蔽所有图片
      </label>
      <label>
        模糊程度: <input type="range" id="blur-level" min="1" max="20" value="${
          config.blurLevel
        }">
        <span id="blur-value">${config.blurLevel}</span>
      </label>
      <button id="save-settings">保存设置</button>
      <button id="close-panel">关闭</button>
    `;

    document.body.appendChild(panel);

    // 添加事件监听
    document.getElementById("enable-blur").addEventListener("change", (e) => {
      if (
        e.target.checked &&
        document.getElementById("hide-all-images").checked
      ) {
        document.getElementById("hide-all-images").checked = false;
      }
    });

    document
      .getElementById("hide-all-images")
      .addEventListener("change", (e) => {
        if (
          e.target.checked &&
          document.getElementById("enable-blur").checked
        ) {
          document.getElementById("enable-blur").checked = false;
        }
      });

    document.getElementById("blur-level").addEventListener("input", (e) => {
      document.getElementById("blur-value").textContent = e.target.value;
    });

    document.getElementById("save-settings").addEventListener("click", () => {
      config.enableBlur = document.getElementById("enable-blur").checked;
      config.hideAllImages = document.getElementById("hide-all-images").checked;
      config.blurLevel = parseInt(document.getElementById("blur-level").value);
      saveConfig();
      alert("设置已保存");
      panel.classList.remove("visible");
    });

    document.getElementById("close-panel").addEventListener("click", () => {
      panel.classList.remove("visible");
    });

    return panel;
  }

  // 显示控制面板
  function showControlPanel() {
    let panel = document.querySelector(".moyu-control-panel");
    if (!panel) {
      panel = createControlPanel();
    }
    panel.classList.add("visible");
  }

  // 监听DOM变化，处理新加载的图片
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            processImages(node);
          }
        });
      }
    });
  });

  // 处理图片元素
  function processImages(container) {
    // 查找容器内的所有图片
    const images = container.querySelectorAll(".messageImage___L8FDo");

    images.forEach((img) => {
      if (img.dataset.processed) return;

      // 标记图片已处理
      img.dataset.processed = "true";

      // 创建图片控制按钮
      const imageContainer = img.closest(".imageContainer___JmzJP");
      if (imageContainer && !config.hideAllImages && config.enableBlur) {
        const toggleButton = document.createElement("button");
        toggleButton.className = "image-control";
        toggleButton.textContent = "显示";
        toggleButton.onclick = (e) => {
          e.stopPropagation();
          img.classList.toggle("clear-image");
          toggleButton.textContent = img.classList.contains("clear-image")
            ? "模糊"
            : "显示";
        };
        imageContainer.appendChild(toggleButton);
      }

      // 添加点击事件
      img.addEventListener("click", () => {
        if (!config.hideAllImages && config.enableBlur) {
          img.classList.toggle("clear-image");
          const btn = img
            .closest(".imageContainer___JmzJP")
            ?.querySelector(".image-control");
          if (btn) {
            btn.textContent = img.classList.contains("clear-image")
              ? "模糊"
              : "显示";
          }
        }
      });
    });
  }

  // 处理所有已存在的图片
  function processAllImages() {
    const images = document.querySelectorAll(".messageImage___L8FDo");
    images.forEach((img) => {
      // 重置状态
      img.classList.remove("clear-image");

      // 移除旧的控制按钮
      const container = img.closest(".imageContainer___JmzJP");
      if (container) {
        const oldButton = container.querySelector(".image-control");
        if (oldButton) {
          oldButton.remove();
        }
      }
    });

    // 重新处理所有图片
    processImages(document);
  }

  // 初始化
  function init() {
    // 更新样式
    updateStyles();

    // 注册菜单命令
    registerMenuCommands();

    // 处理已有的图片
    processImages(document);

    // 监听DOM变化
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.log("摸鱼室图片模糊加载脚本已启动");
  }

  // 等待页面加载完成
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
