// ==UserScript==
// @name         Bilibili 动态卡片拦截（Bilibili Dynamic Block）
// @namespace    xiaohuohumax/userscripts/bilibili-dynamic-block
// @version      1.0.4
// @author       xiaohuohumax
// @description  此脚本可以依据规则拦截 Bilibili 动态卡片。
// @license      MIT
// @icon         https://static.hdslb.com/mobile/img/512.png
// @source       https://github.com/xiaohuohumax/userscripts.git
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @require      https://unpkg.com/sweetalert@2.1.2/dist/sweetalert.min.js
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/522087/Bilibili%20%E5%8A%A8%E6%80%81%E5%8D%A1%E7%89%87%E6%8B%A6%E6%88%AA%EF%BC%88Bilibili%20Dynamic%20Block%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/522087/Bilibili%20%E5%8A%A8%E6%80%81%E5%8D%A1%E7%89%87%E6%8B%A6%E6%88%AA%EF%BC%88Bilibili%20Dynamic%20Block%EF%BC%89.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" .swal-overlay,.swal-overlay input{color:#000000a6}.swal-overlay .swal-button--success{background-color:#a3dd82}.swal-overlay .swal-button--success:hover{background-color:#98d973}.swal-overlay .swal-title{padding-top:10px;padding-bottom:10px}.swal-overlay hr{border-color:#00000024;margin:10px 1px 5px}.swal-overlay .add-rule-container{display:flex;margin:6px 0}.add-rule-container input{border-radius:6px 0 0 6px}.add-rule-container button{flex-shrink:0;border-radius:0 6px 6px 0}.rules-container{min-height:200px;max-height:220px;overflow-y:auto}.rules-container .empty{padding:8px;font-size:14px}.rules-container .rules-item{display:flex;margin:6px 0;position:relative}.rules-container .rules-item input{border-radius:6px}.swal-overlay .rules-item .close-item{top:50%;transform:translateY(-50%);right:10px;position:absolute;background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00LjQ3IDQuNDdhLjc1Ljc1IDAgMDAwIDEuMDZsNS41NCA1LjU0MS01LjU0IDUuNTRhLjc1Ljc1IDAgMDAxLjA2IDEuMDYxbDUuNTQxLTUuNTQgNS41NCA1LjU0YS43NS43NSAwIDAwMS4wNjEtMS4wNmwtNS41NC01LjU0IDUuNTQtNS41NDJhLjc1Ljc1IDAgMTAtMS4wNi0xLjA2bC01LjU0IDUuNTRMNS41MyA0LjQ3YS43NS43NSAwIDAwLTEuMDYgMHoiIGZpbGw9IiM2MTY2NkQiLz48L3N2Zz4=);background-position:50%;background-repeat:no-repeat;background-size:cover;height:22px;width:22px;cursor:pointer}.swal-overlay .rules-item .close-item:hover{transform:translateY(-50%) scale(1.125)}#bilibili-dynamic-block-stat{position:fixed;bottom:3px;right:3px;font-size:10px;z-index:999;cursor:pointer}#bilibili-dynamic-block-stat:hover{font-weight:900}html.bili_dark #bilibili-dynamic-block-stat{color:var(--text1)} ");

