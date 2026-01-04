// ==UserScript==
// @name         linux.do.level
// @namespace    https://linux.do/u/io.oi/s/level
// @version      1.5.1
// @author       LINUX.DO
// @description  Linux.Do 查看用户信任级别以及升级条件，数据来源于 https://connect.linux.do
// @license      MIT
// @icon         https://linux.do/uploads/default/original/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994.png
// @match        https://linux.do/*
// @connect      connect.linux.do
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/490520/linuxdolevel.user.js
// @updateURL https://update.greasyfork.org/scripts/490520/linuxdolevel.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const r=document.createElement("style");r.textContent=e,document.head.append(r)})(" .level-window{position:fixed;bottom:0;background:var(--secondary);z-index:999;padding:.5em;color:var(--primary);box-shadow:0 0 4px #00000020;border:1px solid var(--primary-low)}.level-window .title .close{width:24px;height:24px;color:#fff;background:red;display:inline-block;text-align:center;line-height:24px;float:right;cursor:pointer;border-radius:var(--d-button-border-radius);font-size:var(--base-font-size-largest)}.level-window .bg-white{background-color:var(--primary-low);border-radius:var(--d-button-border-radius);padding:.5em;margin-top:.5em}.level-window h1{color:var(--primary);font-size:1.3rem}.level-window h2{font-size:1.25rem}.mb-4 table tr:nth-child(2n){background-color:var(--tertiary-400)}.level-window .text-red-500{color:#ef4444}.level-window .text-green-500{color:#10b981}.level-window .mb-4 table tr td{padding:4px 8px}.language-text{background:var(--primary-very-low);font-family:var(--d-font-family--monospace);font-size:var(--base-font-size-smallest);flex-grow:1;padding:6px}.code-box{display:flex;flex-direction:row;justify-content:space-between}.code-box .copy{padding:.5em 1em;cursor:pointer;-webkit-user-select:none;user-select:none;font-size:var(--base-font-size-smallest);background:var(--secondary)}.connect-button{width:100%;padding:.5em;border-radius:var(--d-button-border-radius)!important;margin-top:.5em!important}.emoji-picker-category-buttons,.emoji-picker-emoji-area{justify-content:center;padding-left:initial}.emoji-picker-category-buttons::-webkit-scrollbar,.emoji-picker-emoji-area::-webkit-scrollbar{width:5px;height:auto;background:var(--primary)}.emoji-picker-category-buttons::-webkit-scrollbar-thumb,.emoji-picker-emoji-area::-webkit-scrollbar-thumb{box-shadow:inset 0 0 5px #0003;background:var(--secondary)}.emoji-picker-category-buttons::-webkit-scrollbar-track,.emoji-picker-emoji-area::-webkit-scrollbar-track{box-shadow:inset 0 0 5px #0003;background:var(--primary-low)}.floor-text{color:var(--tertiary)}.metaverse{border-right:none!important}.metaverse .md-table table table{width:100%}.metaverse .md-table table td{padding:var(--space-2)}.metaverse-show-all{padding:.5em!important}.metaverse-div-link{padding:0;color:var(--d-link-color);text-decoration:none;cursor:pointer} ");

