// ==UserScript==
// @name       大地融合精友定损
// @namespace  ccicclaim
// @version    0.3.2
// @icon       https://www.easyepc123.com/static/favicon.ico
// @match      https://claim.ccic-net.com.cn/claim/synergismOpenClaimController*
// @match      https://claim.ccic-net.com.cn:25075/claim/synergismOpenClaimController*
// @match      https://claim.ccic-net.com.cn*/claim/synergismOpenClaimController*
// @match      https://claim.ccic-net.com.cn*/claim/bpmTaskController.do*
// @match      https://claim.ccic-net.com.cn:25075/claim/casLoginController.do*
// @connect    10.1.174.79
// @connect    ccic-claim.jingyougroup.com
// @connect    claim.ccic-net.com.cn
// @grant      GM_getValue
// @grant      GM_notification
// @grant      GM_setValue
// @grant      GM_xmlhttpRequest
// @grant      unsafeWindow
// @run-at     document-end
// @noframes
// @description 用于2015版大地理赔页面,融合精友查询
// @downloadURL https://update.greasyfork.org/scripts/545834/%E5%A4%A7%E5%9C%B0%E8%9E%8D%E5%90%88%E7%B2%BE%E5%8F%8B%E5%AE%9A%E6%8D%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/545834/%E5%A4%A7%E5%9C%B0%E8%9E%8D%E5%90%88%E7%B2%BE%E5%8F%8B%E5%AE%9A%E6%8D%9F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function hoverTip(context, element, content, id = "") {
    let contextDocument, contextWindow;
    if (context === window || context === document) {
      contextDocument = document;
      contextWindow = window;
    } else if (context.contentDocument || context.contentWindow) {
      contextDocument = context.contentDocument || context.contentWindow.document;
      contextWindow = context.contentWindow;
    } else {
      contextDocument = context;
      contextWindow = context.defaultView || context.parentWindow || window;
    }
    let hoverDiv = null;
    const createHoverDiv = () => {
      hoverDiv = contextDocument.createElement("div");
      hoverDiv.style.cssText = `
                display:none;
                position:absolute;
                background:#f9f9f9;
                border:1px solid #ddd;
                padding:5px;
                z-index:1000;
                box-shadow:0 0 3px rgba(0,0,0,0.5);
                pointer-events: auto;
                background-color: #ffffae;
            `;
      hoverDiv.innerHTML = content;
      if (id) hoverDiv.id = id;
      contextDocument.body.appendChild(hoverDiv);
      return hoverDiv;
    };
    hoverDiv = createHoverDiv();
    const handleElementEnter = (event) => {
      hoverDiv.style.display = "block";
      if (context === window || context === document) {
        hoverDiv.style.left = `${event.clientX + 15}px`;
        hoverDiv.style.top = `${event.clientY}px`;
      } else {
        const rect = context.getBoundingClientRect();
        const scrollX = contextWindow.scrollX;
        const scrollY = contextWindow.scrollY;
        hoverDiv.style.left = `${event.clientX + scrollX - rect.left + 15}px`;
        hoverDiv.style.top = `${event.clientY + scrollY - rect.top}px`;
      }
    };
    const handleHoverDivLeave = () => {
      hoverDiv.style.display = "none";
    };
    let isHoveringDiv = false;
    element.addEventListener("mouseenter", handleElementEnter);
    element.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!isHoveringDiv) {
          handleHoverDivLeave();
        }
      }, 100);
    });
    hoverDiv.addEventListener("mouseenter", () => {
      isHoveringDiv = true;
      hoverDiv.style.display = "block";
    });
    hoverDiv.addEventListener("mouseleave", () => {
      isHoveringDiv = false;
      handleHoverDivLeave();
    });
    contextWindow.addEventListener("resize", () => {
      hoverDiv.style.display = "none";
    });
    return hoverDiv;
  }
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => context.querySelectorAll(selector);
  class IframeMonitor {
    constructor() {
      this.handlers = [];
      this.observer = null;
      this.observedIframes = new WeakSet();
    }
monitorIframes() {
      const targetNode = document.body;
      const config = { childList: true, subtree: true };
      this.observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          mutation.addedNodes.forEach((node) => {
            if (node.tagName === "IFRAME") {
              console.debug("iframe 被添加:", node);
              this.bindIframeLoadEvent(node);
            } else if (node.querySelector) {
              const iframes = $$("iframe", node);
              iframes.forEach((iframe) => {
                console.debug("iframe 被添加（嵌套）:", iframe);
                this.bindIframeLoadEvent(iframe);
              });
            }
          });
          mutation.removedNodes.forEach((node) => {
            if (node.tagName === "IFRAME") {
              console.debug("iframe 被移除:", node);
            } else if (node.querySelector) {
              const iframes = $$("iframe", node);
              iframes.forEach((iframe) => {
                console.debug("iframe 被移除（嵌套）:", iframe);
              });
            }
          });
        }
      });
      this.observer.observe(targetNode, config);
      $$("iframe").forEach((iframe) => {
        this.bindIframeLoadEvent(iframe);
      });
      console.debug("开始监控 iframe 的动态生成、移除及加载事件...");
    }
bindIframeLoadEvent(iframe) {
      if (this.observedIframes.has(iframe)) return;
      this.observedIframes.add(iframe);
      iframe.addEventListener("load", () => {
        console.debug("iframe 加载完成:", iframe);
        this.executeHandlers(iframe);
      });
      if (iframe.contentDocument?.readyState === "complete") {
        console.debug("iframe 已缓存加载完成:", iframe);
        this.executeHandlers(iframe);
      }
    }
