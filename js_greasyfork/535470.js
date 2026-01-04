// ==UserScript==
// @name         BOSS海投助手
// @namespace    https://github.com/yangshengzhou03
// @version      1.2.4.0
// @description  求职工具！Yangshengzhou开发用于提高BOSS直聘投递效率，批量沟通，高效求职
// @author       Yangshengzhou
// @match        https://www.zhipin.com/web/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @supportURL   https://github.com/yangshengzhou03
// @homepageURL  https://gitee.com/yangshengzhou
// @license      AGPL-3.0-or-later
// @icon         https://www.zhipin.com/favicon.ico
// @connect      zhipin.com
// @connect      spark-api-open.xf-yun.com
// @noframes
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/535470/BOSS%E6%B5%B7%E6%8A%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/535470/BOSS%E6%B5%B7%E6%8A%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const CONFIG = {
    BASIC_INTERVAL: 1000,
    OPERATION_INTERVAL: 1200,

    DELAYS: {
      SHORT: 30,
      MEDIUM_SHORT: 200,
      DICT_LIST_LOAD: 300,
      RESUME_LIST_LOAD: 500,
      POSITION_DETAIL_LOAD: 800,
      LONG: 1000,
    },
    COLORS: {
      PRIMARY: "#2196f3",
      SECONDARY: "#ff5722",
    },
    MINI_ICON_SIZE: 40,
    SELECTORS: {
      JOB_LIST: {
        JOB_CARD: "li.job-card-box",
        CHAT_BTN: "a.op-btn-chat",
      },
      CHAT: {
        CHAT_INPUT: "#chat-input",
        SEND_BUTTON: ".btn-send",
        FRIEND_MESSAGE: ".item-friend .text span",
        COMMON_PHRASE_BTN: ".btn-dict",
        RESUME_BTN: '.toolbar-btn:contains("发简历")',
        CONFIRM_SEND: "span.btn-sure-v2",
        IMAGE_SEND_BTN:
          '.toolbar-btn-content.icon.btn-sendimg input[type="file"]',
      },
    },
    AI: {
      MAX_REPLIES: 30,
      DEFAULT_ROLE:
        "你是求职的应届生正在面对HR，回复需满足：20字内，编造专业对口/实习经验/证书任一岗位优势；被问个人信息或岗位条件，直接配合提供合理数据；全程积极真诚无拒绝言辞。",
    },
    MESSAGES: {
      JOB_MATCHED: "找到匹配岗位: ",
      JOB_NOT_FOUND: "没有找到符合条件的岗位",
      START_PROCESSING: "开始自动处理...",
      STOP_PROCESSING: "已停止自动处理",
      RESUME_SENT: "简历已发送",
      AI_REPLYING: "AI 正在回复...",
      MAX_REPLIES_REACHED: "今日 AI 回复次数已达上限",
    },
    STORAGE_KEYS: {
      PROCESSED_HRS: "processedHRs",
      SENT_GREETINGS_HRS: "sentGreetingsHRs",
      SENT_RESUME_HRS: "sentResumeHRs",
      SENT_IMAGE_RESUME_HRS: "sentImageResumeHRs",
      AI_REPLY_COUNT: "aiReplyCount",
      LAST_AI_DATE: "lastAiDate",
      AI_ROLE: "aiRole",
      KEYWORD_REPLIES: "keywordReplies",
    },
    STORAGE_LIMITS: {
      PROCESSED_HRS: 500,
      SENT_GREETINGS_HRS: 500,
      SENT_RESUME_HRS: 300,
      SENT_IMAGE_RESUME_HRS: 300,
    },
  };

  const state = {
    isRunning: false,
    currentIndex: 0,

    includeKeywords: [],
    locationKeywords: [],

    jobList: [],

    ui: {
      isMinimized: false,
      theme: localStorage.getItem("theme") || "light",
      showWelcomeMessage: JSON.parse(
        localStorage.getItem("showWelcomeMessage") || "true"
      ),
    },

    hrInteractions: {
      processedHRs: new Set(
        JSON.parse(localStorage.getItem("processedHRs") || "[]")
      ),
      sentGreetingsHRs: new Set(
        JSON.parse(localStorage.getItem("sentGreetingsHRs") || "[]")
      ),
      sentResumeHRs: new Set(
        JSON.parse(localStorage.getItem("sentResumeHRs") || "[]")
      ),
      sentImageResumeHRs: new Set(
        JSON.parse(localStorage.getItem("sentImageResumeHRs") || "[]")
      ),
    },

    ai: {
      replyCount: JSON.parse(localStorage.getItem("aiReplyCount") || "0"),
      lastAiDate: localStorage.getItem("lastAiDate") || "",
      useAiReply: true,
    },

    operation: {
      lastMessageTime: 0,
    },

    user: {
      isPremiumUser: localStorage.getItem("isPremiumUser") === "true",
    },

    settings: {
      useAutoSendResume: JSON.parse(
        localStorage.getItem("useAutoSendResume") || "false"
      ),
      autoScrollSpeed: parseInt(
        localStorage.getItem("autoScrollSpeed") || "500"
      ),
      customPhrases: JSON.parse(localStorage.getItem("customPhrases") || "[]"),
      actionDelays: {
        click: parseInt(localStorage.getItem("clickDelay") || "130"),
      },
      notifications: {
        enabled: JSON.parse(
          localStorage.getItem("notificationsEnabled") || "true"
        ),
        sound: JSON.parse(localStorage.getItem("notificationSound") || "true"),
      },
      ai: {
        role:
          localStorage.getItem("aiRole") ||
          "你是求职的应届生正在面对HR，回复需满足：20字内，编造专业对口/实习经验/证书任一岗位优势；被问个人信息或岗位条件，直接配合提供合理数据；全程积极真诚无拒绝言辞。",
      },
      autoReply: JSON.parse(localStorage.getItem("autoReply") || "false"),
      useAutoSendImageResume: JSON.parse(
        localStorage.getItem("useAutoSendImageResume") || "false"
      ),
      imageResumeData: localStorage.getItem("imageResumeData") || null,
      communicationMode:
        localStorage.getItem("communicationMode") || "new-only",
      recruiterActivityStatus: JSON.parse(
        localStorage.getItem("recruiterActivityStatus") || '["不限"]'
      ),
      excludeHeadhunters: JSON.parse(
        localStorage.getItem("excludeHeadhunters") || "false"
      ),
      imageResumes: JSON.parse(localStorage.getItem("imageResumes") || "[]"),
      keywordReplies: JSON.parse(
        localStorage.getItem("keywordReplies") || "[]"
      ),
      intervals: {
        basic: parseInt(
          localStorage.getItem("basicInterval") ||
            CONFIG.BASIC_INTERVAL.toString()
        ),
        operation: parseInt(
          localStorage.getItem("operationInterval") ||
            CONFIG.OPERATION_INTERVAL.toString()
        ),
      },
    },

    activation: {
      isActivated: localStorage.getItem("activationStatus") === "true",
      activationCode: localStorage.getItem("activationCode") || "",
      cardKey: localStorage.getItem("cardKey") || "",
      activatedAt: localStorage.getItem("activationDate") || "",
      dailyCommunicationCount: JSON.parse(
        localStorage.getItem("dailyCommunicationCount") || "0"
      ),
      lastCommunicationDate:
        localStorage.getItem("lastCommunicationDate") || "",
    },
  };

  const elements = {
    panel: null,
    controlBtn: null,
    log: null,
    includeInput: null,
    locationInput: null,
    miniIcon: null,
  };

  class StorageManager {
    static setItem(key, value) {
      try {
        localStorage.setItem(
          key,
          typeof value === "string" ? value : JSON.stringify(value)
        );
        return true;
      } catch (error) {
        Core.log(`设置存储项 ${key} 失败: ${error.message}`);
        return false;
      }
    }

    static getItem(key, defaultValue = null) {
      try {
        const value = localStorage.getItem(key);
        return value !== null ? value : defaultValue;
      } catch (error) {
        Core.log(`获取存储项 ${key} 失败: ${error.message}`);
        return defaultValue;
      }
    }

    static addRecordWithLimit(storageKey, record, currentSet, limit) {
      try {
        if (currentSet.has(record)) {
          return;
        }

        let records = this.getParsedItem(storageKey, []);
        records = Array.isArray(records) ? records : [];

        if (records.length >= limit) {
          records.shift();
        }

        records.push(record);
        currentSet.add(record);
        this.setItem(storageKey, records);

        console.log(
          `存储管理: 添加记录${
            records.length >= limit ? "并删除最早记录" : ""
          }，当前${storageKey}数量: ${records.length}/${limit}`
        );
      } catch (error) {
        console.log(`存储管理出错: ${error.message}`);
      }
    }

    static getParsedItem(storageKey, defaultValue = []) {
      try {
        const data = this.getItem(storageKey);
        return data ? JSON.parse(data) : defaultValue;
      } catch (error) {
        Core.log(`解析存储记录出错: ${error.message}`);
        return defaultValue;
      }
    }

    static ensureStorageLimits() {
      const limitConfigs = [
        {
          key: CONFIG.STORAGE_KEYS.PROCESSED_HRS,
          set: state.hrInteractions.processedHRs,
          limit: CONFIG.STORAGE_LIMITS.PROCESSED_HRS,
        },
        {
          key: CONFIG.STORAGE_KEYS.SENT_GREETINGS_HRS,
          set: state.hrInteractions.sentGreetingsHRs,
          limit: CONFIG.STORAGE_LIMITS.SENT_GREETINGS_HRS,
        },
        {
          key: CONFIG.STORAGE_KEYS.SENT_RESUME_HRS,
          set: state.hrInteractions.sentResumeHRs,
          limit: CONFIG.STORAGE_LIMITS.SENT_RESUME_HRS,
        },
        {
          key: CONFIG.STORAGE_KEYS.SENT_IMAGE_RESUME_HRS,
          set: state.hrInteractions.sentImageResumeHRs,
          limit: CONFIG.STORAGE_LIMITS.SENT_IMAGE_RESUME_HRS,
        },
      ];

      limitConfigs.forEach(({ key, set, limit }) => {
        const records = this.getParsedItem(key, []);
        if (records.length > limit) {
          const trimmedRecords = records.slice(-limit);
          this.setItem(key, trimmedRecords);

          set.clear();
          trimmedRecords.forEach((record) => set.add(record));

          console.log(
            `存储管理: 清理${key}记录，从${records.length}减少到${trimmedRecords.length}`
          );
        }
      });
    }
  }

  class StatePersistence {
    static saveState() {
      try {
        const stateMap = {
          aiReplyCount: state.ai.replyCount,
          lastAiDate: state.ai.lastAiDate,

          showWelcomeMessage: state.ui.showWelcomeMessage,
          isPremiumUser: state.user.isPremiumUser,
          useAiReply: state.ai.useAiReply,
          useAutoSendResume: state.settings.useAutoSendResume,
          useAutoSendImageResume: state.settings.useAutoSendImageResume,
          imageResumeData: state.settings.imageResumeData,
          imageResumes: state.settings.imageResumes || [],
          autoScrollSpeed: state.settings.autoScrollSpeed,
          customPhrases: state.settings.customPhrases,
          keywordReplies: state.settings.keywordReplies || [],
          theme: state.ui.theme,
          clickDelay: state.settings.actionDelays.click,
          notificationsEnabled: state.settings.notifications.enabled,
          notificationSound: state.settings.notifications.sound,
          includeKeywords: state.includeKeywords,
          locationKeywords: state.locationKeywords,
        };

        Object.entries(stateMap).forEach(([key, value]) => {
          StorageManager.setItem(key, value);
        });
      } catch (error) {
        Core.log(`保存状态失败: ${error.message}`);
      }
    }

    static loadState() {
      try {
        state.includeKeywords = StorageManager.getParsedItem(
          "includeKeywords",
          []
        );
        state.locationKeywords =
          StorageManager.getParsedItem("locationKeywords") ||
          StorageManager.getParsedItem("excludeKeywords", []);

        const imageResumes = StorageManager.getParsedItem("imageResumes", []);
        if (Array.isArray(imageResumes))
          state.settings.imageResumes = imageResumes;

        StorageManager.ensureStorageLimits();
      } catch (error) {
        Core.log(`加载状态失败: ${error.message}`);
      }
    }
  }

  class ActivationManager {
    static async activateWithCardKey(cardKey) {
      try {
        if (!this.validateCardKey(cardKey)) {
          throw new Error("激活码格式不正确");
        }

        const apiUrl = `http://112.124.60.16/api/public/card-keys/verify/${cardKey}`;

        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
          apiUrl
        )}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(proxyUrl, {
          method: "GET",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseText = await response.text();
        let data;
        try {
          const parsed = JSON.parse(responseText);
          if (parsed.contents) {
            data = JSON.parse(parsed.contents);
          } else {
            throw new Error("代理响应格式错误");
          }
        } catch (e) {
          throw new Error("代理响应格式错误");
        }

        if (data.code === 200 && data.message === "success") {
          state.activation.isActivated = true;
          state.activation.activatedAt = new Date().toISOString();
          state.activation.cardKey = cardKey;

          localStorage.setItem("activationStatus", "true");
          localStorage.setItem("activationDate", state.activation.activatedAt);
          localStorage.setItem("cardKey", cardKey);

          this.updateActivationUI();

          return true;
        } else {
          throw new Error(data.message || "激活码无效或已过期");
        }
      } catch (error) {
        throw new Error(error.message);
      }
    }

    static validateCardKey(cardKey) {
      const keyPattern = /^[A-Za-z0-9]{32}$/;
      return keyPattern.test(cardKey);
    }

    static async verifyCardKey(cardKey) {
      try {
        if (!this.validateCardKey(cardKey)) {
          throw new Error("激活码格式不正确");
        }

        const apiUrl = `http://112.124.60.16/api/public/card-keys/verify/${cardKey}`;

        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
          apiUrl
        )}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(proxyUrl, {
          method: "GET",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseText = await response.text();
        let data;
        try {
          const parsed = JSON.parse(responseText);
          if (parsed.contents) {
            data = JSON.parse(parsed.contents);
          } else {
            throw new Error("代理响应格式错误");
          }
        } catch (e) {
          throw new Error("代理响应格式错误");
        }

        if (data.code === 200 && data.message === "success") {
          return true;
        } else {
          throw new Error(data.message || "激活码无效或已过期");
        }
      } catch (error) {
        throw new Error("验证失败：" + error.message);
      }
    }

    static verifyCardKeyWithIframe(cardKey) {
      return new Promise((resolve, reject) => {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";

        const timeoutId = setTimeout(() => {
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
          reject(new Error("激活服务器响应超时"));
        }, 15000);

        const messageHandler = (event) => {
          if (event.origin === "https://112.124.60.16") {
            clearTimeout(timeoutId);
            if (iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
            document.removeEventListener("message", messageHandler);

            try {
              let data;
              if (typeof event.data === "string") {
                data = JSON.parse(event.data);
              } else {
                data = event.data;
              }

              if (data.code === 200 && data.message === "success") {
                resolve(true);
              } else {
                reject(new Error(data.message || "激活码无效或已过期"));
              }
            } catch (e) {
              reject(new Error("服务器响应格式错误"));
            }
          }
        };

        document.addEventListener("message", messageHandler);

        try {
          iframe.src = `http://112.124.60.16/api/public/card-keys/verify/${cardKey}`;
          document.body.appendChild(iframe);
        } catch (e) {
          clearTimeout(timeoutId);
          document.removeEventListener("message", messageHandler);
          reject(new Error("iframe创建失败"));
        }
      });
    }

    static checkActivationStatus() {
      const activationStatus = localStorage.getItem("activationStatus");
      const activationDate = localStorage.getItem("activationDate");
      const cardKey = localStorage.getItem("cardKey");

      if (activationStatus === "true" && activationDate && cardKey) {
        // 启动时只检查本地存储，不进行网络验证
        state.activation.isActivated = true;
        state.activation.activatedAt = activationDate;
        state.activation.cardKey = cardKey;
        this.updateActivationUI();
        return true;
      }

      return false;
    }

    static clearActivation() {
      state.activation.isActivated = false;
      state.activation.activatedAt = "";
      state.activation.cardKey = "";

      localStorage.removeItem("activationStatus");
      localStorage.removeItem("activationDate");
      localStorage.removeItem("cardKey");

      this.updateActivationUI();
    }

    static updateActivationUI() {
      const activationBtn = document.querySelector(
        "#boss-activation-btn .boss-icon"
      );
      if (activationBtn) {
        activationBtn.textContent = "💎";
      }
    }

    static getUsageStats() {
      return {
        isActivated: state.activation.isActivated,
        activatedAt: state.activation.activatedAt,
        cardKey: state.activation.cardKey,
        daysSinceActivation: state.activation.activatedAt
          ? Math.floor(
              (Date.now() - new Date(state.activation.activatedAt).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 0,
      };
    }
  }

  class HRInteractionManager {
    static async handleHRInteraction(hrKey) {
      const hasResponded = await this.hasHRResponded();

      if (!state.hrInteractions.sentGreetingsHRs.has(hrKey)) {
        await this._handleFirstInteraction(hrKey);
        return;
      }

      if (
        !state.hrInteractions.sentResumeHRs.has(hrKey) ||
        !state.hrInteractions.sentImageResumeHRs.has(hrKey)
      ) {
        if (hasResponded) {
          await this._handleFollowUpResponse(hrKey);
        }
        return;
      }

      await Core.aiReply();
    }

    static async _handleFirstInteraction(hrKey) {
      Core.log(`首次沟通: ${hrKey}`);
      const sentGreeting = await this.sendGreetings();

      if (sentGreeting) {
        StorageManager.addRecordWithLimit(
          CONFIG.STORAGE_KEYS.SENT_GREETINGS_HRS,
          hrKey,
          state.hrInteractions.sentGreetingsHRs,
          CONFIG.STORAGE_LIMITS.SENT_GREETINGS_HRS
        );

        await this._handleResumeSending(hrKey);
      }
    }

    static async _handleResumeSending(hrKey) {
      if (
        state.settings.useAutoSendResume &&
        !state.hrInteractions.sentResumeHRs.has(hrKey)
      ) {
        const sentResume = await this.sendResume();
        if (sentResume) {
          StorageManager.addRecordWithLimit(
            CONFIG.STORAGE_KEYS.SENT_RESUME_HRS,
            hrKey,
            state.hrInteractions.sentResumeHRs,
            CONFIG.STORAGE_LIMITS.SENT_RESUME_HRS
          );
        }
      }

      if (
        state.settings.useAutoSendImageResume &&
        !state.hrInteractions.sentImageResumeHRs.has(hrKey)
      ) {
        const sentImageResume = await this.sendImageResume();
        if (sentImageResume) {
          StorageManager.addRecordWithLimit(
            CONFIG.STORAGE_KEYS.SENT_IMAGE_RESUME_HRS,
            hrKey,
            state.hrInteractions.sentImageResumeHRs,
            CONFIG.STORAGE_LIMITS.SENT_IMAGE_RESUME_HRS
          );
        }
      }
    }

    static async _handleFollowUpResponse(hrKey) {
      const lastMessage = await Core.getLastFriendMessageText();

      if (
        lastMessage &&
        (lastMessage.includes("简历") || lastMessage.includes("发送简历"))
      ) {
        Core.log(`HR提到"简历"，发送简历: ${hrKey}`);

        if (
          state.settings.useAutoSendImageResume &&
          !state.hrInteractions.sentImageResumeHRs.has(hrKey)
        ) {
          const sentImageResume = await this.sendImageResume();
          if (sentImageResume) {
            state.hrInteractions.sentImageResumeHRs.add(hrKey);
            StatePersistence.saveState();
            Core.log(`已向 ${hrKey} 发送图片简历`);
            return;
          }
        }

        if (!state.hrInteractions.sentResumeHRs.has(hrKey)) {
          const sentResume = await this.sendResume();
          if (sentResume) {
            state.hrInteractions.sentResumeHRs.add(hrKey);
            StatePersistence.saveState();
            Core.log(`已向 ${hrKey} 发送简历`);
          }
        }
      }

      await this._handleKeywordReplies(hrKey, lastMessage);
    }

    static async _handleKeywordReplies(hrKey, message) {
      if (
        !message ||
        !state.settings.keywordReplies ||
        state.settings.keywordReplies.length === 0
      ) {
        return;
      }

      const messageLower = message.toLowerCase();

      for (const replyRule of state.settings.keywordReplies) {
        if (!replyRule.keyword || !replyRule.reply) {
          continue;
        }

        const keywordLower = replyRule.keyword.toLowerCase();
        if (messageLower.includes(keywordLower)) {
          Core.log(`关键词"${replyRule.keyword}"，正在回复自定义内容`);

          const sent = await this.sendCustomReply(replyRule.reply);
          if (sent) {
            return true;
          }
        }
      }

      return false;
    }

    static async sendCustomReply(replyText) {
      try {
        const inputBox = await Core.waitForElement("#chat-input");
        if (!inputBox) {
          Core.log("未找到聊天输入框");
          return false;
        }

        inputBox.textContent = "";
        inputBox.focus();
        document.execCommand("insertText", false, replyText);
        await Core.delay(Core.operationInterval / 10);

        const sendButton = document.querySelector(".btn-send");
        if (sendButton) {
          await Core.simulateClick(sendButton);
        } else {
          const enterKeyEvent = new KeyboardEvent("keydown", {
            key: "Enter",
            keyCode: 13,
            code: "Enter",
            which: 13,
            bubbles: true,
          });
          inputBox.dispatchEvent(enterKeyEvent);
        }

        return true;
      } catch (error) {
        Core.log(`发送自定义回复出错: ${error.message}`);
        return false;
      }
    }

    static async hasHRResponded() {
      await Core.delay(state.settings.actionDelays.click);

      const chatContainer = document.querySelector(".chat-message .im-list");
      if (!chatContainer) return false;

      const friendMessages = Array.from(
        chatContainer.querySelectorAll("li.message-item.item-friend")
      );
      return friendMessages.length > 0;
    }

    static async sendGreetings() {
      try {
        const dictBtn = await Core.waitForElement(".btn-dict");
        if (!dictBtn) {
          Core.log("未找到常用语（自我介绍）按钮");
          return false;
        }
        await Core.simulateClick(dictBtn);
        await Core.smartDelay(state.settings.actionDelays.click, "click");
        await Core.smartDelay(300, "dict_load");

        const dictList = await Core.waitForElement('ul[data-v-f115c50c=""]');
        if (!dictList) {
          Core.log("未找到常用语（自我介绍）");
          return false;
        }

        const dictItems = dictList.querySelectorAll("li");
        if (!dictItems || dictItems.length === 0) {
          Core.log("常用语列表（自我介绍）为空");
          return false;
        }

        for (let i = 0; i < dictItems.length; i++) {
          const item = dictItems[i];
          Core.log(
            `发送常用语（自我介绍）：第${i + 1}条/共${dictItems.length}条`
          );
          await Core.simulateClick(item);
          await Core.delay(state.settings.actionDelays.click);
        }

        return true;
      } catch (error) {
        Core.log(`发送常用语出错: ${error.message}`);
        return false;
      }
    }

    static _findMatchingResume(resumeItems, positionName) {
      try {
        const positionNameLower = positionName.toLowerCase();
        const twoCharKeywords = Core.extractTwoCharKeywords(positionNameLower);

        for (const keyword of twoCharKeywords) {
          for (const item of resumeItems) {
            const resumeNameElement = item.querySelector(".resume-name");
            if (!resumeNameElement) continue;

            const resumeName = resumeNameElement.textContent
              .trim()
              .toLowerCase();

            if (resumeName.includes(keyword)) {
              const resumeNameText = resumeNameElement.textContent.trim();
              Core.log(`智能匹配: "${resumeNameText}" 依据: "${keyword}"`);
              return item;
            }
          }
        }

        return null;
      } catch (error) {
        Core.log(`简历匹配出错: ${error.message}`);
        return null;
      }
    }

    static async sendResume() {
      try {
        const resumeBtn = await Core.waitForElement(() => {
          return [...document.querySelectorAll(".toolbar-btn")].find(
            (el) => el.textContent.trim() === "发简历"
          );
        });

        if (!resumeBtn) {
          Core.log("无法发送简历，未找到发简历按钮");
          return false;
        }

        if (resumeBtn.classList.contains("unable")) {
          Core.log("对方未回复，您无权发送简历");
          return false;
        }

        let positionName = "";
        try {
          const positionNameElement =
            Core.getCachedElement(".position-name", true) ||
            Core.getCachedElement(".job-name", true) ||
            Core.getCachedElement(
              '[class*="position-content"] .left-content .position-name',
              true
            );

          if (positionNameElement) {
            positionName = positionNameElement.textContent.trim();
          } else {
            Core.log("未找到岗位名称元素");
          }
        } catch (e) {
          Core.log(`获取岗位名称出错: ${e.message}`);
        }

        await Core.simulateClick(resumeBtn);
        await Core.smartDelay(state.settings.actionDelays.click, "click");
        await Core.smartDelay(800, "resume_load");

        const confirmDialog = document.querySelector(
          ".panel-resume.sentence-popover"
        );
        if (confirmDialog) {
          Core.log("您只有一份附件简历");

          const confirmBtn = confirmDialog.querySelector(".btn-sure-v2");
          if (!confirmBtn) {
            Core.log("未找到确认按钮");
            return false;
          }

          await Core.simulateClick(confirmBtn);
          return true;
        }

        const resumeList = await Core.waitForElement("ul.resume-list");
        if (!resumeList) {
          Core.log("未找到简历列表");
          return false;
        }

        const resumeItems = Array.from(
          resumeList.querySelectorAll("li.list-item")
        );
        if (resumeItems.length === 0) {
          Core.log("未找到简历列表项");
          return false;
        }

        let selectedResumeItem = null;
        if (positionName) {
          selectedResumeItem = this._findMatchingResume(
            resumeItems,
            positionName
          );
        }

        if (!selectedResumeItem) {
          selectedResumeItem = resumeItems[0];
          const resumeName = selectedResumeItem
            .querySelector(".resume-name")
            .textContent.trim();
          Core.log('使用第一个简历: "' + resumeName + '"');
        }

        await Core.simulateClick(selectedResumeItem);
        await Core.smartDelay(state.settings.actionDelays.click, "click");
        await Core.smartDelay(500, "selection");

        const sendBtn = await Core.waitForElement(
          "button.btn-v2.btn-sure-v2.btn-confirm"
        );
        if (!sendBtn) {
          Core.log("未找到发送按钮");
          return false;
        }

        if (sendBtn.disabled) {
          Core.log("发送按钮不可用，可能简历未正确选择");
          return false;
        }

        await Core.simulateClick(sendBtn);
        return true;
      } catch (error) {
        Core.log(`发送简历出错: ${error.message}`);
        return false;
      }
    }

    static selectImageResume(positionName) {
      try {
        const positionNameLower = positionName.toLowerCase();

        if (state.settings.imageResumes.length === 1) {
          return state.settings.imageResumes[0];
        }

        const twoCharKeywords = Core.extractTwoCharKeywords(positionNameLower);

        for (const keyword of twoCharKeywords) {
          for (const resume of state.settings.imageResumes) {
            const resumeNameLower = resume.path.toLowerCase();

            if (resumeNameLower.includes(keyword)) {
              Core.log(`智能匹配: "${resume.path}" 依据: "${keyword}"`);
              return resume;
            }
          }
        }

        return state.settings.imageResumes[0];
      } catch (error) {
        Core.log(`选择图片简历出错: ${error.message}`);
        return state.settings.imageResumes[0] || null;
      }
    }

    static async sendImageResume() {
      try {
        if (
          !state.settings.useAutoSendImageResume ||
          !state.settings.imageResumes ||
          state.settings.imageResumes.length === 0
        ) {
          return false;
        }

        let positionName = "";
        try {
          const positionNameElement =
            Core.getCachedElement(".position-name", true) ||
            Core.getCachedElement(".job-name", true) ||
            Core.getCachedElement(
              '[class*="position-content"] .left-content .position-name',
              true
            );

          if (positionNameElement) {
            positionName = positionNameElement.textContent.trim();
          } else {
            Core.log("未找到岗位名称元素");
            positionName = "";
          }
        } catch (e) {
          Core.log(`获取岗位名称出错: ${e.message}`);
          positionName = "";
        }

        const selectedResume = this.selectImageResume(positionName);

        if (!selectedResume || !selectedResume.data) {
          Core.log("没有可发送的图片简历数据");
          return false;
        }

        const imageSendBtn = await Core.waitForElement(
          '.toolbar-btn-content.icon.btn-sendimg input[type="file"]'
        );
        if (!imageSendBtn) {
          Core.log("未找到图片发送按钮");
          return false;
        }

        const byteCharacters = atob(selectedResume.data.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });

        const file = new File([blob], selectedResume.path, {
          type: "image/jpeg",
          lastModified: new Date().getTime(),
        });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        imageSendBtn.files = dataTransfer.files;

        const event = new Event("change", { bubbles: true });
        imageSendBtn.dispatchEvent(event);
        return true;
      } catch (error) {
        Core.log(`发送图片出错: ${error.message}`);
        return false;
      }
    }
  }

  const UI = {
    PAGE_TYPES: {
      JOB_LIST: "jobList",
      CHAT: "chat",
    },

    currentPageType: null,

    init() {
      this.currentPageType = location.pathname.includes("/chat")
        ? this.PAGE_TYPES.CHAT
        : this.PAGE_TYPES.JOB_LIST;
      this._applyTheme();
      this.createControlPanel();
      this.createMiniIcon();
    },

    createControlPanel() {
      if (document.getElementById("boss-pro-panel")) {
        document.getElementById("boss-pro-panel").remove();
      }

      elements.panel = this._createPanel();

      const header = this._createHeader();
      const controls = this._createPageControls();
      elements.log = this._createLogger();
      const footer = this._createFooter();

      elements.panel.append(header, controls, elements.log, footer);
      document.body.appendChild(elements.panel);
      this._makeDraggable(elements.panel);
    },

    _applyTheme() {
      CONFIG.COLORS =
        this.currentPageType === this.PAGE_TYPES.JOB_LIST
          ? this.THEMES.JOB_LIST
          : this.THEMES.CHAT;

      document.documentElement.style.setProperty(
        "--primary-color",
        CONFIG.COLORS.primary
      );
      document.documentElement.style.setProperty(
        "--secondary-color",
        CONFIG.COLORS.secondary
      );
      document.documentElement.style.setProperty(
        "--accent-color",
        CONFIG.COLORS.accent
      );
      document.documentElement.style.setProperty(
        "--neutral-color",
        CONFIG.COLORS.neutral
      );
    },

    THEMES: {
      JOB_LIST: {
        primary: "#4285f4",
        secondary: "#f5f7fa",
        accent: "#e8f0fe",
        neutral: "#6b7280",
      },
      CHAT: {
        primary: "#34a853",
        secondary: "#f0fdf4",
        accent: "#dcfce7",
        neutral: "#6b7280",
      },
    },

    _createPanel() {
      const panel = document.createElement("div");
      panel.id = "boss-pro-panel";
      panel.className =
        this.currentPageType === this.PAGE_TYPES.JOB_LIST
          ? "boss-joblist-panel"
          : "boss-chat-panel";

      const baseStyles = `
            position: fixed;
            top: 36px;
            right: 24px;
            width: clamp(300px, 80vw, 400px);
            border-radius: 12px;
            padding: 18px;
            font-family: 'Segoe UI', system-ui, sans-serif;
            z-index: 2147483647;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
            background: #ffffff;
            box-shadow: 0 10px 25px rgba(var(--primary-rgb), 0.15);
            border: 1px solid var(--accent-color);
            cursor: default;
        `;

      panel.style.cssText = baseStyles;

      const rgbColor = this._hexToRgb(CONFIG.COLORS.primary);
      document.documentElement.style.setProperty("--primary-rgb", rgbColor);

      return panel;
    },

    _createHeader() {
      const header = document.createElement("div");
      header.className =
        this.currentPageType === this.PAGE_TYPES.JOB_LIST
          ? "boss-header"
          : "boss-chat-header";

      header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px 15px;
            margin-bottom: 15px;
            border-bottom: 1px solid var(--accent-color);
        `;

      const title = this._createTitle();

      const buttonContainer = document.createElement("div");
      buttonContainer.style.cssText = `
            display: flex;
            gap: 8px;
        `;

      const buttonTitles =
        this.currentPageType === this.PAGE_TYPES.JOB_LIST
          ? {
              activate: "激活插件",
              settings: "插件设置",
              close: "最小化海投面板",
            }
          : {
              activate: "激活插件",
              settings: "海投设置",
              close: "最小化聊天面板",
            };

      const activationIcon = state.activation.isActivated
        ? `<svg t="1767250169245" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5617" width="200" height="200"><path d="M517.032183 19.734053a493.35132 493.35132 0 1 0 493.351321 493.35132 493.35132 493.35132 0 0 0-493.351321-493.35132z m0 927.500482a434.149162 434.149162 0 1 1 434.149162-434.149162 434.149162 434.149162 0 0 1-434.149162 434.149162z m-31.771825-320.086337h50.913857l28.417036-257.92407H513.085373z m-54.268645-257.92407l-92.750048 193.985739-48.940451-193.985739h-57.426094l72.423974 257.92407H355.21295l133.204857-257.92407z m347.714011 5.722875a148.597418 148.597418 0 0 0-46.177684-4.933513h-119.58836l-28.219695 257.134708h50.913856l9.867026-90.184621h81.896319a116.03623 116.03623 0 0 0 33.153209-4.144151 70.450569 70.450569 0 0 0 24.470226-14.011178 87.619194 87.619194 0 0 0 21.510117-28.811717 109.918674 109.918674 0 0 0 10.853729-36.113317 88.605897 88.605897 0 0 0-5.328194-43.612256A57.623434 57.623434 0 0 0 778.705724 374.947003z m-17.168626 76.962806a48.348429 48.348429 0 0 1-14.80054 33.745231 45.190981 45.190981 0 0 1-26.838312 6.117556H651.223743l7.69628-77.357487H730.159954a45.388321 45.388321 0 0 1 19.734053 2.762767c9.077664 5.525535 13.616496 16.971285 11.643091 33.942571z" p-id="5618" fill="#d81e06"></path></svg>`
        : `<svg t="1767250169245" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5617" width="200" height="200"><path d="M517.032183 19.734053a493.35132 493.35132 0 1 0 493.351321 493.35132 493.35132 493.35132 0 0 0-493.351321-493.35132z m0 927.500482a434.149162 434.149162 0 1 1 434.149162-434.149162 434.149162 434.149162 0 0 1-434.149162 434.149162z m-31.771825-320.086337h50.913857l28.417036-257.92407H513.085373z m-54.268645-257.92407l-92.750048 193.985739-48.940451-193.985739h-57.426094l72.423974 257.92407H355.21295l133.204857-257.92407z m347.714011 5.722875a148.597418 148.597418 0 0 0-46.177684-4.933513h-119.58836l-28.219695 257.134708h50.913856l9.867026-90.184621h81.896319a116.03623 116.03623 0 0 0 33.153209-4.144151 70.450569 70.450569 0 0 0 24.470226-14.011178 87.619194 87.619194 0 0 0 21.510117-28.811717 109.918674 109.918674 0 0 0 10.853729-36.113317 88.605897 88.605897 0 0 0-5.328194-43.612256A57.623434 57.623434 0 0 0 778.705724 374.947003z m-17.168626 76.962806a48.348429 48.348429 0 0 1-14.80054 33.745231 45.190981 45.190981 0 0 1-26.838312 6.117556H651.223743l7.69628-77.357487H730.159954a45.388321 45.388321 0 0 1 19.734053 2.762767c9.077664 5.525535 13.616496 16.971285 11.643091 33.942571z" p-id="5618" fill="#4285f4"></path></svg>`;
      const activationBtn = this._createIconButton(
        activationIcon,
        () => {
          showActivationDialog();
        },
        buttonTitles.activate
      );

      if (state.activation.isActivated) {
        activationBtn.style.color = "#fff";
        activationBtn.title = "插件已激活";
      }

      const settingsBtn = this._createIconButton(
        "⚙",
        () => {
          showSettingsDialog();
        },
        buttonTitles.settings
      );

      const closeBtn = this._createIconButton(
        "✕",
        () => {
          state.isMinimized = true;
          elements.panel.style.transform = "translateY(160%)";
          elements.miniIcon.style.display = "flex";
        },
        buttonTitles.close
      );

      buttonContainer.append(activationBtn, settingsBtn, closeBtn);
      header.append(title, buttonContainer);
      return header;
    },

    _createTitle() {
      const title = document.createElement("div");
      title.style.display = "flex";
      title.style.alignItems = "center";
      title.style.gap = "10px";

      const customSvg = `
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" 
             style="width: 100%; height: 100%; fill: white;">
            <path d="M512 116.032a160 160 0 0 1 52.224 311.232v259.008c118.144-22.272 207.552-121.088 207.552-239.36 0-25.152 21.568-45.568 48.128-45.568 26.624 0 48.128 20.416 48.128 45.632 0 184.832-158.848 335.232-354.048 335.232S160 631.808 160 446.976c0-25.152 21.568-45.632 48.128-45.632 26.624 0 48.128 20.48 48.128 45.632 0 118.144 89.088 216.96 206.976 239.296V428.416A160.064 160.064 0 0 1 512 116.032z m0 96a64 64 0 1 0 0 128 64 64 0 0 0 0-128z m-36.672 668.48l-21.888-19.584a17.92 17.92 0 0 0-24.64 0l-21.952 19.584a56.32 56.32 0 0 1-77.504 0l-21.952-19.584a17.92 17.92 0 0 0-24.64 0l-28.288 25.6c-9.6 8.704-23.36 6.4-30.72-4.992a29.696 29.696 0 0 1 4.16-36.672l28.352-25.6a56.32 56.32 0 0 1 77.568 0l21.888 19.584a17.92 17.92 0 0 0 24.704 0l21.824-19.52a56.32 56.32 0 0 1 77.568 0l21.888 19.52a17.92 17.92 0 0 0 24.64 0l21.952-19.52a56.32 56.32 0 0 1 77.504 0l21.952 19.52a17.92 17.92 0 0 0 24.64 0l21.824-19.52a56.32 56.32 0 0 1 77.632 0l21.824 19.52c9.664 8.704 11.52 25.152 4.224 36.672-7.296 11.52-21.12 13.696-30.72 4.992l-21.888-19.584a17.92 17.92 0 0 0-24.64 0l-21.888 19.584a56.32 56.32 0 0 1-77.568 0l-21.888-19.584a17.92 17.92 0 0 0-24.64 0l-21.888 19.584a57.408 57.408 0 0 1-38.656 15.488 58.176 58.176 0 0 1-38.784-15.488z" />
        </svg>
    `;

      const titleConfig =
        this.currentPageType === this.PAGE_TYPES.JOB_LIST
          ? {
              main: `<span style="color:var(--primary-color);">BOSS</span>海投助手`,
              sub: "高效求职 · 智能匹配",
            }
          : {
              main: `<span style="color:var(--primary-color);">BOSS</span>智能聊天`,
              sub: "智能对话 · 高效沟通",
            };

      title.innerHTML = `
        <div style="
            width: 40px;
            height: 40px;
            background: var(--primary-color);
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.3);
        ">
            ${customSvg}
        </div>
        <div>
            <h3 style="
                margin: 0;
                color: #2c3e50;
                font-weight: 600;
                font-size: 1.2rem;
            ">
                ${titleConfig.main}
            </h3>
            <span style="
                font-size:0.8em;
                color:var(--neutral-color);
            ">
                ${titleConfig.sub}
            </span>
        </div>
    `;

      return title;
    },

    _createPageControls() {
      if (this.currentPageType === this.PAGE_TYPES.JOB_LIST) {
        return this._createJobListControls();
      } else {
        return this._createChatControls();
      }
    },

    _createJobListControls() {
      const container = document.createElement("div");
      container.className = "boss-joblist-controls";
      container.style.marginBottom = "15px";
      container.style.padding = "0 10px";

      const filterContainer = this._createFilterContainer();

      elements.controlBtn = this._createTextButton(
        "启动海投",
        "var(--primary-color)",
        () => {
          toggleProcess();
        }
      );

      container.append(filterContainer, elements.controlBtn);
      return container;
    },

    _createChatControls() {
      const container = document.createElement("div");
      container.className = "boss-chat-controls";
      container.style.cssText = `
            background: var(--secondary-color);
            border-radius: 12px;
            padding: 15px;
            margin-left: 10px;
            margin-right: 10px;
            margin-bottom: 15px;
        `;

      const configRow = document.createElement("div");
      configRow.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        `;

      const communicationIncludeCol = this._createInputControl(
        "沟通岗位包含：",
        "communication-include",
        "如：技术,产品,设计"
      );

      const communicationModeCol = this._createSelectControl(
        "沟通模式：",
        "communication-mode-selector",
        [
          { value: "new-only", text: "仅新消息" },
          { value: "auto", text: "自动轮询" },
        ]
      );

      elements.communicationIncludeInput =
        communicationIncludeCol.querySelector("input");
      elements.communicationModeSelector =
        communicationModeCol.querySelector("select");
      configRow.append(communicationIncludeCol, communicationModeCol);

      elements.communicationModeSelector.addEventListener("change", (e) => {
        settings.communicationMode = e.target.value;
        saveSettings();
      });

      elements.communicationIncludeInput.addEventListener("input", (e) => {
        settings.communicationIncludeKeywords = e.target.value;
        saveSettings();
      });

      elements.controlBtn = this._createTextButton(
        "开始智能聊天",
        "var(--primary-color)",
        () => {
          toggleChatProcess();
        }
      );

      container.append(configRow, elements.controlBtn);
      return container;
    },

    _createFilterContainer() {
      const filterContainer = document.createElement("div");
      filterContainer.style.cssText = `
            background: var(--secondary-color);
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 15px;
        `;

      const filterRow = document.createElement("div");
      filterRow.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 12px;
        `;

      const includeFilterCol = this._createInputControl(
        "职位名包含：",
        "include-filter",
        "如：前端,开发"
      );
      const locationFilterCol = this._createInputControl(
        "工作地包含：",
        "location-filter",
        "如：杭州,滨江"
      );

      elements.includeInput = includeFilterCol.querySelector("input");
      elements.locationInput = locationFilterCol.querySelector("input");

      filterRow.append(includeFilterCol, locationFilterCol);

      const joinGroupBtn = document.createElement("button");
      joinGroupBtn.className = "boss-advanced-filter-btn";
      joinGroupBtn.innerHTML = '<i class="fa fa-sliders"></i> 海投服务群';
      joinGroupBtn.style.cssText = `
            width: 100%;
            padding: 8px 10px;
            background: white;
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            text-align: center;
            transition: all 0.2s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5px;
        `;

      joinGroupBtn.addEventListener("click", () => {
        window.open("https://qm.qq.com/q/ZNOz2ZZb6S", "_blank");
      });

      joinGroupBtn.addEventListener("mouseenter", () => {
        joinGroupBtn.style.backgroundColor = "var(--primary-color)";
        joinGroupBtn.style.color = "white";
      });

      joinGroupBtn.addEventListener("mouseleave", () => {
        joinGroupBtn.style.backgroundColor = "white";
        joinGroupBtn.style.color = "var(--primary-color)";
      });

      filterContainer.append(filterRow, joinGroupBtn);
      return filterContainer;
    },

    _createInputControl(labelText, id, placeholder) {
      const controlCol = document.createElement("div");
      controlCol.style.cssText = "flex: 1;";

      const label = document.createElement("label");
      label.textContent = labelText;
      label.style.cssText =
        "display:block; margin-bottom:5px; font-weight: 500; color: #333; font-size: 0.9rem;";

      const input = document.createElement("input");
      input.id = id;
      input.placeholder = placeholder;
      input.className = "boss-filter-input";
      input.style.cssText = `
            width: 100%;
            padding: 8px 10px;
            border-radius: 8px;
            border: 1px solid #d1d5db;
            font-size: 14px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            transition: all 0.2s ease;
        `;

      controlCol.append(label, input);
      return controlCol;
    },

    _createSelectControl(labelText, id, options) {
      const controlCol = document.createElement("div");
      controlCol.style.cssText = "flex: 1;";

      const label = document.createElement("label");
      label.textContent = labelText;
      label.style.cssText =
        "display:block; margin-bottom:5px; font-weight: 500; color: #333; font-size: 0.9rem;";

      const select = document.createElement("select");
      select.id = id;
      select.style.cssText = `
            width: 100%;
            padding: 8px 10px;
            border-radius: 8px;
            border: 1px solid #d1d5db;
            font-size: 14px;
            background: white;
            color: #333;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            transition: all 0.2s ease;
        `;

      options.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option.value;
        opt.textContent = option.text;
        select.appendChild(opt);
      });

      controlCol.append(label, select);
      return controlCol;
    },

    _createLogger() {
      const log = document.createElement("div");
      log.id = "pro-log";
      log.className =
        this.currentPageType === this.PAGE_TYPES.JOB_LIST
          ? "boss-joblist-log"
          : "boss-chat-log";

      const height =
        this.currentPageType === this.PAGE_TYPES.JOB_LIST ? "180px" : "220px";

      log.style.cssText = `
            height: ${height};
            overflow-y: auto;
            background: var(--secondary-color);
            border-radius: 12px;
            padding: 12px;
            font-size: 13px;
            line-height: 1.5;
            margin-bottom: 15px;
            margin-left: 10px;
            margin-right: 10px;
            transition: all 0.3s ease;
            user-select: text;
            scrollbar-width: thin;
            scrollbar-color: var(--primary-color) var(--secondary-color);
        `;

      log.innerHTML += `
            <style>
                #pro-log::-webkit-scrollbar {
                    width: 6px;
                }
                #pro-log::-webkit-scrollbar-track {
                    background: var(--secondary-color);
                    border-radius: 4px;
                }
                #pro-log::-webkit-scrollbar-thumb {
                    background-color: var(--primary-color);
                    border-radius: 4px;
                }
            </style>
        `;

      return log;
    },

    _createFooter() {
      const footer = document.createElement("div");
      footer.className =
        this.currentPageType === this.PAGE_TYPES.JOB_LIST
          ? "boss-joblist-footer"
          : "boss-chat-footer";

      footer.style.cssText = `
            text-align: center;
            font-size: 0.8em;
            color: var(--neutral-color);
            padding-top: 15px;
            border-top: 1px solid var(--accent-color);
            margin-top: auto;
            padding: 15px;
        `;

      const statsContainer = document.createElement("div");
      statsContainer.style.cssText = `
            display: flex;
            justify-content: space-around;
            margin-bottom: 15px;
        `;

      footer.append(
        statsContainer,
        document.createTextNode("© 2025 Yangshengzhou · All Rights Reserved")
      );
      return footer;
    },

    _createTextButton(text, bgColor, onClick) {
      const btn = document.createElement("button");
      btn.className = "boss-btn";
      btn.textContent = text;
      btn.style.cssText = `
            width: 100%;
            padding: 10px 16px;
            background: ${bgColor};
            color: #fff;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            transform: translateY(0px);
            margin: 0 auto;
        `;

      this._addButtonHoverEffects(btn);
      btn.addEventListener("click", onClick);

      return btn;
    },

    _createIconButton(icon, onClick, title) {
      const btn = document.createElement("button");
      btn.className = "boss-icon-btn";
      btn.innerHTML = icon;
      btn.title = title;

      // 检查是否是激活按钮且插件已激活
      const isActivationBtn = title === "激活插件";
      const isActivated = state.activation.isActivated;

      // 如果是激活按钮且插件已激活，设置按钮为禁用状态
      if (isActivationBtn && isActivated) {
        btn.disabled = true;
        btn.title = "插件已激活";
      }

      btn.style.cssText = `
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: none;
            background: ${
              this.currentPageType === this.PAGE_TYPES.JOB_LIST
                ? "var(--accent-color)"
                : "var(--accent-color)"
            };
            cursor: ${
              isActivationBtn && isActivated ? "not-allowed" : "pointer"
            };
            font-size: 16px;
            transition: all 0.2s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--primary-color);
            overflow: hidden;
            opacity: ${isActivationBtn && isActivated ? "0.5" : "1"};
        `;

      if (icon.includes("<svg")) {
        btn.style.padding = "4px";
      }

      // 如果是激活按钮且插件已激活，不添加点击事件
      if (!(isActivationBtn && isActivated)) {
        btn.addEventListener("click", onClick);
      }

      btn.addEventListener("mouseenter", () => {
        // 如果是激活按钮且插件已激活，不应用悬停效果
        if (!(isActivationBtn && isActivated)) {
          btn.style.backgroundColor = "var(--primary-color)";
          btn.style.color = "#fff";
          btn.style.transform = "scale(1.1)";
        }
      });

      btn.addEventListener("mouseleave", () => {
        // 如果是激活按钮且插件已激活，不应用悬停效果
        if (!(isActivationBtn && isActivated)) {
          btn.style.backgroundColor =
            this.currentPageType === this.PAGE_TYPES.JOB_LIST
              ? "var(--accent-color)"
              : "var(--accent-color)";
          btn.style.color = "var(--primary-color)";
          btn.style.transform = "scale(1)";
        }
      });

      return btn;
    },

    _addButtonHoverEffects(btn) {
      btn.addEventListener("mouseenter", () => {
        btn.style.transform = "scale(1.05)";
        btn.style.boxShadow = `0 6px 15px rgba(var(--primary-rgb), 0.3)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "scale(1)";
        btn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
      });
    },

    _makeDraggable(panel) {
      const header = panel.querySelector(".boss-header, .boss-chat-header");

      if (!header) return;

      header.style.cursor = "move";

      let isDragging = false;
      let startX = 0,
        startY = 0;
      let initialX = panel.offsetLeft,
        initialY = panel.offsetTop;

      header.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = panel.offsetLeft;
        initialY = panel.offsetTop;
        panel.style.transition = "none";
        panel.style.zIndex = "2147483647";
      });

      document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        panel.style.left = `${initialX + dx}px`;
        panel.style.top = `${initialY + dy}px`;
        panel.style.right = "auto";
      });

      document.addEventListener("mouseup", () => {
        if (isDragging) {
          isDragging = false;
          panel.style.transition = "all 0.3s ease";
          panel.style.zIndex = "2147483646";
        }
      });
    },

    createMiniIcon() {
      elements.miniIcon = document.createElement("div");
      elements.miniIcon.style.cssText = `
        width: ${CONFIG.MINI_ICON_SIZE || 48}px;
        height: ${CONFIG.MINI_ICON_SIZE || 48}px;
        position: fixed;
        bottom: 40px;
        left: 40px;
        background: var(--primary-color);
        border-radius: 50%;
        box-shadow: 0 6px 16px rgba(var(--primary-rgb), 0.4);
        cursor: pointer;
        display: none;
        justify-content: center;
        align-items: center;
        color: #fff;
        z-index: 2147483647;
        transition: all 0.3s ease;
        overflow: hidden;

    `;

      const customSvg = `
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" 
             style="width: 100%; height: 100%; fill: white;">
            <path d="M512 116.032a160 160 0 0 1 52.224 311.232v259.008c118.144-22.272 207.552-121.088 207.552-239.36 0-25.152 21.568-45.568 48.128-45.568 26.624 0 48.128 20.416 48.128 45.632 0 184.832-158.848 335.232-354.048 335.232S160 631.808 160 446.976c0-25.152 21.568-45.632 48.128-45.632 26.624 0 48.128 20.48 48.128 45.632 0 118.144 89.088 216.96 206.976 239.296V428.416A160.064 160.064 0 0 1 512 116.032z m0 96a64 64 0 1 0 0 128 64 64 0 0 0 0-128z m-36.672 668.48l-21.888-19.584a17.92 17.92 0 0 0-24.64 0l-21.952 19.584a56.32 56.32 0 0 1-77.504 0l-21.952-19.584a17.92 17.92 0 0 0-24.64 0l-28.288 25.6c-9.6 8.704-23.36 6.4-30.72-4.992a29.696 29.696 0 0 1 4.16-36.672l28.352-25.6a56.32 56.32 0 0 1 77.568 0l21.888 19.584a17.92 17.92 0 0 0 24.704 0l21.824-19.52a56.32 56.32 0 0 1 77.568 0l21.888 19.52a17.92 17.92 0 0 0 24.64 0l21.952-19.52a56.32 56.32 0 0 1 77.504 0l21.952 19.52a17.92 17.92 0 0 0 24.64 0l21.824-19.52a56.32 56.32 0 0 1 77.632 0l21.824 19.52c9.664 8.704 11.52 25.152 4.224 36.672-7.296 11.52-21.12 13.696-30.72 4.992l-21.888-19.584a17.92 17.92 0 0 0-24.64 0l-21.888 19.584a56.32 56.32 0 0 1-77.568 0l-21.888-19.584a17.92 17.92 0 0 0-24.64 0l-21.888 19.584a57.408 57.408 0 0 1-38.656 15.488 58.176 58.176 0 0 1-38.784-15.488z" />
        </svg>
    `;

      elements.miniIcon.innerHTML = customSvg;

      elements.miniIcon.addEventListener("mouseenter", () => {
        elements.miniIcon.style.transform = "scale(1.1)";
        elements.miniIcon.style.boxShadow = `0 8px 20px rgba(var(--primary-rgb), 0.5)`;
      });

      elements.miniIcon.addEventListener("mouseleave", () => {
        elements.miniIcon.style.transform = "scale(1)";
        elements.miniIcon.style.boxShadow = `0 6px 16px rgba(var(--primary-rgb), 0.4)`;
      });

      elements.miniIcon.addEventListener("click", () => {
        state.isMinimized = false;
        elements.panel.style.transform = "translateY(0)";
        elements.miniIcon.style.display = "none";
      });

      document.body.appendChild(elements.miniIcon);
    },

    _hexToRgb(hex) {
      hex = hex.replace("#", "");

      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      return `${r}, ${g}, ${b}`;
    },
  };

  const settings = {
    useAutoSendResume: JSON.parse(
      localStorage.getItem("useAutoSendResume") || "false"
    ),
    autoScrollSpeed: parseInt(localStorage.getItem("autoScrollSpeed") || "500"),
    customPhrases: JSON.parse(localStorage.getItem("customPhrases") || "[]"),
    actionDelays: {
      click: parseInt(localStorage.getItem("clickDelay") || "130"),
    },
    notifications: {
      enabled: JSON.parse(
        localStorage.getItem("notificationsEnabled") || "true"
      ),
      sound: JSON.parse(localStorage.getItem("notificationSound") || "true"),
    },
    ai: {
      role:
        localStorage.getItem("aiRole") ||
        "你是求职的应届生正在面对HR，回复需满足：20字内，编造专业对口/实习经验/证书任一岗位优势；被问个人信息或岗位条件，直接配合提供合理数据；全程积极真诚无拒绝言辞。",
    },

    autoReply: JSON.parse(localStorage.getItem("autoReply") || "false"),

    useAutoSendImageResume: JSON.parse(
      localStorage.getItem("useAutoSendImageResume") || "false"
    ),
    imageResumeData: localStorage.getItem("imageResumeData") || null,

    communicationMode: localStorage.getItem("communicationMode") || "new-only",

    recruiterActivityStatus: JSON.parse(
      localStorage.getItem("recruiterActivityStatus") || '["不限"]'
    ),

    excludeHeadhunters: JSON.parse(
      localStorage.getItem("excludeHeadhunters") || "false"
    ),

    intervals: {
      basic:
        parseInt(localStorage.getItem("basicInterval")) ||
        CONFIG.BASIC_INTERVAL,
      operation:
        parseInt(localStorage.getItem("operationInterval")) ||
        CONFIG.OPERATION_INTERVAL,
    },
  };

  function saveSettings() {
    localStorage.setItem(
      "useAutoSendResume",
      settings.useAutoSendResume.toString()
    );
    localStorage.setItem(
      "autoScrollSpeed",
      settings.autoScrollSpeed.toString()
    );
    localStorage.setItem(
      "customPhrases",
      JSON.stringify(settings.customPhrases)
    );
    localStorage.setItem("clickDelay", settings.actionDelays.click.toString());
    localStorage.setItem(
      "notificationsEnabled",
      settings.notifications.enabled.toString()
    );
    localStorage.setItem(
      "notificationSound",
      settings.notifications.sound.toString()
    );
    localStorage.setItem("aiRole", settings.ai.role);

    localStorage.setItem("autoReply", settings.autoReply.toString());

    localStorage.setItem(
      "useAutoSendImageResume",
      settings.useAutoSendImageResume.toString()
    );

    if (settings.imageResumes) {
      localStorage.setItem(
        "imageResumes",
        JSON.stringify(settings.imageResumes)
      );
    }

    if (settings.imageResumeData) {
      localStorage.setItem("imageResumeData", settings.imageResumeData);
    } else {
      localStorage.removeItem("imageResumeData");
    }

    localStorage.setItem(
      "recruiterActivityStatus",
      JSON.stringify(settings.recruiterActivityStatus)
    );

    localStorage.setItem(
      "excludeHeadhunters",
      settings.excludeHeadhunters.toString()
    );

    localStorage.setItem("basicInterval", settings.intervals.basic.toString());
    localStorage.setItem(
      "operationInterval",
      settings.intervals.operation.toString()
    );

    if (state.settings) {
      Object.assign(state.settings, settings);
    }
  }

  function loadSettings() {
    settings.useAutoSendResume = JSON.parse(
      localStorage.getItem("useAutoSendResume") || "false"
    );
    settings.autoScrollSpeed = parseInt(
      localStorage.getItem("autoScrollSpeed") || "500"
    );
    settings.customPhrases = JSON.parse(
      localStorage.getItem("customPhrases") || "[]"
    );
    settings.actionDelays.click = parseInt(
      localStorage.getItem("clickDelay") || "130"
    );
    settings.notifications.enabled = JSON.parse(
      localStorage.getItem("notificationsEnabled") || "true"
    );
    settings.notifications.sound = JSON.parse(
      localStorage.getItem("notificationSound") || "true"
    );
    settings.ai.role =
      localStorage.getItem("aiRole") ||
      "你是求职的应届生正在面对HR，回复需满足：20字内，编造专业对口/实习经验/证书任一岗位优势；被问个人信息或岗位条件，直接配合提供合理数据；全程积极真诚无拒绝言辞。";

    settings.useAutoSendImageResume = JSON.parse(
      localStorage.getItem("useAutoSendImageResume") || "false"
    );

    try {
      settings.imageResumes =
        JSON.parse(localStorage.getItem("imageResumes")) || [];
    } catch (e) {
      settings.imageResumes = [];
    }

    try {
      settings.recruiterActivityStatus = JSON.parse(
        localStorage.getItem("recruiterActivityStatus")
      ) || ["不限"];
    } catch (e) {
      settings.recruiterActivityStatus = ["不限"];
    }

    settings.imageResumeData = localStorage.getItem("imageResumeData") || null;

    settings.communicationMode =
      localStorage.getItem("communicationMode") || "new-only";

    settings.excludeHeadhunters = JSON.parse(
      localStorage.getItem("excludeHeadhunters") || "false"
    );

    settings.intervals = {
      basic:
        parseInt(localStorage.getItem("basicInterval")) ||
        CONFIG.BASIC_INTERVAL,
      operation:
        parseInt(localStorage.getItem("operationInterval")) ||
        CONFIG.OPERATION_INTERVAL,
    };

    if (state.settings) {
      Object.assign(state.settings, settings);
    }
  }

  function createSettingsDialog() {
    const dialog = document.createElement("div");
    dialog.id = "boss-settings-dialog";
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: clamp(300px, 90vw, 550px);
        height: 80vh;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        z-index: 999999;
        display: none;
        flex-direction: column;
        font-family: 'Segoe UI', sans-serif;
        overflow: hidden;
        transition: all 0.3s ease;
    `;

    dialog.innerHTML += `
        <style>
            #boss-settings-dialog {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.95);
            }
            #boss-settings-dialog.active {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            .setting-item {
                transition: all 0.2s ease;
            }
            .setting-item:hover {
                background-color: rgba(0, 123, 255, 0.05);
            }
            .multi-select-container {
                position: relative;
                width: 100%;
                margin-top: 10px;
            }
            .multi-select-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                border-radius: 8px;
                border: 1px solid #d1d5db;
                background: white;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .multi-select-header:hover {
                border-color: rgba(0, 123, 255, 0.7);
            }
            .multi-select-options {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                max-height: 200px;
                overflow-y: auto;
                border-radius: 8px;
                border: 1px solid #d1d5db;
                background: white;
                z-index: 100;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                display: none;
            }
            .multi-select-option {
                padding: 10px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .multi-select-option:hover {
                background-color: rgba(0, 123, 255, 0.05);
            }
            .multi-select-option.selected {
                background-color: rgba(0, 123, 255, 0.1);
            }
            .multi-select-clear {
                color: #666;
                cursor: pointer;
                margin-left: 5px;
            }
            .multi-select-clear:hover {
                color: #333;
            }
        </style>
    `;

    const dialogHeader = createDialogHeader("海投助手·BOSS设置");

    const dialogContent = document.createElement("div");
    dialogContent.style.cssText = `
        padding: 18px;
        flex: 1;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 123, 255, 0.5) rgba(0, 0, 0, 0.05);
    `;

    dialogContent.innerHTML += `
    <style>
        #boss-settings-dialog ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        #boss-settings-dialog ::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.05);
            border-radius: 10px;
            margin: 8px 0;
        }
        #boss-settings-dialog ::-webkit-scrollbar-thumb {
            background: rgba(0, 123, 255, 0.5);
            border-radius: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
        }
        #boss-settings-dialog ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 123, 255, 0.7);
            box-shadow: 0 1px 5px rgba(0,0,0,0.15);
        }
    </style>
    `;

    const tabsContainer = document.createElement("div");
    tabsContainer.style.cssText = `
        display: flex;
        border-bottom: 1px solid rgba(0, 123, 255, 0.2);
        margin-bottom: 20px;
    `;

    const aiTab = document.createElement("button");
    aiTab.textContent = "聊天设置";
    aiTab.className = "settings-tab active";
    aiTab.style.cssText = `
        padding: 9px 15px;
        background: rgba(0, 123, 255, 0.9);
        color: white;
        border: none;
        border-radius: 8px 8px 0 0;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-right: 5px;
    `;

    const advancedTab = document.createElement("button");
    advancedTab.textContent = "高级设置";
    advancedTab.className = "settings-tab";
    advancedTab.style.cssText = `
        padding: 9px 15px;
        background: rgba(0, 0, 0, 0.05);
        color: #333;
        border: none;
        border-radius: 8px 8px 0 0;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-right: 5px;
    `;

    const intervalTab = document.createElement("button");
    intervalTab.textContent = "间隔设置";
    intervalTab.className = "settings-tab";
    intervalTab.style.cssText = `
        padding: 9px 15px;
        background: rgba(0, 0, 0, 0.05);
        color: #333;
        border: none;
        border-radius: 8px 8px 0 0;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-right: 5px;
    `;

    tabsContainer.append(aiTab, advancedTab, intervalTab);

    const aiSettingsPanel = document.createElement("div");
    aiSettingsPanel.id = "ai-settings-panel";

    const roleSettingResult = createSettingItem(
      "AI角色定位",
      "定义AI在对话中的角色和语气特点",
      () => document.getElementById("ai-role-input")
    );

    const roleSetting = roleSettingResult.settingItem;

    const roleInput = document.createElement("textarea");
    roleInput.id = "ai-role-input";
    roleInput.rows = 5;
    roleInput.style.cssText = `
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        resize: vertical;
        font-size: 14px;
        transition: all 0.2s ease;
        margin-top: 10px;
        opacity: ${state.activation.isActivated ? "1" : "0.5"};
        pointer-events: ${state.activation.isActivated ? "auto" : "none"};
    `;

    addFocusBlurEffects(roleInput);
    roleSetting.append(roleInput);
    aiSettingsPanel.append(roleSetting);

    const keywordRepliesSettingResult = createSettingItem(
      "关键词自动回复",
      "设置关键词和对应的回复内容，当HR消息包含关键词时自动回复",
      () => document.getElementById("keyword-replies-container")
    );

    const keywordRepliesSetting = keywordRepliesSettingResult.settingItem;
    const keywordRepliesContainer = document.createElement("div");
    keywordRepliesContainer.id = "keyword-replies-container";
    keywordRepliesContainer.style.cssText = `
        width: 100%;
        margin-top: 10px;
        opacity: ${state.activation.isActivated ? "1" : "0.5"};
        pointer-events: ${state.activation.isActivated ? "auto" : "none"};
    `;

    const keywordRepliesList = document.createElement("div");
    keywordRepliesList.id = "keyword-replies-list";
    keywordRepliesList.style.cssText = `
        max-height: 200px;
        overflow-y: auto;
        margin-bottom: 10px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        padding: 10px;
    `;

    const addKeywordBtn = document.createElement("button");
    addKeywordBtn.textContent = "添加关键词回复规则";
    addKeywordBtn.style.cssText = `
        padding: 6px 12px;
        border-radius: 4px;
        border: 1px solid rgba(0, 123, 255, 0.7);
        background: rgba(0, 123, 255, 0.1);
        color: rgba(0, 123, 255, 0.9);
        cursor: ${state.activation.isActivated ? "pointer" : "not-allowed"};
        font-size: 13px;
        transition: all 0.2s ease;
        width: 100%;
        margin-top: 8px;
        opacity: ${state.activation.isActivated ? "1" : "0.5"};
    `;

    addKeywordBtn.addEventListener("mouseenter", () => {
      addKeywordBtn.style.backgroundColor = "rgba(0, 123, 255, 0.2)";
    });

    addKeywordBtn.addEventListener("mouseleave", () => {
      addKeywordBtn.style.backgroundColor = "rgba(0, 123, 255, 0.1)";
    });

    addKeywordBtn.addEventListener("click", () => {
      if (!state.activation.isActivated) {
        showNotification("请先激活会员以使用关键词自动回复功能", "error");
        return;
      }
      addKeywordReplyRule();
    });

    keywordRepliesContainer.append(keywordRepliesList, addKeywordBtn);
    keywordRepliesSetting.append(keywordRepliesContainer);
    aiSettingsPanel.append(keywordRepliesSetting);

    const advancedSettingsPanel = document.createElement("div");
    advancedSettingsPanel.id = "advanced-settings-panel";
    advancedSettingsPanel.style.display = "none";

    const autoReplySettingResult = createSettingItem(
      "Ai回复模式",
      "开启后Ai将自动回复消息",
      () => document.querySelector("#toggle-auto-reply-mode input")
    );

    const autoReplySetting = autoReplySettingResult.settingItem;
    const autoReplyDescriptionContainer =
      autoReplySettingResult.descriptionContainer;

    const autoReplyToggle = createToggleSwitch(
      "auto-reply-mode",
      settings.autoReply,
      (checked) => {
        settings.autoReply = checked;
      },
      true
    );

    autoReplyDescriptionContainer.append(autoReplyToggle);

    const autoSendResumeSettingResult = createSettingItem(
      "自动发送附件简历",
      "开启后系统将自动发送附件简历给HR",
      () => document.querySelector("#toggle-auto-send-resume input")
    );

    const autoSendResumeSetting = autoSendResumeSettingResult.settingItem;
    const autoSendResumeDescriptionContainer =
      autoSendResumeSettingResult.descriptionContainer;

    const autoSendResumeToggle = createToggleSwitch(
      "auto-send-resume",
      settings.useAutoSendResume,
      (checked) => {
        settings.useAutoSendResume = checked;
      },
      true
    );

    autoSendResumeDescriptionContainer.append(autoSendResumeToggle);

    const excludeHeadhuntersSettingResult = createSettingItem(
      "投递时排除猎头",
      "开启后将不会向猎头职位自动投递简历",
      () => document.querySelector("#toggle-exclude-headhunters input")
    );

    const excludeHeadhuntersSetting =
      excludeHeadhuntersSettingResult.settingItem;
    const excludeHeadhuntersDescriptionContainer =
      excludeHeadhuntersSettingResult.descriptionContainer;

    const excludeHeadhuntersToggle = createToggleSwitch(
      "exclude-headhunters",
      settings.excludeHeadhunters,
      (checked) => {
        settings.excludeHeadhunters = checked;
      },
      true
    );

    excludeHeadhuntersDescriptionContainer.append(excludeHeadhuntersToggle);

    const imageResumeSettingResult = createSettingItem(
      "自动发送图片简历",
      "开启后将发送图片简历给HR（需先选择图片文件）",
      () => document.querySelector("#toggle-auto-send-image-resume input")
    );

    const imageResumeSetting = imageResumeSettingResult.settingItem;
    const imageResumeDescriptionContainer =
      imageResumeSettingResult.descriptionContainer;

    if (!state.settings.imageResumes) {
      state.settings.imageResumes = [];
    }

    const fileInputContainer = document.createElement("div");
    fileInputContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        margin-top: 10px;
    `;

    const addResumeBtn = document.createElement("button");
    addResumeBtn.id = "add-image-resume-btn";
    addResumeBtn.textContent = "添加图片简历";
    addResumeBtn.style.cssText = `
        padding: 8px 16px;
        border-radius: 6px;
        border: 1px solid rgba(0, 123, 255, 0.7);
        background: rgba(0, 123, 255, 0.1);
        color: rgba(0, 123, 255, 0.9);
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
        align-self: flex-start;
        white-space: nowrap;
    `;

    const fileNameDisplay = document.createElement("div");
    fileNameDisplay.id = "image-resume-filename";
    fileNameDisplay.style.cssText = `
        flex: 1;
        padding: 8px;
        border-radius: 6px;
        border: 1px solid #d1d5db;
        background: #f8fafc;
        color: #334155;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    `;
    const resumeCount = state.settings.imageResumes
      ? state.settings.imageResumes.length
      : 0;
    fileNameDisplay.textContent =
      resumeCount > 0 ? `已上传 ${resumeCount} 个简历` : "未选择文件";

    const autoSendImageResumeToggle = (() => {
      const hasImageResumes =
        state.settings.imageResumes && state.settings.imageResumes.length > 0;
      const isValidState = hasImageResumes && settings.useAutoSendImageResume;
      if (!hasImageResumes) settings.useAutoSendImageResume = false;

      return createToggleSwitch(
        "auto-send-image-resume",
        isValidState,
        (checked) => {
          if (
            checked &&
            (!state.settings.imageResumes ||
              state.settings.imageResumes.length === 0)
          ) {
            showNotification("请先选择图片文件", "error");

            const slider = document.querySelector(
              "#toggle-auto-send-image-resume .toggle-slider"
            );
            const container = document.querySelector(
              "#toggle-auto-send-image-resume .toggle-switch"
            );

            container.style.backgroundColor = "#e5e7eb";
            slider.style.transform = "translateX(0)";
            document.querySelector(
              "#toggle-auto-send-image-resume input"
            ).checked = false;
          }
          settings.useAutoSendImageResume = checked;
          return true;
        },
        true
      );
    })();

    const hiddenFileInput = document.createElement("input");
    hiddenFileInput.id = "image-resume-input";
    hiddenFileInput.type = "file";
    hiddenFileInput.accept = "image/*";
    hiddenFileInput.style.display = "none";

    const uploadedResumesContainer = document.createElement("div");
    uploadedResumesContainer.id = "uploaded-resumes-container";
    uploadedResumesContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
    `;

    function renderResumeItem(index, resume) {
      const resumeItem = document.createElement("div");
      resumeItem.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            border-radius: 6px;
            background: rgba(0, 0, 0, 0.05);
            font-size: 14px;
        `;

      const fileNameSpan = document.createElement("span");
      fileNameSpan.textContent = resume.path;
      fileNameSpan.style.cssText = `
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 8px;
        `;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "删除";
      deleteBtn.style.cssText = `
            padding: 4px 12px;
            border-radius: 4px;
            border: 1px solid rgba(255, 70, 70, 0.7);
            background: rgba(255, 70, 70, 0.1);
            color: rgba(255, 70, 70, 0.9);
            cursor: pointer;
            font-size: 12px;
        `;

      deleteBtn.addEventListener("click", () => {
        state.settings.imageResumes.splice(index, 1);

        resumeItem.remove();

        if (state.settings.imageResumes.length === 0) {
          state.settings.useAutoSendImageResume = false;
          const toggleInput = document.querySelector(
            "#toggle-auto-send-image-resume input"
          );
          if (toggleInput) {
            toggleInput.checked = false;
            toggleInput.dispatchEvent(new Event("change"));
          }
        }

        if (
          typeof StatePersistence !== "undefined" &&
          StatePersistence.saveState
        ) {
          StatePersistence.saveState();
        }
      });

      resumeItem.appendChild(fileNameSpan);
      resumeItem.appendChild(deleteBtn);

      return resumeItem;
    }

    if (state.settings.imageResumes && state.settings.imageResumes.length > 0) {
      state.settings.imageResumes.forEach((resume, index) => {
        const resumeItem = renderResumeItem(index, resume);
        uploadedResumesContainer.appendChild(resumeItem);
      });
    }

    addResumeBtn.addEventListener("click", () => {
      if (state.settings.imageResumes.length >= 5) {
        if (typeof showNotification !== "undefined") {
          showNotification("免费版最多添加5个图片简历", "info");
        } else {
          alert("免费版最多添加5个图片简历");
        }
      } else {
        hiddenFileInput.click();
      }
    });

    hiddenFileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];

        const isDuplicate = state.settings.imageResumes.some(
          (resume) => resume.path === file.name
        );
        if (isDuplicate) {
          if (typeof showNotification !== "undefined") {
            showNotification("该文件名已存在", "error");
          } else {
            alert("该文件名已存在");
          }
          return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
          const newResume = {
            path: file.name,
            data: event.target.result,
          };

          state.settings.imageResumes.push(newResume);

          const index = state.settings.imageResumes.length - 1;
          const resumeItem = renderResumeItem(index, newResume);
          uploadedResumesContainer.appendChild(resumeItem);

          if (!state.settings.useAutoSendImageResume) {
            state.settings.useAutoSendImageResume = true;
            const toggleInput = document.querySelector(
              "#toggle-auto-send-image-resume input"
            );
            if (toggleInput) {
              toggleInput.checked = true;
              toggleInput.dispatchEvent(new Event("change"));
            }
          }

          if (
            typeof StatePersistence !== "undefined" &&
            StatePersistence.saveState
          ) {
            StatePersistence.saveState();
          }
        };
        reader.readAsDataURL(file);
      }
    });

    fileInputContainer.append(
      addResumeBtn,
      uploadedResumesContainer,
      hiddenFileInput
    );
    imageResumeDescriptionContainer.append(autoSendImageResumeToggle);
    imageResumeSetting.append(fileInputContainer);

    const recruiterStatusSettingResult = createSettingItem(
      "投递招聘者状态",
      "筛选活跃状态符合要求的招聘者进行投递",
      () => document.querySelector("#recruiter-status-select .select-header")
    );

    const recruiterStatusSetting = recruiterStatusSettingResult.settingItem;

    const statusSelect = document.createElement("div");
    statusSelect.id = "recruiter-status-select";
    statusSelect.className = "custom-select";
    statusSelect.style.cssText = `
        position: relative;
        width: 100%;
        margin-top: 10px;
    `;

    const statusHeader = document.createElement("div");
    statusHeader.className = "select-header";
    statusHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        min-height: 44px;
    `;

    const statusDisplay = document.createElement("div");
    statusDisplay.className = "select-value";
    statusDisplay.style.cssText = `
        flex: 1;
        text-align: left;
        color: #334155;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    `;
    statusDisplay.textContent = getStatusDisplayText();

    const statusIcon = document.createElement("div");
    statusIcon.className = "select-icon";
    statusIcon.innerHTML = "&#9660;";
    statusIcon.style.cssText = `
        margin-left: 10px;
        color: #64748b;
        transition: transform 0.2s ease;
    `;

    const statusClear = document.createElement("button");
    statusClear.className = "select-clear";
    statusClear.innerHTML = "×";
    statusClear.style.cssText = `
        background: none;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        font-size: 16px;
        margin-left: 8px;
        display: none;
        transition: color 0.2s ease;
    `;

    statusHeader.append(statusDisplay, statusClear, statusIcon);

    const statusOptions = document.createElement("div");
    statusOptions.className = "select-options";
    statusOptions.style.cssText = `
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        max-height: 240px;
        overflow-y: auto;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        background: white;
        z-index: 100;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        display: none;
        transition: all 0.2s ease;
        scrollbar-width: thin;
        scrollbar-color: #cbd5e1 #f1f5f9;
    `;

    statusOptions.innerHTML += `
        <style>
            .select-options::-webkit-scrollbar {
                width: 6px;
            }
            .select-options::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 10px;
            }
            .select-options::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 10px;
            }
            .select-options::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
            }
        </style>
    `;

    const statusOptionsList = [
      { value: "不限", text: "不限" },
      { value: "在线", text: "在线" },
      { value: "刚刚活跃", text: "刚刚活跃" },
      { value: "今日活跃", text: "今日活跃" },
      { value: "3日内活跃", text: "3日内活跃" },
      { value: "本周活跃", text: "本周活跃" },
      { value: "本月活跃", text: "本月活跃" },
      { value: "半年前活跃", text: "半年前活跃" },
    ];

    statusOptionsList.forEach((option) => {
      const statusOption = document.createElement("div");
      statusOption.className =
        "select-option" +
        (settings.recruiterActivityStatus &&
        Array.isArray(settings.recruiterActivityStatus) &&
        settings.recruiterActivityStatus.includes(option.value)
          ? " selected"
          : "");
      statusOption.dataset.value = option.value;
      statusOption.style.cssText = `
            padding: 12px 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #334155;
        `;

      const checkIcon = document.createElement("span");
      checkIcon.className = "check-icon";
      checkIcon.innerHTML = "✓";
      checkIcon.style.cssText = `
            margin-right: 8px;
            color: rgba(0, 123, 255, 0.9);
            font-weight: bold;
            display: ${
              settings.recruiterActivityStatus &&
              Array.isArray(settings.recruiterActivityStatus) &&
              settings.recruiterActivityStatus.includes(option.value)
                ? "inline"
                : "none"
            };
        `;

      const textSpan = document.createElement("span");
      textSpan.textContent = option.text;

      statusOption.append(checkIcon, textSpan);

      statusOption.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleStatusOption(option.value);
      });

      statusOptions.appendChild(statusOption);
    });

    statusHeader.addEventListener("click", () => {
      statusOptions.style.display =
        statusOptions.style.display === "block" ? "none" : "block";
      statusIcon.style.transform =
        statusOptions.style.display === "block"
          ? "rotate(180deg)"
          : "rotate(0)";
    });

    statusClear.addEventListener("click", (e) => {
      e.stopPropagation();
      settings.recruiterActivityStatus = [];
      updateStatusOptions();
    });

    document.addEventListener("click", (e) => {
      if (!statusSelect.contains(e.target)) {
        statusOptions.style.display = "none";
        statusIcon.style.transform = "rotate(0)";
      }
    });

    statusHeader.addEventListener("mouseenter", () => {
      statusHeader.style.borderColor = "rgba(0, 123, 255, 0.5)";
      statusHeader.style.boxShadow = "0 0 0 3px rgba(0, 123, 255, 0.1)";
    });

    statusHeader.addEventListener("mouseleave", () => {
      if (!statusHeader.contains(document.activeElement)) {
        statusHeader.style.borderColor = "#e2e8f0";
        statusHeader.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
      }
    });

    statusHeader.addEventListener("focus", () => {
      statusHeader.style.borderColor = "rgba(0, 123, 255, 0.7)";
      statusHeader.style.boxShadow = "0 0 0 3px rgba(0, 123, 255, 0.2)";
    });

    statusHeader.addEventListener("blur", () => {
      statusHeader.style.borderColor = "#e2e8f0";
      statusHeader.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
    });

    statusSelect.append(statusHeader, statusOptions);
    recruiterStatusSetting.append(statusSelect);

    advancedSettingsPanel.append(
      autoReplySetting,
      autoSendResumeSetting,
      excludeHeadhuntersSetting,
      imageResumeSetting,
      recruiterStatusSetting
    );

    const intervalSettingsPanel = document.createElement("div");
    intervalSettingsPanel.id = "interval-settings-panel";
    intervalSettingsPanel.style.display = "none";

    const basicIntervalSettingResult = createSettingItem(
      "基本间隔",
      "滚动、检查新聊天等间隔时间（毫秒）",
      () => document.getElementById("basic-interval-input")
    );

    const basicIntervalSetting = basicIntervalSettingResult.settingItem;

    const basicIntervalInput = document.createElement("input");
    basicIntervalInput.id = "basic-interval-input";
    basicIntervalInput.type = "number";
    basicIntervalInput.min = 500;
    basicIntervalInput.max = 10000;
    basicIntervalInput.step = 100;
    basicIntervalInput.style.cssText = `
        width: 100%;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        font-size: 14px;
        margin-top: 10px;
        transition: all 0.2s ease;
    `;

    addFocusBlurEffects(basicIntervalInput);
    basicIntervalSetting.append(basicIntervalInput);

    const operationIntervalSettingResult = createSettingItem(
      "操作间隔",
      "点击沟通按钮之间的间隔时间（毫秒）",
      () => document.getElementById("operation-interval-input")
    );

    const operationIntervalSetting = operationIntervalSettingResult.settingItem;

    const operationIntervalInput = document.createElement("input");
    operationIntervalInput.id = "operation-interval-input";
    operationIntervalInput.type = "number";
    operationIntervalInput.min = 100;
    operationIntervalInput.max = 2000;
    operationIntervalInput.step = 50;
    operationIntervalInput.style.cssText = `
        width: 100%;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        font-size: 14px;
        margin-top: 10px;
        transition: all 0.2s ease;
    `;

    addFocusBlurEffects(operationIntervalInput);
    operationIntervalSetting.append(operationIntervalInput);

    const scrollSpeedSettingResult = createSettingItem(
      "自动滚动速度",
      "页面自动滚动的速度 (毫秒/像素)",
      () => document.getElementById("scroll-speed-input")
    );

    const scrollSpeedSetting = scrollSpeedSettingResult.settingItem;

    const scrollSpeedInput = document.createElement("input");
    scrollSpeedInput.id = "scroll-speed-input";
    scrollSpeedInput.type = "number";
    scrollSpeedInput.min = 100;
    scrollSpeedInput.max = 2000;
    scrollSpeedInput.step = 50;
    scrollSpeedInput.style.cssText = `
        width: 100%;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        font-size: 14px;
        margin-top: 10px;
        transition: all 0.2s ease;
    `;

    addFocusBlurEffects(scrollSpeedInput);
    scrollSpeedSetting.append(scrollSpeedInput);

    intervalSettingsPanel.append(
      basicIntervalSetting,
      operationIntervalSetting,
      scrollSpeedSetting
    );

    aiTab.addEventListener("click", () => {
      setActiveTab(aiTab, aiSettingsPanel);
    });

    advancedTab.addEventListener("click", () => {
      setActiveTab(advancedTab, advancedSettingsPanel);
    });

    intervalTab.addEventListener("click", () => {
      setActiveTab(intervalTab, intervalSettingsPanel);
    });

    const dialogFooter = document.createElement("div");
    dialogFooter.style.cssText = `
        padding: 15px 20px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        background: rgba(0, 0, 0, 0.03);
    `;

    const cancelBtn = createTextButton("取消", "#e5e7eb", () => {
      dialog.style.display = "none";
    });

    const saveBtn = createTextButton(
      "保存设置",
      "rgba(0, 123, 255, 0.9)",
      () => {
        try {
          const aiRoleInput = document.getElementById("ai-role-input");
          settings.ai.role = aiRoleInput ? aiRoleInput.value : "";

          const basicIntervalInput = document.getElementById(
            "basic-interval-input"
          );
          const basicIntervalValue = basicIntervalInput
            ? parseInt(basicIntervalInput.value)
            : settings.intervals.basic;
          settings.intervals.basic = isNaN(basicIntervalValue)
            ? settings.intervals.basic
            : basicIntervalValue;

          const operationIntervalInput = document.getElementById(
            "operation-interval-input"
          );
          const operationIntervalValue = operationIntervalInput
            ? parseInt(operationIntervalInput.value)
            : settings.intervals.operation;
          settings.intervals.operation = isNaN(operationIntervalValue)
            ? settings.intervals.operation
            : operationIntervalValue;

          const scrollSpeedInput =
            document.getElementById("scroll-speed-input");
          const scrollSpeedValue = scrollSpeedInput
            ? parseInt(scrollSpeedInput.value)
            : settings.autoScrollSpeed;
          settings.autoScrollSpeed = isNaN(scrollSpeedValue)
            ? settings.autoScrollSpeed
            : scrollSpeedValue;

          saveSettings();

          showNotification("设置已保存");
          dialog.style.display = "none";
        } catch (error) {
          showNotification("保存失败: " + error.message, "error");
          console.error("保存设置失败:", error);
        }
      }
    );

    dialogFooter.append(cancelBtn, saveBtn);

    dialogContent.append(
      tabsContainer,
      aiSettingsPanel,
      advancedSettingsPanel,
      intervalSettingsPanel
    );
    dialog.append(dialogHeader, dialogContent, dialogFooter);

    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        dialog.style.display = "none";
      }
    });

    return dialog;
  }

  function showSettingsDialog() {
    let dialog = document.getElementById("boss-settings-dialog");
    if (!dialog) {
      dialog = createSettingsDialog();
      document.body.appendChild(dialog);
    }

    dialog.style.display = "flex";

    setTimeout(() => {
      dialog.classList.add("active");
      setTimeout(loadSettingsIntoUI, 100);
    }, 10);
  }

  function toggleStatusOption(value) {
    if (value === "不限") {
      settings.recruiterActivityStatus =
        settings.recruiterActivityStatus.includes("不限") ? [] : ["不限"];
    } else {
      if (settings.recruiterActivityStatus.includes("不限")) {
        settings.recruiterActivityStatus = [value];
      } else {
        if (settings.recruiterActivityStatus.includes(value)) {
          settings.recruiterActivityStatus =
            settings.recruiterActivityStatus.filter((v) => v !== value);
        } else {
          settings.recruiterActivityStatus.push(value);
        }

        if (settings.recruiterActivityStatus.length === 0) {
          settings.recruiterActivityStatus = ["不限"];
        }
      }
    }

    if (state.settings) {
      state.settings.recruiterActivityStatus = settings.recruiterActivityStatus;
    }

    updateStatusOptions();
  }

  function updateStatusOptions() {
    const options = document.querySelectorAll(
      "#recruiter-status-select .select-option"
    );
    options.forEach((option) => {
      const isSelected = settings.recruiterActivityStatus.includes(
        option.dataset.value
      );
      option.className = "select-option" + (isSelected ? " selected" : "");
      option.querySelector(".check-icon").style.display = isSelected
        ? "inline"
        : "none";

      if (option.dataset.value === "不限") {
        if (isSelected) {
          options.forEach((opt) => {
            if (opt.dataset.value !== "不限") {
              opt.className = "select-option";
              opt.querySelector(".check-icon").style.display = "none";
            }
          });
        }
      } else if (settings.recruiterActivityStatus.includes("不限")) {
        option.querySelector(".check-icon").style.display = "none";
        option.className = "select-option";
      }
    });

    document.querySelector(
      "#recruiter-status-select .select-value"
    ).textContent = getStatusDisplayText();

    document.querySelector(
      "#recruiter-status-select .select-clear"
    ).style.display =
      settings.recruiterActivityStatus.length > 0 &&
      !settings.recruiterActivityStatus.includes("不限")
        ? "inline"
        : "none";

    if (state.settings) {
      state.settings.recruiterActivityStatus = settings.recruiterActivityStatus;
    }
  }

  function getStatusDisplayText() {
    if (settings.recruiterActivityStatus.includes("不限")) {
      return "不限";
    }

    if (settings.recruiterActivityStatus.length === 0) {
      return "请选择";
    }

    if (settings.recruiterActivityStatus.length <= 2) {
      return settings.recruiterActivityStatus.join("、");
    }

    return `${settings.recruiterActivityStatus[0]}、${settings.recruiterActivityStatus[1]}等${settings.recruiterActivityStatus.length}项`;
  }

  function loadSettingsIntoUI() {
    const aiRoleInput = document.getElementById("ai-role-input");
    if (aiRoleInput) {
      aiRoleInput.value = settings.ai.role;
    }

    const autoReplyInput = document.querySelector(
      "#toggle-auto-reply-mode input"
    );
    if (autoReplyInput) {
      autoReplyInput.checked = settings.autoReply;
    }

    const autoSendResumeInput = document.querySelector(
      "#toggle-auto-send-resume input"
    );
    if (autoSendResumeInput) {
      autoSendResumeInput.checked = settings.useAutoSendResume;
    }

    const excludeHeadhuntersInput = document.querySelector(
      "#toggle-exclude-headhunters input"
    );
    if (excludeHeadhuntersInput) {
      excludeHeadhuntersInput.checked = settings.excludeHeadhunters;
    }

    const basicIntervalInput = document.getElementById("basic-interval-input");
    if (basicIntervalInput) {
      basicIntervalInput.value = settings.intervals.basic.toString();
    }

    const operationIntervalInput = document.getElementById(
      "operation-interval-input"
    );
    if (operationIntervalInput) {
      operationIntervalInput.value = settings.intervals.operation.toString();
    }

    const scrollSpeedInput = document.getElementById("scroll-speed-input");
    if (scrollSpeedInput) {
      scrollSpeedInput.value = settings.autoScrollSpeed.toString();
    }

    const autoSendImageResumeInput = document.querySelector(
      "#toggle-auto-send-image-resume input"
    );
    if (autoSendImageResumeInput) {
      autoSendImageResumeInput.checked =
        settings.useAutoSendImageResume &&
        settings.imageResumes &&
        settings.imageResumes.length > 0;
    }

    const communicationModeSelector = document.querySelector(
      "#communication-mode-selector select"
    );
    if (communicationModeSelector) {
      communicationModeSelector.value = settings.communicationMode;
    }

    if (elements.communicationIncludeInput) {
      elements.communicationIncludeInput.value =
        settings.communicationIncludeKeywords || "";
    }

    updateStatusOptions();
  }

  function createDialogHeader(title, dialogId = "boss-settings-dialog") {
    const header = document.createElement("div");
    header.style.cssText = `
        padding: 16px 20px;
        background: #4285f4;
        color: white;
        font-size: 18px;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        border-radius: 12px 12px 0 0;
    `;

    const titleElement = document.createElement("div");
    titleElement.textContent = title;
    titleElement.style.fontWeight = "600";

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "✕";
    closeBtn.title = "关闭";
    closeBtn.style.cssText = `
        width: 28px;
        height: 28px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        font-size: 16px;
        font-weight: bold;
    `;

    closeBtn.addEventListener("mouseenter", () => {
      closeBtn.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      closeBtn.style.transform = "scale(1.1)";
    });

    closeBtn.addEventListener("mouseleave", () => {
      closeBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      closeBtn.style.transform = "scale(1)";
    });

    closeBtn.addEventListener("click", () => {
      const dialog = document.getElementById(dialogId);
      if (dialog) {
        dialog.style.display = "none";
      }
    });

    header.append(titleElement, closeBtn);
    return header;
  }

  function showActivationDialog() {
    window.open(
      "https://www.qianxun1688.com/liebiao/EF09A4A75F66C0F1",
      "_blank"
    );

    let dialog = document.getElementById("boss-activation-dialog");
    if (!dialog) {
      dialog = createActivationDialog();
      document.body.appendChild(dialog);
    }

    dialog.style.display = "flex";

    setTimeout(() => {
      dialog.classList.add("active");
    }, 10);
  }

  function createActivationDialog() {
    const dialog = document.createElement("div");
    dialog.id = "boss-activation-dialog";
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: clamp(300px, 90vw, 380px);
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 999999;
        display: none;
        flex-direction: column;
        font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
        overflow: hidden;
        transition: all 0.3s ease;
    `;

    dialog.innerHTML = `
      <style>
        #boss-activation-dialog.active {
            animation: dialogSlideIn 0.3s ease;
        }
        @keyframes dialogSlideIn {
            from {
                opacity: 0;
                transform: translate(-50%, -45%);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
        }
        .activation-input:focus {
            border-color: #4285f4 !important;
            box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
        }
        .activation-btn:hover {
            transform: scale(1.02);
            box-shadow: 0 6px 20px rgba(33, 150, 243, 0.3);
        }
      </style>
      
      <!-- Header -->
      <div style="padding: 16px 20px; background: #4285f4; color: white; font-size: 18px; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
        <div>激活插件</div>
        <button onclick="document.getElementById('boss-activation-dialog').style.display='none'" 
                style="width: 28px; height: 28px; background: rgba(255,255,255,0.2); color: white; border-radius: 50%; border: none; cursor: pointer; font-size: 16px; font-weight: bold; transition: all 0.2s ease;">✕</button>
      </div>
      
      <!-- Content -->
      <div style="padding: 24px 20px; text-align: center;">
        <h3 style="color: #333; margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">￥1.99元 永久解锁功能</h3>
        <p style="color: #666; font-size: 13px; margin: 0 0 20px 0;">输入激活码，offer快人一步</p>
        
        <div style="margin-bottom: 20px; text-align: left;">
          <label style="display: block; margin-bottom: 6px; color: #333; font-weight: 500; font-size: 13px;">激活码：</label>
          <input type="text" id="activation-code-input" placeholder="请输入您的激活码" 
                 class="activation-input"
                 style="width: 100%; padding: 12px 14px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; transition: all 0.3s ease; background: #fafafa; box-sizing: border-box;">
          <div id="activation-status" style="margin-top: 8px; font-size: 12px; color: #666; min-height: 16px;"></div>
        </div>
        
        <button id="activate-btn" class="activation-btn"
                style="width: 100%; padding: 12px; background: #4285f4; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; letter-spacing: 0.5px;">
          立即激活
        </button>
        
        <div style="margin-top: 12px; text-align: center;">
          <a href="https://www.qianxun1688.com/liebiao/EF09A4A75F66C0F1" 
             target="_blank" 
             style="color: #4285f4; text-decoration: none; font-size: 12px; font-weight: 500; transition: color 0.2s ease;"
             onmouseover="this.style.color='#3367d6'"
             onmouseout="this.style.color='#4285f4'">
            没有激活码？现在购买
          </a>
        </div>
      </div>
    `;

    setTimeout(() => {
      const activateBtn = document.getElementById("activate-btn");
      const codeInput = document.getElementById("activation-code-input");

      if (activateBtn) {
        activateBtn.addEventListener("click", async () => {
          const code = codeInput.value.trim();
          if (!code) {
            alert("请输入激活码");
            return;
          }

          if (!ActivationManager.validateCardKey(code)) {
            alert("激活码格式不正确，请输入32位激活码");
            return;
          }

          activateBtn.disabled = true;
          activateBtn.textContent = "激活中...";

          try {
            const success = await ActivationManager.activateWithCardKey(code);
            if (success) {
              alert("激活成功！");
              dialog.style.display = "none";
              const activationBtn = document.querySelector(
                ".boss-icon-btn[title='激活插件']"
              );
              if (activationBtn) {
                activationBtn.innerHTML = "";
                activationBtn.style.backgroundColor = "#ffd700";
                activationBtn.style.color = "#fff";
                activationBtn.style.padding = "0";
              }
            }
          } catch (error) {
            if (error.message.includes("The user aborted a request.")) {
              alert("激活请求出错，请刷新页面后重试");
            } else {
              alert(error.message);
            }
          } finally {
            activateBtn.disabled = false;
            activateBtn.textContent = "立即激活";
          }
        });
      }
    }, 100);

    return dialog;
  }

  function createSettingItem(title, description, controlGetter) {
    const settingItem = document.createElement("div");
    settingItem.className = "setting-item";
    settingItem.style.cssText = `
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 15px;
        background: white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        border: 1px solid rgba(0, 123, 255, 0.1);
        display: flex;
        flex-direction: column;
    `;

    const titleElement = document.createElement("h4");
    titleElement.textContent = title;
    titleElement.style.cssText = `
        margin: 0 0 5px;
        color: #333;
        font-size: 16px;
        font-weight: 500;
    `;

    const descElement = document.createElement("p");
    descElement.textContent = description;
    descElement.style.cssText = `
        margin: 0;
        color: #666;
        font-size: 13px;
        line-height: 1.4;
    `;

    const descriptionContainer = document.createElement("div");
    descriptionContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    `;

    const textContainer = document.createElement("div");
    textContainer.append(titleElement, descElement);

    descriptionContainer.append(textContainer);

    settingItem.append(descriptionContainer);

    settingItem.addEventListener("click", () => {
      const control = controlGetter();
      if (control && typeof control.focus === "function") {
        control.focus();
      }
    });

    return {
      settingItem,
      descriptionContainer,
    };
  }

  function createToggleSwitch(
    id,
    isChecked,
    onChange,
    requiresActivation = false
  ) {
    const container = document.createElement("div");
    container.className = "toggle-container";
    container.style.cssText =
      "display: flex; justify-content: space-between; align-items: center;";

    const switchContainer = document.createElement("div");
    switchContainer.className = "toggle-switch";

    const isDisabled = requiresActivation && !state.activation.isActivated;

    switchContainer.style.cssText = `
        position: relative;
        width: 50px;
        height: 26px;
        border-radius: 13px;
        background-color: ${
          isChecked && !isDisabled ? "rgba(0, 123, 255, 0.9)" : "#e5e7eb"
        };
        cursor: ${isDisabled ? "not-allowed" : "pointer"};
        opacity: ${isDisabled ? "0.5" : "1"};
    `;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `toggle-${id}`;
    checkbox.checked = isChecked;
    checkbox.style.display = "none";

    const slider = document.createElement("span");
    slider.className = "toggle-slider";
    slider.style.cssText = `
        position: absolute;
        top: 3px;
        left: ${isChecked ? "27px" : "3px"};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        transition: none;
    `;

    const forceUpdateUI = (checked) => {
      if (isDisabled) return;

      checkbox.checked = checked;
      switchContainer.style.backgroundColor = checked
        ? "rgba(0, 123, 255, 0.9)"
        : "#e5e7eb";
      slider.style.left = checked ? "27px" : "3px";
    };

    checkbox.addEventListener("change", () => {
      if (isDisabled) {
        forceUpdateUI(!checkbox.checked);
        return;
      }

      let allowChange = true;

      if (onChange) {
        allowChange = onChange(checkbox.checked) !== false;
      }

      if (!allowChange) {
        forceUpdateUI(!checkbox.checked);
        return;
      }

      forceUpdateUI(checkbox.checked);
    });

    switchContainer.addEventListener("click", () => {
      if (isDisabled) {
        showActivationDialog();
        return;
      }

      const newState = !checkbox.checked;

      if (onChange) {
        if (onChange(newState) !== false) {
          forceUpdateUI(newState);
        }
      } else {
        forceUpdateUI(newState);
      }
    });

    switchContainer.append(checkbox, slider);
    container.append(switchContainer);

    return container;
  }

  function createTextButton(text, backgroundColor, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.style.cssText = `
        padding: 9px 18px;
        border-radius: 8px;
        border: none;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        background: ${backgroundColor};
        color: white;
    `;

    button.addEventListener("click", onClick);

    return button;
  }

  function addFocusBlurEffects(element) {
    element.addEventListener("focus", () => {
      element.style.borderColor = "rgba(0, 123, 255, 0.7)";
      element.style.boxShadow = "0 0 0 3px rgba(0, 123, 255, 0.2)";
    });

    element.addEventListener("blur", () => {
      element.style.borderColor = "#d1d5db";
      element.style.boxShadow = "none";
    });
  }

  function setActiveTab(tab, panel) {
    const tabs = document.querySelectorAll(".settings-tab");
    const panels = [
      document.getElementById("ai-settings-panel"),
      document.getElementById("advanced-settings-panel"),
      document.getElementById("interval-settings-panel"),
    ];

    tabs.forEach((t) => {
      t.classList.remove("active");
      t.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
      t.style.color = "#333";
    });

    panels.forEach((p) => {
      p.style.display = "none";
    });

    tab.classList.add("active");
    tab.style.backgroundColor = "rgba(0, 123, 255, 0.9)";
    tab.style.color = "white";

    panel.style.display = "block";
  }

  function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    const bgColor =
      type === "success" ? "rgba(40, 167, 69, 0.9)" : "rgba(220, 53, 69, 0.9)";

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${bgColor};
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        z-index: 9999999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => (notification.style.opacity = "1"), 10);
    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 2000);
  }

  function filterJobsByKeywords(jobDescriptions) {
    const excludeKeywords = [];
    const includeKeywords = [];

    return jobDescriptions.filter((description) => {
      for (const keyword of excludeKeywords) {
        if (description.includes(keyword)) {
          return false;
        }
      }

      if (includeKeywords.length > 0) {
        return includeKeywords.some((keyword) => description.includes(keyword));
      }

      return true;
    });
  }

  const Core = {
    CONFIG,

    basicInterval:
      parseInt(localStorage.getItem("basicInterval")) || CONFIG.BASIC_INTERVAL,
    operationInterval:
      parseInt(localStorage.getItem("operationInterval")) ||
      CONFIG.OPERATION_INTERVAL,
    messageObserver: null,
    lastProcessedMessage: null,
    processingMessage: false,

    domCache: {},

    getCachedElement(selector, forceRefresh = false) {
      if (forceRefresh || !this.domCache[selector]) {
        this.domCache[selector] = document.querySelector(selector);
      }
      return this.domCache[selector];
    },

    getCachedElements(selector, forceRefresh = false) {
      if (forceRefresh || !this.domCache[selector + "[]"]) {
        this.domCache[selector + "[]"] = document.querySelectorAll(selector);
      }
      return this.domCache[selector + "[]"];
    },

    clearDomCache() {
      this.domCache = {};
    },

    async startProcessing() {
      if (location.pathname.includes("/jobs")) await this.autoScrollJobList();

      while (state.isRunning) {
        if (location.pathname.includes("/jobs")) await this.processJobList();
        else if (location.pathname.includes("/chat"))
          await this.handleChatPage();
        await this.delay(this.basicInterval);
      }
    },

    async autoScrollJobList() {
      return new Promise((resolve) => {
        const cardSelector = "li.job-card-box";
        const maxHistory = 3;
        const waitTime = this.basicInterval;
        let cardCountHistory = [];
        let isStopped = false;

        const scrollStep = async () => {
          if (isStopped) return;

          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          });
          await this.delay(waitTime);

          const cards = document.querySelectorAll(cardSelector);
          const currentCount = cards.length;
          cardCountHistory.push(currentCount);

          if (cardCountHistory.length > maxHistory) cardCountHistory.shift();

          if (
            cardCountHistory.length === maxHistory &&
            new Set(cardCountHistory).size === 1
          ) {
            this.log("当前页面岗位加载完成，开始沟通");
            resolve(cards);
            return;
          }

          scrollStep();
        };

        scrollStep();

        this.stopAutoScroll = () => {
          isStopped = true;
          resolve(null);
        };
      });
    },

    async processJobList() {
      const excludeHeadhunters = settings.excludeHeadhunters;
      const activeStatusFilter = settings.recruiterActivityStatus;

      state.jobList = Array.from(
        document.querySelectorAll("li.job-card-box")
      ).filter((card) => {
        const title =
          card.querySelector(".job-name")?.textContent?.toLowerCase() || "";

        const addressText = (
          card.querySelector(".job-address-desc")?.textContent ||
          card.querySelector(".company-location")?.textContent ||
          card.querySelector(".job-area")?.textContent ||
          ""
        )
          .toLowerCase()
          .trim();
        const headhuntingElement = card.querySelector(".job-tag-icon");
        const altText = headhuntingElement ? headhuntingElement.alt : "";

        const includeMatch =
          state.includeKeywords.length === 0 ||
          state.includeKeywords.some((kw) => kw && title.includes(kw.trim()));

        const locationMatch =
          state.locationKeywords.length === 0 ||
          state.locationKeywords.some(
            (kw) => kw && addressText.includes(kw.trim())
          );

        const excludeHeadhunterMatch =
          !excludeHeadhunters || !altText.includes("猎头");

        return includeMatch && locationMatch && excludeHeadhunterMatch;
      });

      if (!state.jobList.length) {
        this.log("没有符合条件的职位");
        toggleProcess();
        return;
      }

      if (state.currentIndex >= state.jobList.length) {
        this.resetCycle();
        return;
      }

      const currentCard = state.jobList[state.currentIndex];
      currentCard.scrollIntoView({ behavior: "smooth", block: "center" });
      currentCard.click();

      await this.delay(this.operationInterval * 2);

      let activeTime = "未知";
      const onlineTag = document.querySelector(".boss-online-tag");
      if (onlineTag && onlineTag.textContent.trim() === "在线") {
        activeTime = "在线";
      } else {
        const activeTimeElement = document.querySelector(".boss-active-time");
        activeTime = activeTimeElement?.textContent?.trim() || "未知";
      }

      const isActiveStatusMatch =
        activeStatusFilter.includes("不限") ||
        activeStatusFilter.includes(activeTime);

      if (!isActiveStatusMatch) {
        this.log(`跳过: 招聘者状态 "${activeTime}"`);
        state.currentIndex++;
        return;
      }

      const includeLog = state.includeKeywords.length
        ? `职位名包含[${state.includeKeywords.join("、")}]`
        : "职位名不限";
      const locationLog = state.locationKeywords.length
        ? `工作地包含[${state.locationKeywords.join("、")}]`
        : "工作地不限";
      this.log(
        `正在沟通：${++state.currentIndex}/${
          state.jobList.length
        }，${includeLog}，${locationLog}，招聘者"${activeTime}"`
      );

      const chatBtn = document.querySelector("a.op-btn-chat");
      if (chatBtn) {
        const btnText = chatBtn.textContent.trim();
        if (btnText === "立即沟通") {
          chatBtn.click();
          await this.handleGreetingModal();
        }
      }
    },

    async handleGreetingModal() {
      await this.delay(this.operationInterval * 4);

      const btn = [
        ...document.querySelectorAll(".default-btn.cancel-btn"),
      ].find((b) => b.textContent.trim() === "留在此页");

      if (btn) {
        btn.click();
        await this.delay(this.operationInterval * 2);
      }
    },

    async handleChatPage() {
      this.resetMessageState();

      if (this.messageObserver) {
        this.messageObserver.disconnect();
        this.messageObserver = null;
      }

      const latestChatLi = await this.waitForElement(this.getLatestChatLi);
      if (!latestChatLi) return;

      const nameEl = latestChatLi.querySelector(".name-text");
      const companyEl = latestChatLi.querySelector(
        ".name-box span:nth-child(2)"
      );
      const name = (nameEl?.textContent || "未知").trim();
      const company = (companyEl?.textContent || "").trim();
      const hrKey = `${name}-${company}`.toLowerCase();

      if (
        settings.communicationIncludeKeywords &&
        settings.communicationIncludeKeywords.trim()
      ) {
        await this.simulateClick(latestChatLi.querySelector(".figure"));
        await this.delay(this.operationInterval * 2);

        const positionName = this.getPositionNameFromChat();
        const includeKeywords = settings.communicationIncludeKeywords
          .toLowerCase()
          .split(",")
          .map((kw) => kw.trim())
          .filter((kw) => kw.length > 0);

        const positionNameLower = positionName.toLowerCase();
        const isMatch = includeKeywords.some((keyword) =>
          positionNameLower.includes(keyword)
        );

        if (!isMatch) {
          this.log(`跳过岗位，不含关键词[${includeKeywords.join(", ")}]`);

          if (settings.communicationMode === "auto") {
            await this.scrollUserList();
          }
          return;
        }
      }

      if (!latestChatLi.classList.contains("last-clicked")) {
        await this.simulateClick(latestChatLi.querySelector(".figure"));
        latestChatLi.classList.add("last-clicked");

        await this.delay(this.operationInterval);
        await HRInteractionManager.handleHRInteraction(hrKey);

        if (settings.communicationMode === "auto") {
          await this.scrollUserList();
        }
      }

      await this.setupMessageObserver(hrKey);
    },

    async scrollUserList() {
      const userListContent = document.querySelector(".user-list-content");
      if (userListContent) {
        const totalHeight = userListContent.scrollHeight;
        const clientHeight = userListContent.clientHeight;
        const maxScrollTop = totalHeight - clientHeight;

        if (maxScrollTop <= 0) {
          return;
        }

        const scrollSteps = Math.floor(Math.random() * 3) + 3;

        for (let i = 0; i < scrollSteps; i++) {
          const randomTop = Math.floor(Math.random() * maxScrollTop);

          userListContent.scrollTo({
            top: randomTop,
            behavior: "smooth",
          });

          const randomDelay = Math.floor(Math.random() * 2000) + 1000;
          await this.delay(randomDelay);
        }

        const finalPosition = Math.random() > 0.5 ? maxScrollTop : 0;
        userListContent.scrollTo({
          top: finalPosition,
          behavior: "smooth",
        });
      }
    },

    resetMessageState() {
      this.lastProcessedMessage = null;
      this.processingMessage = false;
    },

    async setupMessageObserver(hrKey) {
      const chatContainer = await this.waitForElement(".chat-message .im-list");
      if (!chatContainer) return;

      this.messageObserver = new MutationObserver(async (mutations) => {
        let hasNewFriendMessage = false;
        for (const mutation of mutations) {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            hasNewFriendMessage = Array.from(mutation.addedNodes).some((node) =>
              node.classList?.contains("item-friend")
            );
            if (hasNewFriendMessage) break;
          }
        }

        if (hasNewFriendMessage) {
          await this.handleNewMessage(hrKey);
        }
      });

      this.messageObserver.observe(chatContainer, {
        childList: true,
        subtree: true,
      });
    },

    async handleNewMessage(hrKey) {
      if (!state.isRunning) return;
      if (this.processingMessage) return;

      this.processingMessage = true;

      try {
        await this.delay(this.operationInterval);

        const lastMessage = await this.getLastFriendMessageText();
        if (!lastMessage) return;

        const cleanedMessage = this.cleanMessage(lastMessage);
        const shouldSendResumeOnly = cleanedMessage.includes("简历");

        if (cleanedMessage === this.lastProcessedMessage) return;

        this.lastProcessedMessage = cleanedMessage;
        this.log(`对方: ${lastMessage}`);

        await this.delay(CONFIG.DELAYS.MEDIUM_SHORT);
        const updatedMessage = await this.getLastFriendMessageText();
        if (
          updatedMessage &&
          this.cleanMessage(updatedMessage) !== cleanedMessage
        ) {
          await this.handleNewMessage(hrKey);
          return;
        }

        const autoSendResume = settings.useAutoSendResume;
        const autoReplyEnabled = settings.autoReply;

        const keywordRepliesEnabled =
          state.settings.keywordReplies &&
          state.settings.keywordReplies.length > 0;

        if (keywordRepliesEnabled) {
          const keywordReplied =
            await HRInteractionManager._handleKeywordReplies(
              hrKey,
              cleanedMessage
            );
          if (keywordReplied) {
            this.log(`关键词回复已发送，跳过后续处理`);
            return;
          }
        }

        if (shouldSendResumeOnly && autoSendResume) {
          this.log('对方提到"简历"，正在发送简历');
          const sent = await HRInteractionManager.sendResume();
          if (sent) {
            state.hrInteractions.sentResumeHRs.add(hrKey);
            StatePersistence.saveState();
            this.log(`已向 ${hrKey} 发送简历`);
          }
        } else if (autoReplyEnabled) {
          await HRInteractionManager.handleHRInteraction(hrKey);
        }

        await this.delay(CONFIG.DELAYS.MEDIUM_SHORT);
        const postReplyMessage = await this.getLastFriendMessageText();
      } catch (error) {
        this.log(`处理消息出错: ${error.message}`);
      } finally {
        this.processingMessage = false;
      }
    },

    cleanMessage(message) {
      if (!message) return "";

      let clean = message.replace(/<[^>]*>/g, "");
      clean = clean
        .trim()
        .replace(/\s+/g, " ")
        .replace(/[\u200B-\u200D\uFEFF]/g, "");
      return clean;
    },

    getLatestChatLi() {
      return document.querySelector(
        'li[role="listitem"][class]:has(.friend-content-warp)'
      );
    },

    getPositionNameFromChat() {
      try {
        const positionNameElement =
          Core.getCachedElement(".position-name", true) ||
          Core.getCachedElement(".job-name", true) ||
          Core.getCachedElement(
            '[class*="position-content"] .left-content .position-name',
            true
          ) ||
          document.querySelector(".position-name") ||
          document.querySelector(".job-name");

        if (positionNameElement) {
          return positionNameElement.textContent.trim();
        } else {
          Core.log("未找到岗位名称元素");
          return "";
        }
      } catch (e) {
        Core.log(`获取岗位名称出错: ${e.message}`);
        return "";
      }
    },

    async aiReply() {
      if (!state.isRunning) return;
      try {
        const autoReplyEnabled = JSON.parse(
          localStorage.getItem("autoReply") || "false"
        );
        if (!autoReplyEnabled) {
          return false;
        }

        const lastMessage = await this.getLastFriendMessageText();
        if (!lastMessage) return false;

        const today = new Date().toISOString().split("T")[0];
        if (state.ai.lastAiDate !== today) {
          state.ai.replyCount = 0;
          state.ai.lastAiDate = today;
          StatePersistence.saveState();
        }

        const maxReplies = state.user.isPremiumUser ? 25 : 10;
        if (state.ai.replyCount >= maxReplies) {
          this.log(`免费版AI回复已达上限`);
          return false;
        }

        const aiReplyText = await this.requestAi(lastMessage);
        if (!aiReplyText) return false;

        this.log(`AI回复: ${aiReplyText.slice(0, 30)}...`);
        state.ai.replyCount++;
        StatePersistence.saveState();

        const inputBox = await this.waitForElement("#chat-input");
        if (!inputBox) return false;

        inputBox.textContent = "";
        inputBox.focus();
        document.execCommand("insertText", false, aiReplyText);
        await this.delay(this.operationInterval / 10);

        const sendButton = document.querySelector(".btn-send");
        if (sendButton) {
          await this.simulateClick(sendButton);
        } else {
          const enterKeyEvent = new KeyboardEvent("keydown", {
            key: "Enter",
            keyCode: 13,
            code: "Enter",
            which: 13,
            bubbles: true,
          });
          inputBox.dispatchEvent(enterKeyEvent);
        }

        return true;
      } catch (error) {
        this.log(`AI回复出错: ${error.message}`);
        return false;
      }
    },

    async requestAi(message) {
      const authToken = (function () {
        const c = [
          0x73, 0x64, 0x56, 0x45, 0x44, 0x41, 0x42, 0x6a, 0x5a, 0x65, 0x49,
          0x6b, 0x77, 0x58, 0x4e, 0x42, 0x46, 0x4e, 0x42, 0x73, 0x3a, 0x43,
          0x71, 0x4d, 0x58, 0x6a, 0x71, 0x65, 0x50, 0x56, 0x43, 0x4a, 0x62,
          0x55, 0x59, 0x4a, 0x50, 0x63, 0x69, 0x70, 0x4a,
        ];
        return c.map((d) => String.fromCharCode(d)).join("");
      })();

      const apiUrl = (function () {
        const e =
          "68747470733a2f2f737061726b2d6170692d6f70656e2e78662d79756e2e636f6d2f76312f636861742f636f6d706c6574696f6e73";
        return e.replace(/../g, (f) => String.fromCharCode(parseInt(f, 16)));
      })();

      const requestBody = {
        model: "lite",
        messages: [
          {
            role: "system",
            content:
              localStorage.getItem("aiRole") ||
              "你是有经验的求职者，你会用口语化的表达（如“行”、“呃”）和语气词（如“啊”、“吗”）使对话自然。你回复对方很肯定且言简意赅，不会发送段落和长句子。",
          },
          { role: "user", content: message },
        ],
        temperature: 0.9,
        top_p: 0.8,
        max_tokens: 512,
      };

      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "POST",
          url: apiUrl,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
          data: JSON.stringify(requestBody),
          onload: (response) => {
            try {
              const result = JSON.parse(response.responseText);
              if (result.code !== 0)
                throw new Error(
                  "API错误: " + result.message + "（Code: " + result.code + "）"
                );
              resolve(result.choices[0].message.content.trim());
            } catch (error) {
              reject(
                new Error(
                  "响应解析失败: " +
                    error.message +
                    "\n原始响应: " +
                    response.responseText
                )
              );
            }
          },
          onerror: (error) => reject(new Error("网络请求失败: " + error)),
        });
      });
    },

    async getLastFriendMessageText() {
      try {
        const chatContainer = document.querySelector(".chat-message .im-list");
        if (!chatContainer) return null;

        const friendMessages = Array.from(
          chatContainer.querySelectorAll("li.message-item.item-friend")
        );
        if (friendMessages.length === 0) return null;

        const lastMessageEl = friendMessages[friendMessages.length - 1];
        const textEl = lastMessageEl.querySelector(".text span");
        return textEl?.textContent?.trim() || null;
      } catch (error) {
        this.log(`获取消息出错: ${error.message}`);
        return null;
      }
    },

    async simulateClick(element) {
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const dispatchMouseEvent = (type, options = {}) => {
        const event = new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          view: document.defaultView,
          clientX: x,
          clientY: y,
          ...options,
        });
        element.dispatchEvent(event);
      };

      dispatchMouseEvent("mouseover");
      await this.delay(CONFIG.DELAYS.SHORT);
      dispatchMouseEvent("mousemove");
      await this.delay(CONFIG.DELAYS.SHORT);
      dispatchMouseEvent("mousedown", { button: 0 });
      await this.delay(CONFIG.DELAYS.SHORT);
      dispatchMouseEvent("mouseup", { button: 0 });
      await this.delay(CONFIG.DELAYS.SHORT);
      dispatchMouseEvent("click", { button: 0 });
    },

    async waitForElement(selectorOrFunction, timeout = 5000) {
      return new Promise((resolve) => {
        let element;
        if (typeof selectorOrFunction === "function")
          element = selectorOrFunction();
        else element = document.querySelector(selectorOrFunction);

        if (element) return resolve(element);

        const timeoutId = setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, timeout);
        const observer = new MutationObserver(() => {
          if (typeof selectorOrFunction === "function")
            element = selectorOrFunction();
          else element = document.querySelector(selectorOrFunction);
          if (element) {
            clearTimeout(timeoutId);
            observer.disconnect();
            resolve(element);
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      });
    },

    getContextMultiplier(context) {
      const multipliers = {
        dict_load: 1.0,
        click: 0.8,
        selection: 0.8,
        default: 1.0,
      };
      return multipliers[context] || multipliers["default"];
    },

    async smartDelay(baseTime, context = "default") {
      const multiplier = this.getContextMultiplier(context);
      const adjustedTime = baseTime * multiplier;
      return this.delay(adjustedTime);
    },

    async delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    extractTwoCharKeywords(text) {
      const keywords = [];
      const cleanedText = text.replace(/[\s,，.。:：;；""''\[\]\(\)\{\}]/g, "");

      for (let i = 0; i < cleanedText.length - 1; i++) {
        keywords.push(cleanedText.substring(i, i + 2));
      }

      return keywords;
    },

    resetCycle() {
      toggleProcess();
      this.log("所有岗位沟通完成，恭喜您即将找到理想工作！");
      state.currentIndex = 0;
      state.operation.lastMessageTime = 0;
    },

    log(message) {
      const logEntry = `[${new Date().toLocaleTimeString()}] ${message}`;
      const logPanel = document.querySelector("#pro-log");
      if (logPanel) {
        const logItem = document.createElement("div");
        logItem.className = "log-item";
        logItem.textContent = logEntry;
        logPanel.appendChild(logItem);
        logPanel.scrollTop = logPanel.scrollHeight;
      }
    },
  };

  function toggleProcess() {
    state.isRunning = !state.isRunning;

    if (state.isRunning) {
      state.includeKeywords = elements.includeInput.value
        .trim()
        .toLowerCase()
        .split(",")
        .filter((keyword) => keyword.trim() !== "");
      state.locationKeywords = (elements.locationInput?.value || "")
        .trim()
        .toLowerCase()
        .split(",")
        .filter((keyword) => keyword.trim() !== "");

      elements.controlBtn.textContent = "停止海投";
      elements.controlBtn.style.background = "#4285f4";

      const startTime = new Date();
      Core.log(`开始自动海投，时间：${startTime.toLocaleTimeString()}`);
      Core.log(
        `筛选条件：职位名包含【${
          state.includeKeywords.join("、") || "无"
        }】，工作地包含【${state.locationKeywords.join("、") || "无"}】`
      );

      Core.startProcessing();
    } else {
      elements.controlBtn.textContent = "启动海投";
      elements.controlBtn.style.background = "#4285f4";

      state.isRunning = false;

      const stopTime = new Date();
      Core.log(`停止自动海投，时间：${stopTime.toLocaleTimeString()}`);
      Core.log(`本次共沟通 ${state.currentIndex} 个岗位`);

      state.currentIndex = 0;
    }
  }

  function toggleChatProcess() {
    state.isRunning = !state.isRunning;

    if (state.isRunning) {
      elements.controlBtn.textContent = "停止智能聊天";
      elements.controlBtn.style.background = "#4285f4";

      const startTime = new Date();
      Core.log(`开始智能聊天，时间：${startTime.toLocaleTimeString()}`);

      Core.startProcessing();
    } else {
      elements.controlBtn.textContent = "开始智能聊天";
      elements.controlBtn.style.background = "#4285f4";

      state.isRunning = false;

      if (Core.messageObserver) {
        Core.messageObserver.disconnect();
        Core.messageObserver = null;
      }

      const stopTime = new Date();
      Core.log(`停止智能聊天，时间：${stopTime.toLocaleTimeString()}`);
    }
  }

  const letter = {
    showLetterToUser: function () {
      const COLORS = {
        primary: "#4285f4",
        text: "#333",
        textLight: "#666",
        background: "#f8f9fa",
      };

      const overlay = document.createElement("div");
      overlay.id = "letter-overlay";
      overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
            animation: fadeIn 0.3s ease-out;
        `;

      const envelopeContainer = document.createElement("div");
      envelopeContainer.id = "envelope-container";
      envelopeContainer.style.cssText = `
            position: relative;
            width: 90%;
            max-width: 650px;
            height: 400px;
            perspective: 1000px;
        `;

      const envelope = document.createElement("div");
      envelope.id = "envelope";
      envelope.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transition: transform 0.6s ease;
        `;

      const envelopeBack = document.createElement("div");
      envelopeBack.id = "envelope-back";
      envelopeBack.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            background: ${COLORS.background};
            border-radius: 10px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            backface-visibility: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 30px;
            cursor: pointer;
            transition: all 0.3s;
        `;
      envelopeBack.innerHTML = `
            <div style="font-size:clamp(1.5rem, 3vw, 1.8rem);font-weight:600;color:${COLORS.primary};margin-bottom:10px;">
                <i class="fa fa-envelope-o mr-2"></i>致海投用户的一封信
            </div>
            <div style="font-size:clamp(1rem, 2vw, 1.1rem);color:${COLORS.textLight};text-align:center;">
                点击开启高效求职之旅
            </div>
            <div style="position:absolute;bottom:20px;font-size:0.85rem;color:#999;">
                © 2025 BOSS海投助手 | Yangshengzhou 版权所有
            </div>
        `;

      envelopeBack.addEventListener("click", () => {
        envelope.style.transform = "rotateY(180deg)";
        setTimeout(() => {
          const content = document.getElementById("letter-content");
          if (content) {
            content.style.display = "block";
            content.style.animation = "fadeInUp 0.5s ease-out forwards";
          }
        }, 300);
      });

      const envelopeFront = document.createElement("div");
      envelopeFront.id = "envelope-front";
      envelopeFront.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            transform: rotateY(180deg);
            backface-visibility: hidden;
            display: flex;
            flex-direction: column;
        `;

      const titleBar = document.createElement("div");
      titleBar.style.cssText = `
            padding: 20px 30px;
            background: #4285f4;
            color: white;
            font-size: clamp(1.2rem, 2.5vw, 1.4rem);
            font-weight: 600;
            border-radius: 10px 10px 0 0;
            display: flex;
            align-items: center;
        `;
      titleBar.innerHTML = `<i class="fa fa-envelope-open-o mr-2"></i>致海投助手用户：`;

      const letterContent = document.createElement("div");
      letterContent.id = "letter-content";
      letterContent.style.cssText = `
            flex: 1;
            padding: 25px 30px;
            overflow-y: auto;
            font-size: clamp(0.95rem, 2vw, 1.05rem);
            line-height: 1.8;
            color: ${COLORS.text};

            background-blend-mode: overlay;
            background-color: rgba(255,255,255,0.95);
            display: none;
        `;
      letterContent.innerHTML = `
            <div style="margin-bottom:20px;">
                <p>你好，未来的成功人士：</p>
                <p class="mt-2">&emsp;&emsp;展信如晤。</p>
                <p class="mt-3">
                    &emsp;&emsp;我是Yangshengzhou，我曾经和你一样在求职路上反复碰壁。
                    简历石沉大海、面试邀约寥寥、沟通效率低下...于是我做了这个小工具。
                </p>
                <p class="mt-3">
                    &emsp;&emsp;现在，我将它分享给你，希望能够帮到你：
                </p>
                <ul class="mt-3 ml-6 list-disc" style="text-indent:0;">
                    <li><strong>&emsp;&emsp;自动沟通页面岗位</strong>，一键打招呼</li>
                    <li><strong>&emsp;&emsp;AI智能回复HR提问</strong>，24小时在线不错过任何机会</li>
                    <li><strong>&emsp;&emsp;个性化沟通策略</strong>，大幅提升面试邀约率</li>
                </ul>
                <p class="mt-3">
                    &emsp;&emsp;工具只是辅助，你的能力才是核心竞争力。
                    愿它成为你求职路上的得力助手，助你斩获Offer！
                </p>
                <p class="mt-2">
                    &emsp;&emsp;冀以尘雾之微补益山海，荧烛末光增辉日月。
                </p>
                <p class="mt-2">
                    &emsp;&emsp;如果插件对你有帮助，请给她点个 Star!
                </p>
            </div>
            <div style="text-align:right;font-style:italic;color:${COLORS.textLight};text-indent:0;">
                Yangshengzhou<br>
                2025年6月于南昌
            </div>
        `;

      const buttonArea = document.createElement("div");
      buttonArea.style.cssText = `
            padding: 15px 30px;
            display: flex;
            justify-content: center;
            border-top: 1px solid #eee;
            background: ${COLORS.background};
            border-radius: 0 0 10px 10px;
        `;

      const startButton = document.createElement("button");
      startButton.style.cssText = `
            background: #4285f4;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 30px;
            font-size: clamp(1rem, 2vw, 1.1rem);
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 6px 16px rgba(66, 133, 244, 0.3);
            outline: none;
            display: flex;
            align-items: center;
        `;
      startButton.innerHTML = `<i class="fa fa-rocket mr-2"></i>开始使用`;

      startButton.addEventListener("click", () => {
        envelopeContainer.style.animation = "scaleOut 0.3s ease-in forwards";
        overlay.style.animation = "fadeOut 0.3s ease-in forwards";
        setTimeout(() => {
          if (overlay.parentNode === document.body) {
            document.body.removeChild(overlay);
          }
        }, 300);
      });

      buttonArea.appendChild(startButton);
      envelopeFront.appendChild(titleBar);
      envelopeFront.appendChild(letterContent);
      envelopeFront.appendChild(buttonArea);
      envelope.appendChild(envelopeBack);
      envelope.appendChild(envelopeFront);
      envelopeContainer.appendChild(envelope);
      overlay.appendChild(envelopeContainer);
      document.body.appendChild(overlay);

      const style = document.createElement("style");
      style.textContent = `
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
            @keyframes scaleOut { from { transform: scale(1); opacity: 1 } to { transform: scale(.9); opacity: 0 } }
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }

            #envelope-back:hover { transform: scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.25); }
            #envelope-front button:hover { transform: scale(1.05); box-shadow: 0 8px 20px rgba(66, 133, 244, 0.4); }
            #envelope-front button:active { transform: scale(0.98); }
            
            @media (max-width: 480px) {
                #envelope-container { height: 350px; }
                #letter-content { font-size: 0.9rem; padding: 15px; }
            }
        `;
      document.head.appendChild(style);
    },
  };

  const guide = {
    steps: [
      {
        target: "div.city-label.active",
        content:
          '海投前，先在BOSS<span class="highlight">筛选出岗位</span>！\n\n助手会先滚动收集界面上显示的岗位，\n随后依次进行沟通~',

        arrowPosition: "bottom",
        defaultPosition: {
          left: "50%",
          top: "20%",
          transform: "translateX(-50%)",
        },
      },
      {
        target: 'a[ka="header-jobs"]',
        content:
          '<span class="highlight">职位页操作流程</span>：\n\n1. 扫描职位卡片\n2. 点击"立即沟通"（需开启"自动打招呼"）\n3. 留在当前页，继续沟通下一个职位\n\n全程无需手动干预，高效投递！',

        arrowPosition: "bottom",
        defaultPosition: { left: "25%", top: "80px" },
      },
      {
        target: 'a[ka="header-message"]',
        content:
          '<span class="highlight">海投建议</span>！\n\n• HR与您沟通，HR需要付费给平台\n因此您尽可能先自我介绍以提高效率 \n\n• HR查看附件简历，HR也要付费给平台\n所以尽量先发送`图片简历`给HR',

        arrowPosition: "left",
        defaultPosition: { right: "150px", top: "100px" },
      },
      {
        target: "div.logo",
        content:
          '<span class="highlight">您需要打开两个浏览器窗口</span>：\n\n左侧窗口自动打招呼发起沟通\n右侧发送自我介绍和图片简历\n\n您只需专注于挑选offer！',

        arrowPosition: "right",
        defaultPosition: { left: "200px", top: "20px" },
      },
      {
        target: "div.logo",
        content:
          '<span class="highlight">特别注意</span>：\n\n1. <span class="warning">BOSS直聘每日打招呼上限为150次</span>\n2. 聊天页仅处理最上方的最新对话\n3. 打招呼后对方会显示在聊天页\n4. <span class="warning">投递操作过于频繁有封号风险!</span>',

        arrowPosition: "bottom",
        defaultPosition: { left: "50px", top: "80px" },
      },
    ],
    currentStep: 0,
    guideElement: null,
    overlay: null,
    highlightElements: [],

    showGuideToUser() {
      this.overlay = document.createElement("div");
      this.overlay.id = "guide-overlay";
      this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
            z-index: 99997;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
      document.body.appendChild(this.overlay);

      this.guideElement = document.createElement("div");
      this.guideElement.id = "guide-tooltip";
      this.guideElement.style.cssText = `
            position: fixed;
            z-index: 99999;
            width: 320px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;
      document.body.appendChild(this.guideElement);

      setTimeout(() => {
        this.overlay.style.opacity = "1";

        setTimeout(() => {
          this.showStep(0);
        }, 300);
      }, 100);
    },

    showStep(stepIndex) {
      const step = this.steps[stepIndex];
      if (!step) return;

      this.clearHighlights();
      const target = document.querySelector(step.target);

      if (target) {
        const rect = target.getBoundingClientRect();
        const highlight = document.createElement("div");
        highlight.className = "guide-highlight";
        highlight.style.cssText = `
                position: fixed;
                top: ${rect.top}px;
                left: ${rect.left}px;
                width: ${rect.width}px;
                height: ${rect.height}px;
                background: ${step.highlightColor || "#4285f4"};
                opacity: 0.2;
                border-radius: 4px;
                z-index: 99998;
                box-shadow: 0 0 0 4px ${step.highlightColor || "#4285f4"};
                animation: guide-pulse 2s infinite;
            `;
        document.body.appendChild(highlight);
        this.highlightElements.push(highlight);

        this.setGuidePositionFromTarget(step, rect);
      } else {
        console.warn("引导目标元素未找到，使用默认位置:", step.target);

        this.setGuidePositionFromDefault(step);
      }

      let buttonsHtml = "";

      if (stepIndex === this.steps.length - 1) {
        buttonsHtml = `
                <div class="guide-buttons" style="display: flex; justify-content: center; padding: 16px; border-top: 1px solid #f0f0f0; background: #f9fafb;">
                    <button id="guide-finish-btn" style="padding: 8px 32px; background: ${
                      step.highlightColor || "#4285f4"
                    }; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);">
                        完成
                    </button>
                </div>
            `;
      } else {
        buttonsHtml = `
                <div class="guide-buttons" style="display: flex; justify-content: flex-end; padding: 16px; border-top: 1px solid #f0f0f0; background: #f9fafb;">
                    <button id="guide-skip-btn" style="padding: 8px 16px; background: white; color: #4b5563; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease;">跳过</button>
                    <button id="guide-next-btn" style="padding: 8px 16px; background: ${
                      step.highlightColor || "#4285f4"
                    }; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; margin-left: 8px; transition: all 0.2s ease; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);">下一步</button>
                </div>
            `;
      }

      this.guideElement.innerHTML = `
            <div class="guide-header" style="padding: 16px; background: ${
              step.highlightColor || "#4285f4"
            }; color: white;">
                <div class="guide-title" style="font-size: 16px; font-weight: 600;">海投助手引导</div>
                <div class="guide-step" style="font-size: 12px; opacity: 0.8; margin-top: 2px;">步骤 ${
                  stepIndex + 1
                }/${this.steps.length}</div>
            </div>
            <div class="guide-content" style="padding: 20px; font-size: 14px; line-height: 1.6;">
                <div style="white-space: pre-wrap; font-family: inherit; margin: 0;">${
                  step.content
                }</div>
            </div>
            ${buttonsHtml}
        `;

      if (stepIndex === this.steps.length - 1) {
        document
          .getElementById("guide-finish-btn")
          .addEventListener("click", () => this.endGuide(true));
      } else {
        document
          .getElementById("guide-next-btn")
          .addEventListener("click", () => this.nextStep());
        document
          .getElementById("guide-skip-btn")
          .addEventListener("click", () => this.endGuide());
      }

      if (stepIndex === this.steps.length - 1) {
        const finishBtn = document.getElementById("guide-finish-btn");
        finishBtn.addEventListener("mouseenter", () => {
          finishBtn.style.background = this.darkenColor(
            step.highlightColor || "#4285f4",
            15
          );
          finishBtn.style.boxShadow =
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
        });
        finishBtn.addEventListener("mouseleave", () => {
          finishBtn.style.background = step.highlightColor || "#4285f4";
          finishBtn.style.boxShadow =
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)";
        });
      } else {
        const nextBtn = document.getElementById("guide-next-btn");
        const skipBtn = document.getElementById("guide-skip-btn");

        nextBtn.addEventListener("mouseenter", () => {
          nextBtn.style.background = this.darkenColor(
            step.highlightColor || "#4285f4",
            15
          );
          nextBtn.style.boxShadow =
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
        });
        nextBtn.addEventListener("mouseleave", () => {
          nextBtn.style.background = step.highlightColor || "#4285f4";
          nextBtn.style.boxShadow =
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)";
        });

        skipBtn.addEventListener("mouseenter", () => {
          skipBtn.style.background = "#f3f4f6";
        });
        skipBtn.addEventListener("mouseleave", () => {
          skipBtn.style.background = "white";
        });
      }

      this.guideElement.style.opacity = "1";
      this.guideElement.style.transform = "translateY(0)";
    },

    setGuidePositionFromTarget(step, rect) {
      let left, top;
      const guideWidth = 320;
      const guideHeight = 240;

      switch (step.arrowPosition) {
        case "top":
          left = rect.left + rect.width / 2 - guideWidth / 2;
          top = rect.top - guideHeight - 20;
          break;
        case "bottom":
          left = rect.left + rect.width / 2 - guideWidth / 2;
          top = rect.bottom + 20;
          break;
        case "left":
          left = rect.left - guideWidth - 20;
          top = rect.top + rect.height / 2 - guideHeight / 2;
          break;
        case "right":
          left = rect.right + 20;
          top = rect.top + rect.height / 2 - guideHeight / 2;
          break;
        default:
          left = rect.right + 20;
          top = rect.top;
      }

      left = Math.max(10, Math.min(left, window.innerWidth - guideWidth - 10));
      top = Math.max(10, Math.min(top, window.innerHeight - guideHeight - 10));

      this.guideElement.style.left = `${left}px`;
      this.guideElement.style.top = `${top}px`;
      this.guideElement.style.transform = "translateY(0)";
    },

    setGuidePositionFromDefault(step) {
      const position = step.defaultPosition || {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      };

      Object.assign(this.guideElement.style, {
        left: position.left,
        top: position.top,
        right: position.right || "auto",
        bottom: position.bottom || "auto",
        transform: position.transform || "none",
      });
    },

    nextStep() {
      const currentStep = this.steps[this.currentStep];
      if (currentStep) {
        const target = document.querySelector(currentStep.target);
        if (target) {
          target.removeEventListener("click", this.nextStep);
        }
      }

      this.currentStep++;
      if (this.currentStep < this.steps.length) {
        this.guideElement.style.opacity = "0";
        this.guideElement.style.transform = "translateY(10px)";

        setTimeout(() => {
          this.showStep(this.currentStep);
        }, 300);
      } else {
      }
    },

    clearHighlights() {
      this.highlightElements.forEach((el) => el.remove());
      this.highlightElements = [];
    },

    endGuide(isCompleted = false) {
      this.clearHighlights();

      this.guideElement.style.opacity = "0";
      this.guideElement.style.transform = "translateY(10px)";
      this.overlay.style.opacity = "0";

      setTimeout(() => {
        if (this.overlay && this.overlay.parentNode) {
          this.overlay.parentNode.removeChild(this.overlay);
        }
        if (this.guideElement && this.guideElement.parentNode) {
          this.guideElement.parentNode.removeChild(this.guideElement);
        }

        if (isCompleted && this.chatUrl) {
          window.open(this.chatUrl, "_blank");
        }
      }, 300);

      document.dispatchEvent(new Event("guideEnd"));
    },

    darkenColor(color, percent) {
      let R = parseInt(color.substring(1, 3), 16);
      let G = parseInt(color.substring(3, 5), 16);
      let B = parseInt(color.substring(5, 7), 16);

      R = parseInt((R * (100 - percent)) / 100);
      G = parseInt((G * (100 - percent)) / 100);
      B = parseInt((B * (100 - percent)) / 100);

      R = R < 255 ? R : 255;
      G = G < 255 ? G : 255;
      B = B < 255 ? B : 255;

      R = Math.round(R);
      G = Math.round(G);
      B = Math.round(B);

      const RR =
        R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
      const GG =
        G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
      const BB =
        B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);

      return `#${RR}${GG}${BB}`;
    },
  };

  const style = document.createElement("style");
  style.textContent = `
    @keyframes guide-pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.4); }
        70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(66, 133, 244, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(66, 133, 244, 0); }
    }
    
    .guide-content .highlight {
        font-weight: 700;
        color: #1a73e8;
    }
    
    .guide-content .warning {
        font-weight: 700;
        color: #d93025;
    }
`;
  document.head.appendChild(style);

  const STORAGE = {
    LETTER: "letterLastShown",
    GUIDE: "shouldShowGuide",
    AI_COUNT: "aiReplyCount",
    AI_DATE: "lastAiDate",
  };

  function getToday() {
    return new Date().toISOString().split("T")[0];
  }

  function init() {
    try {
      ActivationManager.checkActivationStatus();

      const midnight = new Date();
      midnight.setDate(midnight.getDate() + 1);
      midnight.setHours(0, 0, 0, 0);
      setTimeout(() => {
        localStorage.removeItem(STORAGE.AI_COUNT);
        localStorage.removeItem(STORAGE.AI_DATE);
        localStorage.removeItem(STORAGE.LETTER);
      }, midnight - Date.now());
      UI.init();
      document.body.style.position = "relative";
      const today = getToday();
      if (location.pathname.includes("/jobs")) {
        if (localStorage.getItem(STORAGE.LETTER) !== today) {
          letter.showLetterToUser();
          localStorage.setItem(STORAGE.LETTER, today);
        } else if (localStorage.getItem(STORAGE.GUIDE) !== "true") {
          guide.showGuideToUser();
          localStorage.setItem(STORAGE.GUIDE, "true");
          Core.delay(800);
          window.open(
            "https://www.zhipin.com/web/geek/notify-set?ka=notify-set",
            "_blank"
          );
        }
        Core.log("欢迎使用海投助手，我将自动投递岗位！");
      } else if (location.pathname.includes("/chat")) {
        Core.log("欢迎使用海投助手，我将自动发送简历！");
      } else if (location.pathname.includes("/notify-set")) {
        Core.log("请将常用语换为自我介绍来引起HR的注意！");

        const targetSelector = "h3.normal.title";

        const observer = new MutationObserver((mutations, obs) => {
          const targetElement = document.querySelector(targetSelector);
          if (targetElement) {
            targetElement.textContent =
              "把常用语换为自我介绍，并设图片简历; 招呼语功能必须启用。";
            obs.disconnect();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      } else {
        Core.log("当前页面暂不支持，请移步至职位页面！");
      }
    } catch (error) {
      console.error("初始化失败:", error);
      if (UI.notify) UI.notify("初始化失败", "error");
    }
  }

  window.addEventListener("load", init);

  function addKeywordReplyRule() {
    if (!state.settings.keywordReplies) {
      state.settings.keywordReplies = [];
    }

    const hasEmptyRule = state.settings.keywordReplies.some(
      (rule) => !rule.keyword.trim() && !rule.reply.trim()
    );

    if (hasEmptyRule) {
      return;
    }

    const newRule = {
      id: Date.now().toString(),
      keyword: "",
      reply: "",
    };

    state.settings.keywordReplies.push(newRule);
    StatePersistence.saveState();
    renderKeywordRepliesList();
  }

  function renderKeywordRepliesList() {
    const keywordRepliesList = document.getElementById("keyword-replies-list");
    if (!keywordRepliesList) return;

    keywordRepliesList.innerHTML = "";

    if (
      !state.settings.keywordReplies ||
      state.settings.keywordReplies.length === 0
    ) {
      keywordRepliesList.innerHTML =
        '<div style="color: #6b7280; text-align: center; padding: 20px;">暂无关键词回复规则</div>';
      return;
    }

    state.settings.keywordReplies.forEach((rule, index) => {
      const ruleElement = document.createElement("div");
      ruleElement.className = "keyword-rule-item";
      ruleElement.style.cssText = `
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 6px;
        margin-bottom: 6px;
        background: #f9fafb;
      `;

      ruleElement.innerHTML = `
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="delete-rule-btn" data-id="${rule.id}" style="
            padding: 3px 6px;
            border: 1px solid #ef4444;
            background: #fef2f2;
            color: #dc2626;
            border-radius: 3px;
            font-size: 11px;
            cursor: pointer;
            white-space: nowrap;
          ">删除</button>
          <div style="flex: 1;">
            <input type="text" class="keyword-input" data-id="${rule.id}" value="${rule.keyword}" placeholder="关键词" style="
              width: 100%;
              padding: 4px 6px;
              border: 1px solid #d1d5db;
              border-radius: 3px;
              font-size: 13px;
            ">
          </div>
          <div style="flex: 2;">
            <input type="text" class="reply-input" data-id="${rule.id}" value="${rule.reply}" placeholder="回复内容" style="
              width: 100%;
              padding: 4px 6px;
              border: 1px solid #d1d5db;
              border-radius: 3px;
              font-size: 13px;
            ">
          </div>
        </div>
      `;

      keywordRepliesList.appendChild(ruleElement);
    });

    attachKeywordRuleEventListeners();
  }

  function attachKeywordRuleEventListeners() {
    document.querySelectorAll(".delete-rule-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const ruleId = e.target.dataset.id;
        state.settings.keywordReplies = state.settings.keywordReplies.filter(
          (r) => r.id !== ruleId
        );
        StatePersistence.saveState();
        renderKeywordRepliesList();
      });
    });

    document.querySelectorAll(".keyword-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        const ruleId = e.target.dataset.id;
        const rule = state.settings.keywordReplies.find((r) => r.id === ruleId);
        if (rule) {
          rule.keyword = e.target.value;
          StatePersistence.saveState();
        }
      });
    });

    document.querySelectorAll(".reply-input").forEach((textarea) => {
      textarea.addEventListener("input", (e) => {
        const ruleId = e.target.dataset.id;
        const rule = state.settings.keywordReplies.find((r) => r.id === ruleId);
        if (rule) {
          rule.reply = e.target.value;
          StatePersistence.saveState();
        }
      });
    });
  }

  function loadKeywordReplies() {
    if (!state.settings.keywordReplies) {
      state.settings.keywordReplies = [];
    }
    renderKeywordRepliesList();
  }

  function loadSettingsIntoUI() {
    const aiRoleInput = document.getElementById("ai-role-input");
    if (aiRoleInput) {
      aiRoleInput.value = settings.ai.role;
    }

    const autoReplyInput = document.querySelector(
      "#toggle-auto-reply-mode input"
    );
    if (autoReplyInput) {
      autoReplyInput.checked = settings.autoReply;
    }

    const autoSendResumeInput = document.querySelector(
      "#toggle-auto-send-resume input"
    );
    if (autoSendResumeInput) {
      autoSendResumeInput.checked = settings.useAutoSendResume;
    }

    const excludeHeadhuntersInput = document.querySelector(
      "#toggle-exclude-headhunters input"
    );
    if (excludeHeadhuntersInput) {
      excludeHeadhuntersInput.checked = settings.excludeHeadhunters;
    }

    const autoSendImageResumeInput = document.querySelector(
      "#toggle-auto-send-image-resume input"
    );
    if (autoSendImageResumeInput) {
      autoSendImageResumeInput.checked = settings.useAutoSendImageResume;
    }

    const basicIntervalInput = document.getElementById("basic-interval-input");
    if (basicIntervalInput) {
      basicIntervalInput.value = settings.intervals.basic;
    }

    const operationIntervalInput = document.getElementById(
      "operation-interval-input"
    );
    if (operationIntervalInput) {
      operationIntervalInput.value = settings.intervals.operation;
    }

    const scrollSpeedInput = document.getElementById("scroll-speed-input");
    if (scrollSpeedInput) {
      scrollSpeedInput.value = settings.autoScrollSpeed;
    }

    loadKeywordReplies();
  }
})();
