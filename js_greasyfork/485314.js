// ==UserScript==
// @name         bilibili 页面净化大师
// @namespace    http://tampermonkey.net/
// @version      2.3.4
// @author       festoney8
// @description  净化 B站/哔哩哔哩 页面内各种元素，去广告，BV号转AV号，净化播放器，提供300+项功能，定制自己的B站页面
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @homepage     https://github.com/festoney8/bilibili-cleaner
// @supportURL   https://github.com/festoney8/bilibili-cleaner/issues
// @match        *://*.bilibili.com/*
// @exclude      *://message.bilibili.com/pages/nav/header_sync
// @exclude      *://message.bilibili.com/pages/nav/index_new_pc_sync
// @exclude      *://data.bilibili.com/*
// @exclude      *://cm.bilibili.com/*
// @exclude      *://passport.bilibili.com/*
// @exclude      *://api.bilibili.com/*
// @exclude      *://api.*.bilibili.com/*
// @exclude      *://*.chat.bilibili.com/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/485314/bilibili%20%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96%E5%A4%A7%E5%B8%88.user.js
// @updateURL https://update.greasyfork.org/scripts/485314/bilibili%20%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96%E5%A4%A7%E5%B8%88.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const settings = {
    debugMode: false,
    themeColor: `rgba(251, 114, 153, 1)`
    // themeColor: `#00aeec`,
  };
  const startTime = performance.now();
  let lastTime = startTime;
  let currTime = startTime;
  const wrapper = (loggingFunc, isEnable) => {
    if (isEnable) {
      return (...innerArgs) => {
        currTime = performance.now();
        const during = (currTime - lastTime).toFixed(1);
        const total = (currTime - startTime).toFixed(1);
        loggingFunc(`[bili-cleaner] ${during} / ${total} ms | ${innerArgs.join(" ")}`);
        lastTime = currTime;
      };
    }
    return (..._args) => {
    };
  };
  const log = wrapper(console.log, true);
  const error = wrapper(console.error, true);
  const debug = wrapper(console.log, settings.debugMode);
  const init = async () => {
    await waitForHTMLBuild();
    log("wait for html complete");
  };
  const waitForHTMLBuild = () => {
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        if (document.head) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(document, { childList: true, subtree: true });
    });
  };
  class Panel {
    constructor() {
      __publicField(this, "panelCSS", `
    /* panel部分 */
    #bili-cleaner {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 32vw;
        height: 90vh;
        border-radius: 10px;
        background: #f4f5f7;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
        overflow: auto;
        z-index: 2147483647;
    }
    #bili-cleaner-bar {
        width: 32vw;
        height: 6vh;
        background: ${settings.themeColor};
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        cursor: move;
        user-select: none;
    }
    #bili-cleaner-title {
        width: 32vw;
        height: 6vh;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-weight: bold;
        font-size: 22px;
    }
    #bili-cleaner-title span {
        text-align: center;
    }
    #bili-cleaner-close {
        position: absolute;
        top: 0;
        right: 0;
        width: 6vh;
        height: 6vh;
        border-radius: 6vh;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: auto;
    }
    #bili-cleaner-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    #bili-cleaner-close svg {
        text-align: center;
    }
    #bili-cleaner-group-list {
        height: 84vh;
        overflow: auto;
    }
    #bili-cleaner-group-list::-webkit-scrollbar {
        display: none;
    }
    #bili-cleaner-group-list {
        scrollbar-width: none !important;
    }
    /* panel内的group */
    .bili-cleaner-group {
        margin: 14px;
        background: white;
        border-radius: 6px;
        padding: 8px 16px;
        border: 1px solid #ddd;
        user-select: none;
    }
    .bili-cleaner-group hr {
        border: 1px solid #eee;
        margin: 5px 0 10px 0;
    }
    .bili-cleaner-group-title {
        font-size: 20px;
        font-weight: bold;
        padding: 2px;
        color: black;
        letter-spacing: 1px;
    }
    /* 每行Item选项的样式, 按钮和文字 */
    .bili-cleaner-item-list label {
        display: flex;
        align-items: center;
        margin: 6px 0 6px 10px;
        font-size: 16px;
        color: black;
    }
    .bili-cleaner-item-list label span {
        margin-left: 1em;
    }
    .bili-cleaner-item-list hr {
        border: 1px solid #eee;
        margin: 15px 20px;
    }
    .bili-cleaner-item-checkbox {
        width: 50px;
        min-width: 50px;
        height: 27px;
        margin: 0;
        position: relative;
        border: 1px solid #dfdfdf;
        background-color: #fdfdfd;
        box-shadow: #dfdfdf 0 0 0 0 inset;
        border-radius: 50px;
        appearance: none;
        -webkit-appearance: none;
        user-select: none;
    }
    .bili-cleaner-item-checkbox:before {
        content: '';
        width: 25px;
        height: 25px;
        position: absolute;
        top: 0px;
        left: 0;
        border-radius: 50px;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }
    .bili-cleaner-item-checkbox:checked {
        border-color: ${settings.themeColor};
        box-shadow: ${settings.themeColor} 0 0 0 16px inset;
        background-color: ${settings.themeColor};
    }
    .bili-cleaner-item-checkbox:checked:before {
        left: 25px;
    }`);
      __publicField(this, "panelHTML", `
    <div id="bili-cleaner">
        <div id="bili-cleaner-bar">
            <div id="bili-cleaner-title">
                <span>bilibili 页面净化大师</span>
            </div>
            <div id="bili-cleaner-close">
                <svg t="1699601981125" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5964" width="20" height="20"><path d="M996.742543 154.815357L639.810328 511.747572l356.932215 356.932215a90.158906 90.158906 0 0 1-127.490994 127.490994L512.319334 639.195998l-356.932215 356.889647A90.158906 90.158906 0 1 1 27.896126 868.637219L384.82834 511.747572 27.896126 154.815357A90.158906 90.158906 0 1 1 155.387119 27.324364L512.319334 384.256578 869.251549 27.324364a90.158906 90.158906 0 1 1 127.490994 127.490993z" fill="#ffffff" p-id="5965"></path></svg>
            </div>
        </div>
        <div id="bili-cleaner-group-list">
        </div>
    </div>`);
    }
    /**
     * 向document.head中添加panel CSS
     */
    insertPanelCSS() {
      try {
        if (document.head.querySelector("#bili-cleaner-panel-css")) {
          return;
        }
        const style = document.createElement("style");
        style.innerHTML = this.panelCSS.replace(/\n\s*/g, "").trim();
        style.setAttribute("id", "bili-cleaner-panel-css");
        document.head.appendChild(style);
        debug("insertPanelCSS OK");
      } catch (err) {
        error(`insertPanelCSS failed`);
        error(err);
      }
    }
    /**
     * 向document.body后添加panel html代码
     */
    insertPanelHTML() {
      try {
        if (document.getElementById("bili-cleaner")) {
          return;
        }
        const html = document.createElement("div");
        html.innerHTML = this.panelHTML;
        document.body.appendChild(html);
        debug("insertPanelHTML OK");
      } catch (err) {
        error(`insertPanelHTML failed`);
        error(err);
      }
    }
    /**
     * 右上角关闭按钮
     */
    watchCloseBtn() {
      try {
        const panel = document.getElementById("bili-cleaner");
        const closeBtn = document.getElementById("bili-cleaner-close");
        closeBtn.addEventListener("click", () => {
          panel.style.display = "none";
        });
        debug("watchCloseBtn OK");
      } catch (err) {
        error(`watchCloseBtn failed`);
        error(err);
      }
    }
    /**
     * 可拖拽panel bar, 拖拽panel顶部的bar可移动panel, 其他区域不可拖拽
     */
    draggableBar() {
      try {
        const panel = document.getElementById("bili-cleaner");
        const bar = document.getElementById("bili-cleaner-bar");
        let isDragging = false;
        let initX, initY, initLeft, initTop;
        bar.addEventListener("mousedown", (e) => {
          isDragging = true;
          initX = e.clientX;
          initY = e.clientY;
          const c = window.getComputedStyle(panel);
          initLeft = parseInt(c.getPropertyValue("left"), 10);
          initTop = parseInt(c.getPropertyValue("top"), 10);
        });
        document.addEventListener("mousemove", (e) => {
          if (isDragging) {
            const diffX = e.clientX - initX;
            const diffY = e.clientY - initY;
            panel.style.left = `${initLeft + diffX}px`;
            panel.style.top = `${initTop + diffY}px`;
          }
        });
        document.addEventListener("mouseup", () => {
          isDragging = false;
        });
        debug("draggableBar OK");
      } catch (err) {
        error(`draggableBar failed`);
        error(err);
      }
    }
    /**
     * 创建Panel流程
     */
    createPanel() {
      this.insertPanelCSS();
      this.insertPanelHTML();
      this.watchCloseBtn();
      this.draggableBar();
    }
  }
  class Group {
    /**
     * Group是每个页面的规则组，每个页面有多个组
     * @param groupID group的唯一ID
     * @param title group标题, 显示在group顶部, 可使用换行符'\n', 可使用HTML
     * @param items group内功能列表
     */
    constructor(groupID, title, items) {
      __publicField(this, "groupHTML", `
    <div class="bili-cleaner-group">
        <div class="bili-cleaner-group-title">
        </div>
        <hr>
        <div class="bili-cleaner-item-list">
        </div>
    </div>`);
      this.groupID = groupID;
      this.title = title;
      this.items = items;
      this.groupID = "bili-cleaner-group-" + groupID;
    }
    /** 在panel内添加一个group */
    insertGroup() {
      const e = document.createElement("div");
      e.innerHTML = this.groupHTML.trim();
      e.querySelector(".bili-cleaner-group").id = this.groupID;
      e.querySelector(".bili-cleaner-group-title").innerHTML = this.title.replaceAll("\n", "<br>");
      const groupList = document.getElementById("bili-cleaner-group-list");
      groupList.appendChild(e);
    }
    /** 插入group内item列表, 并逐一监听 */
    insertGroupItems() {
      try {
        this.items.forEach((e) => {
          e.insertItem(this.groupID);
          if (typeof e.watchItem === "function") {
            e.watchItem();
          }
        });
        debug(`insertGroupItems ${this.groupID} OK`);
      } catch (err) {
        error(`insertGroupItems ${this.groupID} err`);
        error(err);
      }
    }
    /**
     * 启用group，启用group内items
     * @param enableFunc 是否启用item功能, 默认true
     */
    enableGroup(enableFunc = true) {
      try {
        this.items.forEach((e) => {
          if (typeof e.enableItem === "function") {
            e.enableItem(enableFunc);
          }
        });
        debug(`enableGroup ${this.groupID} OK`);
      } catch (err) {
        error(`enableGroup ${this.groupID} err`);
        error(err);
      }
    }
    /** 在URL变动时, 重载group内需要重载的项目 */
    reloadGroup() {
      try {
        this.items.forEach((e) => {
          if (typeof e.reloadItem === "function") {
            e.reloadItem();
          }
        });
      } catch (err) {
        error(`reloadGroup ${this.groupID} err`);
        error(err);
      }
    }
    /** 禁用Group, 临时使用, 移除全部CSS, 监听函数保持不变 */
    disableGroup() {
      try {
        this.items.forEach((e) => {
          if (typeof e.removeItemCSS === "function") {
            e.removeItemCSS();
          }
        });
        debug(`disableGroup ${this.groupID} OK`);
      } catch (err) {
        error(`disableGroup ${this.groupID} err`);
        error(err);
      }
    }
  }
  class CheckboxItem {
    /**
     * @param itemID item的唯一ID, 与GM database中的Key对应, 使用相同ID可共享item状态
     * @param description item的功能介绍, 显示在panel内, \n可用来换行
     * @param defaultStatus item默认开启状态, 第一次安装时使用, 对于所有用户均开启的项目默认给true
     * @param itemFunc 功能函数
     * @param isItemFuncReload 功能函数是否在URL变动时重新运行
     * @param itemCSS item的CSS
     */
    constructor(itemID, description, defaultStatus, itemFunc, isItemFuncReload, itemCSS) {
      __publicField(this, "nodeHTML", `<input class="bili-cleaner-item-checkbox" type="checkbox">`);
      __publicField(this, "isEnable");
      // item对应的HTML input node
      __publicField(this, "itemEle");
      this.itemID = itemID;
      this.description = description;
      this.defaultStatus = defaultStatus;
      this.itemFunc = itemFunc;
      this.isItemFuncReload = isItemFuncReload;
      this.itemCSS = itemCSS;
      this.isEnable = void 0;
      this.itemEle = void 0;
    }
    /**
     * 设定并记录item开关状态
     * @param value checkbox开关状态
     */
    setStatus(value) {
      _GM_setValue(`BILICLEANER_${this.itemID}`, value);
      this.isEnable = value;
    }
    /** 获取item开关状态, 若第一次安装时不存在该key, 使用默认值 */
    getStatus() {
      this.isEnable = _GM_getValue(`BILICLEANER_${this.itemID}`);
      if (this.defaultStatus && this.isEnable === void 0) {
        this.isEnable = this.defaultStatus;
        this.setStatus(this.isEnable);
      }
    }
    /**
     * 在相应group内添加item
     * @param groupID item所属groupID, 由Group调用insertItem时传入
     */
    insertItem(groupID) {
      try {
        this.getStatus();
        const e = document.createElement("label");
        e.id = this.itemID;
        e.innerHTML = `${this.nodeHTML}<span>${this.description.replaceAll("\n", "<br>")}</span>`;
        if (this.isEnable) {
          e.querySelector("input").checked = true;
        }
        const itemGroupList = document.querySelector(`#${groupID} .bili-cleaner-item-list`);
        if (itemGroupList) {
          itemGroupList.appendChild(e);
          debug(`insertItem ${this.itemID} OK`);
        }
      } catch (err) {
        error(`insertItem ${this.itemID} err`);
        error(err);
      }
    }
    /** 启用CSS片段, 向<html>插入style */
    insertItemCSS() {
      if (!this.itemCSS) {
        return;
      }
      try {
        if (document.querySelector(`html>style[bili-cleaner-css=${this.itemID}]`)) {
          debug(`insertItemCSS ${this.itemID} CSS exist, ignore`);
          return;
        }
        const style = document.createElement("style");
        style.innerHTML = this.itemCSS.replace(/\n\s*/g, "").trim();
        style.setAttribute("bili-cleaner-css", this.itemID);
        document.documentElement.appendChild(style);
        debug(`insertItemCSS ${this.itemID} OK`);
      } catch (err) {
        error(`insertItemCSS ${this.itemID} failed`);
        error(err);
      }
    }
    /** 停用CSS片段, 从<html>移除style */
    removeItemCSS() {
      var _a;
      if (this.itemCSS) {
        const style = document.querySelector(`html>style[bili-cleaner-css=${this.itemID}]`);
        if (style) {
          (_a = style.parentNode) == null ? void 0 : _a.removeChild(style);
          debug(`removeItemCSS ${this.itemID} OK`);
        }
      }
    }
    /** 监听item chekbox开关 */
    watchItem() {
      try {
        this.itemEle = document.querySelector(`#${this.itemID} input`);
        this.itemEle.addEventListener("change", (event) => {
          if (event.target.checked) {
            this.setStatus(true);
            this.insertItemCSS();
            if (this.itemFunc !== void 0) {
              this.itemFunc();
            }
          } else {
            this.setStatus(false);
            this.removeItemCSS();
          }
        });
        debug(`watchItem ${this.itemID} OK`);
      } catch (err) {
        error(`watchItem ${this.itemID} err`);
        error(err);
      }
    }
    /**
     * 执行item功能, 添加CSS, 执行func
     * @param enableFunc 是否执行func, 默认true
     */
    enableItem(enableFunc = true) {
      this.getStatus();
      if (this.isEnable) {
        try {
          this.insertItemCSS();
          if (enableFunc && this.itemFunc instanceof Function) {
            this.itemFunc();
          }
          debug(`enableItem ${this.itemID} OK`);
        } catch (err) {
          error(`enableItem ${this.itemID} Error`);
          error(err);
        }
      }
    }
    /**
     * 重载item, 用于非页面刷新但URL变动情况, 此时已注入CSS只重新运行func, 如: 非刷新式切换视频
     */
    reloadItem() {
      if (this.isItemFuncReload && this.isEnable && this.itemFunc instanceof Function) {
        try {
          this.itemFunc();
          debug(`reloadItem ${this.itemID} OK`);
        } catch (err) {
          error(`reloadItem ${this.itemID} Error`);
          error(err);
        }
      }
    }
  }
  class RadioItem {
    /**
     * @param itemID item的唯一ID, 与GM database中的Key对应, 使用相同ID可共享item状态
     * @param description item的功能介绍, 显示在panel内, \n可用来换行
     * @param radioName radio input的name, 用于一组互斥选项
     * @param radioItemIDList 当前item所在互斥组的ID列表, 用于修改其他item状态
     * @param defaultStatus item默认开启状态, 第一次安装时使用, 对于所有用户均开启的项目默认给true
     * @param itemFunc 功能函数
     * @param isItemFuncReload 功能函数是否在URL变动时重新运行
     * @param itemCSS item的CSS
     */
    constructor(itemID, description, radioName, radioItemIDList, defaultStatus, itemFunc, isItemFuncReload, itemCSS) {
      __publicField(this, "nodeHTML", `<input class="bili-cleaner-item-checkbox" type="radio">`);
      __publicField(this, "isEnable");
      __publicField(this, "itemEle");
      this.itemID = itemID;
      this.description = description;
      this.radioName = radioName;
      this.radioItemIDList = radioItemIDList;
      this.defaultStatus = defaultStatus;
      this.itemFunc = itemFunc;
      this.isItemFuncReload = isItemFuncReload;
      this.itemCSS = itemCSS;
      this.isEnable = void 0;
      this.itemEle = void 0;
    }
    /**
     * 设定并记录item开关状态
     * @param targetID 设定对象itemID, 默认null 给this对象设定
     * @param value 开关状态
     */
    setStatus(value, targetID = null) {
      if (!targetID) {
        _GM_setValue(`BILICLEANER_${this.itemID}`, value);
        this.isEnable = value;
      } else {
        _GM_setValue(`BILICLEANER_${targetID}`, value);
      }
    }
    /** 获取item开关状态, 若第一次安装时不存在该key, 使用默认值 */
    getStatus() {
      this.isEnable = _GM_getValue(`BILICLEANER_${this.itemID}`);
      if (this.defaultStatus && this.isEnable === void 0) {
        this.isEnable = this.defaultStatus;
        this.setStatus(this.isEnable);
      }
    }
    /**
     * 在相应group内添加item
     * @param groupID item所属groupID, 由Group调用insertItem时传入
     */
    insertItem(groupID) {
      try {
        this.getStatus();
        const e = document.createElement("label");
        e.id = this.itemID;
        e.innerHTML = `${this.nodeHTML}<span>${this.description.replaceAll("\n", "<br>")}</span>`;
        if (this.isEnable) {
          e.querySelector("input").checked = true;
        }
        e.querySelector("input").name = this.radioName;
        const itemGroupList = document.querySelector(`#${groupID} .bili-cleaner-item-list`);
        if (itemGroupList) {
          itemGroupList.appendChild(e);
          debug(`insertItem ${this.itemID} OK`);
        }
      } catch (err) {
        error(`insertItem ${this.itemID} err`);
        error(err);
      }
    }
    /** 启用CSS片段, 向<html>插入style */
    insertItemCSS() {
      if (!this.itemCSS) {
        return;
      }
      try {
        if (document.querySelector(`html>style[bili-cleaner-css=${this.itemID}]`)) {
          debug(`insertItemCSS ${this.itemID} CSS exist, ignore`);
          return;
        }
        const style = document.createElement("style");
        style.innerHTML = this.itemCSS.replace(/\n\s*/g, "").trim();
        style.setAttribute("bili-cleaner-css", this.itemID);
        document.documentElement.appendChild(style);
        debug(`insertItemCSS ${this.itemID} OK`);
      } catch (err) {
        error(`insertItemCSS ${this.itemID} failed`);
        error(err);
      }
    }
    /** 停用CSS片段, 从<html>移除style */
    removeItemCSS() {
      var _a;
      if (this.itemCSS) {
        const style = document.querySelector(`html>style[bili-cleaner-css=${this.itemID}]`);
        if (style) {
          (_a = style.parentNode) == null ? void 0 : _a.removeChild(style);
          debug(`removeItemCSS ${this.itemID} OK`);
        }
      }
    }
    /** 监听item option开关 */
    watchItem() {
      try {
        this.itemEle = document.querySelector(`#${this.itemID} input`);
        this.itemEle.addEventListener("change", (event) => {
          if (event.target.checked) {
            debug(`radioItem ${this.itemID} checked`);
            this.setStatus(true);
            this.insertItemCSS();
            if (this.itemFunc !== void 0) {
              this.itemFunc();
            }
            this.radioItemIDList.forEach((targetID) => {
              var _a;
              if (targetID !== this.itemID) {
                const style = document.querySelector(
                  `html>style[bili-cleaner-css=${targetID}]`
                );
                if (style) {
                  (_a = style.parentNode) == null ? void 0 : _a.removeChild(style);
                  debug(`removeItemCSS ${targetID} OK`);
                }
                this.setStatus(false, targetID);
                debug(`disable same name radioItem ${targetID}, OK`);
              }
            });
          }
        });
        debug(`watchItem ${this.itemID} OK`);
      } catch (err) {
        error(`watchItem ${this.itemID} err`);
        error(err);
      }
    }
    /**
     * 执行item功能, 添加CSS, 执行func
     * @param enableFunc 是否执行func, 默认true
     */
    enableItem(enableFunc = true) {
      this.getStatus();
      if (this.isEnable) {
        try {
          this.insertItemCSS();
          if (enableFunc && this.itemFunc instanceof Function) {
            this.itemFunc();
          }
          debug(`enableItem ${this.itemID} OK`);
        } catch (err) {
          error(`enableItem ${this.itemID} Error`);
          error(err);
        }
      }
    }
    /**
     * 重载item, 用于非页面刷新但URL变动情况, 此时已注入CSS只重新运行func, 如: 非刷新式切换视频
     */
    reloadItem() {
      this.getStatus();
      if (this.isItemFuncReload && this.isEnable && this.itemFunc instanceof Function) {
        try {
          this.itemFunc();
          debug(`reloadItem ${this.itemID} OK`);
        } catch (err) {
          error(`reloadItem ${this.itemID} Error`);
          error(err);
        }
      }
    }
  }
  const basicItems$7 = [];
  const layoutItems$1 = [];
  const rcmdListItems = [];
  const sidebarItems$4 = [];
  const biliAppRcmdItems = [];
  const homepageGroupList = [];
  if (location.href.startsWith("https://www.bilibili.com/") && ["/index.html", "/"].includes(location.pathname)) {
    {
      basicItems$7.push(
        new CheckboxItem(
          "homepage-hide-banner",
          "隐藏 横幅banner",
          false,
          void 0,
          false,
          `.header-banner__inner, .bili-header__banner {
                    display: none !important;
                }
                .bili-header .bili-header__bar:not(.slide-down) {
                    position: relative !important;
                    box-shadow: 0 2px 4px #00000014;
                }
                .bili-header__channel {
                    margin-top: 5px !important;
                }
                /* icon和文字颜色 */
                .bili-header .right-entry__outside .right-entry-icon {
                    color: #18191c !important;
                }
                .bili-header .left-entry .entry-title, .bili-header .left-entry .download-entry, .bili-header .left-entry .default-entry, .bili-header .left-entry .loc-entry {
                    color: #18191c !important;
                }
                .bili-header .left-entry .entry-title .zhuzhan-icon {
                    color: #00aeec !important;
                }
                .bili-header .right-entry__outside .right-entry-text {
                    color: #61666d !important;
                }
                /* header滚动后渐变出现, 否则闪动 */
                #i_cecream .bili-header__bar.slide-down {
                    transition: background-color 0.3s ease-out, box-shadow 0.3s ease-out !important;
                }
                #i_cecream .bili-header__bar:not(.slide-down) {
                    transition: background-color 0.3s ease-out !important;
                }`
        )
      );
      basicItems$7.push(
        new CheckboxItem(
          "homepage-hide-recommend-swipe",
          "隐藏 大图活动轮播",
          true,
          void 0,
          false,
          `.recommended-swipe {
                    display: none !important;
                }
                /* 布局调整 */
                .recommended-container_floor-aside .container>*:nth-of-type(5) {
                    margin-top: 0 !important;
                }
                .recommended-container_floor-aside .container>*:nth-of-type(6) {
                    margin-top: 0 !important;
                }
                .recommended-container_floor-aside .container>*:nth-of-type(7) {
                    margin-top: 0 !important;
                }
                .recommended-container_floor-aside .container>*:nth-of-type(n + 8) {
                    margin-top: 0 !important;
                }
                /* 完全展示10个推荐项 */
                .recommended-container_floor-aside .container .feed-card:nth-of-type(n + 9) {
                    display: inherit !important;
                }
                .recommended-container_floor-aside .container.is-version8>*:nth-of-type(n + 13) {
                    margin-top: 0 !important;
                }
                .recommended-container_floor-aside .container .feed-card:nth-of-type(n + 12) {
                    display: inherit !important;
                }
                .recommended-container_floor-aside .container .floor-single-card:first-of-type {
                    margin-top: 0 !important;
                }
                /* 压缩分区栏高度, 压缩16px */
                @media (max-width: 1099.9px) {.bili-header .bili-header__channel {height:84px!important}}
                @media (min-width: 1100px) and (max-width: 1366.9px) {.bili-header .bili-header__channel {height:84px!important}}
                @media (min-width: 1367px) and (max-width: 1700.9px) {.bili-header .bili-header__channel {height:94px!important}}
                @media (min-width: 1701px) and (max-width: 2199.9px) {.bili-header .bili-header__channel {height:104px!important}}
                @media (min-width: 2200px) {.bili-header .bili-header__channel {height:114px!important}}
                `
        )
      );
      basicItems$7.push(
        new CheckboxItem(
          "homepage-hide-subarea",
          "隐藏 整个分区栏",
          false,
          void 0,
          false,
          // 高权限, 否则被压缩分区栏高度影响
          `#i_cecream .bili-header__channel .channel-icons {
                    display: none !important;
                }
                #i_cecream .bili-header__channel .right-channel-container {
                    display: none !important;
                }
                /* adapt bilibili-app-recommend */
                #i_cecream .bili-header__channel {
                    height: 0 !important;
                }
                #i_cecream main.bili-feed4-layout:not(:has(.bilibili-app-recommend-root)) {
                    margin-top: 20px !important;
                }`
        )
      );
      basicItems$7.push(
        new CheckboxItem(
          "homepage-hide-sticky-header",
          "隐藏 滚动页面时 顶部吸附顶栏",
          false,
          void 0,
          false,
          `.bili-header .left-entry__title svg {
                    display: none !important;
                }
                /* 高优先覆盖!important */
                #i_cecream .bili-feed4 .bili-header .slide-down {
                    box-shadow: unset !important;
                }
                #nav-searchform.is-actived:before,
                #nav-searchform.is-exper:before,
                #nav-searchform.is-exper:hover:before,
                #nav-searchform.is-focus:before,
                .bili-header .slide-down {
                    background: unset !important;
                }
                .bili-header .slide-down {
                    position: absolute !important;
                    top: 0;
                    animation: unset !important;
                    box-shadow: unset !important;
                }
                .bili-header .slide-down .left-entry {
                    margin-right: 30px !important;
                }
                .bili-header .slide-down .left-entry .default-entry,
                .bili-header .slide-down .left-entry .download-entry,
                .bili-header .slide-down .left-entry .entry-title,
                .bili-header .slide-down .left-entry .entry-title .zhuzhan-icon,
                .bili-header .slide-down .left-entry .loc-entry,
                .bili-header .slide-down .left-entry .loc-mc-box__text,
                .bili-header .slide-down .left-entry .mini-header__title,
                .bili-header .slide-down .right-entry .right-entry__outside .right-entry-icon,
                .bili-header .slide-down .right-entry .right-entry__outside .right-entry-text {
                    color: #fff !important;
                }
                .bili-header .slide-down .download-entry,
                .bili-header .slide-down .loc-entry {
                    display: unset !important;
                }
                .bili-header .slide-down .center-search-container,
                .bili-header .slide-down .center-search-container .center-search__bar {
                    margin: 0 auto !important;
                }
                /* 不可添加important, 否则与Evolved的黑暗模式冲突 */
                #nav-searchform {
                    background: #f1f2f3;
                }
                #nav-searchform:hover {
                    background-color: var(--bg1) !important;
                    opacity: 1
                }
                #nav-searchform.is-focus {
                    border: 1px solid var(--line_regular) !important;
                    border-bottom: none !important;
                    background: var(--bg1) !important;
                }
                #nav-searchform.is-actived.is-exper4-actived,
                #nav-searchform.is-focus.is-exper4-actived {
                    border-bottom: unset !important;
                }
                /* 只隐藏吸附header时的吸附分区栏 */
                #i_cecream .header-channel {
                    top: 0 !important;
                }
                /* adapt bilibili-app-recommend */
                .bilibili-app-recommend-root .area-header {
                    top: 0 !important;
                }`
        )
      );
      basicItems$7.push(
        new CheckboxItem(
          "homepage-hide-sticky-subarea",
          "隐藏 滚动页面时 顶部吸附分区栏",
          true,
          void 0,
          false,
          `#i_cecream .header-channel {display: none !important;}
                /* 吸附分区栏的动效转移给吸附header, 滚动后渐变出现 */
                #i_cecream .bili-header__bar.slide-down {
                    transition: background-color 0.3s ease-out, box-shadow 0.3s ease-out !important;
                }
                #i_cecream .bili-header__bar:not(.slide-down) {
                    transition: background-color 0.3s ease-out;
                }`
        )
      );
      basicItems$7.push(
        new CheckboxItem(
          "homepage-increase-rcmd-list-font-size",
          "增大 视频信息字号",
          false,
          void 0,
          false,
          `.bili-video-card .bili-video-card__info--tit,
                .bili-live-card .bili-live-card__info--tit,
                .single-card.floor-card .title {
                    font-size: 16px !important;
                }
                .bili-video-card .bili-video-card__info--bottom,
                .floor-card .sub-title.sub-title {
                    font-size: 14px !important;
                }
                .bili-video-card__stats,
                .bili-video-card__stats .bili-video-card__stats--left,
                .bili-video-card__stats .bili-video-card__stats--right {
                    font-size: 14px !important;
                }`
        )
      );
    }
    homepageGroupList.push(new Group("homepage-basic", "首页 基本功能", basicItems$7));
    {
      const layoutRadioItemIDList = [
        "homepage-layout-default",
        "homepage-layout-4-column",
        "homepage-layout-5-column",
        "homepage-layout-6-column"
      ];
      layoutItems$1.push(
        new RadioItem(
          "homepage-layout-default",
          "官方默认，自动匹配页面缩放",
          "homepage-layout-option",
          layoutRadioItemIDList,
          true,
          void 0,
          false,
          null
        )
      );
      layoutItems$1.push(
        new RadioItem(
          "homepage-layout-4-column",
          "强制使用 4 列布局",
          "homepage-layout-option",
          layoutRadioItemIDList,
          false,
          void 0,
          false,
          `#i_cecream .recommended-container_floor-aside .container {
                    grid-template-columns: repeat(4,1fr) !important;
                }`
        )
      );
      layoutItems$1.push(
        new RadioItem(
          "homepage-layout-5-column",
          "强制使用 5 列布局\n建议开启 增大视频信息字号",
          "homepage-layout-option",
          layoutRadioItemIDList,
          false,
          void 0,
          false,
          `#i_cecream .recommended-container_floor-aside .container {
                    grid-template-columns: repeat(5,1fr) !important;
                }`
        )
      );
      layoutItems$1.push(
        new RadioItem(
          "homepage-layout-6-column",
          "强制使用 6 列布局 (刷新)\n建议 隐藏发布时间，可选 显示活动轮播",
          "homepage-layout-option",
          layoutRadioItemIDList,
          false,
          void 0,
          false,
          `#i_cecream .recommended-container_floor-aside .container {
                    grid-template-columns: repeat(6,1fr) !important;
                }`
        )
      );
    }
    homepageGroupList.push(new Group("homepage-layout", "页面强制布局 (单选)", layoutItems$1));
    {
      rcmdListItems.push(
        new CheckboxItem(
          "homepage-hide-up-info-icon",
          "隐藏 视频tag (已关注/1万点赞)",
          false,
          void 0,
          false,
          `/* CSS伪造Logo */
                .bili-video-card .bili-video-card__info--icon-text {
                    width: 17px;
                    height: 17px;
                    color: transparent !important;
                    background-color: unset !important;
                    border-radius: unset !important;
                    margin: 0 2px 0 0 !important;
                    font-size: unset !important;
                    line-height: unset !important;
                    padding: unset !important;
                    user-select: none !important;
                }
                .bili-video-card .bili-video-card__info--icon-text::before {
                    content: "";
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="bili-video-card__info--owner__up"><!--[--><path d="M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z" fill="rgb(148, 153, 160)"></path><path d="M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z" fill="rgb(148, 153, 160)"></path><path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="rgb(148, 153, 160)"></path><!--]--></svg>');
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                }`
        )
      );
      rcmdListItems.push(
        new CheckboxItem(
          "homepage-hide-video-info-date",
          "隐藏 发布时间",
          false,
          void 0,
          false,
          `main:not(:has(.bilibili-app-recommend-root)) .bili-video-card__info--date {display: none !important;}`
        )
      );
      rcmdListItems.push(
        new CheckboxItem(
          "homepage-hide-danmaku-count",
          "隐藏 弹幕数",
          true,
          void 0,
          false,
          `main:not(:has(.bilibili-app-recommend-root)) .bili-video-card__stats--item:nth-child(2) {visibility: hidden;}`
        )
      );
      rcmdListItems.push(
        new CheckboxItem(
          "homepage-hide-bili-watch-later",
          "隐藏 稍后再看按钮",
          false,
          void 0,
          false,
          `.bili-watch-later {display: none !important;}`
        )
      );
      rcmdListItems.push(
        new CheckboxItem(
          "homepage-hide-ad-card",
          "隐藏 广告",
          true,
          void 0,
          false,
          `.feed-card:has(.bili-video-card__info--ad, [href*="cm.bilibili.com"]) {
                    display: none !important;
                }
                .bili-video-card.is-rcmd:has(.bili-video-card__info--ad, [href*="cm.bilibili.com"]) {
                    display: none !important;
                }

                /* 布局调整 */
                .recommended-container_floor-aside .container>*:nth-of-type(5) {
                    margin-top: 0 !important;
                }
                .recommended-container_floor-aside .container>*:nth-of-type(6) {
                    margin-top: 0 !important;
                }
                .recommended-container_floor-aside .container>*:nth-of-type(7) {
                    margin-top: 0 !important;
                }
                .recommended-container_floor-aside .container>*:nth-of-type(n + 8) {
                    margin-top: 0 !important;
                }
                /* 完全展示10个推荐项 */
                .recommended-container_floor-aside .container .feed-card:nth-of-type(n + 9) {
                    display: inherit !important;
                }
                .recommended-container_floor-aside .container.is-version8>*:nth-of-type(n + 13) {
                    margin-top: 0 !important;
                }
                .recommended-container_floor-aside .container .feed-card:nth-of-type(n + 12) {
                    display: inherit !important;
                }
                .recommended-container_floor-aside .container .floor-single-card:first-of-type {
                    margin-top: 0 !important;
                }`
        )
      );
      rcmdListItems.push(
        new CheckboxItem(
          "homepage-hide-live-card-recommend",
          "隐藏 直播间推荐",
          false,
          void 0,
          false,
          `.bili-live-card.is-rcmd {display: none !important;}`
        )
      );
      rcmdListItems.push(
        new CheckboxItem(
          "homepage-simple-sub-area-card-recommend",
          "简化 分区视频推荐",
          true,
          void 0,
          false,
          `.floor-single-card .layer {display: none !important;}
                .floor-single-card .floor-card {box-shadow: unset !important; border: none !important;}
                .single-card.floor-card .floor-card-inner:hover {background: none !important;}`
        )
      );
      rcmdListItems.push(
        new CheckboxItem(
          "homepage-hide-sub-area-card-recommend",
          "隐藏 分区视频推荐",
          false,
          void 0,
          false,
          // 含skeleton时不隐藏否则出现空档
          `.floor-single-card:not(:has(.skeleton, .skeleton-item)) {display: none !important;}`
        )
      );
      rcmdListItems.push(
        new CheckboxItem(
          "homepage-hide-skeleton-animation",
          "关闭 视频载入 骨架动效 (实验性)",
          false,
          void 0,
          false,
          `.bili-video-card .loading_animation .bili-video-card__skeleton--light,
                .bili-video-card .loading_animation .bili-video-card__skeleton--text,
                .bili-video-card .loading_animation .bili-video-card__skeleton--face,
                .bili-video-card .loading_animation .bili-video-card__skeleton--cover {
                    animation: none !important;
                }
                .skeleton .skeleton-item {
                    animation: none !important;
                }`
        )
      );
      rcmdListItems.push(
        new CheckboxItem(
          "homepage-hide-skeleton",
          "隐藏 视频载入 骨架 (实验性)",
          false,
          void 0,
          false,
          // anchor占位也隐藏
          `.bili-video-card:has(.loading_animation), .load-more-anchor {
                    visibility: hidden;
                }
                .floor-single-card:has(.skeleton, .skeleton-item) {
                    visibility: hidden;
                }`
        )
      );
    }
    homepageGroupList.push(new Group("homepage-rcmd-list", "视频列表", rcmdListItems));
    {
      sidebarItems$4.push(
        new CheckboxItem(
          "homepage-hide-desktop-download-tip",
          "隐藏 下载桌面端弹窗",
          true,
          void 0,
          false,
          `.desktop-download-tip {display: none !important;}`
        )
      );
      sidebarItems$4.push(
        new CheckboxItem(
          "homepage-hide-flexible-roll-btn",
          "隐藏 刷新",
          false,
          void 0,
          false,
          `.palette-button-wrap .flexible-roll-btn {display: none !important;}`
        )
      );
      sidebarItems$4.push(
        new CheckboxItem(
          "homepage-hide-feedback",
          "隐藏 客服和反馈",
          true,
          void 0,
          false,
          `.palette-button-wrap .storage-box {display: none !important;}`
        )
      );
      sidebarItems$4.push(
        new CheckboxItem(
          "homepage-hide-top-btn",
          "隐藏 回顶部",
          false,
          void 0,
          false,
          `.palette-button-wrap .top-btn-wrap {display: none !important;}`
        )
      );
    }
    homepageGroupList.push(new Group("homepage-sidebar", "页面右下角 小按钮", sidebarItems$4));
    {
      biliAppRcmdItems.push(
        new CheckboxItem(
          "homepage-hide-up-info-icon-bilibili-app-recommend",
          "隐藏 视频tag",
          false,
          void 0,
          false,
          `/* adapt bilibili-app-recommend */
                .bilibili-app-recommend-root .bili-video-card:not(:has(.ant-avatar)) .bili-video-card__info--owner>span[class^="_recommend-reason"] {
                    width: 17px;
                    height: 17px;
                    color: transparent !important;
                    background-color: unset !important;
                    border-radius: unset !important;
                    margin: 0 2px 0 0 !important;
                    font-size: unset !important;
                    line-height: unset !important;
                    padding: unset !important;
                    user-select: none !important;
                }
                .bilibili-app-recommend-root .bili-video-card:not(:has(.ant-avatar)) .bili-video-card__info--owner>span[class^="_recommend-reason"]::before {
                    content: "";
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="bili-video-card__info--owner__up"><!--[--><path d="M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z" fill="rgb(148, 153, 160)"></path><path d="M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z" fill="rgb(148, 153, 160)"></path><path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="rgb(148, 153, 160)"></path><!--]--></svg>');
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                }
                .bilibili-app-recommend-root .bili-video-card:has(.ant-avatar) [class^="_recommend-reason"] {
                    display: none !important;
                }`
        )
      );
      biliAppRcmdItems.push(
        new CheckboxItem(
          "homepage-hide-danmaku-count-bilibili-app-recommend",
          "隐藏 弹幕数",
          false,
          void 0,
          false,
          `.bili-video-card:has(use) .bili-video-card__stats--item:has([href="#widget-video-danmaku"]) {display: none !important;}`
        )
      );
      biliAppRcmdItems.push(
        new CheckboxItem(
          "homepage-hide-agree-count-bilibili-app-recommend",
          "隐藏 点赞数",
          false,
          void 0,
          false,
          `.bili-video-card:has(use) .bili-video-card__stats--item:has([href="#widget-agree"]) {display: none !important;}`
        )
      );
    }
    homepageGroupList.push(new Group("homepage-bili-app-rcmd", "适配插件 [bilibili-app-recommend]", biliAppRcmdItems));
  }
  const cleanURL = () => {
    const keysToRemove = /* @__PURE__ */ new Set([
      "from_source",
      "spm_id_from",
      "search_source",
      "vd_source",
      "unique_k",
      "is_story_h5",
      "from_spmid",
      "share_plat",
      "share_medium",
      "share_from",
      "share_source",
      "share_tag",
      "up_id",
      "timestamp",
      "mid",
      "live_from",
      "launch_id",
      "session_id",
      "share_session_id",
      "broadcast_type",
      "is_room_feed",
      "spmid",
      "plat_id",
      "goto",
      "report_flow_data",
      "trackid",
      "live_form",
      "track_id",
      "from",
      "visit_id",
      "extra_jump_from"
    ]);
    if (location.host === "search.bilibili.com") {
      keysToRemove.add("vt");
    }
    const url = location.href;
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const temp = [];
    for (const k of params.keys()) {
      if (keysToRemove.has(k)) {
        temp.push(k);
      }
    }
    for (const k of temp) {
      params.delete(k);
    }
    if (params.has("p") && params.get("p") == "1") {
      params.delete("p");
    }
    urlObj.search = params.toString();
    let newURL = urlObj.toString();
    if (newURL.endsWith("/")) {
      newURL = newURL.slice(0, -1);
    }
    if (newURL !== url) {
      history.replaceState(null, "", newURL);
    }
    debug("cleanURL complete");
  };
  const basicItems$6 = [];
  const headerLeftItems$1 = [];
  const headerCenterItems$1 = [];
  const headerRightItems$1 = [];
  const commonGroupList = [];
  let borderRadiusCSS = "";
  const host = location.host;
  const href$1 = location.href;
  if (host === "t.bilibili.com") {
    borderRadiusCSS = `
        #nav-searchform,
        .nav-search-content,
        .header-upload-entry,
        .v-popover-content,
        .van-popover,
        .v-popover-wrap,
        .v-popover,
        .topic-panel,
        .bili-header .header-upload-entry,
        .bili-dyn-up-list,
        .bili-dyn-publishing,
        .bili-dyn-publishing__action,
        .bili-dyn-sidebar *,
        .bili-dyn-up-list__window,
        .bili-dyn-live-users,
        .bili-dyn-topic-box,
        .bili-dyn-list-notification,
        .bili-dyn-item,
        .bili-dyn-banner,
        .bili-dyn-banner__img,
        .bili-dyn-my-info,
        .bili-dyn-card-video,
        .bili-dyn-list-tabs,
        .bili-album__preview__picture__gif,
        .bili-album__preview__picture__img {
            border-radius: 3px !important;
        }
        .bili-dyn-card-video__cover__mask,
        .bili-dyn-card-video__cover {
            border-radius: 3px 0 0 3px !important;
        }
        .bili-dyn-card-video__body {
            border-radius: 0 3px 3px 0 !important;
        }`;
  } else if (host === "live.bilibili.com") {
    borderRadiusCSS = `
        #nav-searchform,
        #player-ctnr,
        .nav-search-content,
        .header-upload-entry,
        .v-popover-content,
        .van-popover,
        .v-popover-wrap,
        .v-popover,
        .aside-area,
        .lower-row .right-ctnr *,
        .panel-main-ctnr,
        .startlive-btn,
        .flip-view,
        .content-wrapper,
        .chat-input-ctnr,
        .announcement-cntr,
        .bl-button--primary {
            border-radius: 3px !important;
        }
        #rank-list-vm,
        .head-info-section {
            border-radius: 3px 3px 0 0 !important;
        }
        .gift-control-section {
            border-radius: 0 0 3px 3px !important;
        }
        .follow-ctnr .right-part {
            border-radius: 0 3px 3px 0 !important;
        }
        .chat-control-panel {
            border-radius: 0 0 3px 3px !important;
        }
        .follow-ctnr .left-part,
        #rank-list-ctnr-box.bgStyle {
            border-radius: 3px 0 0 3px !important;
        }`;
  } else if (host === "search.bilibili.com") {
    borderRadiusCSS = `
        #nav-searchform,
        .nav-search-content,
        .v-popover-content,
        .van-popover,
        .v-popover-wrap,
        .v-popover,
        .search-sticky-header *,
        .vui_button,
        .header-upload-entry,
        .search-input-wrap *,
        .search-input-container .search-input-wrap,
        .bili-video-card__cover {
            border-radius: 3px !important;
        }`;
  } else {
    if (href$1.includes("bilibili.com/video/") || href$1.includes("bilibili.com/list/watchlater") || href$1.includes("bilibili.com/list/ml")) {
      borderRadiusCSS = `
            #nav-searchform,
            .nav-search-content,
            .v-popover-content,
            .van-popover,
            .v-popover,
            .pic-box,
            .action-list-container,
            .actionlist-item-inner .main .cover,
            .recommend-video-card .card-box .pic-box,
            .recommend-video-card .card-box .pic-box .rcmd-cover .rcmd-cover-img .b-img__inner img,
            .actionlist-item-inner .main .cover .cover-img .b-img__inner img,
            .card-box .pic-box .pic,
            .bui-collapse-header,
            .base-video-sections-v1,
            .bili-header .search-panel,
            .bili-header .header-upload-entry,
            .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar,
            .video-tag-container .tag-panel .tag-link,
            .video-tag-container .tag-panel .show-more-btn,
            .vcd .cover img,
            .vcd *,
            .upinfo-btn-panel *,
            .fixed-sidenav-storage div,
            .fixed-sidenav-storage a,
            .reply-box-textarea,
            .reply-box-send,
            .reply-box-send:after {
                border-radius: 3px !important;
            }
            .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar .bpx-player-dm-btn-send,
            .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar-wrap {
                border-radius: 0 3px 3px 0 !important;
            }
            .bpx-player-dm-btn-send .bui-button {
                border-radius: 3px 0 0 3px !important;
            }`;
    } else if (href$1.includes("bilibili.com/bangumi/play/")) {
      borderRadiusCSS = `
            a[class^="mediainfo_mediaCover"],
            a[class^="mediainfo_btnHome"],
            [class^="follow_btnFollow"],
            [class^="vipPaybar_textWrap__QARKv"],
            [class^="eplist_ep_list_wrapper"],
            [class^="RecommendItem_cover"],
            [class^="imageListItem_wrap"] [class^="imageListItem_coverWrap"],
            [class^="navTools_navMenu"] > *,
            [class^="navTools_item"],
            #nav-searchform,
            .nav-search-content,
            .v-popover-content,
            .van-popover,
            .v-popover,
            .pic-box,
            .card-box .pic-box .pic,
            .bui-collapse-header,
            .base-video-sections-v1,
            .bili-header .search-panel,
            .bili-header .header-upload-entry,
            .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar,
            .video-tag-container .tag-panel .tag-link,
            .video-tag-container .tag-panel .show-more-btn,
            .vcd .cover img,
            .vcd *,
            .upinfo-btn-panel *,
            .fixed-sidenav-storage div,
            .reply-box-textarea,
            .reply-box-send,
            .reply-box-send:after {
                border-radius: 3px !important;
            }
            .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar .bpx-player-dm-btn-send,
            .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar-wrap {
                border-radius: 0 3px 3px 0 !important;
            }
            .bpx-player-dm-btn-send .bui-button {
                border-radius: 3px 0 0 3px !important;
            }`;
    } else if (href$1.startsWith("https://www.bilibili.com/") && ["/index.html", "/"].includes(location.pathname)) {
      borderRadiusCSS = `
            #nav-searchform,
            .nav-search-content,
            .history-item,
            .header-upload-entry,
            .bili-header .search-panel,
            .bili-header .header-upload-entry,
            .bili-header__channel .channel-link,
            .channel-entry-more__link,
            .header-channel-fixed-right-item,
            .recommended-swipe-body,
            .bili-video-card .bili-video-card__cover,
            .bili-video-card .bili-video-card__image,
            .bili-video-card .bili-video-card__info--icon-text,
            .bili-live-card,
            .floor-card,
            .floor-card .badge,
            .single-card.floor-card .floor-card-inner,
            .single-card.floor-card .cover-container,
            .primary-btn,
            .flexible-roll-btn,
            .palette-button-wrap .flexible-roll-btn-inner,
            .palette-button-wrap .storage-box,
            .palette-button-wrap,
            .v-popover-content {
                border-radius: 3px !important;
            }
            .bili-video-card__stats {
                border-bottom-left-radius: 3px !important;
                border-bottom-right-radius: 3px !important;
            }
            .floor-card .layer {
                display: none !important;
            }
            .single-card.floor-card {
                border: none !important;
            }`;
    } else if (href$1.includes("bilibili.com/v/popular/")) {
      borderRadiusCSS = `
            #nav-searchform,
            .nav-search-content,
            .v-popover-content,
            .van-popover,
            .v-popover,
            .bili-header .search-panel,
            .bili-header .header-upload-entry,
            .upinfo-btn-panel *,
            .rank-list .rank-item > .content > .img,
            .card-list .video-card .video-card__content, .video-list .video-card .video-card__content,
            .fixed-sidenav-storage div,
            .fixed-sidenav-storage a {
                border-radius: 3px !important;
            }`;
    }
  }
  {
    basicItems$6.push(new CheckboxItem("border-radius", "页面直角化，去除圆角", false, void 0, false, borderRadiusCSS));
    basicItems$6.push(
      new CheckboxItem(
        "beauty-scrollbar",
        "美化页面滚动条",
        true,
        void 0,
        false,
        `
        /* WebKit */
        ::-webkit-scrollbar {
            width: 8px !important;
            height: 8px !important;
            background: transparent !important;
        }
        ::-webkit-scrollbar:hover {
            background: rgba(128, 128, 128, 0.4) !important;
        }
        ::-webkit-scrollbar-thumb {
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            background-color: rgba(0, 0, 0, 0.4) !important;
            z-index: 2147483647;
            -webkit-border-radius: 8px !important;
            background-clip: content-box !important;
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, 0.8) !important;
        }
        ::-webkit-scrollbar-thumb:active {
            background-color: rgba(0, 0, 0, 0.6) !important;
        }

        /* Firefox */
        * {
            scrollbar-color: rgba(0, 0, 0, 0.6) transparent !important;
            scrollbar-width: thin !important;
        }
        `
      )
    );
    basicItems$6.push(new CheckboxItem("url-cleaner", "URL参数净化", true, cleanURL, true, null));
  }
  commonGroupList.push(new Group("common-basic", "全站通用项 基本功能", basicItems$6));
  if (location.host != "live.bilibili.com") {
    {
      headerLeftItems$1.push(
        new CheckboxItem(
          "common-hide-nav-homepage-logo",
          "隐藏 主站Logo",
          false,
          void 0,
          false,
          `div.bili-header__bar .left-entry li:has(>a[href="//www.bilibili.com"]) svg {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>span>a[href="//www.bilibili.com"]) .navbar_logo {
                    display: none !important;
                }`
        )
      );
      headerLeftItems$1.push(
        new CheckboxItem(
          "common-hide-nav-homepage",
          "隐藏 首页",
          false,
          void 0,
          false,
          `div.bili-header__bar li:has(>a[href="//www.bilibili.com"]) span {
                    display: none !important;
                }
                div.bili-header__bar .left-entry .v-popover-wrap:has(>a[href="//www.bilibili.com"]) div {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>span>a[href="//www.bilibili.com"]) :not(svg) {
                    color: transparent;
                    user-select: none;
                }
                #internationalHeader li.nav-link-item:has(>span>a[href="//www.bilibili.com"]) .navbar_pullup {
                    display: none !important;
                }`
        )
      );
      headerLeftItems$1.push(
        new CheckboxItem(
          "common-hide-nav-anime",
          "隐藏 番剧",
          false,
          void 0,
          false,
          `div.bili-header__bar .left-entry li:has(>a[href="//www.bilibili.com/anime/"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>a[href*="bilibili.com/anime"]) {
                    display: none !important;
                }`
        )
      );
      headerLeftItems$1.push(
        new CheckboxItem(
          "common-hide-nav-live",
          "隐藏 直播",
          false,
          void 0,
          false,
          `div.bili-header__bar .left-entry li:has(>a[href="//live.bilibili.com"], >a[href="//live.bilibili.com/"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>span>a[href*="live.bilibili.com"]) {
                    display: none !important;
                }`
        )
      );
      headerLeftItems$1.push(
        new CheckboxItem(
          "common-hide-nav-game",
          "隐藏 游戏中心",
          false,
          void 0,
          false,
          `div.bili-header__bar .left-entry li:has(>a[href^="//game.bilibili.com"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>span>a[href*="game.bilibili.com"]) {
                    display: none !important;
                }`
        )
      );
      headerLeftItems$1.push(
        new CheckboxItem(
          "common-hide-nav-vipshop",
          "隐藏 会员购",
          false,
          void 0,
          false,
          `div.bili-header__bar .left-entry li:has(>a[href^="//show.bilibili.com"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>a[href*="show.bilibili.com"]) {
                    display: none !important;
                }`
        )
      );
      headerLeftItems$1.push(
        new CheckboxItem(
          "common-hide-nav-manga",
          "隐藏 漫画",
          false,
          void 0,
          false,
          `div.bili-header__bar .left-entry li:has(>a[href^="//manga.bilibili.com"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>span>a[href*="manga.bilibili.com"]) {
                    display: none !important;
                }`
        )
      );
      headerLeftItems$1.push(
        new CheckboxItem(
          "common-hide-nav-match",
          "隐藏 赛事",
          false,
          void 0,
          false,
          `div.bili-header__bar .left-entry li:has(>a[href^="//www.bilibili.com/match/"], >a[href^="//www.bilibili.com/v/game/match/"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(>a[href*="bilibili.com/match/"]) {
                    display: none !important;
                }`
        )
      );
      headerLeftItems$1.push(
        new CheckboxItem(
          "common-hide-nav-moveclip",
          "隐藏 活动/活动直播",
          false,
          void 0,
          false,
          `div.bili-header__bar li:has(.loc-mc-box) {
                    display: none !important;
                }
                div.bili-header__bar .left-entry li:not(:has(.v-popover)):has([href^="https://live.bilibili.com/"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(a[href*="live.bilibili.com/blackboard"]) {
                    display: none !important;
                }
                #internationalHeader li.nav-link-item:has(.loc-mc-box, [href^="https://live.bilibili.com/"]) {
                    display: none !important;
                }`
        )
      );
      headerLeftItems$1.push(
        new CheckboxItem(
          "common-hide-nav-bdu",
          "隐藏 百大评选",
          false,
          void 0,
          false,
          `div.bili-header__bar .left-entry li:has(>div>a[href*="bilibili.com/BPU20"]) {display: none !important;}`
        )
      );
      headerLeftItems$1.push(
        new CheckboxItem(
          "common-hide-nav-download-app",
          "隐藏 下载客户端",
          true,
          void 0,
          false,
          `div.bili-header__bar .left-entry li:has(a[href="//app.bilibili.com"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(a[href="//app.bilibili.com"]) {
                    display: none !important;
                }`
        )
      );
      headerLeftItems$1.push(
        new CheckboxItem(
          "common-hide-nav-blackboard",
          "隐藏 所有官方活动(强制)",
          false,
          void 0,
          false,
          `div.bili-header__bar .left-entry li:has(>a[href*="bilibili.com/blackboard"]) {
                    display: none !important;
                }
                div.bili-header__bar .left-entry li:has(>div>a[href*="bilibili.com/blackboard"]) {
                    display: none !important;
                }
                div.bili-header__bar .left-entry li:has(>a[href*="bilibili.com/video/"]) {
                    display: none !important;
                }
                div.bili-header__bar .left-entry li:has(>div>a[href*="bilibili.com/video/"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader li.nav-link-item:has(.loc-mc-box, span>a[href*="bilibili.com/blackboard"]) {
                    display: none !important;
                }`
        )
      );
    }
    commonGroupList.push(new Group("common-header-left", "全站通用项 顶栏 左侧", headerLeftItems$1));
    {
      headerCenterItems$1.push(
        new CheckboxItem(
          "common-hide-nav-search-rcmd",
          "隐藏 推荐搜索",
          false,
          void 0,
          false,
          `#nav-searchform .nav-search-input::placeholder {color: transparent;}
                /* 旧版header */
                #internationalHeader #nav_searchform input::placeholder {color: transparent;}`
        )
      );
      headerCenterItems$1.push(
        new CheckboxItem(
          "common-hide-nav-search-history",
          "隐藏 搜索历史",
          false,
          void 0,
          false,
          `.search-panel .history {display: none;}
                /* 旧版header */
                #internationalHeader .nav-search-box .history {display: none !important;}`
        )
      );
      headerCenterItems$1.push(
        new CheckboxItem(
          "common-hide-nav-search-trending",
          "隐藏 bilibili热搜",
          false,
          void 0,
          false,
          `.search-panel .trending {display: none;}
                /* 旧版header */
                #internationalHeader .nav-search-box .trending {display: none !important;}`
        )
      );
    }
    commonGroupList.push(new Group("common-header-center", "全站通用项 顶栏 搜索框", headerCenterItems$1));
    {
      headerRightItems$1.push(
        new CheckboxItem(
          "common-hide-nav-avatar",
          "隐藏 头像",
          false,
          void 0,
          false,
          `.right-entry .v-popover-wrap.header-avatar-wrap {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(.mini-avatar) {
                    display: none !important;
                }`
        )
      );
      headerRightItems$1.push(
        new CheckboxItem(
          "common-hide-nav-vip",
          "隐藏 大会员",
          true,
          void 0,
          false,
          `.right-entry .vip-wrap:has([href*="//account.bilibili.com/big"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(.mini-vip) {
                    display: none !important;
                }`
        )
      );
      headerRightItems$1.push(
        new CheckboxItem(
          "common-hide-nav-message",
          "隐藏 消息",
          false,
          void 0,
          false,
          `.right-entry .v-popover-wrap:has([href*="//message.bilibili.com"], [data-idx="message"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(.nav-item-message) {
                    display: none !important;
                }`
        )
      );
      headerRightItems$1.push(
        new CheckboxItem(
          "common-hide-nav-message-red-num",
          "隐藏 消息小红点",
          false,
          void 0,
          false,
          `.right-entry .v-popover-wrap:has([href*="//message.bilibili.com"], [data-idx="message"]) .red-num--message {
                    display: none !important;
                }`
        )
      );
      headerRightItems$1.push(
        new CheckboxItem(
          "common-hide-nav-dynamic",
          "隐藏 动态",
          false,
          void 0,
          false,
          `.right-entry .v-popover-wrap:has([href*="//t.bilibili.com"], [data-idx="dynamic"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(.nav-item-dynamic) {
                    display: none !important;
                }`
        )
      );
      headerRightItems$1.push(
        new CheckboxItem(
          "common-hide-nav-dynamic-red-num",
          "隐藏 动态小红点",
          false,
          void 0,
          false,
          `.right-entry .v-popover-wrap:has([href*="//t.bilibili.com"], [data-idx="dynamic"]) .red-num--dynamic {
                    display: none !important;
                }`
        )
      );
      {
        const favoriteRadioItemIDList = [
          "common-nav-favorite-watchlater-default",
          "common-hide-nav-favorite",
          "common-hide-nav-favorite-keep-watchlater",
          "common-nav-keep-watchlater"
        ];
        headerRightItems$1.push(
          new RadioItem(
            "common-nav-favorite-watchlater-default",
            "显示 收藏 (官方默认)\n新增稍后再看视频时，自动切换为稍后再看",
            "common-header-fav-option",
            favoriteRadioItemIDList,
            true,
            void 0,
            false,
            null
          )
        );
        headerRightItems$1.push(
          new RadioItem(
            "common-hide-nav-favorite",
            "隐藏 收藏，隐藏 稍后再看",
            "common-header-fav-option",
            favoriteRadioItemIDList,
            false,
            void 0,
            false,
            `.right-entry .v-popover-wrap:has(.header-favorite-container, [data-idx="fav"]) {
                        display: none !important;
                    }
                    /* 旧版header */
                    #internationalHeader .nav-user-center .item:has(.mini-favorite) {
                        display: none !important;
                    }`
          )
        );
        headerRightItems$1.push(
          new RadioItem(
            "common-hide-nav-favorite-keep-watchlater",
            "隐藏 收藏，显示 稍后再看(实验性)",
            "common-header-fav-option",
            favoriteRadioItemIDList,
            false,
            void 0,
            false,
            `
                    /* 移除加入稍后再看时的上翻动画 */
                    .right-entry .v-popover-wrap .header-favorite-container-box {
                        animation: unset !important;
                    }
                    .right-entry .v-popover-wrap .header-favorite-container-box .header-favorite-container__up {
                        display: none !important;
                    }
                    .right-entry .v-popover-wrap .header-favorite-container-box .header-favorite-container__down {
                        margin-top: 4px !important;
                    }
                    @media (max-width: 1279.9px) {
                        .right-entry .v-popover-wrap .header-favorite-container-box .header-favorite-container__down {
                            top: 10px;
                        }
                    }`
          )
        );
        headerRightItems$1.push(
          new RadioItem(
            "common-nav-keep-watchlater",
            "显示 收藏，显示 稍后再看(实验性)",
            "common-header-fav-option",
            favoriteRadioItemIDList,
            false,
            void 0,
            false,
            `
                    /* 移除加入稍后再看时的上翻动画 */
                    .right-entry .v-popover-wrap .header-favorite-container-box {
                        display: flex !important;
                        animation: unset !important;
                    }
                    .right-entry .v-popover-wrap .header-favorite-container-box .header-favorite-container__down {
                        margin-top: 0 !important;
                    }
                    @media (max-width: 1279.9px) {
                        .right-entry .v-popover-wrap .header-favorite-container-box .header-favorite-container__down {
                            top: 15px;
                        }
                    }`
          )
        );
      }
      headerRightItems$1.push(
        new CheckboxItem(
          "common-hide-nav-history",
          "隐藏 历史",
          false,
          void 0,
          false,
          `.right-entry .v-popover-wrap:has([href*="www.bilibili.com/account/history"], [data-idx="history"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(.mini-history) {
                    display: none !important;
                }`
        )
      );
      headerRightItems$1.push(
        new CheckboxItem(
          "common-hide-nav-member",
          "隐藏 创作中心",
          false,
          void 0,
          false,
          `.right-entry .right-entry-item:has(a[href*="//member.bilibili.com/platform/home"], [data-idx="creation"]) {
                    display: none !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center .item:has(a[href="//member.bilibili.com/platform/home"]) {
                    display: none !important;
                }`
        )
      );
      headerRightItems$1.push(
        new CheckboxItem(
          "common-hide-nav-upload",
          "隐藏 投稿",
          false,
          void 0,
          false,
          // 不可设定 display: none, 会导致历史和收藏popover显示不全
          `.right-entry .right-entry-item.right-entry-item--upload {
                    visibility: hidden !important;
                }
                /* 旧版header */
                #internationalHeader .nav-user-center >div:has(.mini-upload) {
                    visibility: hidden !important;
                }`
        )
      );
    }
    commonGroupList.push(new Group("common-header-right", "全站通用项 顶栏 右侧", headerRightItems$1));
  }
  const bv2av = () => {
    const dec = (x) => {
      const table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF";
      const tr = {};
      for (let i = 0; i < 58; i++) {
        tr[table[i]] = i;
      }
      const s = [11, 10, 3, 8, 4, 6];
      const xor = 177451812;
      const add = 8728348608;
      let r = 0;
      for (let i = 0; i < 6; i++) {
        r += tr[x[s[i]]] * 58 ** i;
      }
      return r - add ^ xor;
    };
    if (location.href.includes("bilibili.com/video/BV")) {
      const regex = /bilibili.com\/video\/(BV[0-9a-zA-Z]+)/;
      const match = regex.exec(location.href);
      if (match) {
        let partNum = "";
        const params = new URLSearchParams(location.search);
        if (params.has("p")) {
          partNum += `?p=${params.get("p")}`;
        }
        const aid = dec(match[1]);
        const newURL = `https://www.bilibili.com/video/av${aid}${partNum}${location.hash}`;
        history.replaceState(null, "", newURL);
        debug("bv2av complete");
      }
    }
  };
  let isSimpleShareBtn = false;
  const simpleShare = () => {
    if (isSimpleShareBtn) {
      return;
    }
    let shareBtn;
    let counter = 0;
    const checkElement = setInterval(() => {
      counter++;
      shareBtn = document.getElementById("share-btn-outer");
      if (shareBtn) {
        isSimpleShareBtn = true;
        clearInterval(checkElement);
        shareBtn.addEventListener("click", () => {
          var _a, _b;
          let title = (_a = document.querySelector("#viewbox_report > h1")) == null ? void 0 : _a.textContent;
          if (!title) {
            title = (_b = document.querySelector(".video-title-href")) == null ? void 0 : _b.textContent;
            if (!title) {
              return;
            }
          }
          if (!"（({【[［《「＜｛〔〖<〈『".includes(title[0]) && !"）)}】]］》」＞｝〕〗>〉』".includes(title.slice(-1))) {
            title = `【${title}】`;
          }
          const pattern = /av\d+|BV[1-9A-HJ-NP-Za-km-z]+/g;
          const avbv = pattern.exec(location.href);
          let shareText = `${title} 
https://www.bilibili.com/video/${avbv}`;
          const urlObj = new URL(location.href);
          const params = new URLSearchParams(urlObj.search);
          if (params.has("p")) {
            shareText += `?p=${params.get("p")}`;
          }
          navigator.clipboard.writeText(shareText);
        });
        debug("simpleShare complete");
      } else if (counter > 50) {
        clearInterval(checkElement);
        debug("simpleShare timeout");
      }
    }, 200);
  };
  const overridePlayerHeight = () => {
    const genSizeCSS = () => {
      const e = window.isWide;
      const i = window.innerHeight;
      const t = Math.max(document.body && document.body.clientWidth || window.innerWidth, 1100);
      const n = 1680 < innerWidth ? 411 : 350;
      const o = 16 * (i - (1690 < innerWidth ? 318 : 308)) / 9;
      const r = t - 112 - n;
      let d = r < o ? r : o;
      if (d < 668) {
        d = 668;
      }
      if (1694 < d) {
        d = 1694;
      }
      let a = d + n;
      if (window.isWide) {
        a -= 125;
        d -= 100;
      }
      let l;
      if (window.hasBlackSide && !window.isWide) {
        l = Math.round((d - 14 + (e ? n : 0)) * 0.5625) + 96;
      } else {
        l = Math.round((d + (e ? n : 0)) * 0.5625);
      }
      const s = `
            .video-container-v1 {width: auto;padding: 0 10px;}
            .left-container {width: ${a - n}px;}
            #bilibili-player {width: ${a - (e ? -30 : n)}px;height: ${l}px;position: ${e ? "relative" : "static"};}
            #oldfanfollowEntry {position: relative;top: ${e ? `${l + 10}px` : "0"};}
            #danmukuBox {margin-top: ${e ? `${l + 28}px` : "0"};}
            #playerWrap {height: ${l}px;}
            .video-discover {margin-left: ${(a - n) / 2}px;}
            `;
      return s.replace(/\n\s*/g, "").trim();
    };
    const overrideCSS = () => {
      const overrideStyle = document.getElementById("overrideSetSizeStyle");
      if (!overrideStyle) {
        const newStyleNode = document.createElement("style");
        newStyleNode.id = "overrideSetSizeStyle";
        newStyleNode.innerHTML = genSizeCSS();
        document.head.appendChild(newStyleNode);
        debug("override setSize OK");
      } else {
        overrideStyle.innerHTML = genSizeCSS();
        debug("refresh setSize OK");
      }
    };
    const observeStyle = new MutationObserver(() => {
      if (document.getElementById("setSizeStyle")) {
        overrideCSS();
        observeStyle.disconnect();
      }
    });
    if (document.head) {
      observeStyle.observe(document.head, { childList: true });
    }
    let isWide = window.isWide;
    const observeBtn = new MutationObserver(() => {
      const wideBtn = document.querySelector("#bilibili-player .bpx-player-ctrl-wide");
      if (wideBtn) {
        wideBtn.addEventListener("click", () => {
          debug("wideBtn click detected");
          window.isWide = isWide ? false : true;
          isWide = isWide ? false : true;
          overrideCSS();
        });
        observeBtn.disconnect();
      }
    });
    document.addEventListener("DOMContentLoaded", () => {
      observeBtn.observe(document, { childList: true, subtree: true });
    });
  };
  const basicItems$5 = [];
  const infoItems$1 = [];
  const playerItems$2 = [];
  const playerControlItems$1 = [];
  const danmakuItems$1 = [];
  const toolbarItems$1 = [];
  const upInfoItems = [];
  const rightItems$2 = [];
  const commentItems$2 = [];
  const sidebarItems$3 = [];
  const videoGroupList = [];
  const href = location.href;
  if (href.includes("bilibili.com/video/") || href.includes("bilibili.com/list/watchlater") || href.includes("bilibili.com/list/ml")) {
    {
      basicItems$5.push(new CheckboxItem("video-page-bv2av", "BV号转AV号", false, bv2av, true, null));
      basicItems$5.push(
        new CheckboxItem(
          "video-page-simple-share",
          "净化分享功能",
          true,
          simpleShare,
          false,
          `.video-share-popover .video-share-dropdown .dropdown-bottom {display: none !important;}
                .video-share-popover .video-share-dropdown .dropdown-top {padding: 15px !important;}
                .video-share-popover .video-share-dropdown .dropdown-top .dropdown-top-right {display: none !important;}
                .video-share-popover .video-share-dropdown .dropdown-top .dropdown-top-left {padding-right: 0 !important;}`
        )
      );
      basicItems$5.push(
        new CheckboxItem(
          "video-page-hide-fixed-header",
          "顶栏 滚动页面后不再吸附顶部",
          false,
          void 0,
          false,
          `.fixed-header .bili-header__bar {position: relative !important;}`
        )
      );
    }
    videoGroupList.push(new Group("video-basic", "播放页 基本功能", basicItems$5));
    {
      infoItems$1.push(
        new CheckboxItem(
          "video-page-hide-video-info-danmaku-count",
          "隐藏 弹幕数",
          false,
          void 0,
          false,
          `.video-info-detail .dm {display: none !important;}`
        )
      );
      infoItems$1.push(
        new CheckboxItem(
          "video-page-hide-video-info-pubdate",
          "隐藏 发布日期",
          false,
          void 0,
          false,
          `.video-info-detail .pubdate-ip {display: none !important;}`
        )
      );
      infoItems$1.push(
        new CheckboxItem(
          "video-page-hide-video-info-copyright",
          "隐藏 版权声明",
          false,
          void 0,
          false,
          `.video-info-detail .copyright {display: none !important;}`
        )
      );
      infoItems$1.push(
        new CheckboxItem(
          "video-page-hide-video-info-honor",
          "隐藏 视频荣誉(排行榜/每周必看)",
          false,
          void 0,
          false,
          `.video-info-detail .honor-rank, .video-info-detail .honor-weekly {display: none !important;}`
        )
      );
      infoItems$1.push(
        new CheckboxItem(
          "video-page-hide-video-info-argue",
          "隐藏 温馨提示(饮酒/危险/AI生成)",
          true,
          void 0,
          false,
          `.video-info-detail .argue, .video-info-detail .video-argue {display: none !important;}`
        )
      );
    }
    videoGroupList.push(new Group("video-info", "视频信息", infoItems$1));
    {
      playerItems$2.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-bili-guide-all",
          "隐藏 一键三连弹窗",
          false,
          void 0,
          false,
          `.bpx-player-video-area .bili-guide, .bpx-player-video-area .bili-guide-all {display: none !important;}`
        )
      );
      playerItems$2.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-bili-vote",
          "隐藏 投票弹窗",
          false,
          void 0,
          false,
          `.bpx-player-video-area .bili-vote, .bpx-player-video-area .bili-cmd-shrink {display: none !important;}`
        )
      );
      playerItems$2.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-bili-score",
          "隐藏 评分弹窗",
          false,
          void 0,
          false,
          `.bpx-player-video-area .bili-score {display: none !important;}`
        )
      );
      playerItems$2.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-bili-clock",
          "隐藏 打卡弹窗",
          false,
          void 0,
          false,
          `.bpx-player-video-area .bili-clock {display: none !important;}`
        )
      );
      playerItems$2.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-bili-reserve",
          "隐藏 视频预告",
          false,
          void 0,
          false,
          `.bpx-player-video-area .bili-reserve {display: none !important;}`
        )
      );
      playerItems$2.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-bili-link",
          "隐藏 视频链接",
          false,
          void 0,
          false,
          `.bpx-player-video-area .bili-link {display: none !important;}`
        )
      );
      playerItems$2.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-top-left-title",
          "隐藏 左上角 播放器内标题",
          false,
          void 0,
          false,
          `.bpx-player-top-title {display: none !important;}
                .bpx-player-top-left-title {display: none !important;}
                /* 播放器上方阴影渐变 */
                .bpx-player-top-mask {display: none !important;}`
        )
      );
      playerItems$2.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-top-left-music",
          "隐藏 左上角 视频音乐链接",
          false,
          void 0,
          false,
          `.bpx-player-top-left-music {display: none !important;}`
        )
      );
      playerItems$2.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-top-left-follow",
          "隐藏 左上角 关注UP主",
          true,
          void 0,
          false,
          `.bpx-player-top-left-follow {display: none !important;}`
        )
      );
      playerItems$2.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-top-issue",
          "隐藏 右上角 反馈按钮",
          true,
          void 0,
          false,
          `.bpx-player-top-issue {display: none !important;}`
        )
      );
      playerItems$2.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-state-wrap",
          "隐藏 视频暂停时大Logo",
          false,
          void 0,
          false,
          `.bpx-player-state-wrap {display: none !important;}`
        )
      );
      playerItems$2.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-dialog-wrap",
          "隐藏 弹幕悬停点赞/复制/举报",
          false,
          void 0,
          false,
          `.bpx-player-dialog-wrap {display: none !important;}`
        )
      );
      playerItems$2.push(
        new CheckboxItem(
          "video-page-bpx-player-bili-high-icon",
          "隐藏 高赞弹幕前点赞按钮",
          false,
          void 0,
          false,
          `.bili-dm .bili-high-icon {display: none !important}`
        )
      );
      playerItems$2.push(
        new CheckboxItem(
          "video-page-bpx-player-bili-dm-vip-white",
          "彩色渐变弹幕 变成白色",
          false,
          void 0,
          false,
          `#bilibili-player .bili-dm>.bili-dm-vip {
                    background: unset !important;
                    background-size: unset !important;
                    /* 父元素未指定 var(--textShadow), 默认重墨描边凑合用 */
                    text-shadow: 1px 0 1px #000000,0 1px 1px #000000,0 -1px 1px #000000,-1px 0 1px #000000 !important;
                    text-stroke: none !important;
                    -webkit-text-stroke: none !important;
                    -moz-text-stroke: none !important;
                    -ms-text-stroke: none !important;
                }`
        )
      );
      playerItems$2.push(
        new CheckboxItem(
          "video-page-bpx-player-subtitle-font-family",
          "CC字幕 字体优化 (实验性)",
          false,
          void 0,
          false,
          `#bilibili-player .bpx-player-subtitle-panel-text {
                    font-family: inherit;
                }`
        )
      );
      playerItems$2.push(
        new CheckboxItem(
          "video-page-bpx-player-subtitle-text-stroke",
          "CC字幕 字体描边 (实验性)",
          false,
          void 0,
          false,
          `#bilibili-player .bpx-player-subtitle-panel-text {
                    background: unset !important;
                    background-color: rgba(0,0,0,0.7) !important;
                    text-shadow: none !important;
                    background-clip: text !important;
                    text-stroke: 3px transparent !important;
                    -webkit-background-clip: text !important;
                    -webkit-text-stroke: 3px transparent;
                    -moz-background-clip: text !important;
                    -moz-text-stroke: 3px transparent;
                    -ms-background-clip: text !important;
                    -ms-text-stroke: 3px transparent;
                }`
        )
      );
    }
    videoGroupList.push(new Group("video-player", "播放器", playerItems$2));
    {
      playerControlItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-prev",
          "隐藏 上一个视频",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-prev {display: none !important;}`
        )
      );
      playerControlItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-play",
          "隐藏 播放/暂停",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-play {display: none !important;}`
        )
      );
      playerControlItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-next",
          "隐藏 下一个视频",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-next {display: none !important;}`
        )
      );
      playerControlItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-viewpoint",
          "隐藏 章节列表",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-viewpoint {display: none !important;}`
        )
      );
      playerControlItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-eplist",
          "隐藏 选集",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-eplist {display: none !important;}`
        )
      );
      playerControlItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-playbackrate",
          "隐藏 倍速",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-playbackrate {display: none !important;}`
        )
      );
      playerControlItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-subtitle",
          "隐藏 字幕",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-subtitle {display: none !important;}`
        )
      );
      playerControlItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-volume",
          "隐藏 音量",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-volume {display: none !important;}`
        )
      );
      playerControlItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-setting",
          "隐藏 视频设置",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-setting {display: none !important;}`
        )
      );
      playerControlItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-pip",
          "隐藏 画中画(Chrome)",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-pip {display: none !important;}`
        )
      );
      playerControlItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-wide",
          "隐藏 宽屏",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-wide {display: none !important;}`
        )
      );
      playerControlItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-web",
          "隐藏 网页全屏",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-web {display: none !important;}`
        )
      );
      playerControlItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-full",
          "隐藏 全屏",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-full {display: none !important;}`
        )
      );
      playerControlItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-shadow-progress-area",
          "隐藏 底边mini视频进度",
          true,
          void 0,
          false,
          `.bpx-player-shadow-progress-area {display: none !important;}`
        )
      );
    }
    videoGroupList.push(new Group("video-player-control", "播放控制", playerControlItems$1));
    {
      danmakuItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-video-info-online",
          "隐藏 同时在看人数",
          false,
          void 0,
          false,
          `.bpx-player-video-info-online, .bpx-player-video-info-divide {display: none !important;}`
        )
      );
      danmakuItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-video-info-dm",
          "隐藏 载入弹幕数量",
          false,
          void 0,
          false,
          `.bpx-player-video-info-dm, .bpx-player-video-info-divide {display: none !important;}`
        )
      );
      danmakuItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-dm-switch",
          "隐藏 弹幕启用",
          false,
          void 0,
          false,
          `.bpx-player-dm-switch {display: none !important;}`
        )
      );
      danmakuItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-dm-setting",
          "隐藏 弹幕显示设置",
          false,
          void 0,
          false,
          `.bpx-player-dm-setting {display: none !important;}`
        )
      );
      danmakuItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-video-btn-dm",
          "隐藏 弹幕样式",
          false,
          void 0,
          false,
          `.bpx-player-video-btn-dm {display: none !important;}`
        )
      );
      danmakuItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-dm-input",
          "隐藏 占位文字",
          true,
          void 0,
          false,
          `.bpx-player-dm-input::placeholder {color: transparent !important;}`
        )
      );
      danmakuItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-dm-hint",
          "隐藏 弹幕礼仪",
          true,
          void 0,
          false,
          `.bpx-player-dm-hint {display: none !important;}`
        )
      );
      danmakuItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-dm-btn-send",
          "隐藏 发送按钮",
          false,
          void 0,
          false,
          `.bpx-player-dm-btn-send {display: none !important;}`
        )
      );
      danmakuItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-postpanel",
          "隐藏 智能弹幕/广告弹幕",
          false,
          void 0,
          false,
          `.bpx-player-postpanel-sug,
                .bpx-player-postpanel-carousel,
                .bpx-player-postpanel-popup {
                    color: transparent !important;
                }`
        )
      );
      danmakuItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-sending-area",
          "非全屏下 关闭弹幕栏 (刷新去黑边)",
          false,
          overridePlayerHeight,
          false,
          // video page的player height由JS动态设定
          `.bpx-player-sending-area {display: none !important;}`
        )
      );
      danmakuItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-video-inputbar",
          "全屏下 关闭弹幕输入框",
          false,
          void 0,
          false,
          `.bpx-player-container[data-screen=full] .bpx-player-control-bottom-center .bpx-player-video-inputbar,
                .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center .bpx-player-video-inputbar {
                    display: none !important;
                }
                .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center,
                .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center {
                    padding: 0 15px !important;
                }
                /* 弹幕开关按钮贴紧左侧, 有章节列表时增大列表宽度 */
                .bpx-player-container[data-screen=full] .bpx-player-control-bottom-left,
                .bpx-player-container[data-screen=web] .bpx-player-control-bottom-left {
                    min-width: unset !important;
                }
                .bpx-player-container[data-screen=full] .bpx-player-ctrl-viewpoint,
                .bpx-player-container[data-screen=web] .bpx-player-ctrl-viewpoint {
                    width: fit-content !important;
                }`
        )
      );
    }
    videoGroupList.push(new Group("video-danmaku", "弹幕栏", danmakuItems$1));
    {
      toolbarItems$1.push(
        new CheckboxItem(
          "video-page-hide-video-share-popover",
          "隐藏 分享按钮弹出菜单",
          true,
          void 0,
          false,
          `.video-share-popover {display: none !important;}`
        )
      );
      toolbarItems$1.push(
        new CheckboxItem(
          "video-page-hide-below-info-video-ai-assistant",
          "隐藏 官方AI总结",
          false,
          void 0,
          false,
          `.video-toolbar-right .video-ai-assistant {display: none !important;}`
        )
      );
      toolbarItems$1.push(
        new CheckboxItem(
          "video-page-hide-below-info-video-note",
          "隐藏 记笔记",
          false,
          void 0,
          false,
          `.video-toolbar-right .video-note {display: none !important;}`
        )
      );
      toolbarItems$1.push(
        new CheckboxItem(
          "video-page-hide-below-info-video-report-menu",
          "隐藏 举报/笔记/稍后再看",
          false,
          void 0,
          false,
          `.video-toolbar-right .video-tool-more {display: none !important;}`
        )
      );
      toolbarItems$1.push(
        new CheckboxItem(
          "video-page-hide-below-info-desc",
          "隐藏 视频简介",
          false,
          void 0,
          false,
          `#v_desc {display: none !important;}
                /* 收藏夹和稍后再看 */
                .video-desc-container {display: none !important;}`
        )
      );
      toolbarItems$1.push(
        new CheckboxItem(
          "video-page-hide-below-info-tag",
          "隐藏 tag列表",
          false,
          void 0,
          false,
          `#v_tag {display: none !important;}
                /* 收藏夹和稍后再看 */
                .video-tag-container {display: none !important;}`
        )
      );
      toolbarItems$1.push(
        new CheckboxItem(
          "video-page-hide-below-activity-vote",
          "隐藏 活动宣传",
          true,
          void 0,
          false,
          `#activity_vote {display: none !important;}`
        )
      );
      toolbarItems$1.push(
        new CheckboxItem(
          "video-page-hide-below-bannerAd",
          "隐藏 广告banner",
          true,
          void 0,
          false,
          `#bannerAd {display: none !important;}`
        )
      );
    }
    videoGroupList.push(new Group("video-toolbar", "视频下方 工具/简介/Tag", toolbarItems$1));
    {
      upInfoItems.push(
        new CheckboxItem(
          "video-page-hide-up-sendmsg",
          "隐藏 给UP发消息",
          true,
          void 0,
          false,
          `.up-detail .send-msg {display: none !important;}`
        )
      );
      upInfoItems.push(
        new CheckboxItem(
          "video-page-hide-up-description",
          "隐藏 UP简介",
          false,
          void 0,
          false,
          `.up-detail .up-description {display: none !important;}`
        )
      );
      upInfoItems.push(
        new CheckboxItem(
          "video-page-hide-up-charge",
          "隐藏 充电",
          false,
          void 0,
          false,
          `.upinfo-btn-panel .new-charge-btn, .upinfo-btn-panel .old-charge-btn {display: none !important;}`
        )
      );
      upInfoItems.push(
        new CheckboxItem(
          "video-page-hide-up-bili-avatar-pendent-dom",
          "隐藏 UP主头像外饰品",
          false,
          void 0,
          false,
          `.up-info-container .bili-avatar-pendent-dom {display: none !important;}
                .up-avatar-wrap .up-avatar {background-color: transparent !important;}`
        )
      );
      upInfoItems.push(
        new CheckboxItem(
          "video-page-hide-up-membersinfo-normal-header",
          "隐藏 创作团队header",
          true,
          void 0,
          false,
          `.membersinfo-normal .header {display: none !important;}`
        )
      );
    }
    videoGroupList.push(new Group("video-up-info", "右侧 UP主信息", upInfoItems));
    {
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-ad",
          "隐藏 广告",
          true,
          void 0,
          false,
          `#slide_ad {display: none !important;}
                .ad-report.video-card-ad-small {display: none !important;}
                .video-page-special-card-small {display: none !important;}
                #reco_list {margin-top: 0 !important;}`
        )
      );
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-video-page-game-card-small",
          "隐藏 游戏推荐",
          false,
          void 0,
          false,
          `#reco_list .video-page-game-card-small {display: none !important;}`
        )
      );
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-danmaku",
          "隐藏 弹幕列表",
          true,
          void 0,
          false,
          `
                /* 不可使用 display:none 否则播放器宽屏模式下danmukuBox的margin-top失效，导致视频覆盖右侧列表 */
                #danmukuBox {
                    visibility: hidden !important;
                    height: 0 !important;
                    margin-bottom: 0 !important;
                }`
        )
      );
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-reco-list-next-play-next-button",
          "隐藏 自动连播按钮",
          false,
          void 0,
          false,
          `#reco_list .next-play .next-button {display: none !important;}`
        )
      );
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-section-height",
          "视频合集 增加合集列表高度",
          true,
          void 0,
          false,
          `.base-video-sections-v1 .video-sections-content-list {height: fit-content !important; max-height: 350px !important;}
                .video-sections-v1 .video-sections-content-list {height: fit-content !important; max-height: 350px !important;}`
        )
      );
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-section-next-btn",
          "隐藏 视频合集 自动连播",
          false,
          void 0,
          false,
          `.base-video-sections-v1 .next-button {display: none !important;}
                .video-sections-head_first-line .next-button {display: none !important;}`
        )
      );
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-section-play-num",
          "隐藏 视频合集 播放量",
          false,
          void 0,
          false,
          `.base-video-sections-v1 .play-num {display: none !important;}
                .video-sections-head_second-line .play-num {display: none !important;}`
        )
      );
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-section-abstract",
          "隐藏 视频合集 简介",
          true,
          void 0,
          false,
          `.base-video-sections-v1 .abstract {display: none !important;}
                .base-video-sections-v1 .second-line_left img {display: none !important;}
                .video-sections-head_second-line .abstract {display: none !important;}
                .video-sections-head_second-line .second-line_left img {display: none !important;}`
        )
      );
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-section-subscribe",
          "隐藏 视频合集 订阅合集",
          false,
          void 0,
          false,
          `.base-video-sections-v1 .second-line_right {display: none !important;}
                .video-sections-head_second-line .second-line_right {display: none !important;}`
        )
      );
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-multi-page-next-btn",
          "隐藏 分P视频 自动连播",
          false,
          void 0,
          false,
          `#multi_page .next-button {display: none !important;}`
        )
      );
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-duration",
          "隐藏 相关视频 视频时长",
          false,
          void 0,
          false,
          `#reco_list .duration {display: none !important;}
                /* 适配watchlater, favlist */
                .recommend-list-container .duration {display: none !important;}`
        )
      );
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-reco-list-watch-later-video",
          "隐藏 相关视频 稍后再看按钮",
          false,
          void 0,
          false,
          `#reco_list .watch-later-video {display: none !important;}
                /* 适配watchlater, favlist */
                .recommend-list-container .watch-later-video {display: none !important;}`
        )
      );
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-reco-list-rec-list-info-up",
          "隐藏 相关视频 UP主",
          false,
          void 0,
          false,
          `#reco_list .info .upname {
                    display: none !important;
                }
                #reco_list .info {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                /* 适配watchlater, favlist */
                .recommend-list-container .info .upname {
                    display: none !important;
                }
                .recommend-list-container .info {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }`
        )
      );
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-reco-list-rec-list-info-plays",
          "隐藏 相关视频 播放和弹幕",
          false,
          void 0,
          false,
          `#reco_list .info .playinfo {
                    display: none !important;
                }
                #reco_list .info {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                /* 适配watchlater, favlist */
                .recommend-list-container .info .playinfo {
                    display: none !important;
                }
                .recommend-list-container .info {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }`
        )
      );
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-reco-list-rec-list",
          "隐藏 相关视频 全部列表",
          false,
          void 0,
          false,
          `#reco_list .rec-list {display: none !important;}
                /* 适配watchlater, favlist */
                .recommend-list-container {display: none !important;}`
        )
      );
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-right-bottom-banner",
          "隐藏 活动banner",
          true,
          void 0,
          false,
          `#right-bottom-banner {display: none !important;}`
        )
      );
      rightItems$2.push(
        new CheckboxItem(
          "video-page-hide-right-container-live",
          "隐藏 直播间推荐",
          true,
          void 0,
          false,
          `.right-container .pop-live-small-mode {display: none !important;}`
        )
      );
    }
    videoGroupList.push(new Group("video-right", "右侧 视频栏", rightItems$2));
    {
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-reply-notice",
          "隐藏 活动/notice",
          true,
          void 0,
          false,
          `.comment-container .reply-header .reply-notice {display: none !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-main-reply-box",
          "隐藏 整个评论框",
          false,
          void 0,
          false,
          // 不可使用display: none, 会使底部吸附评论框宽度变化
          `.comment-container .main-reply-box {height: 0 !important; visibility: hidden !important;}
                .comment-container .reply-list {margin-top: -20px !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-fixed-reply-box",
          "隐藏 页面底部 吸附评论框",
          true,
          void 0,
          false,
          `.comment-container .fixed-reply-box {display: none !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-reply-box-textarea-placeholder",
          "隐藏 评论编辑器内占位文字",
          true,
          void 0,
          false,
          `.main-reply-box .reply-box-textarea::placeholder {color: transparent !important;}
                .fixed-reply-box .reply-box-textarea::placeholder {color: transparent !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-reply-decorate",
          "隐藏 评论内容右侧装饰",
          false,
          void 0,
          false,
          `.comment-container .reply-decorate {display: none !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-fan-badge",
          "隐藏 ID后粉丝牌",
          false,
          void 0,
          false,
          `.comment-container .fan-badge {display: none !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-user-level",
          "隐藏 一级评论用户等级",
          false,
          void 0,
          false,
          `.comment-container .user-level {display: none !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-sub-user-level",
          "隐藏 二级评论用户等级",
          false,
          void 0,
          false,
          `.comment-container .sub-user-level {display: none !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-bili-avatar-pendent-dom",
          "隐藏 用户头像外圈饰品",
          false,
          void 0,
          false,
          `.comment-container .root-reply-avatar .bili-avatar-pendent-dom {display: none !important;}
            .comment-container .root-reply-avatar .bili-avatar {width: 48px !important; height:48px !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-bili-avatar-nft-icon",
          "隐藏 用户头像右下小icon",
          false,
          void 0,
          false,
          `.comment-container .bili-avatar-nft-icon {display: none !important;}
                .comment-container .bili-avatar-icon {display: none !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-reply-tag-list",
          "隐藏 评论内容下tag(UP觉得很赞)",
          false,
          void 0,
          false,
          `.comment-container .reply-tag-list {display: none !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-note-prefix",
          "隐藏 笔记评论前的小Logo",
          true,
          void 0,
          false,
          `.comment-container .note-prefix {display: none !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-jump-link-search-word",
          "隐藏 评论内容搜索关键词高亮",
          true,
          void 0,
          false,
          `.comment-container .reply-content .jump-link.search-word {color: inherit !important;}
                .comment-container .reply-content .jump-link.search-word:hover {color: #008AC5 !important;}
                .comment-container .reply-content .icon.search-word {display: none !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-reply-content-user-highlight",
          "隐藏 二级评论中的@高亮",
          false,
          void 0,
          false,
          `.comment-container .sub-reply-container .reply-content .jump-link.user {color: inherit !important;}
                .comment-container .sub-reply-container .reply-content .jump-link.user:hover {color: #40C5F1 !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-at-reply-at-bots",
          "隐藏 召唤AI机器人的评论",
          true,
          void 0,
          false,
          // 8455326 @机器工具人
          // 234978716 @有趣的程序员
          // 1141159409 @AI视频小助理
          // 437175450 @AI视频小助理总结一下 (误伤)
          // 1692825065 @AI笔记侠
          // 690155730 @AI视频助手
          // 689670224 @哔哩哔理点赞姬
          // 3494380876859618 @课代表猫
          // 1168527940 @AI课代表呀
          // 439438614 @木几萌Moe
          // 1358327273 @星崽丨StarZai
          // 3546376048741135 @AI沈阳美食家
          // 1835753760 @AI识片酱
          `.reply-item:has(.jump-link.user[data-user-id="8455326"]),
                .reply-item:has(.jump-link.user[data-user-id="234978716"]),
                .reply-item:has(.jump-link.user[data-user-id="1141159409"]),
                .reply-item:has(.jump-link.user[data-user-id="437175450"]),
                .reply-item:has(.jump-link.user[data-user-id="1692825065"]),
                .reply-item:has(.jump-link.user[data-user-id="690155730"]),
                .reply-item:has(.jump-link.user[data-user-id="689670224"]),
                .reply-item:has(.jump-link.user[data-user-id="3494380876859618"]),
                .reply-item:has(.jump-link.user[data-user-id="1168527940"]),
                .reply-item:has(.jump-link.user[data-user-id="439438614"]),
                .reply-item:has(.jump-link.user[data-user-id="1358327273"]),
                .reply-item:has(.jump-link.user[data-user-id="3546376048741135"]),
                .reply-item:has(.jump-link.user[data-user-id="1835753760"]) {
                    display: none !important;
                }`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-zero-like-at-reply",
          "隐藏 包含@的 无人点赞评论",
          false,
          void 0,
          false,
          `.comment-container .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-at-reply-all",
          "隐藏 包含@的 全部评论",
          false,
          void 0,
          false,
          `.comment-container .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon)) {display: none !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-zero-like-lv1-reply",
          "隐藏 LV1 无人点赞评论",
          false,
          void 0,
          false,
          `.comment-container .reply-item:has(.st1.lv1):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-zero-like-lv2-reply",
          "隐藏 LV2 无人点赞评论",
          false,
          void 0,
          false,
          `.comment-container .reply-item:has(.st1.lv2):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-zero-like-lv3-reply",
          "隐藏 LV3 无人点赞评论",
          false,
          void 0,
          false,
          `.comment-container .reply-item:has(.st1.lv3):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-root-reply-dislike-reply-btn",
          "一级评论 踩/回复 只在hover时显示",
          true,
          void 0,
          false,
          `.comment-container .reply-info:not(:has(i.disliked)) .reply-btn,
                .comment-container .reply-info:not(:has(i.disliked)) .reply-dislike {
                    visibility: hidden;
                }
                .comment-container .reply-item:hover .reply-btn,
                .comment-container .reply-item:hover .reply-dislike {
                    visibility: visible !important;
                }`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-sub-reply-dislike-reply-btn",
          "二级评论 踩/回复 只在hover时显示",
          true,
          void 0,
          false,
          `.comment-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-btn,
                .comment-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-dislike {
                    visibility: hidden;
                }
                .comment-container .sub-reply-item:hover .sub-reply-btn,
                .comment-container .sub-reply-item:hover .sub-reply-dislike {
                    visibility: visible !important;
                }`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-emoji-large",
          "隐藏 大表情",
          false,
          void 0,
          false,
          `.comment-container .emoji-large {display: none !important;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-hide-emoji-large-zoom",
          "大表情变成小表情",
          false,
          void 0,
          false,
          `.comment-container .emoji-large {zoom: .5;}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-reply-user-name-color-pink",
          "用户名 全部大会员色",
          false,
          void 0,
          false,
          `.comment-container .reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #FB7299 !important;}}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-reply-user-name-color-default",
          "用户名 全部恢复默认色",
          false,
          void 0,
          false,
          `.comment-container .reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #61666d !important;}}`
        )
      );
      commentItems$2.push(
        new CheckboxItem(
          "video-page-reply-view-image-optimize",
          "笔记图片 查看大图优化",
          true,
          void 0,
          false,
          // 单图模式隐藏底部图片列表, 多图模式淡化列表, hover复原, 左右按钮增大
          `.reply-view-image .last-image, .reply-view-image .next-image {zoom: 1.4;}
                .reply-view-image:has(.preview-item-box:only-child) .last-image {display: none !important;}
                .reply-view-image:has(.preview-item-box:only-child) .next-image {display: none !important;}
                .reply-view-image .preview-list:has(.preview-item-box:only-child) {display: none !important;}
                .reply-view-image .preview-list {opacity: 0.2; transition: opacity 0.1s ease-in-out;}
                .reply-view-image .preview-list:hover {opacity: 1; transition: opacity 0.1s ease-in-out;}`
        )
      );
    }
    videoGroupList.push(new Group("video-comment", "评论区", commentItems$2));
    {
      sidebarItems$3.push(
        new CheckboxItem(
          "video-page-hide-sidenav-right-container-live",
          "隐藏 小窗播放器",
          false,
          void 0,
          false,
          `.fixed-sidenav-storage .mini-player-window {display: none !important;}
                /* 适配watchlater, favlist */
                .float-nav-exp .nav-menu .item.mini {display: none !important;}`
        )
      );
      sidebarItems$3.push(
        new CheckboxItem(
          "video-page-hide-sidenav-customer-service",
          "隐藏 客服",
          true,
          void 0,
          false,
          `.fixed-sidenav-storage .customer-service {display: none !important;}
                /* 适配watchlater, favlist */
                .float-nav-exp .nav-menu a:has(>.item.help) {display: none !important;}`
        )
      );
      sidebarItems$3.push(
        new CheckboxItem(
          "video-page-hide-sidenav-back-to-top",
          "隐藏 回顶部",
          false,
          void 0,
          false,
          `.fixed-sidenav-storage .back-to-top {display: none !important;}
                /* 适配watchlater, favlist */
                .float-nav-exp .nav-menu .item.backup {display: none !important;}`
        )
      );
    }
    videoGroupList.push(new Group("video-sidebar", "页面右下角 小按钮", sidebarItems$3));
  }
  const basicItems$4 = [];
  const playerItems$1 = [];
  const playerControlItems = [];
  const danmakuItems = [];
  const toolbarItems = [];
  const rightItems$1 = [];
  const commentItems$1 = [];
  const sidebarItems$2 = [];
  const bangumiGroupList = [];
  let isBangumiSimpleShareBtn = false;
  const bangumiSimpleShare = () => {
    if (isBangumiSimpleShareBtn) {
      return;
    }
    let shareBtn;
    let counter = 0;
    const checkElement = setInterval(() => {
      counter++;
      shareBtn = document.getElementById("share-container-id");
      if (shareBtn) {
        isBangumiSimpleShareBtn = true;
        clearInterval(checkElement);
        shareBtn.addEventListener("click", () => {
          var _a, _b;
          const mainTitle = (_a = document.querySelector("[class^='mediainfo_mediaTitle']")) == null ? void 0 : _a.textContent;
          const subTitle = (_b = document.getElementById("player-title")) == null ? void 0 : _b.textContent;
          const shareText = `《${mainTitle}》${subTitle} 
https://www.bilibili.com${location.pathname}`;
          navigator.clipboard.writeText(shareText);
        });
        debug("bangumiSimpleShare complete");
      } else if (counter > 50) {
        clearInterval(checkElement);
        debug("bangumiSimpleShare timeout");
      }
    }, 200);
  };
  if (location.href.startsWith("https://www.bilibili.com/bangumi/play/")) {
    {
      basicItems$4.push(
        new CheckboxItem(
          "video-page-simple-share",
          "净化分享功能",
          true,
          bangumiSimpleShare,
          false,
          `#share-container-id [class^='Share_boxBottom'] {display: none !important;}
                #share-container-id [class^='Share_boxTop'] {padding: 15px !important;}
                #share-container-id [class^='Share_boxTopRight'] {display: none !important;}
                #share-container-id [class^='Share_boxTopLeft'] {padding: 0 !important;}`
        )
      );
      basicItems$4.push(
        new CheckboxItem(
          "video-page-hide-fixed-header",
          "顶栏 滚动页面后不再吸附顶部",
          false,
          void 0,
          false,
          `.fixed-header .bili-header__bar {position: relative !important;}`
        )
      );
    }
    bangumiGroupList.push(new Group("bangumi-basic", "版权视频播放页 基本功能", basicItems$4));
    {
      playerItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-top-left-title",
          "隐藏 播放器内标题",
          false,
          void 0,
          false,
          `.bpx-player-top-title {display: none !important;}
            /* 播放器上方阴影渐变 */
            .bpx-player-top-mask {display: none !important;}`
        )
      );
      playerItems$1.push(
        new CheckboxItem(
          "bangumi-page-hide-bpx-player-top-follow",
          "隐藏 追番/追剧按钮 ★",
          true,
          void 0,
          false,
          `.bpx-player-top-follow {display: none !important;}`
        )
      );
      playerItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-top-issue",
          "隐藏 反馈按钮",
          true,
          void 0,
          false,
          `.bpx-player-top-issue {display: none !important;}`
        )
      );
      playerItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-state-wrap",
          "隐藏 视频暂停时大Logo",
          false,
          void 0,
          false,
          `.bpx-player-state-wrap {display: none !important;}`
        )
      );
      playerItems$1.push(
        new CheckboxItem(
          "bangumi-page-hide-bpx-player-record-item-wrap",
          "隐藏 视频内封审核号(非内嵌) ★",
          true,
          void 0,
          false,
          `.bpx-player-record-item-wrap {display: none !important;}`
        )
      );
      playerItems$1.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-dialog-wrap",
          "隐藏 弹幕悬停 点赞/复制/举报",
          false,
          void 0,
          false,
          `.bpx-player-dialog-wrap {display: none !important;}`
        )
      );
      playerItems$1.push(
        new CheckboxItem(
          "video-page-bpx-player-bili-high-icon",
          "隐藏 高赞弹幕前点赞按钮",
          false,
          void 0,
          false,
          `.bili-high-icon {display: none !important}`
        )
      );
      playerItems$1.push(
        new CheckboxItem(
          "video-page-bpx-player-bili-dm-vip-white",
          "彩色渐变弹幕 变成白色",
          false,
          void 0,
          false,
          `#bilibili-player .bili-dm>.bili-dm-vip {
                    background: unset !important;
                    background-size: unset !important;
                    /* 父元素未指定 var(--textShadow), 默认重墨描边凑合用 */
                    text-shadow: 1px 0 1px #000000,0 1px 1px #000000,0 -1px 1px #000000,-1px 0 1px #000000 !important;
                    text-stroke: none !important;
                    -webkit-text-stroke: none !important;
                    -moz-text-stroke: none !important;
                    -ms-text-stroke: none !important;
                }`
        )
      );
    }
    bangumiGroupList.push(new Group("bangumi-player", "播放器 (★为独有项)", playerItems$1));
    {
      playerControlItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-prev",
          "隐藏 上一个视频",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-prev {display: none !important;}`
        )
      );
      playerControlItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-play",
          "隐藏 播放/暂停",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-play {display: none !important;}`
        )
      );
      playerControlItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-next",
          "隐藏 下一个视频",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-next {display: none !important;}`
        )
      );
      playerControlItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-eplist",
          "隐藏 选集",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-eplist {display: none !important;}`
        )
      );
      playerControlItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-playbackrate",
          "隐藏 倍速",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-playbackrate {display: none !important;}`
        )
      );
      playerControlItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-subtitle",
          "隐藏 字幕",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-subtitle {display: none !important;}`
        )
      );
      playerControlItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-volume",
          "隐藏 音量",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-volume {display: none !important;}`
        )
      );
      playerControlItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-setting",
          "隐藏 视频设置",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-setting {display: none !important;}`
        )
      );
      playerControlItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-pip",
          "隐藏 画中画(Chrome)",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-pip {display: none !important;}`
        )
      );
      playerControlItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-wide",
          "隐藏 宽屏",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-wide {display: none !important;}`
        )
      );
      playerControlItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-web",
          "隐藏 网页全屏",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-web {display: none !important;}`
        )
      );
      playerControlItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-ctrl-full",
          "隐藏 全屏",
          false,
          void 0,
          false,
          `.bpx-player-ctrl-full {display: none !important;}`
        )
      );
      playerControlItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-shadow-progress-area",
          "隐藏 底边mini视频进度",
          true,
          void 0,
          false,
          `.bpx-player-shadow-progress-area {display: none !important;}`
        )
      );
    }
    bangumiGroupList.push(new Group("bangumi-player-control", "播放控制", playerControlItems));
    {
      danmakuItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-video-info-online",
          "隐藏 同时在看人数",
          false,
          void 0,
          false,
          `.bpx-player-video-info-online, .bpx-player-video-info-divide {display: none !important;}`
        )
      );
      danmakuItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-video-info-dm",
          "隐藏 载入弹幕数量",
          false,
          void 0,
          false,
          `.bpx-player-video-info-dm, .bpx-player-video-info-divide {display: none !important;}`
        )
      );
      danmakuItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-dm-switch",
          "隐藏 弹幕启用",
          false,
          void 0,
          false,
          `.bpx-player-dm-switch {display: none !important;}`
        )
      );
      danmakuItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-dm-setting",
          "隐藏 弹幕显示设置",
          false,
          void 0,
          false,
          `.bpx-player-dm-setting {display: none !important;}`
        )
      );
      danmakuItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-video-btn-dm",
          "隐藏 弹幕样式",
          false,
          void 0,
          false,
          `.bpx-player-video-btn-dm {display: none !important;}`
        )
      );
      danmakuItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-dm-input",
          "隐藏 占位文字",
          true,
          void 0,
          false,
          `.bpx-player-dm-input::placeholder {color: transparent !important;}`
        )
      );
      danmakuItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-dm-hint",
          "隐藏 弹幕礼仪",
          true,
          void 0,
          false,
          `.bpx-player-dm-hint {display: none !important;}`
        )
      );
      danmakuItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-dm-btn-send",
          "隐藏 发送按钮",
          false,
          void 0,
          false,
          `.bpx-player-dm-btn-send {display: none !important;}`
        )
      );
      danmakuItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-sending-area",
          "非全屏下 关闭弹幕栏",
          false,
          void 0,
          false,
          `.bpx-player-sending-area {display: none !important;}
                /* 关闭弹幕栏后 播放器去黑边 */
                #bilibili-player-wrap[class^='video_playerNormal'] {height: calc(var(--video-width)*.5625)}
                #bilibili-player-wrap[class^='video_playerWide'] {height: calc(var(--containerWidth)*.5625)}
                `
        )
      );
      danmakuItems.push(
        new CheckboxItem(
          "video-page-hide-bpx-player-video-inputbar",
          "全屏下 关闭弹幕输入框",
          false,
          void 0,
          false,
          `.bpx-player-container[data-screen=full] .bpx-player-control-bottom-center .bpx-player-video-inputbar,
                .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center .bpx-player-video-inputbar {
                    display: none !important;
                }
                .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center,
                .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center {
                    padding: 0 15px !important;
                }
                /* 弹幕开关按钮贴紧左侧, 有章节列表时增大列表宽度 */
                .bpx-player-container[data-screen=full] .bpx-player-control-bottom-left,
                .bpx-player-container[data-screen=web] .bpx-player-control-bottom-left {
                    min-width: unset !important;
                }
                .bpx-player-container[data-screen=full] .bpx-player-ctrl-viewpoint,
                .bpx-player-container[data-screen=web] .bpx-player-ctrl-viewpoint {
                    width: fit-content !important;
                }`
        )
      );
    }
    bangumiGroupList.push(new Group("bangumi-danmaku", "弹幕栏", danmakuItems));
    {
      toolbarItems.push(
        new CheckboxItem(
          "video-page-hide-video-share-popover",
          "隐藏 分享按钮弹出菜单",
          true,
          void 0,
          false,
          `#share-container-id [class^='Share_share'] {display: none !important;}`
        )
      );
      toolbarItems.push(
        new CheckboxItem(
          "bangumi-page-hide-watch-on-phone",
          "隐藏 用手机观看 ★",
          true,
          void 0,
          false,
          `.toolbar span:has(>[class^='Phone_mobile']) {display: none !important;}`
        )
      );
      toolbarItems.push(
        new CheckboxItem(
          "bangumi-page-hide-watch-together",
          "隐藏 一起看 ★",
          true,
          void 0,
          false,
          `.toolbar span:has(>#watch_together_tab) {display: none !important;}`
        )
      );
      toolbarItems.push(
        new CheckboxItem(
          "bangumi-page-hide-toolbar",
          "隐藏 整个工具栏(赞币转) ★",
          false,
          void 0,
          false,
          `.player-left-components .toolbar {display: none !important;}`
        )
      );
      toolbarItems.push(
        new CheckboxItem(
          "bangumi-page-hide-media-info",
          "隐藏 作品介绍 ★",
          false,
          void 0,
          false,
          `[class^='mediainfo_mediaInfo'] {display: none !important;}`
        )
      );
      toolbarItems.push(
        new CheckboxItem(
          "bangumi-page-simple-media-info",
          "精简 作品介绍 ★",
          true,
          void 0,
          false,
          `[class^='mediainfo_btnHome'], [class^='upinfo_upInfoCard'] {display: none !important;}
                [class^='mediainfo_score'] {font-size: 25px !important;}
                [class^='mediainfo_mediaDesc']:has( + [class^='mediainfo_media_desc_section']) {
                    visibility: hidden !important;
                    height: 0 !important;
                    margin-bottom: 8px !important;
                }
                [class^='mediainfo_media_desc_section'] {height: 60px !important;}`
        )
      );
      toolbarItems.push(
        new CheckboxItem(
          "bangumi-page-hide-sponsor-module",
          "隐藏 承包榜 ★",
          false,
          void 0,
          false,
          `#sponsor_module {display: none !important;}`
        )
      );
    }
    bangumiGroupList.push(new Group("bangumi-toolbar", "视频下方 工具栏/作品信息", toolbarItems));
    {
      rightItems$1.push(
        new CheckboxItem(
          "bangumi-page-hide-right-container-section-height",
          "隐藏 大会员按钮 ★",
          true,
          void 0,
          false,
          `[class^='vipPaybar_'] {display: none !important;}`
        )
      );
      rightItems$1.push(
        new CheckboxItem(
          "video-page-hide-right-container-danmaku",
          "隐藏 弹幕列表",
          true,
          void 0,
          false,
          `#danmukuBox {display: none !important;}`
        )
      );
      rightItems$1.push(
        new CheckboxItem(
          "bangumi-page-hide-eplist-badge",
          "隐藏 视频列表 会员/限免标记 ★",
          false,
          void 0,
          false,
          // 蓝色预告badge不可隐藏
          `[class^='eplist_ep_list_wrapper'] [class^='imageListItem_badge']:not([style*='#00C0FF']) {display: none !important;}
                [class^='eplist_ep_list_wrapper'] [class^='numberListItem_badge']:not([style*='#00C0FF']) {display: none !important;}`
        )
      );
      rightItems$1.push(
        new CheckboxItem(
          "bangumi-page-hide-recommend",
          "隐藏 相关作品推荐 ★",
          false,
          void 0,
          false,
          `.plp-r [class^='recommend_wrap'] {display: none !important;}`
        )
      );
    }
    bangumiGroupList.push(new Group("bangumi-right", "右栏 作品选集/作品推荐", rightItems$1));
    {
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-reply-notice",
          "隐藏 活动/notice",
          true,
          void 0,
          false,
          `#comment-module .reply-header .reply-notice {display: none !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-main-reply-box",
          "隐藏 整个评论框",
          false,
          void 0,
          false,
          `#comment-module .main-reply-box {height: 0 !important; visibility: hidden !important;}
                #comment-module .reply-list {margin-top: -20px !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-fixed-reply-box",
          "隐藏 页面底部 吸附评论框",
          true,
          void 0,
          false,
          `#comment-module .fixed-reply-box {display: none !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-reply-box-textarea-placeholder",
          "隐藏 评论编辑器内占位文字",
          true,
          void 0,
          false,
          `#comment-module .main-reply-box .reply-box-textarea::placeholder {color: transparent !important;}
                #comment-module .fixed-reply-box .reply-box-textarea::placeholder {color: transparent !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-reply-decorate",
          "隐藏 评论内容右侧装饰",
          false,
          void 0,
          false,
          `#comment-module .reply-decorate {display: none !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-fan-badge",
          "隐藏 ID后粉丝牌",
          false,
          void 0,
          false,
          `#comment-module .fan-badge {display: none !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-user-level",
          "隐藏 一级评论用户等级",
          false,
          void 0,
          false,
          `#comment-module .user-level {display: none !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-sub-user-level",
          "隐藏 二级评论用户等级",
          false,
          void 0,
          false,
          `#comment-module .sub-user-level {display: none !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-bili-avatar-pendent-dom",
          "隐藏 用户头像外圈饰品",
          false,
          void 0,
          false,
          `#comment-module .root-reply-avatar .bili-avatar-pendent-dom {display: none !important;}
            #comment-module .root-reply-avatar .bili-avatar {width: 48px !important; height:48px !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-bili-avatar-nft-icon",
          "隐藏 用户头像右下小icon",
          false,
          void 0,
          false,
          `#comment-module .bili-avatar-nft-icon {display: none !important;}
                #comment-module .bili-avatar-icon {display: none !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-reply-tag-list",
          "隐藏 评论内容下tag(热评)",
          false,
          void 0,
          false,
          `#comment-module .reply-tag-list {display: none !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-note-prefix",
          "隐藏 笔记评论前的小Logo",
          true,
          void 0,
          false,
          `#comment-module .note-prefix {display: none !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-jump-link-search-word",
          "隐藏 评论内容搜索关键词高亮",
          true,
          void 0,
          false,
          `#comment-module .reply-content .jump-link.search-word {color: inherit !important;}
                #comment-module .reply-content .jump-link.search-word:hover {color: #008AC5 !important;}
                #comment-module .reply-content .icon.search-word {display: none !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-reply-content-user-highlight",
          "隐藏 二级评论中的@高亮",
          false,
          void 0,
          false,
          `#comment-module .sub-reply-container .reply-content .jump-link.user {color: inherit !important;}
                #comment-module .sub-reply-container .reply-content .jump-link.user:hover {color: #40C5F1 !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-at-reply-at-bots",
          "隐藏 召唤AI机器人的评论",
          true,
          void 0,
          false,
          // 8455326 @机器工具人
          // 234978716 @有趣的程序员
          // 1141159409 @AI视频小助理
          // 437175450 @AI视频小助理总结一下 (误伤)
          // 1692825065 @AI笔记侠
          // 690155730 @AI视频助手
          // 689670224 @哔哩哔理点赞姬
          // 3494380876859618 @课代表猫
          // 1168527940 @AI课代表呀
          // 439438614 @木几萌Moe
          // 1358327273 @星崽丨StarZai
          // 3546376048741135 @AI沈阳美食家
          // 1835753760 @AI识片酱
          `.reply-item:has(.jump-link.user[data-user-id="8455326"]),
                .reply-item:has(.jump-link.user[data-user-id="234978716"]),
                .reply-item:has(.jump-link.user[data-user-id="1141159409"]),
                .reply-item:has(.jump-link.user[data-user-id="437175450"]),
                .reply-item:has(.jump-link.user[data-user-id="1692825065"]),
                .reply-item:has(.jump-link.user[data-user-id="690155730"]),
                .reply-item:has(.jump-link.user[data-user-id="689670224"]),
                .reply-item:has(.jump-link.user[data-user-id="3494380876859618"]),
                .reply-item:has(.jump-link.user[data-user-id="1168527940"]),
                .reply-item:has(.jump-link.user[data-user-id="439438614"]),
                .reply-item:has(.jump-link.user[data-user-id="1358327273"]),
                .reply-item:has(.jump-link.user[data-user-id="3546376048741135"]),
                .reply-item:has(.jump-link.user[data-user-id="1835753760"]) {
                    display: none !important;
                }`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-zero-like-at-reply",
          "隐藏 包含@的 无人点赞评论",
          false,
          void 0,
          false,
          `#comment-module .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-at-reply-all",
          "隐藏 包含@的 全部评论",
          false,
          void 0,
          false,
          `#comment-module .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon)) {display: none !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-zero-like-lv1-reply",
          "隐藏 LV1 无人点赞评论",
          false,
          void 0,
          false,
          `#comment-module .reply-item:has(.st1.lv1):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-zero-like-lv2-reply",
          "隐藏 LV2 无人点赞评论",
          false,
          void 0,
          false,
          `#comment-module .reply-item:has(.st1.lv2):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-zero-like-lv3-reply",
          "隐藏 LV3 无人点赞评论",
          false,
          void 0,
          false,
          `#comment-module .reply-item:has(.st1.lv3):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-root-reply-dislike-reply-btn",
          "一级评论 踩/回复 只在hover时显示",
          true,
          void 0,
          false,
          `#comment-module .reply-info:not(:has(i.disliked)) .reply-btn,
                #comment-module .reply-info:not(:has(i.disliked)) .reply-dislike {
                    visibility: hidden;
                }
                #comment-module .reply-item:hover .reply-info .reply-btn,
                #comment-module .reply-item:hover .reply-info .reply-dislike {
                    visibility: visible !important;
                }`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-sub-reply-dislike-reply-btn",
          "二级评论 踩/回复 只在hover时显示",
          true,
          void 0,
          false,
          `#comment-module .sub-reply-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-btn,
                #comment-module .sub-reply-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-dislike {
                    visibility: hidden;
                }
                #comment-module .sub-reply-container .sub-reply-item:hover .sub-reply-btn,
                #comment-module .sub-reply-container .sub-reply-item:hover .sub-reply-dislike {
                    visibility: visible !important;
                }`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-emoji-large",
          "隐藏 大表情",
          false,
          void 0,
          false,
          `#comment-module .emoji-large {display: none !important;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-hide-emoji-large-zoom",
          "大表情变成小表情",
          false,
          void 0,
          false,
          `#comment-module .emoji-large {zoom: .5;}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-reply-user-name-color-pink",
          "用户名 全部大会员色",
          false,
          void 0,
          false,
          `#comment-module .reply-item .user-name, #comment-module .reply-item .sub-user-name {color: #FB7299 !important;}}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-reply-user-name-color-default",
          "用户名 全部恢复默认色",
          false,
          void 0,
          false,
          `#comment-module .reply-item .user-name, #comment-module .reply-item .sub-user-name {color: #61666d !important;}}`
        )
      );
      commentItems$1.push(
        new CheckboxItem(
          "video-page-reply-view-image-optimize",
          "笔记图片 查看大图优化",
          true,
          void 0,
          false,
          // 单图模式隐藏底部图片列表, 多图模式淡化列表, hover复原, 左右按钮增大
          `.reply-view-image .last-image, .reply-view-image .next-image {zoom: 1.4;}
                .reply-view-image:has(.preview-item-box:only-child) .last-image {display: none !important;}
                .reply-view-image:has(.preview-item-box:only-child) .next-image {display: none !important;}
                .reply-view-image .preview-list:has(.preview-item-box:only-child) {display: none !important;}
                .reply-view-image .preview-list {opacity: 0.2; transition: opacity 0.1s ease-in-out;}
                .reply-view-image .preview-list:hover {opacity: 1; transition: opacity 0.1s ease-in-out;}`
        )
      );
    }
    bangumiGroupList.push(new Group("bangumi-comment", "评论区", commentItems$1));
    {
      sidebarItems$2.push(
        new CheckboxItem(
          "bangumi-page-hide-sidenav-issue",
          "隐藏 新版反馈 ★",
          true,
          void 0,
          false,
          `[class*='navTools_navMenu'] [title='新版反馈'] {display: none !important;}`
        )
      );
      sidebarItems$2.push(
        new CheckboxItem(
          "video-page-hide-sidenav-mini",
          "隐藏 小窗播放器",
          false,
          void 0,
          false,
          `[class*='navTools_navMenu'] [title*='迷你播放器'] {display: none !important;}`
        )
      );
      sidebarItems$2.push(
        new CheckboxItem(
          "video-page-hide-sidenav-customer-service",
          "隐藏 客服",
          true,
          void 0,
          false,
          `[class*='navTools_navMenu'] [title='帮助反馈'] {display: none !important;}`
        )
      );
      sidebarItems$2.push(
        new CheckboxItem(
          "video-page-hide-sidenav-back-to-top",
          "隐藏 回顶部",
          false,
          void 0,
          false,
          `[class*='navTools_navMenu'] [title='返回顶部'] {display: none !important;}`
        )
      );
    }
    bangumiGroupList.push(new Group("bangumi-sidebar", "页面右下角 小按钮", sidebarItems$2));
  }
  const basicItems$3 = [];
  const sidebarItems$1 = [];
  const searchGroupList = [];
  if (location.host === "search.bilibili.com") {
    {
      basicItems$3.push(
        new CheckboxItem(
          "hide-search-page-search-sticky-header",
          "顶栏 滚动页面后不再吸附顶部",
          false,
          void 0,
          false,
          `.search-sticky-header {display: none !important;}`
        )
      );
      basicItems$3.push(
        new CheckboxItem(
          "hide-search-page-ad",
          "隐藏 搜索结果中的广告",
          true,
          void 0,
          false,
          `.video-list.row>div:has([href*="cm.bilibili.com"]) {display: none !important;}`
        )
      );
      basicItems$3.push(
        new CheckboxItem(
          "hide-search-page-danmaku-count",
          "隐藏 弹幕数量",
          true,
          void 0,
          false,
          `.bili-video-card .bili-video-card__stats--left .bili-video-card__stats--item:nth-child(2) {display: none !important;}`
        )
      );
      basicItems$3.push(
        new CheckboxItem(
          "hide-search-page-date",
          "隐藏 视频日期",
          false,
          void 0,
          false,
          `.bili-video-card .bili-video-card__info--date {display: none !important;}`
        )
      );
      basicItems$3.push(
        new CheckboxItem(
          "hide-search-page-bili-watch-later",
          "隐藏 稍后再看按钮",
          false,
          void 0,
          false,
          `.bili-video-card .bili-watch-later {display: none !important;}`
        )
      );
    }
    searchGroupList.push(new Group("search-basic", "搜索页 基本功能", basicItems$3));
    {
      sidebarItems$1.push(
        new CheckboxItem(
          "hide-search-page-customer-service",
          "隐藏 客服",
          true,
          void 0,
          false,
          `.side-buttons div:has(>a[href*="customer-service"]) {display: none !important;}`
        )
      );
      sidebarItems$1.push(
        new CheckboxItem(
          "hide-search-page-btn-to-top",
          "隐藏 回顶部",
          false,
          void 0,
          false,
          `.side-buttons .btn-to-top-wrap {display: none !important;}`
        )
      );
    }
    searchGroupList.push(new Group("search-sidebar", "页面右下角 小按钮", sidebarItems$1));
  }
  const basicItems$2 = [];
  const infoItems = [];
  const playerItems = [];
  const rightContainerItems = [];
  const belowItems = [];
  const headerLeftItems = [];
  const headerCenterItems = [];
  const headerRightItems = [];
  const liveGroupList = [];
  if (location.host === "live.bilibili.com") {
    {
      basicItems$2.push(
        new CheckboxItem(
          "live-page-sidebar-vm",
          "隐藏 页面右侧按钮 实验室/关注",
          true,
          void 0,
          false,
          `#sidebar-vm {display: none !important;}`
        )
      );
      basicItems$2.push(
        new CheckboxItem(
          "live-page-default-skin",
          "播放器皮肤 恢复默认配色",
          false,
          void 0,
          false,
          `#head-info-vm {
                    background-image: unset !important;
                    /* color不加important, 适配Evolved黑暗模式 */
                    background-color: white;
                }
                .live-title .text {
                    color: #61666D !important;
                }
                .header-info-ctnr .rows-ctnr .upper-row .room-owner-username {
                    color: #18191C !important;
                }
                /* 高权限覆盖 */
                #head-info-vm .live-skin-coloration-area .live-skin-normal-a-text {
                    color: unset !important;
                }
                #head-info-vm .live-skin-coloration-area .live-skin-main-text {
                    color: #61666D !important;
                    fill: #61666D !important;
                }
                /* 右侧弹幕框背景 */
                #chat-control-panel-vm .live-skin-coloration-area .live-skin-main-text {
                    color: #C9CCD0 !important;
                    fill: #C9CCD0 !important;
                }
                #chat-control-panel-vm {
                    background-image: unset !important;
                    background-color: #f6f7f8;
                }
                #chat-control-panel-vm .bl-button--primary {
                    background-color: #23ade5;
                }
                `
        )
      );
    }
    liveGroupList.push(new Group("live-basic", "直播页 基本功能", basicItems$2));
    {
      infoItems.push(
        new CheckboxItem(
          "live-page-head-info-vm-upper-row-follow-ctnr",
          "隐藏 粉丝团",
          false,
          void 0,
          false,
          `#head-info-vm .upper-row .follow-ctnr {display: none !important;}`
        )
      );
      infoItems.push(
        new CheckboxItem(
          "live-page-head-info-vm-upper-row-visited",
          "隐藏 xx人看过",
          false,
          void 0,
          false,
          `#head-info-vm .upper-row .right-ctnr div:has(.watched-icon) {display: none !important;}`
        )
      );
      infoItems.push(
        new CheckboxItem(
          "live-page-head-info-vm-upper-row-popular",
          "隐藏 人气",
          false,
          void 0,
          false,
          `#head-info-vm .upper-row .right-ctnr div:has(.icon-popular) {display: none !important;}`
        )
      );
      infoItems.push(
        new CheckboxItem(
          "live-page-head-info-vm-upper-row-like",
          "隐藏 点赞",
          false,
          void 0,
          false,
          `#head-info-vm .upper-row .right-ctnr div:has(.like-icon) {display: none !important;}`
        )
      );
      infoItems.push(
        new CheckboxItem(
          "live-page-head-info-vm-upper-row-report",
          "隐藏 举报",
          true,
          void 0,
          false,
          `#head-info-vm .upper-row .right-ctnr div:has(.icon-report) {display: none !important;}`
        )
      );
      infoItems.push(
        new CheckboxItem(
          "live-page-head-info-vm-upper-row-share",
          "隐藏 分享",
          true,
          void 0,
          false,
          `#head-info-vm .upper-row .right-ctnr div:has(.icon-share) {display: none !important;}`
        )
      );
      infoItems.push(
        new CheckboxItem(
          "live-page-head-info-vm-lower-row-hot-rank",
          "隐藏 人气榜",
          true,
          void 0,
          false,
          `#head-info-vm .lower-row .right-ctnr .popular-and-hot-rank {display: none !important;}`
        )
      );
      infoItems.push(
        new CheckboxItem(
          "live-page-head-info-vm-lower-row-gift-planet-entry",
          "隐藏 礼物",
          false,
          void 0,
          false,
          `#head-info-vm .lower-row .right-ctnr .gift-planet-entry {display: none !important;}`
        )
      );
      infoItems.push(
        new CheckboxItem(
          "live-page-head-info-vm-lower-row-activity-gather-entry",
          "隐藏 活动",
          true,
          void 0,
          false,
          `#head-info-vm .lower-row .right-ctnr .activity-gather-entry {display: none !important;}`
        )
      );
      infoItems.push(
        new CheckboxItem(
          "live-page-head-info-vm",
          "隐藏 关闭整个信息栏",
          false,
          void 0,
          false,
          `#head-info-vm {display: none !important;}
                /* 补齐圆角, 不可important */
                #player-ctnr {
                    border-top-left-radius: 12px;
                    border-top-right-radius: 12px;
                    overflow: hidden;
                }`
        )
      );
    }
    liveGroupList.push(new Group("live-info", "直播信息栏", infoItems));
    {
      playerItems.push(
        new CheckboxItem(
          "live-page-head-web-player-icon-feedback",
          "隐藏 右上角反馈",
          true,
          void 0,
          false,
          `#live-player .web-player-icon-feedback {display: none !important;}`
        )
      );
      playerItems.push(
        new CheckboxItem(
          "live-page-head-web-player-shop-popover-vm",
          "隐藏 购物小橙车提示",
          true,
          void 0,
          false,
          `#shop-popover-vm {display: none !important;}`
        )
      );
      playerItems.push(
        new CheckboxItem(
          "live-page-head-web-player-awesome-pk-vm",
          "隐藏 直播PK特效",
          false,
          void 0,
          false,
          `#pk-vm, #awesome-pk-vm {display: none !important;}`
        )
      );
      playerItems.push(
        new CheckboxItem(
          "live-page-head-web-player-announcement-wrapper",
          "隐藏 滚动礼物通告",
          false,
          void 0,
          false,
          `#live-player .announcement-wrapper {display: none !important;}`
        )
      );
      playerItems.push(
        new CheckboxItem(
          "live-page-head-web-player-game-id",
          "隐藏 幻星互动游戏",
          true,
          void 0,
          false,
          `#game-id {display: none !important;}`
        )
      );
      playerItems.push(
        new CheckboxItem(
          "live-page-combo-danmaku",
          "隐藏 复读计数弹幕",
          false,
          void 0,
          false,
          `.danmaku-item-container > div.combo {display: none !important;}`
        )
      );
      playerItems.push(
        new CheckboxItem(
          "live-page-gift-control-vm",
          "隐藏 礼物栏",
          false,
          void 0,
          false,
          `#gift-control-vm, #gift-control-vm-new {display: none !important;}
                /* 补齐圆角, 不可important */
                #player-ctnr {
                    border-bottom-left-radius: 12px;
                    border-bottom-right-radius: 12px;
                    overflow: hidden;
                }`
        )
      );
    }
    liveGroupList.push(new Group("live-player", "播放器", playerItems));
    {
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-rank-list-vm",
          "隐藏 高能榜/大航海 (需刷新)",
          false,
          void 0,
          false,
          `#rank-list-vm {display: none !important;}
                #aside-area-vm {overflow: hidden;}
                .chat-history-panel {height: calc(100% - 145px) !important; padding-top: 8px;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-convention-msg",
          "隐藏 系统提示",
          true,
          void 0,
          false,
          `.convention-msg.border-box {display: none !important;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-rank-icon",
          "隐藏 用户排名",
          false,
          void 0,
          false,
          `.chat-item .rank-icon {display: none !important;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-title-label",
          "隐藏 头衔装扮",
          false,
          void 0,
          false,
          `.chat-item .title-label {display: none !important;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-wealth-medal-ctnr",
          "隐藏 用户等级",
          true,
          void 0,
          false,
          `.chat-item .wealth-medal-ctnr {display: none !important;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-group-medal-ctnr",
          "隐藏 团体勋章",
          false,
          void 0,
          false,
          `.chat-item .group-medal-ctnr {display: none !important;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-fans-medal-item-ctnr",
          "隐藏 粉丝牌",
          false,
          void 0,
          false,
          `.chat-item .fans-medal-item-ctnr {display: none !important;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-chat-item-background-color",
          "隐藏 弹幕的高亮底色",
          false,
          void 0,
          false,
          `.chat-item {background-color: unset !important; border-image-source: unset !important;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-gift-item",
          "隐藏 礼物弹幕",
          false,
          void 0,
          false,
          `.chat-item.gift-item, .chat-item.common-danmuku-msg {display: none !important;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-chat-item-top3-notice",
          "隐藏 高能用户提示",
          false,
          void 0,
          false,
          `.chat-item.top3-notice {display: none !important;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-brush-prompt",
          "隐藏 底部滚动提示",
          true,
          void 0,
          false,
          `#brush-prompt {display: none !important;}
                /* 弹幕栏高度 */
                .chat-history-panel .chat-history-list.with-brush-prompt {height: 100% !important;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-combo-card",
          "隐藏 互动框(他们都在说)",
          false,
          void 0,
          false,
          `#combo-card:has(.combo-tips) {display: none !important;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-service-card-container",
          "隐藏 互动框(找TA玩)",
          false,
          void 0,
          false,
          `.play-together-service-card-container {display: none !important;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-compact-danmaku",
          "弹幕栏 使弹幕列表紧凑",
          true,
          void 0,
          false,
          `.chat-history-panel .chat-history-list .chat-item.danmaku-item.chat-colorful-bubble {margin: 2px 0 !important;}
                .chat-history-panel .chat-history-list .chat-item {padding: 3px 5px !important; font-size: 1.2rem !important;}
                .chat-history-panel .chat-history-list .chat-item.danmaku-item .user-name {font-size: 1.2rem !important;}
                .chat-history-panel .chat-history-list .chat-item.danmaku-item .reply-uname {font-size: 1.2rem !important;}
                .chat-history-panel .chat-history-list .chat-item.danmaku-item .reply-uname .common-nickname-wrapper {font-size: 1.2rem !important;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-control-panel-icon-row-left",
          "隐藏 弹幕控制按钮 左侧",
          false,
          void 0,
          false,
          `#chat-control-panel-vm .control-panel-icon-row .icon-left-part {display: none !important;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-control-panel-icon-row-right",
          "隐藏 弹幕控制按钮 右侧",
          false,
          void 0,
          false,
          `#chat-control-panel-vm .control-panel-icon-row .icon-right-part {display: none !important;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-chat-input-ctnr",
          "隐藏 弹幕发送框",
          false,
          void 0,
          false,
          `#chat-control-panel-vm .chat-input-ctnr, #chat-control-panel-vm .bottom-actions {display: none !important;}
                .chat-control-panel {height: unset !important;}
                .chat-history-panel {height: calc(100% - 45px) !important; padding-top: 8px;}
                .chat-history-panel .danmaku-at-prompt {bottom: 50px !important;}`
        )
      );
      rightContainerItems.push(
        new CheckboxItem(
          "live-page-chat-control-panel",
          "隐藏 关闭全部互动框和控制栏",
          false,
          void 0,
          false,
          `#chat-control-panel-vm {display: none !important;}
                .chat-history-panel {
                    border-radius: 0 0 12px 12px;
                }
                /* 高权限调高度 */
                #aside-area-vm .chat-history-panel {
                    height: calc(100% - 15px) !important;
                }`
        )
      );
    }
    liveGroupList.push(new Group("live-right-container", "右栏 高能榜/弹幕列表", rightContainerItems));
    {
      belowItems.push(
        new CheckboxItem(
          "live-page-flip-view",
          "隐藏 活动海报",
          true,
          void 0,
          false,
          `.flip-view {display: none !important;}`
        )
      );
      belowItems.push(
        new CheckboxItem(
          "live-page-room-info-ctnr",
          "隐藏 直播间介绍",
          false,
          void 0,
          false,
          `#sections-vm .room-info-ctnr {display: none !important;}`
        )
      );
      belowItems.push(
        new CheckboxItem(
          "live-page-room-feed",
          "隐藏 主播动态",
          false,
          void 0,
          false,
          `#sections-vm .room-feed {display: none !important;}`
        )
      );
      belowItems.push(
        new CheckboxItem(
          "live-page-announcement-cntr",
          "隐藏 主播公告",
          false,
          void 0,
          false,
          `#sections-vm .announcement-cntr {display: none !important;}`
        )
      );
      belowItems.push(
        new CheckboxItem(
          "live-page-sections-vm",
          "隐藏 直播下方全部内容",
          false,
          void 0,
          false,
          `#sections-vm {display: none !important;}`
        )
      );
    }
    liveGroupList.push(new Group("live-below", "下方页面 主播动态/直播公告", belowItems));
    {
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-entry-logo",
          "隐藏 直播LOGO",
          false,
          void 0,
          false,
          `#main-ctnr a.entry_logo[href="//live.bilibili.com"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-entry-title",
          "隐藏 首页",
          false,
          void 0,
          false,
          `#main-ctnr a.entry-title[href="//www.bilibili.com"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-live",
          "隐藏 直播",
          false,
          void 0,
          false,
          `#main-ctnr .dp-table-cell a[name="live"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-all",
          "隐藏 全部",
          false,
          void 0,
          false,
          `#main-ctnr .dp-table-cell a[name="all"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-net-game",
          "隐藏 网游",
          false,
          void 0,
          false,
          `#main-ctnr .dp-table-cell a[name="网游"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-mobile-game",
          "隐藏 手游",
          false,
          void 0,
          false,
          `#main-ctnr .dp-table-cell a[name="手游"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-standalone-game",
          "隐藏 单机游戏",
          false,
          void 0,
          false,
          `#main-ctnr .dp-table-cell a[name="单机游戏"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-standalone-entertainment",
          "隐藏 娱乐",
          false,
          void 0,
          false,
          `#main-ctnr .dp-table-cell a[name="娱乐"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-standalone-radio",
          "隐藏 电台",
          false,
          void 0,
          false,
          `#main-ctnr .dp-table-cell a[name="电台"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-standalone-vtuber",
          "隐藏 虚拟主播",
          false,
          void 0,
          false,
          `#main-ctnr .dp-table-cell a[name="虚拟主播"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-standalone-chatroom",
          "隐藏 聊天室",
          false,
          void 0,
          false,
          `#main-ctnr .dp-table-cell a[name="聊天室"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-standalone-living",
          "隐藏 生活",
          false,
          void 0,
          false,
          `#main-ctnr .dp-table-cell a[name="生活"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-standalone-knowledge",
          "隐藏 知识",
          false,
          void 0,
          false,
          `#main-ctnr .dp-table-cell a[name="知识"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-standalone-match",
          "隐藏 赛事",
          false,
          void 0,
          false,
          `#main-ctnr .dp-table-cell a[name="赛事"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-standalone-helpmeplay",
          "隐藏 帮我玩",
          false,
          void 0,
          false,
          `#main-ctnr .dp-table-cell a[name="帮我玩"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-standalone-interact",
          "隐藏 互动玩法",
          false,
          void 0,
          false,
          `#main-ctnr .dp-table-cell a[name="互动玩法"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-standalone-shopping",
          "隐藏 购物",
          false,
          void 0,
          false,
          `#main-ctnr .dp-table-cell a[name="购物"] {display: none !important;}`
        )
      );
      headerLeftItems.push(
        new CheckboxItem(
          "live-page-header-showmore-link",
          "隐藏 顶栏-更多",
          true,
          void 0,
          false,
          `#main-ctnr .showmore-link {display: none !important;}`
        )
      );
    }
    liveGroupList.push(new Group("live-header-left", "顶栏 左侧", headerLeftItems));
    {
      headerCenterItems.push(
        new CheckboxItem(
          "common-hide-nav-search-rcmd",
          "隐藏 搜索框 推荐搜索",
          false,
          void 0,
          false,
          `#nav-searchform input::placeholder {visibility: hidden;}`
        )
      );
      headerCenterItems.push(
        new CheckboxItem(
          "common-hide-nav-search-history",
          "隐藏 搜索框 搜索历史",
          false,
          void 0,
          false,
          `#nav-searchform .history {display: none !important;}`
        )
      );
      headerCenterItems.push(
        new CheckboxItem(
          "common-hide-nav-search-trending",
          "隐藏 搜索框 bilibili热搜",
          false,
          void 0,
          false,
          `#nav-searchform .trending {display: none !important;}`
        )
      );
      headerCenterItems.push(
        new CheckboxItem(
          "live-page-header-search-block",
          "隐藏 关闭搜索框",
          false,
          void 0,
          false,
          `#nav-searchform {display: none !important;}`
        )
      );
    }
    liveGroupList.push(new Group("live-header-center", "顶栏 搜索框", headerCenterItems));
    {
      headerRightItems.push(
        new CheckboxItem(
          "live-page-header-avatar",
          "隐藏 头像",
          false,
          void 0,
          false,
          `#right-part .user-panel {display: none !important;}`
        )
      );
      headerRightItems.push(
        new CheckboxItem(
          "live-page-header-dynamic",
          "隐藏 动态",
          false,
          void 0,
          false,
          `#right-part .shortcuts-ctnr .shortcut-item:has(.link-panel-ctnr) {display: none !important;}`
        )
      );
      headerRightItems.push(
        new CheckboxItem(
          "live-page-header-checkin",
          "隐藏 签到",
          false,
          void 0,
          false,
          `#right-part .shortcuts-ctnr .shortcut-item:has(.calendar-checkin) {display: none !important;}`
        )
      );
      headerRightItems.push(
        new CheckboxItem(
          "live-page-header-interact",
          "隐藏 幻星互动",
          true,
          void 0,
          false,
          `#right-part .shortcuts-ctnr .shortcut-item:has(.fanbox-panel-ctnr) {display: none !important;}`
        )
      );
      headerRightItems.push(
        new CheckboxItem(
          "live-page-header-go-live",
          "隐藏 我要开播",
          true,
          void 0,
          false,
          `#right-part .shortcuts-ctnr .shortcut-item:has(.download-panel-ctnr) {visibility: hidden;}`
        )
      );
    }
    liveGroupList.push(new Group("live-header-right", "顶栏 右侧", headerRightItems));
  }
  const dynamicUnfold = () => {
    const unfold = () => {
      const dynFoldNodes = document.querySelectorAll("main .bili-dyn-list__item .bili-dyn-item-fold");
      if (dynFoldNodes.length) {
        dynFoldNodes.forEach((e) => {
          if (e instanceof HTMLDivElement) {
            e.click();
          }
        });
        debug(`unfold ${dynFoldNodes.length} fold`);
      }
    };
    setInterval(unfold, 500);
  };
  const basicItems$1 = [];
  const leftItems = [];
  const rightItems = [];
  const centerItems = [];
  const commentItems = [];
  const sidebarItems = [];
  const dynamicGroupList = [];
  if (location.host === "t.bilibili.com" || location.href.includes("bilibili.com/opus/")) {
    {
      basicItems$1.push(
        new CheckboxItem(
          "hide-dynamic-page-fixed-header",
          "顶栏 不再吸附顶部",
          false,
          void 0,
          false,
          `.fixed-header .bili-header__bar {position: relative !important;}
                /* 高权限覆盖*/
                aside.right section.sticky {top: 15px !important;}`
        )
      );
    }
    dynamicGroupList.push(new Group("dynamic-basic", "动态页 基本功能", basicItems$1));
    {
      leftItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-my-info",
          "隐藏 个人信息框",
          false,
          void 0,
          false,
          `section:has(> .bili-dyn-my-info) {display: none !important;}
                .bili-dyn-live-users {top: 15px !important;}`
        )
      );
      leftItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-live-users__item__living",
          "隐藏 直播中Logo",
          false,
          void 0,
          false,
          `.bili-dyn-live-users__item__living {display: none !important;}`
        )
      );
      leftItems.push(
        new CheckboxItem(
          "hide-dynamic-page-aside-left",
          "隐藏 整个左栏",
          false,
          void 0,
          false,
          `aside.left {display: none !important;}`
        )
      );
    }
    dynamicGroupList.push(new Group("dynamic-left", "左栏 个人信息/正在直播", leftItems));
    {
      rightItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-banner",
          "隐藏 社区中心",
          true,
          void 0,
          false,
          `.bili-dyn-banner {display: none !important;}`
        )
      );
      rightItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-ads",
          "隐藏 广告",
          true,
          void 0,
          false,
          `section:has(.bili-dyn-ads) {display: none !important;}
                aside.right section {margin-bottom: 0 !important;}
                /* header吸附时 */
                aside.right section.sticky {top: 72px}`
        )
      );
      rightItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-topic-box",
          "隐藏 话题列表",
          false,
          void 0,
          false,
          `.bili-dyn-topic-box, .topic-panel {display: none !important;}`
        )
      );
      rightItems.push(
        new CheckboxItem(
          "hide-dynamic-page-aside-right",
          "隐藏 整个右栏",
          false,
          void 0,
          false,
          `aside.right {display: none !important;}`
        )
      );
    }
    dynamicGroupList.push(new Group("dynamic-right", "右栏 热门话题", rightItems));
    {
      centerItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-publishing",
          "隐藏 动态发布框",
          false,
          void 0,
          false,
          `.bili-dyn-publishing {display: none !important;}
                main section:nth-child(1) {margin-bottom: 0 !important;}`
        )
      );
      centerItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-list-tabs",
          "隐藏 动态分类Tab bar",
          false,
          void 0,
          false,
          `.bili-dyn-list-tabs {display: none !important;}`
        )
      );
      centerItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-ornament",
          "隐藏 动态右侧饰品",
          false,
          void 0,
          false,
          `.bili-dyn-ornament {display: none !important;}`
        )
      );
      centerItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-dispute",
          "隐藏 动态内容中 警告notice",
          true,
          void 0,
          false,
          `.bili-dyn-content__dispute {display: none !important;}`
        )
      );
      centerItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-watchlater",
          "隐藏 动态内容中 稍后再看按钮",
          false,
          void 0,
          false,
          `.bili-dyn-card-video__mark {display: none !important;}`
        )
      );
      centerItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-official-topic",
          "隐藏 动态内容中 官方话题Tag",
          false,
          void 0,
          false,
          // 不得隐藏普通tag .bili-rich-text-topic
          // 会造成部分动态内容要点缺失影响阅读
          `.bili-dyn-content__orig__topic {display: none !important;}`
        )
      );
      centerItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-text-topic",
          "动态内容中 普通Tag 去除高亮",
          false,
          void 0,
          false,
          `.bili-rich-text-topic {color: inherit !important;}
                .bili-rich-text-topic:hover {color: var(--brand_blue) !important;}`
        )
      );
      centerItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-item-interaction",
          "隐藏 动态精选互动 XXX赞了/XXX回复",
          false,
          void 0,
          false,
          `.bili-dyn-item__interaction {display: none !important;}`
        )
      );
      centerItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-card-reserve",
          "隐藏 视频预约/直播预约动态",
          false,
          void 0,
          false,
          `.bili-dyn-list__item:has(.bili-dyn-card-reserve) {display: none !important;}`
        )
      );
      centerItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-card-goods",
          "隐藏 带货动态",
          false,
          void 0,
          false,
          `.bili-dyn-list__item:has(.bili-dyn-card-goods),
                .bili-dyn-list__item:has(.bili-rich-text-module.goods),
                .bili-dyn-list__item:has([data-type="goods"]) {
                    visibility: hidden !important;
                    height: 0 !important;
                    margin: 0 !important;
                }`
        )
      );
      centerItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-forward",
          "隐藏 转发的动态",
          false,
          void 0,
          false,
          `.bili-dyn-list__item:has(.bili-dyn-content__orig.reference) {
                    visibility: hidden !important;
                    height: 0 !important;
                    margin: 0 !important;
                }`
        )
      );
      centerItems.push(
        new CheckboxItem(
          "hide-dynamic-page-bili-dyn-vote",
          "隐藏 投票动态",
          false,
          void 0,
          false,
          `.bili-dyn-list__item:has(.bili-dyn-card-vote) {
                    display: none !important;
                }`
        )
      );
      centerItems.push(
        new CheckboxItem(
          "dynamic-page-unfold-dynamic",
          "自动展开 相同UP主被折叠的动态",
          false,
          dynamicUnfold,
          false,
          null
        )
      );
    }
    dynamicGroupList.push(new Group("dynamic-center", "中栏 动态列表", centerItems));
    {
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-reply-notice",
          "隐藏 活动/notice",
          true,
          void 0,
          false,
          `.comment-container .reply-header .reply-notice {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-main-reply-box",
          "隐藏 整个评论框",
          false,
          void 0,
          false,
          `.comment-container .main-reply-box, .comment-container .fixed-reply-box {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-fixed-reply-box",
          "隐藏 页面底部 吸附评论框",
          true,
          void 0,
          false,
          `.comment-container .fixed-reply-box {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-reply-box-textarea-placeholder",
          "隐藏 评论编辑器内占位文字",
          true,
          void 0,
          false,
          `.comment-container .reply-box-textarea::placeholder {color: transparent !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-reply-decorate",
          "隐藏 评论右侧装饰",
          false,
          void 0,
          false,
          `.comment-container .reply-decorate {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-fan-badge",
          "隐藏 ID后粉丝牌",
          false,
          void 0,
          false,
          `.comment-container .fan-badge {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-user-level",
          "隐藏 一级评论用户等级",
          false,
          void 0,
          false,
          `.comment-container .user-level {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-sub-user-level",
          "隐藏 二级评论用户等级",
          false,
          void 0,
          false,
          `.comment-container .sub-user-level {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-bili-avatar-pendent-dom",
          "隐藏 用户头像外圈饰品",
          false,
          void 0,
          false,
          `.comment-container .bili-avatar-pendent-dom {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-bili-avatar-nft-icon",
          "隐藏 用户头像右下小icon",
          false,
          void 0,
          false,
          `.comment-container .bili-avatar-nft-icon {display: none !important;}
                .comment-container .bili-avatar-icon {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-reply-tag-list",
          "隐藏 评论内容下tag(UP觉得很赞)",
          false,
          void 0,
          false,
          `.comment-container .reply-tag-list {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-note-prefix",
          "隐藏 笔记评论前的小Logo",
          true,
          void 0,
          false,
          `.comment-container .note-prefix {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-jump-link-search-word",
          "隐藏 评论内容搜索关键词高亮",
          true,
          void 0,
          false,
          `.comment-container .reply-content .jump-link.search-word {color: inherit !important;}
                .comment-container .reply-content .icon.search-word {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-reply-content-user-highlight",
          "隐藏 二级评论中的@高亮",
          false,
          void 0,
          false,
          `.comment-container .sub-reply-container .reply-content .jump-link.user {color: inherit !important;}
                .comment-container .sub-reply-container .reply-content .jump-link.user:hover {color: #40C5F1 !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-at-reply-at-bots",
          "隐藏 召唤AI机器人的评论",
          true,
          void 0,
          false,
          // 8455326 @机器工具人
          // 234978716 @有趣的程序员
          // 1141159409 @AI视频小助理
          // 437175450 @AI视频小助理总结一下 (误伤)
          // 1692825065 @AI笔记侠
          // 690155730 @AI视频助手
          // 689670224 @哔哩哔理点赞姬
          // 3494380876859618 @课代表猫
          // 1168527940 @AI课代表呀
          // 439438614 @木几萌Moe
          // 1358327273 @星崽丨StarZai
          // 3546376048741135 @AI沈阳美食家
          // 1835753760 @AI识片酱
          `.reply-item:has(.jump-link.user[data-user-id="8455326"]),
                .reply-item:has(.jump-link.user[data-user-id="234978716"]),
                .reply-item:has(.jump-link.user[data-user-id="1141159409"]),
                .reply-item:has(.jump-link.user[data-user-id="437175450"]),
                .reply-item:has(.jump-link.user[data-user-id="1692825065"]),
                .reply-item:has(.jump-link.user[data-user-id="690155730"]),
                .reply-item:has(.jump-link.user[data-user-id="689670224"]),
                .reply-item:has(.jump-link.user[data-user-id="3494380876859618"]),
                .reply-item:has(.jump-link.user[data-user-id="1168527940"]),
                .reply-item:has(.jump-link.user[data-user-id="439438614"]),
                .reply-item:has(.jump-link.user[data-user-id="1358327273"]),
                .reply-item:has(.jump-link.user[data-user-id="3546376048741135"]),
                .reply-item:has(.jump-link.user[data-user-id="1835753760"]) {
                    display: none !important;
                }`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-zero-like-at-reply",
          "隐藏 包含@的 无人点赞评论",
          false,
          void 0,
          false,
          `.comment-container .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-at-reply-all",
          "隐藏 包含@的 全部评论",
          false,
          void 0,
          false,
          `.comment-container .reply-item:has(.root-reply .jump-link.user):not(:has(.sub-up-icon)) {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-zero-like-lv1-reply",
          "隐藏 LV1 无人点赞评论",
          false,
          void 0,
          false,
          `.comment-container .reply-item:has(.st1.lv1):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-zero-like-lv2-reply",
          "隐藏 LV2 无人点赞评论",
          false,
          void 0,
          false,
          `.comment-container .reply-item:has(.st1.lv2):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-zero-like-lv3-reply",
          "隐藏 LV3 无人点赞评论",
          false,
          void 0,
          false,
          `.comment-container .reply-item:has(.st1.lv3):not(:has(.sub-up-icon, .reply-info .reply-like span)) {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-root-reply-dislike-reply-btn",
          "一级评论 踩/回复 只在hover时显示",
          true,
          void 0,
          false,
          `.comment-container .reply-info:not(:has(i.disliked)) .reply-btn,
                .comment-container .reply-info:not(:has(i.disliked)) .reply-dislike {
                    visibility: hidden;
                }
                .comment-container .reply-item:hover .reply-btn,
                .comment-container .reply-item:hover .reply-dislike {
                    visibility: visible !important;
                }`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-sub-reply-dislike-reply-btn",
          "二级评论 踩/回复 只在hover时显示",
          true,
          void 0,
          false,
          `.comment-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-btn,
                .comment-container .sub-reply-item:not(:has(i.disliked)) .sub-reply-dislike {
                    visibility: hidden;
                }
                .comment-container .sub-reply-item:hover .sub-reply-btn,
                .comment-container .sub-reply-item:hover .sub-reply-dislike {
                    visibility: visible !important;
                }`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-emoji-large",
          "隐藏 大表情",
          false,
          void 0,
          false,
          `.comment-container .emoji-large {display: none !important;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-hide-emoji-large-zoom",
          "大表情变成小表情",
          false,
          void 0,
          false,
          `.comment-container .emoji-large {zoom: .5;}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-reply-user-name-color-pink",
          "用户名 全部大会员色",
          false,
          void 0,
          false,
          `.comment-container .reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #FB7299 !important;}}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-reply-user-name-color-default",
          "用户名 全部恢复默认色",
          false,
          void 0,
          false,
          `.comment-container .reply-item .user-name, .comment-container .reply-item .sub-user-name {color: #61666d !important;}}`
        )
      );
      commentItems.push(
        new CheckboxItem(
          "video-page-reply-view-image-optimize",
          "笔记图片 查看大图优化",
          true,
          void 0,
          false,
          // 单图模式隐藏底部图片列表, 多图模式淡化列表, hover复原, 左右按钮增大
          `.reply-view-image .last-image, .reply-view-image .next-image {zoom: 1.4;}
                .reply-view-image:has(.preview-item-box:only-child) .last-image {display: none !important;}
                .reply-view-image:has(.preview-item-box:only-child) .next-image {display: none !important;}
                .reply-view-image .preview-list:has(.preview-item-box:only-child) {display: none !important;}
                .reply-view-image .preview-list {opacity: 0.2; transition: opacity 0.1s ease-in-out;}
                .reply-view-image .preview-list:hover {opacity: 1; transition: opacity 0.1s ease-in-out;}`
        )
      );
    }
    dynamicGroupList.push(new Group("dynamic-comment", "动态评论区", commentItems));
    {
      sidebarItems.push(
        new CheckboxItem(
          "hide-dynamic-page-sidebar-feedback",
          "隐藏 新版反馈",
          true,
          void 0,
          false,
          `.bili-dyn-sidebar .bili-dyn-sidebar__btn:nth-child(1) {visibility: hidden !important;}`
        )
      );
      sidebarItems.push(
        new CheckboxItem(
          "hide-dynamic-page-sidebar-old-version",
          "隐藏 回到旧版",
          true,
          void 0,
          false,
          `.bili-dyn-sidebar .bili-dyn-sidebar__btn:nth-child(2) {visibility: hidden !important;}`
        )
      );
      sidebarItems.push(
        new CheckboxItem(
          "hide-dynamic-page-sidebar-back-to-top",
          "隐藏 回顶部",
          false,
          void 0,
          false,
          `.bili-dyn-sidebar .bili-dyn-sidebar__btn:nth-child(3) {visibility: hidden !important;}`
        )
      );
    }
    dynamicGroupList.push(new Group("dynamic-sidebar", "页面右下角 小按钮", sidebarItems));
  }
  const basicItems = [];
  const layoutItems = [];
  const hotItems = [];
  const weeklyItems = [];
  const historyItems = [];
  const popularGroupList = [];
  if (location.href.includes("bilibili.com/v/popular/")) {
    {
      basicItems.push(
        new CheckboxItem(
          "homepage-hide-banner",
          "隐藏 横幅banner",
          false,
          void 0,
          false,
          `.header-banner__inner, .bili-header__banner {
                    display: none !important;
                }
                .bili-header .bili-header__bar:not(.slide-down) {
                    position: relative !important;
                    box-shadow: 0 2px 4px #00000014;
                }
                .bili-header__channel {
                    margin-top: 5px !important;
                }
                /* icon和文字颜色 */
                .bili-header .right-entry__outside .right-entry-icon {
                    color: #18191c !important;
                }
                .bili-header .left-entry .entry-title, .bili-header .left-entry .download-entry, .bili-header .left-entry .default-entry, .bili-header .left-entry .loc-entry {
                    color: #18191c !important;
                }
                .bili-header .left-entry .entry-title .zhuzhan-icon {
                    color: #00aeec !important;
                }
                .bili-header .right-entry__outside .right-entry-text {
                    color: #61666d !important;
                }
                /* header滚动后渐变出现, 否则闪动 */
                #i_cecream .bili-header__bar.slide-down {
                    transition: background-color 0.3s ease-out, box-shadow 0.3s ease-out !important;
                }
                #i_cecream .bili-header__bar:not(.slide-down) {
                    transition: background-color 0.3s ease-out !important;
                }
                /* header高度 */
                #biliMainHeader {min-height: unset !important;}
                `
        )
      );
      basicItems.push(
        new CheckboxItem(
          "homepage-hide-sticky-header",
          "隐藏 滚动页面时 顶部吸附顶栏",
          false,
          void 0,
          false,
          `.bili-header .left-entry__title svg {
                    display: none !important;
                }
                /* 高优先覆盖!important */
                #i_cecream .bili-feed4 .bili-header .slide-down {
                    box-shadow: unset !important;
                }
                #nav-searchform.is-actived:before,
                #nav-searchform.is-exper:before,
                #nav-searchform.is-exper:hover:before,
                #nav-searchform.is-focus:before,
                .bili-header .slide-down {
                    background: unset !important;
                }
                .bili-header .slide-down {
                    position: absolute !important;
                    top: 0;
                    animation: unset !important;
                    box-shadow: unset !important;
                }
                .bili-header .slide-down .left-entry {
                    margin-right: 30px !important;
                }
                .bili-header .slide-down .left-entry .default-entry,
                .bili-header .slide-down .left-entry .download-entry,
                .bili-header .slide-down .left-entry .entry-title,
                .bili-header .slide-down .left-entry .entry-title .zhuzhan-icon,
                .bili-header .slide-down .left-entry .loc-entry,
                .bili-header .slide-down .left-entry .loc-mc-box__text,
                .bili-header .slide-down .left-entry .mini-header__title,
                .bili-header .slide-down .right-entry .right-entry__outside .right-entry-icon,
                .bili-header .slide-down .right-entry .right-entry__outside .right-entry-text {
                    color: #fff !important;
                }
                .bili-header .slide-down .download-entry,
                .bili-header .slide-down .loc-entry {
                    display: unset !important;
                }
                .bili-header .slide-down .center-search-container,
                .bili-header .slide-down .center-search-container .center-search__bar {
                    margin: 0 auto !important;
                }
                /* 不可添加important, 否则与Evolved的黑暗模式冲突 */
                #nav-searchform {
                    background: #f1f2f3;
                }
                #nav-searchform:hover {
                    background-color: var(--bg1) !important;
                    opacity: 1
                }
                #nav-searchform.is-focus {
                    border: 1px solid var(--line_regular) !important;
                    border-bottom: none !important;
                    background: var(--bg1) !important;
                }
                #nav-searchform.is-actived.is-exper4-actived,
                #nav-searchform.is-focus.is-exper4-actived {
                    border-bottom: unset !important;
                }`
        )
      );
      basicItems.push(
        new CheckboxItem(
          "popular-hide-tips",
          "隐藏 tips",
          true,
          void 0,
          false,
          `.popular-list .popular-tips,
                .rank-container .rank-tips,
                .history-list .history-tips {display: none !important;}
                .rank-container .rank-tab-wrap {
                    margin-bottom: 0 !important;
                    padding: 10px 0 !important;
                }`
        )
      );
      basicItems.push(
        new CheckboxItem(
          "popular-hide-watchlater",
          "隐藏 稍后再看按钮",
          false,
          void 0,
          false,
          `.rank-container .rank-item .van-watchlater,
                .history-list .video-card .van-watchlater,
                .history-list .video-card .watch-later,
                .weekly-list .video-card .van-watchlater,
                .weekly-list .video-card .watch-later,
                .popular-list .video-card .van-watchlater,
                .popular-list .video-card .watch-later {
                    display: none !important;
                }`
        )
      );
      basicItems.push(
        new CheckboxItem(
          "popular-hide-danmaku-count",
          "隐藏 弹幕数",
          false,
          void 0,
          false,
          `.popular-list .video-stat .like-text,
                .weekly-list .video-stat .like-text,
                .history-list .video-stat .like-text,
                .rank-list .rank-item .detail-state .data-box:nth-child(2) {
                    display: none !important;
                }
                .rank-list .rank-item .detail-state .data-box:nth-child(1) {
                    margin: 0 !important;
                }
                .video-card .video-stat .play-text {
                    margin-right: 0 !important;
                }`
        )
      );
    }
    popularGroupList.push(new Group("popular-basic", "热门/排行榜页 基本功能", basicItems));
    {
      const layoutRadioItemIDList = [
        "popular-layout-default",
        "popular-layout-4-column",
        "popular-layout-5-column",
        "popular-layout-6-column"
      ];
      layoutItems.push(
        new RadioItem(
          "popular-layout-default",
          "官方默认 2 列布局",
          "popular-layout-option",
          layoutRadioItemIDList,
          true,
          void 0,
          false,
          null
        )
      );
      layoutItems.push(
        new RadioItem(
          "popular-layout-4-column",
          "强制使用 4 列布局\n默认屏蔽Tag和简介，下同",
          "popular-layout-option",
          layoutRadioItemIDList,
          false,
          void 0,
          false,
          `/* 页面宽度 */
                @media (min-width: 1300px) and (max-width: 1399.9px) {
                  .popular-container {
                    max-width: 1180px !important;
                  }
                }
                @media (max-width: 1139.9px) {
                  .popular-container {
                    max-width: 1020px !important;
                  }
                }
                /* 布局高度 */
                .rank-container .rank-tab-wrap {
                  margin-bottom: 0 !important;
                  padding: 10px 0 !important;
                }
                .nav-tabs {
                  height: 70px !important;
                }
                .popular-list {
                  padding: 10px 0 0 !important;
                }
                .video-list {
                  margin-top: 15px !important;
                }
                /* 屏蔽 Tips */
                .popular-list .popular-tips, .rank-container .rank-tips, .history-list .history-tips {
                  display: none !important;
                }
                /* 屏蔽 Hint */
                .popular-list .popular-tips, .weekly-list .weekly-hint, .history-list .history-hint {
                  display: none !important;
                }
                /* 通用：综合热门, 每周必看, 入站必刷, grid布局 */
                .card-list, .video-list {
                  width: 100% !important;
                  display: grid !important;
                  grid-gap: 20px !important;
                  grid-column: span 4 !important;
                  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                }
                .card-list .video-card, .video-list .video-card {
                  display: unset !important;
                  width: unset !important;
                  height: unset !important;
                  margin-right: unset !important;
                  margin-bottom: unset !important;
                }
                .card-list .video-card .video-card__content, .video-list .video-card .video-card__content {
                  background: none;
                  width: unset !important;
                  height: unset !important;
                  margin: 0 !important;
                  border-radius: 6px !important;
                  overflow: hidden !important;
                }
                .card-list .video-card .video-card__info, .video-list .video-card .video-card__info {
                  margin-top: 8px !important;
                  font-size: 14px;
                  padding: 0 !important;
                }
                .card-list .video-card .video-card__info .rcmd-tag, .video-list .video-card .video-card__info .rcmd-tag {
                  display: none !important;
                }
                .card-list .video-card .video-card__info .video-name, .video-list .video-card .video-card__info .video-name {
                  font-weight: normal !important;
                  margin-bottom: 8px !important;
                  font-size: 15px !important;
                  line-height: 22px !important;
                  height: 44px !important;
                  overflow: hidden !important;
                }
                .card-list .video-card .video-card__info .up-name, .video-list .video-card .video-card__info .up-name {
                  margin: unset !important;
                  font-size: 14px !important;
                  text-wrap: nowrap !important;
                }
                .card-list .video-card .video-card__info > div, .video-list .video-card .video-card__info > div {
                  display: flex !important;
                  justify-content: space-between !important;
                }
                .card-list .video-card .video-card__info .video-stat .play-text, .video-list .video-card .video-card__info .video-stat .play-text, .card-list .video-card .video-card__info .video-stat .like-text, .video-list .video-card .video-card__info .video-stat .like-text {
                  text-wrap: nowrap !important;
                }
                /* 排行榜, grid布局 */
                .rank-list {
                  width: 100% !important;
                  display: grid !important;
                  grid-gap: 20px !important;
                  grid-column: span 4 !important;
                  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                }
                .rank-list .rank-item {
                  display: unset !important;
                  width: unset !important;
                  height: unset !important;
                  margin-right: unset !important;
                  margin-bottom: unset !important;
                }
                .rank-list .rank-item > .content {
                  display: unset !important;
                  padding: unset !important;
                }
                .rank-list .rank-item > .content > .img {
                  background: none;
                  width: unset !important;
                  height: unset !important;
                  margin: 0 !important;
                  border-radius: 6px !important;
                  overflow: hidden !important;
                }
                .rank-list .rank-item > .content > .img .num {
                  font-size: 18px;
                  zoom: 1.2;
                }
                .rank-list .rank-item > .content > .info {
                  margin-top: 8px !important;
                  margin-left: unset !important;
                  padding: 0 !important;
                  font-size: 14px;
                  height: unset !important;
                }
                .rank-list .rank-item > .content > .info .title {
                  height: 44px !important;
                  line-height: 22px !important;
                  font-weight: 500 !important;
                  font-size: 15px !important;
                  overflow: hidden !important;
                }
                .rank-list .rank-item > .content > .info .detail {
                  display: flex !important;
                  justify-content: space-between !important;
                  align-items: center !important;
                  margin-top: 8px !important;
                }
                .rank-list .rank-item > .content > .info .detail > a .up-name {
                  margin: unset !important;
                  font-size: 14px;
                  text-wrap: nowrap !important;
                }
                .rank-list .rank-item > .content > .info .detail > .detail-state .data-box {
                  line-height: unset !important;
                  margin: 0 12px 0 0;
                  text-wrap: nowrap !important;
                }
                .rank-list .rank-item > .content > .info .detail > .detail-state .data-box:nth-child(2) {
                  margin: 0 !important;
                }
                .rank-list .rank-item > .content .more-data {
                  display: none !important;
                }`
        )
      );
      layoutItems.push(
        new RadioItem(
          "popular-layout-5-column",
          "强制使用 5 列布局",
          "popular-layout-option",
          layoutRadioItemIDList,
          false,
          void 0,
          false,
          `/* 页面宽度 */
                @media (min-width: 1300px) and (max-width: 1399.9px) {
                  .popular-container {
                    max-width: 1180px !important;
                  }
                }
                @media (max-width: 1139.9px) {
                  .popular-container {
                    max-width: 1020px !important;
                  }
                }
                /* 布局高度 */
                .rank-container .rank-tab-wrap {
                  margin-bottom: 0 !important;
                  padding: 10px 0 !important;
                }
                .nav-tabs {
                  height: 70px !important;
                }
                .popular-list {
                  padding: 10px 0 0 !important;
                }
                .video-list {
                  margin-top: 15px !important;
                }
                /* 屏蔽 Tips */
                .popular-list .popular-tips, .rank-container .rank-tips, .history-list .history-tips {
                  display: none !important;
                }
                /* 屏蔽 Hint */
                .popular-list .popular-tips, .weekly-list .weekly-hint, .history-list .history-hint {
                  display: none !important;
                }
                /* 通用：综合热门, 每周必看, 入站必刷, grid布局 */
                .card-list, .video-list {
                  width: 100% !important;
                  display: grid !important;
                  grid-gap: 20px !important;
                  grid-column: span 5 !important;
                  grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
                }
                .card-list .video-card, .video-list .video-card {
                  display: unset !important;
                  width: unset !important;
                  height: unset !important;
                  margin-right: unset !important;
                  margin-bottom: unset !important;
                }
                .card-list .video-card .video-card__content, .video-list .video-card .video-card__content {
                  background: none;
                  width: unset !important;
                  height: unset !important;
                  margin: 0 !important;
                  border-radius: 6px !important;
                  overflow: hidden !important;
                }
                .card-list .video-card .video-card__info, .video-list .video-card .video-card__info {
                  margin-top: 8px !important;
                  font-size: 14px;
                  padding: 0 !important;
                }
                .card-list .video-card .video-card__info .rcmd-tag, .video-list .video-card .video-card__info .rcmd-tag {
                  display: none !important;
                }
                .card-list .video-card .video-card__info .video-name, .video-list .video-card .video-card__info .video-name {
                  font-weight: normal !important;
                  margin-bottom: 8px !important;
                  font-size: 15px !important;
                  line-height: 22px !important;
                  height: 44px !important;
                  overflow: hidden !important;
                }
                .card-list .video-card .video-card__info .up-name, .video-list .video-card .video-card__info .up-name {
                  margin: unset !important;
                  font-size: 14px !important;
                  text-wrap: nowrap !important;
                }
                .card-list .video-card .video-card__info > div, .video-list .video-card .video-card__info > div {
                  display: flex !important;
                  justify-content: space-between !important;
                }
                .card-list .video-card .video-card__info .video-stat .play-text, .video-list .video-card .video-card__info .video-stat .play-text, .card-list .video-card .video-card__info .video-stat .like-text, .video-list .video-card .video-card__info .video-stat .like-text {
                  text-wrap: nowrap !important;
                }
                /* 排行榜, grid布局 */
                .rank-list {
                  width: 100% !important;
                  display: grid !important;
                  grid-gap: 20px !important;
                  grid-column: span 5 !important;
                  grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
                }
                .rank-list .rank-item {
                  display: unset !important;
                  width: unset !important;
                  height: unset !important;
                  margin-right: unset !important;
                  margin-bottom: unset !important;
                }
                .rank-list .rank-item > .content {
                  display: unset !important;
                  padding: unset !important;
                }
                .rank-list .rank-item > .content > .img {
                  background: none;
                  width: unset !important;
                  height: unset !important;
                  margin: 0 !important;
                  border-radius: 6px !important;
                  overflow: hidden !important;
                }
                .rank-list .rank-item > .content > .img .num {
                  font-size: 18px;
                  zoom: 1.2;
                }
                .rank-list .rank-item > .content > .info {
                  margin-top: 8px !important;
                  margin-left: unset !important;
                  padding: 0 !important;
                  font-size: 14px;
                  height: unset !important;
                }
                .rank-list .rank-item > .content > .info .title {
                  height: 44px !important;
                  line-height: 22px !important;
                  font-weight: 500 !important;
                  font-size: 15px !important;
                  overflow: hidden !important;
                }
                .rank-list .rank-item > .content > .info .detail {
                  display: flex !important;
                  justify-content: space-between !important;
                  align-items: center !important;
                  margin-top: 8px !important;
                }
                .rank-list .rank-item > .content > .info .detail > a .up-name {
                  margin: unset !important;
                  font-size: 14px;
                  text-wrap: nowrap !important;
                }
                .rank-list .rank-item > .content > .info .detail > .detail-state .data-box {
                  line-height: unset !important;
                  margin: 0 12px 0 0;
                  text-wrap: nowrap !important;
                }
                .rank-list .rank-item > .content > .info .detail > .detail-state .data-box:nth-child(2) {
                  margin: 0 !important;
                }
                .rank-list .rank-item > .content .more-data {
                  display: none !important;
                }`
        )
      );
      layoutItems.push(
        new RadioItem(
          "popular-layout-6-column",
          "强制使用 6 列布局，建议开启 隐藏弹幕数",
          "popular-layout-option",
          layoutRadioItemIDList,
          false,
          void 0,
          false,
          `/* 页面宽度 */
                @media (min-width: 1300px) and (max-width: 1399.9px) {
                  .popular-container {
                    max-width: 1180px !important;
                  }
                }
                @media (max-width: 1139.9px) {
                  .popular-container {
                    max-width: 1020px !important;
                  }
                }
                /* 布局高度 */
                .rank-container .rank-tab-wrap {
                  margin-bottom: 0 !important;
                  padding: 10px 0 !important;
                }
                .nav-tabs {
                  height: 70px !important;
                }
                .popular-list {
                  padding: 10px 0 0 !important;
                }
                .video-list {
                  margin-top: 15px !important;
                }
                /* 屏蔽 Tips */
                .popular-list .popular-tips, .rank-container .rank-tips, .history-list .history-tips {
                  display: none !important;
                }
                /* 屏蔽 Hint */
                .popular-list .popular-tips, .weekly-list .weekly-hint, .history-list .history-hint {
                  display: none !important;
                }
                /* 通用：综合热门, 每周必看, 入站必刷, grid布局 */
                .card-list, .video-list {
                  width: 100% !important;
                  display: grid !important;
                  grid-gap: 20px !important;
                  grid-column: span 6 !important;
                  grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
                }
                .card-list .video-card, .video-list .video-card {
                  display: unset !important;
                  width: unset !important;
                  height: unset !important;
                  margin-right: unset !important;
                  margin-bottom: unset !important;
                }
                .card-list .video-card .video-card__content, .video-list .video-card .video-card__content {
                  background: none;
                  width: unset !important;
                  height: unset !important;
                  margin: 0 !important;
                  border-radius: 6px !important;
                  overflow: hidden !important;
                }
                .card-list .video-card .video-card__info, .video-list .video-card .video-card__info {
                  margin-top: 8px !important;
                  font-size: 14px;
                  padding: 0 !important;
                }
                .card-list .video-card .video-card__info .rcmd-tag, .video-list .video-card .video-card__info .rcmd-tag {
                  display: none !important;
                }
                .card-list .video-card .video-card__info .video-name, .video-list .video-card .video-card__info .video-name {
                  font-weight: normal !important;
                  margin-bottom: 8px !important;
                  font-size: 15px !important;
                  line-height: 22px !important;
                  height: 44px !important;
                  overflow: hidden !important;
                }
                .card-list .video-card .video-card__info .up-name, .video-list .video-card .video-card__info .up-name {
                  margin: unset !important;
                  font-size: 14px !important;
                  text-wrap: nowrap !important;
                }
                .card-list .video-card .video-card__info > div, .video-list .video-card .video-card__info > div {
                  display: flex !important;
                  justify-content: space-between !important;
                }
                .card-list .video-card .video-card__info .video-stat .play-text, .video-list .video-card .video-card__info .video-stat .play-text, .card-list .video-card .video-card__info .video-stat .like-text, .video-list .video-card .video-card__info .video-stat .like-text {
                  text-wrap: nowrap !important;
                }
                /* 排行榜, grid布局 */
                .rank-list {
                  width: 100% !important;
                  display: grid !important;
                  grid-gap: 20px !important;
                  grid-column: span 6 !important;
                  grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
                }
                .rank-list .rank-item {
                  display: unset !important;
                  width: unset !important;
                  height: unset !important;
                  margin-right: unset !important;
                  margin-bottom: unset !important;
                }
                .rank-list .rank-item > .content {
                  display: unset !important;
                  padding: unset !important;
                }
                .rank-list .rank-item > .content > .img {
                  background: none;
                  width: unset !important;
                  height: unset !important;
                  margin: 0 !important;
                  border-radius: 6px !important;
                  overflow: hidden !important;
                }
                .rank-list .rank-item > .content > .img .num {
                  font-size: 18px;
                  zoom: 1.1;
                }
                .rank-list .rank-item > .content > .info {
                  margin-top: 8px !important;
                  margin-left: unset !important;
                  padding: 0 !important;
                  font-size: 14px;
                  height: unset !important;
                }
                .rank-list .rank-item > .content > .info .title {
                  height: 44px !important;
                  line-height: 22px !important;
                  font-weight: 500 !important;
                  font-size: 15px !important;
                  overflow: hidden !important;
                }
                .rank-list .rank-item > .content > .info .detail {
                  display: flex !important;
                  justify-content: space-between !important;
                  align-items: center !important;
                  margin-top: 8px !important;
                }
                .rank-list .rank-item > .content > .info .detail > a .up-name {
                  margin: unset !important;
                  font-size: 14px;
                  text-wrap: nowrap !important;
                }
                .rank-list .rank-item > .content > .info .detail > .detail-state .data-box {
                  line-height: unset !important;
                  margin: 0 12px 0 0;
                  text-wrap: nowrap !important;
                }
                .rank-list .rank-item > .content > .info .detail > .detail-state .data-box:nth-child(2) {
                  margin: 0 !important;
                }
                .rank-list .rank-item > .content .more-data {
                  display: none !important;
                }`
        )
      );
    }
    popularGroupList.push(new Group("popular-layout", "页面强制布局 (单选，实验性)", layoutItems));
    {
      hotItems.push(
        new CheckboxItem(
          "popular-hot-hide-tag",
          "隐藏 视频tag (人气飙升/1万点赞)",
          false,
          void 0,
          false,
          `.popular-list .rcmd-tag {display: none !important;}`
        )
      );
    }
    popularGroupList.push(new Group("popular-hot", "综合热门", hotItems));
    {
      weeklyItems.push(
        new CheckboxItem(
          "popular-weekly-hide-hint",
          "隐藏 一句话简介",
          false,
          void 0,
          false,
          `.weekly-list .weekly-hint {display: none !important;}`
        )
      );
    }
    popularGroupList.push(new Group("popular-weekly", "每周必看", weeklyItems));
    {
      historyItems.push(
        new CheckboxItem(
          "popular-history-hide-hint",
          "隐藏 一句话简介",
          false,
          void 0,
          false,
          `.history-list .history-hint {display: none !important;}`
        )
      );
    }
    popularGroupList.push(new Group("popular-history", "入站必刷", historyItems));
  }
  log("script start");
  const main = async () => {
    try {
      await init();
    } catch (err) {
      error(err);
      error("init error, try continue");
    }
    const GROUPS = [
      ...homepageGroupList,
      ...popularGroupList,
      ...videoGroupList,
      ...bangumiGroupList,
      ...searchGroupList,
      ...dynamicGroupList,
      ...liveGroupList,
      ...commonGroupList
    ];
    GROUPS.forEach((e) => e.enableGroup());
    let lastURL = location.href;
    setInterval(() => {
      const currURL = location.href;
      if (currURL !== lastURL) {
        debug("url change detected");
        GROUPS.forEach((e) => e.reloadGroup());
        lastURL = currURL;
        debug("url change reload groups complete");
      }
    }, 500);
    let isGroupEnable = true;
    document.addEventListener("keydown", (event) => {
      let flag = false;
      if (event.altKey && event.ctrlKey && (event.key === "b" || event.key === "B")) {
        flag = true;
      } else if (event.altKey && (event.key === "b" || event.key === "B")) {
        if (navigator.userAgent.toLocaleLowerCase().includes("chrome")) {
          flag = true;
        }
      }
      if (flag) {
        debug("keydown Alt+B detected");
        if (isGroupEnable) {
          GROUPS.forEach((e) => e.disableGroup());
          isGroupEnable = false;
        } else {
          GROUPS.forEach((e) => e.enableGroup(false));
          isGroupEnable = true;
        }
      }
    });
    const openSettings = () => {
      const panel = document.getElementById("bili-cleaner");
      if (panel) {
        panel.style.removeProperty("display");
        return;
      }
      debug("panel create start");
      const newPanel = new Panel();
      newPanel.createPanel();
      GROUPS.forEach((e) => {
        e.insertGroup();
        e.insertGroupItems();
      });
      debug("panel create complete");
    };
    _GM_registerMenuCommand("设置", openSettings);
    debug("register menu complete");
  };
  try {
    await( main());
  } catch (err) {
    error(err);
  }
  log("script end");

})();