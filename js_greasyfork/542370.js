// ==UserScript==
// @name         巴哈抽獎優化
// @namespace    Bee10301
// @version      20250808
// @description  巴哈抽獎主頁腳本
// @author       Bee10301
// @license      GPL
// @match        https://fuli.gamer.com.tw/shop.ph*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542370/%E5%B7%B4%E5%93%88%E6%8A%BD%E7%8D%8E%E5%84%AA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/542370/%E5%B7%B4%E5%93%88%E6%8A%BD%E7%8D%8E%E5%84%AA%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  // 配置常數
  const CONFIG = {
    STORAGE_KEYS: {
      SCRIPT_STATUS: "baha_script_status",
      ITEM_LIST: "baha_item_list",
      PARTICIPATION_HISTORY: "baha_participation_history",
      BLACKLIST: "baha_blacklist",
    },
    SELECTORS: {
      SIDEBAR: "#BH-slave",
      ITEMS_CARD: ".items-card",
      TYPE_TAG: ".type-tag",
      ITEMS_TITLE: ".card-right",
      ACTIVITY_TIME: ".items-instructions p span",
    },
  };

  // 本地存儲管理模組
  const StorageManager = {
    get(key) {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (e) {
        console.error("讀取本地存儲失敗:", e);
        return null;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error("寫入本地存儲失敗:", e);
        return false;
      }
    },
  };

  // UI 控制模組
  const UIManager = {
    createControlPanel() {
      const sidebar = document.querySelector(CONFIG.SELECTORS.SIDEBAR);
      if (!sidebar) return;

      // 找到勇者持有巴幣的區塊
      const braveAssetsBox = sidebar.querySelector(".BH-rbox");
      if (!braveAssetsBox) return;

      // 創建腳本控制面板
      const controlPanel = document.createElement("div");
      controlPanel.innerHTML = `
              <h5 class="m-hidden">腳本控制</h5>
              <div class="BH-rbox BH-qabox1 m-hidden" id="script-control-box">
                  <div class="items-instructions direction-column">
                      <button type="button" class="script-control-btn" id="scriptToggleBtn">
                          載入中...
                      </button>
                      <p class="card-instructions">狀態：<span id="script-status">檢查中...</span></p>
                      <p class="card-instructions">找到：<span id="item-count">0</span> 個抽抽樂</p>
                  </div>
              </div>
          `;

      // 添加樣式
      const style = document.createElement("style");
      style.textContent = `
              .script-control-btn {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  border: none;
                  border-radius: 6px;
                  padding: 10px 20px;
                  font-size: 14px;
                  font-weight: bold;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  margin-bottom: 8px;
                  width: 100%;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .script-control-btn:hover {
                  transform: translateY(-1px);
                  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
              }
              .script-control-btn.running {
                  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
              }
              .script-control-btn.stopped {
                  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
              }
              .script-control-img {
                  margin-bottom: 10px;
              }
              .script-control-img img {
                  width: 80px;
                  height: 80px;
                  border-radius: 8px;
              }
              #script-status {
                  color: #666;
                  font-weight: bold;
              }
              #item-count {
                  color: #007bff;
                  font-weight: bold;
              }
          `;
      document.head.appendChild(style);

      // 插入到勇者持有巴幣後面
      braveAssetsBox.parentNode.insertBefore(
        controlPanel,
        braveAssetsBox.nextSibling
      );
      return controlPanel;
    },

    updateToggleButton(isRunning) {
      const btn = document.getElementById("scriptToggleBtn");
      const status = document.getElementById("script-status");
      if (!btn || !status) return;

      if (isRunning) {
        btn.textContent = "停止腳本";
        btn.className = "script-control-btn running";
        status.textContent = "運行中 ✨";
        status.style.color = "#28a745";
      } else {
        btn.textContent = "開始腳本";
        btn.className = "script-control-btn stopped";
        status.textContent = "已停止 💤";
        status.style.color = "#dc3545";
      }
    },

    updateItemCount(count) {
      const countElement = document.getElementById("item-count");
      if (countElement) {
        countElement.textContent = count;
      }
    },

    bindToggleEvent(callback) {
      const btn = document.getElementById("scriptToggleBtn");
      if (btn) {
        btn.addEventListener("click", callback);
      }
    },

    // 新增黑名單按鈕功能
    addBlacklistButton() {
      // 🧹 清理黑名單：移除不在當前網頁商品清單中的項目
      this.cleanupBlacklist();

      const itemCards = document.querySelectorAll(".items-card");

      itemCards.forEach((card) => {
        const typeTag = card.querySelector(".type-tag");
        // 只對抽抽樂和競標商品新增黑名單按鈕
        if (
          typeTag &&
          (typeTag.textContent.trim() === "抽抽樂" ||
            typeTag.textContent.trim() === "競標")
        ) {
          // 檢查是否已經新增過黑名單按鈕
          if (card.querySelector(".blacklist-btn")) return;

          const titleElement = card.querySelector(".items-title");
          const itemName = titleElement ? titleElement.textContent.trim() : "";

          if (!itemName) return;

          // 檢查商品是否已在黑名單中
          const blacklist =
            StorageManager.get(CONFIG.STORAGE_KEYS.BLACKLIST) || [];
          const isBlacklisted = blacklist.includes(itemName);

          // 找到參加抽獎/我要競標按鈕
          const participateBtn = card.querySelector(".card-btn");
          if (!participateBtn) return;

          // 創建按鈕容器
          const buttonContainer = document.createElement("div");
          buttonContainer.style.cssText = `
            display: flex;
            gap: 8px;
            margin-top: 8px;
          `;

          // 創建黑名單按鈕
          const blacklistBtn = document.createElement("div");
          blacklistBtn.className = `blacklist-btn flex-center ${
            isBlacklisted ? "blacklisted" : ""
          }`;
          blacklistBtn.textContent = isBlacklisted ? "已永不參加" : "永不參加";
          blacklistBtn.style.cssText = `
            background: ${isBlacklisted ? "#6c757d" : "#dc3545"};
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 80px;
            text-align: center;
            flex: 0 0 auto;
          `;

          // 新增點擊事件
          blacklistBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleBlacklist(itemName, blacklistBtn);
          });

          // 將原本的參加抽獎按鈕移到容器中
          const originalParent = participateBtn.parentNode;
          originalParent.removeChild(participateBtn);

          // 調整參加抽獎按鈕樣式
          participateBtn.style.flex = "1";

          // 將按鈕加入容器
          buttonContainer.appendChild(blacklistBtn);
          buttonContainer.appendChild(participateBtn);

          // 將容器插入到原位置
          originalParent.appendChild(buttonContainer);
        }
      });
    },

    // 切換黑名單狀態
    toggleBlacklist(itemName, buttonElement) {
      const blacklist = StorageManager.get(CONFIG.STORAGE_KEYS.BLACKLIST) || [];
      const isCurrentlyBlacklisted = blacklist.includes(itemName);

      if (isCurrentlyBlacklisted) {
        // 從黑名單中移除
        const updatedBlacklist = blacklist.filter((name) => name !== itemName);
        StorageManager.set(CONFIG.STORAGE_KEYS.BLACKLIST, updatedBlacklist);

        buttonElement.textContent = "永不參加";
        buttonElement.style.background = "#dc3545";
        buttonElement.classList.remove("blacklisted");

        console.log(`✅ 已將 "${itemName}" 從黑名單中移除`);
      } else {
        // 加入黑名單
        blacklist.push(itemName);
        StorageManager.set(CONFIG.STORAGE_KEYS.BLACKLIST, blacklist);

        buttonElement.textContent = "已永不參加";
        buttonElement.style.background = "#6c757d";
        buttonElement.classList.add("blacklisted");

        console.log(`🚫 已將 "${itemName}" 加入黑名單`);
      }
    },

    // 清理黑名單：移除不在當前網頁商品清單中的項目
    cleanupBlacklist() {
      const blacklist = StorageManager.get(CONFIG.STORAGE_KEYS.BLACKLIST) || [];

      if (blacklist.length === 0) {
        return; // 黑名單為空，無需清理
      }

      // 獲取當前網頁上所有的商品名稱
      const currentItemNames = new Set();
      const itemCards = document.querySelectorAll(".items-card");

      itemCards.forEach((card) => {
        const typeTag = card.querySelector(".type-tag");
        // 只檢查抽抽樂和競標商品
        if (
          typeTag &&
          (typeTag.textContent.trim() === "抽抽樂" ||
            typeTag.textContent.trim() === "競標")
        ) {
          const titleElement = card.querySelector(".items-title");
          const itemName = titleElement ? titleElement.textContent.trim() : "";
          if (itemName) {
            currentItemNames.add(itemName);
          }
        }
      });

      // 過濾黑名單，只保留仍存在於當前網頁的商品
      const originalBlacklistLength = blacklist.length;
      const cleanedBlacklist = blacklist.filter((itemName) =>
        currentItemNames.has(itemName)
      );

      // 如果有項目被移除，更新 localStorage 並記錄
      if (cleanedBlacklist.length < originalBlacklistLength) {
        const removedItems = blacklist.filter(
          (itemName) => !currentItemNames.has(itemName)
        );
        StorageManager.set(CONFIG.STORAGE_KEYS.BLACKLIST, cleanedBlacklist);

        console.log(
          `🧹 黑名單清理完成：移除了 ${removedItems.length} 個不存在的商品`
        );
        console.log(`📋 移除的商品：`, removedItems);
        console.log(
          `📊 黑名單統計：${originalBlacklistLength} → ${cleanedBlacklist.length}`
        );
      }
    },
  };

  // 跳轉模組
  const ForwardManager = {
    // 檢查 local storage 中的 baha_item_list，其 participationHistory array 中的日期(如 2025.06.21)在當天是否達到10次，如果沒有，則前往該物品的 url

    checkParticipationAndRedirect() {
      console.log(`📊 Forward fun`);
      const itemList = StorageManager.get(CONFIG.STORAGE_KEYS.ITEM_LIST) || [];
      const blacklist = StorageManager.get(CONFIG.STORAGE_KEYS.BLACKLIST) || [];
      const today = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

      // 從當前頁面找到所有抽抽樂商品的連結
      const lotteryCards = document.querySelectorAll(".items-card");
      let targetUrl = null;
      let targetItemName = null;

      // 遍歷每個抽抽樂商品卡片
      for (const card of lotteryCards) {
        const typeTag = card.querySelector(".type-tag");
        if (typeTag && typeTag.textContent.trim() === "抽抽樂") {
          // 獲取商品名稱
          const titleElement = card.querySelector(".items-title");
          const itemName = titleElement ? titleElement.textContent.trim() : "";

          if (itemName) {
            // 檢查商品是否在黑名單中
            if (blacklist.includes(itemName)) {
              console.log(`🚫 跳過黑名單商品: ${itemName}`);
              continue;
            }
            // 從 itemList 中找到對應的商品
            const currentItem = itemList.find((item) => item.name === itemName);

            if (currentItem) {
              // 計算今日該商品的參與次數
              const todayParticipationCount =
                currentItem.participationHistory.filter(
                  (date) => date === today
                ).length;

              console.log(
                `📊 ${itemName} 今日參與次數: ${todayParticipationCount}/10`
              );

              // 如果該商品今日參與次數未滿10次，選擇它作為目標
              if (todayParticipationCount < 10) {
                targetUrl = card.getAttribute("href");
                targetItemName = itemName;
                console.log(
                  `🎯 找到未滿10次的商品: ${itemName} (${todayParticipationCount}/10)`
                );
                break;
              }
            } else {
              // 如果在 itemList 中找不到該商品，表示是新商品，參與次數為0
              targetUrl = card.getAttribute("href");
              targetItemName = itemName;
              console.log(`🎯 找到新商品: ${itemName} (0/10)`);
              break;
            }
          }
        }
      }

      if (targetUrl && targetItemName) {
        console.log(
          `🚀 跳轉到抽抽樂商品頁面: ${targetItemName} - ${targetUrl}`
        );
        window.location.href = targetUrl;
      } else {
        // 切換到停止狀態
        ScriptController.toggle();
        console.log("✅ 所有抽抽樂商品今日都已達到參與上限，無需跳轉");
      }
    },
  };

  // 數據解析模組
  const DataParser = {
    parseActivityTime(timeText) {
      if (!timeText) return { startDate: null, endDate: null };

      // 匹配格式：2025.06.21 ~ 2025.06.28
      const match = timeText.match(
        /(\d{4}\.\d{2}\.\d{2})\s*~\s*(\d{4}\.\d{2}\.\d{2})/
      );
      if (match) {
        return {
          startDate: match[1].replace(/\./g, "-"),
          endDate: match[2].replace(/\./g, "-"),
        };
      }
      return { startDate: null, endDate: null };
    },

    extractItemData(itemElement) {
      try {
        // 根據實際HTML結構提取數據
        const titleElement = itemElement.querySelector(".items-title");
        const timeElements = itemElement.querySelectorAll(
          ".items-instructions p"
        );

        let activityTimeText = "";
        // 找到包含活動時間的元素
        timeElements.forEach((p) => {
          if (p.textContent.includes("活動時間")) {
            const span = p.querySelector("span");
            if (span) {
              activityTimeText = span.textContent.trim();
            }
          }
        });

        const title = titleElement ? titleElement.textContent.trim() : "";
        const timeInfo = this.parseActivityTime(activityTimeText);

        return {
          name: title,
          startDate: timeInfo.startDate,
          endDate: timeInfo.endDate,
          participationHistory: [], // 改為空陣列，用於記錄參與紀錄
        };
      } catch (e) {
        console.error("解析商品數據失敗:", e);
        return null;
      }
    },
  };

  // 商品掃描模組
  const ItemScanner = {
    scanLotteryItems() {
      const items = [];
      // 根據實際HTML結構掃描商品
      const itemElements = document.querySelectorAll(".items-card");

      itemElements.forEach((element) => {
        const typeTag = element.querySelector(".type-tag");
        if (typeTag && typeTag.textContent.trim() === "抽抽樂") {
          const itemData = DataParser.extractItemData(element);
          if (itemData && itemData.name) {
            items.push(itemData);
            console.log("找到抽抽樂商品:", itemData);
          }
        }
      });

      return items;
    },

    // 將過期物品移動到歷史記錄
    moveExpiredItems() {
      const itemList = StorageManager.get(CONFIG.STORAGE_KEYS.ITEM_LIST) || [];
      const itemHistory = StorageManager.get("baha_item_history") || [];

      const today = new Date();
      const validItems = [];
      const expiredItems = [];

      itemList.forEach((item) => {
        try {
          if (item.endDate) {
            // 解析結束日期 (格式: yyyy-mm-dd)
            const endDate = new Date(item.endDate);

            // 計算過期天數
            const daysDiff = Math.floor(
              (today - endDate) / (24 * 60 * 60 * 1000)
            );

            if (daysDiff > 1) {
              expiredItems.push(item);
              console.log("移動過期商品到歷史:", item.name);
            } else {
              validItems.push(item);
            }
          } else {
            // 沒有結束日期的保留
            validItems.push(item);
          }
        } catch (e) {
          console.error("處理商品日期失敗:", e);
          // 日期解析失敗的保留
          validItems.push(item);
        }
      });

      // 更新 localStorage
      if (expiredItems.length > 0) {
        StorageManager.set(CONFIG.STORAGE_KEYS.ITEM_LIST, validItems);
        StorageManager.set("baha_item_history", [
          ...itemHistory,
          ...expiredItems,
        ]);
        console.log(`✅ 移動了 ${expiredItems.length} 個過期商品到歷史記錄`);
      }

      return { validItems, expiredItems };
    },

    updateItemList() {
      // 先清理過期物品
      this.moveExpiredItems();

      // 讀取現有的商品列表
      const existingItems =
        StorageManager.get(CONFIG.STORAGE_KEYS.ITEM_LIST) || [];
      const existingNames = new Set(existingItems.map((item) => item.name));

      // 檢查並修正參與記錄錯誤，每個商品每天最多只存在10次記錄
      let fixedItemsCount = 0;
      existingItems.forEach((item) => {
        if (
          item.participationHistory &&
          Array.isArray(item.participationHistory)
        ) {
          // 統計每個日期的出現次數
          const dateCount = {};
          item.participationHistory.forEach((date) => {
            dateCount[date] = (dateCount[date] || 0) + 1;
          });

          // 檢查是否有日期超過10次
          let hasError = false;
          const fixedHistory = [];

          Object.keys(dateCount).forEach((date) => {
            const count = dateCount[date];
            if (count > 10) {
              hasError = true;
              console.warn(
                `⚠️ 商品 "${item.name}" 在 ${date} 有 ${count} 次記錄，超過限制！修正為10次`
              );
              // 只保留10次該日期的記錄
              for (let i = 0; i < 10; i++) {
                fixedHistory.push(date);
              }
            } else {
              // 保留原有的記錄
              for (let i = 0; i < count; i++) {
                fixedHistory.push(date);
              }
            }
          });

          if (hasError) {
            item.participationHistory = fixedHistory;
            fixedItemsCount++;
          }
        }
      });

      if (fixedItemsCount > 0) {
        console.log(`🔧 修正了 ${fixedItemsCount} 個商品的參與記錄錯誤`);
      }

      // 掃描新商品
      const scannedItems = this.scanLotteryItems();
      let newItemsCount = 0;

      // 只新增不存在的商品
      scannedItems.forEach((item) => {
        if (!existingNames.has(item.name)) {
          existingItems.push(item);
          newItemsCount++;
          console.log("新增商品:", item.name);
        }
      });

      // 更新 localStorage
      StorageManager.set(CONFIG.STORAGE_KEYS.ITEM_LIST, existingItems);
      UIManager.updateItemCount(existingItems.length);

      if (newItemsCount > 0) {
        console.log(`✅ 新增了 ${newItemsCount} 個新商品`);
      }
      console.log(`📊 目前共有 ${existingItems.length} 個有效抽抽樂商品`);

      return existingItems;
    },

    insertProbabilityForAllCards() {
      const itemElements = document.querySelectorAll(".items-card");
      itemElements.forEach((card) => {
        const typeTag = card.querySelector(".type-tag");
        if (typeTag && typeTag.textContent.trim() === "抽抽樂") {
          ProbabilityManager.insertProbabilityDisplay(card);
        }
      });
    },
  };
  // 🆕 機率管理模組
  const ProbabilityManager = {
    insertProbabilityDisplay(card) {
      try {
        // 檢查是否已經插入過機率顯示
        if (card.querySelector(".probability-display")) return;

        // 提取商品名稱
        const titleElement = card.querySelector(".items-title");
        const itemName = titleElement ? titleElement.textContent.trim() : "";

        // 從 localStorage 獲取該商品的參與記錄
        const itemList =
          StorageManager.get(CONFIG.STORAGE_KEYS.ITEM_LIST) || [];
        const currentItem = itemList.find((item) => item.name === itemName);
        const userParticipationCount = currentItem
          ? currentItem.participationHistory.length
          : 0;

        // 🔧 修正：根據實際HTML結構提取參與人數和商品數量
        const instructionsElements = card.querySelectorAll(
          ".items-instructions p"
        );

        let participants = 0;
        let quantity = 0;

        instructionsElements.forEach((p) => {
          const text = p.textContent;
          if (text.includes("人氣")) {
            const span = p.querySelector("span");
            if (span) {
              //const match = span.textContent.match(/(\d+)/);
              //if (match) quantity = parseInt(match[1]);
              const match = span.textContent.replace(/,/g, "");
              if (match) participants = parseInt(match, 10);
            }
          } else if (text.includes("商品數量")) {
            const span = p.querySelector("span");
            if (span) {
              //const match = span.textContent.match(/(\d+)/);
              //if (match) quantity = parseInt(match[1]);
              const match = span.textContent.replace(/,/g, "");
              if (match) quantity = parseInt(match, 10);
            }
          }
        });

        /*console.log(
          `商品: ${itemName}, 人氣: ${participants}, 數量: ${quantity}`
        );*/

        // 檢查是否成功提取到數據
        if (participants === 0 || quantity === 0) {
          console.warn("無法提取參與人數或商品數量");
          return;
        }

        // 計算個人中獎機率
        let probability = 0;
        let probabilityText = "";

        if (participants > 0 && userParticipationCount > 0) {
          probability = (
            (quantity / participants) *
            userParticipationCount *
            100
          ).toFixed(6);
          probabilityText = `個人中獎機率: ${probability}% (參與${userParticipationCount}次)`;
        } else if (participants > 0) {
          const singleParticipationProbability = (
            (quantity / participants) *
            100
          ).toFixed(6);
          probabilityText = `單次參與機率: ${singleParticipationProbability}% (未參與)`;
        } else {
          probabilityText = "機率計算中...";
        }

        // 創建機率顯示元素
        const probabilityDiv = document.createElement("div");
        probabilityDiv.className = "probability-display";
        probabilityDiv.innerHTML = `
              <p style="color: #00B0B6; ">
                  ${probabilityText}
              </p>
          `;

        // 插入到商品卡片中
        const cardRight = card.querySelector(".card-right");
        if (cardRight) {
          cardRight.appendChild(probabilityDiv);
        }

        //console.log(`✨ ${itemName} - ${probabilityText}`);
      } catch (e) {
        console.error("插入機率顯示失敗:", e);
      }
    },
  };

  // 新增參與記錄更新函數
  function updateParticipationHistory(itemId) {
    const history =
      StorageManager.get(CONFIG.STORAGE_KEYS.PARTICIPATION_HISTORY) || {};
    history[itemId] = (history[itemId] || 0) + 1;
    StorageManager.set(CONFIG.STORAGE_KEYS.PARTICIPATION_HISTORY, history);

    // 更新顯示
    scanAndDisplayProbabilities();
  }

  // 在頁面載入完成後執行機率掃描
  function initializeProbabilityDisplay() {
    ScriptController.updateProbabilityDisplay();
  }

  // 主控制模組
  const ScriptController = {
    isRunning: false,
    countdownTimer: null, // 用於存儲倒數計時器

    init() {
      this.loadStatus();
      UIManager.createControlPanel();
      this.updateUI();
      UIManager.bindToggleEvent(() => this.toggle());

      this.startScanning();
      // 新增黑名單按鈕
      UIManager.addBlacklistButton();

      // 如果腳本正在運行
      if (this.isRunning) {
        // 開始倒數並跳轉
        this.startCountdownAndRedirect();
      }
    },

    loadStatus() {
      const status = StorageManager.get(CONFIG.STORAGE_KEYS.SCRIPT_STATUS);
      this.isRunning = status === true;
    },

    saveStatus() {
      StorageManager.set(CONFIG.STORAGE_KEYS.SCRIPT_STATUS, this.isRunning);
    },

    toggle() {
      this.isRunning = !this.isRunning;
      this.saveStatus();
      this.updateUI();

      if (this.isRunning) {
        // 開始倒數並跳轉
        this.startCountdownAndRedirect();
      } else {
        // 停止倒數和掃描
        this.stopCountdown();
      }
    },

    startCountdownAndRedirect() {
      const btn = document.getElementById("scriptToggleBtn");
      if (!btn) return;

      let countdown = 5;
      const originalText = btn.textContent;

      // 更新按鈕文字顯示倒數
      const updateCountdown = () => {
        // 檢查腳本是否仍在運行（防止在倒數過程中被停止）
        if (!this.isRunning) {
          return;
        }

        btn.textContent = `${countdown} 秒後自動跳轉...`;
        countdown--;

        if (countdown >= 0) {
          this.countdownTimer = setTimeout(updateCountdown, 1000);
        } else {
          // 倒數結束，執行跳轉
          btn.textContent = originalText;
          this.countdownTimer = null;
          ForwardManager.checkParticipationAndRedirect();
        }
      };

      updateCountdown();
    },

    stopCountdown() {
      // 清除倒數計時器
      if (this.countdownTimer) {
        clearTimeout(this.countdownTimer);
        this.countdownTimer = null;
      }

      // 恢復按鈕文字
      const btn = document.getElementById("scriptToggleBtn");
      if (btn) {
        btn.textContent = "開始腳本";
        btn.className = "script-control-btn stopped";
      }
    },

    updateUI() {
      UIManager.updateToggleButton(this.isRunning);
    },

    startScanning() {
      console.log("🚀 開始掃描抽抽樂商品...");
      const items = ItemScanner.updateItemList();
      // 顯示機率
      initializeProbabilityDisplay();
      // 新增黑名單按鈕
      //UIManager.addBlacklistButton();

      // 顯示掃描結果
      if (items.length > 0) {
        console.log(`🎯 成功掃描到 ${items.length} 個抽抽樂商品！`);
      }
    },
    updateProbabilityDisplay() {
      ItemScanner.insertProbabilityForAllCards();
      console.log("🔄 已更新所有商品的機率顯示");
    },
  };

  // 等待頁面載入完成後初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => ScriptController.init(), 1000);
    });
  } else {
    setTimeout(() => ScriptController.init(), 1000);
  }
})();
