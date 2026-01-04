// ==UserScript==
// @name         Perplexity 翻譯來源文字
// @namespace    https://greasyfork.org/
// @version      1.0.0
// @description  將 Perplexity 搜尋結果的來源參考翻譯成繁體中文
// @match        https://www.perplexity.ai/*
// @grant        none
// @author       windofage
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519714/Perplexity%20%E7%BF%BB%E8%AD%AF%E4%BE%86%E6%BA%90%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/519714/Perplexity%20%E7%BF%BB%E8%AD%AF%E4%BE%86%E6%BA%90%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 設定翻譯目標語言
  const TARGET_LANG = "zh-TW"; // 繁體中文

  // 翻譯快取
  const translationCache = {};

  // Google Translate API 翻譯函式
  async function translateWithGoogle(text) {
    if (!text || text.trim() === "") return text;
    if (translationCache[text]) return translationCache[text];

    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${TARGET_LANG}&dt=t&q=${encodeURIComponent(
      text
    )}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const translatedText = data[0][0][0];
      translationCache[text] = translatedText;
      return translatedText;
    } catch (error) {
      console.error("翻譯錯誤:", error);
      return text;
    }
  }

  // 更新翻譯目標選擇器，加入標題區域
  const targetSelector = `
    div[data-state="closed"] .line-clamp-3, 
    div.line-clamp-4, 
    div.line-clamp-1:not(.text-textOff):not(.text-textOffDark),
    div.line-clamp-3.text-left.pr-1
  `.trim();

  // 處理文字翻譯的函式
  async function processText(element) {
    const originalText = element.textContent;

    // 檢查是否為標題格式（包含數字序號）
    const titleMatch = originalText.match(/^(\d+\.\s*)(.+)$/);

    if (titleMatch) {
      // 如果是標題，只翻譯內容部分
      const [_, number, content] = titleMatch;
      const translatedContent = await translateWithGoogle(content);
      element.textContent = `${number}${translatedContent}`;
    } else {
      // 一般文字直接翻譯
      const translatedText = await translateWithGoogle(originalText);
      element.textContent = translatedText;
    }
  }

  // 修改翻譯函式
  async function translateTargetElements() {
    const elements = document.querySelectorAll(targetSelector);
    for (const element of elements) {
      await processText(element);
    }
  }

  // 監聽動態內容變更
  const observer = new MutationObserver(() => {
    translateTargetElements();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 初始執行翻譯
  translateTargetElements();
})();
