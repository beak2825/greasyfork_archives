// ==UserScript==
// @name         fxxk-tree-hole
// @namespace    xiaotianxt/fxxk-tree-hole
// @version      0.0.2
// @author       monkey
// @description  优化北大树洞无限滚动，收藏搜索，页面展示等
// @icon         https://treehole.pku.edu.cn/web/favicon.ico
// @match        *://treehole.pku.edu.cn/web/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/490115/fxxk-tree-hole.user.js
// @updateURL https://update.greasyfork.org/scripts/490115/fxxk-tree-hole.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const e=document.createElement("style");e.textContent=o,document.head.append(e)})(" #copy-indicator{display:none;color:#8ae}code:has(#copy-indicator){position:relative;cursor:pointer;text-decoration:underline;color:#9bf;-webkit-user-select:none;user-select:none}code:has(#copy-indicator):hover #copy-indicator{display:block;background:#fff;padding:1px;border-radius:2px;position:absolute;top:-1.2rem;z-index:10000}.box-header-top-icon:has(#copy-indicator){overflow:unset} ");

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  const c = (t, e) => (e ?? document).querySelector(t), S = async (t, e) => c(t, e) ? c(t, e) : new Promise((n) => {
    const o = new MutationObserver(() => {
      c(t, e) && (o.disconnect(), n(c(t, e)));
    });
    o.observe(document, { childList: true, subtree: true });
  });
  const LS_KEY = "NEVERGONNAGIVEYOUUP";
  class Log {
    constructor() {
      __publicField(this, "map");
      __publicField(this, "maxPid", -1);
      const jsonData = localStorage.getItem(LS_KEY) || "[]";
      this.map = new Map(JSON.parse(jsonData));
    }
    replace(data, pid) {
      var _a;
      const threads = ((_a = data == null ? void 0 : data.data) == null ? void 0 : _a.data) || [];
      if (!threads.length) {
        if (pid && this.map.has(Number(pid))) {
          threads.splice(0, 0, this.map.get(Number(pid)));
        }
        return data;
      }
      threads.forEach((t) => this.map.set(t.pid, t));
      this.save();
      let i = 0;
      let j = threads[0].pid;
      while (i < threads.length) {
        const thread = threads[i];
        if (thread.pid != j) {
          if (this.map.has(j)) {
            const recoveredThread = this.map.get(j);
            recoveredThread.text = "[⚠️被删除的树洞]" + recoveredThread.text;
            threads.splice(i, 0, recoveredThread);
          } else {
            threads.splice(i, 0, {
              ...thread,
              pid: j,
              text: "⚠️ 本树洞被删除了",
              reply: "NaN",
              likenum: "NaN"
            });
          }
          j -= 1;
          i += 1;
          continue;
        }
        j -= 1;
        i += 1;
      }
      return data;
    }
    async save() {
      console.log(JSON.stringify(Array.from(this.map)));
      localStorage.setItem(LS_KEY, JSON.stringify(Array.from(this.map)));
    }
  }
  const log = new Log();
  (async () => {
    function registerInfiniteScrollInjection() {
      const observer = new MutationObserver((mutations, _) => {
        var _a, _b;
        const drawer = (_b = (_a = mutations.find(
          (item) => {
            var _a2;
            return ((_a2 = item.addedNodes) == null ? void 0 : _a2[0]) && item.addedNodes[0].isSameNode(app.childNodes[2]);
          }
        )) == null ? void 0 : _a.addedNodes) == null ? void 0 : _b[0];
        if (!drawer)
          return;
        const infiniteScrollContainer = drawer.querySelector(".sidebar-content");
        if (!infiniteScrollContainer)
          return;
        infiniteScrollContainer.setAttribute("infinite-scroll-distance", "1000");
      });
      observer.observe(app, {
        childList: true
      });
      const originalGetById = document.getElementById;
      document.getElementById = (elementId) => {
        if (elementId == "table_list") {
          const tableList = originalGetById.apply(document, [
            elementId
          ]);
          return new Proxy(tableList, {
            get(obj, p) {
              if (p === "offsetHeight")
                return obj.offsetHeight - 950;
              return obj[p];
            }
          });
        }
        return originalGetById.apply(document, [elementId]);
      };
    }
    function registerCopyThread() {
      const copyLabel = document.createElement("div");
      copyLabel.id = "copy-indicator";
      copyLabel.innerText = "复制树洞";
      const observer = new MutationObserver(async (mutations, _) => {
        var _a, _b;
        const drawer = (_b = (_a = mutations.find(
          (item) => {
            var _a2;
            return ((_a2 = item.addedNodes) == null ? void 0 : _a2[0]) && item.addedNodes[0].isSameNode(app.childNodes[2]);
          }
        )) == null ? void 0 : _a.addedNodes) == null ? void 0 : _b[0];
        if (!drawer)
          return;
        const element = await S(".box-id", drawer);
        element.appendChild(copyLabel);
        element.addEventListener("click", () => {
        });
      });
      observer.observe(app, {
        childList: true
      });
    }
    function undoDelete() {
      const originalSend = XMLHttpRequest.prototype.send;
      Object.defineProperty(XMLHttpRequest.prototype, "_response", {
        writable: true
      });
      XMLHttpRequest.prototype.send = function(body) {
        this.onreadystatechange = () => {
          const url = new URL(this.responseURL, window.location.href);
          if (!/\/api\/pku_hole/.test(url.pathname))
            return;
          if (this.readyState === 4 && this.status === 200) {
            Object.defineProperty(this, "responseText", {
              get: function() {
                let modifiedData;
                try {
                  const originalData = JSON.parse(this._response);
                  modifiedData = log.replace(
                    originalData,
                    url.searchParams.get("pid")
                  );
                } catch (e) {
                  console.error("解析JSON数据出错:", e);
                  modifiedData = this._response;
                }
                return JSON.stringify(modifiedData);
              }
            });
          }
        };
        const originalOnload = this.onload;
        this.onload = (e) => {
          if (this.response) {
            this._response = this.response;
          }
          if (originalOnload) {
            originalOnload.call(this, e);
          }
        };
        originalSend.call(this, body);
      };
    }
    undoDelete();
    const app = await S("#eagleMapContainer");
    (await S(".icon-refresh")).click();
    registerCopyThread();
    registerInfiniteScrollInjection();
  })();

})();