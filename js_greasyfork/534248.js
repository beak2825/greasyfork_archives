// ==UserScript==
// @name         Messenger 韩文自动翻译中文
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Messenger聊天界面，韩文消息自动翻译成中文，显示在原文下面！
// @author       ChatGPT
// @match        https://www.messenger.com/*
// @grant        GM_xmlhttpRequest
// @connect      translate.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/534248/Messenger%20%E9%9F%A9%E6%96%87%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/534248/Messenger%20%E9%9F%A9%E6%96%87%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetLang = "zh";
    const sourceLang = "ko";

    function translate(text, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURIComponent(text),
            onload: function(response) {
                const result = JSON.parse(response.responseText);
                callback(result[0][0][0]);
            }
        });
    }

    function addTranslations() {
        const messages = document.querySelectorAll('div[dir="auto"]:not(.translated)');
        messages.forEach(msg => {
            const text = msg.innerText.trim();
            if (text.length > 0 && /[가-힣]/.test(text)) {
                translate(text, function(translatedText) {
                    const translationDiv = document.createElement("div");
                    translationDiv.style.color = "#888";
                    translationDiv.style.fontSize = "12px";
                    translationDiv.style.marginTop = "4px";
                    translationDiv.innerText = translatedText;
                    msg.appendChild(translationDiv);
                    msg.classList.add("translated");
                });
            }
        });
    }

    setInterval(addTranslations, 2000);

})();
