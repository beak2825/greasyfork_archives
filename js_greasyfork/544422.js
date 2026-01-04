// ==UserScript==
// @name         Pica-Helper
// @namespace    Flying-Tom/pica-helper
// @version      0.0.0
// @author       Flying-Tom
// @description  为 Pica 提供额外的功能和配置选项
// @license      MIT
// @icon         https://manhuabika.com/wp-content/themes/pic-pwa/assets/img/favicon.png
// @match        https://manhuabika.com/*
// @match        https://www.manhuabika.com/*
// @match        https://manhuapica.com/*
// @match        https://manhuapica.com/*
// @downloadURL https://update.greasyfork.org/scripts/544422/Pica-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/544422/Pica-Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  class PicaHelperConfig {
    static STORAGE_KEY = "pica-helper-config";
    static CONFIG_VERSION = "1.0.0";
    static getDefaultConfig() {
      return {
        sortMode: "none",
        version: this.CONFIG_VERSION,
        lastUpdated: Date.now()
      };
    }
    static loadConfig() {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
          return this.getDefaultConfig();
        }
        const config = JSON.parse(stored);
        if (!config.version || config.version !== this.CONFIG_VERSION) {
          console.log("Pica Helper: 配置版本不匹配，使用默认配置");
          return this.getDefaultConfig();
        }
        return config;
      } catch (error) {
        console.error("Pica Helper: 配置加载失败，使用默认配置", error);
        return this.getDefaultConfig();
      }
    }
    static saveConfig(config) {
      try {
        config.lastUpdated = Date.now();
        config.version = this.CONFIG_VERSION;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config, null, 2));
      } catch (error) {
        console.error("Pica Helper: 配置保存失败", error);
      }
    }
    static getSortMode() {
      return this.loadConfig().sortMode;
    }
    static setSortMode(mode) {
      const config = this.loadConfig();
      config.sortMode = mode;
      this.saveConfig(config);
    }
    static getFullConfig() {
      return this.loadConfig();
    }
    static resetConfig() {
      this.saveConfig(this.getDefaultConfig());
    }
    static exportConfig() {
      return JSON.stringify(this.loadConfig(), null, 2);
    }
    static importConfig(jsonString) {
      try {
        const config = JSON.parse(jsonString);
        if (config.sortMode) {
          this.saveConfig(config);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Pica Helper: 配置导入失败", error);
        return false;
      }
    }
  }
  function enhanceExistingSortPanel() {
    const panel = document.getElementById("actionSheetIconed");
    if (!panel) {
      setTimeout(enhanceExistingSortPanel, 1e3);
      return;
    }
    const actionList = panel.querySelector(".action-button-list");
    if (!actionList) return;
    if (panel.querySelector("#pica-helper-section")) return;
    const currentMode = PicaHelperConfig.getSortMode();
    const configSection = document.createElement("div");
    configSection.id = "pica-helper-section";
    const divider = document.createElement("li");
    divider.className = "action-divider";
    const titleLi = document.createElement("li");
    titleLi.innerHTML = `
    <div style="padding: 10px 15px; font-weight: bold; color: #666; font-size: 14px;">
      🛠️ Pica Helper 设置 - 新标签页打开模式
    </div>
  `;
    const configOptions = [
      { value: "none", text: "不自动添加排序", icon: "icon-cancel" },
      { value: "ld", text: "自动添加最多愛心排序", icon: "icon-heart-circled" },
      { value: "vd", text: "自动添加最多浏览排序", icon: "icon-eye" }
    ];
    const configItems = configOptions.map((option) => {
      const li = document.createElement("li");
      const isSelected = currentMode === option.value;
      li.innerHTML = `
      <a class="btn btn-list ${isSelected ? "text-primary" : ""}" data-mode="${option.value}" style="cursor: pointer; -webkit-tap-highlight-color: rgba(0,0,0,0.1);">
        <span>
          <i class="${option.icon} me-1" role="img"></i>
          ${option.text}
          ${isSelected ? '<i class="icon-check float-end" style="color: #007bff;"></i>' : ""}
        </span>
      </a>
    `;
      const clickHandler = function(e) {
        e.preventDefault();
        e.stopPropagation();
        PicaHelperConfig.setSortMode(option.value);
        updateConfigDisplay();
        showSaveNotification();
      };
      li.addEventListener("click", clickHandler);
      li.addEventListener("touchend", clickHandler);
      return li;
    });
    actionList.appendChild(divider);
    actionList.appendChild(titleLi);
    configItems.forEach((item) => actionList.appendChild(item));
    const lastDivider = document.createElement("li");
    lastDivider.className = "action-divider";
    actionList.appendChild(lastDivider);
  }
  function updateConfigDisplay() {
    const currentMode = PicaHelperConfig.getSortMode();
    const configItems = document.querySelectorAll("#pica-helper-section a[data-mode]");
    configItems.forEach((item) => {
      const mode = item.getAttribute("data-mode");
      const span = item.querySelector("span");
      if (!span) return;
      if (mode === currentMode) {
        item.classList.add("text-primary");
        if (!span.querySelector(".icon-check")) {
          span.innerHTML += '<i class="icon-check float-end" style="color: #007bff;"></i>';
        }
      } else {
        item.classList.remove("text-primary");
        const checkIcon = span.querySelector(".icon-check");
        if (checkIcon) {
          checkIcon.remove();
        }
      }
    });
  }
  function showSaveNotification() {
    const notification = document.createElement("div");
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #28a745;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 10001;
    font-weight: bold;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  `;
    notification.textContent = "✓ 设置已保存";
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transition = "opacity 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 2e3);
  }
  window.unsafeWindow = window.unsafeWindow || window;
  function serializeParams(obj) {
    const params = [];
    for (const key in obj) {
      if (obj.hasOwnProperty && obj.hasOwnProperty(key) && obj[key] !== void 0 && obj[key] !== null) {
        params.push(encodeURIComponent(key) + "=" + encodeURIComponent(String(obj[key])));
      }
    }
    return params.join("&");
  }
  window.unsafeWindow.jumpUtils = function(path, dataArr) {
    try {
      if (!dataArr.cid) {
        const sortMode = PicaHelperConfig.getSortMode();
        if (sortMode === "ld") {
          dataArr.sort = "ld";
        } else if (sortMode === "vd") {
          dataArr.sort = "vd";
        }
      }
      let queryString;
      try {
        const $ = window.$;
        if ($ && typeof $.param === "function") {
          queryString = $.param(dataArr);
        } else {
          console.log("Pica Helper: jQuery 不可用，使用内置参数序列化");
          queryString = serializeParams(dataArr);
        }
      } catch (error) {
        console.log("Pica Helper: jQuery 参数序列化失败，使用内置方法", error);
        queryString = serializeParams(dataArr);
      }
      const url = "/" + path + "/?" + queryString;
      try {
        const newWindow = window.open(url, "_blank");
        if (newWindow) {
          newWindow.focus();
        } else {
          console.log("Pica Helper: 弹窗被阻止，尝试其他方法");
          const link = document.createElement("a");
          link.href = url;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (openError) {
        console.error("Pica Helper: 打开新窗口失败", openError);
        window.location.href = url;
      }
    } catch (error) {
      console.error("Pica Helper: jumpUtils 执行失败", error);
    }
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceExistingSortPanel);
  } else {
    enhanceExistingSortPanel();
  }
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            if (element.id === "actionSheetIconed" || element.querySelector("#actionSheetIconed")) {
              enhanceExistingSortPanel();
            }
          }
        });
      }
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();