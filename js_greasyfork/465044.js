// ==UserScript==
// @name         哔站倍速插件
// @namespace    github/roo12589
// @version      1.5
// @author       roo12589
// @description  哔站播放视频倍速,支持按钮、键盘X,C及滚轮控制
// @icon         https://github.com/roo12589/my-monkey-scripts/blob/master/assets/bili-favicon.ico?raw=true
// @match        *://*.bilibili.com/video/*
// @require      https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/465044/%E5%93%94%E7%AB%99%E5%80%8D%E9%80%9F%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/465044/%E5%93%94%E7%AB%99%E5%80%8D%E9%80%9F%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(t=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=t,document.head.append(e)})(" #bili-speed-app button{outline:0;padding:2px;margin-left:5px;background-color:#f4f4f4;border:0;color:#222;cursor:pointer;border-radius:10%}#current-speed-btn{transition:all .2s ease-in-out;border:0!important;background-color:#ffafc9!important;color:#fff!important;width:40px}.video-speed-box{width:100%;height:28px;display:flex;justify-content:flex-end;align-items:flex-start}#current-speed-btn:hover{transform:scale(1.5);transform-origin:50% 100%;border-radius:6px}.plugin-notification{min-width:100px;height:50px;line-height:50px;border-radius:10px;background:rgba(31,14,14,.452);color:#e9e8e8e8;font-size:24px;position:absolute;left:10%;top:10%;text-align:center;display:none;justify-content:center;align-items:center}.plugin-notification.show{display:block} ");

