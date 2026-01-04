// ==UserScript==
// @name              全网内容屏蔽
// @name:zh           网络内容过滤器
// @namespace         Violentmonkey Scripts
// @match             *://*.weibo.com/*
// @match             *://*.weibo.cn/*
// @match             *://weibo.com/*
// @match             *://m.hupu.com/*
// @match             *://tieba.baidu.com/*
// @match             *://www.zhihu.com/*
// @match             *://www.zhihu.com
// @match             *://*.bilibili.com/*
// @exclude           *://weibo.com/tv*
// @grant             GM.getValue
// @grant             GM.setValue
// @version           4.0.16
// @author            no one
// @description       屏蔽特定用户的帖子和评论
// @description:zh    屏蔽特定用户的帖子和评论
// @require           https://update.greasyfork.org/scripts/472943/1320613/Itsnotlupus%27%20MiddleMan.js
// @downloadURL https://update.greasyfork.org/scripts/503494/%E5%85%A8%E7%BD%91%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/503494/%E5%85%A8%E7%BD%91%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result) __defProp(target, key, result);
    return result;
  };
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/utils/store.ts
  var DomainStore = class _DomainStore {
    static NgListKey = "NgList";
    static domainKeyPrefix;
    storeKey = "name";
    static listener(user) {
      const store = new _DomainStore();
      store.addUser(user);
    }
    static {
      const domain = document.location.host;
      let segs = domain.split(".");
      if (segs.length > 2) segs = segs.slice(1);
      this.domainKeyPrefix = `${segs.join(".")}:${this.NgListKey}`;
    }
    static async init(key = "name") {
      let blockedUsers = [];
      const value = await GM.getValue(_DomainStore.blockUsersKey());
      if (value === void 0) {
        const list = await this.loadBlackList();
        blockedUsers = list.map((name) => {
          if (this.domainKeyPrefix.includes("zhihu")) {
            return {
              id: name,
              name: "",
              blockedDate: /* @__PURE__ */ new Date()
            };
          } else {
            return {
              name,
              id: "",
              blockedDate: /* @__PURE__ */ new Date()
            };
          }
        });
        const value2 = JSON.stringify(blockedUsers);
        await GM.setValue(_DomainStore.blockUsersKey(), value2);
      } else {
        blockedUsers = JSON.parse(value);
        blockedUsers.forEach((user) => {
          user.name = user.name.trim();
        });
      }
      const val = await GM.getValue(_DomainStore.patternKey());
      const patterns = JSON.parse(val || "[]");
      return new _DomainStore(blockedUsers, patterns, key);
    }
    nameMap = /* @__PURE__ */ new Map();
    idMap = /* @__PURE__ */ new Map();
    excludePatterns = [];
    get userList() {
      return this.nameMap.keys();
    }
    get patternList() {
      return structuredClone(this.excludePatterns);
    }
    matchPattern(text) {
      text = text.trim();
      return this.excludePatterns.some((pattern) => {
        return text.toLocaleLowerCase().includes(pattern.toLocaleLowerCase());
      });
    }
    addPattern(text) {
      const s = new Set(this.excludePatterns).add(text.trim());
      this.excludePatterns = [...s];
      this.flush();
    }
    removePattern(text) {
      text = text.trim();
      this.excludePatterns = this.excludePatterns.filter((pattern) => {
        return pattern !== text;
      });
      this.flush();
    }
    hasUser({ name, id }) {
      if (this.storeKey === "name") {
        return this.nameMap.has(name.trim());
      } else if (this.storeKey === "id") {
        return this.idMap.has(id.toString().trim());
      }
    }
    addUser({ name, id }) {
      name = name.trim();
      const user = { name, id, blockedDate: /* @__PURE__ */ new Date() };
      if (this.storeKey === "name") this.nameMap.set(name, user);
      if (this.storeKey === "id") this.idMap.set(id, user);
      this.flush();
    }
    removeUser({ name, id }) {
      if (this.storeKey === "name") this.nameMap.delete(name.trim());
      if (this.storeKey === "id") this.idMap.delete(id.toString().trim());
      this.flush();
    }
    static blockUsersKey() {
      return `${_DomainStore.domainKeyPrefix}:blockedusers`;
    }
    static patternKey() {
      return `${_DomainStore.domainKeyPrefix}:patterns`;
    }
    async flush() {
      const blockedUsers = [...this.nameMap.values()];
      const val = JSON.stringify(blockedUsers);
      await GM.setValue(_DomainStore.blockUsersKey(), val);
      const pv = JSON.stringify(this.excludePatterns);
      await GM.setValue(_DomainStore.patternKey(), pv);
    }
    static singleton;
    constructor(users, patterns, key = "name") {
      if (_DomainStore.singleton) {
        return _DomainStore.singleton;
      }
      for (const user of users) {
        switch (key) {
          case "id":
            this.idMap.set(user.id, user);
            break;
          case "name":
            this.nameMap.set(user.name, user);
            break;
        }
      }
      this.storeKey = key;
      this.excludePatterns = patterns;
      _DomainStore.singleton = this;
    }
    // 获取屏蔽词列表
    static async loadBlackList() {
      const value = await GM.getValue(_DomainStore.domainKeyPrefix);
      if (!value) return [];
      const ret = JSON.parse(value.toString());
      if (!Array.isArray(ret)) return [];
      return ret;
    }
  };

  // src/utils/css.ts
  var BlockButtonClass = "block-button";
  var HoverButtonClass = "hover-button";
  var cssByCls = (cls) => `.${cls}`;
  var ButtonCSSText = `
      ${cssByCls(BlockButtonClass)} {
        cursor: pointer;
        height: 12px;
        width: 12px;
        margin-left: 1px;
        float: inherit;
        background: inherit;
        #color: transparent;
        mix-blend-mode: difference;
        border-width: 0;
        padding: 0;
        display: inline-block;
        line-height:0px;
        transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: bottom;
      }

      ${cssByCls(BlockButtonClass)}:hover {
        transform: translateY(0) scale(1.5);
      }`;
  var css = `
      #add_ngList_btn {
        position: fixed;
        bottom: 2rem;
        left: 1rem;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.5);
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer !important;
        z-index: 100;
      }

      #add_ngList_btn::before {
        content: '';
        position: absolute;
        width: 16px;
        height: 2px;
        background: rgba(0, 0, 0, 0.5);
        top: calc(50% - 1px);
        left: calc(50% - 8px);
      }

      #add_ngList_btn::after {
        content: '';
        position: absolute;
        height: 16px;
        width: 2px;
        background: rgba(0, 0, 0, 0.5);
        top: calc(50% - 8px);
        left: calc(50% - 1px);
      }

      .my-dialog__wrapper {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: auto;
        margin: 0;
        z-index: 10000;
        background: rgba(0, 0, 0, 0.3);
        display: none;
      }

      .my-dialog {
        position: relative;
        background: #FFFFFF;
        border-radius: 2px;
        box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
        box-sizing: border-box;
        width: 50%;
        transform: none;
        left: 0;
        margin: 0 auto;
      }

      .my-dialog .my-dialog__header {
        border-bottom: 1px solid #e4e4e4;
        padding: 14px 16px 10px 16px;
      }

      .my-dialog__title {
        line-height: 24px;
        font-size: 18px;
        color: #303133;
      }

      .my-dialog__headerbtn {
        position: absolute;
        top: 20px;
        right: 20px;
        padding: 0;
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        font-size: 16px;
        width: 12px;
        height: 12px;
        transform: rotateZ(45deg);
      }

      .my-dialog .my-dialog__header .my-dialog__headerbtn {
        right: 16px;
        top: 16px;
      }

      .my-dialog__headerbtn .my-dialog__close::before {
        content: '';
        position: absolute;
        width: 12px;
        height: 1.5px;
        background: #909399;
        top: calc(50% - 0.75px);
        left: calc(50% - 6px);
        border-radius: 2px;
      }

      .my-dialog__headerbtn:hover .my-dialog__close::before {
        background: #1890ff;
      }

      .my-dialog__headerbtn .my-dialog__close::after {
        content: '';
        position: absolute;
        height: 12px;
        width: 1.5px;
        background: #909399;
        top: calc(50% - 6px);
        left: calc(50% - 0.75px);
        border-radius: 2px;
      }

      .my-dialog__headerbtn:hover .my-dialog__close::after {
        background: #1890ff;
      }

      .my-dialog__body {
        padding: 30px 20px;
        color: #606266;
        font-size: 14px;
        word-break: break-all;
      }

      .my-dialog__footer {
        padding: 20px;
        padding-top: 10px;
        text-align: right;
        box-sizing: border-box;
      }

      .my-dialog .my-dialog__footer {
        padding: 0px 16px 24px 16px;
        margin-top: 40px;
      }

      #ngList {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        max-height: 480px;
        overflow-y: scroll;
      }

      ${ButtonCSSText}

      .close-icon {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        display: inline-block;
        position: relative;
        transform: rotateZ(45deg);
        margin-left: 8px;
        cursor: pointer;
      }

      .close-icon:hover {
        background: #409eff;
      }

      .close-icon::before {
        content: '';
        position: absolute;
        width: 8px;
        height: 2px;
        background: #409eff;
        top: calc(50% - 1px);
        left: calc(50% - 4px);
        border-radius: 2px;
      }

      .close-icon:hover::before {
        background: #fff;
      }

      .close-icon::after {
        content: '';
        position: absolute;
        height: 8px;
        width: 2px;
        background: #409eff;
        top: calc(50% - 4px);
        left: calc(50% - 1px);
        border-radius: 2px;
      }

      .close-icon:hover::after {
        background: #fff;
      }

      .ng_item {
        background-color: #ecf5ff;
        display: inline-flex;
        align-items: center;
        padding: 0 10px;
        font-size: 12px;
        color: #409eff;
        border: 1px solid #d9ecff;
        border-radius: 4px;
        box-sizing: border-box;
        white-space: nowrap;
        height: 28px;
        line-height: 26px;
        margin-left: 12px;
        margin-top: 8px;
      }
      
      .ng_pattern {
        background-color: #ff704d;
        display: inline-flex;
        align-items: center;
        padding: 0 10px;
        font-size: 12px;
        color: #000000;
        text-decoration: line-through;
        border: 1px solid #d9ecff;
        border-radius: 4px;
        box-sizing: border-box;
        white-space: nowrap;
        height: 28px;
        line-height: 26px;
        margin-left: 12px;
        margin-top: 8px;
      }


      .input_container {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }

      .el-input {
        position: relative;
        font-size: 14px;
        display: inline-block;
        width: 100%;
      }

      .el-input__inner {
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: none;
        padding: 0 15px;
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        width: 100%;
        cursor: pointer;
        font-family: inherit;
      }

      .el-button {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #dcdfe6;
        color: #606266;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        transition: .1s;
        font-weight: 500;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 4px;
      }

      .el-button:focus,
      .el-button:hover {
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
      }

      .el-button:active {
        color: #3a8ee6;
        border-color: #3a8ee6;
        outline: none;
      }

      .input_container .el-input {
        margin-right: 12px;
      }

      .tips {
        margin-top: 24px;
        font-size: 12px;
        color: #F56C6C;
      }
      
      
      .${HoverButtonClass}:hover {
        filter: opacity(50);
        transition: filter 0.1s linear 0.1s;
      }
      
      .${HoverButtonClass} {
        background-color: #fff;
        background-color: rgba(255,255,255,0.2);
        height: 16px;
        width: 16px;
        filter: opacity(5);
        z-index: 10;
        position: absolute;
        top: 12px;
        left: 12px;
        transition: filter 0.1s linear 0s;
      }
    `;
  var svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="4" y1="4" x2="20" y2="20" />
      </svg>
    `;
  function createBlockButton({
    name,
    id,
    subclass,
    listeners,
    css: css2,
    eid
  }) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = svgIcon;
    wrapper.className = BlockButtonClass;
    if (subclass) wrapper.classList.add(subclass);
    wrapper.setAttribute("user-name", name);
    wrapper.setAttribute("user-id", id);
    wrapper.setAttribute("button-id", eid);
    if (css2) {
      const style = document.createElement("style");
      style.textContent = css2;
      wrapper.appendChild(style);
    }
    wrapper.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const element = ev.currentTarget;
      const user = {
        name: element.getAttribute("user-name"),
        id: element.getAttribute("user-id")
      };
      if (typeof listeners === "function") {
        listeners(user);
      } else {
        listeners.forEach((listener) => {
          listener(user);
        });
      }
    });
    return wrapper;
  }
  function addStyle(cssStyle) {
    if (!cssStyle) return;
    const head = document.querySelector("head");
    const style = document.createElement("style");
    const ttwindow = window;
    if (ttwindow.trustedTypes) {
      const policy = ttwindow.trustedTypes.createPolicy("default", {
        createHTML: (html) => html.replace(/</g, "&lt;")
      });
      style.innerHTML = policy.createHTML(cssStyle).toString();
    } else {
      style.innerHTML = cssStyle;
    }
    head?.appendChild(style);
  }

  // src/views/panel.ts
  var MainView = class _MainView {
    store;
    filter;
    static instance;
    constructor(filter) {
      if (_MainView.instance) {
        return _MainView.instance;
      }
      this.filter = filter;
      this.store = new DomainStore();
      addStyle(css);
      window.addEventListener("load", () => {
        appObserverInit();
      });
      _MainView.instance = this;
    }
    static DialogSelector = ".my-dialog__wrapper";
    dialogElement() {
      return document.querySelector(_MainView.DialogSelector);
    }
    render() {
      this.filter.render();
      setInterval(() => {
        this.renderSettingButton();
        this.renderSettingPanel();
        this.filter.render();
      }, 1e3);
    }
    /* 生成添加屏蔽关键词的按钮 */
    async renderSettingButton() {
      if (!document.body) {
        return;
      }
      if (document.body.querySelector("#add_ngList_btn")) {
        return;
      }
      const btn = document.createElement("div");
      btn.title = "\u6DFB\u52A0\u5C4F\u853D\u5173\u952E\u8BCD";
      const span = document.createElement("span");
      span.innerText = "";
      btn.appendChild(span);
      btn.id = "add_ngList_btn";
      document.body.appendChild(btn);
      btn.addEventListener("click", () => {
        this.renderBlockedUsers();
        this.showDialog();
      });
    }
    async renderSettingPanel() {
      const dialogTemplate = `
      <div class="my-dialog" style="margin-top: 15vh; width: 40%;">
        <div class="my-dialog__header">
          <span class="my-dialog__title">\u5C4F\u853D\u8BCD\u5217\u8868</span>
          <button type="button" aria-label="Close" class="my-dialog__headerbtn">
            <i class="my-dialog__close"></i>
          </button>
        </div>
        <div class="my-dialog__body">
          <div class="input_container">
            <div class="el-input">
              <textarea id="ngWord_input" style="line-height: 14px" placeholder="\u6279\u91CF\u8F93\u5165\uFF0C\u6BCF\u884C\u4E00\u4E2A" class="el-input__inner"></textarea>
            </div>
            <button type="button" class="el-button" id="add_btn">
              <span>\u6DFB\u52A0</span> 
            </button>
          </div>
          <div id="ngList"></div>
          <p class="tips">\u6CE8\uFF1A1. \u53EF\u8FC7\u6EE4\u5305\u542B\u5C4F\u853D\u8BCD\u7684\u7528\u6237\u3001\u5FAE\u535A\u3001\u8BC4\u8BBA\u3001\u70ED\u641C\u3002 2. \u5173\u952E\u8BCD\u4FDD\u5B58\u5728\u672C\u5730\u7684local storage\u4E2D\u3002 3. \u66F4\u6539\u5173\u952E\u8BCD\u540E\u5237\u65B0\u9875\u9762\u751F\u6548\uFF08\u4E0D\u5237\u65B0\u9875\u9762\u7684\u60C5\u51B5\u4E0B\uFF0C\u53EA\u6709\u4E4B\u540E\u52A0\u8F7D\u7684\u5FAE\u535A\u624D\u4F1A\u751F\u6548\uFF09\u3002</p>
        </div>
        <div class="my-dialog__footer"></div>
      </div>
    `;
      if (!document.body) {
        return;
      }
      if (document.body.querySelector(".my-dialog__wrapper")) {
        return;
      }
      const wrapper = document.createElement("div");
      wrapper.classList.add("my-dialog__wrapper");
      wrapper.innerHTML = dialogTemplate;
      document.body.appendChild(wrapper);
      document.querySelector(".my-dialog__headerbtn").addEventListener("click", () => {
        this.hideDialog();
      });
      document.querySelector("#add_btn").addEventListener("click", () => {
        const ngWord_input = document.querySelector(
          "#ngWord_input"
        );
        if (ngWord_input && ngWord_input.value) {
          const values = ngWord_input.value.trim().split("\n");
          for (const v of values) {
            this.store.addPattern(v);
          }
          ngWord_input.value = "";
          this.renderBlockedUsers();
        }
      });
    }
    showDialog() {
      this.dialogElement().style.display = "initial";
    }
    hideDialog() {
      this.dialogElement().style.display = "none";
    }
    renderBlockedUsers() {
      let blockedUsersHTML = "";
      const users = [...this.store.userList];
      for (const [i, pattern] of this.store.patternList.reverse().entries()) {
        blockedUsersHTML += `<span class="ng_pattern" data-type="pattern">${pattern}<i class="close-icon" data-index=${i}></i></span>`;
      }
      for (const [i, item] of users.reverse().entries()) {
        blockedUsersHTML += `<span class="ng_item" data-type="user">${item}<i class="close-icon" data-index=${i}></i></span>`;
      }
      const ngListNode = document.querySelector("#ngList");
      if (ngListNode) {
        ngListNode.innerHTML = blockedUsersHTML;
        const buttons = ngListNode.querySelectorAll(".close-icon");
        for (const button of buttons) {
          button.addEventListener("click", () => {
            const name = button.parentNode.textContent;
            const type = button.parentElement.dataset.type;
            switch (type) {
              case "user":
                this.store.removeUser({ name, id: name });
                break;
              case "pattern":
                this.store.removePattern(name);
                break;
            }
            this.renderBlockedUsers();
          });
        }
      }
    }
  };
  function appObserverInit() {
    const targetNode = document.getElementById("app");
    if (!targetNode) {
      return;
    }
    const config = {
      childList: true,
      subtree: true
    };
    const callback = function() {
      const audioList = document.querySelectorAll(".AfterPatch_bg_34rqc");
      for (const audio of audioList) {
        audio.remove();
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

  // src/utils/encoding.ts
  function md5cycle(x, k) {
    let a = x[0];
    let b = x[1];
    let c = x[2];
    let d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }
  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32(a << s | a >>> 32 - s, b);
  }
  function ff(a, b, c, d, x, s, t) {
    return cmn(b & c | ~b & d, a, b, x, s, t);
  }
  function gg(a, b, c, d, x, s, t) {
    return cmn(b & d | c & ~d, a, b, x, s, t);
  }
  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function md51(s) {
    let txt = "";
    let n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i = 64; i <= s.length; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    let tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++)
      tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
    tail[i >> 2] |= 128 << (i % 4 << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }
  function md5blk(s) {
    let md5blks = [], i;
    for (i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }
  var hex_chr = "0123456789abcdef".split("");
  function rhex(n) {
    let s = "", j = 0;
    for (; j < 4; j++)
      s += hex_chr[n >> j * 8 + 4 & 15] + hex_chr[n >> j * 8 & 15];
    return s;
  }
  function hex(x) {
    for (let i = 0; i < x.length; i++) x[i] = rhex(x[i]);
    return x.join("");
  }
  function add32(a, b) {
    return a + b & 4294967295;
  }
  function md5(s) {
    return hex(md51(s));
  }

  // src/utils/middleman.ts
  var middleman_default = middleMan;

  // src/filters/base.ts
  var defaultWrapperFunc = (userNode, root) => {
    while (userNode && userNode.parentNode !== root) {
      if (userNode.parentNode.childElementCount > 1) {
        return userNode.parentNode;
      }
      userNode = userNode.parentNode;
    }
    return userNode.parentNode;
  };
  var defaultNameFn = (elem) => {
    const href = elem.getAttribute("href");
    const id = href?.split("/").at(-1);
    let name = elem?.textContent || elem?.getAttribute("aria-label");
    name = name.trim().replace(/^@/, "").replace("\uFF1A", "").trim();
    return {
      name,
      id
    };
  };
  var defaultContentFn = (elem) => {
    return elem ? elem.textContent : "";
  };
  function locator(list, user, content, wrapper) {
    return {
      l: list,
      u: user,
      c: content ? content : "",
      w: wrapper
    };
  }
  function RegisterSubclass(target) {
    WebsiteFilter.registerClass(target);
  }
  var WebsiteFilter = class _WebsiteFilter {
    static filterKey = "name";
    hardDelete = false;
    static subclasses;
    static registerClass(FilterClass) {
      if (!_WebsiteFilter.subclasses) {
        _WebsiteFilter.subclasses = [];
      }
      _WebsiteFilter.subclasses.push(FilterClass);
    }
    static fromHost() {
      const host = document.location.host;
      for (const cls of _WebsiteFilter.subclasses) {
        if (host.includes(cls.host)) {
          return cls;
        }
      }
    }
    renderers = [];
    proxyOpt = {
      requestRouters: [],
      responseRouters: []
    };
    registered = false;
    modifyDom({
      locators,
      elementButtonFunc,
      doc = document,
      nameFn = defaultNameFn,
      contentFn = defaultContentFn
    }) {
      this.injectButton({
        locators,
        elementButtonFunc,
        doc,
        nameFn
      });
      this.removeElements(locators, doc, nameFn, contentFn);
    }
    injectButton({
      locators,
      elementButtonFunc,
      doc = document,
      nameFn = defaultNameFn
    }) {
      if (locators.length < 1) {
        return;
      }
      const l = locators[0];
      const list = doc.querySelectorAll(l.l);
      const buttonID = md5(l.l + l.u).slice(0, 8);
      list.forEach((element) => {
        (() => {
          let ue = element.querySelector(l.u);
          if (!ue) {
            return;
          }
          const user = nameFn(ue);
          if (!elementButtonFunc)
            elementButtonFunc = this.defaultButtonFunc.bind(this);
          const btn = elementButtonFunc({ element, user, eid: buttonID });
          if (btn === void 0) {
            return;
          }
          let buttonWrapper = l.w;
          if (!buttonWrapper) {
            buttonWrapper = defaultWrapperFunc;
          }
          let wrapper;
          if (typeof buttonWrapper === "function") {
            wrapper = buttonWrapper(ue, element);
          } else {
            wrapper = element.querySelector(buttonWrapper);
          }
          wrapper.appendChild(btn);
        })();
        this.injectButton({
          locators: locators.slice(1),
          elementButtonFunc,
          doc: element,
          nameFn
        });
      });
    }
    removeElements(selectors, root = document, nameFn = defaultNameFn, contentFn = defaultContentFn) {
      if (selectors.length < 1) {
        return;
      }
      const selector = selectors[0];
      const list = root.querySelectorAll(selector.l);
      list.forEach((element) => {
        if (element.style.display === "none") {
          return;
        }
        const user = element.querySelector(selector.u);
        if (!user) {
          return;
        }
        let content;
        if (selector.c) {
          const contentElement = element.querySelector(selector.c);
          content = contentFn(contentElement);
        } else {
          content = "";
        }
        if (nameFn === void 0) nameFn = defaultNameFn;
        const poster = nameFn(user);
        if (this.inBlackList(poster, content)) {
          if (this.hardDelete) {
            element?.parentNode?.removeChild(element);
          } else {
            element.style.display = "none";
          }
        } else {
          this.removeElements(selectors.slice(1), element, nameFn, contentFn);
        }
      });
    }
    inBlackList(name, content = "") {
      const store = new DomainStore();
      const blocked = store.hasUser(name) || store.matchPattern(content);
      if (blocked) {
      }
      return blocked;
    }
    registerHooks() {
      if (!this.registered) {
        const opt = this.proxyOpt;
        opt.requestRouters.forEach((router) => {
          middleman_default.addHook(router.hookMeta.pattern, this.requestHandler(router));
        });
        opt.responseRouters.forEach((router) => {
          middleman_default.addHook(
            router.hookMeta.pattern,
            this.responseHandler(router)
          );
        });
        this.registered = true;
      }
    }
    constructor() {
      this.addHooks(
        ...Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter((name) => Object.getPrototypeOf(this)[name].hookMeta).reduce((hooks, name) => {
          const pd = Object.getOwnPropertyDescriptor(
            Object.getPrototypeOf(this),
            name
          );
          const fn = pd.value.bind(this);
          fn.hookMeta = pd.value.hookMeta;
          hooks.push(fn);
          return hooks;
        }, [])
      );
      this.renderers = Object.getOwnPropertyNames(
        Object.getPrototypeOf(this)
      ).reduce((fns, name) => {
        const method = Object.getOwnPropertyDescriptor(
          Object.getPrototypeOf(this),
          name
        ).value;
        if (method.filterMeta) {
          const fn = method.bind(this);
          fn.filterMeta = method.filterMeta;
          fns.push(fn);
        }
        return fns;
      }, []);
      this.registerHooks();
    }
    addHooks(...hooks) {
      hooks.forEach((hook) => {
        switch (hook.hookMeta.type) {
          case "request":
            this.proxyOpt.requestRouters.push(hook);
            break;
          case "response":
            this.proxyOpt.responseRouters.push(hook);
            break;
        }
      });
    }
    requestHandler(hook) {
      return {
        async requestHandler(request) {
          const h = hook;
          return h(request);
        }
      };
    }
    responseHandler(hook) {
      return {
        async responseHandler(request, response, error) {
          if (error) {
            throw error;
          }
          const res = await response.json();
          const url = request.url;
          const h = hook;
          h(url, res);
          return Response.json(res);
        }
      };
    }
    defaultButtonFunc({ element, user, eid }) {
      if (element.querySelector(`${cssByCls(BlockButtonClass)}[button-id="${eid}"]`)) {
        return;
      }
      const { name, id } = user;
      return createBlockButton({
        name,
        id,
        listeners: [DomainStore.listener, this.render.bind(this)],
        eid
      });
    }
    render() {
      this.renderers.forEach((f) => {
        if (typeof f.filterMeta === "boolean") {
          f();
        } else {
          const href = document.location.href;
          if (f.filterMeta.pattern.exec(href)) {
            f();
          }
        }
      });
    }
  };
  function filterFunc(target, name, descriptor) {
    const fn = descriptor.value;
    fn.filterMeta = true;
  }
  function patternFilterFunc(pattern, once = false) {
    return (target, name, descriptor) => {
      descriptor.value.filterMeta = { pattern, once };
    };
  }
  function HookDecorator(type) {
    return (pattern) => {
      return (target, name, descriptor) => {
        descriptor.value.hookMeta = {
          type,
          pattern
        };
      };
    };
  }
  var reqHook = HookDecorator("request");
  var respHook = HookDecorator("response");

  // src/filters/bilibili.ts
  var BilibiliFilter = class extends WebsiteFilter {
    render() {
      super.render();
    }
    commentsButton(parent, name, id, eid) {
      let button;
      if (button = parent.querySelector(
        `${cssByCls(BlockButtonClass)}[button-id="${eid}"]`
      )) {
        button.setAttribute("user-name", name);
        button.setAttribute("user-id", id);
        return;
      }
      return createBlockButton({
        name,
        id,
        css: ButtonCSSText,
        listeners: [DomainStore.listener, this.render.bind(this)],
        eid
      });
    }
    hoverButtonFunc({ element, user, eid }) {
      if (element.querySelector(`${cssByCls(BlockButtonClass)}[button-id="${eid}"]`)) {
        return;
      }
      return createBlockButton({
        name: user.name,
        id: user.id,
        subclass: HoverButtonClass,
        listeners: [DomainStore.listener, this.render.bind(this)],
        eid
      });
    }
    filterReplies(e) {
      let replies = e.shadowRoot?.querySelector("div#replies")?.querySelector("bili-comment-replies-renderer")?.shadowRoot;
      let replyRenderers = replies?.querySelectorAll(
        "bili-comment-reply-renderer"
      );
      const eid = "bili-comment-reply-renderer";
      replyRenderers?.forEach((replyShadowRoot) => {
        let reply = replyShadowRoot?.shadowRoot;
        let replyUser = reply?.querySelector("bili-comment-user-info")?.shadowRoot?.querySelector("#user-name");
        let name = replyUser?.textContent || "";
        let id = replyUser?.getAttribute("data-user-profile-id") || "";
        if (this.inBlackList({ name, id })) {
          replyShadowRoot.parentElement?.removeChild(replyShadowRoot);
        } else {
          const button = this.commentsButton(replyUser.parentNode, name, id, eid);
          if (!button) {
            return;
          }
          replyUser.parentNode.appendChild(button);
        }
      });
    }
    filterComments() {
      const srw = document.querySelector("bili-comments")?.shadowRoot;
      if (!srw) {
        return;
      }
      const comments = srw.querySelectorAll(
        "#feed > bili-comment-thread-renderer"
      );
      const eid = "bili-comment-thread-renderer";
      comments?.forEach((e) => {
        this.filterReplies(e);
        const comment = e.shadowRoot?.querySelector(
          "bili-comment-renderer"
        )?.shadowRoot;
        let commentUser = comment?.querySelector(
          "#header > bili-comment-user-info"
        )?.shadowRoot;
        const userInfo = commentUser.querySelector("#user-name");
        const buttonWrapper = commentUser.querySelector("div#info");
        const commentContents = comment?.querySelector(
          "#content > bili-rich-text"
        )?.shadowRoot;
        const contents = commentContents.querySelector("#contents").textContent;
        let userName = userInfo?.textContent;
        let userId = userInfo?.getAttribute("data-user-profile-id") || "";
        if (this.inBlackList({ name: userName, id: userId }, contents)) {
          e.parentNode.removeChild(e);
        } else {
          const button = this.commentsButton(
            buttonWrapper,
            userName,
            userId,
            eid
          );
          if (!button) {
            return;
          }
          buttonWrapper.appendChild(button);
        }
      });
    }
    filterVideoSearch() {
      const selector = {
        videos: ".col_3.col_xs_1_5.col_md_2.col_xl_1_7.mb_x40",
        author: ".bili-video-card__info--owner",
        title: ".bili-video-card__info--tit"
      };
      this.filterVideoCards(
        locator(selector.videos, selector.author, selector.title),
        this.hoverButtonFunc.bind(this)
      );
    }
    filterVideoCards(l, buttonFunc) {
      const nameFn = (element) => {
        const author = element.querySelector(".bili-video-card__info--author");
        const href = element.getAttribute("href");
        return { name: author.textContent, id: href.split("/").at(-1) };
      };
      l.w = ".bili-video-card__image--wrap";
      this.modifyDom({
        locators: [l],
        nameFn,
        elementButtonFunc: buttonFunc
      });
    }
    filterVideoList() {
      const selector = {
        l: ".feed-card",
        u: ".bili-video-card__info--owner",
        c: ".bili-video-card__info--tit"
      };
      this.filterVideoCards(selector, this.hoverButtonFunc.bind(this));
      const videoCards = selector;
      videoCards.l = ".bili-video-card";
      this.filterVideoCards(videoCards, this.hoverButtonFunc.bind(this));
    }
    filterVideoPlaylist() {
      const videos = {
        l: ".video-page-card-small",
        u: ".upname a",
        c: "div.info a p.title",
        w: "div.playinfo"
      };
      const nameFn = (element) => {
        return {
          name: element.querySelector("span.name").textContent,
          id: element.getAttribute("href").split("/").at(-2)
        };
      };
      this.removeElements([videos], document, nameFn);
      setTimeout(() => {
        this.injectButton({
          locators: [videos],
          nameFn
          // elementButtonFunc: this.hoverButtonFunc.bind(this),
        });
      }, 5e3);
    }
    hookMain(url, res) {
      return this.hookComments(url, res);
    }
    hookReplies(url, res) {
      return this.hookComments(url, res);
    }
    hookRecommends(url, res) {
      const cards = res.data.item;
      res.data.item = cards.filter((card) => {
        const { mid, name } = card.owner;
        const title = card.title;
        const keep = !this.inBlackList({ name, id: mid }, title);
        if (!keep) {
        }
        return keep;
      });
    }
    hookComments(url, res) {
      const filterReplyFunc = (reply) => {
        const id = reply.mid_str;
        const name = reply.member.uname;
        const content = reply.content.message;
        return !this.inBlackList({ name, id }, content);
      };
      let { replies } = res.data;
      replies = replies.filter(filterReplyFunc);
      replies.forEach((reply) => {
        const subReplies = reply.replies;
        reply.replies = subReplies.filter(filterReplyFunc);
      });
      res.data.replies = replies;
    }
    hookSearchVideo(url, res) {
      res.data.result = res.data.result.filter((item) => {
        const name = item.author;
        const id = item.mid;
        const desc = item.description;
        return !this.inBlackList({ name, id }, desc);
      });
    }
    hookSearchTrends(url, res) {
      res.data.trending.list = [
        {
          keyword: "fsd",
          show_name: "FSD",
          icon: "http://i0.hdslb.com/bfs/activity-plat/static/20221213/eaf2dd702d7cc14d8d9511190245d057/lrx9rnKo24.png",
          uri: "",
          goto: ""
        }
      ];
    }
  };
  __publicField(BilibiliFilter, "host", "bilibili.com");
  __decorateClass([
    patternFilterFunc(/com\/video\/\w+/)
  ], BilibiliFilter.prototype, "filterComments", 1);
  __decorateClass([
    patternFilterFunc(/search\.bilibili\.com/)
  ], BilibiliFilter.prototype, "filterVideoSearch", 1);
  __decorateClass([
    filterFunc
  ], BilibiliFilter.prototype, "filterVideoList", 1);
  __decorateClass([
    patternFilterFunc(/com\/video\/\w+/, true)
  ], BilibiliFilter.prototype, "filterVideoPlaylist", 1);
  __decorateClass([
    respHook(/reply\/wbi\/main/)
  ], BilibiliFilter.prototype, "hookMain", 1);
  __decorateClass([
    respHook(/\/reply\/reply/)
  ], BilibiliFilter.prototype, "hookReplies", 1);
  __decorateClass([
    respHook(/top\/feed\/rcmd/)
  ], BilibiliFilter.prototype, "hookRecommends", 1);
  __decorateClass([
    respHook(/search\/type/)
  ], BilibiliFilter.prototype, "hookSearchVideo", 1);
  __decorateClass([
    respHook(/search\/square/)
  ], BilibiliFilter.prototype, "hookSearchTrends", 1);
  BilibiliFilter = __decorateClass([
    RegisterSubclass
  ], BilibiliFilter);

  // src/utils/time.ts
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // src/filters/hupu.ts
  var HupuFilter = class extends WebsiteFilter {
    constructor() {
      super();
      this.hideKOL();
    }
    async hideKOL() {
      if (document.location.href.match(/com\/gg$/)) {
        while (!document.querySelector(".gg-filters__item:nth-child(1)")) {
          await sleep(10);
        }
        const lol = document.querySelector(
          ".gg-filters__item:nth-child(2)"
        );
        lol.click();
        const kol = document.querySelector(
          ".gg-filters__item:nth-child(1)"
        );
        if (kol.style.display !== "none") {
          kol.style.display = "none";
        }
      }
    }
    async filterZone() {
      const posts = {
        l: "div.exposure",
        u: "h6.post-header span",
        c: "p.post-body",
        w: "h6.post-header"
      };
      this.modifyDom({
        locators: [posts]
      });
    }
    async updateHrefTarget() {
      const items = document.querySelectorAll("a.news-item:not([target])");
      for (const item of items) {
        item.setAttribute("target", "_blank");
      }
    }
    async filterPosts() {
      const contentFunc = (element) => {
        const title = element.querySelector(
          "p.bbs-header-title.hupu-font-title1"
        );
        const content = element.querySelector(
          "div.bbs-content-font.hupu-font-body5"
        );
        return title.textContent + content.textContent;
      };
      const posts = {
        l: ".post-detail_post-detail-wrapper__yB_pb",
        u: "p.first-line-user-info a span",
        c: ".hupu-bbs-post"
      };
      this.modifyDom({
        locators: [posts],
        contentFn: contentFunc
      });
    }
    async filterHupuComments() {
      const comments = {
        l: "div.index_discuss-card__Nd4MK.hp-m-discuss-card.post-card",
        u: "p.discuss-card__user span.discuss-card__username",
        c: "p.discuss-card__content",
        w: "p.discuss-card__user"
      };
      const replies = {
        l: "div.index_discuss-card__Nd4MK.hp-m-discuss-card.discuss-card",
        u: comments.u,
        c: comments.c,
        w: comments.w
      };
      const quotes = {
        // l: "div.discuss-card__quote-container-quote",
        l: comments.l,
        u: "div.discuss-card__quote-container-quote span.discuss-card__quote-container-discusser",
        c: "span.discuss-card__quote-content",
        w: ".discuss-card__quote-container-discusser"
      };
      const wrapper = "p.discuss-card__user";
      this.modifyDom({
        locators: [comments]
      });
      this.modifyDom({
        locators: [quotes]
      });
      this.modifyDom({ locators: [replies] });
    }
    filterHupuReplies(replies) {
      return replies.reduce((filtered, reply) => {
        const user = reply.user.username;
        const content = reply.content;
        if (!this.inBlackList({ name: user }, content)) {
          filtered.push(reply);
        }
        return filtered;
      }, []);
    }
    hupuRouter(url, res) {
      res.data.replies = this.filterHupuReplies(res.data.replies);
    }
  };
  __publicField(HupuFilter, "host", "hupu.com");
  __decorateClass([
    patternFilterFunc(/zone\/\d+/)
  ], HupuFilter.prototype, "filterZone", 1);
  __decorateClass([
    patternFilterFunc(/com\/\w+$/)
  ], HupuFilter.prototype, "updateHrefTarget", 1);
  __decorateClass([
    patternFilterFunc(/bbs\/\d+/)
  ], HupuFilter.prototype, "filterPosts", 1);
  __decorateClass([
    filterFunc
  ], HupuFilter.prototype, "filterHupuComments", 1);
  __decorateClass([
    respHook(/\/bbs-reply-detail/)
  ], HupuFilter.prototype, "hupuRouter", 1);
  HupuFilter = __decorateClass([
    RegisterSubclass
  ], HupuFilter);

  // src/filters/tieba.ts
  var TiebaFilter = class extends WebsiteFilter {
    constructor() {
      super();
      this.hideLoginPopup();
    }
    async hideLoginPopup() {
      let login = null;
      while (!login) {
        login = document.querySelector("div.tieba-custom-pass-login");
        if (login) {
          const ob = new MutationObserver((mutations) => {
            const popup = document.querySelector("div.tieba-custom-pass-login");
            const closeButton = document.querySelector("span.close-btn");
            if (closeButton) {
              closeButton.click();
            } else {
              popup.style.display = "none";
            }
          });
          ob.observe(login, {
            attributeFilter: ["style"],
            subtree: true
          });
          break;
        }
        await sleep(10);
      }
    }
    async filterTiebaThreadListComments() {
      const threads = {
        l: "li.j_thread_list.clearfix.thread_item_box",
        u: "span.tb_icon_author",
        c: "div.col2_right.j_threadlist_li_right"
      };
      const contentFn = (element) => {
        const title = element.querySelector(
          "div.threadlist_abs.threadlist_abs_onlyline"
        );
        const preview = element.querySelector(
          "div.threadlist_title.pull_left.j_th_tit"
        );
        return title?.textContent + preview?.textContent;
      };
      const fn = (user) => {
        const field = user.dataset.field;
        const id = JSON.parse(field)?.user_id;
        return {
          name: user.querySelector("span.frs-author-name-wrap a").textContent,
          id
        };
      };
      this.modifyDom({
        locators: [threads],
        nameFn: fn,
        contentFn
      });
    }
    async filterTiebaThreadComments() {
      const selector = {};
      const comments = {
        // l: "div.l_post.l_post_bright.j_l_post.clearfix",
        l: "div.l_post",
        u: "div.d_author li.d_name",
        c: "div.p_content div.d_post_content.j_d_post_content",
        w: "li.d_name"
      };
      const replies = {
        l: "div.j_lzl_c_b_a.core_reply_content li.lzl_single_post.j_lzl_s_p",
        u: "div.lzl_cnt a.at.j_user_card",
        c: "div.lzl_cnt span.lzl_content_main",
        w: ".lzl_content_main"
      };
      const nameFn = (element) => {
        let user;
        try {
          user = defaultNameFn(element);
        } catch (e) {
          const id = JSON.parse(element.dataset.field).user_id;
          user = { name: id, id };
        }
        return user;
      };
      this.modifyDom({
        locators: [comments, replies],
        nameFn
      });
    }
    async hideRightBar() {
      const rightBar = document.querySelector("div.right_section.right_bright");
      if (!rightBar) {
        return;
      }
      rightBar.parentNode.removeChild(rightBar);
    }
    filterTiebaReplies(data) {
      const userMap = /* @__PURE__ */ new Map();
      for (const user of Object.values(data.user_list)) {
        userMap.set(user.user_nickname_v2, true);
      }
      const comments = data.comment_list;
      data.comment_list = Object.entries(comments).reduce(
        (filtered, [postId, comment]) => {
          let replies = comment.comment_info;
          replies = replies.filter(
            (reply) => !this.inBlackList({ name: reply.show_nickname }, reply.content)
          );
          comment.comment_list_num = replies.length;
          comment.comment_info = replies;
          if (comment.comment_list_num > 0) {
            filtered = {
              ...filtered,
              [postId]: comment
            };
          }
          return filtered;
        },
        {}
      );
      return data;
    }
    hookReplies(url, res) {
      res.data = this.filterTiebaReplies(res.data);
    }
    hookTopicList(url, res) {
      res.data.user_his_topic.topic_list = [];
      res.data.sug_topic.topic_list = [];
      res.data.bang_topic.topic_list = [];
      res.data.manual_topic.topic_list = [];
    }
    hookSuggestion(url, res) {
      res.hottopic_list.search_data = [];
      res.query_tips.search_data = [];
    }
  };
  __publicField(TiebaFilter, "host", "tieba.baidu.com");
  __decorateClass([
    filterFunc
  ], TiebaFilter.prototype, "hideLoginPopup", 1);
  __decorateClass([
    patternFilterFunc(/com\/f/)
  ], TiebaFilter.prototype, "filterTiebaThreadListComments", 1);
  __decorateClass([
    patternFilterFunc(/p\/\d+/)
  ], TiebaFilter.prototype, "filterTiebaThreadComments", 1);
  __decorateClass([
    filterFunc
  ], TiebaFilter.prototype, "hideRightBar", 1);
  __decorateClass([
    respHook(/\/p\/totalComment/)
  ], TiebaFilter.prototype, "hookReplies", 1);
  __decorateClass([
    respHook(/\/topicList/)
  ], TiebaFilter.prototype, "hookTopicList", 1);
  __decorateClass([
    respHook(/\/suggestion/)
  ], TiebaFilter.prototype, "hookSuggestion", 1);
  TiebaFilter = __decorateClass([
    RegisterSubclass
  ], TiebaFilter);

  // src/filters/twitter.ts
  var Twitter = class extends WebsiteFilter {
    async blockShortcut() {
      const buttons = document.querySelectorAll('button[aria-label="More"]');
      buttons.forEach((e) => {
        const wrapper = document.querySelector(
          ".css-175oi2r.r-k4xj1c.r-18u37iz.r-1wtj0ep"
        );
        if (wrapper.querySelector(cssByCls(BlockButtonClass)) !== null) {
          return;
        }
        const listener = async (ev) => {
          ev.stopPropagation();
          e.click();
          await sleep(200);
          let blockButton = document.querySelector(
            'div[data-testid="block"]'
          );
          if (!blockButton) {
            return;
          }
          blockButton.click();
        };
        const shortcut = createBlockButton({
          name: "",
          id: "",
          eid: "",
          listeners: listener
        });
        wrapper.appendChild(shortcut);
      });
    }
  };
  __publicField(Twitter, "host", "x.com");
  __decorateClass([
    filterFunc
  ], Twitter.prototype, "blockShortcut", 1);
  Twitter = __decorateClass([
    RegisterSubclass
  ], Twitter);

  // src/filters/weibo.ts
  var WeiboFilter = class extends WebsiteFilter {
    apiBlackList = ["/female_version.mp3", "/intake/v2/rum/events"];
    mockRequests() {
      return Response.json({}, { status: 200 });
    }
    interceptRead() {
      const data = {
        data: [
          {
            act: "PC_real_read",
            duration: 1902,
            read_duration: 1902,
            itemid: "5067162012353224",
            type: "adMblog",
            rid: "0_0_1_5135480043505157444_0_0_0",
            page: "",
            root_id: "5058972623834652",
            uicode: 20000390,
            groupid: 20000390,
            fid: 232150,
            analysis_extra: "",
            __date: 1723590632,
            ext: "module:02",
            PC_real_read: 1
          }
        ],
        ok: 1
      };
      return Response.json(data);
    }
    constructor() {
      super();
      this.hardDelete = true;
      this.hideTrends();
    }
    async filterSearchResults() {
      const selector = {
        cards: "div.card-wrap",
        cardUser: "div.info a.name",
        cardContent: "div.feed_list_content",
        retweetedCards: "div.card-wrap div.card-comment",
        retweetedCardUser: "div.con a.name",
        comments: "div.card-review",
        commentUser: "div.content a.name",
        commentContent: "div.content div.txt",
        commentWrapper: "div.content div.txt"
      };
      const cards = {
        l: selector.cards,
        u: selector.cardUser,
        c: selector.cardContent
      };
      const comments = {
        l: selector.comments,
        u: selector.commentUser,
        c: selector.commentContent,
        w: selector.commentWrapper
      };
      const retweets = {
        l: selector.retweetedCards,
        u: selector.retweetedCardUser
      };
      this.modifyDom({
        locators: [cards, comments]
      });
      this.modifyDom({
        locators: [retweets, { l: cards.l, u: retweets.u }]
      });
    }
    async filterFeeds() {
      const cards = {
        l: "div.vue-recycle-scroller__item-view",
        u: "div.Feed_body_3R0rO a.ALink_default_2ibt1"
      };
      const comments = {
        l: "div.wbpro-list",
        u: "div.con1.woo-box-item-flex div.text a.ALink_default_2ibt1"
      };
      const replies = {
        l: "div.item2",
        u: "div.con2 a.ALink_default_2ibt1"
      };
      this.modifyDom({
        locators: [cards, comments, replies]
      });
    }
    async filterReplies() {
      const reply = document.querySelector("div.ReplyModal_scroll3_2kADQ");
      if (!reply) {
        return;
      }
      const comments = {
        l: "div.wbpro-list",
        u: "div.con1.woo-box-item-flex a.ALink_default_2ibt1"
      };
      const replies = {
        l: "div.vue-recycle-scroller__item-view",
        u: "div.con2 a.ALink_default_2ibt1"
      };
      this.modifyDom({
        locators: [comments, replies],
        doc: reply
      });
    }
    async filterDetailComments() {
      const comments = {
        l: "div.vue-recycle-scroller__item-view",
        u: "div.con1.woo-box-item-flex div.text a.ALink_default_2ibt1"
      };
      const replies = { l: "div.item2", u: "div.con2 a.ALink_default_2ibt1" };
      this.modifyDom({
        locators: [comments, replies]
      });
    }
    async hideTrends() {
      let trend = document.querySelector("div.main-side");
      if (trend) trend.style.display = "none";
      if (trend = document.querySelector("div.Main_side_i7Vti"))
        trend.style.display = "none";
    }
    async createRetweetButton() {
      this.removeElements([
        locator(
          "div.vue-recycle-scroller__item-view",
          "div.retweet.Feed_retweet_JqZJb a.ALink_default_2ibt1"
        )
      ]);
      this.injectButton({
        locators: [
          { l: "div.retweet.Feed_retweet_JqZJb", u: "a.ALink_default_2ibt1" }
        ]
      });
    }
    filterComments(comments) {
      return comments.reduce((filtered, comment) => {
        const myText = comment.text || "";
        const ngWordInMyText = this.inBlackList(
          { name: comment.user?.screen_name },
          myText
        );
        if (!ngWordInMyText) {
          filtered.push(comment);
        }
        return filtered;
      }, []);
    }
    filterStatuses(statuses) {
      return statuses.reduce((acc, cur) => {
        if (cur.user.following) {
          const myText = cur.text || "";
          const ngWordInMyText = this.inBlackList(
            { name: cur.user?.screen_name },
            myText
          );
          if (!ngWordInMyText) {
            if (cur.retweeted_status) {
              const oriText = cur.retweeted_status.text || "";
              const ngWordInOriText = this.inBlackList(
                { name: cur.retweeted_status?.user?.screen_name },
                oriText
              );
              if (ngWordInOriText) return acc;
            }
            acc.push(cur);
          }
        }
        return acc;
      }, []);
    }
    filterSearchBand(searchBands) {
      return searchBands.reduce((acc, cur) => {
        if (!this.inBlackList({ name: "" }, cur.word)) {
          acc.push(cur);
        }
        return acc;
      }, []);
    }
    onFriendTimeline(url, res) {
      if (url.includes("m.weibo.cn")) {
        res = res;
        res.data.statuses = this.filterStatuses(res.data.statuses);
      } else {
        res = res;
        res.statuses = this.filterStatuses(res.statuses);
      }
    }
    onSearchBand(url, res) {
      res.data.realtime = this.filterSearchBand(res.data.realtime);
    }
    onTrendsBand(url, res) {
      res.data.list = [];
    }
    hook_buildComments(url, res) {
      res.data = this.filterComments(res.data);
    }
  };
  __publicField(WeiboFilter, "host", "weibo.com");
  __decorateClass([
    reqHook(/female_version|rum\/events/)
  ], WeiboFilter.prototype, "mockRequests", 1);
  __decorateClass([
    reqHook(/log\/read/)
  ], WeiboFilter.prototype, "interceptRead", 1);
  __decorateClass([
    patternFilterFunc(/s\.weibo\.com/)
  ], WeiboFilter.prototype, "filterSearchResults", 1);
  __decorateClass([
    filterFunc
  ], WeiboFilter.prototype, "filterFeeds", 1);
  __decorateClass([
    patternFilterFunc(/weibo\.com\/\d+\//)
  ], WeiboFilter.prototype, "filterReplies", 1);
  __decorateClass([
    patternFilterFunc(/weibo\.com\/\d+/)
  ], WeiboFilter.prototype, "filterDetailComments", 1);
  __decorateClass([
    filterFunc
  ], WeiboFilter.prototype, "hideTrends", 1);
  __decorateClass([
    filterFunc
  ], WeiboFilter.prototype, "createRetweetButton", 1);
  __decorateClass([
    respHook(/friendstimeline/)
  ], WeiboFilter.prototype, "onFriendTimeline", 1);
  __decorateClass([
    respHook(/\/searchBand/)
  ], WeiboFilter.prototype, "onSearchBand", 1);
  __decorateClass([
    respHook(/getIndexBand/)
  ], WeiboFilter.prototype, "onTrendsBand", 1);
  __decorateClass([
    respHook(/\/buildComments/)
  ], WeiboFilter.prototype, "hook_buildComments", 1);
  WeiboFilter = __decorateClass([
    RegisterSubclass
  ], WeiboFilter);

  // src/filters/zhihu.ts
  var userFunc = (element) => {
    const href = element.getAttribute("href");
    return {
      id: href.split("/").at(-1),
      name: element.textContent
    };
  };
  var feedUserFunc = (e) => {
    const metaText = e.dataset.zaExtraModule;
    let id = "";
    if (metaText) {
      const meta = JSON.parse(metaText);
      id = meta?.card?.content?.author_member_hash_id;
    }
    const zop = e.dataset.zop;
    const name = JSON.parse(zop).authorName;
    return { id, name };
  };
  var ZhihuFilter = class extends WebsiteFilter {
    interceptAnalytics() {
      return Response.json({}, { status: 200 });
    }
    interceptTouch() {
      return Response.json({ success: true }, { status: 201 });
    }
    async filterComments() {
      const selector = {};
      const comments = {
        l: "div.css-18ld3w0 > div[data-id]",
        u: "div.css-jp43l4 a.css-10u695f",
        c: "div.css-jp43l4 div.CommentContent.css-1jpzztt"
      };
      const replies = {
        l: "div[data-id]",
        u: "a.css-10u695f",
        c: "div.CommentContent.css-1jpzztt"
      };
      this.modifyDom({
        locators: [comments, replies],
        nameFn: userFunc,
        contentFn: ZhihuFilter.contentFunc
      });
    }
    static contentFunc(element) {
      return element ? element.textContent + element.querySelector("img")?.getAttribute("alt") : "";
    }
    async filterAnswerComments() {
      const selector = {
        l: "div.css-16zdamy div[data-id]",
        u: "div.css-1tww9qq a.css-10u695f",
        c: "div.CommentContent.css-1jpzztt"
      };
      this.modifyDom({
        locators: [selector],
        nameFn: userFunc,
        contentFn: ZhihuFilter.contentFunc
      });
    }
    async filterSearch() {
      const answers = {
        l: "div.Card.SearchResult-Card",
        u: "b[data-first-child]",
        w: "h2.ContentItem-title"
      };
      this.modifyDom({
        locators: [answers],
        elementButtonFunc: ({ element, user, eid }) => {
          const btn = this.defaultButtonFunc({ element, user, eid });
          if (!btn) {
            return;
          }
          btn.style.display = "inline-block";
          return btn;
        }
      });
    }
    async filterAnswers() {
      const cards = {
        l: "div.Card.AnswerCard.css-0",
        u: "div.ContentItem.AnswerItem",
        c: ".RichText.ztext.CopyrightRichText-richText.css-1ygg4xu",
        w: "div.AuthorInfo.AnswerItem-authorInfo.AnswerItem-authorInfo--related div.AuthorInfo"
      };
      this.modifyDom({
        locators: [cards],
        nameFn: feedUserFunc
      });
      const answers = {
        l: "div.List-item",
        u: "div.ContentItem.AnswerItem",
        c: cards.c,
        w: cards.w
      };
      this.modifyDom({
        locators: [answers],
        nameFn: feedUserFunc
      });
    }
    async filterRecommends() {
      const selector = {};
      const cards = {
        l: "div.Card.TopstoryItem.TopstoryItem-isRecommend",
        u: "div.ContentItem.AnswerItem",
        c: "h2 div a",
        w: "h2 div"
      };
      this.modifyDom({
        locators: [cards],
        nameFn: feedUserFunc,
        elementButtonFunc: ({ element, user, eid }) => {
          const btn = this.defaultButtonFunc({ element, user, eid });
          if (!btn) {
            return;
          }
          btn.style.display = "inline-block";
          return btn;
        }
      });
    }
    hookComments(url, res) {
      const comments = res.data;
      res.data = comments.filter((comment) => {
        const id = comment.author.id;
        const name = comment.author.name;
        const content = comment.content;
        return !this.inBlackList({ id, name }, content);
      });
      res.data.forEach((comment) => {
        comment.childComments = comment.childComments?.filter((childComment) => {
          const { id, name } = childComment.author;
          const content = childComment.content;
          return !this.inBlackList({ id, name }, content);
        });
      });
    }
    hookAnswers(url, res) {
      const answers = res.data;
      res.data = answers.filter((answer) => {
        const id = answer.target?.author?.id;
        const name = answer.target?.author?.name;
        const content = answer.target?.content + answer.target.title ? answer.target.title : answer.target.question.title;
        return !this.inBlackList({ name, id }, content);
      });
    }
    hookRecommends(url, res) {
      const answers = res.data;
      res.data = answers.filter((answer) => {
        const id = answer.target?.author?.id;
        const name = answer.target.author.name;
        const content = answer.target?.content + answer.target.title ? answer.target.title : answer.target.question.title;
        return !this.inBlackList({ name, id }, content);
      });
    }
    interceptTrends(url, res) {
      res.preset_words.words = [];
    }
    interceptHotList(url, res) {
      res.data = [];
      res.display_num = 0;
      res.display_first = false;
    }
    interceptRecommends(url, res) {
      res.data = [];
    }
  };
  __publicField(ZhihuFilter, "host", "zhihu.com");
  __decorateClass([
    reqHook(/zhihu-web-analytics|datahub|apm/)
  ], ZhihuFilter.prototype, "interceptAnalytics", 1);
  __decorateClass([
    reqHook(/lastread\/touch/)
  ], ZhihuFilter.prototype, "interceptTouch", 1);
  __decorateClass([
    filterFunc
  ], ZhihuFilter.prototype, "filterComments", 1);
  __decorateClass([
    filterFunc
  ], ZhihuFilter.prototype, "filterAnswerComments", 1);
  __decorateClass([
    patternFilterFunc(/zhihu\.com\/search/)
  ], ZhihuFilter.prototype, "filterSearch", 1);
  __decorateClass([
    patternFilterFunc(/question\/\d+/)
  ], ZhihuFilter.prototype, "filterAnswers", 1);
  __decorateClass([
    patternFilterFunc(/zhihu\.com\/$/)
  ], ZhihuFilter.prototype, "filterRecommends", 1);
  __decorateClass([
    respHook(/\/root_comment|\/child_comment/)
  ], ZhihuFilter.prototype, "hookComments", 1);
  __decorateClass([
    respHook(/questions\/\d+\/feeds/)
  ], ZhihuFilter.prototype, "hookAnswers", 1);
  __decorateClass([
    respHook(/feed\/topstory\/recommend/)
  ], ZhihuFilter.prototype, "hookRecommends", 1);
  __decorateClass([
    respHook(/search\/preset_words/)
  ], ZhihuFilter.prototype, "interceptTrends", 1);
  __decorateClass([
    respHook(/feed\/topstory\/hot-lists/)
  ], ZhihuFilter.prototype, "interceptHotList", 1);
  __decorateClass([
    respHook(/recommend_follow_people/)
  ], ZhihuFilter.prototype, "interceptRecommends", 1);
  ZhihuFilter = __decorateClass([
    RegisterSubclass
  ], ZhihuFilter);

  // src/main.ts
  async function main() {
    const filterClass = WebsiteFilter.fromHost();
    await DomainStore.init(filterClass.filterKey);
    const controller = new MainView(new filterClass());
    controller.render();
  }
  main();
})();
