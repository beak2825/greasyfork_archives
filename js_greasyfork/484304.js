// ==UserScript==
// @name         Soul Plus增强套件
// @license      MIT
// @namespace    http://otakustay.me
// @version      1.0.3
// @description  Soul-Plus Kit
// @author       otakustay
// @match        https://www.south-plus.net/read.php?*
// @match        https://gofile.io/d/*
// @match        https://workupload.com/archive/*
// @match        https://workupload.com/file/*
// @grant        GM.setClipboard
// @grant        GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/484304/Soul%20Plus%E5%A2%9E%E5%BC%BA%E5%A5%97%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/484304/Soul%20Plus%E5%A2%9E%E5%BC%BA%E5%A5%97%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
  "use strict";
  function waitForElementVisible(selector, options) {
    const detect = (resolve) => {
      const result = document.querySelector(selector);
      if (result) {
        resolve(result);
      } else {
        setTimeout(detect, options.interval, resolve);
      }
    };
    const abort = (resolve, reject) => {
      setTimeout(() => reject(new Error(`Query ${selector} timed out`)), options.timeout);
    };
    return Promise.race([new Promise(detect), new Promise(abort)]);
  }
  function dispatchClick(element) {
    if ("click" in element) {
      element.click();
    } else {
      const event = new MouseEvent("click");
      element.dispatchEvent(event);
    }
  }
  function selectElementContext(selectors2, args) {
    const context = {};
    for (const [key, selector] of Object.entries(selectors2)) {
      if (typeof selector === "string") {
        const element = document.querySelector(selector.replace(/!$/, ""));
        if (selector.endsWith("!") && !element) {
          throw new Error(`Unable to find required element "${selector}"`);
        }
        context[key] = element;
      } else {
        const element = selector(args);
        context[key] = element;
      }
    }
    return context;
  }
  function injectStyle(strings, ...values) {
    const parts = [];
    for (let i = 0; i < strings.length; i++) {
      parts.push(strings[i]);
      if (i < values.length) {
        parts.push(values[i]);
      }
    }
    const element = document.createElement("style");
    element.textContent = parts.join("").trim();
    element.setAttribute("data-source", "south-plus-kit");
    document.head.appendChild(element);
  }
  function registerGlobalShortcut(key, listener) {
    document.addEventListener(
      "keyup",
      (e) => {
        if (e.key === key) {
          listener();
        }
      }
    );
  }
  class Banner {
    dom;
    constructor() {
      this.dom = document.createElement("div");
      this.dom.className = "spk-banner";
    }
    add(text) {
      const label = document.createElement("span");
      label.className = "spk-banner-text";
      label.innerText = text;
      this.dom.appendChild(label);
    }
    render() {
      document.body.appendChild(this.dom);
    }
  }
  injectStyle`
            .spk-banner {
                position: fixed;
                z-index: 1;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1em;
                height: 2em;
                padding: 0 4em;
                background-color: hsl(358, 96%, 60%);
                color: #fff;
            }
        `;
  const selectors$1 = {
    titleLabel: "#subject_tpc!",
    purchaseButton: 'input[value="愿意购买,我买,我付钱"]',
    purchasedContent: "blockquote.jumbotron",
    goLink: 'a[href^="https://gofile.io/"]',
    workUploadLink: 'a[href^="https://workupload.com/"]',
    megaLink: 'a[href^="https://mega.nz/"]'
  };
  class SouthPlusLogic {
    constructor(context) {
      this.context = context;
    }
    static initialize() {
      const context = selectElementContext(selectors$1, {});
      return new SouthPlusLogic(context);
    }
    canDownload() {
      return !!(this.context.goLink ?? this.context.workUploadLink ?? this.context.megaLink);
    }
    canPurchase() {
      return !this.context.purchasedContent && !!this.context.purchaseButton;
    }
    canCopy() {
      return !!this.context.titleLabel;
    }
    isSatisfied() {
      return this.canDownload() || this.canPurchase();
    }
    purchase() {
      if (this.context.purchaseButton) {
        dispatchClick(this.context.purchaseButton);
      }
    }
    openAvailableLink() {
      if (this.context.goLink) {
        this.openDownloadLink(this.context.goLink);
      } else if (this.context.workUploadLink) {
        this.openDownloadLink(this.context.workUploadLink);
      } else if (this.context.megaLink) {
        const url = new URL(this.context.megaLink.getAttribute("href"));
        url.searchParams.set("__spk_download__", "immediate");
        void GM.openInTab(url.toString(), { active: true });
      }
    }
    copyTitle() {
      if (this.context.titleLabel) {
        void GM.setClipboard(this.context.titleLabel.innerText.replaceAll(":", " "));
      }
    }
    openDownloadLink(element) {
      const url = new URL(element.getAttribute("href"));
      if (this.context.titleLabel) {
        url.searchParams.set("__spk_download__", this.context.titleLabel.innerText);
      }
      void GM.openInTab(url.toString(), { active: true });
    }
  }
  function setupSouthPlus() {
    const logic = SouthPlusLogic.initialize();
    if (!logic.isSatisfied()) {
      return;
    }
    const banner = new Banner();
    if (logic.canDownload()) {
      banner.add("下载资源 [D]");
      registerGlobalShortcut("d", () => logic.openAvailableLink());
    }
    if (logic.canPurchase()) {
      banner.add("购买资源 [B]");
      registerGlobalShortcut("b", () => logic.purchase());
    }
    if (logic.canCopy()) {
      banner.add("复制标题 [C]");
      registerGlobalShortcut("c", () => logic.copyTitle());
    }
    banner.render();
  }
  const SPLIT_REGEX = /[[\]()【】+_\-.・!\s]/;
  function mostSimilar(from, to) {
    const toTokens = to.split(SPLIT_REGEX).filter((v) => v.length > 1);
    const state = {
      max: 0,
      value: ""
    };
    for (const value of from) {
      if (value === to) {
        return value;
      }
      const fromTokens = value.split(SPLIT_REGEX).filter((v) => v.length > 1);
      const intersected = toTokens.filter((v) => fromTokens.includes(v));
      const similarity = intersected.length / toTokens.length;
      if (similarity > state.max) {
        state.max = similarity;
        state.value = value;
      }
    }
    return state.value;
  }
  const selectors = {
    row: ({ name }) => {
      const elements = [...document.querySelectorAll(".item_open")];
      const targetText = mostSimilar(elements.map((v) => v.innerText), name);
      const element = elements.find((v) => v.innerText === targetText);
      return element ? element.closest("[data-item-id]") : null;
    }
  };
  class GoFileLogic {
    constructor(context) {
      this.context = context;
    }
    static initialize(name) {
      const context = selectElementContext(selectors, { name });
      return new GoFileLogic(context);
    }
    hasContent() {
      return !!this.context.row;
    }
    highlightRow() {
      var _a;
      (_a = this.context.row) == null ? void 0 : _a.classList.add("spk-row-active");
    }
    download() {
      var _a;
      const button = (_a = this.context.row) == null ? void 0 : _a.querySelector("button.item_download");
      if (button) {
        dispatchClick(button);
      }
    }
  }
  async function setupGoFile() {
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get("__spk_download__");
    injectStyle`
        .spk-row-active {
            background-color: hsl(358, 96%, 25%);
        }
    `;
    if (!name) {
      return;
    }
    await waitForElementVisible(".item_open", { timeout: 10 * 1e3, interval: 100 });
    const logic = GoFileLogic.initialize(name);
    if (!logic.hasContent()) {
      return;
    }
    logic.highlightRow();
    const banner = new Banner();
    banner.add("下载 [D]");
    registerGlobalShortcut("d", () => logic.download());
    banner.render();
  }
  const archiveSelectors = {
    container: ({ name }) => {
      const elements = document.querySelectorAll(".filename");
      const element = [...elements].find((v) => v.innerText.includes(name));
      return element ? element.closest(".frame") : null;
    }
  };
  class WorkUploadArchiveLogic {
    constructor(context) {
      this.context = context;
    }
    static initialize(name) {
      const context = selectElementContext(archiveSelectors, { name });
      return new WorkUploadArchiveLogic(context);
    }
    hasContent() {
      return !!this.context.container;
    }
    highlightRow() {
      var _a;
      (_a = this.context.container) == null ? void 0 : _a.classList.add("spk-row-active");
    }
    download() {
      var _a;
      const link = (_a = this.context.container) == null ? void 0 : _a.querySelector(".filedownload > a");
      if (link) {
        dispatchClick(link);
      }
    }
  }
  const fileSelectors = {
    downloadButton: "a.btn.btn-prio"
  };
  class WorkUploadFileLogic {
    constructor(context) {
      this.context = context;
    }
    static initialize() {
      const context = selectElementContext(fileSelectors, {});
      return new WorkUploadFileLogic(context);
    }
    hasContent() {
      return !!this.context.downloadButton;
    }
    download() {
      if (this.context.downloadButton) {
        dispatchClick(this.context.downloadButton);
      }
    }
  }
  async function setupArchivePage() {
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get("__spk_download__");
    injectStyle`
        .spk-row-active {
            background-color: #f6c050;
        }
    `;
    if (!name) {
      return;
    }
    await waitForElementVisible(".filename", { timeout: 10 * 1e3, interval: 100 });
    const logic = WorkUploadArchiveLogic.initialize(name);
    if (!logic.hasContent()) {
      return;
    }
    logic.highlightRow();
    const banner = new Banner();
    banner.add("下载 [D]");
    registerGlobalShortcut("d", () => logic.download());
    banner.render();
  }
  async function setupFilePage() {
    await waitForElementVisible("a.btn.btn-prio", { timeout: 10 * 1e3, interval: 100 });
    const logic = WorkUploadFileLogic.initialize();
    if (!logic.hasContent()) {
      return;
    }
    const banner = new Banner();
    banner.add("下载 [D]");
    registerGlobalShortcut("d", () => logic.download());
    banner.render();
  }
  async function setupWorkUpload() {
    const path = location.pathname;
    if (path.startsWith("/archive/")) {
      await setupArchivePage();
    } else if (path.startsWith("/file/")) {
      await setupFilePage();
    }
  }
  switch (location.hostname) {
    case "www.south-plus.net":
      setupSouthPlus();
      break;
    case "gofile.io":
      void setupGoFile();
      break;
    case "workupload.com":
      void setupWorkUpload();
      break;
  }
})();
