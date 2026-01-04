// ==UserScript==
// @name 巴哈姆特_新版B頁板務功能Re
// @namespace Bee10301
// @version 9.5
// @description 巴哈姆特哈拉區新體驗。
// @author Bee10301
// @match https://removed.www.gamer.com.tw/
// @match https://removed.www.gamer.com.tw/index2.php*
// @match https://forum.gamer.com.tw/B.php?*
// @match https://forum.gamer.com.tw/C.php?*
// @match https://forum.gamer.com.tw/2025/?bsn*
// @homepage https://home.gamer.com.tw/home.php?owner=bee10301
// @icon https://home.gamer.com.tw/favicon.ico
// @connect *
// @grant GM_xmlhttpRequest
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/375498/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9_%E6%96%B0%E7%89%88B%E9%A0%81%E6%9D%BF%E5%8B%99%E5%8A%9F%E8%83%BDRe.user.js
// @updateURL https://update.greasyfork.org/scripts/375498/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9_%E6%96%B0%E7%89%88B%E9%A0%81%E6%9D%BF%E5%8B%99%E5%8A%9F%E8%83%BDRe.meta.js
// ==/UserScript==

/**
 * 巴哈姆特插件 - 核心配置與初始化模組
 * 負責插件的基本配置、設定管理和初始化流程
 */
class BahamutePlugin {
  constructor() {
    this.version = "9.0";
    this.isNewVersion = false;
    this.settings = new SettingsManager();
    this.init();
  }

  /**
   * 插件初始化（舊版棄置）
   */
  async init() {
    try {
      this.isNewVersion = await this.detectMode();
      //this.settings.checkFirstRun();
      //await this.addSettingElement(this.isNewVersion);
      //await this.initializeWorkers();
      //this.checkTips(this.isNewVersion);
      //this.reportAlert(this.isNewVersion);
    } catch (error) {
      console.error("[ERROR] Plugin initialization failed:", error);
    }
  }

  /**
   * 檢測頁面模式（新版/舊版）
   * @returns {Promise<boolean>} 是否為新版
   */
  async detectMode() {
    if (document.querySelector(".forum-nav-main") !== null) {
      await this.waitForElement(".forum-list-normal");
      this.setupNewVersionStyles();
      return true;
    }
    return false;
  }

  /**
   * 等待特定元素出現
   * @param {string} selector - CSS選擇器
   */
  waitForElement(selector) {
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  /**
   * 設置新版樣式
   */
  setupNewVersionStyles() {
    const styleSheet = document.createElement("style");
    document.head.appendChild(styleSheet);
    const sheet = styleSheet.sheet;

    // C頁管理工具樣式
    sheet.insertRule(
      ".c-section:has(div.c-section__main.managertools) { position: sticky; bottom: 0; right: 0; z-index: 100; transform: translateX(85%); transition: 0.5s cubic-bezier(0,.67,0,1.05); }",
      0
    );
    sheet.insertRule(
      ".c-section:has(div.c-section__main.managertools):hover { transform: translateX(0vw); }",
      0
    );
    // C頁避免誤點上一頁
    sheet.insertRule(".article-back { display: none !important; }", 0);
    // 快速回覆樣式
    sheet.insertRule(
      `.c-section:has(div.c-section__main.c-editor.c-quick-reply) { position: sticky; bottom: 50px; right: 0; z-index: 99; transform: translateX(85%); transition: 0.5s cubic-bezier(0,.67,0,1.05); }`,
      0
    );
    sheet.insertRule(
      ".c-section:has(div.c-section__main.c-editor.c-quick-reply):hover { transform: translateX(0vw); }",
      0
    );

    this.setupPreviewBox();
    this.setupTopBarCover();
  }

  /**
   * 設置預覽框
   */
  setupPreviewBox() {
    const previewBox = document.getElementById("article-content-box");
    if (!previewBox) return;

    previewBox.style.width = "0%";
    previewBox.style.transition = "0.5s cubic-bezier(0,.67,0,1.05)";
    previewBox.style.zIndex = "999";
    previewBox.style.transform =
      this.settings.get("preview_LR") === "true"
        ? "translateX(100%)"
        : "translateX(-150%)";
  }

  /**
   * 設置頂部遮罩
   */
  setupTopBarCover() {
    const topBarCover = document.createElement("div");
    topBarCover.className = "bee-top-bar-cover";

    Object.assign(topBarCover.style, {
      width: "100vw",
      height: "0%",
      backgroundColor: "var(--f1-bg)",
      position: "absolute",
      top: "0",
      left: "0",
      transition: "0.5s cubic-bezier(0,.67,0,1.05)",
      zIndex: "990",
    });

    topBarCover.addEventListener("click", (e) => {
      const previewBox = document.getElementById("article-content-box");
      if (previewBox) {
        previewBox.style.transform =
          this.settings.get("preview_LR") === "true"
            ? "translateX(100%)"
            : "translateX(-150%)";
      }
      // 棄用內建返回按鈕
      // if (
      //   window.getComputedStyle(document.querySelector(".article-back"))
      //     .display !== "none"
      // ) {
      //   document.querySelector(".article-back").click();
      // }

      // 將網址 snA sn cPage 參數移除
      const url = new URL(window.location.href);
      url.searchParams.delete("snA");
      url.searchParams.delete("sn");
      url.searchParams.delete("cPage");
      window.history.replaceState({}, "", url.toString());

      topBarCover.style.height = "0%";
      topBarCover.style.opacity = "1";
      // remove skip floor btn
      document.getElementById("floating-skip-button")?.remove();
      // remove quick replay
      document
        .querySelector(".article-content-box .c-editor.c-quick-reply")
        ?.remove();
      // remove managertools
      document.querySelector(".article-content-box .managertools")?.remove();
      return false;
    });

    const topBar = document.querySelector(".main-nav");
    if (topBar) {
      topBar.parentNode.insertBefore(topBarCover, topBar.nextSibling);
      document.querySelector(".main-nav__row").style.height = "auto";
    }
  }

  /**
   * 初始化工作模組
   */
  async initializeWorkers() {
    const bPageWorker = new BPageWorker(this.isNewVersion, this.settings);
    const cPageWorker = new CPageWorker(this.settings);

    await bPageWorker.init();
    await cPageWorker.init();
  }

  /**
   * 檢查提示
   */
  checkTips(newVer) {
    const tipsManager = new TipsManager(this.settings);
    tipsManager.checkTips(newVer);
  }

  /**
   * 檢查檢舉提醒
   */
  reportAlert(newVer) {
    const reportManager = new ReportManager(this.settings);
    reportManager.checkAlert(newVer);
  }
}

/**
 * 設定管理器
 */
class SettingsManager {
  constructor() {
    this.defaultSettings = this.getDefaultSettings();
  }

  /**
   * 獲取預設設定
   */
  getDefaultSettings() {
    return {
      isFirstRun: "false",
      add_function: "true",
      preview_auto: "true",
      preview_wait_load: "false",
      preview_size: "80%",
      new_design: "true",
      new_design_box: "80%",
      new_design_box_Left: "65%",
      new_design_box_Right: "18%",
      new_design_LRSwitch: "false",
      bee_select_color: "#000000b3",
      addBorderInPicMode: "true",
      showTips: "true",
      preview_LR: "true",
      showAbuse: "true",
      addSummaryBtn: "true",
      oaiBaseUrl: "https://api.openai.com/v1/chat/completions",
      oaiKey: "sk-yourKey",
      oaiModel: "gpt-3.5-turbo",
      oaiPrompt: `## workflow
1. 總結：精確的讀懂和理解文章，然後用一句話脈絡清晰的語句，總結出[文章的主旨]。
2. 提煉重點：根據文章的邏輯和結構，清楚列出文章的主要論點，並按照下方範例的格式輸出。

總結：
- 要點1：
- 要點2：
...(依情況增加或減少要點)

## MUST/IMPORTANT/RULES
- 不能添加其他個人觀點或註釋。
- 使用繁體中文`,
      oaiPromptCmd:
        "以下是一段群組聊天的對話，總結對話中的話題，用條列式列出使用者的想法。\n## workflow \n 1. 整理話題：理解各個使用者討論的話題並以話題為單位整理出整串對話的話題 \n 2. 將相同話題中，對同一件事有相似想法的對話整理在一起(例如 `@user1/@user2：認為太貴了`) ，不同看法則單獨列出。\n 3. 輸出：把冗餘贅字優化，但保留具體描述。(劣例:`@user1/@user2：提及角色在世界觀中的地位和特徵` 在這個例子中沒有具體描述提及了什麼樣的地位或特徵)。使用者以 @id 標記並且不再添加其他md語法。 \n ## MUST/IMPORTANT/RULES \n- 不能添加其他個人觀點或註釋。\n- 使用繁體中文\n",
      oaiPromptChat:
        "根據文章內容，使用繁體中文流暢語言，簡潔的回答使用者的問題。",
      custom_oaiPrompt: "",
      custom_oaiPromptCmd: "",
      custom_oaiPromptChat: "",
      oaiPromptSystemMode: "true",
      oaiPromptDate: "20241101",
      oaiPromptUpdateDate: "20241101",
      oaiPromptUpdateURL: "https://gamercomtwnew.bee.moe/gamer.prompts.json",
      oaiPromptUpdateSleep: "1",
      cleanMode: "false",
      cleanModeSize: "4rem",
      homeStyleSwitch: "true",
      homeTips: "true",
    };
  }

  /**
   * 檢查首次運行
   */
  checkFirstRun(reset = false) {
    console.log("[INFO] Init data");

    Object.entries(this.defaultSettings).forEach(([key, defaultValue]) => {
      if (this.get(key) === "" || this.get(key) === null || reset === true) {
        this.set(key, defaultValue);
      }
    });

    // 特殊處理：更新舊版URL
    if (
      this.get("oaiPromptUpdateURL") ===
      "https://gamercomtwnew.bee.moe/gamer.prompts.js"
    ) {
      this.set(
        "oaiPromptUpdateURL",
        "https://gamercomtwnew.bee.moe/gamer.prompts.json"
      );
    }
  }

  /**
   * 獲取設定值
   */
  get(key) {
    return localStorage.getItem(key);
  }

  /**
   * 設置設定值
   */
  set(key, value) {
    localStorage.setItem(key, value);
  }

  /**
   * 獲取布林值設定
   */
  getBool(key) {
    return this.get(key) === "true";
  }
}
/**
 * B頁面工作模組
 * 負責B頁面的所有功能，包括即時預覽、版面設計、功能按鈕等
 */
class BPageWorker {
  constructor(isNewVersion, settings) {
    this.isNewVersion = isNewVersion;
    this.settings = settings;
    this.previewFrame = null;
  }

  /**
   * 初始化B頁面功能
   */
  async init() {
    if (!this.isBPage()) return;

    await this.initializePreview();
    this.initializeLayout();
    this.initializeInteractions();
    this.initializeMenu();
    this.initializeDesign();
    this.initializeFunctions();
    this.initializeStyles();
  }

  /**
   * 檢查是否為B頁面
   */
  isBPage() {
    return (
      document.querySelector(".forum-list-normal") ||
      document.querySelector(".b-list__head")
    );
  }

  /**
   * 初始化預覽功能
   */
  async initializePreview() {
    await this.setupPreviewAuto();

    if (!this.isNewVersion && this.settings.getBool("preview_auto")) {
      await this.createPreviewFrame();
    }
  }

  /**
   * 設置自動預覽
   */
  async setupPreviewAuto() {
    if (this.isNewVersion) {
      await this.setupNewVersionPreview();
    } else {
      this.setupOldVersionPreview();
    }
  }

  /**
   * 設置新版預覽
   */
  async setupNewVersionPreview() {
    const articleListContainer = document.querySelector("#list");
    if (!articleListContainer) {
      console.warn("⚠️ 文章列表容器未找到！");
      return;
    }
    articleListContainer.addEventListener("click", async (e) => {
      if (e.target.closest(".forum-item-info")) {
        e.preventDefault();
        await this.showNewVersionPreview();
        return false;
      }
    });

    // 如果網址帶有 snA 參數
    if (window.location.href.includes("snA=")) {
      await this.showNewVersionPreview();
    }
  }

