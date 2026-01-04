// ==UserScript==
// @name         ChatGPT 語音輸入與語音合成功能 (優化支援 chatgpt.com)
// @version      2.6.0
// @description  支援語音輸入和語音合成功能，適用於 chat.openai.com 與 chatgpt.com
// @license      MIT
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @run-at       document-idle
// @grant        none
// @namespace https://greasyfork.org/users/1400068
// @downloadURL https://update.greasyfork.org/scripts/518315/ChatGPT%20%E8%AA%9E%E9%9F%B3%E8%BC%B8%E5%85%A5%E8%88%87%E8%AA%9E%E9%9F%B3%E5%90%88%E6%88%90%E5%8A%9F%E8%83%BD%20%28%E5%84%AA%E5%8C%96%E6%94%AF%E6%8F%B4%20chatgptcom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/518315/ChatGPT%20%E8%AA%9E%E9%9F%B3%E8%BC%B8%E5%85%A5%E8%88%87%E8%AA%9E%E9%9F%B3%E5%90%88%E6%88%90%E5%8A%9F%E8%83%BD%20%28%E5%84%AA%E5%8C%96%E6%94%AF%E6%8F%B4%20chatgptcom%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 功能初始化函數
  function initVoiceInput() {
    const chatInputSelector = "textarea"; // 修改選擇器，適應 chatgpt.com
    const chatContainer = document.querySelector(chatInputSelector);

    if (!chatContainer) {
      console.warn("未找到輸入框，等待重新檢測...");
      setTimeout(initVoiceInput, 1000); // 若未找到則延遲重試
      return;
    }

    console.log("語音功能已啟動！");
    // 在此添加語音輸入與語音合成的邏輯
    setupVoiceInput(chatContainer);
  }

  // 語音輸入設定
  function setupVoiceInput(inputField) {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "zh-TW"; // 預設語言為繁體中文
    recognition.continuous = false;

    // 啟動語音輸入按鈕
    const voiceButton = document.createElement("button");
    voiceButton.innerText = "🎤 語音輸入";
    voiceButton.style.position = "absolute";
    voiceButton.style.bottom = "10px";
    voiceButton.style.right = "10px";
    voiceButton.style.zIndex = "1000";

    voiceButton.addEventListener("click", () => {
      recognition.start();
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      inputField.value += transcript; // 將語音結果添加到輸入框
    };

    recognition.onerror = (event) => {
      console.error("語音輸入錯誤:", event.error);
    };

    document.body.appendChild(voiceButton); // 添加按鈕到頁面
  }

  // 初始化腳本
  window.addEventListener("load", initVoiceInput);
})();
