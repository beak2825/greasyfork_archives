// ==UserScript==
// @name         Claude.ai 翻譯對話標題
// @namespace    https://greasyfork.org/
// @version      1.0.0
// @description  將 Claude.ai 網站上的英文對話標題自動翻譯成繁體中文
// @match        https://claude.ai/*
// @grant        none
// @author       windofage
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519701/Claudeai%20%E7%BF%BB%E8%AD%AF%E5%B0%8D%E8%A9%B1%E6%A8%99%E9%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/519701/Claudeai%20%E7%BF%BB%E8%AD%AF%E5%B0%8D%E8%A9%B1%E6%A8%99%E9%A1%8C.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 設定翻譯目標語言
  const TARGET_LANG = "zh-TW"; // 繁體中文

  // 翻譯快取
  var translationCache = {};

  // 使用 Google Translate API 進行翻譯
  function translateWithGoogleAPI(text) {
    if (translationCache[text]) {
      return Promise.resolve(translationCache[text]);
    }

    return fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${TARGET_LANG}&dt=t&q=${encodeURIComponent(
        text
      )}`
    )
      .then(function (response) {
        if (!response.ok) {
          console.error("翻譯請求失敗:", response.status);
          return text;
        }
        return response.json();
      })
      .then(function (data) {
        if (!data || !data[0] || !data[0][0] || !data[0][0][0]) {
          console.error("無效的翻譯結果");
          return text;
        }

        var translatedText = data[0][0][0];

        if (!translatedText.trim() || translatedText === text) {
          console.warn("翻譯結果為空或與原文相同");
          return text;
        }

        translationCache[text] = translatedText;
        return translatedText;
      })
      .catch(function (error) {
        console.error("翻譯過程發生錯誤:", error);
        return text;
      });
  }

  // 翻譯特定範圍內的元素
  function translateElements() {
    // 翻譯側邊欄的歷史對話列表和主區域的對話卡片
    var elements = document.querySelectorAll(
      "div.min-w-0.truncate, " + // 側邊欄最近對話標題
        "div.font-tiempos, " + // 主區域和聊天列表標題
        ".font-tiempos.line-clamp-1, " + // 其他可能的標題樣式
        ".font-tiempos.line-clamp-2" // 其他可能的標題樣式
    );

    Array.prototype.forEach.call(elements, function (element) {
      var originalText = element.textContent.trim();
      // 如果不包含中文字才翻譯
      if (!/[\u4e00-\u9fa5]/.test(originalText)) {
        translateWithGoogleAPI(originalText).then(function (translatedText) {
          if (translatedText && translatedText !== originalText) {
            element.textContent = translatedText;
          }
        });
      }
    });
  }

  // 監聽 DOM 變化
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        var hasRelevantElements = mutation.target.querySelector(
          "div.min-w-0.truncate, div.font-tiempos, .font-tiempos.line-clamp-1, .font-tiempos.line-clamp-2"
        );
        if (hasRelevantElements) {
          translateElements();
          return;
        }
      }
    });
  });

  // 初始化函式
  function initialize() {
    // 先執行一次翻譯
    translateElements();

    // 設置觀察者
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // 判斷 DOM 是否已經載入
  if (document.readyState === "loading") {
    // 如果 DOM 還在載入中，監聽 DOMContentLoaded 事件
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    // 如果 DOM 已經載入完成，直接執行初始化
    initialize();
  }
})();
