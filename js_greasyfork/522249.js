// ==UserScript==
// @name         ISBN步驟3:編輯申請資料-共同基本欄位(紙本書)
// @namespace    http://tampermonkey.net/
// @version      1.27
// @description  當進入特定頁面時自動選取表單項目
// @match        https://isbn.ncl.edu.tw/NEW_ISBNNet/J61_MyAppISBN.php?&Pact=Step3
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522249/ISBN%E6%AD%A5%E9%A9%9F3%3A%E7%B7%A8%E8%BC%AF%E7%94%B3%E8%AB%8B%E8%B3%87%E6%96%99-%E5%85%B1%E5%90%8C%E5%9F%BA%E6%9C%AC%E6%AC%84%E4%BD%8D%28%E7%B4%99%E6%9C%AC%E6%9B%B8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522249/ISBN%E6%AD%A5%E9%A9%9F3%3A%E7%B7%A8%E8%BC%AF%E7%94%B3%E8%AB%8B%E8%B3%87%E6%96%99-%E5%85%B1%E5%90%8C%E5%9F%BA%E6%9C%AC%E6%AC%84%E4%BD%8D%28%E7%B4%99%E6%9C%AC%E6%9B%B8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待頁面加載後執行
    function initializeForm() {
        // 1. 設置 "作品語文" 選項為 "繁體中文"
        const pubLanguageSelect = document.getElementById('F3_PubLanguage');
        if (pubLanguageSelect) {
            pubLanguageSelect.value = '131';
            pubLanguageSelect.dispatchEvent(new Event('change'));
            console.log("已自動選擇作品語文：繁體中文");
        }

        // 2. 設置 "適讀對象" 選項為 "成人(一般)"
        const audienceSelect = document.getElementById('F4_Audience');
        if (audienceSelect) {
            audienceSelect.value = '161';
            audienceSelect.dispatchEvent(new Event('change'));
            console.log("已自動選擇適讀對象：成人(一般)");
        }

        // 3. 設置 "常用分類" 選項為 "考試用書"
        const formTypeSelect = document.getElementById('F5_FormType');
        if (formTypeSelect) {
            formTypeSelect.value = '176';
            formTypeSelect.dispatchEvent(new Event('change'));
            console.log("已自動選擇常用分類：考試用書");
        }

        // 4. 設置 "分級註記" 選項為 "普遍級"
        const limitTypeSelect = document.getElementById('F7_LimitType');
        if (limitTypeSelect) {
            limitTypeSelect.value = '126';
            limitTypeSelect.dispatchEvent(new Event('change'));
            console.log("已自動選擇分級註記：普遍級");
        }

        // 5. 設置 "是否為翻譯著作" 選項為 "否"
        const translationNoRadio = document.getElementById('F8_YN_Translate_N');
        if (translationNoRadio) {
            translationNoRadio.checked = true;
            translationNoRadio.dispatchEvent(new Event('change'));
            console.log("已自動選擇是否為翻譯著作：否");
        }

        // 6. 設置 "國家語言" 選項為 "臺灣華語"
        const countryLanguageSelect = document.getElementById('F3_CountryLanguage');
        if (countryLanguageSelect) {
            countryLanguageSelect.value = '271';
            countryLanguageSelect.dispatchEvent(new Event('change'));
            console.log("已自動選擇國家語言：臺灣華語");
        }

        // 7. 當書名及副書名欄位包含 "套書" 文字時，自動填寫版次為 "第1版"
        const titleInput = document.getElementById('FO_Title');
        const versionInput = document.getElementById('FO_Version');
        if (titleInput && versionInput) {
            titleInput.addEventListener('input', function() {
                if (titleInput.value.includes('套書')) {
                    versionInput.value = '第1版';
                    versionInput.dispatchEvent(new Event('input'));
                    console.log("書名包含'套書'，已自動填寫版次為：第1版");
                }
            });
        }
    }

    // 檢查DOM是否已完全加載，避免需要手動刷新
    let observer = new MutationObserver(() => {
        if (document.readyState === 'complete') {
            initializeForm();
            observer.disconnect(); // 停止監聽
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();
