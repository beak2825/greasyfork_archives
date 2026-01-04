// ==UserScript==
// @name         巴哈姆特_多合一兌獎腳本_優化版
// @namespace    Bee10301
// @version      20250808
// @description  合併多個巴哈姆特兌獎腳本 - 優化版
// @author       Bee
// @license      GPL
// @match        https://*.safeframe.googlesyndication.com/*
// @match        https://fuli.gamer.com.tw/shop_detail.php?*
// @match        https://fuli.gamer.com.tw/buyD.php?*
// @match        https://fuli.gamer.com.tw/message_done.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542368/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9_%E5%A4%9A%E5%90%88%E4%B8%80%E5%85%8C%E7%8D%8E%E8%85%B3%E6%9C%AC_%E5%84%AA%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/542368/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9_%E5%A4%9A%E5%90%88%E4%B8%80%E5%85%8C%E7%8D%8E%E8%85%B3%E6%9C%AC_%E5%84%AA%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 常數定義
  const SELECTORS = {
    AD_FIRST_BUTTON:
      "div.rewardDialogueWrapper:nth-child(7) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2)",
    AD_SECOND_BUTTON: "#google-rewarded-video > img:nth-child(3)",
    AD_COUNT_DOWN: [
      "#count_down",
      "#count-down-container",
      ".videoAdUiPreSkipButton",
    ],
    AD_SKIP_BUTTON: [
      ".videoAdUiSkipButton",
      "#close_button",
      "#dismiss-button-element",
    ],
    AD_CLOSE_BUTTON: [
      "#google-rewarded-video > button:nth-child(5)",
      "#close_button",
    ],
    SHOP_H1: ".BH-lbox > div > h1",
    SHOP_BUY_BTN: "#buyBtnContent",
    CONFIRM_BUTTON: ".btn.btn-insert.btn-primary",
    OUT_OF_AD_BUTTON: ".btn.btn-insert.btn-danger",
    AD_FREE_BUTTON: "a.btn-base.c-accent-o",
  };

  const DELAYS = {
    SECOND_BUTTON: 300,
    THIRD_BUTTON: 5500,
    CONFIRM_BUTTON: 1000,
    OUT_OF_AD_BUTTON: 300000, // 廣告看完時等待刷新的間隔
  };

  const MESSAGES = {
    FIRST_BUTTON_CLICKED: "已點擊第一個按鈕",
    SECOND_BUTTON_CLICKED: "已點擊第二個按鈕",
    THIRD_BUTTON_CLICKED: "已點擊第三個按鈕",
    CONFIRM_CLICKED: "已自動點擊確認按鈕",
    AD_BUTTON_CLICKED: "已自動點擊「看廣告免費兌換」按鈕",
  };

  // 工具函數
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function safeElementOperation(selector, operation, description = "") {
    try {
      const element = document.querySelector(selector);
      if (element) {
        return operation(element);
      }
      if (description) {
        console.warn(`Element not found: ${description}`);
      }
      return null;
    } catch (error) {
      console.error(`Operation failed for ${description}:`, error);
      return null;
    }
  }

  function createButtonClicker(selector, description = "") {
    return () => {
      return safeElementOperation(
        selector,
        (element) => {
          element.click();
          console.log(description);
          return true;
        },
        description
      );
    };
  }

  // Observer 管理器
  class ObserverManager {
    constructor() {
      this.observers = new Map();
    }

    create(name, callback, options = { childList: true, subtree: true }) {
      const observer = new MutationObserver(callback);
      this.observers.set(name, observer);
      return observer;
    }

    observe(name, target = document.body) {
      const observer = this.observers.get(name);
      if (observer) {
        observer.observe(target, { childList: true, subtree: true });
      }
    }

    disconnect(name) {
      const observer = this.observers.get(name);
      if (observer) {
        observer.disconnect();
        this.observers.delete(name);
      }
    }

    disconnectAll() {
      this.observers.forEach((observer) => observer.disconnect());
      this.observers.clear();
    }
  }

  // 主要功能模組
  const BahaScript = {
    observerManager: new ObserverManager(),

    // 廣告模組
    ad: {
      async clickButtonSequence() {
        /*await delay(DELAYS.SECOND_BUTTON);
        createButtonClicker(
          SELECTORS.AD_SECOND_BUTTON,
          MESSAGES.SECOND_BUTTON_CLICKED
        )();*/

        // try to click element in AD_SKIP_BUTTON[],if found then skip else.
        //await delay(DELAYS.THIRD_BUTTON);
        // 每秒檢測一次 window.getComputedStyle(document.querySelector("#count_down")).visibility ，如果是 hidden 就嘗試點擊關閉
        let checkAdInterval;
        // 設定每秒執行一次的計時器
        checkAdInterval = setInterval(() => {
          console.log("wait for ad ...");
          // 每次都重新找一次 #count_down 元素，確保它存在喔！
          SELECTORS.AD_COUNT_DOWN.forEach((selector) => {
            const countDown = document.querySelector(selector);
            if (countDown) {
              console.log(`找到元素: ${selector}`);
              if (
                window.getComputedStyle(countDown).visibility === "hidden" ||
                document.querySelector("#count-down-container").style
                  .display === "none"
              ) {
                console.log("count down 已經隱藏，嘗試關閉廣告");
                // 嘗試點擊關閉廣告按鈕
                const adClicked = SELECTORS.AD_SKIP_BUTTON.some(
                  (closeSelector) => {
                    if (document.querySelector(closeSelector)) {
                      createButtonClicker(
                        closeSelector,
                        MESSAGES.THIRD_BUTTON_CLICKED
                      )();
                      console.log(
                        `找到並點擊了關閉廣告按鈕: ${closeSelector}！`
                      );
                      return true; // 找到了，就不用再找其他按鈕了
                    }
                    console.log(`沒有找到這個關閉廣告按鈕: ${closeSelector}`);
                    return false; // 沒找到，繼續找下一個
                  }
                );

                // 如果成功點擊了廣告按鈕，就代表廣告處理好了，可以停止這個計時器囉！
                if (adClicked) {
                  console.log("廣告按鈕已經點擊，停止每秒檢查囉！");
                  clearInterval(checkAdInterval); // 停止計時器
                }
              }
            } else if (
              document.getElementsByClassName("rewardedAdUiAttribution") &&
              document.getElementsByClassName("rewardedAdUiAttribution")[0]
                .textContent === "" &&
              document.querySelector('button[aria-label="Close ad"]')
            ) {
              document.querySelector('button[aria-label="Close ad"]').click();
            } else {
              console.log(`沒有找到元素: ${selector}`);
            }
          });
        }, 1000);
      },

      observeFirstButton() {
        const observer = BahaScript.observerManager.create(
          "firstButton",
          (mutations) => {
            //const button1 = document.querySelector(SELECTORS.AD_FIRST_BUTTON);
            const button1 = document.querySelector(SELECTORS.AD_SECOND_BUTTON);
            if (button1) {
              console.log(MESSAGES.FIRST_BUTTON_CLICKED);
              button1.click();
              BahaScript.observerManager.disconnect("firstButton");
              BahaScript.ad.clickButtonSequence();
            }
          }
        );

        BahaScript.observerManager.observe("firstButton");
      },
    },

    // 商店模組
    shop: {
      moveButtonToTitle() {
        const h1Element = document.querySelector(SELECTORS.SHOP_H1);
        const buyBtnContent = document.querySelector(SELECTORS.SHOP_BUY_BTN);
        // 點擊 id topBar_light_0 的元素
        const topBarLight0 = document.querySelector("#topBar_light_0");
        if (topBarLight0) {
          topBarLight0.click();
        }

        if (!h1Element || !buyBtnContent) {
          console.error("找不到目標元素");
          return false;
        }

        h1Element.parentNode.insertBefore(buyBtnContent, h1Element.nextSibling);
        Object.assign(buyBtnContent.style, {
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
        });

        return { h1Element, buyBtnContent };
      },

      displayRemainingTime(buyBtnContent) {
        const activityTimeElement = document.querySelector(
          ".pbox-content:nth-child(5) .pbox-content-r"
        );
        if (!activityTimeElement) return null;

        const activityTimeText = activityTimeElement.textContent;
        const endTimeStr = activityTimeText.split("~")[1]?.trim();
        if (!endTimeStr) return null;

        const endTime = new Date(
          endTimeStr.replace("年", "/").replace("月", "/").replace("日", "")
        ).getTime();

        const updateRemainingTime = () => {
          const now = new Date().getTime();
          const timeLeft = endTime - now;

          if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor(
              (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
            );
            return `剩餘時間：${hours} 小時 ${minutes} 分`;
          }
          return "已結束";
        };

        const remainingTimeElement = document.createElement("div");
        remainingTimeElement.textContent = updateRemainingTime();
        Object.assign(remainingTimeElement.style, {
          marginTop: "5px",
          textAlign: "center",
        });

        buyBtnContent.parentNode.insertBefore(
          remainingTimeElement,
          buyBtnContent.nextSibling
        );

        setInterval(() => {
          remainingTimeElement.textContent = updateRemainingTime();
        }, 60000);

        return remainingTimeElement;
      },

      displayQuantityInfo(buyBtnContent, remainingTimeElement) {
        const remainingQuantityElement = document.querySelector(
          ".pbox-content:nth-child(7) .pbox-content-r"
        );

        let participantCountElement = null;
        const pboxContents = document.querySelectorAll(".pbox-content");

        for (const element of pboxContents) {
          const label = element.querySelector(".pbox-content-l");
          if (label?.textContent === "參與人數") {
            participantCountElement = element.querySelector(".pbox-content-r");
            break;
          }
        }

        if (!remainingQuantityElement || !participantCountElement) return;

        const remainingQuantity = parseInt(
          remainingQuantityElement.textContent
        );
        let participantCount = parseInt(
          participantCountElement.textContent.replace(",", "")
        );

        if (isNaN(participantCount)) participantCount = 0;

        const winningProbability = (
          (remainingQuantity / participantCount) *
          100
        ).toFixed(4);
        const infoText = `${remainingQuantity}個/${participantCount}人【${winningProbability}%】`;

        const infoElement = document.createElement("div");
        infoElement.textContent = infoText;
        Object.assign(infoElement.style, {
          marginTop: "5px",
          textAlign: "center",
        });

        const insertAfter = remainingTimeElement || buyBtnContent;
        buyBtnContent.parentNode.insertBefore(
          infoElement,
          insertAfter.nextSibling
        );
      },

      setupConfirmObserver() {
        const observer = BahaScript.observerManager.create(
          "shopConfirm",
          (mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.addedNodes?.length > 0) {
                mutation.addedNodes.forEach((node) => {
                  if (
                    node.id === "dialogify_2" &&
                    node.classList?.contains("dialogify")
                  ) {
                    console.log("廣告確認視窗出現！");

                    safeElementOperation(
                      SELECTORS.CONFIRM_BUTTON,
                      (button) => {
                        button.click();
                        console.log("已自動點擊確認按鈕！");
                        BahaScript.observerManager.disconnect("shopConfirm");
                        setTimeout(() => {
                          window.location.reload();
                        }, 31000);
                        // goto next page after 15 seconds
                        // setTimeout(() => {
                        //   // go to https://fuli.gamer.com.tw/buyD.php?ad=1&sn=
                        //   const sn = new URLSearchParams(
                        //     window.location.search
                        //   ).get("sn");
                        //   if (sn) {
                        //     window.location.href = `https://fuli.gamer.com.tw/buyD.php?ad=1&sn=${sn}`;
                        //   } else {
                        //     console.error("找不到 sn 參數");
                        //     window.location.reload();
                        //   }
                        // }, 10000);
                        return true;
                      },
                      "確認按鈕",
                      node
                    );

                    safeElementOperation(
                      SELECTORS.OUT_OF_AD_BUTTON,
                      (button) => {
                        button.click();
                        console.log(
                          "本日次數還沒用完，但站方暫時缺法廣告能看，5分鐘後reload頁面..."
                        );
                        BahaScript.observerManager.disconnect("shopConfirm");
                        // 5分鐘後reload頁面，將按鈕文字修改提醒使用者
                        const reloadButton = document.querySelector(
                          SELECTORS.SHOP_BUY_BTN
                        );
                        if (reloadButton) {
                          reloadButton.textContent =
                            "(5分鐘後自動重新載入頁面)";
                        }
                        setTimeout(() => {
                          window.location.reload();
                        }, DELAYS.OUT_OF_AD_BUTTON);
                        return true;
                      },
                      "用完的關閉按鈕",
                      node
                    );
                  }
                });
              }
            });
          }
        );

        BahaScript.observerManager.observe("shopConfirm");
      },

      autoClickAdButton() {
        const adButton = Array.from(
          document.querySelectorAll(SELECTORS.AD_FREE_BUTTON)
        ).find((button) => button.textContent.trim() === "看廣告免費兌換");

        if (adButton) {
          adButton.click();
          console.log(MESSAGES.AD_BUTTON_CLICKED);
          return;
        }

        const adButtonOver = Array.from(
          document.querySelectorAll(SELECTORS.AD_FREE_BUTTON)
        ).find(
          (button) => button.textContent.trim() === "本日免費兌換次數已用盡"
        );

        if (adButtonOver) {
          console.log("本日免費兌換次數已用盡");
          // 將local storage中的數據填滿當日日期直到10次
          BahaScript.shop.fillParticipationHistory();
          return;
        }
      },
      fillParticipationHistory() {
        // 1. 取得 HTML 元素中的商品名稱
        const itemTitleElement = document.querySelector(
          ".BH-lbox.fuli-pbox h1"
        );
        if (!itemTitleElement) {
          console.error("找不到商品名稱元素");
          return;
        }
        const itemName = itemTitleElement.textContent.trim();
        // 2. 從 localStorage 取得 baha_item_list
        const bahaItemListString = localStorage.getItem("baha_item_list");
        if (!bahaItemListString) {
          console.log("localStorage 中沒有 baha_item_list");
          return;
        }
        let bahaItemList;
        try {
          bahaItemList = JSON.parse(bahaItemListString);
        } catch (e) {
          console.error("解析 baha_item_list 失敗", e);
          return;
        }
        // 3. 尋找對應的商品
        const itemIndex = bahaItemList.findIndex(
          (item) => item.name === itemName
        );
        if (itemIndex === -1) {
          console.log(`找不到名稱為 ${itemName} 的商品`);
          return;
        }
        // 4. 取得今天的日期（固定使用 +8 時區）
        const today = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);
        // 5. 計算今天的參與次數
        const todayCount = bahaItemList[itemIndex].participationHistory.filter(
          (date) => date === today
        ).length;
        // 6. 如果少於 10 次，就填滿到 10 次
        if (todayCount < 10) {
          const timesToAdd = 10 - todayCount;
          for (let i = 0; i < timesToAdd; i++) {
            bahaItemList[itemIndex].participationHistory.push(today);
          }
          console.log(
            `已將 ${itemName} 的參與紀錄填滿到 10 次 (今天: ${today})`
          );
        } else {
          console.log(`今天 ${itemName} 的參與紀錄已達到 10 次`);
        }
        // 7. 更新 localStorage
        localStorage.setItem("baha_item_list", JSON.stringify(bahaItemList));
        // 8. 返回 https://fuli.gamer.com.tw/shop.php
        window.location.href = "https://fuli.gamer.com.tw/shop.php";
      },

      init() {
        const elements = this.moveButtonToTitle();
        if (!elements) return;

        const { buyBtnContent } = elements;
        const remainingTimeElement = this.displayRemainingTime(buyBtnContent);
        this.displayQuantityInfo(buyBtnContent, remainingTimeElement);
        this.setupConfirmObserver();
        this.autoClickAdButton();
      },
    },

    // 兌換確認模組
    exchange: {
      setupAutoConfirm() {
        // 10秒後自動重新載入頁面，防止頁面卡住
        setTimeout(() => {
          console.log("頁面載入超時，自動重新載入...");
          BahaScript.exchange.removeOneTodaysHistory();
          window.location.reload();
        }, 10000);
        // 自動勾選同意條款
        safeElementOperation("#agree-confirm", (checkbox) => {
          checkbox.checked = true;
          return true;
        });

        // 移動確認按鈕
        const confirmButton = document.querySelector(".flex-center.pbox-btn");
        const pboxTitle = document.querySelector(".pbox-title");

        if (confirmButton && pboxTitle) {
          pboxTitle.parentNode.insertBefore(confirmButton, pboxTitle);
        }

        // 設置確認觀察器
        const observer = BahaScript.observerManager.create(
          "exchangeConfirm",
          (mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.addedNodes?.length > 0) {
                mutation.addedNodes.forEach((node) => {
                  if (
                    node.nodeName === "DIALOG" &&
                    node.classList?.contains("dialogify")
                  ) {
                    setTimeout(() => {
                      safeElementOperation(
                        SELECTORS.CONFIRM_BUTTON,
                        (button) => {
                          button.click();
                          console.log(MESSAGES.CONFIRM_CLICKED);
                          BahaScript.observerManager.disconnect(
                            "exchangeConfirm"
                          );
                          return true;
                        },
                        "確認按鈕",
                        node
                      );
                    }, DELAYS.CONFIRM_BUTTON);
                  }
                });
              }
            });
          }
        );

        BahaScript.observerManager.observe("exchangeConfirm");

        if (this.isUsingAdTicket()) {
          this.autoClickConfirmButton();
        } else {
          // url https://fuli.gamer.com.tw/buyD.php?ad=1&sn=5353 forward to https://fuli.gamer.com.tw/shop_detail.php?sn=5353
          const sn = new URLSearchParams(window.location.search).get("sn");
          if (sn) {
            window.location.href = `https://fuli.gamer.com.tw/shop_detail.php?sn=${sn}`;
          }
        }
      },

      isUsingAdTicket() {
        return (
          safeElementOperation(
            ".pbox-content:nth-child(3) .pbox-content-r span",
            (element) => {
              return element.textContent.trim() === "廣告抽獎券";
            }
          ) || false
        );
      },

      autoClickConfirmButton() {
        setTimeout(() => {
          safeElementOperation(
            ".flex-center.pbox-btn a.btn-base.c-primary",
            (button) => {
              button.click();
              button.textContent += " (腳本已點擊)";
              console.log("已自動點擊確認兌換按鈕");
              BahaScript.exchange.updateParticipationHistory();
              return true;
            }
          );
        }, DELAYS.CONFIRM_BUTTON);
      },
      updateParticipationHistory() {
        // 1. 取得 HTML 元素中的商品名稱
        const itemTitleElement = document.querySelector(
          ".BH-lbox.fuli-pbox h1"
        );
        if (!itemTitleElement) {
          console.error("找不到商品名稱元素");
          return;
        }
        const itemName = itemTitleElement.textContent.trim();
        // 2. 從 localStorage 取得 baha_item_list
        const bahaItemListString = localStorage.getItem("baha_item_list");
        if (!bahaItemListString) {
          console.log("localStorage 中沒有 baha_item_list");
          return;
        }
        let bahaItemList;
        try {
          bahaItemList = JSON.parse(bahaItemListString);
        } catch (e) {
          console.error("解析 baha_item_list 失敗", e);
          return;
        }
        // 3. 尋找對應的商品
        const itemIndex = bahaItemList.findIndex(
          (item) => item.name === itemName
        );
        if (itemIndex === -1) {
          console.log(`找不到名稱為 ${itemName} 的商品`);
          return;
        }
        // 4. 檢查是否已經參與過
        const today = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10); // 固定使用 +8 時區的今天日期
        // 5. 將今天的日期加到 participationHistory 陣列中
        bahaItemList[itemIndex].participationHistory.push(today);
        // 6. 更新 localStorage
        localStorage.setItem("baha_item_list", JSON.stringify(bahaItemList));
        console.log(`已將今天的日期 ${today} 加入 ${itemName} 的參與紀錄`);
      },
      removeOneTodaysHistory() {
        // 1. 取得 HTML 元素中的商品名稱
        const itemTitleElement = document.querySelector(
          ".BH-lbox.fuli-pbox h1"
        );
        if (!itemTitleElement) {
          console.error("找不到商品名稱元素");
          return;
        }
        const itemName = itemTitleElement.textContent.trim();
        // 2. 從 localStorage 取得 baha_item_list
        const bahaItemListString = localStorage.getItem("baha_item_list");
        if (!bahaItemListString) {
          console.log("localStorage 中沒有 baha_item_list");
          return;
        }
        let bahaItemList;
        try {
          bahaItemList = JSON.parse(bahaItemListString);
        } catch (e) {
          console.error("解析 baha_item_list 失敗", e);
          return;
        }
        // 3. 尋找對應的商品
        const itemIndex = bahaItemList.findIndex(
          (item) => item.name === itemName
        );
        if (itemIndex === -1) {
          console.log(`找不到名稱為 ${itemName} 的商品`);
          return;
        }
        // 4. 取得今天的日期（固定使用 +8 時區）
        const today = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);
        // 5. 移除今天的參與紀錄
        const todayCount = bahaItemList[itemIndex].participationHistory.filter(
          (date) => date === today
        ).length;
        if (todayCount === 0) {
          console.log(`今天 ${itemName} 沒有參與紀錄，無需移除`);
          return;
        }
        const lastIndexOfToday =
          bahaItemList[itemIndex].participationHistory.lastIndexOf(today);
        bahaItemList[itemIndex].participationHistory.splice(
          lastIndexOfToday,
          1
        );
        console.log(`已將今天 ${today} 在 ${itemName} 的參與紀錄移除 1 次`);
        // 6. 更新 localStorage
        localStorage.setItem("baha_item_list", JSON.stringify(bahaItemList));
      },
    },

    // 完成頁面模組
    completion: {
      autoReturn() {
        safeElementOperation(".btn.btn--primary", (button) => {
          button.click();
          return true;
        });
      },
    },
  };

  // 路由處理
  const currentURL = window.location.href;

  if (/^https:\/\/.*\.safeframe\.googlesyndication\.com\/.*/.test(currentURL)) {
    // 廣告頁面
    //BahaScript.ad.observeFirstButton();
    BahaScript.ad.clickButtonSequence();
  } else if (
    currentURL.startsWith("https://fuli.gamer.com.tw/shop_detail.php?")
  ) {
    // 商店詳情頁面
    BahaScript.shop.init();
  } else if (currentURL.startsWith("https://fuli.gamer.com.tw/buyD.php?")) {
    // 兌換確認頁面
    BahaScript.exchange.setupAutoConfirm();
  } else if (
    currentURL.startsWith("https://fuli.gamer.com.tw/message_done.php?")
  ) {
    // 完成頁面
    BahaScript.completion.autoReturn();
  }

  // 清理函數（可選）
  window.addEventListener("beforeunload", () => {
    BahaScript.observerManager.disconnectAll();
  });
})();