  /**
   * 顯示新版預覽
   */
  async showNewVersionPreview() {
    const previewBox = document.getElementById("article-content-box");
    const topBarCover = document.querySelector(".bee-top-bar-cover");

    previewBox.style.transform = "translateX(0%)";
    previewBox.style.width = this.settings.get("preview_size") || "80%";

    topBarCover.style.height = "100vh";
    topBarCover.style.opacity = "0.7";

    // 等待C頁面載入並添加AI功能
    await this.waitForCPageLoad();
  }

  /**
   * 等待C頁面載入
   */
  async waitForCPageLoad() {
    return new Promise((resolve) => {
      const observer = new MutationObserver(async (mutations) => {
        if (document.querySelectorAll(".c-section__main.c-post").length > 0) {
          observer.disconnect();
          // 移動快速回覆、板務工具
          let managertools = document.querySelector(".managertools");
          if (managertools) {
            managertools = document
              .querySelector(".article-content-box")
              .appendChild(managertools.parentElement);
          }
          const quickReply = document.querySelector(".c-editor.c-quick-reply");
          if (quickReply) {
            document
              .querySelector(".article-content-box")
              .appendChild(quickReply.parentElement);
          }
          // 添加額外功能
          if (this.settings.getBool("addSummaryBtn")) {
            const cPageWorker = new CPageWorker(this.settings);
            await cPageWorker.addPostButtons(this.isNewVersion);
            cPageWorker.addSkipFloorButton();
          }
          resolve();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  /**
   * 設置舊版預覽
   */
  setupOldVersionPreview() {
    this.handlePicModeAdjustment();
    this.setupOldVersionClickHandlers();
  }

  /**
   * 處理圖片模式調整
   */
  handlePicModeAdjustment() {
    const picMode = document.querySelectorAll(".imglist-text").length !== 0;

    if (picMode) {
      const switchTopics = document.querySelectorAll(".b-list__main");
      switchTopics.forEach((topic) => {
        const topicTexts = topic.childNodes[1].childNodes[3];
        if (topicTexts && topicTexts.className === "imglist-text") {
          topic.childNodes[1].removeChild(topicTexts);
          topic.insertAdjacentHTML("beforeend", topicTexts.outerHTML);
        }
      });
    }
  }

  /**
   * 設置舊版點擊處理器
   */
  setupOldVersionClickHandlers() {
    const picMode = document.querySelectorAll(".imglist-text").length !== 0;

    // 標題點擊
    const titleLinks = document.querySelectorAll(".b-list__main__title");
    titleLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");
        this.openInFrame(`https://forum.gamer.com.tw/${href}`);
        return false;
      });
    });

    // 頁面點擊
    const pageSelector = picMode
      ? "#BH-master > form > div > table > tbody > tr > td.b-list__main > div > div > span > span"
      : "#BH-master > form > div > table > tbody > tr > td.b-list__main > span > a";

    const pageLinks = document.querySelectorAll(pageSelector);
    pageLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute(picMode ? "data-page" : "href");
        this.openInFrame(`https://forum.gamer.com.tw/${href}`);
        return false;
      });
    });
  }

  /**
   * 創建預覽框架
   */
  async createPreviewFrame() {
    const previewContainer = this.createPreviewContainer();
    const iframe = this.createIframe();

    previewContainer.appendChild(iframe);
    document.body.appendChild(previewContainer);

    this.previewFrame = iframe;
    await this.initializePreviewContainer(previewContainer);
    this.setupPreviewCloseHandler();
  }

  /**
   * 創建預覽容器
   */
  createPreviewContainer() {
    const container = document.createElement("div");
    container.className = "bee_preview_wd";

    Object.assign(container.style, {
      height: "100%",
      width: this.settings.get("preview_size"),
      transform: "scaleX(0)",
      zIndex: "100",
      position: "fixed",
      top: "0px",
      [this.settings.getBool("preview_LR") ? "right" : "left"]: "1%",
    });

    return container;
  }

  /**
   * 創建iframe
   */
  createIframe() {
    const iframe = document.createElement("iframe");
    iframe.id = "bee_frame";
    iframe.title = "bee_frame";
    iframe.src = "";

    Object.assign(iframe.style, {
      border: "0em solid rgb(170, 50, 220, 0)",
      width: "100%",
      height: "100%",
    });

    return iframe;
  }

  /**
   * 初始化預覽容器
   */
  async initializePreviewContainer(container) {
    const animationDirection = this.settings.getBool("preview_LR")
      ? "rl"
      : "lr";
    await this.popElementInit(container, false, animationDirection, false);
  }

  /**
   * 設置預覽關閉處理器
   */
  setupPreviewCloseHandler() {
    const menuPath = document.querySelector("#BH-menu-path");
    if (!menuPath) return;

    Object.assign(menuPath.style, {
      transition: "all 0.5s cubic-bezier(0.21, 0.3, 0.18, 1.37) 0s",
      height: "40px",
      opacity: "1",
    });

    menuPath.addEventListener("click", () => {
      const container = document.querySelector(".bee_preview_wd");
      const direction = this.settings.getBool("preview_LR") ? "rl" : "lr";
      this.popElement(container, "false", direction);
      menuPath.style.height = "40px";
      menuPath.style.opacity = "1";
    });
  }

  /**
   * 在框架中打開URL
   */
  openInFrame(url) {
    if (!this.previewFrame) return;

    this.previewFrame.src = url;
    const menuPath = document.querySelector("#BH-menu-path");

    if (menuPath) {
      menuPath.style.height = "100%";
      menuPath.style.opacity = "0.6";
    }

    setTimeout(() => {
      const container = document.querySelector(".bee_preview_wd");
      const direction = this.settings.getBool("preview_LR") ? "rl" : "lr";
      this.popElement(container, "true", direction);
    }, 1000);

    // 設置iframe內的樣式
    setTimeout(() => {
      this.setupIframeStyles();
    }, 1000);
  }

  /**
   * 設置iframe內的樣式
   */
  setupIframeStyles() {
    try {
      const iframeDoc =
        this.previewFrame.contentDocument ||
        this.previewFrame.contentWindow.document;
      const styleSheet = iframeDoc.createElement("style");
      iframeDoc.head.appendChild(styleSheet);

      const sheet = styleSheet.sheet;
      sheet.insertRule(
        ".managertools { position: fixed; bottom: 0; right: 0; z-index: 100; }",
        0
      );
    } catch (error) {
      console.warn("無法設置iframe樣式:", error);
    }
  }

  /**
   * 初始化版面佈局
   */
  initializeLayout() {
    if (this.isNewVersion) {
      this.setupNewVersionLayout();
    } else {
      this.setupOldVersionLayout();
    }
  }

  /**
   * 設置新版版面
   */
  setupNewVersionLayout() {
    if (this.settings.getBool("cleanMode")) {
      this.enableCleanMode();
    }

    this.setupSlaveDisplay();
    this.setupOrderSwitching();
  }

  /**
   * 啟用清爽模式
   */
  enableCleanMode() {
    if (document.getElementById("cleanModeStyles")) {
      return;
    }
    const style = document.createElement("style");
    style.id = "cleanModeStyles";
    style.textContent = `
    /* 移除描述和縮圖 */
    .forum-item-desc,
    .forum-item-thumbnail {
      display: none !important;
    }
 
    /* 調整列表項目樣式 */
    .forum-list-item {
      padding: 0 !important;
      min-height: ${this.settings.get("cleanModeSize")} !important; 
    }
  `;
    document.head.appendChild(style);
  }

  /**
   * 設置從屬顯示
   */
  setupSlaveDisplay() {
    if (document.getElementById("showSlave")) {
      return;
    }
    const style = document.createElement("style");
    style.id = "showSlave";
    style.textContent = `
    #BH-slave {
      display: block !important;
    }
  `;
    document.head.appendChild(style);
  }

  /**
   * 設置順序切換
   */
  setupOrderSwitching() {
    if (document.getElementById("orderSwitching")) {
      return;
    }
    const style = document.createElement("style");
    style.id = "orderSwitching";
    style.textContent = `
    #BH-master {
      order: 2 !important;
    }
    #BH-slave {
      order: 1 !important;
      margin-left: 0 !important;
      margin-right: 12px !important;
    }
  `;
    document.head.appendChild(style);
  }

  /**
   * 設置舊版版面
   */
  setupOldVersionLayout() {
    if (this.settings.getBool("new_design_LRSwitch")) {
      const master = document.getElementById("BH-master");
      const slave = document.getElementById("BH-slave");

      if (master && slave) {
        master.style.float = "right";
        slave.style.float = "left";
      }
    }
  }

  /**
   * 初始化交互功能
   */
  initializeInteractions() {
    this.setupCheckboxSystem();
    this.setupBorderInPicMode();
  }

  /**
   * 設置複選框系統
   */
  setupCheckboxSystem() {
    const titleElements = this.getTitleElements();
    const checkboxes = this.getCheckboxElements();

    titleElements.forEach((title, index) => {
      this.setupTitleClickHandler(title, checkboxes, index);
    });
  }

  /**
   * 獲取標題元素
   */
  getTitleElements() {
    const hasImgList = document.querySelectorAll(".imglist-text").length > 0;
    return hasImgList
      ? document.getElementsByClassName("b-list__main")
      : document.getElementsByClassName("b-list__main");
  }

  /**
   * 獲取複選框元素
   */
  getCheckboxElements() {
    try {
      return document.getElementsByName("jsn[]");
    } catch (error) {
      return [];
    }
  }

  /**
   * 設置標題點擊處理器
   */
  setupTitleClickHandler(title, checkboxes, index) {
    // 防止子元素觸發
    const children = title.querySelectorAll("*");
    children.forEach((child) => {
      child.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    });

    // 重置複選框
    if (checkboxes[index]) {
      checkboxes[index].checked = false;
    }

    title.onclick = (e) => {
      this.handleTitleClick(title, checkboxes, e);
    };
  }

  /**
   * 處理標題點擊
   */
  handleTitleClick(title, checkboxes, event) {
    const hasValidContent =
      title.querySelector(".b-list__main__title") ||
      title.querySelector(".imglist-text");

    if (!hasValidContent) return;

    // 隱藏管理器
    const manager = document.querySelector(".bee_manager");
    if (manager) {
      manager.style.display = "none";
    }

    // 處理複選框邏輯
    const snA = this.extractSnA(title.innerHTML);
    if (!snA) return;

    let hasCheckedBox = false;
    checkboxes.forEach((checkbox) => {
      if (checkbox.value === snA) {
        checkbox.checked = !checkbox.checked;
        title.style.backgroundColor = checkbox.checked
          ? this.settings.get("bee_select_color")
          : "";

        if (checkbox.checked) {
          hasCheckedBox = true;
        }
      }
    });

    // 顯示管理器
    if (hasCheckedBox && manager) {
      this.showManagerAtCursor(manager, event);
    }
  }

  /**
   * 提取snA值
   */
  extractSnA(innerHTML) {
    const match = innerHTML.match(/snA=(\d*)/);
    return match ? match[1] : null;
  }

  /**
   * 在游標位置顯示管理器
   */
  showManagerAtCursor(manager, event) {
    manager.style.left = `${event.clientX + 50}px`;
    manager.style.top = `${event.clientY - 170}px`;
    manager.style.display = "block";
  }

  /**
   * 設置圖片模式邊框
   */
  setupBorderInPicMode() {
    if (!this.settings.getBool("addBorderInPicMode")) return;

    const picModeBlocks = document.querySelectorAll(
      "#BH-master > form > div > table > tbody > tr > td.b-list__main > div > p"
    );

    picModeBlocks.forEach((block) => {
      block.style.borderTop = "dashed";
    });
  }

  /**
   * 初始化選單
   */
  initializeMenu() {
    if (this.isNewVersion) return;

    this.createManagerMenu();
    this.setupLinkClickPrevention();
  }

  /**
   * 創建管理器選單
   */
  createManagerMenu() {
    try {
      const managertools = document.querySelector(".managertools");
      if (!managertools) return;

      const bManagerDiv = this.createManagerContainer();
      const buttonGroups = this.createButtonGroups(managertools);

      bManagerDiv.appendChild(this.createCheckboxContainer());
      buttonGroups.forEach((group) => bManagerDiv.appendChild(group));

      managertools.parentElement.appendChild(bManagerDiv);
    } catch (error) {
      console.warn("創建管理器選單失敗:", error);
    }
  }

  /**
   * 創建管理器容器
   */
  createManagerContainer() {
    const container = document.createElement("div");
    container.className = "b-manager managertools bee_manager";

    Object.assign(container.style, {
      zIndex: "100",
      position: "fixed",
      width: "auto",
    });

    return container;
  }

  /**
   * 創建複選框容器
   */
  createCheckboxContainer() {
    const checkboxDiv = document.createElement("div");
    checkboxDiv.className = "checkbox";

    const label = document.createElement("label");
    label.setAttribute("for", "check");

    checkboxDiv.appendChild(label);
    return checkboxDiv;
  }

  /**
   * 創建按鈕組
   */
  createButtonGroups(managertools) {
    const buttonIndexes = [
      [0, 3, 7],
      [2, 4],
      [1, 8],
      [5, 6],
    ];

    return buttonIndexes.map((indexes) => {
      const beeDiv = document.createElement("div");
      beeDiv.className = "bee";
      beeDiv.style.padding = "5px";

      indexes.forEach((index) => {
        const buttons = managertools.querySelectorAll("button");
        if (buttons[index]) {
          const button = buttons[index].cloneNode(true);
          beeDiv.appendChild(button);
        }
      });

      return beeDiv;
    });
  }

  /**
   * 設置連結點擊防止
   */
  setupLinkClickPrevention() {
    const selectors = [
      "#BH-master > form > div > table > tbody > tr > td.b-list__main > a",
      "#BH-master > form > div > table > tbody > tr > td.b-list__main",
    ];

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        element.addEventListener("click", (event) => {
          event.stopPropagation();
        });
      });
    });
  }

  /**
   * 初始化設計
   */
  initializeDesign() {
    if (!this.settings.getBool("new_design")) return;

    this.applyNewDesign();
  }

  /**
   * 應用新設計
   */
  applyNewDesign() {
    if (document.getElementById("newDesignStyles")) {
      return;
    }
    const style = document.createElement("style");
    style.id = "newDesignStyles";
    style.textContent = `
    #BH-slave {
      width: ${this.settings.get("new_design_box_Right")} !important;
      max-width: 100vw !important;
    }
    #BH-master {
      width: ${this.settings.get("new_design_box_Left")} !important;
    }
  `;
    document.head.appendChild(style);

    if (this.isNewVersion) {
      this.applyNewVersionDesign();
    } else {
      this.applyOldVersionDesign();
    }
  }

  /**
   * 應用新版設計
   */
  applyNewVersionDesign() {
    if (document.getElementById("newVersionStyles")) {
      return;
    }
    const style = document.createElement("style");
    style.id = "newVersionStyles";
    const slaveStyleCss = this.settings.getBool("new_design_LRSwitch")
      ? "left: 0% !important;"
      : "right: 0% !important;";
    const adPositionCss = this.settings.getBool("new_design_LRSwitch")
      ? "right: 0;"
      : "left: 0;";
    const showFixedRightAtLeft = this.settings.getBool("new_design_LRSwitch")
      ? ""
      : "left: 300px !important; right: unset !important;";
    style.textContent = `
    #forum-list-box {
      left: 50% !important;
      transform: translateX(-50%) !important;
    }
    .forum-box.split .forum-list-box {
      width: ${this.settings.get("new_design_box")} !important;
    }
    #BH-slave {
      position: fixed !important;
      bottom: 0% !important;
      z-index: 100 !important;
      ${slaveStyleCss}
    }
    #buildingAdB {
      position: absolute !important;
      bottom: 0 !important;
      ${adPositionCss}
    }
    .fixed-right {
      ${showFixedRightAtLeft}
    }
  `;
    document.head.appendChild(style);

    const changeAdPosition = document.getElementById("buildingAdB");
    const mainBox = document.querySelector(".forum-main");
    mainBox.prepend(changeAdPosition);
  }

  /**
   * 應用舊版設計
   */
  applyOldVersionDesign() {
    const wrapper = document.getElementById("BH-wrapper");
    if (wrapper) {
      wrapper.style.width = this.settings.get("new_design_box");
    }
  }

  /**
   * 初始化功能
   */
  initializeFunctions() {
    if (!this.settings.getBool("add_function") || this.isNewVersion) return;

    this.addFunctionButtons();
  }

  /**
   * 添加功能按鈕
   */
  addFunctionButtons() {
    const titleElements = document.getElementsByClassName("b-list__main");
    const titleLinks = document.getElementsByClassName("b-list__main__title");

    // 創建新的td元素
    const newTd = document.createElement("td");
    const filterElement = document.querySelector(".b-list__filter");
    if (filterElement) {
      filterElement.insertAdjacentElement("afterend", newTd);
    }

    // 為每個標題添加功能按鈕
    Array.from(titleElements).forEach((title, index) => {
      if (titleLinks[index]) {
        const buttonContainer = this.createFunctionButtonContainer(
          titleLinks[index]
        );
        title.insertAdjacentElement("afterend", buttonContainer);
      }
    });

    this.setupFunctionButtonHover();
  }

  /**
   * 創建功能按鈕容器
   */
  createFunctionButtonContainer(titleLink) {
    const td = document.createElement("td");
    td.style.width = "auto";

    const hrefValue = titleLink.getAttribute("href");
    const isDarkTheme = this.checkDarkTheme();

    const buttons = this.createFunctionButtons(hrefValue, isDarkTheme);
    buttons.forEach((button) => td.appendChild(button));

    return td;
  }

  /**
   * 檢查是否為暗色主題
   */
  checkDarkTheme() {
    const menuPath = document.getElementById("BH-menu-path");
    if (!menuPath) return false;

    const bgColor = window.getComputedStyle(menuPath).backgroundColor;
    return bgColor === "rgb(28, 28, 28)";
  }

  /**
   * 創建功能按鈕
   */
  createFunctionButtons(hrefValue, isDarkTheme) {
    const buttonConfigs = [
      {
        title: "快速瀏覽",
        class: "bee_preview",
        icon: "fullscreen",
        onclick: () =>
          this.openInFrame("https://forum.gamer.com.tw/" + hrefValue),
      },
      {
        title: "開新視窗",
        class: "bee_open_new_wd",
        icon: "open_in_new",
        onclick: () => window.open(hrefValue),
      },
      {
        title: "複製連結",
        class: "bee_link",
        icon: "link",
        onclick: () =>
          navigator.clipboard.writeText(
            "https://forum.gamer.com.tw/" + hrefValue
          ),
      },
    ];

    return buttonConfigs.map((config) => {
      const button = document.createElement("a");
      button.title = config.title;
      button.className = `btn-icon btn-icon--inverse ${config.class}`;
      button.style.display = "none";
      button.onclick = config.onclick;

      const icon = document.createElement("i");
      icon.className = `material-icons ${config.class}`;
      icon.textContent = config.icon;

      if (!isDarkTheme) {
        icon.style.color = "rgba(0, 0, 0, 0.4)";
      }

      button.appendChild(icon);
      return button;
    });
  }

  /**
   * 設置功能按鈕懸停效果
   */
  setupFunctionButtonHover() {
    const rows = document.querySelectorAll(".b-list__row");

    rows.forEach((row) => {
      row.addEventListener("mouseover", () => {
        this.toggleFunctionButtons(row, true);
      });

      row.addEventListener("mouseout", () => {
        this.toggleFunctionButtons(row, false);
      });
    });
  }

  /**
   * 切換功能按鈕顯示
   */
  toggleFunctionButtons(row, show) {
    const buttonClasses = [".bee_preview", ".bee_open_new_wd", ".bee_link"];

    buttonClasses.forEach((className) => {
      const button = row.querySelector(className);
      if (button) {
        button.style.display = show ? "" : "none";
      }
    });
  }

  /**
   * 初始化樣式
   */
  initializeStyles() {
    // 樣式相關的初始化可以在這裡添加
  }

  /**
   * 彈出元素初始化
   */
  async popElementInit(element, show = true, anime = "ud", waitAppend = true) {
    if (waitAppend) {
      requestAnimationFrame(() => {
        this.setElementDimensions(element);
      });
    } else {
      this.setElementDimensions(element);
    }

    this.setupElementTransition(element, show, anime);
  }

  /**
   * 設置元素尺寸
   */
  setElementDimensions(element) {
    element.style.readHeight =
      element.scrollHeight === 0 ? "999px" : `${element.scrollHeight}px`;
    element.style.readWidth =
      element.scrollWidth === 0 ? "999px" : `${element.scrollWidth}px`;
  }

  /**
   * 設置元素過渡
   */
  setupElementTransition(element, show, anime) {
    Object.assign(element.style, {
      transition: "",
      overflow: "hidden auto",
      opacity: "0",
    });

    this.popElement(element, "false", anime);
    element.style.transition =
      "all 0.5s cubic-bezier(0.21, 0.3, 0.18, 1.37) 0s";

    if (!show) {
      element.style.beeShow = "false";
      return;
    }

    element.style.beeShow = "true";
    element.style.opacity = "1";

    requestAnimationFrame(() => {
      element.style.maxHeight = element.style.readHeight;
    });
  }

  /**
   * 彈出元素控制
   */
  popElement(element, show = "true", anime = "ud") {
    const doShow =
      show === "toggle" ? !(element.style.beeShow === "true") : show === "true";

    if (doShow) {
      this.showElement(element);
    } else {
      this.hideElement(element, anime);
    }
  }

  /**
   * 顯示元素
   */
  showElement(element) {
    Object.assign(element.style, {
      opacity: "1",
      maxHeight: element.style.readHeight,
      maxWidth: element.style.readWidth,
      transform: "translateX(0px) translateY(0px)",
      beeShow: "true",
    });
  }

  /**
   * 隱藏元素
   */
  hideElement(element, anime) {
    element.style.beeShow = "false";
    element.style.opacity = "0";

    if (anime.includes("u")) {
      element.style.maxHeight = "0px";
      if (anime.startsWith("d")) {
        element.style.transform = `translateX(0px) translateY(${element.style.readWidth}px)`;
      }
    }

    if (anime.includes("l")) {
      element.style.maxWidth = "0px";
      if (anime.startsWith("r")) {
        element.style.transform = `translateX(${element.style.readHeight}) translateY(0px)`;
      }
    }
  }
}
/**
 * C頁面工作模組
 * 負責C頁面的AI功能，包括懶人包、留言統整、問問功能等
 */
