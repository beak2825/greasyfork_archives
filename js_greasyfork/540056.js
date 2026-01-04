// ==UserScript==
// @name Auto Read Bee Enhanced
// @namespace http://tampermonkey.net/
// @version 2.0.2
// @description Linuxdo auto read with enhanced performance and error handling
// @author bee-enhanced
// @match https://meta.discourse.org/*
// @match https://linux.do/*
// @match https://meta.appinn.net/*
// @match https://community.openai.com/*
// @grant GM_xmlhttpRequest
// @license MIT
// @icon https://www.google.com/s2/favicons?domain=linux.do
// @downloadURL https://update.greasyfork.org/scripts/540056/Auto%20Read%20Bee%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/540056/Auto%20Read%20Bee%20Enhanced.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * 主要自動閱讀類別
   */
  class AutoReadBee {
    constructor() {
      this.config = new ConfigManager();
      this.ui = new UIManager(this);
      this.reader = new AutoReader(this);
      this.translator = new TranslatorManager(this);
      this.utils = new Utils();

      this.floorStatus = {
        startFloor: 0,
        endFloor: 0,
        lastStartFloor: 0,
        lastEndFloor: 0,
        readCounter: this.config.get("readCounter", 0),
        failCounter: 0,
        rebootUrl: null,
      };

      this.readInterval = null;
      this.directWaitCounter = 0;
      this.waitNextRefresh = 0;
      this.retryCount = 0;
      this.maxRetries = 3;

      this.init();
    }

    /**
     * 初始化應用程式
     */
    async init() {
      try {
        await this.utils.waitForReady();
        this.config.initDefaults();
        this.ui.init();
        this.setupEventListeners();
        this.checkContinueReading();
        this.utils.addDebugLog("[INFO] AutoReadBee 初始化完成");
      } catch (error) {
        this.utils.addDebugLog(`[ERROR] 初始化失敗: ${error.message}`);
      }
    }

    /**
     * 設置事件監聽器
     */
    setupEventListeners() {
      // 使用 IntersectionObserver 監控元素可見性
      //this.setupIntersectionObserver();

      // 監聽頁面變化
      this.setupMutationObserver();

      this.addFloorListener();
    }

    /**
     * 設置 Intersection Observer
     */
    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      };

      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.handleElementInView(entry.target);
          }
        });
      }, options);
    }

    /**
     * 設置 Mutation Observer
     */
    setupMutationObserver() {
      this.mutationObserver = new MutationObserver(
        this.utils.debounce((mutations) => {
          mutations.forEach((mutation) => {
            // log
            this.utils.addDebugLog(
              `[MUTATION] [${mutation.type}] class[${mutation.target.className}] tag[${mutation.target.tagName}] #${mutation.target.id}`
            );
            // 處理子元素變化
            if (
              mutation.type ===
              "childList" /* && mutation.target.className.includes('topic-body')*/
            ) {
              //this.utils.addDebugLog(`[DEBUG] [${mutation.type}] class[${mutation.target.className}] tag[${mutation.target.tagName}] #${mutation.target.id}`);
              this.utils.addDebugLog(`[DEBUG] [new post]`);
              this.handleDOMChanges(mutation);
            }

            // 處理屬性變化 - 這是關鍵！
            // if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            //     this.translator.handleEditorToolbar(mutation);
            // }

            // 也檢查 childList 類型的 mutation.target
            this.translator.handleEditorToolbar(mutation);
          });
        }, 100)
      );

      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"], // 只監聽 class 屬性變化
      });
    }

    addFloorListener() {
      // 6. 处理现有的 article 元素
      const articleElements = Array.from(
        document.querySelectorAll("article")
      ).filter((articleElement) => articleElement.id !== undefined);

      articleElements.forEach((articleElement) => {
        handleArticle(articleElement);
      });

      // 7. 监听新的 article 元素的添加
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          //this.utils.addDebugLog(`[MUTATION] [${mutation.type}] class[${mutation.target.className}] tag[${mutation.target.tagName}] #${mutation.target.id}`);
          // add editor btn
          if (
            mutation.type === "childList11" &&
            mutation.target.className ===
              "select-kit single-select dropdown-select-box toolbar-popup-menu-options ember-view options"
          ) {
            if (
              document.querySelector(
                ".btn.no-text.btn-icon.d-icon-discourse-sparkles"
              )
            )
              return;
            // add new btn in class==d-editor-button-bar
            // create new button
            const newBtn = document.createElement("button");
            newBtn.className = "btn no-text btn-icon d-icon-discourse-sparkles";
            newBtn.title = "ai";
            newBtn.type = "button";
            newBtn.tabIndex = -1;
            // add ai reply icon
            const newBtnSvg = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg"
            );
            newBtnSvg.classList.add(
              "fa",
              "d-icon",
              "d-icon-discourse-sparkles",
              "svg-icon",
              "svg-string"
            );
            const newBtnUse = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "use"
            );
            newBtnUse.setAttributeNS(
              "http://www.w3.org/1999/xlink",
              "xlink:href",
              "#discourse-sparkles"
            );
            newBtnSvg.appendChild(newBtnUse);
            newBtn.appendChild(newBtnSvg);
            // add translate icon
            const newBtnTrans = document.createElement("button");
            newBtnTrans.className = "btn no-text btn-icon d-icon-keyboard";
            newBtnTrans.title = "Translate";
            newBtnTrans.type = "button";
            newBtnTrans.tabIndex = -1;
            const newBtnTransSvg = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg"
            );
            newBtnTransSvg.classList.add(
              "fa",
              "d-icon",
              "d-icon-keyboard",
              "svg-icon",
              "svg-string"
            );
            const newBtnTransUse = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "use"
            );
            newBtnTransUse.setAttributeNS(
              "http://www.w3.org/1999/xlink",
              "xlink:href",
              "#keyboard"
            );
            newBtnTransSvg.appendChild(newBtnTransUse);
            newBtnTrans.appendChild(newBtnTransSvg);
            // end, add them to buttonBar
            const buttonBar = document.querySelector(".d-editor-button-bar");
            buttonBar.appendChild(newBtn);
            buttonBar.appendChild(newBtnTrans);

            let intervalId = null;
            newBtn.addEventListener("click", () => {
              this.utils.addDebugLog("[INFO] Ai reply Clicked");
              //   if (intervalId) {
              //     clearInterval(intervalId);
              //     intervalId = null;
              //   }
              const linkElement = document.querySelector(".action-title a");
              if (linkElement) {
                const linkValue = `https://${
                  window.location.hostname
                }${linkElement.getAttribute("href")}`;
                let replyText;
                let beenDirected = false;
                //intervalId = setInterval(() => {
                this.utils.addDebugLog("[INFO] try to get reply...");
                if (linkValue.split("/").length === 6) {
                  replyText = document.getElementById(`post_1`);
                } else {
                  replyText = document.getElementById(
                    `post_${linkValue.split("/")[6]}`
                  );
                }
                if (replyText) {
                  replyText = replyText.querySelector(".cooked").textContent;
                  this.utils.addDebugLog("[INFO] reply Text => " + replyText);
                  // disable newBtn to prevent double click
                  newBtn.style.pointerEvents = "none";
                  const custom_oaiPromptCmd = localStorage.getItem(
                    "custom_oaiPromptCmd"
                  );
                  const prompt =
                    !custom_oaiPromptCmd || custom_oaiPromptCmd === ""
                      ? localStorage.getItem("oaiPromptCmd")
                      : custom_oaiPromptCmd;
                  postGpt(
                    prompt,
                    "針對以下內容發表一些想法或回應：```" + replyText + "```"
                  ).then(async ({ response, data }) => {
                    newBtn.style.pointerEvents = "auto";
                    if (!response) {
                      return;
                    }

                    const textarea = document.querySelector(
                      ".ember-text-area.ember-view.d-editor-input"
                    );
                    if (textarea) {
                      textarea.value =
                        textarea.value + data.choices[0].message.content;

                      // 手動觸發 input 事件
                      const event = new Event("input", { bubbles: true });
                      textarea.dispatchEvent(event);
                    }
                  });

                  //clearInterval(intervalId); // 找到後清除定時器
                  intervalId = null;
                } else {
                  if (!beenDirected) {
                    this.utils.addDebugLog("[INFO] goto => " + linkValue);
                    beenDirected = true;
                    gotoUrl(linkValue);
                  }
                }
                //}, 300);

                // fin class="ember-text-area ember-view d-editor-input" and set textarea's value
              } else {
                this.utils.addDebugLog("[INFO] cant find reply user");
              }
            });

            let intervalIdTrans = null;
            newBtnTrans.addEventListener("click", () => {
              this.utils.addDebugLog("[INFO] Ai reply Clicked");
              //   if (intervalIdTrans) {
              //     clearInterval(intervalIdTrans);
              //     intervalIdTrans = null;
              //   }
              const linkElement = document.querySelector(".action-title a");
              if (linkElement) {
                let replyText;
                const textarea = document.querySelector(
                  ".ember-text-area.ember-view.d-editor-input"
                );
                replyText = textarea.value;

                //intervalIdTrans = setInterval(() => {
                this.utils.addDebugLog("[INFO] try to translate...");
                if (replyText.length > 4) {
                  this.utils.addDebugLog(
                    "[INFO] translate Text => " + replyText
                  );
                  // disable newBtn to prevent double click
                  newBtn.style.pointerEvents = "none";
                  const custom_oaiPromptCmd = localStorage.getItem(
                    "custom_oaiPromptCmd"
                  );
                  const prompt =
                    !custom_oaiPromptCmd || custom_oaiPromptCmd === ""
                      ? localStorage.getItem("oaiPromptCmd")
                      : custom_oaiPromptCmd;
                  const textarea = document.querySelector(
                    ".ember-text-area.ember-view.d-editor-input"
                  );
                  let temp_originText = textarea.value;
                  textarea.value = "翻譯中...\n" + textarea.value;
                  postGpt(
                    prompt,
                    "將以下內容轉換成簡體中文，盡量保持原文，只輸出結果：```" +
                      replyText +
                      "```"
                  ).then(async ({ response, data }) => {
                    newBtn.style.pointerEvents = "auto";
                    const event = new Event("input", { bubbles: true });
                    if (!response) {
                      this.utils.addDebugLog("[ERROR] translate failed");
                      textarea.value = temp_originText; // 恢復原文
                      // 手動觸發 input 事件
                      textarea.dispatchEvent(event);
                      return;
                    }

                    if (textarea) {
                      textarea.value = data.choices[0].message.content;
                      // 手動觸發 input 事件
                      textarea.dispatchEvent(event);
                    }
                  });
                  //clearInterval(intervalIdTrans);
                  intervalIdTrans = null;
                } else {
                  this.utils.addDebugLog("[WARN] no text to translate");
                }
                //}, 300);
              } else {
                this.utils.addDebugLog("[INFO] cant find reply user");
              }
            });
          }
          // add floor
          else if (
            mutation.type === "childList" &&
            mutation.target.className ===
              "select-kit single-select dropdown-select-box toolbar-popup-menu-options ember-view options"
          ) {
            this.translator.addTranslatorButtons();
          } else if (
            mutation.type === "childList" &&
            mutation.addedNodes.length > 0
          ) {
            mutation.addedNodes.forEach((node) => {
              /*if (node.tagName === 'ARTICLE') {
                                                  handleArticle(node);
                                                    this.utils.addDebugLog("run F");
                                                }*/
              // 6. 处理现有的 article 元素
              const articleElements = Array.from(
                document.querySelectorAll("article")
              ).filter((articleElement) => articleElement.id !== undefined);

              articleElements.forEach((articleElement) => {
                handleArticle(articleElement);
              });
            });
          }
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });

      function handleArticle(articleElement) {
        // 2. 提取 article 的 id 數字
        const postId = parseInt(articleElement.id.replace("post_", ""));

        // 3. 生成文字
        const text = postId + " F";

        // 4. 在 [[代碼插入處]] 插入文字 (修改部分)
        const avatarDiv = articleElement.querySelector(".topic-avatar");
        if (avatarDiv === null) return;
        const existingText = avatarDiv.querySelector(
          `div[id='post-${postId}-f']`
        ); // 檢查是否存在新添加的文字

        if (!existingText) {
          // 如果不存在，才插入
          const newText = document.createElement("div");
          newText.textContent = text;
          newText.id = `post-${postId}-f`; // 添加 ID
          newText.style.textAlign = "center"; // 設置文字居中
          newText.style.cursor = "pointer"; // 設置鼠標指針為鏈接樣式

          avatarDiv.appendChild(newText);
        }
      }
    }

    /**
     * 處理 DOM 變化
     */
    handleDOMChanges(mutation) {
      try {
        // 處理新增的文章元素
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            /*if (node.tagName === 'ARTICLE') {
                                              handleArticle(node);
                                                this.utils.addDebugLog("run F");
                                            }*/
            // 6. 处理现有的 article 元素
            const articleElements = Array.from(
              document.querySelectorAll("article")
            ).filter((articleElement) => articleElement.id !== undefined);

            articleElements.forEach((articleElement) => {
              handleArticle(articleElement);
            });
          });
        }
      } catch (error) {
        this.utils.addDebugLog(`[ERROR] DOM 變化處理失敗: ${error.message}`);
      }

      function handleArticle(articleElement) {
        // 2. 提取 article 的 id 數字
        const postId = parseInt(articleElement.id.replace("post_", ""));

        // 3. 生成文字
        const text = postId + " F";

        // 4. 在 [[代碼插入處]] 插入文字 (修改部分)
        const avatarDiv = articleElement.querySelector(".topic-avatar");
        if (avatarDiv === null) return;
        const existingText = avatarDiv.querySelector(
          `div[id='post-${postId}-f']`
        ); // 檢查是否存在新添加的文字

        if (!existingText) {
          // 如果不存在，才插入
          const newText = document.createElement("div");
          newText.textContent = text;
          newText.id = `post-${postId}-f`; // 添加 ID
          newText.style.textAlign = "center"; // 設置文字居中
          newText.style.cursor = "pointer"; // 設置鼠標指針為鏈接樣式

          avatarDiv.appendChild(newText);
        }
      }
    }

    /**
     * 開始自動閱讀
     */
    async startAutoRead(singleTopic = false) {
      if (this.readInterval) {
        this.stopAutoRead();
      }

      const rate = this.config.get("blueDotMode", true)
        ? this.config.get("refreshRateBlueDot", 350)
        : Math.max(this.config.get("refreshRateNormal", 2400), 2000);

      this.utils.addDebugLog(`[INFO] 開始自動閱讀，速度: ${rate}ms`);

      this.readInterval = setInterval(async () => {
        try {
          await this.reader.processReading(singleTopic);
        } catch (error) {
          this.utils.addDebugLog(`[ERROR] 閱讀處理失敗: ${error.message}`);
          this.handleReadError();
        }
      }, rate);
    }

    /**
     * 停止自動閱讀
     */
    stopAutoRead() {
      if (this.readInterval) {
        clearInterval(this.readInterval);
        this.readInterval = null;
        this.utils.addDebugLog("[INFO] 停止自動閱讀");
      }
    }

    /**
     * 處理閱讀錯誤
     */
    handleReadError() {
      this.retryCount++;
      if (this.retryCount >= this.maxRetries) {
        this.utils.addDebugLog("[ERROR] 達到最大重試次數，停止閱讀");
        this.stopAutoRead();
        this.retryCount = 0;
      }
    }

    /**
     * 檢查是否繼續閱讀
     */
    checkContinueReading() {
      if (this.config.get("read", false)) {
        this.config.set("read", false);
        this.ui.toggleReading();
      }
    }
  }

  /**
   * 配置管理器
   */
  class ConfigManager {
    constructor() {
      this.defaults = {
        isFirstRun: false,
        read: false,
        autoLikeEnabled: false,
        unreadList: [],
        readUrl: "https://linux.do/t/topic/1",
        blueDotMode: true,
        stopLimit: 250,
        refreshRateBlueDot: 350,
        refreshRateNormal: 2400,
        reloadWaitTime: 25,
        debugPanel: false,
        readCounter: 0,
        oaiBaseUrl: "https://example.com/v1/chat/completions",
        oaiKey: "sk-",
        oaiModel: "gpt-3.5-turbo",
      };
    }

    /**
     * 初始化預設值
     */
    initDefaults() {
      Object.entries(this.defaults).forEach(([key, value]) => {
        if (this.get(key) === null) {
          this.set(key, value);
        }
      });
    }

    /**
     * 獲取配置值
     */
    get(key, defaultValue = null) {
      try {
        const value = localStorage.getItem(key);
        if (value === null) return defaultValue;

        // 嘗試解析 JSON
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      } catch (error) {
        console.error(`配置讀取失敗 ${key}:`, error);
        return defaultValue;
      }
    }

    /**
     * 設置配置值
     */
    set(key, value) {
      try {
        const stringValue =
          typeof value === "string" ? value : JSON.stringify(value);
        localStorage.setItem(key, stringValue);
        return true;
      } catch (error) {
        console.error(`配置保存失敗 ${key}:`, error);
        return false;
      }
    }

    /**
     * 驗證 API 金鑰格式
     */
    validateApiKey(key) {
      return key && key.startsWith("sk-") && key.length > 10;
    }
  }

  /**
   * UI 管理器
   */
  class UIManager {
    constructor(app) {
      this.app = app;
      this.debugTextarea = null;
    }

    /**
     * 初始化 UI
     */
    init() {
      this.createButtonContainer();
      this.addControlButtons();
      this.addFloorNumbers();
      this.cleanTransitions();

      if (this.app.config.get("debugPanel", false)) {
        this.createDebugPanel();
      }
    }

    /**
     * 創建按鈕容器
     */
    createButtonContainer() {
      const sidebar = document.querySelector(".sidebar-footer-wrapper");
      if (!sidebar) return;

      const container = document.createElement("div");
      container.className = "auto-read-controls";
      container.style.cssText = `
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-bottom: 10px;
            `;

      sidebar.prepend(container);
    }

    /**
     * 添加控制按鈕
     */
    addControlButtons() {
      this.addMainButton();
      this.addSingleTopicButton();
      this.addResetButton();
      this.addSettingsButton();
    }

    /**
     * 添加主要控制按鈕
     */
    addMainButton() {
      const button = this.createSidebarButton(
        "btnAutoRead",
        "▶",
        "開始/停止自動閱讀"
      );
      button.onclick = () => this.toggleReading();
      this.updateButtonText();
    }

    /**
     * 添加單篇文章按鈕
     */
    addSingleTopicButton() {
      const button = this.createSidebarButton(
        "btnAutoRead2",
        "▼",
        "單篇文章閱讀"
      );
      button.onclick = () => {
        const isReading = this.app.config.get("read", false);
        const newState = !isReading;

        this.app.config.set("read", newState);
        this.updateButtonText();

        if (newState) {
          this.app.startAutoRead(true); // 單篇模式
        } else {
          this.app.stopAutoRead();
        }
      };
    }

    /**
     * 添加重置按鈕
     */
    addResetButton() {
      const button = this.createSidebarButton(
        "btnAutoReadReset",
        "✨",
        "重置閱讀計數"
      );
      button.onclick = () => {
        this.app.floorStatus.readCounter = 0;
        this.app.config.set("readCounter", 0);
        this.updateButtonText();
        this.app.utils.addDebugLog("[INFO] 閱讀計數已重置");
      };
    }

    /**
     * 添加設置按鈕
     */
    addSettingsButton() {
      const button = this.createSidebarButton(
        "btnAutoReadSetting",
        "⚙️",
        "設置"
      );
      button.onclick = (e) => {
        e.preventDefault();
        this.createSettingsDialog();
      };
    }

    /**
     * 切換閱讀狀態
     */
    toggleReading() {
      const isReading = this.app.config.get("read", false);
      const newState = !isReading;

      this.app.config.set("read", newState);
      this.updateButtonText();

      if (newState) {
        this.app.startAutoRead();
      } else {
        this.app.stopAutoRead();
      }
    }

    /**
     * 更新按鈕文字
     */
    updateButtonText() {
      const button = document.getElementById("btnAutoRead");
      if (button) {
        const isReading = this.app.config.get("read", false);
        const counter = this.app.floorStatus.readCounter;
        button.textContent = isReading ? `◼ (${counter})` : `▶ (${counter})`;
      }
    }

    /**
     * 創建側邊欄按鈕
     */
    createSidebarButton(id, text, title) {
      const container = document.querySelector(".auto-read-controls");
      if (!container) return null;

      const li = document.createElement("li");
      li.className = "sidebar-section-link-wrapper";
      li.style.margin = "0";

      const a = document.createElement("a");
      a.className = "ember-view sidebar-section-link sidebar-row";
      a.title = title;

      const span = document.createElement("span");
      span.className = "sidebar-section-link-content-text";
      span.id = id;
      span.textContent = text;

      a.appendChild(span);
      li.appendChild(a);
      container.appendChild(li);

      return span;
    }

    /**
     * 添加樓層號碼
     */
    addFloorNumbers() {
      const articles = document.querySelectorAll('article[id^="post_"]');
      articles.forEach((article) => this.addFloorNumber(article));
    }

    /**
     * 為文章添加樓層號碼
     */
    addFloorNumber(article) {
      try {
        const postId = parseInt(article.id.replace("post_", ""));
        const avatarDiv = article.querySelector(".topic-avatar");

        if (!avatarDiv || avatarDiv.querySelector(`#post-${postId}-f`)) return;

        const floorDiv = document.createElement("div");
        floorDiv.id = `post-${postId}-f`;
        floorDiv.textContent = `${postId} F`;
        floorDiv.style.cssText = `
                    text-align: center;
                    cursor: pointer;
                `;

        avatarDiv.appendChild(floorDiv);
      } catch (error) {
        this.app.utils.addDebugLog(
          `[ERROR] 添加樓層號碼失敗: ${error.message}`
        );
      }
    }

    /**
     * 創建設置項目
     */
    createSettingItems(dialog) {
      const title = document.createElement("h3");
      title.textContent = "設定";
      title.style.marginBottom = "20px";

      // 藍點模式設定
      const blueDotRow = this.createSettingRow("藍點模式", "blueDotMode");
      const readLimitRow = this.createInputRow(
        "讀多少休息呢？",
        "stopLimit",
        250
      );
      const refreshRateForBlueDotMode = this.createInputRow(
        "藍點模式速度",
        "refreshRateBlueDot",
        350
      );
      const refreshRateForNormalMode = this.createInputRow(
        "正常模式速度",
        "refreshRateNormal",
        2400
      );
      const reloadWaitTime = this.createInputRow(
        "藍點卡住多久要刷新呢？(s)",
        "reloadWaitTime",
        25
      );
      const debugPanel = this.createSettingRow("開啟偵錯台", "debugPanel");

      // AI 翻譯設定
      const translateBaseUrl = this.createInputRow(
        "翻譯API Base URL",
        "oaiBaseUrl",
        "https://example.com/v1/chat/completions",
        true
      );
      const translateKey = this.createInputRow(
        "翻譯API Key",
        "oaiKey",
        "sk-",
        true
      );
      const translateModel = this.createInputRow(
        "翻譯模型",
        "oaiModel",
        "gpt-3.5-turbo",
        true
      );
      const oaiPromptSystemMode = this.createSettingRow(
        "支援system的模型",
        "oaiPromptSystemMode"
      );

      // 清除閱讀序列
      const clearReadSequenceRow = this.createClearSequenceRow();

      // 關閉按鈕
      const closeButton = this.createCloseButton(dialog);

      // 添加所有元素到對話框
      dialog.appendChild(title);
      dialog.appendChild(blueDotRow);
      dialog.appendChild(readLimitRow);
      dialog.appendChild(refreshRateForBlueDotMode);
      dialog.appendChild(refreshRateForNormalMode);
      dialog.appendChild(reloadWaitTime);
      dialog.appendChild(debugPanel);
      dialog.appendChild(clearReadSequenceRow);
      dialog.appendChild(translateBaseUrl);
      dialog.appendChild(translateKey);
      dialog.appendChild(translateModel);
      dialog.appendChild(oaiPromptSystemMode);
      dialog.appendChild(closeButton);
    }

    /**
     * 創建設置對話框
     */
    createSettingsDialog() {
      // 移除現有對話框
      const existing = document.querySelector(".settings-dialog");
      if (existing) {
        existing.remove();
        return;
      }

      const dialog = document.createElement("div");
      dialog.className = "settings-dialog";
      dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--primary-low);
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        min-width: 350px;
        max-height: 80vh;
        overflow-y: auto;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

      // 創建設置項目
      this.createSettingItems(dialog);

      document.body.appendChild(dialog);
      setTimeout(() => (dialog.style.opacity = "1"), 10);
    }

    /**
     * 創建設置行
     */
    createSettingRow(labelText, storageKey) {
      const settingRow = document.createElement("div");
      settingRow.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
    `;

      const label = document.createElement("label");
      label.textContent = labelText;
      label.style.marginRight = "10px";

      const toggleSwitch = this.createToggleSwitch(storageKey);

      settingRow.appendChild(label);
      settingRow.appendChild(toggleSwitch);
      return settingRow;
    }

    /**
     * 創建輸入行
     */
    createInputRow(labelText, storageKey, defaultValue, allowString = false) {
      const inputRow = document.createElement("div");
      inputRow.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
    `;

      const label = document.createElement("label");
      label.textContent = labelText;
      label.style.marginRight = "10px";

      const input = document.createElement("input");
      input.type = "text";
      input.style.cssText = `
        width: 150px;
        margin-left: auto;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
    `;

      const storedValue = this.app.config.get(storageKey);
      input.value =
        storedValue !== null ? storedValue : defaultValue.toString();

      input.addEventListener("input", (event) => {
        if (!allowString) {
          event.target.value = event.target.value.replace(/[^0-9]/g, "");
        }
        this.app.config.set(storageKey, event.target.value);
      });

      inputRow.appendChild(label);
      inputRow.appendChild(input);
      return inputRow;
    }

    /**
     * 創建切換開關
     */
    createToggleSwitch(storageKey) {
      const toggleSwitch = document.createElement("label");
      toggleSwitch.className = "switch";
      toggleSwitch.style.cssText = `
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    `;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.style.cssText = `
        opacity: 0;
        width: 0;
        height: 0;
    `;

      const slider = document.createElement("span");
      slider.className = "slider";
      slider.style.cssText = `
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
    `;

      const ball = document.createElement("span");
      ball.style.cssText = `
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: var(--primary-low);
        transition: .4s;
        border-radius: 50%;
    `;

      slider.appendChild(ball);

      // 設置初始狀態
      const savedValue = this.app.config.get(storageKey, false);
      if (savedValue === true || savedValue === "true") {
        checkbox.checked = true;
        slider.style.backgroundColor = "#2196F3";
        ball.style.transform = "translateX(26px)";
      }

      // 修正：使用箭頭函式保持 this 上下文
      checkbox.addEventListener("change", (event) => {
        const isChecked = event.target.checked;
        slider.style.backgroundColor = isChecked ? "#2196F3" : "#ccc";
        ball.style.transform = isChecked ? "translateX(26px)" : "translateX(0)";
        this.app.config.set(storageKey, isChecked);

        // 特殊處理
        if (
          storageKey === "blueDotMode" &&
          this.app.config.get("read") === true
        ) {
          this.app.stopAutoRead();
          this.app.startAutoRead();
        }

        if (storageKey === "debugPanel") {
          if (!isChecked) {
            // 修正：透過 UI 管理器移除除錯面板
            this.removeDebugPanel();
          } else {
            this.createDebugPanel();
          }
        }
      });

      toggleSwitch.appendChild(checkbox);
      toggleSwitch.appendChild(slider);
      return toggleSwitch;
    }

    /**
     * 移除除錯面板
     */
    removeDebugPanel() {
      if (this.debugTextarea) {
        this.debugTextarea.remove();
        this.debugTextarea = null;
        this.app.utils.addDebugLog("[INFO] 除錯面板已關閉");
      }
    }

    /**
     * 創建清除序列行
     */
    createClearSequenceRow() {
      const clearReadSequenceRow = document.createElement("div");
      clearReadSequenceRow.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
    `;

      const clearLabel = document.createElement("label");
      const unreadList = this.app.config.get("unreadList", []);
      clearLabel.textContent = `閱讀序列： ${unreadList.length} 帖`;
      clearLabel.style.marginRight = "10px";

      const clearButton = document.createElement("button");
      clearButton.textContent = "清除";
      clearButton.style.cssText = `
        padding: 6px 12px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s ease;
    `;

      clearButton.addEventListener("mouseover", () => {
        clearButton.style.background = "#c82333";
      });

      clearButton.addEventListener("mouseout", () => {
        clearButton.style.background = "#dc3545";
      });

      clearButton.addEventListener("click", () => {
        this.app.config.set("unreadList", []);
        this.app.utils.addDebugLog("[INFO] 清除閱讀序列");
        clearLabel.textContent = "閱讀序列： 0 帖";
        alert("閱讀序列已清除，下次翻閱文章時，將重新取得列表。");
      });

      clearReadSequenceRow.appendChild(clearLabel);
      clearReadSequenceRow.appendChild(clearButton);
      return clearReadSequenceRow;
    }

    /**
     * 創建關閉按鈕
     */
    createCloseButton(dialog) {
      const closeButton = document.createElement("button");
      closeButton.textContent = "關閉";
      closeButton.style.cssText = `
        margin-top: 20px;
        padding: 8px 16px;
        background: var(--secondary);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s ease;
        width: 100%;
    `;

      closeButton.addEventListener("mouseover", () => {
        closeButton.style.background = "var(--header_background)";
      });

      closeButton.addEventListener("mouseout", () => {
        closeButton.style.background = "var(--secondary)";
      });

      closeButton.addEventListener("click", () => {
        dialog.style.opacity = "0";
        setTimeout(() => dialog.remove(), 300);
      });

      return closeButton;
    }

    /**
     * 清理過渡動畫
     */
    cleanTransitions() {
      const style = document.createElement("style");
      style.innerHTML = `
                .read-state.read {
                    transition: none !important;
                }
            `;
      document.head.appendChild(style);
    }

    /**
     * 創建除錯面板
     */
    createDebugPanel() {
      if (this.debugTextarea) return;

      this.debugTextarea = document.createElement("textarea");
      this.debugTextarea.id = "debugTextarea";
      this.debugTextarea.style.cssText = `
                position: fixed;
                top: 4rem;
                right: 0;
                width: 300px;
                height: 600px;
                z-index: 1000;
                background: rgba(0, 0, 0, 0.9);
                color: #00ff00;
                border: 1px solid #333;
                border-radius: 4px;
                padding: 8px;
                resize: none;
                font-family: monospace;
                font-size: 12px;
            `;

      document.body.appendChild(this.debugTextarea);
    }
  }

  /**
   * 自動閱讀器
   */
  class AutoReader {
    constructor(app) {
      this.app = app;
    }

    /**
     * 處理閱讀邏輯
     */
    async processReading(singleTopic = false) {
      // 檢查閱讀限制
      if (!singleTopic && this.checkReadLimit()) {
        return;
      }

      // 檢查頁面準備狀態
      if (!this.app.utils.waitReady()) {
        return;
      }

      // 處理錯誤頁面
      if (await this.handleErrorPages()) {
        return;
      }

      // 處理重啟 URL
      if (this.app.floorStatus.rebootUrl) {
        this.app.utils.gotoUrl(this.app.floorStatus.rebootUrl);
        this.app.floorStatus.rebootUrl = null;
        return;
      }

      // 處理主題頁面
      if (window.location.href.includes("/t/topic/")) {
        await this.processTopicPage(singleTopic);
      } else {
        // 非主題頁面，導航到下一篇
        if (singleTopic) {
          document.getElementById("btnAutoRead").click();
          return;
        }
        await this.directNextPost();
      }
    }

    /**
     * 處理主題頁面
     */
    async processTopicPage(singleTopic) {
      const isNew = this.isNewPost();
      if (isNew) {
        this.app.utils.addDebugLog("[INFO] 新文章");
        this.app.utils.discourseDo("lastTimeReadProcess");
        this.setFloor(true);
      }

      if (!this.app.config.get("blueDotMode", true)) {
        this.checkLastRead();
      }

      this.app.ui.updateButtonText();
      const floorResult = this.setFloor();

      await this.handleFloorResult(floorResult, singleTopic);
    }

    /**
     * 處理樓層結果
     */
    async handleFloorResult(floorResult, singleTopic) {
      const failRetry = this.app.config.get("reloadWaitTime", 25);
      const rate = this.app.config.get("blueDotMode", true)
        ? this.app.config.get("refreshRateBlueDot", 350)
        : this.app.config.get("refreshRateNormal", 2400);

      switch (floorResult.result) {
        case "fail":
        case "EOF":
          if (singleTopic) {
            document.getElementById("btnAutoRead").click();
            return;
          }
          await this.directNextPost();
          break;

        case "noBlueDot":
          this.app.utils.scrollIntoBee(floorResult.targetElement);
          break;

        case "success":
          // 非藍點模式：直接滾動，不等待藍點消失
          if (!this.app.config.get("blueDotMode", true)) {
            this.app.utils.scrollIntoBee(floorResult.targetElement);
            return;
          }

          // 藍點模式：等待藍點消失的邏輯
          await this.handleSuccessfulFloor(
            floorResult,
            failRetry,
            rate,
            singleTopic
          );
          break;
      }
    }

    /**
     * 處理成功的樓層
     */
    async handleSuccessfulFloor(floorResult, failRetry, rate, singleTopic) {
      const failThreshold1 = (failRetry / rate) * 500;
      const failThreshold2 = (failRetry / rate) * 1000;

      if (
        this.app.floorStatus.failCounter < failThreshold1 &&
        !this.app.utils.isInViewport(floorResult.targetElement)
      ) {
        this.app.utils.scrollIntoBee(floorResult.targetElement);
        return;
      }

      if (this.app.floorStatus.failCounter < failThreshold1) {
        this.app.utils.addDebugLog(
          `[INFO] 等待藍點 #${floorResult.targetElement.id}...`
        );
        return;
      }

      if (this.app.floorStatus.failCounter < failThreshold2) {
        this.app.utils.addDebugLog("[INFO] 等待藍點...50%...");
        return;
      }

      if (this.app.floorStatus.failCounter >= failThreshold2) {
        this.app.utils.addDebugLog("[INFO] 藍點卡住，刷新...");
        this.app.floorStatus.failCounter = 0;
        this.app.floorStatus.rebootUrl = window.location.href;
        this.app.utils.gotoUrl(this.app.utils.BASE_URL);
      }
    }

    /**
     * 設置樓層狀態
     */
    setFloor(refresh = false) {
      if (refresh) {
        this.app.floorStatus = {
          startFloor: 0,
          endFloor: 0,
          lastStartFloor: 0,
          lastEndFloor: 0,
          readCounter: this.app.config.get("readCounter", 0),
          failCounter: 0,
          rebootUrl: null,
        };
        return { result: "refreshed" };
      }

      const elements = document.querySelectorAll(".boxed.onscreen-post");
      if (!elements.length) {
        return { result: "fail" };
      }

      const targetElement = this.findTargetElement(elements);
      if (!targetElement) {
        return this.handleNoTarget(elements);
      }

      return this.updateFloorStatus(targetElement, elements);
    }

    /**
     * 尋找目標元素
     */
    findTargetElement(elements) {
      let targetElement = null;
      let secondOutOfView = false;

      for (const element of elements) {
        // 藍點模式：尋找第一個藍點
        if (
          this.app.config.get("blueDotMode", true) &&
          element.querySelector(".read-state:not(.read)")
        ) {
          targetElement = element;
          break;
        }

        // 非藍點模式：尋找第二個不在視窗內的元素
        if (this.app.config.get("blueDotMode", true) === false) {
          if (secondOutOfView && !this.app.utils.isInViewport(element)) {
            targetElement = element;
            break;
          }
          if (this.app.utils.isInViewport(element)) {
            secondOutOfView = true;
          }
        }
      }

      return targetElement;
    }

    /**
     * 處理沒有目標的情況
     */
    handleNoTarget(elements) {
      const floorInfo = document.querySelector(".timeline-replies");
      if (floorInfo) {
        const [current, total] = floorInfo.textContent
          .trim()
          .split(" / ")
          .map(Number);
        if (total - current < 5) {
          return { result: "EOF" };
        }
      }

      return {
        result: "noBlueDot",
        targetElement: elements[elements.length - 1],
      };
    }

    /**
     * 更新樓層狀態
     */
    updateFloorStatus(targetElement, elements) {
      this.app.floorStatus.lastStartFloor = this.app.floorStatus.startFloor;
      this.app.floorStatus.lastEndFloor = this.app.floorStatus.endFloor;

      this.app.floorStatus.startFloor = parseInt(
        targetElement.id.replace("post_", "")
      );
      this.app.floorStatus.endFloor = parseInt(
        elements[elements.length - 1].id.replace("post_", "")
      );

      const floorDiff =
        this.app.floorStatus.startFloor - this.app.floorStatus.lastStartFloor;
      if (floorDiff > 0 && floorDiff <= 10) {
        this.app.floorStatus.readCounter += floorDiff;
        this.app.config.set("readCounter", this.app.floorStatus.readCounter);
      }

      if (floorDiff === 0) {
        this.app.floorStatus.failCounter++;
      } else {
        this.app.floorStatus.failCounter = 0;
      }

      return {
        result: "success",
        targetElement: targetElement,
        readFloor: this.app.floorStatus.readCounter,
      };
    }

    /**
     * 檢查閱讀限制
     */
    checkReadLimit() {
      const limit = this.app.config.get("stopLimit", 250);
      if (this.app.floorStatus.readCounter > limit) {
        document.getElementById("btnAutoRead").click();
        return true;
      }
      return false;
    }

    /**
     * 檢查是否為新文章
     */
    isNewPost() {
      const currentUrl = window.location.href.split("/").slice(0, 6).join("/");
      const lastUrl = this.app.config.get("readUrl", "");

      if (currentUrl !== lastUrl) {
        this.app.config.set("readUrl", currentUrl);
        return true;
      }
      return false;
    }

    /**
     * 檢查最後閱讀位置
     */
    checkLastRead() {
      const button = document.querySelector(".timeline-last-read .btn");
      if (button) {
        button.click();
        return true;
      }
      return false;
    }

    /**
     * 處理錯誤頁面
     */
    async handleErrorPages() {
      // 404 頁面
      if (document.querySelector(".page-not-found")) {
        this.app.utils.addDebugLog("[WARN] 頁面未找到");
        await this.directNextPost();
        return true;
      }

      // 重試按鈕
      const retryBtn = document.querySelector(
        ".btn.btn-icon-text.btn-primary.topic-retry"
      );
      if (retryBtn) {
        retryBtn.click();
        return true;
      }

      // 錯誤頁面
      const errorPage = document.querySelector(".error-page");
      if (errorPage) {
        const primaryBtn = document.querySelector(
          ".btn.btn-icon-text.btn-primary"
        );
        if (primaryBtn) primaryBtn.click();
        return true;
      }

      return false;
    }

    /**
     * 導航到下一篇文章
     */
    async directNextPost() {
      if (this.app.waitNextRefresh === 0) {
        this.app.waitNextRefresh++;
        return;
      }

      this.app.waitNextRefresh = 0;

      // 處理搜尋頁面
      if (window.location.href.includes("/search")) {
        await this.handleSearchPage();
        return;
      }
      // 處理儲存的未讀列表
      await this.handleUnreadList();
      return;
      // 廢棄方法
      // 處理建議文章
      /*if (window.location.href.includes('/t/topic/')) {
                const unreadLink = document.querySelector('a[href="/unread"]');
                if (unreadLink) {
                    unreadLink.click();
                    this.app.utils.addDebugLog('[INFO] 找到未讀文章 ==> ○');
                    return;
                }
                this.app.utils.addDebugLog('[WARN] 未讀文章 ==> X');
            }


            // 處理未讀頁面
            if (window.location.href === `${this.app.utils.BASE_URL}/unread`) {
                await this.handleUnreadPage();
                return;
            }*/
    }

    /**
     * 處理搜尋頁面
     */
    async handleSearchPage() {
      const links = document.querySelectorAll('a[href^="/t/topic"]');

      if (links.length > 0) {
        this.app.directWaitCounter = 0;
        // 修正：正確提取和處理 URL
        const hrefs = Array.from(links, (link) =>
          link.getAttribute("href").replace(/(\/t\/topic\/\d+).*/, "$1")
        );

        const nextUrl = hrefs.shift(); // 取出第一個
        this.app.config.set("unreadList", hrefs); // 存入剩餘的
        this.app.utils.addDebugLog(`[INFO] 獲得 ${hrefs.length} 篇未讀文章`);
        this.app.utils.gotoUrl(nextUrl); // 導航到第一個
      } else {
        this.app.directWaitCounter++;
        this.app.utils.addDebugLog("[WARN] 獲得 0 篇未讀文章");
      }
    }

    /**
     * 處理未讀頁面
     */
    async handleUnreadPage() {
      const suggestPost = document.querySelector(
        'a[class*="badge badge-notification"]'
      );
      if (suggestPost) {
        this.app.utils.addDebugLog("[INFO] 找到文章 ==> ○");
        suggestPost.click();
      }
    }

    /**
     * 處理未讀列表
     */
    async handleUnreadList() {
      let unreadList = this.app.config.get("unreadList", []);

      // 如果序列為空，才去搜尋頁面
      if (!unreadList || unreadList.length <= 0) {
        this.app.utils.gotoUrl(
          "/search?expanded=true&q=in%3Aunseen%20min_posts%3A20"
        );
        return;
      }

      // 直接從序列中取出下一個 URL
      if (unreadList.length > 0) {
        let tempUrl = unreadList.shift();
        const currentMatch = window.location.href.match(/\/t\/topic\/(\d+)/);

        // 檢查當前頁面是否與序列中的 URL 匹配
        if (currentMatch && tempUrl) {
          const tempMatch = tempUrl.match(/\/t\/topic\/(\d+)/);
          if (tempMatch && currentMatch[1] === tempMatch[1]) {
            // 當前文章已完成，從序列中移除
            this.app.config.set("unreadList", unreadList);
            tempUrl = unreadList.shift(); // 取下一個
            this.app.utils.addDebugLog("[INFO] 刪除已完成文章");
          }
        }

        this.app.utils.addDebugLog(
          `[INFO] 剩餘 ${unreadList.length} 篇未讀文章`
        );

        // 直接前往下一個 URL，不回到首頁
        if (tempUrl) {
          this.app.utils.gotoUrl(tempUrl.replace(/(\/t\/topic\/\d+).*/, "$1"));
        } else if (unreadList.length === 0) {
          // 序列用完了，才去搜尋更多
          this.app.utils.gotoUrl(
            "/search?expanded=true&q=in%3Aunseen%20min_posts%3A20"
          );
        }
      }
    }
  }

  /**
   * 翻譯管理器
   */
  class TranslatorManager {
    constructor(app) {
      this.app = app;
      this.intervalId = null;
    }

    /**
     * 處理編輯器工具列
     */
    handleEditorToolbar(mutation) {
      // 修復：使用原始的觸發條件
      this.app.utils.addDebugLog(`[INFO] DOM ${mutation.target.className}`);
      // old class = select-kit single-select dropdown-select-box toolbar-popup-menu-options ember-view options
      if (mutation.target.className.includes("d-editor-preview-wrapper")) {
        this.app.utils.addDebugLog(`[INFO] 回帖框DOM 變化`);
        if (
          document.querySelector(
            ".btn.no-text.btn-icon.d-icon-discourse-sparkles"
          )
        )
          return;
        // log
        this.app.utils.addDebugLog("[INFO] 編輯器工具列已準備，添加翻譯按鈕");
        this.addTranslatorButtons();
      }
    }

    /**
     * 添加翻譯按鈕
     */
    addTranslatorButtons() {
      const buttonBar = document.querySelector(".d-editor-button-bar");
      if (!buttonBar) return;

      // 檢查按鈕是否已存在，避免重複添加
      if (
        document.querySelector(
          ".btn.no-text.btn-icon.d-icon-discourse-sparkles"
        )
      )
        return;

      // AI 回覆按鈕 - 需要完整的 SVG 結構
      const aiButton = this.createToolbarButton(
        "discourse-sparkles",
        "AI 回覆"
      );
      aiButton.addEventListener("click", () => this.handleAiReply());

      // 翻譯按鈕 - 需要完整的 SVG 結構
      const translateButton = this.createToolbarButton("keyboard", "翻譯");
      translateButton.addEventListener("click", () => this.handleTranslate());

      buttonBar.appendChild(aiButton);
      buttonBar.appendChild(translateButton);
    }

    /**
     * 創建工具列按鈕
     */
    createToolbarButton(iconName, title) {
      const button = document.createElement("button");
      button.className = `btn no-text btn-icon d-icon-${iconName}`;
      button.title = title;
      button.type = "button";
      button.tabIndex = -1;

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.classList.add(
        "fa",
        "d-icon",
        `d-icon-${iconName}`,
        "svg-icon",
        "svg-string"
      );

      const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        `#${iconName}`
      );

      svg.appendChild(use);
      button.appendChild(svg);

      return button;
    }

    /**
     * 處理 AI 回覆
     */
    async handleAiReply() {
      this.app.utils.addDebugLog("[INFO] AI 回覆點擊");

      // 清除之前的定時器
      // if (this.intervalId) {
      //     clearInterval(this.intervalId);
      //     this.intervalId = null;
      // }

      const linkElement = document.querySelector(".action-title a");
      if (!linkElement) {
        this.app.utils.addDebugLog("[INFO] 找不到回覆用戶");
        return;
      }

      const linkValue = `https://${
        window.location.hostname
      }${linkElement.getAttribute("href")}`;
      let replyText;
      let beenDirected = false;

      //this.intervalId = setInterval(() => {
      this.app.utils.addDebugLog("[INFO] 嘗試獲取回覆內容...");

      // 根據 URL 結構決定要查找的 post ID
      let postId;
      if (linkValue.split("/").length === 6) {
        postId = "post_1";
      } else {
        postId = `post_${linkValue.split("/")[6]}`;
      }

      const replyElement = document.getElementById(postId);

      if (replyElement) {
        const cookedElement = replyElement.querySelector(".cooked");
        if (cookedElement) {
          replyText = cookedElement.textContent;
          this.app.utils.addDebugLog("[INFO] 回覆內容 => " + replyText);

          // 防止重複點擊，暫時禁用按鈕
          const aiButton = document.querySelector(
            ".btn.no-text.btn-icon.d-icon-discourse-sparkles"
          );
          if (aiButton) {
            aiButton.style.pointerEvents = "none";
          }

          // 獲取自定義提示詞
          const prompt =
            "這是一個論壇的貼文，你做為回覆者，發表一些想法或回應，只輸出結果：";

          // 調用 GPT API
          this.callGptApi(
            prompt ||
              "這是一個論壇的貼文，你做為回覆者，發表一些想法或回應，只輸出結果：",
            "```" + replyText + "```"
          )
            .then(({ response, data }) => {
              // 恢復按鈕可用性
              if (aiButton) {
                aiButton.style.pointerEvents = "auto";
              }

              if (!response) {
                this.app.utils.addDebugLog("[ERROR] AI 回覆失敗");
                return;
              }

              const textarea = document.querySelector(
                ".ember-text-area.ember-view.d-editor-input"
              );
              if (textarea && data?.choices?.[0]?.message?.content) {
                textarea.value =
                  textarea.value + data.choices[0].message.content;

                // 手動觸發 input 事件
                const event = new Event("input", { bubbles: true });
                textarea.dispatchEvent(event);

                this.app.utils.addDebugLog("[INFO] AI 回覆已插入到編輯器");
              }
            })
            .catch((error) => {
              this.app.utils.addDebugLog(
                `[ERROR] AI 回覆處理失敗: ${error.message}`
              );
              if (aiButton) {
                aiButton.style.pointerEvents = "auto";
              }
            });

          // 清除定時器
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
      } else {
        // 如果找不到回覆內容且還沒導航過，則導航到目標頁面
        if (!beenDirected) {
          this.app.utils.addDebugLog("[INFO] 導航到 => " + linkValue);
          beenDirected = true;
          this.app.utils.gotoUrl(linkValue);
        }
      }
      //}, 300);
    }

    /**
     * 處理翻譯
     */
    async handleTranslate() {
      this.app.utils.addDebugLog("[INFO] 翻譯點擊");

      const textarea = document.querySelector(
        ".ember-text-area.ember-view.d-editor-input"
      );
      if (!textarea || textarea.value.length <= 4) {
        this.app.utils.addDebugLog("[WARN] 沒有文字可翻譯");
        return;
      }

      const originalText = textarea.value;
      textarea.value = "翻譯中...\n" + originalText;

      try {
        const result = await this.callGptApi(
          "將以下內容轉換成簡體中文，盡量保持原文，只輸出結果：",
          originalText
        );

        if (result.response && result.data?.choices?.[0]?.message?.content) {
          this.app.utils.addDebugLog(
            "[INFO] 翻譯結果\n　　" + result.data.choices[0].message.content
          );
          textarea.value = result.data.choices[0].message.content;
        } else {
          textarea.value = originalText;
          this.app.utils.addDebugLog("[ERROR] 翻譯失敗");
        }
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      } catch (error) {
        textarea.value = originalText;
        this.app.utils.addDebugLog(`[ERROR] 翻譯錯誤: ${error.message}`);
      }
    }

    /**
     * 調用 GPT API
     */
    async callGptApi2(systemPrompt, userPrompt) {
      try {
        const apiKey = this.app.config.get("oaiKey", "");
        const baseUrl = this.app.config.get("oaiBaseUrl", "");
        const model = this.app.config.get("oaiModel", "gpt-4.1-mini");

        if (!this.app.config.validateApiKey(apiKey)) {
          throw new Error("無效的 API 金鑰");
        }

        const response = await fetch(baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            max_tokens: 4090,
            model: model,
            stream: false,
            temperature: 1.2,
            presence_penalty: 0,
            frequency_penalty: 0,
          }),
        });

        if (!response.ok) {
          throw new Error(`伺服器回應錯誤: ${response.status}`);
        }

        const data = await response.json();
        return { response: true, data: data };
      } catch (error) {
        this.app.utils.addDebugLog(`[ERROR] API 調用失敗: ${error.message}`);
        return { response: false, data: null };
      }
    }

    /**
     * 調用 GPT API (使用 GM_xmlhttpRequest)
     */
    callGptApi(systemPrompt, userPrompt) {
      return new Promise((resolve, reject) => {
        const apiKey = this.app.config.get("oaiKey", "");
        const baseUrl = this.app.config.get("oaiBaseUrl", "");
        const model = this.app.config.get("oaiModel", "gpt-4.1-mini");

        if (!this.app.config.validateApiKey(apiKey)) {
          this.app.utils.addDebugLog("[ERROR] 無效的 API 金鑰");
          reject({ response: false, data: null });
          return;
        }
        // log req
        this.app.utils.addDebugLog(
          `[INFO] 調用 GPT API: ${baseUrl} ===> model: ${model} ===> systemPrompt: ${systemPrompt} ===> userPrompt: ${userPrompt}`
        );
        let temp_msg = [];
        if (localStorage.getItem("oaiPromptSystemMode") === "true") {
          temp_msg.push({ role: "system", content: systemPrompt });
          temp_msg.push({ role: "user", content: userPrompt });
        } else {
          temp_msg = [
            { role: "user", content: `${systemPrompt}\n\n${userPrompt}` },
          ];
        }
        GM_xmlhttpRequest({
          method: "POST",
          url: baseUrl,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          data: JSON.stringify({
            messages: temp_msg,
            max_tokens: 4090,
            model: model,
            stream: false,
            temperature: 0.7,
            presence_penalty: 0,
            frequency_penalty: 0,
          }),
          timeout: 60000, // 設置超時時間
          onload: (response) => {
            // 改成箭頭函數
            if (response.status >= 200 && response.status < 300) {
              // log
              this.app.utils.addDebugLog(
                `[INFO] API 調用成功: ${response.status}`
              );
              try {
                const data = JSON.parse(response.responseText);
                resolve({ response: true, data: data });
              } catch (error) {
                this.app.utils.addDebugLog(
                  `[ERROR] JSON 解析失敗: ${error.message}`
                );
                reject({ response: false, data: null });
              }
            } else {
              this.app.utils.addDebugLog(
                `[ERROR] 伺服器回應錯誤: ${response.status}`
              );
              reject({ response: false, data: null });
            }
          },
          onerror: (error) => {
            // 也改成箭頭函數
            this.app.utils.addDebugLog(
              `[ERROR] API 調用失敗: ${error.message}`
            );
            reject({ response: false, data: null });
          },
          ontimeout: function () {
            console.error("取得 GPT 回覆超時");
            alert("取得 GPT 回覆時發生錯誤，請稍後再試。");
            resolve({ response: false, data: null });
          },
        });
      });
    }
  }

  /**
   * 工具類
   */
  class Utils {
    constructor() {
      this.BASE_URL = `https://${window.location.hostname}`;
      this.debugCounter = new Map();
    }

    /**
     * 防抖動函數
     */
    debounce(func, wait) {
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
     * 等待頁面準備就緒
     */
    async waitForReady() {
      return new Promise((resolve) => {
        const check = () => {
          const indicator = document.querySelector(
            ".loading-indicator-container"
          );
          if (indicator && indicator.classList.contains("ready")) {
            resolve(true);
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      });
    }

    /**
     * 檢查頁面是否準備就緒
     */
    waitReady() {
      const element = document.querySelector(".loading-indicator-container");
      return element && element.classList.contains("ready");
    }

    /**
     * 檢查元素是否在視窗內
     */
    isInViewport(element) {
      if (!element) return false;

      const rect = element.getBoundingClientRect();
      return rect.top >= 0 && rect.top <= window.innerHeight;
    }

    /**
     * 滾動到指定元素
     */
    scrollIntoBee(element, marginOffset = 4) {
      if (!element) return;

      try {
        const originalMargin = element.style.marginTop || "0px";
        element.style.marginTop = `-${marginOffset}rem`;
        element.scrollIntoView({ behavior: "smooth" });
        element.style.marginTop = originalMargin;

        if (element.id) {
          this.addDebugLog(`[INFO] 閱讀 => #${element.id}`);
        }
      } catch (error) {
        this.addDebugLog(`[ERROR] 滾動失敗: ${error.message}`);
      }
    }

    /**
     * 導航到指定 URL
     */
    gotoUrl(url) {
      try {
        const link = document.querySelector('a[href="/"]');
        if (link) {
          link.href = url;
          link.click();
          link.href = "/";
        } else {
          window.location.href = url;
        }
      } catch (error) {
        this.addDebugLog(`[ERROR] 導航失敗: ${error.message}`);
      }
    }

    /**
     * 執行 Discourse 操作
     */
    discourseDo(action) {
      const actions = {
        lastTimeReadProcess: {
          key: "l",
          code: "KeyL",
          keyCode: 76,
          shiftKey: true,
        },
        nextPost: { key: "j", code: "KeyJ", keyCode: 74, shiftKey: true },
      };

      const config = actions[action];
      if (!config) {
        this.addDebugLog(`[ERROR] 未知操作: ${action}`);
        return;
      }

      const event = new KeyboardEvent("keydown", {
        ...config,
        which: config.keyCode,
        bubbles: true,
        cancelable: true,
      });

      document.body.dispatchEvent(event);
    }

    /**
     * 添加除錯日誌
     */
    addDebugLog(message) {
      if (!message) return;

      const textarea = document.getElementById("debugTextarea");
      if (!textarea) return;

      // 實作重複訊息計數
      const count = this.debugCounter.get(message) || 0;
      this.debugCounter.set(message, count + 1);

      const displayMessage = count > 0 ? `${message} (${count + 1})` : message;

      const lines = textarea.value.split("\n");
      const lastLine = lines[lines.length - 1];

      if (lastLine.startsWith(message)) {
        lines[lines.length - 1] = displayMessage;
      } else {
        lines.push(displayMessage);
        this.debugCounter.set(message, 0);
      }

      // 限制日誌行數
      if (lines.length > 100) {
        lines.splice(0, lines.length - 100);
      }

      textarea.value = lines.join("\n");
      textarea.scrollTop = textarea.scrollHeight;
    }

    /**
     * 清理輸入內容，防止 XSS
     */
    sanitizeInput(input) {
      if (typeof input !== "string") return input;

      return input
        .replace(/[<>]/g, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+=/gi, "");
    }
  }

  // 初始化應用程式
  const app = new AutoReadBee();

  // 全域錯誤處理
  window.addEventListener("error", (event) => {
    if (app && app.utils) {
      app.utils.addDebugLog(
        `[ERROR] 全域錯誤: ${event.error?.message || event.message}`
      );
    }
  });
})();