async executeHandlers(iframe) {
      for (let i = 0; i < this.handlers.length; i++) {
        try {
          console.debug(`执行处理函数 [${i}]:`, this.handlers[i].name || "匿名函数");
          await this.handlers[i](iframe);
        } catch (error) {
          console.error(`处理函数 [${i}] 执行失败:`, error);
        }
      }
    }

detectIframeLibraries(iframe) {
      try {
        const iframeWindow = iframe.contentWindow;
        const hasJQuery = typeof iframeWindow.jQuery !== "undefined" || typeof iframeWindow.$ !== "undefined";
        const libraries = {
          lodash: typeof iframeWindow._ !== "undefined",
          moment: typeof iframeWindow.moment !== "undefined",
          vue: typeof iframeWindow.Vue !== "undefined",
          react: typeof iframeWindow.React !== "undefined",
          angular: typeof iframeWindow.angular !== "undefined",
          underscore: typeof iframeWindow._ !== "undefined" && !iframeWindow._.noConflict,
          axios: typeof iframeWindow.axios !== "undefined"
};
        const hasMethods = {
          $: typeof iframeWindow.$ === "function",
          jQuery: typeof iframeWindow.jQuery === "function",
          getElementById: typeof iframeWindow.document?.getElementById === "function",
          querySelector: typeof iframeWindow.document?.querySelector === "function"
        };
        console.debug(`iframe 库检测结果 [${iframe.name || "无名"}]:`, {
          hasJQuery,
          libraries,
          hasMethods
        });
        if (hasJQuery) {
          console.log(`检测到 jQuery，版本: ${iframeWindow.jQuery.fn.jquery || "未知"}`);
        }
        return {
          iframeName: iframe.name,
          hasJQuery,
          libraries,
          hasMethods
        };
      } catch (error) {
        console.warn(`无法完全检测 iframe [${iframe.name || "无名"}] 内容 (可能跨域):`, error);
        return {
          iframeName: iframe.name,
          error: "跨域限制",
          partialInfo: {
            iframeSrc: iframe.src
          }
        };
      }
    }
addHandler(handler) {
      if (typeof handler !== "function") {
        console.error("添加失败: handler 必须是函数");
        return false;
      }
      this.handlers.push(handler.bind(this));
      console.debug(`已添加处理函数，当前队列长度: ${this.handlers.length}`);
      return true;
    }
removeHandler(handlerOrIndex) {
      if (typeof handlerOrIndex === "number") {
        if (handlerOrIndex >= 0 && handlerOrIndex < this.handlers.length) {
          this.handlers.splice(handlerOrIndex, 1);
          console.debug(`已删除索引 [${handlerOrIndex}] 的处理函数`);
          return true;
        }
      } else if (typeof handlerOrIndex === "function") {
        const index = this.handlers.indexOf(handlerOrIndex);
        if (index !== -1) {
          this.handlers.splice(index, 1);
          console.debug(`已删除处理函数，当前队列长度: ${this.handlers.length}`);
          return true;
        }
      }
      console.error("删除失败: 未找到指定的处理函数");
      return false;
    }
resetHandlers() {
      this.handlers = [];
      console.debug("已重置处理函数队列");
    }
clearHandlers() {
      this.handlers = [];
      console.debug("已清空所有处理函数");
    }
getHandlers() {
      return [...this.handlers];
    }
stopMonitoring() {
      if (this.observer) {
        this.observer.disconnect();
        console.debug("已停止 iframe 监控");
      }
    }
  }
  class Modal {
    constructor(options = {}) {
      this.config = {
        miniIcon_text: "🎛️",
        title: "悬浮窗",
        x: 100,
        y: 100,
        bx: 1,
        by: 100,
        content: null,
        element: null,
        iframe: document,
        isdblclick: true,
        ...options
      };
      this.isDragging = false;
      this.startX = 0;
      this.startY = 0;
      this.initialX = 0;
      this.initialY = 0;
      this.iframe = this.config.iframe || document;
      this.iframeDocument = this.iframe.contentDocument || this.iframe.contentWindow?.document || document;
      this._createElements();
      this._bindEvents();
    }
    _createElements() {
      this.floatDiv = this.iframeDocument.createElement("div");
      this.floatDiv.style.cssText = `
        position: fixed;
        background: white;
        border: 1px solid #ccc;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        min-width: 200px;
        min-height: 100px;
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        resize: both;
        overflow: auto;
        z-index: 9999;
      `;
      this.titleBar = this.iframeDocument.createElement("div");
      this.titleBar.style.cssText = `
        background:rgba(1, 158, 248, 0.26);
        padding: 1px;
        cursor: move;
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
      `;
      this.titleText = this.iframeDocument.createElement("span");
      this.titleText.textContent = this.config.title;
      this.closeBtn = this.iframeDocument.createElement("button");
      this.closeBtn.textContent = "×";
      this.closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 15px;
        cursor: pointer;
        padding: 0 6px;
        background: rgba(241, 34, 19, 0.72);
        border-radius: 50%;
      `;
      this.contentContainer = this.iframeDocument.createElement("div");
      this.contentContainer.style.cssText = `
        flex: 1;
        overflow: auto;
        padding: 8px;
      `;
      this.titleBar.appendChild(this.titleText);
      this.titleBar.appendChild(this.closeBtn);
      this.floatDiv.appendChild(this.titleBar);
      this.floatDiv.appendChild(this.contentContainer);
      this.iframeDocument.body.appendChild(this.floatDiv);
      this.floatDiv.style.left = `${this.config.x}px`;
      this.floatDiv.style.top = `${this.config.y}px`;
      if (!this.config.element) {
        this.miniIcon = this.iframeDocument.createElement("div");
        this.miniIcon.style.cssText = `
          position: fixed;
          left: ${this.config.bx}px;
          top: ${this.config.by}px;
          width: 20px;
          height: 20px;
          font-size: 15px;
          background: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        this.miniIcon.textContent = `${this.config.miniIcon_text}`;
        this.iframeDocument.body.appendChild(this.miniIcon);
      }
      this.floatDiv.style.display = "none";
      if (this.miniIcon) this.miniIcon.style.display = "block";
      if (this.config.element) {
        this.config.element.style.cssText = `
          cursor: pointer;
          user-select: none;
        `;
        const isdblclick = this.config.isdblclick ? "dblclick" : "click";
        this.config.element.addEventListener(isdblclick, () => this.show());
      }
      if (this.config.content) {
        this.contentContainer.appendChild(this.config.content);
      }
    }
    _bindEvents() {
      this.titleBar.addEventListener("mousedown", (e) => this._startDrag(e));
      this.iframeDocument.addEventListener("mousemove", (e) => this._drag(e));
      this.iframeDocument.addEventListener("mouseup", () => this._endDrag());
      this.closeBtn.addEventListener("click", () => this.hide());
      if (this.miniIcon) {
        this.miniIcon.addEventListener("click", () => this.toggleVisibility());
      }
    }