(function () {
  'use strict';

  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  async function getLevelFromConnect() {
    return await new Promise((resolve, reject) => {
      _GM.xmlHttpRequest({
        method: "GET",
        url: "https://connect.linux.do",
        onload: (response) => {
          let regx = /<body[^>]*>([\s\S]+?)<\/body>/i;
          let contents = regx.exec(response.responseText);
          if (contents && contents.length > 1) {
            resolve({
              status: true,
              content: contents[1],
              error: ""
            });
          } else {
            resolve({
              status: false,
              content: "",
              error: "解析 Connect 数据错误。"
            });
          }
        },
        onerror: (e) => {
          reject({ status: false, error: e.error, content: "" });
        }
      });
    });
  }
  async function getMetaverse() {
    return await new Promise((resolve, reject) => {
      _GM.xmlHttpRequest({
        method: "GET",
        url: "https://linux.do/pub/resources",
        onload: (response) => {
          const dom = new DOMParser().parseFromString(response.responseText, "text/html");
          const div = dom.querySelector("div.published-page-content-body");
          if (div) {
            resolve({
              status: true,
              content: div,
              error: ""
            });
          } else {
            resolve({
              status: false,
              content: null,
              error: "解析数据错误。"
            });
          }
        },
        onerror: (e) => {
          reject({ status: false, error: e.error, content: "" });
        }
      });
    });
  }
  function createUI(context, onClose) {
    const plane = `
          <div class="panel-body">
            <div class="panel-body-contents">
              <div id="quick-access-all-notifications" class="quick-access-panel metaverse">
                ${context.innerHTML}
              </div>
            </div>
          </div>`;
    const root = document.createElement("div");
    root.className = "user-menu-dropdown-wrapper";
    root.setAttribute("tabindex", "0");
    const body = document.createElement("div");
    body.className = "user-menu revamped menu-panel show-avatars drop-down";
    body.setAttribute("data-tab-id", "all-notifications");
    body.setAttribute("data-max-width", "320");
    body.style.padding = "1em";
    body.innerHTML = plane;
    root.appendChild(body);
    const closeButton = document.createElement("div");
    closeButton.className = "panel-body-bottom btn no-text btn-default show-all metaverse-show-all";
    closeButton.innerHTML = "关闭";
    closeButton.addEventListener("click", () => {
      onClose();
    });
    body.appendChild(closeButton);
    return root;
  }
  function getLoadingSvg(size = 60) {
    return `<svg class="fa d-icon d-icon-envelope svg-icon svg-string" xmlns="http://www.w3.org/2000/svg" width="${size}px" height="${size}px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
              <circle cx="50" cy="50" r="30" stroke="#B3B5B411" stroke-width="10" fill="none"/>
              <circle cx="50" cy="50" r="30" stroke="#808281" stroke-width="10" fill="none" transform="rotate(144 50 50)">
                <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/>
                <animate attributeName="stroke-dasharray" calcMode="linear" values="18.84955592153876 169.64600329384882;94.2477796076938 94.24777960769377;18.84955592153876 169.64600329384882" keyTimes="0;0.5;1" dur="1" begin="0s" repeatCount="indefinite"/>
              </circle> 
            </svg>`;
  }
  function showMessageBox(message, title, buttons = [
    {
      text: "确认",
      type: "btn-primary",
      onClicked: function() {
      }
    }
  ]) {
    let root = document.querySelector("div.modal-container");
    if (root) {
      let box = document.createElement("div");
      box.id = "message-box";
      box.className = "ember-view modal d-modal discard-draft-modal";
      box.setAttribute("data-keyboard", "false");
      box.setAttribute("aria-modal", "true");
      box.setAttribute("role", "dialog");
      box.innerHTML = `
        <div class="d-modal__container">
            <div class="d-modal__header">${title}</div>
            <div class="d-modal__body" tabindex="-1">
              <div class="instructions">
              ${message}
              </div>
            </div>
            <div class="d-modal__footer">
            </div>
        </div>`;
      let backdrop = document.createElement("div");
      backdrop.className = "d-modal__backdrop";
      root.appendChild(backdrop);
      let footer = box.querySelector("div.d-modal__footer");
      if (footer) {
        for (const button of buttons) {
          let btnElement = document.createElement("button");
          btnElement.className = "btn btn-text " + button.type;
          btnElement.setAttribute("type", "button");
          btnElement.innerHTML = `
               <span class="d-button-label">
                    ${button.text}
               </span>
            `;
          btnElement.addEventListener("click", () => {
            button.onClicked();
            box.remove();
            backdrop.remove();
          });
          footer.appendChild(btnElement);
        }
        root.appendChild(box);
      }
    }
  }
  class Base {
    showInfo(title, content, onClose) {
      showMessageBox(content, title, [{
        text: "确认",
        type: "btn-primary",
        onClicked: () => {
          if (onClose) {
            onClose();
          }
        }
      }]);
    }
    showError(title, content, onClose) {
      showMessageBox(content, title, [{
        text: "确认",
        type: "btn-danger",
        onClicked: () => {
          if (onClose) {
            onClose();
          }
        }
      }]);
    }
  }
  function observeDom(selector, onChanged, option) {
    let dom = typeof selector === "string" ? document.querySelector(selector) : selector;
    if (dom) {
      const observer = new MutationObserver(() => {
        onChanged(dom);
      });
      observer.observe(dom, option ? option : { childList: true });
      return observer;
    } else {
      console.error(`query dom error: [${selector}]`);
      return null;
    }
  }
  function isOnTopicPage() {
    return window.location.href.includes("https://linux.do/t/topic");
  }
  class DomEventBus {
    static instance;
    listenerMap;
    observeMap;
    constructor() {
      this.listenerMap = {};
      this.observeMap = {};
    }
    static getInstance() {
      if (!this.instance) {
        this.instance = new DomEventBus();
      }
      return this.instance;
    }
    /**
     * 监听事件
     * @param name 事件名称
     * @param listener 事件监听器
     * @param dom 如果为 null，使用事件名称查找 dom, 不为空直接使用给定的 dom
     */
    add(name, listener, dom = null) {
      if (!this.listenerMap[name]) {
        this.listenerMap[name] = [];
      }
      if (this.listenerMap[name].length === 0) {
        let observe = dom === null ? observeDom(name, () => {
          this.domEmit(name);
        }) : observeDom(dom, () => {
          this.domEmit(name);
        });
        if (observe) {
          this.observeMap[name] = observe;
        }
      }
      this.listenerMap[name].push(listener);
    }
    domEmit(event) {
      const listeners = this.listenerMap[event];
      if (listeners) {
        for (const listener of listeners) {
          listener();
        }
      }
    }
    emit(name) {
      this.domEmit(name);
    }
    clear(name) {
      if (!this.listenerMap[name]) {
        return;
      }
      this.listenerMap[name] = [];
    }
  }
  function createCodeElement(key) {
    let realKey = key;
    let copied = false;
    let root = document.createElement("div");
    root.className = "bg-white p-6 rounded-lg mb-4 shadow";
    root.innerHTML = `
        <h2>DeepLX Api Key</h2>
        <div class="code-box">
            <span class="hljs language-text">${key.replace(key.substring(12, 21), "**加密**")}</span>
        </div>
    `;
    let copyButton = document.createElement("span");
    copyButton.className = "copy";
    copyButton.innerHTML = "复制";
    copyButton.addEventListener("click", async () => {
      if (!copied) {
        await navigator.clipboard.writeText(realKey);
        copied = true;
        copyButton.innerHTML = "已复制";
        let timer = setTimeout(() => {
          copied = false;
          copyButton.innerHTML = "复制";
          clearInterval(timer);
        }, 2e3);
      }
    });
    root.querySelector("div.code-box")?.appendChild(copyButton);
    let connectButton = document.createElement("a");
    connectButton.className = "btn btn-primary connect-button";
    connectButton.href = "https://connect.linux.do";
    connectButton.target = "_blank";
    connectButton.innerHTML = "前往 Connect 站";
    root.appendChild(connectButton);
    return root;
  }
  function createWindow(title, key, levelTable, onClose) {
    let root = document.createElement("div");
    root.setAttribute("id", "level-window");
    root.className = "level-window";
    root.style.right = document.querySelector("div.chat-drawer.is-expanded") ? "430px" : "15px";
    root.innerHTML = `
     <div class="title">
         <span class="close" id="close-button">
              <svg class="fa d-icon d-icon-times svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
                  <use href="#xmark"></use>
              </svg>
         </span>
         <div id="content" class="content"></div>
     </div>`;
    let window2 = root.querySelector("div#content");
    if (window2) {
      window2.appendChild(title);
      window2.appendChild(createCodeElement(key));
      window2.appendChild(levelTable);
    }
    let close = root.querySelector("span#close-button");
    close?.addEventListener("click", onClose);
    DomEventBus.getInstance().add("div.chat-drawer-outlet-container", () => {
      let chat = document.querySelector("div.chat-drawer.is-expanded");
      root.style.right = chat ? "430px" : "15px";
    });
    let chatContainer = document.querySelector("div.chat-drawer-outlet-container");
    if (chatContainer) {
      let observer = new MutationObserver((_) => {
        let chat = document.querySelector("div.chat-drawer.is-expanded");
        root.style.right = chat ? "430px" : "15px";
      });
      observer.observe(chatContainer, { childList: true });
    }
    return root;
  }
  class DivLink {
    element;
    icon;
    iconSlot;
    constructor(anchor, title) {
      this.element = document.createElement("div");
      this.element.title = title;
      this.element.style.cursor = "pointer";
      this.element.innerHTML = anchor.innerHTML;
      if (anchor.childElementCount === 1) {
        this.icon = anchor.firstElementChild.outerHTML;
        this.iconSlot = this.element;
      } else if (anchor.childElementCount === 0) {
        this.icon = anchor.innerHTML;
        this.iconSlot = this.element;
      } else {
        const svg = this.element.querySelector("svg");
        if (svg) {
          this.icon = svg.outerHTML;
          this.iconSlot = svg.parentElement;
        } else {
          throw new Error("没有找到图标");
        }
      }
    }
    addClickListener(listener, options) {
      this.element.addEventListener("click", listener, options);
    }
    setLoading(loading, size = 60) {
      this.iconSlot.innerHTML = loading ? getLoadingSvg(size) : this.icon;
    }
    setClassName(className) {
      this.element.className = className;
    }
    setStyle(style) {
      this.element.style.cssText = style;
    }
    setAttribute(name, value) {
      this.element.setAttribute(name, value);
    }
  }
  class Metaverse extends Base {
    metaverseWindow = void 0;
    connectWindow = void 0;
    init() {
      this.relaceMetaverseAnchor();
      this.relaceConnectAnchor();
    }
    relaceConnectAnchor() {
      let connectAnchor = document.querySelector('a[href="https://connect.linux.do"]');
      if (connectAnchor) {
        const link = new DivLink(connectAnchor, "LINUX DO Connect");
        link.setClassName("sidebar-section-link sidebar-row");
        link.addClickListener(async () => {
          link.setLoading(true);
          await this.onConnectLinkClicked();
          link.setLoading(false);
        });
        connectAnchor.parentElement?.appendChild(link.element);
        connectAnchor.remove();
      }
    }
    relaceMetaverseAnchor() {
      let metaverseAnchor = document.querySelector('a[href="https://linux.do/pub/resources"]');
      if (metaverseAnchor) {
        const link = new DivLink(metaverseAnchor, "点击：社区子系统和元宇宙\nCTRL+点击：LINUX DO Connect");
        link.setClassName("btn no-text icon btn-flat");
        link.addClickListener(async (e) => {
          link.setLoading(true);
          await this.onMetaverseLinkClicked(e);
          link.setLoading(false);
        });
        metaverseAnchor.parentElement?.appendChild(link.element);
        metaverseAnchor.remove();
      }
    }
    async onMetaverseLinkClicked(event) {
      if (event.ctrlKey) {
        await this.onConnectLinkClicked();
      } else {
        if (this.metaverseWindow) {
          this.closeMetaverseWindow();
          return;
        }
        const metaverse = await getMetaverse();
        if (metaverse.status) {
          if (this.connectWindow) {
            this.closeConnectWindow();
          }
          this.metaverseWindow = createUI(metaverse.content, () => {
            this.closeMetaverseWindow();
          });
          const connect = this.metaverseWindow.querySelector('a[href="https://connect.linux.do"]');
          if (connect) {
            connect.parentElement?.appendChild(this.createConnectDivLink(connect).element);
            connect.remove();
          }
          const header = document.querySelector("div.panel[role=navigation]");
          if (header) {
            header.appendChild(this.metaverseWindow);
          } else {
            console.error("query div.panel[role=navigation] error");
          }
        } else {
          this.showError("错误", metaverse.error);
          console.error(metaverse.error);
        }
      }
    }
    createConnectDivLink(connect) {
      const link = new DivLink(connect, "LINUX DO Connect");
      link.setClassName("metaverse-div-link");
      link.addClickListener(async () => {
        await this.onConnectLinkClicked();
      });
      return link;
    }
    async onConnectLinkClicked() {
      if (this.connectWindow) {
        this.closeConnectWindow();
        return;
      }
      const result = await getLevelFromConnect();
      if (result.status) {
        const connect = this.loadDomFromString(result.content);
        this.createConnectWindow(connect);
        this.closeMetaverseWindow();
      } else {
        showMessageBox(result.error, "错误", [{
          text: "确认",
          type: "btn-primary",
          onClicked: () => {
          }
        }, {
          text: "前往 Connect 查看",
          type: "",
          onClicked: () => {
            window.open("https://connect.linux.do/", "_blank");
          }
        }]);
      }
    }
    loadDomFromString(content) {
      let parser = new DOMParser();
      return parser.parseFromString(content, "text/html").body;
    }
    getContentsFromDom(dom) {
      let title = dom.querySelector("h1.text-2xl");
      title?.querySelector('a[href^="/logout/"]')?.remove();
      let levelTable = dom.querySelector("div.bg-white.p-6.rounded-lg.mb-4.shadow table")?.parentElement;
      let key = dom.querySelector("div.bg-white.p-6.rounded-lg.mb-4.shadow p strong")?.innerHTML;
      let status = key !== void 0 && levelTable !== null;
      return {
        status,
        key,
        title,
        content: levelTable,
        error: status ? null : "解析 Connect 数据错误。"
      };
    }
    createConnectWindow(content) {
      const connect = this.getContentsFromDom(content);
      if (connect.status) {
        this.connectWindow = createWindow(connect.title, connect.key, connect.content, () => {
          this.closeConnectWindow();
        });
        document.body.appendChild(this.connectWindow);
      } else {
        this.showError("错误", connect.error);
      }
    }
    closeConnectWindow() {
      if (this.connectWindow) {
        this.connectWindow.remove();
        this.connectWindow = void 0;
      }
    }
    closeMetaverseWindow() {
      if (this.metaverseWindow) {
        this.metaverseWindow.remove();
        this.metaverseWindow = void 0;
      }
    }
  }
  function initMetaverse() {
    const metaverse = new Metaverse();
    metaverse.init();
  }
  class Emoji {
    moveElementToFirstBySelector(selector, root, click = false) {
      let node = root.querySelector(selector);
      if (node) {
        root.insertBefore(node, root.children[0].nextSibling);
        if (click && node instanceof HTMLButtonElement) {
          node.click();
          if (root.children[0] instanceof HTMLElement) {
            const timer = setInterval(() => {
              if (root.children[0] instanceof HTMLElement) {
                root.children[0].click();
              }
              clearInterval(timer);
            }, 50);
          }
        }
      }
    }
    customs = ["飞书", "小红书", "b站", "贴吧"];
    onEmojiPickerOpen = () => {
      let loadTimes = 0;
      let emojiPicker = document.querySelector("div.emoji-picker");
      if (emojiPicker) {
        let timer = setInterval(() => {
          let emojiButtons = emojiPicker.querySelector("div.emoji-picker__sections-nav");
          let emojiContainer = emojiPicker.querySelector("div.emoji-picker__sections");
          if (emojiButtons && emojiContainer) {
            for (const custom of this.customs) {
              this.moveElementToFirstBySelector(`div[data-section="${custom}"]`, emojiContainer);
              this.moveElementToFirstBySelector(`button[data-section="${custom}"]`, emojiButtons, custom === "贴吧");
            }
            clearInterval(timer);
          }
          loadTimes++;
          if (loadTimes >= 300) {
            console.warn("emoji 加载缓慢，跳过修正，下次打开表情面板即可正常显示。");
            clearInterval(timer);
          }
        });
      }
    };
    observe = new MutationObserver(this.onEmojiPickerOpen);
    init() {
      observeDom("div#reply-control", (replay) => {
        this.onReplayOpen(replay);
      });
    }
    onReplayOpen(replay) {
      if (replay.className.includes("open")) {
        let menu = document.querySelector("div#d-menu-portals");
        if (menu) {
          this.observe.observe(menu, { childList: true });
        } else {
          console.error("querySelector:div.d-editor");
        }
      } else {
        this.observe.disconnect();
      }
    }
  }
  function initEmoji() {
    new Emoji().init();
  }
  function createFloor(num) {
    let button = document.createElement("button");
    button.className = "btn no-text btn-icon btn-flat";
    button.setAttribute("title", `${num}楼`);
    button.setAttribute("id", "floor-button");
    button.innerHTML = `<span class='d-button-label floor-text'>#${num}</span>`;
    return button;
  }
  class Floor {
    eventBus;
    floorObservers;
    constructor() {
      this.eventBus = DomEventBus.getInstance();
      this.floorObservers = {};
    }
    observeUrl() {
      const changed = () => {
        const timer = setInterval(() => {
          if (isOnTopicPage()) {
            this.eventBus.add("div.post-stream", () => {
              if (isOnTopicPage()) {
                this.fixFloorDom();
              }
            });
            this.fixFloorDom();
          } else {
            this.clearFloorObservers();
            this.eventBus.clear("div.post-stream");
          }
          clearInterval(timer);
        });
      };
      this.eventBus.add("div#main-outlet", changed);
      if (isOnTopicPage()) {
        this.eventBus.emit("div#main-outlet");
      }
    }
    clearFloorObservers() {
      for (const key in this.floorObservers) {
        this.floorObservers[key].disconnect();
      }
      this.floorObservers = {};
    }
    fixFloorDom() {
      let timer = setInterval(() => {
        let floors = Array.from(document.querySelectorAll("div.post-stream > div"));
        for (const floor of floors) {
          this.fix(floor);
        }
        clearInterval(timer);
      });
    }
    fix(floor) {
      const number = floor.getAttribute("data-post-number");
      if (number) {
        if (floor.className !== "post-stream--cloaked") {
          if (floor.querySelector("button#floor-button")) {
            return;
          }
          const actions = floor.querySelectorAll("article section nav div.actions");
          const floorButton = createFloor(number);
          if (actions.length > 0) {
            const i = actions.length === 2 ? 1 : 0;
            actions[i].appendChild(floorButton);
          } else {
            console.error("query actions error.");
          }
          if (!this.floorObservers[number]) {
            const observer = observeDom(floor, () => {
              this.fix(floor);
            }, { childList: true });
            this.floorObservers[number] = observer;
          }
        }
      }
    }
    init() {
      this.observeUrl();
    }
  }
  function initFloor() {
    new Floor().init();
  }
  function init() {
    window.addEventListener("load", (event) => {
      if (event.target === document && !event.bubbles) {
        initFloor();
        initEmoji();
        initMetaverse();
      }
    });
  }
  init();

})();