(function (swal) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const debounce = ({ delay }, func) => {
    let timer = void 0;
    let active = true;
    const debounced = (...args) => {
      if (active) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          active && func(...args);
          timer = void 0;
        }, delay);
      } else {
        func(...args);
      }
    };
    debounced.isPending = () => {
      return timer !== void 0;
    };
    debounced.cancel = () => {
      active = false;
    };
    debounced.flush = (...args) => func(...args);
    return debounced;
  };
  const ID = "bilibili-dynamic-block";
  const VERSION = "1.0.4";
  const LAST_VERSION = 1;
  class Store {
    constructor() {
      __publicField(this, "config", null);
      __publicField(this, "ID", `${ID}-config`);
      __publicField(this, "listeners", []);
      this.loadConfig();
      _GM_addValueChangeListener(this.ID, (_key, _oldValue, newValue, remote) => {
        if (remote) {
          this.config = this.configFormat(newValue);
          this.listeners.forEach((listener) => listener(this.config));
        }
      });
    }
    loadConfig() {
      const config = _GM_getValue(this.ID, void 0);
      this.config = this.configFormat(config);
      !config && this.saveConfig();
      console.log("加载配置：", this.config);
    }
    saveConfig() {
      _GM_setValue(this.ID, this.config);
      this.listeners.forEach((listener) => listener(this.config));
    }
    addConfigChangeListener(listener) {
      this.listeners.push(listener);
    }
    configFormat(data) {
      const config = {
        version: LAST_VERSION,
        blockRules: [],
        showStat: false
      };
      if (!data) {
        return config;
      }
      if (data.version === 0) {
        return config;
      }
      return Object.assign(config, data);
    }
    addBlockRule(rule) {
      if (!rule) {
        return;
      }
      for (const r of Array.isArray(rule) ? rule : [rule]) {
        const rTrim = r.trim();
        if (rTrim === "" || this.config.blockRules.includes(rTrim)) {
          continue;
        }
        this.config.blockRules.unshift(rTrim);
      }
      this.saveConfig();
    }
    deleteBlockRule(rule) {
      if (!rule) {
        return false;
      }
      const index = this.config.blockRules.indexOf(rule);
      if (index === -1) {
        return false;
      }
      this.config.blockRules.splice(index, 1);
      this.saveConfig();
      return true;
    }
    updateBlockRule(oldRule, newRule) {
      const index = this.config.blockRules.indexOf(oldRule);
      if (index === -1) {
        return;
      }
      this.config.blockRules[index] = newRule;
      this.saveConfig();
    }
    clearBlockRules() {
      this.config.blockRules = [];
      this.saveConfig();
    }
    get blockRules() {
      return this.config.blockRules;
    }
    get showStat() {
      return this.config.showStat;
    }
    async exportConfig() {
      try {
        const data = JSON.stringify(this.config, null, 2);
        const blob = new Blob([data], { type: "text/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${ID}-config.json`;
        a.click();
        URL.revokeObjectURL(url);
        return true;
      } catch {
        return false;
      }
    }
    async importConfig(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          try {
            const oldRules = this.config.blockRules;
            this.config = this.configFormat(JSON.parse(reader.result));
            this.addBlockRule(oldRules);
            resolve(true);
          } catch {
            resolve(false);
          }
        };
      });
    }
    toggleShowStat() {
      this.config.showStat = !this.config.showStat;
      this.saveConfig();
    }
  }
  class View {
    constructor(store2) {
      __publicField(this, "statInfo", "");
      __publicField(this, "statElement", null);
      __publicField(this, "renderConfig", async () => {
        const element = document.createElement("div");
        const emptyContent = '<div class="empty">这里啥也没有~~~</div>';
        let inputHasFile = false;
        element.innerHTML = `<div>
      <input type="file" id="fileInput" accept=".json" style="display: none;">
      <div class="add-rule-container">
        <input type="text" id="addInput" class="swal-content__input" placeholder="请输入屏蔽规则(支持正则表达式)">
        <button id="addButton" class="swal-button">添加</button>
      </div>
      <hr/>
      <div class="rules-container"></div>
    </div>`;
        const addInput = element.querySelector("#addInput");
        const addButton = element.querySelector("#addButton");
        const fileInput = element.querySelector("#fileInput");
        const rulesContainer = element.querySelector(".rules-container");
        const renderRuleItems = () => {
          const ruleItems = this.store.blockRules.map((rule) => {
            return `<div class="rules-item">
        <input type="text" class="swal-content__input" disabled value="${rule}"/>
        <div class="close-item" data-rule="${rule}"></div>
      </div>`;
          });
          rulesContainer.innerHTML = ruleItems.length > 0 ? ruleItems.join("") : emptyContent;
        };
        renderRuleItems();
        element.addEventListener("click", (event) => {
          const target = event.target;
          if (target.classList.contains("close-item")) {
            const rule = target.dataset.rule;
            if (this.store.deleteBlockRule(rule)) {
              renderRuleItems();
            }
          }
        });
        addButton.addEventListener("click", () => {
          const rule = addInput.value.trim();
          if (rule) {
            this.store.addBlockRule(rule);
            renderRuleItems();
            addInput.value = "";
          }
        });
        addInput.addEventListener("keyup", (event) => {
          if (event.key === "Enter") {
            addButton.click();
          }
        });
        fileInput.addEventListener("change", async () => {
          const files = fileInput.files;
          if (files && files.length > 0) {
            const state = await this.store.importConfig(files[0]);
            inputHasFile = true;
            await this.confirm(`导入${state ? "成功" : "失败"}`, state ? "success" : "error");
            this.renderConfig();
          }
        });
        const mode = await swal({
          title: "设置",
          content: {
            element
          },
          dangerMode: true,
          buttons: {
            clear: {
              text: "清空规则",
              value: "clear",
              className: "swal-button--danger"
            },
            export: {
              text: "导出配置",
              value: "export",
              className: "swal-button--confirm"
            },
            import: {
              text: "导入配置",
              value: "import",
              className: "swal-button--success"
            }
          }
        });
        if (mode === "clear") {
          const confirm = await await swal({
            title: "确认清空规则？",
            icon: "warning",
            buttons: {
              close: {
                text: "取消",
                value: false
              },
              confirm: {
                text: "确认",
                value: true,
                className: "swal-button--danger"
              }
            }
          });
          if (confirm) {
            this.store.clearBlockRules();
          }
          this.renderConfig();
        } else if (mode === "import") {
          fileInput.click();
          window.addEventListener("focus", () => {
            setTimeout(async () => {
              if (inputHasFile) {
                return;
              }
              await this.confirm("未选择文件", "error");
              this.renderConfig();
            }, 300);
          }, { once: true });
        } else if (mode === "export") {
          const state = await this.store.exportConfig();
          await this.confirm(`导出${state ? "成功" : "失败"}`, state ? "success" : "error");
          this.renderConfig();
        }
      });
      __publicField(this, "renderStat", async () => {
        this.statElement.style.display = this.store.showStat ? "block" : "none";
        this.statElement.innerHTML = this.statInfo;
      });
      __publicField(this, "updateStatInfo", (statInfo) => {
        this.statInfo = statInfo;
        this.renderStat();
      });
      this.store = store2;
      this.initStatElement();
      this.store.addConfigChangeListener(() => this.renderStat());
    }
    async confirm(title, icon, confirmText = "确认") {
      return await swal({
        title,
        icon,
        buttons: {
          confirm: {
            text: confirmText,
            value: true
          }
        }
      });
    }
    initStatElement() {
      const id = `${ID}-stat`;
      const statElement = document.getElementById(id);
      if (!statElement) {
        this.statElement = document.createElement("div");
        this.statElement.id = id;
        document.body.appendChild(this.statElement);
      } else {
        this.statElement = statElement;
      }
      this.statElement.addEventListener("click", () => {
        this.renderConfig();
      });
    }
  }
  const FILTERED_CLASS = `${ID}-filtered`;
  const store = new Store();
  const view = new View(store);
  let configHasChange = false;
  let blockCount = 0;
  function filterDynamicByRules(dynamicContent) {
    return store.blockRules.some((rule) => {
      try {
        const regex = new RegExp(rule, "i");
        return regex.test(dynamicContent);
      } catch {
        return false;
      }
    });
  }
  function filterDynamic() {
    const cards = Array.from(document.querySelectorAll(".bili-dyn-list__item"));
    const filteredCards = cards.filter((card) => {
      if (card.classList.contains(FILTERED_CLASS) && !configHasChange) {
        return false;
      }
      card.classList.add(FILTERED_CLASS);
      if (filterDynamicByRules(card.textContent || "")) {
        return true;
      }
      const contexts = Array.from(card.querySelectorAll(".bili-rich-text__content"));
      return contexts.some((c) => {
        const hasGoodsSpan = c.querySelector('span[data-type="goods"]');
        const hasLotterySpan = c.querySelector('span[data-type="lottery"]');
        const hasVoteSpan = c.querySelector('span[data-type="vote"]');
        return hasGoodsSpan || hasLotterySpan || hasVoteSpan;
      });
    });
    filteredCards.forEach((card) => {
      card.remove();
      blockCount++;
      view.updateStatInfo(`已拦截 ${blockCount} 条动态`);
    });
    configHasChange = false;
  }
  console.log(`${ID}(v${VERSION})`);
  const filterDynamicDebounced = debounce({ delay: 600 }, filterDynamic);
  const observer = new MutationObserver(filterDynamicDebounced);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  store.addConfigChangeListener(() => {
    configHasChange = true;
    console.log("屏蔽规则更新，重新过滤动态");
    filterDynamicDebounced();
  });
  _GM_registerMenuCommand("管理屏蔽规则", view.renderConfig);
  _GM_registerMenuCommand("隐藏/显示统计信息", () => {
    store.toggleShowStat();
    view.renderStat();
  });

})(swal);