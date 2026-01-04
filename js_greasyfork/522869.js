// ==UserScript==
// @name         Drrrkari 翻訳ボット４（Enterキー対応、ドラッグ移動可能）
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  翻訳と送信をサポートするスクリプト（不要なタグ削除機能付き）
// @author       AoiRabbit
// @match        *://drrrkari.com/room*
// @grant        none
// @require      https://unpkg.com/axios/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/522869/Drrrkari%20%E7%BF%BB%E8%A8%B3%E3%83%9C%E3%83%83%E3%83%88%EF%BC%94%EF%BC%88Enter%E3%82%AD%E3%83%BC%E5%AF%BE%E5%BF%9C%E3%80%81%E3%83%89%E3%83%A9%E3%83%83%E3%82%B0%E7%A7%BB%E5%8B%95%E5%8F%AF%E8%83%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/522869/Drrrkari%20%E7%BF%BB%E8%A8%B3%E3%83%9C%E3%83%83%E3%83%88%EF%BC%94%EF%BC%88Enter%E3%82%AD%E3%83%BC%E5%AF%BE%E5%BF%9C%E3%80%81%E3%83%89%E3%83%A9%E3%83%83%E3%82%B0%E7%A7%BB%E5%8B%95%E5%8F%AF%E8%83%BD%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // DOM 要素取得
    const input = document.querySelector("#message .inputarea textarea");
    const submit = document.querySelector("#message .submit input");

    // 翻訳ボタンの作成
    const translateButton = document.createElement("button");
    translateButton.innerText = "翻訳: OFF";
    translateButton.style.padding = "10px";
    translateButton.style.borderRadius = "5px";
    translateButton.style.backgroundColor = "#008000";
    translateButton.style.color = "white";
    translateButton.style.position = "fixed";
    translateButton.style.bottom = "20px";
    translateButton.style.right = "20px";
    translateButton.style.cursor = "grab";
    translateButton.style.zIndex = "1000";

    // ドラッグ移動用変数
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    // ボタンの状態管理用変数
    let isTranslationEnabled = false;

    // ボタンのドラッグイベントリスナー
    translateButton.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - translateButton.offsetLeft;
        offsetY = e.clientY - translateButton.offsetTop;
        translateButton.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            translateButton.style.left = `${e.clientX - offsetX}px`;
            translateButton.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        translateButton.style.cursor = "grab";
    });

    // ボタンのクリックイベントでON/OFF切り替え
    translateButton.addEventListener("click", () => {
        isTranslationEnabled = !isTranslationEnabled;
        if (isTranslationEnabled) {
            translateButton.innerText = "翻訳: ON";
            translateButton.style.backgroundColor = "#007bff";
        } else {
            translateButton.innerText = "翻訳: OFF";
            translateButton.style.backgroundColor = "#008000";
        }
    });

    // 翻訳と送信を行う関数
    async function handleTranslationAndSend() {
        if (!isTranslationEnabled) {
            sendChatMessage(input.value);
            return;
        }
        const message = input.value;
        if (message) {
            const translatedMessage = await translateMessage(message);
            sendChatMessage(translatedMessage);
        }
    }

    // 翻訳ボタンの動作
    translateButton.onclick = handleTranslationAndSend;

    // ボタンをページに追加
    document.body.appendChild(translateButton);

    // MyMemory APIを利用した翻訳関数
    async function translateMessage(text) {
        try {
            const response = await axios.get(`https://api.mymemory.translated.net/get`, {
                params: {
                    q: text,
                    langpair: "ja|en",
                    de: "your-email@example.com" // メールアドレスを指定
                }
            });
            let translatedText = response.data.responseData.translatedText;

            // 不要なタグを削除
            translatedText = translatedText.replace(/<[^>]*>/g, "");

            return translatedText;
        } catch (error) {
            return "翻訳に失敗しました";
        }
    }

    // メッセージを送信する関数
    function sendChatMessage(text) {
        if (!text || !input || !submit) return;
        input.value = text;
        submit.click();
    }

    // Enterキーを監視して翻訳して送信
    input.addEventListener("keydown", async (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Enterキーによるデフォルト送信を防止
            await handleTranslationAndSend();
        }
    });
})();