class CPageWorker {
  constructor(settings) {
    this.settings = settings;
    this.gptRequestQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * 初始化C頁面功能
   */
  async init() {
    if (!this.isCPage()) return;

    this.setupCPageStyles();

    if (this.settings.getBool("addSummaryBtn")) {
      await this.addPostButtons();
    }
  }

  /**
   * 檢查是否為C頁面
   */
  isCPage() {
    return window.location.href.includes("forum.gamer.com.tw/C.php");
  }

  /**
   * 設置C頁面樣式
   */
  setupCPageStyles() {
    const styleSheet = document.createElement("style");
    document.head.appendChild(styleSheet);
    const sheet = styleSheet.sheet;

    sheet.insertRule(
      ".managertools { position: fixed; bottom: 0; right: 0; z-index: 100; }",
      0
    );
  }

  /**
   * 添加文章按鈕
   */
  async addPostButtons(isNewVersion = false) {
    await this.updatePrompts();

    const postSections = this.getPostSections();
    postSections.forEach((postSection) => {
      if (this.hasEditPermission(postSection)) return;
      this.addAskButton(postSection);
      const summaryButton = this.addSummaryButton(postSection);
      this.addCommentSummaryButton(postSection);

      // 可選功能（目前註解）
      // this.addSkipFloorButton(postSections, postSection);
      // this.addSummaryButtonLeft(postSection, summaryButton);
    });
  }

  /**
   * 獲取文章區塊
   */
  getPostSections() {
    return Array.from(document.querySelectorAll(".c-section")).filter(
      (section) => section.querySelector(".c-post__body")
    );
  }

  /**
   * 檢查是否已經新增按鈕
   */
  hasEditPermission(postSection) {
    const editIcon = postSection.querySelectorAll(".lazyBtn");
    return editIcon !== null && editIcon.length > 0;
  }

  /**
   * 添加懶人包按鈕
   */
  addSummaryButton(postSection) {
    const postBody = postSection.querySelector(".c-post__body");
    const footerRight = postBody.querySelector(".article-footer_right");

    const summaryButton = this.createButton({
      text: "懶人包",
      icon: "description",
      id: `lazy-summary-${postBody.querySelector(".c-article").id}`,
      insertPosition: "first",
    });

    footerRight.insertBefore(summaryButton, footerRight.firstChild);

    summaryButton.addEventListener("click", async () => {
      await this.handleSummaryClick(summaryButton, postBody);
    });

    return summaryButton;
  }
  /**
   * 添加跳過樓層 - 按需檢測版本
   */
  addSkipFloorButton() {
    //檢查按鈕是否已經存在
    if (document.getElementById("floating-skip-button")) {
      // remove
      document.getElementById("floating-skip-button").remove();
    }
    // 創建右側浮動的跳過按鈕
    const floatingSkipButton = this.createFloatingSkipButton();
    document.body.appendChild(floatingSkipButton);

    // 點擊事件處理 - 只在點擊時檢查當前樓層
    floatingSkipButton.addEventListener("click", () => {
      const cPageWorker = new CPageWorker(this.settings);
      const postSections = cPageWorker.getPostSections();
      const currentSection = this.findCurrentVisibleSection(postSections);

      if (currentSection) {
        const currentIndex = Array.from(postSections).indexOf(currentSection);
        const nextSection = postSections[currentIndex + 1];

        if (nextSection) {
          // 暫時禁止點擊
          floatingSkipButton.disabled = true;
          this.scrollToElement(nextSection, 2);
          // 700毫秒後恢復
          setTimeout(() => {
            floatingSkipButton.disabled = false;
          }, 700);
          this.animateButtonClick(floatingSkipButton);
        } else {
          // 已到最後一樓
          this.handleLastFloor(currentSection, floatingSkipButton);
        }
      }
    });
  }
  /**
   * 創建浮動跳過按鈕
   */
  createFloatingSkipButton() {
    const button = document.createElement("button");
    button.id = "floating-skip-button";
    button.innerHTML = `
      <i class="fa fa-arrow-down"></i>
      <span>跳過此樓</span>
    `;
    // 添加CSS動畫到頁面
    if (!document.getElementById("arrow-bounce-style")) {
      const style = document.createElement("style");
      style.id = "arrow-bounce-style";
      style.textContent = `
        @keyframes arrowBounce {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-3px); }
          50% { transform: translateY(2px); }
          75% { transform: translateY(-1px); }
        }
      `;
      document.head.appendChild(style);
    }

    // 設置按鈕樣式
    Object.assign(button.style, {
      position: "fixed",
      right: "20px",
      bottom: "300px",
      transform: "translateY(-50%)",
      zIndex: "9999",
      backgroundColor: "var(--primary)",
      color: "var(--primary-text)",
      border: "none",
      borderRadius: "50px",
      padding: "12px 16px",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.3s ease",
      opacity: "0.8",
    });

    // 懸停效果 - 帶箭頭跳動動畫
    button.addEventListener("mouseenter", () => {
      // 為箭頭添加跳動動畫
      const arrow = button.querySelector("i");
      if (arrow) {
        arrow.style.animation = "arrowBounce 0.6s ease-in-out";
      }
    });

    button.addEventListener("mouseleave", () => {
      // 移除箭頭動畫
      const arrow = button.querySelector("i");
      if (arrow) {
        arrow.style.animation = "";
      }
    });

    return button;
  }
  /**
   * 找出當前在視野中的樓層
   */
  findCurrentVisibleSection(postSections) {
    // 使用你現有的 isElementInViewport 函式
    for (let i = 0; i < postSections.length; i++) {
      const section = postSections[i];
      if (UtilityFunctions.isInViewport(section)) {
        return section;
      }
    }

    // 如果沒有找到完全可見的，找最接近視窗頂部的
    return this.findClosestSection(postSections);
  }

  /**
   * 找出最接近視窗頂部的樓層（備用方案）
   */
  findClosestSection(postSections) {
    let closestSection = null;
    let minDistance = Infinity;

    postSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top);

      if (distance < minDistance) {
        minDistance = distance;
        closestSection = section;
      }
    });

    return closestSection;
  }
  /**
   * 按鈕點擊動畫效果
   */
  animateButtonClick(button) {
    button.style.transform = "translateY(-50%) scale(0.95)";
    setTimeout(() => {
      button.style.transform = "translateY(-50%) scale(1)";
    }, 150);
  }
  /**
   * 處理到達最後一樓的情況
   */
  handleLastFloor(lastSection, button) {
    const footer = lastSection.querySelector(".c-post__footer");

    if (footer) {
      // 滾動到 footer 元素
      this.scrollToElement(footer);
      this.animateButtonClick(button);

      // 更新按鈕狀態
      button.style.opacity = "0.6";
      button.innerHTML = `
      <i class="fa fa-anchor"></i>
      <span>已到樓底</span>
    `;

      // 3秒後恢復按鈕狀態
      setTimeout(() => {
        button.style.opacity = "0.8";
        button.innerHTML = `
        <i class="fa fa-arrow-down"></i>
        <span>跳過此樓</span>
      `;
      }, 3000);
    } else {
      // 如果找不到 footer，就滾動到樓層底部
      this.handleLastFloorFallback(lastSection, button);
    }
  }
  /**
   * 處理找不到 footer 的備用方案
   */
  handleLastFloorFallback(lastSection, button) {
    // 滾動到樓層元素的底部
    const elementBottom = lastSection.offsetTop + lastSection.offsetHeight;
    window.scrollTo({
      top: elementBottom - window.innerHeight + 100, // 留一點邊距
      behavior: "smooth",
    });

    this.animateButtonClick(button);

    // 更新按鈕狀態
    button.style.opacity = "0.5";
    button.innerHTML = `
      <i class="fa fa-check"></i>
      <span>已到底部</span>
    `;

    // 3秒後恢復按鈕狀態
    setTimeout(() => {
      button.style.opacity = "0.8";
      button.innerHTML = `
        <i class="fa fa-arrow-down"></i>
        <span>跳過此樓</span>
      `;
    }, 3000);
  }

  /**
   * 處理懶人包按鈕點擊
   */
  async handleSummaryClick(button, postBody) {
    this.scrollToElement(button);

    if (button.querySelector("p").textContent === "產生中...") return;

    if (!this.validateApiKey()) return;

    const articleId = postBody.querySelector(".c-article").id;
    const cleanId = `${articleId}-clean`;

    // 處理展開/摺疊邏輯
    if (this.handleToggleLogic(button, cleanId)) return;

    // 生成懶人包
    await this.generateSummary(button, postBody, articleId);
  }

  /**
   * 生成懶人包
   */
  async generateSummary(button, postBody, articleId) {
    button.querySelector("p").textContent = "產生中...";

    const articleContent = this.extractArticleContent(postBody);
    const customPrompt = this.settings.get("custom_oaiPrompt");
    const prompt = customPrompt || this.settings.get("oaiPrompt");

    const { response, data } = await this.sendGptRequest(
      prompt,
      `文章內容：\`\`\`${articleContent}\`\`\``
    );

    if (!response) {
      button.querySelector("p").textContent = "懶人包";
      return;
    }

    const summaryArticle = this.createSummaryArticle(
      `${articleId}-clean`,
      data.choices[0].message.content
    );

    button.querySelector("p").textContent = "摺疊 ▲";
    postBody.appendChild(summaryArticle);

    await this.animateElement(summaryArticle, true);
  }

  /**
   * 添加留言統整按鈕
   */
  addCommentSummaryButton(postSection) {
    const postBody = postSection.querySelector(".c-post__body");
    const replyHead = postSection.querySelector(".c-reply__head");

    if (!replyHead) return;

    const commentButton = this.createButton({
      text: "留言統整",
      icon: "forum",
      id: `lazy-summaryCmd-${postBody.querySelector(".c-article").id}`,
      className: "article-footer_right-btn",
      style: { margin: "0.3rem 0.5rem 0rem 0rem" },
    });

    replyHead.appendChild(commentButton);

    commentButton.addEventListener("click", async () => {
      await this.handleCommentSummaryClick(
        commentButton,
        postBody,
        postSection
      );
    });
  }

  /**
   * 處理留言統整按鈕點擊
   */
  async handleCommentSummaryClick(button, postBody, postSection) {
    this.scrollToElement(button);

    if (button.querySelector("p").textContent === "產生中...") return;

    if (!this.validateApiKey()) return;

    const postId = postBody.querySelector(".c-article").id.replace("cf", "");
    const cleanCmdId = `${postId}-cleanCmd`;

    // 處理展開/摺疊邏輯
    if (this.handleToggleLogic(button, cleanCmdId, "留言統整")) return;

    // 生成留言統整
    await this.generateCommentSummary(button, postId, postSection);
  }

  /**
   * 生成留言統整
   */
  async generateCommentSummary(button, postId, postSection) {
    button.querySelector("p").textContent = "產生中...";

    const commentData = await this.getCommentData(postId);
    const customPrompt = this.settings.get("custom_oaiPromptCmd");
    const prompt = customPrompt || this.settings.get("oaiPromptCmd");

    const { response, data } = await this.sendGptRequest(
      prompt,
      `對話內容：\n \`\`\`${commentData.textContent}\n\`\`\``
    );

    if (!response) {
      button.querySelector("p").textContent = "留言統整";
      return;
    }

    const processedContent = this.restoreOriginalFormat(
      data.choices[0].message.content,
      commentData.textContentOrigin
    );

    const summaryArticle = this.createCommentSummaryArticle(
      `${postId}-cleanCmd`,
      processedContent
    );

    button.querySelector("p").textContent = "摺疊 ▲";

    const insertBefore = document.getElementById(`Commendlist_${postId}`);
    postSection
      .querySelector(".c-post__footer")
      .insertBefore(summaryArticle, insertBefore);

    await this.animateElement(summaryArticle, true);
  }

  /**
   * 添加問問按鈕
   */
  addAskButton(postSection) {
    const postBody = postSection.querySelector(".c-post__body");
    const footerRight = postBody.querySelector(".article-footer_right");

    // 創建對話輸入區
    const { askInput, chatArea, askTextarea } =
      this.createChatInterface(postBody);

    // 創建問問按鈕
    const askButton = this.createButton({
      text: "問問 ▼",
      icon: "chat",
      id: `ask-${postBody.querySelector(".c-article").id}`,
      insertPosition: "first",
    });

    footerRight.insertBefore(askButton, footerRight.firstChild);

    // 設置事件監聽器
    this.setupAskButtonEvents(
      askButton,
      askInput,
      chatArea,
      askTextarea,
      postBody
    );
  }

  /**
   * 創建聊天介面
   */
  createChatInterface(postBody) {
    // 創建輸入區
    const askInput = document.createElement("div");
    askInput.classList.add("c-reply__editor");

    const replyInput = document.createElement("div");
    replyInput.classList.add("reply-input");

    const askTextarea = document.createElement("textarea");
    askTextarea.classList.add("content-edit");
    askTextarea.placeholder = "詢問⋯";

    replyInput.appendChild(askTextarea);
    askInput.appendChild(replyInput);
    postBody.appendChild(askInput);

    this.animateElement(askInput, false);

    // 創建聊天區域
    const chatArea = document.createElement("div");
    chatArea.classList.add("chatArea");
    chatArea.style.overflow = "hidden";

    postBody.insertBefore(chatArea, askInput);
    this.animateElement(chatArea, false);

    return { askInput, chatArea, askTextarea };
  }

  /**
   * 設置問問按鈕事件
   */
  setupAskButtonEvents(askButton, askInput, chatArea, askTextarea, postBody) {
    // 按鈕點擊事件
    askButton.addEventListener("click", async () => {
      this.scrollToElement(askButton);

      if (!this.validateApiKey()) return;

      const isExpanded = askButton.querySelector("p").textContent === "問問 ▲";

      this.toggleElement(askInput);
      this.toggleElement(chatArea);

      askButton.querySelector("p").textContent = isExpanded
        ? "問問 ▼"
        : "問問 ▲";

      if (!isExpanded) {
        askTextarea.focus();
      }
    });

    // 輸入框按鍵事件
    askTextarea.addEventListener("keydown", async (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        await this.handleAskQuestion(askTextarea, chatArea, postBody);
      }
    });
  }

  /**
   * 處理問問功能
   */
  async handleAskQuestion(askTextarea, chatArea, postBody) {
    if (!this.validateApiKey()) return;
    if (askTextarea.placeholder !== "詢問⋯") return;

    const userInput = askTextarea.value;
    if (!userInput.trim()) return;

    askTextarea.placeholder = "載入中⋯";
    askTextarea.value = "";

    const gptArray = this.buildChatGptArray(postBody, chatArea, userInput);

    const { response, data } = await this.sendGptArrayRequest(gptArray);

    if (!response) {
      askTextarea.placeholder = "詢問⋯";
      askTextarea.value = userInput;
      return;
    }

    // 添加用戶問題
    this.addChatMessage(chatArea, userInput, "user-ask");

    // 添加AI回答
    this.addChatMessage(chatArea, data.choices[0].message.content, "gpt-reply");

    // 更新聊天區域高度
    this.updateChatAreaHeight(chatArea);

    askTextarea.placeholder = "詢問⋯";
    askTextarea.focus();
  }

  /**
   * 構建聊天GPT陣列
   */
  buildChatGptArray(postBody, chatArea, userInput) {
    const gptArray = [];
    const customPrompt = this.settings.get("custom_oaiPromptChat");
    const prompt = customPrompt || this.settings.get("oaiPromptChat");
    const useSystemMode = this.settings.getBool("oaiPromptSystemMode");

    // 添加系統提示
    gptArray.push({
      role: useSystemMode ? "system" : "user",
      content: prompt,
    });

    if (!useSystemMode) {
      gptArray.push({
        role: "assistant",
        content: "好的，請提供文章。",
      });
    }

    // 添加文章內容
    const articleContent = this.extractArticleContent(postBody);
    gptArray.push({
      role: "user",
      content: `文章內容：\n\`\`\`\n${articleContent}\n\`\`\``,
    });

    // 添加聊天歷史
    const chatHistory = chatArea.querySelectorAll(".chatHistory");
    chatHistory.forEach((chat) => {
      const role = chat.classList.contains("user-ask") ? "user" : "assistant";
      const content = chat.querySelector(".c-article__content").textContent;
      gptArray.push({ role, content });
    });

    // 添加當前問題
    gptArray.push({
      role: "user",
      content: userInput,
    });

    return gptArray;
  }

  /**
   * 添加聊天訊息
   */
  addChatMessage(chatArea, content, type) {
    const messageArticle = document.createElement("article");
    messageArticle.classList.add("c-article", "FM-P2", "chatHistory", type);
    messageArticle.id = `chat-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    Object.assign(messageArticle.style, {
      display: "block",
      minHeight: "0px",
      marginBottom: type === "user-ask" ? "0.8rem" : "1.6rem",
      borderBottom: `1px solid ${
        type === "user-ask" ? "var(--primary-text)" : "var(--primary)"
      }`,
    });

    const messageContent = document.createElement("div");
    messageContent.classList.add("c-article__content");
    messageContent.style.whiteSpace = "pre-wrap";
    messageContent.innerHTML = content;

    messageArticle.appendChild(messageContent);
    chatArea.appendChild(messageArticle);
  }

  /**
   * 更新聊天區域高度
   */
  updateChatAreaHeight(chatArea) {
    requestAnimationFrame(() => {
      chatArea.style.readHeight = `${chatArea.scrollHeight}px`;
      chatArea.style.maxHeight = `${chatArea.scrollHeight}px`;
    });
  }

  /**
   * 獲取留言資料
   */
  async getCommentData(postId) {
    let commentElements = document
      .getElementById(`Commendlist_${postId}`)
      .querySelectorAll(".c-reply__item");

    // 展開留言
    const showButton = document.getElementById(`showoldCommend_${postId}`);
    if (
      showButton &&
      (showButton.style.display === "block" || showButton.style.display === "")
    ) {
      const initialCount = commentElements.length;
      showButton.click();

      await new Promise((resolve) => {
        const observer = new MutationObserver(() => {
          const currentElements = document
            .getElementById(`Commendlist_${postId}`)
            .querySelectorAll(".c-reply__item");

          if (currentElements.length >= initialCount) {
            commentElements = currentElements;
            document.getElementById(`closeCommend_${postId}`).click();
            observer.disconnect();
            resolve();
          }
        });

        observer.observe(document.getElementById(`Commendlist_${postId}`), {
          childList: true,
          subtree: true,
          characterData: true,
        });
      });

      document.getElementById(`closeCommend_${postId}`).click();
    }

    // 處理留言內容
    let textContent = "";
    const textContentOrigin = Array.from(commentElements)
      .map((node) => node.innerHTML)
      .join("");

    commentElements.forEach((node) => {
      const user = node.querySelector(".reply-content__user").innerHTML;
      const comment = node.querySelector(".comment_content").innerHTML;
      textContent += `@${user}：${comment}\n`;
    });

    // 清理格式
    textContent = textContent.replace(/\n+/g, "\n");
    textContent = this.processCommentReferences(textContent);

    return { textContent, textContentOrigin };
  }

  /**
   * 處理留言引用格式
   */
  processCommentReferences(textContent) {
    const patterns = [
      {
        regex: /([^<]+)\((.*?)\)<\/a>/g,
        replacement: (match, prefix, name) => `回應@${name} => `,
      },
      {
        regex: /([^<]+)<\/a>/g,
        replacement: (match, name) => `回應@${name}，`,
      },
    ];

    patterns.forEach(({ regex, replacement }) => {
      textContent = textContent.replace(regex, replacement);
    });

    return textContent;
  }

  /**
   * 還原原始格式
   */
  restoreOriginalFormat(textContent, originalContent) {
    const nameToHtmlMap = new Map();
    const htmlPattern = /([^<]+)<\/a>/g;
    let match;

    while ((match = htmlPattern.exec(originalContent)) !== null) {
      nameToHtmlMap.set(match[1], match[0]);
    }

    let processedText = textContent;
    nameToHtmlMap.forEach((html, name) => {
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const atPattern = new RegExp(`@${escapedName}`, "g");
      processedText = processedText.replace(atPattern, html);
    });

    return processedText;
  }

  /**
   * 更新提示詞
   */
  async updatePrompts() {
    const today = new Date();
    const lastUpdate = this.settings.get("oaiPromptUpdateDate");
    const sleepDays = parseInt(this.settings.get("oaiPromptUpdateSleep"));

    const daysDiff = Math.floor(
      (today -
        new Date(lastUpdate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"))) /
        (1000 * 60 * 60 * 24)
    );

    if (daysDiff < sleepDays) return;

    try {
      const response = await fetch(this.settings.get("oaiPromptUpdateURL"));
      if (!response.ok) {
        console.error("[ERROR] fetching prompt:", response.status);
        return;
      }

      const data = await response.json();
      const todayString = today.toISOString().slice(0, 10).replace(/-/g, "");

      this.settings.set("oaiPromptUpdateDate", todayString);

      if (this.settings.get("oaiPromptDate") >= data.oaiPromptDate) return;

      // 更新提示詞
      this.settings.set("oaiPromptDate", data.oaiPromptDate);
      this.settings.set("oaiPrompt", data.oaiPrompt);
      this.settings.set("oaiPromptUpdateSleep", data.oaiPromptUpdateSleep);
      this.settings.set("oaiPromptCmd", data.oaiPromptCmd);
    } catch (error) {
      console.error("[ERROR] fetching prompt:", error);
    }
  }

  /**
   * 發送GPT請求
   */
  async sendGptRequest(systemPrompt, userPrompt) {
    const useSystemMode = this.settings.getBool("oaiPromptSystemMode");
    const messages = [
      {
        role: useSystemMode ? "system" : "user",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    return this.makeGptRequest(messages);
  }

  /**
   * 發送GPT陣列請求
   */
  async sendGptArrayRequest(messages) {
    return this.makeGptRequest(messages);
  }

  /**
   * 執行GPT請求
   */
  async makeGptRequest(messages) {
    return new Promise((resolve) => {
      const apiKey = this.settings.get("oaiKey");

      GM_xmlhttpRequest({
        method: "POST",
        url: this.settings.get("oaiBaseUrl"),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        data: JSON.stringify({
          messages,
          max_tokens: 4090,
          model: this.settings.get("oaiModel"),
          stream: false,
          temperature: 0.7,
          presence_penalty: 0,
          frequency_penalty: 0,
        }),
        timeout: 30000,
        onload: (response) => {
          try {
            if (response.status !== 200) {
              console.error(`伺服器回應錯誤: ${response.status}`);
              alert("取得 GPT 回覆時發生錯誤，請稍後再試。");
              resolve({ response: false, data: null });
              return;
            }

            const data = JSON.parse(response.responseText);
            if (data?.choices?.[0]?.message?.content) {
              resolve({ response: true, data });
            } else {
              console.error("API 返回的數據格式不正確");
              alert("取得 GPT 回覆時發生錯誤，請稍後再試。");
              resolve({ response: false, data: null });
            }
          } catch (error) {
            console.error("取得 GPT 回覆時發生錯誤:", error);
            alert("取得 GPT 回覆時發生錯誤，請稍後再試。");
            resolve({ response: false, data: null });
          }
        },
        onerror: (error) => {
          console.error("取得 GPT 回覆時發生錯誤:", error);
          alert("取得 GPT 回覆時發生錯誤，請稍後再試。");
          resolve({ response: false, data: null });
        },
        ontimeout: () => {
          console.error("取得 GPT 回覆超時");
          alert("取得 GPT 回覆時發生錯誤，請稍後再試。");
          resolve({ response: false, data: null });
        },
      });
    });
  }

  /**
   * 工具方法：創建按鈕
   */
  createButton({
    text,
    icon,
    id,
    className = "article-footer_right-btn",
    style = {},
    insertPosition = null,
  }) {
    const button = document.createElement("a");
    button.classList.add(className);
    button.innerHTML = `<i class="material-icons lazyBtn">${icon}</i><p>${text}</p>`;
    button.id = id;

    Object.assign(button.style, {
      display: "flex",
      alignItems: "center",
      ...style,
    });

    return button;
  }

  /**
   * 工具方法：創建摘要文章
   */
  createSummaryArticle(id, content) {
    const article = document.createElement("article");
    article.classList.add("c-article", "FM-P2");
    article.id = id;

    Object.assign(article.style, {
      display: "block",
      overflow: "hidden",
      maxHeight: "auto",
      minHeight: "0px",
    });

    const articleContent = document.createElement("div");
    articleContent.classList.add("c-article__content");
    articleContent.style.whiteSpace = "pre-wrap";
    articleContent.innerHTML = content;

    article.appendChild(articleContent);
    return article;
  }

  /**
   * 工具方法：創建留言摘要文章
   */
  createCommentSummaryArticle(id, content) {
    const article = document.createElement("article");
    article.classList.add("c-reply__item", "c-article", "FM-P2");
    article.id = id;

    Object.assign(article.style, {
      display: "block",
      overflow: "hidden",
      maxHeight: "auto",
      minHeight: "0px",
    });

    const articleContent = document.createElement("div");
    articleContent.classList.add("c-article__content");
    articleContent.style.whiteSpace = "pre-wrap";
    articleContent.innerHTML = content;

    article.appendChild(articleContent);
    return article;
  }

  /**
   * 工具方法：提取文章內容
   */
  extractArticleContent(postBody) {
    const articleContent = postBody.querySelector(".c-article__content");
    let textContent = "";

    articleContent.childNodes.forEach((node) => {
      textContent += node.textContent.trim() + "\n";
    });

    return textContent.replace(/\n+/g, "\n");
  }

  /**
   * 工具方法：驗證API密鑰
   */
  validateApiKey() {
    const apiKey = this.settings.get("oaiKey");
    if (apiKey === "sk-yourKey" || apiKey === "") {
      alert("請先設定 API Key 才能使用 AI 功能");
      return false;
    }
    return true;
  }

  /**
   * 工具方法：處理切換邏輯
   */
  handleToggleLogic(button, elementId, defaultText = null) {
    const element = document.getElementById(elementId);
    const buttonText = button.querySelector("p").textContent;

    if (element && buttonText === "摺疊 ▲") {
      this.toggleElement(element);
      button.querySelector("p").textContent = "展開 ▼";
      return true;
    }

    if (element && buttonText === "展開 ▼") {
      this.toggleElement(element);
      button.querySelector("p").textContent = "摺疊 ▲";
      return true;
    }

    if (element && buttonText !== (defaultText || "懶人包")) {
      return true;
    }

    return false;
  }

  /**
   * 工具方法：滾動到元素
   */
  scrollToElement(element, marginOffset = 7) {
    const originalMargin = element.style.marginTop || "0px";
    element.style.marginTop = `-${marginOffset}rem`;
    element.scrollIntoView({ behavior: "smooth" });
    element.style.marginTop = originalMargin;
    // 檢查是否在視窗內，如果不是則重新滾動
    setTimeout(() => {
      if (!UtilityFunctions.isInViewport(element)) {
        this.scrollToElement(element, marginOffset);
      }
    }, 700);
  }

  /**
   * 工具方法：動畫元素
   */
  async animateElement(
    element,
    show = true,
    animation = "ud",
    waitForAppend = true
  ) {
    if (waitForAppend) {
      requestAnimationFrame(() => {
        this.setElementDimensions(element);
      });
    } else {
      this.setElementDimensions(element);
    }

    this.setupElementAnimation(element, show, animation);
  }

  /**
   * 工具方法：設置元素尺寸
   */
  setElementDimensions(element) {
    element.style.readHeight =
      element.scrollHeight === 0 ? "999px" : `${element.scrollHeight}px`;
    element.style.readWidth =
      element.scrollWidth === 0 ? "999px" : `${element.scrollWidth}px`;
  }

  /**
   * 工具方法：設置元素動畫
   */
  setupElementAnimation(element, show, animation) {
    Object.assign(element.style, {
      transition: "",
      overflow: "hidden auto",
      opacity: "0",
    });

    this.toggleElement(element, false, animation);
    element.style.transition =
      "all 0.5s cubic-bezier(0.21, 0.3, 0.18, 1.37) 0s";

    if (!show) {
      element.style.beeShow = "false";
      return;
    }

    element.style.beeShow = "true";
    element.style.opacity = "1";

    requestAnimationFrame(() => {
      element.style.maxHeight = element.style.readHeight;
    });
  }

  /**
   * 工具方法：切換元素顯示
   */
  toggleElement(element, show = null, animation = "ud") {
    const shouldShow =
      show === null ? !(element.style.beeShow === "true") : show;

    if (shouldShow) {
      Object.assign(element.style, {
        opacity: "1",
        maxHeight: element.style.readHeight,
        maxWidth: element.style.readWidth,
        transform: "translateX(0px) translateY(0px)",
        beeShow: "true",
      });
    } else {
      element.style.beeShow = "false";
      element.style.opacity = "0";

      if (animation.includes("u")) {
        element.style.maxHeight = "0px";
        if (animation.startsWith("d")) {
          element.style.transform = `translateX(0px) translateY(${element.style.readWidth}px)`;
        }
      }

      if (animation.includes("l")) {
        element.style.maxWidth = "0px";
        if (animation.startsWith("r")) {
          element.style.transform = `translateX(${element.style.readHeight}) translateY(0px)`;
        }
      }
    }
  }
}
/**
 * 設定管理與UI模組
 * 負責插件設定介面、提示系統、檢舉提醒等功能
 */
class SettingsUIManager {
  constructor(settings) {
    this.settings = settings;
  }

  /**
   * 添加設定元素到頁面
   */
  async addSettingElement(isNewVersion) {
    const uiElements = this.createUIElements(isNewVersion);
    if (!uiElements) return;

    const { navAdd, settingsContainer } = uiElements;

    this.setupEventListeners(navAdd, settingsContainer, isNewVersion);
    this.createSettingsContent(settingsContainer, isNewVersion);

    await this.initializeSettingsContainer(settingsContainer);
  }

  /**
   * 創建UI元素
   */
  createUIElements(isNewVersion) {
    if (isNewVersion) {
      return this.createNewVersionUI();
    } else if (document.querySelector(".b-list") !== null) {
      return this.createOldVersionUI();
    }
    return null;
  }

  /**
   * 創建新版UI
   */
  createNewVersionUI() {
    const navAddTag = document.querySelector(".forum-nav-main");
    const settingsWarp = document.querySelector(".forum-header");

    if (!navAddTag || !settingsWarp) return null;

    // 創建設定按鈕
    const navAdd = document.createElement("li");
    navAdd.className = "forum-nav-link forum-nav-rules beeSettingTag";
    navAdd.innerHTML = "插件設定";
    navAdd.style.cursor = "pointer";
    navAddTag.appendChild(navAdd);

    // 創建設定容器
    const settingsContainer = this.createSettingsContainer(
      "forum-filter-box beeSettingWarp"
    );
    settingsWarp.appendChild(settingsContainer);

    // 添加提示標題
    const sectionTitle = document.createElement("h3");
    sectionTitle.className = "section-title";
    sectionTitle.textContent = "滾動下拉還有哦！";
    sectionTitle.style.margin = "0.6rem 0 0.7rem 0.7rem";
    settingsContainer.appendChild(sectionTitle);

    return { navAdd, settingsContainer };
  }

  /**
   * 創建舊版UI
   */
  createOldVersionUI() {
    const navAddTag = document.querySelector(".BH-menuE");
    const settingsWarp = document.querySelector(".b-list-wrap");

    if (!navAddTag || !settingsWarp) return null;

    // 創建設定按鈕
    const navAdd = document.createElement("li");
    navAdd.className = "beeSettingTag";
    navAdd.innerHTML = "插件設定";
    navAdd.style.cursor = "pointer";
    navAddTag.appendChild(navAdd);

    // 創建設定容器
    const settingsContainer = this.createSettingsContainer(
      "forum-filter-box beeSettingWarp"
    );
    settingsWarp.insertBefore(settingsContainer, settingsWarp.firstChild);

    // 添加提示標題
    const sectionTitle = document.createElement("h3");
    sectionTitle.className = "section-title";
    sectionTitle.textContent =
      "插件設定（再點一次上方的【插件設定】即可返回【文章列表】）";
    sectionTitle.style.margin = "0.6rem 0 0.7rem 0.7rem";
    settingsContainer.appendChild(sectionTitle);

    return { navAdd, settingsContainer };
  }

  /**
   * 創建設定容器
   */
  createSettingsContainer(className) {
    const container = document.createElement("div");
    container.className = className;

    Object.assign(container.style, {
      maxHeight: "0px",
      overflow: "hidden auto",
    });

    return container;
  }

  /**
   * 設置事件監聽器
   */
  setupEventListeners(navAdd, settingsContainer, isNewVersion) {
    navAdd.addEventListener("click", () => {
      if (isNewVersion) {
        this.toggleNewVersionSettings(settingsContainer);
      } else {
        this.toggleOldVersionSettings(settingsContainer);
      }
    });
  }

  /**
   * 切換新版設定顯示
   */
  toggleNewVersionSettings(container) {
    if (container.style.maxHeight === "0px") {
      container.style.maxHeight = "60vh";
      container.style.opacity = "1";
    } else {
      container.style.maxHeight = "0px";
      container.style.opacity = "0";
    }
  }

  /**
   * 切換舊版設定顯示
   */
  toggleOldVersionSettings(container) {
    const animationManager = new AnimationManager();
    animationManager.popElement(container, "toggle", "ud");

    const scrollTarget =
      document.getElementById("BH-master") ||
      document.querySelector(".b-list-wrap");
    if (scrollTarget) {
      this.scrollToElement(scrollTarget, 7);
    }
  }

  /**
   * 創建設定內容
   */
  createSettingsContent(container, isNewVersion) {
    this.addBasicSettings(container, isNewVersion);
    this.addLayoutSettings(container);
    this.addAISettings(container);
    this.addMiscSettings(container, isNewVersion);
    this.addReloadButton(container, isNewVersion);
  }

  /**
   * 添加基本設定
   */
  addBasicSettings(container, isNewVersion) {
    if (!isNewVersion) {
      container.appendChild(
        this.createItemCard("add_function", "標題後方插入功能按鈕")
      );
      container.appendChild(
        this.createItemCard("preview_auto", "點擊文章時使用即時瀏覽")
      );
      container.appendChild(
        this.createItemCard(null, null, {
          inputId: "preview_size",
          labelText: " └ 即時瀏覽視窗的大小",
        })
      );
    } else {
      container.appendChild(
        this.createItemCard("cleanMode", "清爽模式（隱藏文章描述和縮圖）")
      );
      container.appendChild(
        this.createItemCard(null, null, {
          inputId: "cleanModeSize",
          labelText: " └ 清爽模式文章清單大小",
        })
      );
      container.appendChild(
        this.createItemCard(null, null, {
          inputId: "preview_size",
          labelText: "即時瀏覽視窗的大小",
        })
      );
    }

    container.appendChild(
      this.createItemCard("preview_LR", "即時瀏覽從右方彈出（取消則從左）")
    );
  }

  /**
   * 添加版面設定
   */
  addLayoutSettings(container) {
    container.appendChild(
      this.createItemCard("new_design", "自訂板面大小（附加浮動型聊天室）")
    );

    const layoutSettings = [
      {
        inputId: "new_design_box",
        labelText: " └ 整體顯示區域佔比（文章+聊天室佔整個畫面的比例，< 100%）",
      },
      {
        inputId: "new_design_box_Left",
        labelText: " ├ 文章佔比（與聊天室佔比總和 <= 100%）",
      },
      {
        inputId: "new_design_box_Right",
        labelText: " └ 聊天室佔比",
      },
    ];

    layoutSettings.forEach((setting) => {
      container.appendChild(this.createItemCard(null, null, setting));
    });

    container.appendChild(
      this.createItemCard("new_design_LRSwitch", "聊天室在左方")
    );
  }

  /**
   * 添加AI設定
   */
  addAISettings(container) {
    container.appendChild(
      this.createItemCard(
        "addSummaryBtn",
        "跳過樓層按鈕/AI總結（AI功能需自備KEY填入下方）"
      )
    );

    const aiSettings = [
      { inputId: "oaiBaseUrl", labelText: " ├ oai URL" },
      { inputId: "oaiModel", labelText: " ├ oai model" },
      { inputId: "oaiKey", labelText: " ├ oai key" },
      {
        inputId: "custom_oaiPrompt",
        labelText: " ├ 「懶人包」提示詞（留空=預設）",
      },
      {
        inputId: "custom_oaiPromptCmd",
        labelText: " ├ 「留言統整」自訂提示詞（留空=預設）",
      },
      {
        inputId: "custom_oaiPromptChat",
        labelText: " ├ 「問問」自訂提示詞（留空=預設）",
      },
    ];

    aiSettings.forEach((setting) => {
      container.appendChild(this.createItemCard(null, null, setting));
    });

    container.appendChild(
      this.createItemCard("oaiPromptSystemMode", "├ 自訂提示詞使用 system 模式")
    );

    container.appendChild(
      this.createItemCard(null, null, {
        inputId: "oaiPromptUpdateURL",
        labelText: " └ oai prompt settings URL",
      })
    );
  }

  /**
   * 添加雜項設定
   */
  addMiscSettings(container, isNewVersion) {
    if (!isNewVersion) {
      container.appendChild(
        this.createItemCard("addBorderInPicMode", "縮圖列表模式中，加上分隔線")
      );
      container.appendChild(
        this.createItemCard("showAbuse", "有檢舉時，自動以即時瀏覽開啟")
      );
    }

    container.appendChild(this.createItemCard("showTips", "重新觀看TIPs"));
  }

  /**
   * 添加重載按鈕
   */
  addReloadButton(container, isNewVersion) {
    const reloadBtn = document.createElement("button");
    reloadBtn.textContent = "重整頁面以生效";

    if (!isNewVersion) {
      reloadBtn.style.margin = "0.5rem 0 0.7rem 0.7rem";
      reloadBtn.style.color = "white";
    }

    reloadBtn.addEventListener("click", () => {
      location.reload();
    });

    const reloadBtnDiv = document.createElement("div");
    reloadBtnDiv.className = isNewVersion
      ? "btn btn-primary"
      : "BH-rbox BH-qabox1";
    reloadBtnDiv.appendChild(reloadBtn);
    container.appendChild(reloadBtnDiv);
  }

  /**
   * 創建設定項目卡片
   */
  createItemCard(inputId, labelText, additionalContent = null) {
    const itemCard = document.createElement("div");
    itemCard.className =
      "item-card management_guild-check single-choice forum-filter-group";

    const checkGroup = document.createElement("div");
    checkGroup.className = "check-group";
    checkGroup.style.margin = "0rem 0 0.1rem 0.7rem";

    if (inputId) {
      this.createCheckboxInput(checkGroup, inputId, labelText);
    }

    if (additionalContent) {
      this.createTextInput(checkGroup, additionalContent);
    }

    itemCard.appendChild(checkGroup);
    return itemCard;
  }

  /**
   * 創建複選框輸入
   */
  createCheckboxInput(container, inputId, labelText) {
    const input = document.createElement("input");
    input.id = inputId;
    input.type = "checkbox";
    input.checked = this.settings.getBool(inputId);

    const label = document.createElement("label");
    label.htmlFor = inputId;
    label.className = "is-active";

    const labelIcon = document.createElement("div");
    labelIcon.className = "label-icon";

    const icon = document.createElement("i");
    icon.className = "fa fa-check";
    labelIcon.appendChild(icon);

    const h6 = document.createElement("h6");
    h6.textContent = labelText;

    Object.assign(h6.style, {
      display: "inline-block",
      color: "var(--primary-text)",
      fontSize: "100%",
    });

    label.appendChild(labelIcon);
    label.appendChild(h6);
    container.appendChild(input);
    container.appendChild(label);

    // 添加事件監聽器
    input.addEventListener("input", () => {
      this.settings.set(inputId, input.checked.toString());
    });
  }

  /**
   * 創建文字輸入
   */
  createTextInput(container, config) {
    const h6 = document.createElement("h6");
    h6.textContent = config.labelText;
    h6.style.display = "inline-block";
    container.appendChild(h6);

    const input = document.createElement("input");
    input.className = "form-control";
    input.id = config.inputId;
    input.type = "text";
    input.size = 25;

    Object.assign(input.style, {
      margin: "0px",
      width: config.inputId.startsWith("custom_") ? "auto" : "70px",
    });

    input.value = this.settings.get(config.inputId) || "";
    container.appendChild(input);

    // 添加事件監聽器
    input.addEventListener("input", () => {
      this.settings.set(config.inputId, input.value);
    });
  }

  /**
   * 初始化設定容器
   */
  async initializeSettingsContainer(container) {
    const animationManager = new AnimationManager();
    await animationManager.popElementInit(container, false, "ud");
  }

  /**
   * 滾動到元素
   */
  scrollToElement(element, marginOffset = 7) {
    const originalMargin = element.style.marginTop || "0px";
    element.style.marginTop = `-${marginOffset}rem`;
    element.scrollIntoView({ behavior: "smooth" });
    element.style.marginTop = originalMargin;

    setTimeout(() => {
      if (!UtilityFunctions.isInViewport(element)) {
        this.scrollToElement(element, marginOffset);
      }
    }, 300);
  }
}

/**
 * 提示系統管理器
 */
class TipsManager {
  constructor(settings) {
    this.settings = settings;
  }

  /**
   * 檢查並載入提示
   */
  checkTips(isNewVersion) {
    if (this.shouldShowBPageTips()) {
      this.loadBPageTips();
      this.settings.set("showTips", "false");
    }

    if (this.shouldShowHomeTips()) {
      this.loadHomeTips();
      this.settings.set("homeTips", "false");
    }
  }

  /**
   * 檢查是否應顯示B頁提示
   */
  shouldShowBPageTips() {
    return (
      window.location.href.includes("forum.gamer.com.tw/B.php") &&
      this.settings.getBool("showTips")
    );
  }

  /**
   * 檢查是否應顯示首頁提示
   */
  shouldShowHomeTips() {
    return (
      window.location.href.includes("www.gamer.com.tw") &&
      this.settings.getBool("homeTips")
    );
  }

  /**
   * 載入B頁提示
   */
  loadBPageTips() {
    this.loadDriverJS(() => {
      this.createBPageTour();
    });
  }

  /**
   * 載入首頁提示
   */
  loadHomeTips() {
    this.loadDriverJS(() => {
      this.createHomeTour();
    });
  }

  /**
   * 載入Driver.js庫
   */
  loadDriverJS(callback) {
    // 載入CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.css";
    document.head.appendChild(link);

    // 載入JS
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.js.iife.js";
    script.onload = callback;
    document.head.appendChild(script);
  }

  /**
   * 創建B頁導覽
   */
  createBPageTour() {
    const picMode = document.querySelectorAll(".imglist-text").length !== 0;
    const driver = window.driver.js.driver;

    const driverObj = driver({
      showButtons: ["next", "previous"],
      allowClose: false,
      nextBtnText: "▶",
      prevBtnText: "◀",
      doneBtnText: "好耶",
      showProgress: true,
      steps: this.getBPageTourSteps(picMode),
    });

    driverObj.drive();
  }

  /**
   * 獲取B頁導覽步驟
   */
  getBPageTourSteps(picMode) {
    return [
      {
        element: ".beeSettingTag",
        popover: {
          title: "客製化設定",
          description:
            "在這裡可以進行詳細的個人設定，設定變更後需要【重新整理】頁面才會生效。",
        },
      },
      {
        element: picMode
          ? "#BH-master > form > div > table > tbody > tr > td.b-list__main > div > div > p"
          : "#BH-master > form > div > table > tbody > tr > td.b-list__main > a",
        popover: {
          title: "即時瀏覽",
          description:
            "如果開啟「點擊時使用即時預覽」，文章標題的跳轉會以即時預覽的方式啟動。",
          side: "bottom",
        },
      },
      {
        element:
          "#BH-master > form > div > table > tbody > tr > td.b-list__main",
        popover: {
          title: "快速選取",
          description:
            "除了文章標題、縮圖模式的預覽圖，其他區域可以觸發快速選取。功能等同左方的勾選方塊。",
          side: "bottom",
          onNextClick: () => {
            this.showFunctionButtons();
            driverObj.moveNext();
          },
        },
      },
      {
        element: picMode
          ? "#BH-master > form > div > table > tbody > tr:nth-child(2) > td:nth-child(3)"
          : "#BH-master > form > div > table > tbody > tr:nth-child(2) > td:nth-child(3)",
        popover: {
          title: "功能按鈕",
          description:
            "如果開啟「插入功能按鈕」，指標指向的文章後方會出現三個功能按鈕，分別是「即時預覽」「新分頁開啟」「複製連結」。",
          side: "bottom",
          onNextClick: () => {
            this.hideFunctionButtons();
            this.clickPreviewButton(picMode);
            driverObj.moveNext();
          },
        },
      },
      {
        element: "#BH-master > form > section:last-child > div",
        popover: {
          title: "功能選單",
          description: "快速預覽視窗中，功能選單會漂浮在下方，方便使用！",
          side: "bottom",
          onPrevClick: () => {
            this.closePreviewer();
            this.showFunctionButtons();
            driverObj.movePrevious();
          },
          onNextClick: () => {
            this.closePreviewer();
            driverObj.moveNext();
          },
        },
      },
    ];
  }

  /**
   * 顯示功能按鈕
   */
  showFunctionButtons() {
    const buttons = [".bee_preview", ".bee_open_new_wd", ".bee_link"];

    buttons.forEach((selector) => {
      const button = document.querySelector(
        `#BH-master > form > div > table > tbody > tr:nth-child(2) > td:nth-child(3) > a.btn-icon.btn-icon--inverse${selector}`
      );
      if (button) {
        button.style.display = "inline-block";
      }
    });
  }

  /**
   * 隱藏功能按鈕
   */
  hideFunctionButtons() {
    const buttons = [".bee_preview", ".bee_open_new_wd", ".bee_link"];

    buttons.forEach((selector) => {
      const button = document.querySelector(
        `#BH-master > form > div > table > tbody > tr:nth-child(2) > td:nth-child(3) > a.btn-icon.btn-icon--inverse${selector}`
      );
      if (button) {
        button.style.display = "none";
      }
    });
  }

  /**
   * 點擊預覽按鈕
   */
  clickPreviewButton(picMode) {
    const selector = picMode
      ? "#BH-master > form > div > table > tbody > tr:nth-child(2) > td.b-list__main > div > a"
      : "#BH-master > form > div > table > tbody > tr:nth-child(2) > td.b-list__main > a";

    const button = document.querySelector(selector);
    if (button) {
      button.click();
    }
  }

  /**
   * 關閉預覽器
   */
  closePreviewer() {
    const closeButton = document.querySelector("#BH-menu-path");
    if (closeButton) {
      closeButton.click();
    }
  }

  /**
   * 創建首頁導覽
   */
  createHomeTour() {
    const driver = window.driver.js.driver;

    const driverObj = driver({
      showButtons: ["next", "previous"],
      allowClose: false,
      nextBtnText: "▶",
      prevBtnText: "◀",
      doneBtnText: "好耶",
      showProgress: true,
      steps: [
        {
          element: "#homeStyleSwitch",
          popover: {
            title: "滿版首頁",
            description: "點此可以切換首頁排版。",
          },
        },
      ],
    });

    driverObj.drive();
  }
}

