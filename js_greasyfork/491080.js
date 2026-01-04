// ==UserScript==
// @name         boss外包提示
// @namespace    外包提示
// @version      0.0.3
// @author       HJ
// @description  外包太多啦，给点提示，看看情况。
// @license      GPL License
// @icon         ./src/assets/logo.svg
// @match        https://www.zhipin.com/*
// @require      https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js
// @connect      constant.site
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/491080/boss%E5%A4%96%E5%8C%85%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/491080/boss%E5%A4%96%E5%8C%85%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .add{position:fixed;bottom:100px;left:50px}.isShowCellBtn{position:fixed;bottom:70px;left:50px}.wbTag{right:0;top:0;color:red;position:absolute}.dialog{position:fixed;top:180px;left:300px;display:flex;flex-direction:column;z-index:999;align-items:center;justify-content:center;height:300px;width:600px;background:azure}.namaList{display:flex;flex-wrap:wrap;padding:10px}.item{padding:8px}.closeBtn{position:absolute;right:0;top:0} ");

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
  var client = {};
  var m = require$$0$1;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  var _GM_addElement = /* @__PURE__ */ (() => typeof GM_addElement != "undefined" ? GM_addElement : void 0)();
  var _GM_log = /* @__PURE__ */ (() => typeof GM_log != "undefined" ? GM_log : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _monkeyWindow = /* @__PURE__ */ (() => window)();
  function Dialog(props) {
    const [input, setInput] = require$$0.useState("");
    function addName() {
      if (input == "")
        return;
      _GM_xmlhttpRequest({
        method: "GET",
        url: `https://www.constant.site/api/boss/ins?name=${input}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        onload: function(response) {
          props.onSetStateMethod();
          props.hiddenDialgo();
        }
      });
    }
    function closeDialog() {
      props.hiddenDialgo();
    }
    console.log("wbs==", props.wbs);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "namaList", children: props.wbs.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "item", children: item }, index)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: closeDialog, className: "closeBtn", children: "关闭" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: addName, children: "添加" })
      ] })
    ] });
  }
  function App() {
    const wbsArr = ["中电金信", "法本信息", "法本", "润和软件", "汉堂", "博彦科技", "博彦科技承德有限公司", "上海瀚若轩公司", "中软国际", "软通动力", "诚迈电力信息", "诚迈科技", "华成峰科技", "善智互联", "小拉科技", "武汉佰钧成技术"];
    const [wbs, setWbs] = require$$0.useState(wbsArr);
    const [isShowDialog, setIsShowDialog] = require$$0.useState(false);
    const [isShowCell, setIsShowCell] = require$$0.useState(true);
    function refresh() {
      _GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.constant.site/api/boss/get",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        onload: function(response) {
          _GM_log("GM_xmlhttpRequest-----", JSON.parse(response.responseText));
          const data = JSON.parse(response.responseText);
          let arr = [];
          if (data && data.data) {
            data.data.forEach((item) => {
              arr.push(item.name);
            });
            setWbs(arr);
            setWBsState(wbs);
          } else {
            setWBsState(wbs);
          }
        }
      });
    }
    function setWBsState(wbs2) {
      Array.from(document.querySelectorAll(".job-list-box .job-card-wrapper")).filter((node) => {
        const company = node.querySelector(".company-name");
        const companyname = node.querySelector(".company-name a");
        const body = node.querySelector(".job-card-body");
        const footer = node.querySelector(".job-card-footer");
        if (company == null || company == void 0)
          return;
        if ((companyname == null ? void 0 : companyname.textContent) == null || (companyname == null ? void 0 : companyname.textContent) == void 0)
          return;
        if (wbs2.includes(companyname == null ? void 0 : companyname.textContent)) {
          if (!isShowCell) {
            if (body !== null)
              body.style.display = "none";
            if (footer !== null)
              footer.style.display = "none";
          } else {
            if (body !== null)
              body.style.display = "block";
            if (footer !== null)
              footer.style.display = "block";
            const isHave = node.querySelector(".company-name div");
            if ((isHave == null ? void 0 : isHave.textContent) !== "外包") {
              const tag = _GM_addElement(company, "div", { textContent: "外包" });
              tag.style.position = "absolute";
              tag.style.background = "red";
              tag.style.right = "0";
              tag.style.top = "0";
              tag.style.padding = "9px";
              tag.style.borderRadius = "12px";
              tag.style.color = "white";
            }
          }
        }
      });
    }
    function addListener() {
      if (_monkeyWindow.onurlchange === null) {
        _monkeyWindow.addEventListener("urlchange", (info) => {
          if (info && info.url != "") {
            setTimeout(() => {
              setWBsState(wbs);
            }, 2e3);
          }
        });
      }
    }
    require$$0.useEffect(() => {
      refresh();
      addListener();
    }, []);
    function hiddenOrShowWB() {
      setIsShowCell(!isShowCell);
      setWBsState(wbs);
    }
    function showDialog() {
      setIsShowDialog(true);
    }
    function hiddenDialog() {
      setIsShowDialog(false);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "App", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "add", onClick: showDialog, children: "添加外包公司名称" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "isShowCellBtn", onClick: hiddenOrShowWB, children: isShowCell ? "隐藏外包" : "展示" }),
      isShowDialog ? /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { wbs, onSetStateMethod: refresh, hiddenDialgo: hiddenDialog }) : null
    ] });
  }
  client.createRoot(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  ).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(require$$0.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
  );

})((React.default=React,React), (ReactDOM.default=ReactDOM,ReactDOM));