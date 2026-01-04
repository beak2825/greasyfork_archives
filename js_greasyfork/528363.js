// ==UserScript==
// @name         DrrrChat Translator (English to Japanese, Bubble Translation)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  英語メッセージを日本語に翻訳し、翻訳も吹き出しで表示（日本語とURLはスキップ）
// @author       Grok (xAI)
// @match        http://drrrkari.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528363/DrrrChat%20Translator%20%28English%20to%20Japanese%2C%20Bubble%20Translation%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528363/DrrrChat%20Translator%20%28English%20to%20Japanese%2C%20Bubble%20Translation%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // MyMemory翻訳APIのエンドポイント
    const TRANSLATE_API_URL = 'https://api.mymemory.translated.net/get';

    // 英語かどうかを簡易判定（アルファベットが含まれるか）
    function isEnglish(text) {
        return /[a-zA-Z]/.test(text);
    }

    // URLが含まれるか判定
    function hasURL(text) {
        return /(http:\/\/|https:\/\/)/i.test(text);
    }

    // 翻訳機能の実装
    function translateMessages() {
        const talksDiv = document.getElementById('talks');
        if (!talksDiv) return;

        // 新しいメッセージを監視
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    const newMessageContainer = mutation.addedNodes[0];
                    const newMessage = newMessageContainer.querySelector('.bubble p.body');
                    if (newMessage) {
                        const originalText = newMessage.textContent;

                        // 英語かつURLを含まない場合のみ翻訳
                        if (isEnglish(originalText) && !hasURL(originalText)) {
                            fetch(`${TRANSLATE_API_URL}?q=${encodeURIComponent(originalText)}&langpair=en|ja`)
                                .then(response => response.json())
                                .then(data => {
                                    const translatedText = data.responseData.translatedText;
                                    // 翻訳を新しい吹き出しとして追加
                                    const translationBubble = `
                                        <dd>
                                            <div class="bubble">
                                                <p class="body" style="color: #fff; font-size: 0.9em; font-style: italic;">${translatedText}</p>
                                            </div>
                                        </dd>
                                    `;
                                    newMessageContainer.insertAdjacentHTML('beforeend', translationBubble);
                                })
                                .catch(error => {
                                    console.error('翻訳エラー:', error);
                                    const errorBubble = `
                                        <dd>
                                            <div class="bubble">
                                                <p class="body" style="color: #fff;">翻訳エラー</p>
                                            </div>
                                        </dd>
                                    `;
                                    newMessageContainer.insertAdjacentHTML('beforeend', errorBubble);
                                });
                        }
                    }
                }
            });
        });
        observer.observe(talksDiv, { childList: true, subtree: true });
    }

    // 既存のメッセージにも翻訳を適用（初回ロード時）
    function translateExistingMessages() {
        const talksDiv = document.getElementById('talks');
        if (!talksDiv) return;

        const messages = talksDiv.querySelectorAll('.talk');
        messages.forEach(messageContainer => {
            const message = messageContainer.querySelector('.bubble p.body');
            if (message) {
                const originalText = message.textContent;
                if (!originalText.includes('[') && isEnglish(originalText) && !hasURL(originalText)) { // 翻訳済みでないかつ英語かつURLなし
                    fetch(`${TRANSLATE_API_URL}?q=${encodeURIComponent(originalText)}&langpair=en|ja`)
                        .then(response => response.json())
                        .then(data => {
                            const translatedText = data.responseData.translatedText;
                            const translationBubble = `
                                <dd>
                                    <div class="bubble">
                                        <p class="body" style="color: #fff; font-size: 0.9em; font-style: italic;">${translatedText}</p>
                                    </div>
                                </dd>
                            `;
                            messageContainer.insertAdjacentHTML('beforeend', translationBubble);
                        })
                        .catch(() => {
                            const errorBubble = `
                                <dd>
                                    <div class="bubble">
                                        <p class="body" style="color: #fff;">翻訳エラー</p>
                                    </div>
                                </dd>
                            `;
                            messageContainer.insertAdjacentHTML('beforeend', errorBubble);
                        });
                }
            }
        });
    }

    // jQueryがロードされるのを待つ
    function waitForJQuery() {
        if (typeof jQuery === 'undefined') {
            setTimeout(waitForJQuery, 100);
        } else {
            translateExistingMessages(); // 既存メッセージを翻訳
            translateMessages(); // 新規メッセージを監視
        }
    }

    waitForJQuery();
})();