/**
 * 檢舉提醒管理器
 */
class ReportManager {
  constructor(settings) {
    this.settings = settings;
  }

  /**
   * 檢查檢舉提醒
   */
  checkAlert(isNewVersion) {
    if (!this.shouldCheckReport()) return;

    const isReported = this.detectReport();
    if (!isReported) return;

    const bsn = this.extractBsn();
    if (!bsn) {
      console.log("[WARN] 有檢舉但抓取連結失敗");
      return;
    }

    this.openReportPage(bsn);
  }

  /**
   * 檢查是否應該檢查檢舉
   */
  shouldCheckReport() {
    return (
      window.location.href.includes("forum.gamer.com.tw/B.php") &&
      this.settings.getBool("showAbuse")
    );
  }

  /**
   * 檢測是否有檢舉
   */
  detectReport() {
    const reportElement = document.querySelector(
      "#BH-slave > div.BH-rbox.FM-rbox14 > div.FM-master-btn > a > span"
    );
    return reportElement !== null;
  }

  /**
   * 提取BSN參數
   */
  extractBsn() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("bsn");
  }

  /**
   * 開啟檢舉頁面
   */
  openReportPage(bsn) {
    // 這裡需要使用全域的openInFrame函數
    if (typeof openInFrame === "function") {
      openInFrame(`https://forum.gamer.com.tw/gemadmin/accuse.php?bsn=${bsn}`);
    }
  }
}