_startDrag(e) {
      this.isDragging = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.initialX = parseFloat(this.floatDiv.style.left);
      this.initialY = parseFloat(this.floatDiv.style.top);
    }
    _drag(e) {
      if (!this.isDragging) return;
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      this.floatDiv.style.left = `${this.initialX + dx}px`;
      this.floatDiv.style.top = `${this.initialY + dy}px`;
    }
    _endDrag() {
      this.isDragging = false;
    }
toggleVisibility() {
      const shouldShow = this.floatDiv.style.display === "none";
      this.floatDiv.style.display = shouldShow ? "block" : "none";
      if (this.miniIcon) this.miniIcon.style.display = shouldShow ? "none" : "block";
    }
    setContent(element) {
      this.contentContainer.innerHTML = "";
      this.contentContainer.appendChild(element);
    }
    show() {
      this.floatDiv.style.display = "block";
      if (this.miniIcon) this.miniIcon.style.display = "none";
    }
    hide() {
      this.floatDiv.style.display = "none";
      if (this.miniIcon) this.miniIcon.style.display = "block";
    }
    close() {
      this.floatDiv.remove();
      if (this.miniIcon) this.miniIcon.remove();
      if (this.config.element) {
        this.config.element.style.cssText = "";
        this.config.element.removeEventListener("dblclick", () => this.show());
      }
    }
  }
  const elmGetter = (function() {
    const win = window.unsafeWindow || document.defaultView || window;
    const doc = win.document;
    const listeners = new WeakMap();
    let mode = "css";
    let $2;
    const elProto = win.Element.prototype;
    const matches = elProto.matches || elProto.matchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;
    const MutationObs = win.MutationObserver || win.WebkitMutationObserver || win.MozMutationObserver;
    let defaultTimeout = 0;
    let defaultOnTimeout = () => null;
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
      observer.observe(target, { childList: true, subtree: true, attributes: true });
      return () => {
        observer.canceled = true;
        observer.disconnect();
      };
    }
    function addFilter(target, filter) {
      let listener = listeners.get(target);
      if (!listener) {
        listener = {
          filters: new Set(),
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
    function query(selector, parent, root, curMode, reason) {
      switch (curMode) {
        case "css": {
          if (reason === "attr") return matches.call(parent, selector) ? parent : null;
          const checkParent = parent !== root && matches.call(parent, selector);
          return checkParent ? parent : parent.querySelector(selector);
        }
        case "jquery": {
          if (reason === "attr") return $2(parent).is(selector) ? $2(parent) : null;
          const jNodes = $2(parent !== root ? parent : []).add([...parent.querySelectorAll("*")]).filter(selector);
          return jNodes.length ? $2(jNodes.get(0)) : null;
        }
        case "xpath": {
          const ownerDoc = parent.ownerDocument || parent;
          selector += "/self::*";
          return ownerDoc.evaluate(selector, reason === "attr" ? root : parent, null, 9, null).singleNodeValue;
        }
      }
    }
    function queryAll(selector, parent, root, curMode, reason) {
      switch (curMode) {
        case "css": {
          if (reason === "attr") return matches.call(parent, selector) ? [parent] : [];
          const checkParent = parent !== root && matches.call(parent, selector);
          const result = parent.querySelectorAll(selector);
          return checkParent ? [parent, ...result] : [...result];
        }
        case "jquery": {
          if (reason === "attr") return $2(parent).is(selector) ? [$2(parent)] : [];
          const jNodes = $2(parent !== root ? parent : []).add([...parent.querySelectorAll("*")]).filter(selector);
          return $2.map(jNodes, (el) => $2(el));
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
    function getOne(selector, parent, timeout) {
      const curMode = mode;
      return new Promise((resolve) => {
        const node = query(selector, parent, parent, curMode);
        if (node) return resolve(node);
        let timer;
        const filter = (el, reason) => {
          const node2 = query(selector, el, parent, curMode, reason);
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
            const result = defaultOnTimeout(selector);
            if (result !== void 0) resolve(result);
          }, timeout);
        }
      });
    }
    return {
      get currentSelector() {
        return mode;
      },
      get(selector, ...args) {
        let parent = typeof args[0] !== "number" && args.shift() || doc;
        if (mode === "jquery" && parent instanceof $2) parent = parent.get(0);
        const timeout = args[0] || defaultTimeout;
        if (Array.isArray(selector)) {
          return Promise.all(selector.map((s) => getOne(s, parent, timeout)));
        }
        return getOne(selector, parent, timeout);
      },
      each(selector, ...args) {
        let parent = typeof args[0] !== "function" && args.shift() || doc;
        if (mode === "jquery" && parent instanceof $2) parent = parent.get(0);
        const callback = args[0];
        const curMode = mode;
        const refs = new WeakSet();
        for (const node of queryAll(selector, parent, parent, curMode)) {
          refs.add(curMode === "jquery" ? node.get(0) : node);
          if (callback(node, false) === false) return;
        }
        const filter = (el, reason) => {
          for (const node of queryAll(selector, el, parent, curMode, reason)) {
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
      create(domString, ...args) {
        const returnList = typeof args[0] === "boolean" && args.shift();
        const parent = args[0];
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
            $2 = desc;
            return mode = "jquery";
          case (!desc || typeof desc.toLowerCase !== "function"):
            return mode = "css";
          case desc.toLowerCase() === "jquery":
            for (const jq of [window.jQuery, window.$, win.jQuery, win.$]) {
              if (isJquery(jq)) {
                $2 = jq;
                break;
              }
            }
            return mode = $2 ? "jquery" : "css";
          case desc.toLowerCase() === "xpath":
            return mode = "xpath";
          default:
            return mode = "css";
        }
      },
      onTimeout(...args) {
        defaultTimeout = typeof args[0] === "number" && args.shift() || defaultTimeout;
        defaultOnTimeout = args[0] || defaultOnTimeout;
      }
    };
  })();
  class JY {
    constructor(iframe) {
      this.iframe = iframe;
      this.Modal = null;
      this.iframe.contentDocument.addEventListener("mouseup", this.CreatSelectedText.bind(this));
      this.iframe.contentDocument.addEventListener("keydown", (event) => {
        if (event.altKey && (event.key === "q" || event.key === "Q")) {
          event.preventDefault();
          this.insert2cell();
        }
      });
      this.initialization(iframe).then(() => {
        this.addapprovetips();
        this.insert2cell();
      });
    }
async initialization(iframe) {
      const contentDocument = iframe.document || iframe.contentDocument || iframe.contentWindow.document;
      const $2 = (selector, context = contentDocument) => context.querySelector(selector);
      const data = {
        "registNo": $2("#bpmPage_registNo").value,
        "userCode": $2("#bpmPage_userCode").value,
        "userName": $2("#bpmPage_userName").value,
        "comCode": $2("#bpmPage_comCode").value,
        "comCName": $2("#bpmPage_comCName").value,
        "itemId": $2("#bpmPage_itemId").value,
        "businessKey": $2("#bpmPage_businessKey").value
      };
      const url_JYVerify = "/claim/approvalLossController.do?goVerifyRequestFromJY";
      return await fetch(url_JYVerify, {
        method: "POST",
        body: new URLSearchParams(data).toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then((response) => response.json()).then((jsondata) => {
        if (jsondata.success) {
          const url = jsondata.obj;
          this.accessurl = url;
          const host_match = url.match(/^https?:\/\/[^\/]+/);
          this.homeurl = host_match ? host_match[0] : null;
          const urlObj = new URL(url);
          const params = new URLSearchParams(urlObj.search);
          this.accesstoken = params.get("fileName") || null;
          this.host = urlObj.hostname || null;
        }
      }).then(() => {
        this.creatJYlink();
      }).then(() => {
        elmGetter.get('a[href="#carLossApproval_div"]', this.iframe.contentDocument).then(async (elm) => {
          elm?.click();
        });
      }).then(async () => {
        return await this.checktoken();
      }).then(async () => {
        GM_notification(jy.car.modelName, "精友初始化成功", jy.car.carImgPath);
        this.createSearchtool();
      });
    }
    async checktoken(url = this.accessurl) {
      if (this.init) return this.init;
      return await this.fetch(url).then((res) => {
        console.debug("精友请求链接结果", res);
      }).then(() => {
        const url_ApproveInfo = `${jy.homeurl}//ClaimCloudProd/approve/getApproveInfo`;
        return this.fetch(url_ApproveInfo).then((res) => res.json()).then((res) => {
          if (res.code == 0) {
            this.approveInfo = res.result;
            this.car = res.result.car;
            this.init = true;
          }
        });
      });
    }
creatJYlink(url = this.accessurl) {
      const jyNew = $("#jyNew", this.iframe.contentDocument);
      console.debug("检测精友定损按钮", jyNew);
      if (jyNew) return;
      const button = document.createElement("button");
      button.innerText = "精友平台";
      button.id = "GMjyNew";
      button.className = "btn btn-default";
      button.onclick = function() {
        window.open(url, "jyNew");
      };
      const container = $("#tools.btn-toolbar div.btn-group.pull-right", this.iframe.contentDocument);
      if (container) {
        container.appendChild(button);
      }
    }
    async _partQuery(kw = "", ext = 0) {
      if (!kw) {
        return { code: 300, message: "零件名称不可以为空", result: [] };
      }
      const queryurl = `${this.homeurl}/ClaimCloudProd/partQuery/getPartListForName`;
      const headers = {
        "Content-Type": `text/plain;charset=UTF-8`,
        "Accesstoken": `${this.accesstoken}`
      };
      const postdata = {
        customerFlag: ext,
        partName: kw,
        standPartSearch: ext,
        isFlooded: 0
      };
      return await this.fetch(queryurl, postdata, {}, headers).then((resp) => resp.json());
    }
    async _partQuery_Replacedpart(kw = "", ext = 0) {
      if (!kw) {
        return { code: 300, message: "零件名称不可以为空", result: [] };
      }
      const queryurl = `${this.homeurl}/ClaimCloudProd/partQuery/getReplacePartListForPart`;
      const headers = {
        "Content-Type": `text/plain;charset=UTF-8`
      };
      const postdata = {
        priceType: "",
        evalComCode: this.approveInfo.car.evalComCode,
        brandCode: this.approveInfo.car.brandCode,
        factPartCode: kw
      };
      return await this.fetch(queryurl, postdata, {}, headers).then((resp) => resp.json());
    }
    async _getPartPicture(partitem) {
      const queryurl = `${this.homeurl}/ClaimCloudProd/partQuery/getPartPicture`;
      const postdata = {
        groupId: this.approveInfo.car.groupId,
        modelId: this.approveInfo.car.modelId,
        brandCode: this.approveInfo.car.brandCode,
        partGroupId: partitem.partGroupId,
        factPartId: partitem.factPartId,
        evalId: this.approveInfo.evalRepair.evalId,
        evalComCode: this.approveInfo.car.evalComCode,
        carTypeCode: this.approveInfo.car.carTypeCode
      };
      if (partitem.picNo) {
        postdata.picNo = partitem.picNo;
      }
      function getPicData(result) {
        const picData = {};
        picData.imageSerialNo = result.partPicHotspotList[0].imageSerialNo;
        picData.partPicPath = result.partPicHotspotList[0].partPicPath;
        picData.partName = partitem.partName;
        picData.factPartName = partitem.factPartName;
        picData.partRemark = partitem.partRemark ? partitem.partRemark : "";
        if (result.picUrl != null) {
          console.debug("picUrl", result.picUrl);
          picData.partPicPath = result.picUrl;
          const partPicHotspots = result.partPicHotspotList;
          for (let i = 0; i < partPicHotspots.length; i++) {
            if (partPicHotspots[i].factPartId == partitem.factPartId) {
              partPicHotspots[i].orderNo;
              picData.imageSerialNo = partPicHotspots[i].orderNo;
              break;
            }
          }
          picData.partPicHotspots = partPicHotspots;
        }
        return picData;
      }
      return await this.fetch(queryurl, postdata, {}).then((resp) => resp.json()).then((json) => {
        if (json.code == 0) {
          const result = json.result;
          const picData = getPicData(result);
          console.debug("图片数据", picData);
          return picData;
        }
      });
    }
createresult_table(items, options = { infotag: true }) {
      const header_zh = {
        partName: "配件名称",
        factPartName: "原厂名称",
        partRemark: "备注",
        factPartCode: "零件号",
        guidePrice: "厂方指导价",
        marketPrice: "市场价",
        referencePrice: "参考价",
        brandPrice: "品牌价",
        dadiBrandPrice: `大地价`,
        marketRefPrice: `原厂价(大地)`,
        orderNo: "图片序号"
      };
      console.debug(`创建结果表格`, items);
      let headers = ["partName", "partRemark", `factPartCode`, "guidePrice", "brandPrice", `dadiBrandPrice`, "marketPrice", "marketRefPrice"];
      if (options.headers) {
        headers = [...options.headers];
      }
      const table = document.createElement("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header_zh[header];
        th.style.border = "1px solid #ddd";
        th.style.padding = "8px";
        th.style.backgroundColor = "#f5f5f5";
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      items.forEach((item) => {
        const row = document.createElement("tr");
        const infobar = this.createInfobar(item);
        headers.forEach((header) => {
          const cell = document.createElement("td");
          const value = item[header] !== void 0 ? item[header] : "-";
          if (header == "partName") {
            cell.title = `${item.factPartName ? item.factPartName : ""} ${item.partRemark ? item.partRemark : ""}`;
          }
          const cellContent = document.createElement("div");
          cellContent.textContent = value;
          cell.appendChild(cellContent);
          if (header == "partName" && options.infotag) {
            cell.appendChild(infobar);
          }
          cell.style.border = "1px solid #ddd";
          cell.style.padding = "6px";
          row.appendChild(cell);
        });
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      return table;
    }
    createImagePreview(picdata) {
      const iframeDocument = this.iframe.contentDocument || this.iframe.contentWindow.document;
      const overlay = iframeDocument.createElement("div");
      overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
`;
      const mainContainer = iframeDocument.createElement("div");
      mainContainer.style.cssText = `
    display: flex;
    flex-direction: row;
    max-width: 95vw;
    max-height: 95vh;
    background: white;
    border-radius: 8px;
    overflow: hidden;
`;
      const imageContainerWrapper = iframeDocument.createElement("div");
      imageContainerWrapper.style.cssText = `
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 60vw;
    max-height: 90vh;
    border-right: 1px solid #ddd;
`;
      const titleBar = iframeDocument.createElement("div");
      titleBar.textContent = `${picdata.partName}(${picdata.factPartName};${picdata.partRemark}) 图片编号:${picdata.imageSerialNo}`;
      titleBar.style.cssText = `
    padding: 8px 12px;
    background: #f0f0f0;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
`;
      const imageContainer = iframeDocument.createElement("div");
      imageContainer.style.cssText = `
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    overflow: auto;
    cursor: grab;
    min-width: 100%;
    min-height: 100%;
`;
      const img = iframeDocument.createElement("img");
      img.src = picdata.partPicPath;
      img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        transition: transform 0.2s ease, transform-origin 0.2s ease;
        cursor: zoom-in;
        user-select: none;
        transform-origin: 1% 1%; /* 初始缩放原点 默认10%*/
    `;
      let isDragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let scrollLeft = 0;
      let scrollTop = 0;
      const startDragging = (e) => {
        if (e.button !== 0 && e.button !== 1) return;
        e.preventDefault();
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        scrollLeft = imageContainer.scrollLeft;
        scrollTop = imageContainer.scrollTop;
        img.style.cursor = "grabbing";
        imageContainer.style.cursor = "grabbing";
      };
      const drag = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.clientX;
        const y = e.clientY;
        const deltaX = x - dragStartX;
        const deltaY = y - dragStartY;
        imageContainer.scrollLeft = scrollLeft - deltaX;
        imageContainer.scrollTop = scrollTop - deltaY;
      };
      const stopDragging = () => {
        if (!isDragging) return;
        isDragging = false;
        img.style.cursor = "zoom-in";
        imageContainer.style.cursor = "grab";
      };
      img.addEventListener("mousedown", startDragging);
      iframeDocument.addEventListener("mousemove", drag);
      iframeDocument.addEventListener("mouseup", stopDragging);
      iframeDocument.addEventListener("mouseleave", stopDragging);
      let scale = 1;
      img.addEventListener("wheel", (e) => {
        e.preventDefault();
        img.style.transformOrigin = "10% 10%";
        if (e.deltaY < 0) {
          scale += 0.1;
        } else {
          scale -= 0.1;
          if (scale < 0.5) scale = 0.5;
        }
        img.style.transform = `scale(${scale})`;
        img.style.cursor = scale > 1 ? "zoom-out" : "zoom-in";
      });
      let table = null;
      if (picdata.partPicHotspots && picdata.partPicHotspots.length > 0) {
        const items = picdata.partPicHotspots;
        table = this.createresult_table(items, {
          infotag: false,
          headers: ["orderNo", "partName", "partRemark", "factPartCode", "guidePrice"]
        });
        if (table) {
          const result_container = iframeDocument.createElement("div");
          result_container.style.cssText = `
                flex: 1;
                max-width: 40vw;
                max-height: 90vh;
                overflow: auto;
                border-left: 1px solid #ddd;
            `;
          result_container.appendChild(table);
          mainContainer.appendChild(result_container);
        }
      }
      imageContainer.appendChild(img);
      imageContainerWrapper.appendChild(titleBar);
      imageContainerWrapper.appendChild(imageContainer);
      mainContainer.appendChild(imageContainerWrapper);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.remove();
        }
      });
      overlay.appendChild(mainContainer);
      iframeDocument.body.appendChild(overlay);
    }
    createSearchtool() {
      const Searchtool = {};
      this.Searchtool = Searchtool;
      const iframeDocument = this.iframe.contentDocument || this.iframe.contentWindow.document;
      const containerId = "JYSearchtool";
      const searchtool = iframeDocument.createElement("div");
      searchtool.id = containerId;
      searchtool.style.cssText = `
                background: white;
                border: 1px solid #ddd;
                padding: 8px;
                box-shadow: 0 0 5px rgba(0,0,0,0.2);
                width: auto;
                height: auto;
                `;
      const icon = iframeDocument.createElement("label");
      icon.textContent = "🔎";
      icon.style.cssText = `
                font-size: 18px;
            `;
      const input_kw = iframeDocument.createElement("input");
      input_kw.type = "text";
      input_kw.placeholder = "零件名称";
      input_kw.style.cssText = `
                margin-right: 5px;
                padding: 4px 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
                width: 150px;
            `;
      const checkbox_ext = iframeDocument.createElement("input");
      checkbox_ext.type = "checkbox";
      checkbox_ext.style.marginRight = "4px";
      checkbox_ext.title = "扩展查询";
      const btn_serch = iframeDocument.createElement("button");
      btn_serch.textContent = "🔍";
      btn_serch.style.cssText = `
            padding: 4px 4px;
            font-size: 18px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            `;
      const barContainer = iframeDocument.createElement("div");
      barContainer.id = "barContainer";
      barContainer.style.cssText = `
                border: 1px solid #ddd;
                border-radius: 4px;
                background: #f9f9f9;
                display: flex;
                flex-direction: row;
                align-items: center;
                flex-wrap: nowrap;
            `;
      const resultContainer = iframeDocument.createElement("div");
      resultContainer.id = "resultContainer";
      resultContainer.style.cssText = `
                margin-top: 8px;
                border-radius: 4px;
                background: #f9f9f9;
                overflow-y: auto;
                clear: both; /* 确保在下一行显示 */
            `;
      barContainer.appendChild(icon);
      barContainer.appendChild(input_kw);
      barContainer.appendChild(checkbox_ext);
      barContainer.appendChild(btn_serch);
      searchtool.appendChild(barContainer);
      searchtool.appendChild(resultContainer);
      Searchtool.barContainer = barContainer;
      Searchtool.icon = icon;
      Searchtool.input_kw = input_kw;
      Searchtool.checkbox_ext = checkbox_ext;
      Searchtool.btn_serch = btn_serch;
      Searchtool.resultContainer = resultContainer;
      Searchtool.searchtool = searchtool;
      btn_serch.addEventListener("click", () => {
        doserach();
      });
      input_kw.addEventListener("keypress", (event) => {
        if (event.keyCode === 13) {
          doserach();
        }
      });
      const doserach = () => {
        const kw = Searchtool.input_kw.value.trim();
        const ext = Searchtool.checkbox_ext.checked ? 1 : 0;
        this._partQuery(kw, ext).then((response) => {
          console.log("续写后面的流程", response);
          const table = this.createresult_table(response.result);
          Searchtool.resultContainer.innerHTML = "";
          Searchtool.resultContainer.appendChild(table);
        });
      };
      const JYModal_config = {
        miniIcon_text: "🎈",
        title: "精友查询",
        content: Searchtool.searchtool,
        iframe: this.iframe,
        isdblclick: false
      };
      this.Modal = new Modal(JYModal_config);
    }
createInfobar(item) {
      const cssText = {};
      cssText.Tag = "color: white; padding: 2px 5px; border-radius: 3px; cursor: default;";
      const iframeDocument = this.iframe.contentDocument || this.iframe.contentWindow.document;
      const infobar = iframeDocument.createElement("div");
      infobar.style.cssText = "display: inline-flex; align-items: center; gap: 5px;";
      infobar.setAttribute("name", "JYpartinfobar");
      if (item.isReplaced === "1") {
        const replacedTag = iframeDocument.createElement("span");
        replacedTag.textContent = "替";
        replacedTag.title = "替换件";
        replacedTag.style.cssText = cssText.Tag;
        replacedTag.style.background = "blue";
        infobar.appendChild(replacedTag);
      }
      if (item.matchType === "1") {
        const matchTypeTag = iframeDocument.createElement("span");
        matchTypeTag.textContent = "精准";
        matchTypeTag.title = "精准点选";
        matchTypeTag.style.cssText = cssText.Tag;
        matchTypeTag.style.background = "purple";
        infobar.appendChild(matchTypeTag);
      } else if (item.ifWading === "0") {
        const highValueTag = iframeDocument.createElement("span");
        highValueTag.textContent = "高";
        highValueTag.title = "高价值";
        highValueTag.style.cssText = cssText.Tag;
        highValueTag.style.background = "red";
        infobar.appendChild(highValueTag);
      }
      if (item.factPartId && item.partGroupId) {
        const pictureTag = iframeDocument.createElement("span");
        pictureTag.textContent = "图";
        pictureTag.style.cssText = cssText.Tag;
        pictureTag.style.background = "green";
        if (item.hasPartPic && item.hasPartPic == "0") {
          pictureTag.textContent = "无图?";
        }
        pictureTag.addEventListener("click", async () => {
          try {
            const picData = await this._getPartPicture(item);
            this.createImagePreview(picData);
          } catch (error) {
            console.error("获取图片失败:", error);
          }
        });
        pictureTag.style.cursor = "pointer";
        infobar.appendChild(pictureTag);
      }
      return infobar;
    }
async fetch(url, data = "", json = "", headers = {}) {
      const options = {
        method: data || json ? "POST" : "GET",
        headers: {
          ...headers,
          "Accesstoken": `${this.accesstoken}`,
          "Content-Type": data ? "application/x-www-form-urlencoded" : json ? "application/json;charset=UTF-8" : "text/plain"
        },
        data: data ? new URLSearchParams(data).toString() : null,
        json: json ? JSON.stringify(json) : null,
        timeout: 1e4
      };
      console.debug("精友调试:fetch", `url:${url}`, `options:`, options);
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: options.method,
          url,
          headers: options.headers,
          data: options.data || options.json,
onload: async (response) => {
            try {
              const contentType = response.responseHeaders.split("\n").find((header) => header.toLowerCase().startsWith("content-type"));
              const mockResponse = {
                ok: response.status >= 200 && response.status < 300,
                status: response.status,
                statusText: response.statusText,
                url: response.finalUrl,
                json: () => JSON.parse(response.responseText),
                text: () => response.responseText,
                blob: () => new Blob([response.response]),
                html: () => new DOMParser().parseFromString(response.responseText, "text/html")
              };
              console.debug("精友调试:fetch", `response:`, mockResponse);
              resolve(mockResponse);
            } catch (error) {
              reject(new Error(`Response parsing failed: ${error.message}`));
            }
          },
onerror: (error) => {
            reject(new Error(`GM_xmlhttpRequest failed: ${error.statusText}`));
          },
ontimeout: () => {
            reject(new Error("Request timed out"));
          },
          timeout: options.timeout
        });
      });
    }
TS2DT(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const padZero = (num) => String(num).padStart(2, "0");
      return `${year}-${padZero(month)}-${padZero(day)} ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    }
    insert2cell(iframe = this.iframe) {
      const contentDocument = iframe.document || iframe.contentDocument || iframe.contentWindow.document;
      const trs = contentDocument.querySelectorAll("#UIPrpLComponent_add_orderProduct_table tr");
      const jyitems = this.approveInfo.partList;
      if (trs.length == 0 || jyitems.length == 0) return;
      for (let i = 0; i < trs.length; i++) {
        const td = trs[i].cells[1];
        const JYpartinfobar = $('div[name="JYpartinfobar"]', td);
        if (JYpartinfobar) {
          JYpartinfobar.remove();
        } else {
          const infobar = this.createInfobar(jyitems[i]);
          td.appendChild(infobar);
        }
      }
    }
CreatSelectedText() {
      const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
      const iframeWin = this.iframe.contentWindow;
      let selectionitem, selectedText;
      const selection = iframeWin.getSelection();
      if (selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      selectedText = range.toString().replace(/\s/g, "");
      selectionitem = range;
      const activeElement = iframeDoc.activeElement;
      if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
        selectedText = activeElement.value.substring(
          activeElement.selectionStart,
          activeElement.selectionEnd
        ).replace(/\s/g, "");
        if (selectedText) {
          selectionitem = activeElement;
        }
      }
      if (selectedText.length <= 1 || selectedText.length > 15) return;
      const iframeDocument = this.iframe.contentDocument || this.iframe.contentWindow.document;
      const existingIndicator = iframeDocument.getElementById("jy-selection-indicator");
      if (existingIndicator) {
        existingIndicator.remove();
      }
      const indicator = iframeDocument.createElement("span");
      indicator.id = "jy-selection-indicator";
      indicator.innerHTML = "🔍";
      indicator.searchkw = selectedText;
      indicator.title = `搜索: ${selectedText}`;
      indicator.style.cssText = `
            display: inline-block;
            width: 16px;
            height: 16px;
            background: #007bff;
            border-radius: 50%;
            color: white;
            text-align: center;
            font-size: 12px;
            margin-left: 4px;
            cursor: progress;
            user-select: none;
            vertical-align: middle;
            transition: all 0.2s ease;
            position: fixed;
            z-index: 9999;
            cursor: progress;
        `;
      const iframeRect = this.iframe.getBoundingClientRect();
      const rect = selectionitem.getBoundingClientRect();
      indicator.style.left = `${rect.left - 30 + iframeRect.left}px`;
      indicator.style.top = `${rect.top - 20 + iframeRect.top}px`;
      iframeDocument.body.appendChild(indicator);
      let timer = null;
      indicator.addEventListener("mouseenter", (e) => {
        timer = setTimeout(() => {
          this.indicator_search();
        }, 1e3);
      });
      indicator.addEventListener("mouseleave", () => {
        clearTimeout(timer);
      });
      const removeIndicator = () => {
        if (iframeDocument.getElementById("jy-selection-indicator")) {
          iframeDocument.getElementById("jy-selection-indicator").remove();
        }
        iframeDoc.removeEventListener("selectionchange", removeIndicator);
      };
      iframeDoc.addEventListener("selectionchange", removeIndicator);
      this.indicator = indicator;
    }
    async indicator_search() {
      const Modal2 = this.Modal;
      const floatDiv = Modal2.floatDiv;
      const indicator = this.indicator;
      const kw = indicator.searchkw;
      if (!kw || !Modal2) return;
      this._partQuery(kw).then((response) => {
        Modal2.hide();
        const iframeRect = this.iframe.getBoundingClientRect();
        floatDiv.style.left = indicator.style.left ? indicator.style.left < iframeRect.width * 0.5 : iframeRect.width - indicator.style.left;
        floatDiv.style.top = indicator.style.top ? indicator.style.top < iframeRect.height * 0.5 : iframeRect.height - indicator.style.top;
        const table = this.createresult_table(response.result);
        this.Searchtool.resultContainer.innerHTML = "";
        this.Searchtool.resultContainer.appendChild(table);
        this.Searchtool.input_kw.value = kw;
        Modal2.show();
      });
    }
addapprovetips() {
      function createCarInfoContainer(data) {
        const container = document.createElement("div");
        container.className = "car-info-container";
        container.style.cssText = `padding: 5px;border: 1px solid #e4e4e4;border-radius: 6px;max-width: 800px;font-family: Arial, sans-serif;background: #fff;`;
        const fields = [
          { key: "modelName", label: "定损车型", parent: "car" },
          { key: "vinNo", label: "定损车VIN码", parent: "car" },
          { key: "groupName", label: "品牌厂家", parent: "car" },
          { key: "vehiclePrice", label: "新车购置价", parent: "car" },
{ key: "repairFacName", label: "维修厂名称", parent: "evalRepair" },
          { key: "repairType", label: "维修厂类型", parent: "evalRepair" },
          { key: "partDiscountPercent", label: "厂方指导价折扣率", parent: "evalRepair" },
          { key: "partBrandDiscount", label: "品牌件折扣率", parent: "evalRepair" }
        ];
        const row = document.createElement("div");
        row.className = "car-info-row";
        row.style.cssText = `display: flex;flex-wrap: wrap;margin-bottom: 10px;`;
        fields.forEach((field, index) => {
          const column = document.createElement("div");
          column.className = "car-info-column";
          column.style.cssText = `flex: 0 0 48%;display: flex;align-items: center;margin-bottom: 12px;`;
          const label = document.createElement("span");
          label.className = "info-label";
          label.style.cssText = `font-weight: bold;width: 120px;color: #333;flex-shrink: 0;`;
          label.textContent = field.label;
          const value = document.createElement("span");
          value.className = "info-value";
          value.style.cssText = `color: #555;overflow: hidden;text-overflow: ellipsis;`;
          value.textContent = data?.[field.parent]?.[field.key] || "N/A";
          if (field.parent === "evalRepair" && field.key === "repairType") {
            const repairTypeMap = {
"2": "综修厂",
              "1": "服务站"
            };
            value.textContent = repairTypeMap[data?.[field.parent]?.[field.key]] || "未知类型";
          }
          if (field.parent === "car" && field.key === "vehiclePrice") {
            value.textContent = `${data.car.vehiclePrice} (${data.car.actualValue} 折旧率:${data.car.actualValue / data.car.vehiclePrice * 100}%)`;
          }
          if (field.parent === "car" && field.key === "groupName") {
            const item = data.car;
            value.textContent = `${item.brandName}-${item.factoryName}`;
          }
          column.appendChild(label);
          column.appendChild(value);
          row.appendChild(column);
          if ((index + 1) % 2 === 0 && index < fields.length - 1) {
            container.appendChild(row.cloneNode(true));
            row.innerHTML = "";
          }
        });
        if (row.children.length > 0) {
          container.appendChild(row);
        }
        return container;
      }
      const element = this.Modal.miniIcon;
      if (!element) return;
      const infotips = createCarInfoContainer(this.approveInfo);
      hoverTip(this.iframe, element, infotips.outerHTML);
    }
  }
  function injectJY(iframe) {
    const iframe_names_car = ["CarComponent", "CarLoss"];
    if (iframe.name && iframe_names_car.some((str) => iframe.name.includes(str))) {
      console.debug("iframe 加载完成,开始创建精友实例", iframe);
      const jy2 = new JY(iframe);
      unsafeWindow.jy = jy2;
    }
  }
  function init() {
    const iframeMonitor = new IframeMonitor();
    iframeMonitor.addHandler(injectJY);
    iframeMonitor.monitorIframes();
  }
  init();

})();