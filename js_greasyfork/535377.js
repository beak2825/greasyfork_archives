// ==UserScript==
// @name         Real-time Auto Translate with Bing API
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Automatically detect and translate text in real-time using Bing Translator API
// @author       You
// @match        *://asmr.one/*
// @grant        GM_xmlhttpRequest
// @connect      api.cognitive.microsofttranslator.com
// @downloadURL https://update.greasyfork.org/scripts/535377/Real-time%20Auto%20Translate%20with%20Bing%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/535377/Real-time%20Auto%20Translate%20with%20Bing%20API.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const apiKey = '3OsZQBpMBuGEFjcCZkpwpTk7ZAqMikpzOyFEikRtk1hEAiojfSCEJQQJ99BBACNns7RXJ3w3AAAbACOGcRPz';
    const targetElementId = 'lyric';
    const targetLanguage = 'ko';

    let isTranslating = false; // 번역 중인지 여부를 확인하는 플래그
    let previousText = ''; // 이전 텍스트를 저장할 변수

    // 요소가 로드될 때까지 대기
    function waitForElement() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                const targetElement = document.getElementById(targetElementId);
                if (targetElement) {
                    clearInterval(checkInterval);
                    resolve(targetElement);
                }
            }, 500); // 0.5초마다 확인
        });
    }

    async function init() {
        const targetElement = await waitForElement();

        // MutationObserver 설정
        const observer = new MutationObserver((mutations) => {
            if (!isTranslating) {
                const currentText = targetElement.innerText.trim();
                const filteredText = currentText[0] === '#' ? currentText.slice(1) : currentText;
                if (filteredText && filteredText !== previousText) { // 텍스트가 있고, 이전 텍스트와 다를 경우만 처리
                    previousText = filteredText; // 현재 텍스트를 저장
                    translateText(filteredText, targetElement, observer);
                }
            }
        });

        observer.observe(targetElement, {
            childList: true, // 자식 노드의 추가/삭제만 감지
        });

        // 초기 텍스트 번역
        translateText(targetElement.innerText, targetElement, observer);
    }

    function translateText(text, targetElement, observer) {
        if (!text.trim()) return;

        isTranslating = true; // 번역 시작
        observer.disconnect(); // MutationObserver 중지

        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLanguage}`,
            headers: {
                'Ocp-Apim-Subscription-Key': apiKey,
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Region': 'koreacentral'
            },
            data: JSON.stringify([{ text: text }]),
            onload: function (response) {
                try {
                    //console.log(response);
                    const translatedText = JSON.parse(response.responseText)[0].translations[0].text;
                    targetElement.innerText = translatedText; // 번역된 텍스트로 대체
                } catch (e) {
                    console.error('Failed to parse API response:', e);
                } finally {
                    isTranslating = false; // 번역 완료
                    observer.observe(targetElement, { childList: true }); // MutationObserver 다시 시작
                }
            },
            onerror: function (error) {
                console.error('Translation failed:', error);
                isTranslating = false; // 오류 발생 시 플래그 해제
                observer.observe(targetElement, { childList: true }); // MutationObserver 다시 시작
            },
        });
    }

    init();
})();