/**
 * 動畫管理器
 */
class AnimationManager {
  /**
   * 彈出元素初始化
   */
  async popElementInit(element, show = true, anime = "ud", waitAppend = true) {
    if (waitAppend) {
      requestAnimationFrame(() => {
        this.setElementDimensions(element);
      });
    } else {
      this.setElementDimensions(element);
    }

    this.setupElementTransition(element, show, anime);
  }

  /**
   * 設置元素尺寸
   */
  setElementDimensions(element) {
    element.style.readHeight =
      element.scrollHeight === 0 ? "999px" : `${element.scrollHeight}px`;
    element.style.readWidth =
      element.scrollWidth === 0 ? "999px" : `${element.scrollWidth}px`;
  }

  /**
   * 設置元素過渡
   */
  setupElementTransition(element, show, anime) {
    Object.assign(element.style, {
      transition: "",
      overflow: "hidden auto",
      opacity: "0",
    });

    this.popElement(element, "false", anime);
    element.style.transition =
      "all 0.5s cubic-bezier(0.21, 0.3, 0.18, 1.37) 0s";

    if (!show) {
      element.style.beeShow = "false";
      return;
    }

    element.style.beeShow = "true";
    element.style.opacity = "1";

    requestAnimationFrame(() => {
      element.style.maxHeight = element.style.readHeight;
    });
  }

