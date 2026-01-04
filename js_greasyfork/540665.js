// ==UserScript==
// @name         SideM 한글 번역기 (Google Sheet 연동)
// @namespace    https://yourproject.example/
// @version      0.4
// @description  SideM 사이트의 텍스트를 구글 시트를 기반으로 한국어로 번역합니다
// @match        https://idolmaster-official.jp/sidem*
// @match        https://asobistory.asobistore.jp/*
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540665/SideM%20%ED%95%9C%EA%B8%80%20%EB%B2%88%EC%97%AD%EA%B8%B0%20%28Google%20Sheet%20%EC%97%B0%EB%8F%99%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540665/SideM%20%ED%95%9C%EA%B8%80%20%EB%B2%88%EC%97%AD%EA%B8%B0%20%28Google%20Sheet%20%EC%97%B0%EB%8F%99%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const url = `https://script.google.com/macros/s/AKfycbxJhW0m5rqwn7dxP7bi82xiwUakYTUxTGLO1H7GrQEHp45hfdh_MsX2zO3TrWZD4BEjPg/exec?token=apple_mango_123`;
    const CACHE_KEY = 'sidem_translation_cache';
    const translationMap = new Map();

    // 실제 번역 적용 로직
    function replaceTextNodes() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            const text = node.textContent.trim();
            if (translationMap.has(text)) {
                node.textContent = translationMap.get(text);
            }
        }
    }

    function initTranslation(data) {
        for (const [sheetName, entries] of Object.entries(data)) {
            for (const entry of entries) {
                const original = entry.original?.trim();
                const translated = entry.translated?.trim();

                if (original && translated) {
                    if (!translationMap.has(original)) {
                        translationMap.set(original, translated);
                    } else {
                        //console.warn(`⚠️ 중복 번역: "${original}" → 기존: "${translationMap.get(original)}", 새 값: "${translated}"`);
                    }
                }
            }
        }

        // console.log('[✅ translationMap 초기화 완료]');
        // for (const [key, value] of translationMap.entries()) {
        //     console.log(`"${key}" → "${value}"`);
        // }

        replaceTextNodes();

        const observer = new MutationObserver(replaceTextNodes);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 캐시 불러오기
    function loadFromCache() {
        try {
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                console.log('📦 로컬 캐시로부터 번역 적용');
                initTranslation(parsed);
            }
        } catch (e) {
            console.warn('❌ 캐시 파싱 실패:', e);
        }
    }

    function fetchTranslationData() {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (res) {
                try {
                    if (res.status === 200) {
                        const data = JSON.parse(res.responseText);
                        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
                        console.log('🌐 원격 데이터 수신 및 캐시 갱신');
                        initTranslation(data);
                    } else if (res.status === 304) {
                        console.log('🟢 서버 데이터 변경 없음 (304)');
                    } else {
                        console.error('❌ 데이터 요청 오류:', res.status);
                    }

                } catch (e) {
                    console.error("❌ JSON 파싱 실패:", e);
                }
            },
            onerror: function (err) {
                console.error("❌ 번역 데이터 요청 실패:", err);
            }
        });
    }

    // 초기화
    function main() {
        // 1. 캐시 번역 시도
        loadFromCache();
        // 2~4. 최신 데이터 확인 및 갱신
        fetchTranslationData();
        const observer = new MutationObserver(replaceTextNodes);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    main();
})();