(function (require$$0, require$$0$1) {
  'use strict';

  var jsxRuntime = { exports: {} };
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
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  const jsx = jsxRuntimeExports.jsx;
  const jsxs = jsxRuntimeExports.jsxs;
  var client = {};
  var m = require$$0$1;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  function App() {
    var _a, _b, _c;
    initStorage();
    const bindHistoryEvent = function(type) {
      const historyEvent = history[type];
      return function() {
        const newEvent = historyEvent.apply(this, arguments);
        const e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return newEvent;
      };
    };
    history.pushState = bindHistoryEvent("pushState");
    history.replaceState = bindHistoryEvent("replaceState");
    window.addEventListener("pushState", () => {
      resetVideoSpeed();
    });
    const videoSpeedList = ((_a = localStorage.getItem("bsw-speed-list")) == null ? void 0 : _a.split(",").filter((i) => i !== "").map(parseFloat)) || [1, 2, 3, 1.2, 1.3, 1.5, 1.8, 2.3, 2.5, 2.8];
    const length = videoSpeedList.length;
    let splitIndex;
    if (length % 2 === 0)
      splitIndex = Math.floor(length / 2) - 1;
    else
      splitIndex = Math.floor(length / 2);
    const videoSpeedListTop = videoSpeedList.slice(0, splitIndex);
    const videoSpeedListBottom = videoSpeedList.slice(splitIndex);
    _GM_registerMenuCommand("倍速列表", function() {
      var value = prompt("请输入倍速:(英文逗号隔开)", videoSpeedList.toString());
      if (value !== null) {
        localStorage.setItem("bsw-speed-list", value);
        createNoti(`已添加,刷新后生效`);
      }
    });
    const nameWhiteList = ((_b = localStorage.getItem("bsw-name-white-list")) == null ? void 0 : _b.split(",")) || [];
    _GM_registerMenuCommand("白名单列表", function() {
      var value = prompt("播放白名单up主的视频时,不自动倍速:(英文逗号隔开)", nameWhiteList.toString());
      if (value !== null) {
        localStorage.setItem("bsw-name-white-list", value);
        createNoti(`已添加,目前共${value.split(",").length}个,刷新后生效`);
      }
    });
    var videoSpeedBack;
    var isOpen = true;
    const username = (_c = document.querySelector(".up-info_right .username")) == null ? void 0 : _c.innerText;
    const usernameCombined = new Array().concat(document.querySelectorAll(".up-card .name-text")).map((el) => el.innerText).toString();
    for (const name of nameWhiteList) {
      if ((username == null ? void 0 : username.match(name)) || (usernameCombined == null ? void 0 : usernameCombined.match(name))) {
        isOpen = false;
        break;
      }
    }
    document.onkeydown = function(e) {
      if (e.target.type === "text" || e.target.type === "textarea")
        return;
      let speed = getSpeed() || 1;
      let ev = e || window.event;
      if (ev.key === "z") {
        if (isOpen) {
          isOpen = false;
          videoSpeedBack = getSpeed();
          changeVideoSpeed(1, false);
        } else {
          isOpen = true;
          changeVideoSpeed(videoSpeedBack);
          videoSpeedBack = void 0;
        }
      }
      if (ev.key === "c") {
        changeVideoSpeed((speed * 10 + 1) / 10);
        return false;
      } else if (ev.key === "x") {
        changeVideoSpeed((speed * 10 - 1) / 10);
        return false;
      }
    };
    window.onload = function() {
      resetVideoSpeed();
    };
    function changeVideoSpeed(x, save = true) {
      const min = 0.1, max = 16;
      if (x > max || x < min)
        return;
      const playerSpeedButton = document.querySelector(".bilibili-player-video-btn-speed-name");
      let speed;
      if (typeof x == "number") {
        speed = x;
      } else if (typeof x == "string") {
        speed = parseFloat(x);
      } else {
        speed = parseFloat(x.target.innerHTML.replace("x", ""));
      }
      if (save) {
        localStorage.setItem("bsw-current-speed", speed);
      }
      document.querySelector("#current-speed-btn").innerHTML = save ? "x" + speed : "关闭";
      let videoObj = document.querySelector("video");
      if (!videoObj)
        videoObj = document.querySelector("bwp-video");
      if (videoObj) {
        videoObj.playbackRate = speed;
        console.log(videoObj.playbackRate);
        playerSpeedButton && (playerSpeedButton.innerText = save ? speed + "x" : "关闭");
      }
      createNoti(save ? getSpeed().toFixed(1) : "关闭");
    }
    function resetVideoSpeed() {
      let count = 0;
      const timer2 = setInterval(() => {
        let videoObj = document.querySelector("video") || document.querySelector("bwp-video");
        console.log("等待加载播放器...");
        if (videoObj) {
          if (isOpen) {
            videoObj.playbackRate = getSpeed();
          } else {
            videoSpeedBack = getSpeed();
            changeVideoSpeed(1, false);
          }
          console.log("已加载", videoObj.playbackRate);
          coverTitle();
          clearInterval(timer2);
        }
        count++;
        if (count >= 10) {
          clearInterval(timer2);
          createNoti("获取播放器组件超时");
        }
      }, 1e3);
    }
    let timer;
    function createNoti(message) {
      if (timer)
        clearTimeout(timer);
      if (!window.pluginNotification) {
        let div = document.createElement("div");
        div.className = "plugin-notification";
        window.pluginNotification = div;
        div.appendChild(document.createTextNode(message));
        const ele = document.querySelector(".bpx-player-video-wrap") || document.querySelector("#playerWrap") || document.body;
        ele && ele.appendChild(div);
      } else {
        window.pluginNotification.className = "plugin-notification show";
        window.pluginNotification.innerText = message;
      }
      timer = setTimeout(function() {
        window.pluginNotification.className = "plugin-notification";
      }, 1300);
    }
    function coverTitle() {
      let OnP = document.querySelector(".list-box>.on>a");
      let Title = document.querySelector(".video-info .video-title .tit");
      if (OnP && OnP.getAttribute("title")) {
        let OnPName = OnP.getAttribute("title");
        let docTitle = document.querySelector("head>title");
        docTitle.innerHTML = OnPName;
        Title.innerHTML = OnPName;
      }
      let progresses = document.querySelectorAll(".bui-bar-wrap>.bui-bar-normal");
      progresses.forEach((ele) => ele.style.background = "#FFAFC9");
    }
    function getSpeed() {
      return parseFloat(parseFloat(localStorage.getItem("bsw-current-speed") || "1").toFixed(1));
    }
    function initStorage() {
      if (!localStorage.getItem("bsw-name-white-list")) {
        localStorage.setItem("bsw-name-white-list", ["戒社", "罗翔"].toString());
      }
    }
    const switchStatus = () => {
      if (isOpen) {
        isOpen = false;
        videoSpeedBack = getSpeed();
        changeVideoSpeed(1, false);
      } else {
        isOpen = true;
        changeVideoSpeed(videoSpeedBack);
        videoSpeedBack = void 0;
      }
    };
    const changeSpeedByMouse = (e) => {
      let speed = getSpeed();
      const playerSpeedButton = document.querySelector(".bilibili-player-video-btn-speed-name");
      e.preventDefault();
      if (e.deltaY) {
        if (e.deltaY > 0) {
          playerSpeedButton && (playerSpeedButton.innerText = speed + "x");
          changeVideoSpeed((speed * 10 - 1) / 10);
        } else {
          playerSpeedButton && (playerSpeedButton.innerText = speed + "x");
          changeVideoSpeed((speed * 10 + 1) / 10);
        }
      }
    };
    let currentSpeedBtn = /* @__PURE__ */ jsx(
      "button",
      {
        id: "current-speed-btn",
        onClick: switchStatus,
        ref: (el) => {
          if (el) {
            el.addEventListener(
              "wheel",
              (e) => {
                changeSpeedByMouse(e);
              },
              { passive: false }
            );
          }
        },
        children: "x" + getSpeed()
      }
    );
    let videoTop = /* @__PURE__ */ jsxs("div", { className: "video-speed-box", id: "video-speed-box-top", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        " ",
        currentSpeedBtn,
        " "
      ] }),
      videoSpeedListTop.map((speed) => /* @__PURE__ */ jsx("button", { id: "btn-" + speed, style: { width: "40px" }, onClick: changeVideoSpeed, children: "x" + speed }, "btn-" + speed))
    ] });
    let videoBottom = /* @__PURE__ */ jsx("div", { className: "video-speed-box", id: "video-speed-box-bottom", children: videoSpeedListBottom.map((speed) => /* @__PURE__ */ jsx("button", { id: "btn-" + speed, style: { width: "40px" }, onClick: changeVideoSpeed, children: "x" + speed }, "btn-" + speed)) });
    const app = /* @__PURE__ */ jsxs(
      "div",
      {
        id: "bili-speed-app",
        style: {
          position: "relative",
          top: "-13.5px",
          right: 0,
          width: "1000px"
        },
        children: [
          videoTop,
          videoBottom
        ]
      }
    );
    return app;
  }
  client.createRoot(
    (() => {
      var _a;
      const app = document.createElement("div");
      const viewReportDiv = ((_a = document == null ? void 0 : document.querySelector("#viewbox_report")) == null ? void 0 : _a.querySelector(".video-data:last-child")) || document.querySelector(".s_form_wrapper");
      viewReportDiv && viewReportDiv.appendChild(app);
      return app;
    })()
  ).render(
    /* @__PURE__ */ jsx(require$$0.StrictMode, { children: /* @__PURE__ */ jsx(App, {}) })
  );

})(React, ReactDOM);