  /**
   * 彈出元素控制
   */
  popElement(element, show = "true", anime = "ud") {
    const doShow =
      show === "toggle" ? !(element.style.beeShow === "true") : show === "true";

    if (doShow) {
      this.showElement(element);
    } else {
      this.hideElement(element, anime);
    }
  }

  /**
   * 顯示元素
   */
  showElement(element) {
    Object.assign(element.style, {
      opacity: "1",
      maxHeight: element.style.readHeight,
      maxWidth: element.style.readWidth,
      transform: "translateX(0px) translateY(0px)",
      beeShow: "true",
    });
  }

  /**
   * 隱藏元素
   */
  hideElement(element, anime) {
    element.style.beeShow = "false";
    element.style.opacity = "0";

    if (anime.includes("u")) {
      element.style.maxHeight = "0px";
      if (anime.startsWith("d")) {
        element.style.transform = `translateX(0px) translateY(${element.style.readWidth}px)`;
      }
    }

    if (anime.includes("l")) {
      element.style.maxWidth = "0px";
      if (anime.startsWith("r")) {
        element.style.transform = `translateX(${element.style.readHeight}) translateY(0px)`;
      }
    }
  }
}
/**
 * 首頁功能模組
 * 負責首頁的版面切換和樣式調整功能
 */
