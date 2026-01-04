// ==UserScript==
// @name       boss直聘自动沟通助手
// @namespace  npm/vite-plugin-monkey
// @version      0.0.2
// @author     monkey
// @icon       https://vitejs.dev/logo.svg
// @match      https://www.zhipin.com/*
// @require    http://code.jquery.com/jquery-2.1.1.min.js
// @require    https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/core-js/3.21.1/minified.min.js
// @require    https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
// @require    https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js
// @grant      GM_xmlhttpRequest
// @grant      window.close
// @description boss直聘辅助沟通助手
// @downloadURL https://update.greasyfork.org/scripts/464791/boss%E7%9B%B4%E8%81%98%E8%87%AA%E5%8A%A8%E6%B2%9F%E9%80%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/464791/boss%E7%9B%B4%E8%81%98%E8%87%AA%E5%8A%A8%E6%B2%9F%E9%80%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(e=>{const o=document.createElement("style");o.dataset.source="vite-plugin-monkey",o.innerText=e,document.head.appendChild(o)})(" .boss-container{--background-color: orange;--font-color: #fff;position:fixed;left:50px;bottom:150px;display:flex;flex-direction:column;align-items:center;gap:10px;z-index:999}.boss-conversation-container .button{color:var(--font-color);background:var(--background-color);border:none;border-radius:5px;padding:6px 5px}.boss-conversation-setting{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:400px;height:400px;background:#eef;z-index:9999}.boss-conversation-container .multiple-publish{padding:5px;border-radius:5px} ");

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function(require$$0, require$$0$1) {
  "use strict";
  var jsxRuntimeExports = {};
  var jsxRuntime = {
    get exports() {
      return jsxRuntimeExports;
    },
    set exports(v) {
      jsxRuntimeExports = v;
    }
  };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a)
      m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps)
      for (b in a = c.defaultProps, a)
        void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  (function(module) {
    {
      module.exports = reactJsxRuntime_production_min;
    }
  })(jsxRuntime);
  var client = {};
  var m = require$$0$1;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  const isNil = (input) => {
    return input == null;
  };
  const composeArrayToRegExp = (list) => {
    const regexStr = list.reduce((prev, cur, index2) => {
      prev += cur;
      if (index2 < list.length - 1) {
        prev += "|";
      }
      return prev;
    }, "");
    return new RegExp(regexStr);
  };
  class CheckPage {
    static isDetail() {
      const conversationBtn = document.querySelector(".btn-container>.btn-startchat");
      return !isNil(conversationBtn) || /job_detail/.test(location.pathname);
    }
    static isList() {
      const reg = composeArrayToRegExp(["geek/recommend", "geek/job"]);
      return reg.test(location.pathname);
    }
  }
  const localStorageConfigKey = "conversation_config";
  const initialConfig = {
    concurrentLimit: 2,
    maxLimit: 30,
    executeInterval: 1e4,
    targetList: ["[Rr]eact"],
    excludeList: ["985", "211", "硕士"],
    automation: false,
    idleMap: {}
  };
  class Config {
    constructor() {
      __publicField(this, "config", {});
      this.syncReadData();
    }
    syncReadData() {
      const dataStr = localStorage.getItem(localStorageConfigKey);
      if (isNil(dataStr)) {
        this.config = initialConfig;
        return;
      }
      try {
        this.config = JSON.parse(dataStr);
      } catch (error) {
        console.error(error);
      }
    }
    syncWriteData() {
      localStorage.setItem(localStorageConfigKey, JSON.stringify(this.config));
    }
  }
  class Polling {
    constructor(polling, ms) {
      __publicField(this, "timer");
      this.polling = polling;
      this.ms = ms;
    }
    togglePolling() {
      this.polling = !this.polling;
    }
    startPolling() {
      this.polling = true;
    }
    stopPolling() {
      this.polling = false;
    }
    get status() {
      return this.polling;
    }
    clear() {
      const fn = window.clearInterval;
      fn(this.timer);
    }
    start(callback) {
      const fn = window.setInterval;
      fn(() => {
        callback();
      }, this.ms);
    }
  }
  class Conversation {
    constructor() {
      __publicField(this, "polling", {});
      __publicField(this, "setting", {});
      __publicField(this, "maxLimit", 0);
      this.init();
    }
    init() {
      this.setting = new Config();
      this.polling = new Polling(this.setting.config.automation, this.setting.config.executeInterval);
      this.maxLimit = this.setting.config.maxLimit;
      this.polling.status && this.start();
    }
    executeIdleQueue() {
      if (this.setting.config.maxLimit <= 0) {
        this.polling.clear();
        this.setting.config.maxLimit = this.maxLimit;
        this.setting.syncWriteData();
        return;
      }
      if (Object.values(this.setting.config.idleMap).filter((v) => !v.status).length === 0) {
        this.polling.status && this.navigateNextPage();
        this.polling.clear();
        return;
      }
      for (let i = 0; i < this.setting.config.concurrentLimit; i++) {
        const url = Object.entries(this.setting.config.idleMap).filter((v) => !v[1].status).pop();
        if (url) {
          this.setting.config.idleMap[url[0]].status = true;
          url && window.open(url[0]);
        }
      }
      this.setting.syncWriteData();
    }
    start() {
      this.polling.start(() => {
        this.setting.syncReadData();
        this.addJobTask();
        this.executeIdleQueue();
      });
    }
    addJobTask() {
      const list = document.querySelectorAll(".job-list-box>li a.job-card-left");
      list.forEach((el) => {
        if (isNil(this.setting.config.idleMap[el.href])) {
          this.setting.config.idleMap[el.href] = {
            status: false
          };
        }
      });
    }
    navigateNextPage() {
      var _a;
      let search = "";
      const pageReg = /(page)=([0-9])+/;
      const hasSearchParam = location.search.length !== 0;
      const pageNo = parseInt(((_a = pageReg.exec(location.search)) == null ? void 0 : _a[2]) || "1") + 1;
      if (/page=[0-9]+/.test(location.search)) {
        search = location.search.replace(pageReg, `$1=${pageNo}`);
      } else {
        search = location.search + `${hasSearchParam ? "&" : "?"}page=${pageNo}`;
      }
      const newUrl = `${location.origin}${location.pathname}${search}`;
      window.location.href = newUrl;
    }
  }
  function MultiplePublishButton() {
    const publish = () => {
      new Conversation().start();
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button", onClick: publish, children: "一键投递" });
  }
  function Automation() {
    var _a;
    const conversation = require$$0.useRef();
    require$$0.useEffect(() => {
      conversation.current = new Conversation();
    }, []);
    const togglePolling = () => {
      if (conversation.current) {
        conversation.current.polling.togglePolling();
        conversation.current.setting.config.automation = conversation.current.polling.status;
        conversation.current.setting.syncWriteData();
        conversation.current.polling.status && conversation.current.start();
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button", onClick: togglePolling, children: ((_a = conversation.current) == null ? void 0 : _a.polling.status) ? "关闭自动轮询" : "开启自动轮询" });
  }
  const useBoolean = (initialValue = false) => {
    const [visible, setVisible] = require$$0.useState(initialValue);
    const action = {
      setFalse() {
        setVisible(false);
      },
      setTrue() {
        setVisible(true);
      },
      toggle() {
        setVisible(!visible);
      },
      set(value) {
        setVisible(value);
      }
    };
    return [visible, action];
  };
  function TextRegion(props) {
    const { type } = props;
    const [value, setValue] = require$$0.useState();
    const save = (e) => {
      const config = new Config();
      const values = e.currentTarget.value.split(",");
      if (type === "target") {
        config.config.targetList = values;
      } else if (type === "exclude") {
        config.config.excludeList = values;
      }
    };
    const input = (e) => {
      setValue(e.target.value);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h5", { children: [
        type,
        ":"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { onInput: input, value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: save, children: "保存" })
    ] });
  }
  function Setting() {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "boss-conversation-setting", children: [
      "设置",
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextRegion, { type: "target" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextRegion, { type: "exclude" })
    ] });
  }
  function SettingButton() {
    const [visible, { toggle }] = useBoolean();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "button",
          onClick: () => {
            toggle();
          },
          children: "设置"
        }
      ),
      visible && require$$0$1.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx(Setting, {}), document.body)
    ] });
  }
  function ConversationContainer() {
    if (!CheckPage.isList()) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {});
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "boss-container boss-conversation-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MultiplePublishButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Automation, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingButton, {})
    ] });
  }
  function App() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ConversationContainer, {});
  }
  const index = "";
  client.createRoot(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  ).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(require$$0.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
  );
  class Publish {
    constructor() {
      __publicField(this, "mountedTimer");
      __publicField(this, "setting", {});
      this.start();
      this.setting = new Config();
    }
    checkCondition() {
      const target = document.querySelector(".job-sec-text");
      if (isNil(target)) {
        return false;
      }
      const result = composeArrayToRegExp(this.setting.config.targetList).test(target.textContent);
      const exclude = composeArrayToRegExp(this.setting.config.excludeList).test(target.textContent);
      return result && !exclude;
    }
    publish() {
      if (this.setting.config.maxLimit <= 0) {
        return;
      }
      const link = document.querySelector(".btn-container>.btn-startchat");
      if (link) {
        link.click();
        this.setting.config.automation && this.setting.config.maxLimit--;
        this.setting.syncWriteData();
      } else {
        console.log("没有找到沟通按钮");
        window.close();
      }
    }
    start() {
      this.mountedTimer = window.setInterval(() => {
        if (!this.checkCondition()) {
          window.close();
          clearInterval(this.mountedTimer);
          return;
        }
        const conversationBtn = document.querySelector(".btn-container>.btn-startchat");
        const leftTitleEl = document.querySelector(".left-title");
        const dialogEl = document.querySelector(".dialog-container");
        if (!CheckPage.isDetail()) {
          clearInterval(this.mountedTimer);
          window.close();
          return;
        }
        this.publish();
        if (dialogEl || leftTitleEl || conversationBtn.textContent === "继续沟通") {
          clearInterval(this.mountedTimer);
          window.close();
        }
      }, 3e3);
    }
  }
  CheckPage.isDetail() && new Publish().start();
})(React, ReactDOM);
