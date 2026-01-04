// ==UserScript==
// @name         youtube-short-to-long
// @namespace    npm/vite-plugin-monkey
// @version      1.1.2
// @author       hzx
// @description  youtube auto short video jmp to long video
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/537457/youtube-short-to-long.user.js
// @updateURL https://update.greasyfork.org/scripts/537457/youtube-short-to-long.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .mask{position:absolute;width:100%;height:100%;background-color:transparent;top:0;right:0;left:0;bottom:0;cursor:pointer} ");

(function () {
  'use strict';

  const CornMenuManager = /* @__PURE__ */ (() => {
    const LOG_TAG = "CornMenuManager: ";
    let isLog = true;
    const callStack = [];
    function getCallStackString() {
      const sep = "\n	";
      return `callback:${sep}` + callStack.join(sep);
    }
    function log(msg, logMethod = console.log) {
      if (isLog) {
        logMethod(LOG_TAG + msg + "\n" + getCallStackString());
      }
    }
    function logError(msg) {
      log(msg, console.error);
    }
    function logWarn(msg) {
      log(msg, console.warn);
    }
    function logWrapper(fnName, fn) {
      return () => {
        callStack.push(fnName);
        const result = fn(fnName);
        callStack.pop();
        return result;
      };
    }
    function logWrapperAndCall(fnName, fn) {
      return logWrapper(fnName, fn)();
    }
    function isSwitchEntry(item) {
      return item && item.on && item.off;
    }
    const list = [];
    const idArr = [];
    const STORE_TAG = "MENU_MANAGER_STORE_TAG.";
    function setValue(key, value) {
      localStorage.setItem(STORE_TAG + key, value);
    }
    function getValue(key) {
      return localStorage.getItem(STORE_TAG + key);
    }
    function saveSwitchBooleanState(entry, state) {
      setValue(getEntryName(entry), state);
    }
    function getSwitchBooleanState(entry) {
      const storeValue = getValue(getEntryName(entry));
      if (storeValue === null) {
        return null;
      }
      return storeValue === "true";
    }
    function getEntryName(entry) {
      return entry["name"] || entry["on"]["name"] + entry["off"]["name"];
    }
    function addEntry(entry) {
      logWrapper("addEntry(entry)", (fnName) => {
        if (!(typeof entry === "object")) {
          logError(`${fnName}: 请传入正确的 Menu Entry`);
          return;
        }
        if (!entry.callback) {
          logError(`${fnName}: callback 不能为空, 请传入正确的 Menu Entry`);
          return;
        }
        const nameEmptyHandler = () => {
          logError(`${fnName}: entry name 不能为空`);
        };
        if (isSwitchEntry(entry)) {
          if (!entry.on.name || !entry.off.name) {
            nameEmptyHandler();
            return;
          }
          if (entry.default === void 0) {
            entry.default = true;
          }
          let currState = getSwitchBooleanState(entry);
          if (currState === null) {
            saveSwitchBooleanState(entry, entry.default);
            currState = entry.default;
          }
          entry.callback(currState, true);
          if (currState) {
            entry.currEntry = entry.on;
          } else {
            entry.currEntry = entry.off;
          }
          entry.on.next = entry.off;
          entry.off.next = entry.on;
        } else {
          if (!entry.name) {
            nameEmptyHandler();
            return;
          }
        }
        list.push(entry);
      })();
    }
    function add(entries) {
      logWrapper("add(entries)", () => {
        if (!Array.isArray(entries)) {
          logError("add: 请传递数组, 添加单个请使用 addItem ");
        }
        for (const entry of entries) {
          addEntry(entry);
        }
      })();
    }
    return {
      // 创建菜单
      create(isInit = true) {
        logWrapper("create", (fnName) => {
          if (list.length === 0) {
            logWarn(`${fnName}: 未添加任何 要创建的菜单条目`);
            return;
          }
          for (const id of idArr) {
            GM_unregisterMenuCommand(id);
          }
          idArr.length = 0;
          list.forEach((entry, index) => {
            let targetName = entry.name;
            if (isSwitchEntry(entry)) {
              targetName = entry.currEntry.name;
            }
            const id = GM_registerMenuCommand(targetName, () => {
              if (isSwitchEntry(entry)) {
                entry.currEntry = entry.currEntry.next;
                let currValue = getSwitchBooleanState(entry);
                currValue = !currValue;
                saveSwitchBooleanState(entry, currValue);
                entry.callback(currValue, false);
                this.create(false);
              } else {
                entry.callback();
              }
            }, entry.accessKey || null);
            idArr.push(id);
          });
        })();
        return this;
      },
      // 添加要创建的菜单项
      add(entryOrEntries) {
        logWrapperAndCall("add(entryOrEntries)", () => {
          if (Array.isArray(entryOrEntries)) {
            add(entryOrEntries);
          } else {
            addEntry(entryOrEntries);
          }
        });
        return this;
      },
      addAndCreate(entryOrEntries) {
        logWrapperAndCall("addAndCreate(entryOrEntries)", () => {
          this.add(entryOrEntries);
          this.create();
        });
        return this;
      },
      disableLog() {
        isLog = false;
        return this;
      }
    };
  })();
  const elmGetter = function() {
    const win = window.unsafeWindow || document.defaultView || window;
    const doc = win.document;
    const listeners = /* @__PURE__ */ new WeakMap();
    let mode = "css";
    let $;
    const elProto = win.Element.prototype;
    const matches = elProto.matches || elProto.matchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;
    const MutationObs = win.MutationObserver || win.WebkitMutationObserver || win.MozMutationObserver;
    function addObserver(target, callback) {
      const observer = new MutationObs((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "attributes") {
            callback(mutation.target, "attr");
            if (observer.canceled) return;
          }
          for (const node of mutation.addedNodes) {
            if (node instanceof Element) callback(node, "insert");
            if (observer.canceled) return;
          }
        }
      });
      observer.canceled = false;
      observer.observe(target, { childList: true, subtree: true, attributes: true, attributeOldValue: true });
      return () => {
        observer.canceled = true;
        observer.disconnect();
      };
    }
    function addFilter(target, filter) {
      let listener = listeners.get(target);
      if (!listener) {
        listener = {
          filters: /* @__PURE__ */ new Set(),
          remove: addObserver(target, (el, reason) => listener.filters.forEach((f) => f(el, reason)))
        };
        listeners.set(target, listener);
      }
      listener.filters.add(filter);
    }
    function removeFilter(target, filter) {
      const listener = listeners.get(target);
      if (!listener) return;
      listener.filters.delete(filter);
      if (!listener.filters.size) {
        listener.remove();
        listeners.delete(target);
      }
    }
    function query(selector, options = {}) {
      let {
        parent,
        root,
        curMode,
        reason
      } = options;
      switch (curMode) {
        case "css": {
          if (reason === "attr") return matches.call(parent, selector) ? parent : null;
          const checkParent = parent !== root && matches.call(parent, selector);
          return checkParent ? parent : parent.querySelector(selector);
        }
        case "jquery": {
          if (reason === "attr") return $(parent).is(selector) ? $(parent) : null;
          const jNodes = $(parent !== root ? parent : []).add([...parent.querySelectorAll("*")]).filter(selector);
          return jNodes.length ? $(jNodes.get(0)) : null;
        }
        case "xpath": {
          const ownerDoc = parent.ownerDocument || parent;
          selector += "/self::*";
          return ownerDoc.evaluate(selector, reason === "attr" ? root : parent, null, 9, null).singleNodeValue;
        }
      }
    }
    function queryAll(selector, options = {}) {
      let {
        parent,
        root,
        curMode,
        reason
      } = options;
      switch (curMode) {
        case "css": {
          if (reason === "attr") return matches.call(parent, selector) ? [parent] : [];
          const checkParent = parent !== root && matches.call(parent, selector);
          const result = parent.querySelectorAll(selector);
          return checkParent ? [parent, ...result] : [...result];
        }
        case "jquery": {
          if (reason === "attr") return $(parent).is(selector) ? [$(parent)] : [];
          const jNodes = $(parent !== root ? parent : []).add([...parent.querySelectorAll("*")]).filter(selector);
          return $.map(jNodes, (el) => $(el));
        }
        case "xpath": {
          const ownerDoc = parent.ownerDocument || parent;
          selector += "/self::*";
          const xPathResult = ownerDoc.evaluate(selector, reason === "attr" ? root : parent, null, 7, null);
          const result = [];
          for (let i = 0; i < xPathResult.snapshotLength; i++) {
            result.push(xPathResult.snapshotItem(i));
          }
          return result;
        }
      }
    }
    function isJquery(jq) {
      return jq && jq.fn && typeof jq.fn.jquery === "string";
    }
    function getOne(selector, options = {}) {
      let {
        parent,
        timeout,
        onError,
        isPending,
        errEl: errEl2
      } = options;
      const curMode = mode;
      return new Promise((resolve) => {
        const node = query(
          selector,
          {
            parent,
            root: parent,
            curMode
          }
        );
        if (node) return resolve(node);
        let timer;
        const filter = (el, reason) => {
          const node2 = query(
            selector,
            {
              parent,
              root: parent,
              curMode
            }
          );
          if (node2) {
            removeFilter(parent, filter);
            timer && clearTimeout(timer);
            resolve(node2);
          }
        };
        addFilter(parent, filter);
        if (timeout > 0) {
          timer = setTimeout(() => {
            removeFilter(parent, filter);
            onError(selector);
            if (!isPending) {
              resolve(errEl2);
            }
          }, timeout);
        }
      });
    }
    let errEl = document.createElement("div");
    errEl.classList.add("no-found");
    errEl.remove = () => {
    };
    return {
      timeout: 0,
      onError: (selector) => {
        console.warn(`[elmGetter] [get失败] selector为: ${selector} 的查询超时`);
      },
      isPending: true,
      errEl,
      get currentSelector() {
        return mode;
      },
      /**
       * 异步的 querySelector
       * @param selector
       * @param options 一个对象
       *  - parent 父元素, 默认值是 document
       *  - timeout 设置 get 的超时时间, 默认值是 elmGetter.timeout, 其值默认为 0
       *      - 如果该值为 0, 表示永不超时, 如果 selector 有误, 返回的 Promise 将永远 pending
       *      - 如果该值不为 0, 表示等待多少毫秒, 和 setTimeout 单位一致
       *  - onError 超时后的失败回调, 参数为 selector, 默认值为 elmGetter.onError, 其默认行为是 console.warn 打印 selector
       *  - isPending 超时后 Promise 是否仍然保持 pending, 默认值为 elmGetter.isPending, 其值默认为 true
       *  - errEl 超时后 Promise 返回的值, 需要 isPending 为 false 才能有效, 默认值为 elmGetter.errorEl, 其值默认为一个 class 为一个 class 为 no-found 的元素
       * @returns {Promise<Awaited<unknown>[]>|Promise<unknown>}
       */
      get(selector, options = {}) {
        let {
          parent = doc,
          timeout = this.timeout,
          onError = this.onError,
          isPending = this.isPending,
          errEl: errEl2 = this.errEl
        } = options;
        options.parent = parent;
        options.timeout = timeout;
        options.onError = onError;
        options.isPending = isPending;
        options.errEl = errEl2;
        if (mode === "jquery" && parent instanceof $) parent = parent.get(0);
        if (Array.isArray(selector)) {
          return Promise.all(selector.map((s) => getOne(s, options)));
        }
        return getOne(selector, options);
      },
      /**
       * 为父节点设置监听，所有符合选择器的元素（包括页面已有的和新插入的）都将被传给回调函数处理，
       * each方法适用于各种滚动加载的列表（如评论区），或者发生非刷新跳转的页面等
       * @param selector
       * @param callback 回调函数, 只在每个元素上触发一次。 回调函数接收2个参数，第一个是符合选择器的元素，第二个表明该元素是否为新插入的（已有为false，插入为true）
       * @param options 一个对象
       *  - parent 父元素, 默认值是 document
       */
      each(selector, callback, options = {}) {
        let {
          parent = doc
        } = options;
        if (mode === "jquery" && parent instanceof $) parent = parent.get(0);
        const curMode = mode;
        const refs = /* @__PURE__ */ new WeakSet();
        for (const node of queryAll(selector, { parent, root: parent, curMode })) {
          refs.add(curMode === "jquery" ? node.get(0) : node);
          if (callback(node, false) === false) return;
        }
        const filter = (el, reason) => {
          for (const node of queryAll(selector, { parent: el, root: parent, curMode, reason })) {
            const _el = curMode === "jquery" ? node.get(0) : node;
            if (refs.has(_el)) break;
            refs.add(_el);
            if (callback(node, true) === false) {
              return removeFilter(parent, filter);
            }
          }
        };
        addFilter(parent, filter);
      },
      /**
       * 将html字符串解析为元素
       * @param domString
       * @param options 一个对象
       *  - returnList 布尔值，是否返回以 id 作为索引的元素列表, 默认值为 false
       *  - parent 父节点，将创建的元素添加到父节点末尾处, 如果不指定, 解析后的元素将
       * @returns {Element|{}|null} 元素或对象，取决于returnList参数
       */
      create(domString, options = {}) {
        let {
          returnList = false,
          parent = null
        } = options;
        const template = doc.createElement("template");
        template.innerHTML = domString;
        const node = template.content.firstElementChild;
        if (!node) return null;
        parent ? parent.appendChild(node) : node.remove();
        if (returnList) {
          const list = {};
          node.querySelectorAll("[id]").forEach((el) => list[el.id] = el);
          list[0] = node;
          return list;
        }
        return node;
      },
      selector(desc) {
        switch (true) {
          case isJquery(desc):
            $ = desc;
            return mode = "jquery";
          case (!desc || typeof desc.toLowerCase !== "function"):
            return mode = "css";
          case desc.toLowerCase() === "jquery":
            for (const jq of [window.jQuery, window.$, win.jQuery, win.$]) {
              if (isJquery(jq)) {
                $ = jq;
                break;
              }
            }
            return mode = $ ? "jquery" : "css";
          case desc.toLowerCase() === "xpath":
            return mode = "xpath";
          default:
            return mode = "css";
        }
      }
    };
  }();
  async function main() {
    createMenu();
  }
  main();
  function createMenu() {
    CornMenuManager.addAndCreate([
      {
        default: true,
        callback(state, isInit) {
          if (!isInit) {
            location.reload();
          }
          if (!state) {
            return;
          }
          async function processState() {
            await elmGetter.each(".shortsLockupViewModelHostEndpoint", (el) => {
              el.href = convertShortsToVideoLink(el.href);
            });
            await elmGetter.each("ytm-shorts-lockup-view-model-v2", (el) => {
              let mask = document.createElement("a");
              mask.className = "mask";
              el.appendChild(mask);
              const aEl = el.querySelector(`a`);
              mask.href = aEl.href;
            });
          }
          jmpToVideo();
          processState();
        },
        on: {
          name: "自动跳转状态: 开启✅ (点我关闭)"
        },
        off: {
          name: "自动跳转状态: 关闭❎ (点我开启)"
        }
      },
      {
        name: "跳转到 Video",
        callback() {
          jmpToVideo();
        }
      }
    ]);
  }
  function convertShortsToVideoLink(shortsUrl) {
    if (shortsUrl.toLowerCase().includes("/shorts/")) {
      return shortsUrl.replace("/shorts/", "/watch?v=");
    } else {
      return shortsUrl;
    }
  }
  function jmpToVideo() {
    const href = window.location.href;
    if (href.toLowerCase().includes("/shorts/")) {
      window.location.href = convertShortsToVideoLink(href);
    }
  }

})();