class HomePageWorker {
  constructor(settings) {
    this.settings = settings;
  }

  /**
   * 初始化首頁功能
   */
  init() {
    if (!this.isHomePage()) return;

    this.addStyleSwitchButton();
    this.applyHomeStyles();
  }

  /**
   * 檢查是否為首頁
   */
  isHomePage() {
    return (
      window.location.href.includes("www.gamer.com.tw") &&
      document.querySelectorAll("div.BA-lbox.BA-lbox3").length > 0
    );
  }

  /**
   * 添加樣式切換按鈕
   */
  addStyleSwitchButton() {
    const baServeElement = document.querySelector(".BA-serve");
    if (!baServeElement) return;

    const switchButton = document.createElement("li");
    switchButton.id = "homeStyleSwitch";
    switchButton.innerHTML = "首頁滿版切換";
    baServeElement.appendChild(switchButton);

    switchButton.addEventListener("click", () => {
      this.toggleHomeStyle();
    });
  }

  /**
   * 切換首頁樣式
   */
  toggleHomeStyle() {
    const currentValue = this.settings.getBool("homeStyleSwitch");
    this.settings.set("homeStyleSwitch", (!currentValue).toString());
    location.reload();
  }

  /**
   * 應用首頁樣式
   */
  applyHomeStyles() {
    if (!this.settings.getBool("homeStyleSwitch")) return;

    this.reorganizeContainers();
    this.createSecondLeftNav();
    this.addCustomStyles();
  }

  /**
   * 重新組織容器
   */
  reorganizeContainers() {
    const hotboardContainer = document.getElementById("hotboardContainer");
    const guildContainer = document.getElementById("guildContainer");
    const hothalaContainer = document.getElementById("hothalaContainer");

    if (hotboardContainer && guildContainer && hothalaContainer) {
      hothalaContainer.appendChild(hotboardContainer);
      hothalaContainer.appendChild(guildContainer);
    }
  }

  /**
   * 創建第二個左側導航
   */
  createSecondLeftNav() {
    const bahaStoreContainer = document.querySelectorAll(
      "div.BA-lbox.BA-lbox3"
    )[0];
    const bahaAnimeContainer = document.querySelectorAll(
      "div.BA-lbox.BA-lbox3"
    )[1];
    const titles = document.querySelectorAll("h1.BA-ltitle");
    const wrapper = document.querySelectorAll("div.BA-wrapper.BA-main")[0];
    const center = document.querySelectorAll("div.BA-center")[0];

    if (!bahaStoreContainer || !bahaAnimeContainer || !wrapper || !center)
      return;

    const secondDivLeft = document.createElement("div");
    secondDivLeft.className = "BA-left";

    Object.assign(secondDivLeft.style, {
      flex: "0 0 11em",
      margin: "0 0 0 1em",
    });

    // 添加標題和容器
    if (titles[1]) secondDivLeft.appendChild(titles[1]);
    secondDivLeft.appendChild(bahaAnimeContainer);
    if (titles[0]) secondDivLeft.appendChild(titles[0]);
    secondDivLeft.appendChild(bahaStoreContainer);

    wrapper.insertBefore(secondDivLeft, center);
  }

  /**
   * 添加自定義樣式
   */
  addCustomStyles() {
    const styleElement = document.createElement("style");
    styleElement.textContent = this.getCustomCSS();
    document.head.appendChild(styleElement);
  }

  /**
   * 獲取自定義CSS
   */
  getCustomCSS() {
    return `
            /* 父容器設置 */
            .BA-wrapper.BA-main {
                display: flex;
                flex-wrap: wrap;
                width: auto;
            }

            /* 第一層左側固定寬度 */
            .BA-left {
                flex: 0 0 11em;
            }

            /* 第一層右側容器 */
            .BA-center {
                flex: 1;
                display: flex;
                flex-wrap: wrap;
            }

            #gnnContainer {
                flex: 0 0 45%;
                margin: 0 1% 2% 1%;
                order: 1;
            }

            #hothalaContainer {
                flex: 45%;
                margin: 0 1% 2% 1%;
                order: 2;
            }

            #homeContainer {
                flex: 45%;
                margin: 0 1% 2% 1%;
                order: 3;
            }

            #buyContainer {
                flex: 0 0 45%;
                margin: 0 1% 2% 1%;
                order: 4;
            }

            #liveContainer {
                flex: 45%;
                margin: 0 1% 2% 1%;
                order: 5;
            }

            #gamecrazyContainer {
                flex: 0 0 45%;
                margin: 0 1% 2% 1%;
                order: 6;
            }

            .BA-cbox7 p {
                text-align: left !important;
            }
        `;
  }
}

/**
 * 工具函數模組
 * 提供全域使用的工具函數
 */
class UtilityFunctions {
  /**
   * 在框架中打開URL（全域函數）
   */
  static openInFrame(url) {
    const iframe = document.getElementById("bee_frame");
    if (!iframe) return;

    iframe.src = url;

    const menuPath = document.querySelector("#BH-menu-path");
    if (menuPath) {
      menuPath.style.height = "100%";
      menuPath.style.opacity = "0.6";
    }

    setTimeout(() => {
      const container = document.querySelector(".bee_preview_wd");
      if (container) {
        const animationManager = new AnimationManager();
        const direction =
          localStorage.getItem("preview_LR") === "true" ? "rl" : "lr";
        animationManager.popElement(container, "true", direction);
      }
    }, 1000);

    // 設置iframe樣式
    setTimeout(() => {
      UtilityFunctions.setupIframeStyles(iframe);
    }, 1000);
  }

  /**
   * 設置iframe樣式
   */
  static setupIframeStyles(iframe) {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const styleSheet = iframeDoc.createElement("style");
      iframeDoc.head.appendChild(styleSheet);

      const sheet = styleSheet.sheet;
      sheet.insertRule(
        ".managertools { position: fixed; bottom: 0; right: 0; z-index: 100; }",
        0
      );
    } catch (error) {
      console.warn("無法設置iframe樣式:", error);
    }
  }

  /**
   * 滾動到指定元素
   */
  static scrollIntoBee(element, marginOffset = 7) {
    const originalMargin = element.style.marginTop || "0px";
    element.style.marginTop = `-${marginOffset}rem`;
    element.scrollIntoView({ behavior: "smooth" });
    element.style.marginTop = originalMargin;

    setTimeout(() => {
      if (!UtilityFunctions.isInViewport(element)) {
        UtilityFunctions.scrollIntoBee(element, marginOffset);
      }
    }, 300);
  }

  /**
   * 檢查元素是否在視窗內
   */
  static isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  /**
   * 還原原始格式（用於留言處理）
   */
  static restoreOriginalFormat(textContent, cmdContents) {
    const nameToHtmlMap = new Map();
    const htmlPattern = /([^<]+)<\/a>/g;
    let match;

    while ((match = htmlPattern.exec(cmdContents)) !== null) {
      nameToHtmlMap.set(match[1], match[0]);
    }

    let processedText = textContent;
    nameToHtmlMap.forEach((html, name) => {
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const atPattern = new RegExp(`@${escapedName}`, "g");
      processedText = processedText.replace(atPattern, html);
    });

    return processedText;
  }

  /**
   * 格式化日期
   */
  static formatDate(date) {
    return date.toISOString().slice(0, 10).replace(/-/g, "");
  }

  /**
   * 安全獲取元素
   */
  static safeQuerySelector(selector) {
    try {
      return document.querySelector(selector);
    } catch (error) {
      console.warn(`無法找到元素: ${selector}`, error);
      return null;
    }
  }

  /**
   * 安全獲取多個元素
   */
  static safeQuerySelectorAll(selector) {
    try {
      return document.querySelectorAll(selector);
    } catch (error) {
      console.warn(`無法找到元素: ${selector}`, error);
      return [];
    }
  }

  /**
   * 防抖函數
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * 節流函數
   */
  static throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * 深拷貝對象
   */
  static deepClone(obj) {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array)
      return obj.map((item) => UtilityFunctions.deepClone(item));
    if (typeof obj === "object") {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = UtilityFunctions.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }

  /**
   * 生成唯一ID
   */
  static generateUniqueId(prefix = "id") {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 等待指定時間
   */
  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 重試函數
   */
  static async retry(fn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await UtilityFunctions.sleep(delay);
      }
    }
  }

  /**
   * 檢查是否為移動設備
   */
  static isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  /**
   * 獲取瀏覽器信息
   */
  static getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = "Unknown";

    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";

    return {
      browser,
      userAgent: ua,
      isMobile: UtilityFunctions.isMobileDevice(),
    };
  }
}

/**
 * 主插件類別 - Re版本
 * 整合所有模組並提供統一的初始化入口
 */
class BahamutePluginMain extends BahamutePlugin {
  constructor() {
    super();
    //this.homePageWorker = new HomePageWorker(this.settings);
    this.settingsUIManager = new SettingsUIManager(this.settings);
    //this.tipsManager = new TipsManager(this.settings);
    this.reportManager = new ReportManager(this.settings);
  }

  /**
   * 重寫初始化方法
   */
  async init() {
    try {
      console.log("[INFO] 巴哈姆特插件開始初始化...");

      // 基礎初始化
      this.isNewVersion = await this.detectMode();
      this.settings.checkFirstRun();

      // UI初始化
      await this.settingsUIManager.addSettingElement(this.isNewVersion);

      // 功能模組初始化
      await this.initializeWorkers();
      //this.homePageWorker.init();

      // 輔助功能初始化
      //this.tipsManager.checkTips(this.isNewVersion);
      this.reportManager.checkAlert(this.isNewVersion);

      console.log("[INFO] 巴哈姆特插件初始化完成！");
    } catch (error) {
      console.error("[ERROR] 插件初始化失敗:", error);
    }
  }

  /**
   * 獲取插件版本信息
   */
  getVersionInfo() {
    return {
      version: this.version,
      isNewVersion: this.isNewVersion,
      browserInfo: UtilityFunctions.getBrowserInfo(),
      initTime: new Date().toISOString(),
    };
  }

  /**
   * 重置插件設定
   */
  resetSettings() {
    if (confirm("確定要重置所有設定嗎？這將會清除所有自定義配置。")) {
      this.settings.checkFirstRun(true);
      alert("設定已重置，請重新整理頁面。");
      location.reload();
    }
  }

  /**
   * 導出設定
   */
  exportSettings() {
    const settings = {};
    Object.keys(this.settings.defaultSettings).forEach((key) => {
      settings[key] = this.settings.get(key);
    });

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "bahamute-plugin-settings.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  /**
   * 導入設定
   */
  importSettings(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target.result);
        Object.keys(settings).forEach((key) => {
          this.settings.set(key, settings[key]);
        });
        alert("設定導入成功，請重新整理頁面。");
        location.reload();
      } catch (error) {
        alert("設定文件格式錯誤，請檢查文件內容。");
      }
    };
    reader.readAsText(file);
  }
}

// 將工具函數設為全域可用
window.openInFrame = UtilityFunctions.openInFrame;
window.scrollIntoBee = UtilityFunctions.scrollIntoBee;
window.isInViewport = UtilityFunctions.isInViewport;
window.restoreOriginalFormat = UtilityFunctions.restoreOriginalFormat;

// 初始化插件（替換原本的立即執行函數）
(async function () {
  "use strict";

  // 等待DOM載入完成
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      new BahamutePluginMain();
    });
  } else {
    new BahamutePluginMain();
  }
})();

// 開發者工具（僅在開發模式下可用）
if (typeof GM_info !== "undefined" && GM_info.script.name.includes("dev")) {
  window.BahamutePluginDev = {
    getPlugin: () => window.bahamutePluginInstance,
    resetSettings: () => window.bahamutePluginInstance?.resetSettings(),
    exportSettings: () => window.bahamutePluginInstance?.exportSettings(),
    getVersionInfo: () => window.bahamutePluginInstance?.getVersionInfo(),
    utils: UtilityFunctions,
  };
}
