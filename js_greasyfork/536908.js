// ==UserScript==
// @name         sniperex168.blogspot.com LocalStorage 選項記錄 匯出/匯入工具
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  點擊時才偵測 localStorage.KEY，並提供匯出/匯入 JSON 功能（改善 script 延遲載入問題）
// @author       HrJasn
// @match        *://sniperex168.blogspot.com/*
// @grant        none
// @license      GPL3
// @license      Copyright HrJasn
// @downloadURL https://update.greasyfork.org/scripts/536908/sniperex168blogspotcom%20LocalStorage%20%E9%81%B8%E9%A0%85%E8%A8%98%E9%8C%84%20%E5%8C%AF%E5%87%BA%E5%8C%AF%E5%85%A5%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/536908/sniperex168blogspotcom%20LocalStorage%20%E9%81%B8%E9%A0%85%E8%A8%98%E9%8C%84%20%E5%8C%AF%E5%87%BA%E5%8C%AF%E5%85%A5%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

console.log("載入 sniperex168.blogspot.com LocalStorage 選項記錄 匯出匯入工具");

(function () {
    console.log("執行 sniperex168.blogspot.com LocalStorage 選項記錄 匯出匯入工具");
    // ✅ 只有點擊時才找 script 內的 localStorage key
    function findLocalStorageKey() {

        // 在 UserScript 中「共用」的變數
        let foundKey = null;

        // 取得原本的 localStorage 物件
        const originalLocalStorage = window.localStorage;

        // 用 Proxy 包裝整個 localStorage，攔截所有屬性賦值（包括 .ED9Kaidata = ... 這種）
        const proxyLocalStorage = new Proxy(originalLocalStorage, {
            set(target, prop, value) {
                console.log(`✅ localStorage 被修改: key=${String(prop)}, value=${value}`);
                if (!foundKey) {
                    foundKey = String(prop);
                    console.log(`✅ 找到的 localStorage Key: ${foundKey}`);
                    cleanup();
                }
                target[prop] = value; // 實際執行賦值
                return true;
            }
        });

        // 替換 window.localStorage 為 Proxy 物件
        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            enumerable: true,
            get() {
                return proxyLocalStorage;
            }
        });

        const confirmElements = document.querySelectorAll('.confirm');

        function cleanup() {
            // 恢復原本的 localStorage
            Object.defineProperty(window, 'localStorage', {
                configurable: true,
                enumerable: true,
                value: originalLocalStorage
            });
            console.log('🛑 已恢復原本的 localStorage 物件');
        }

        (async function autoTriggerEachConfirm() {
            for (let el of confirmElements) {
                if (foundKey) break;

                const originalChecked = el.checked;

                // 嘗試改變勾選
                el.checked = !el.checked;
                console.log('🛑 嘗試異動勾選狀態', el, originalChecked, el.checked);
                el.dispatchEvent(new Event('change', { bubbles: true }));

                await new Promise(r => setTimeout(r, 100));

                // 恢復勾選
                console.log('🛑 恢復勾選狀態', el, el.checked, originalChecked);
                el.checked = originalChecked;
                el.dispatchEvent(new Event('change', { bubbles: true }));

                await new Promise(r => setTimeout(r, 100));

                if (foundKey) break;
            }

            if (!foundKey) {
                alert('❌ 沒有找到任何 localStorage Key');
                cleanup();
            }
        })();

        return foundKey;
    }


    // 加入樣式
    const style = document.createElement('style');
    style.textContent = `
      #json-buttons {
        position: fixed !important;
        bottom: 100px !important;
        right: 20px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 10px !important;
        z-index: 2147483647 !important;
      }

      .json-btn {
        padding: 8px 12px;
        font-size: 14px;
        background-color: #777;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }

      .json-btn:hover {
        background-color: #000;
      }
    `;
    document.head.appendChild(style);

    // 建立按鈕區塊
    const container = document.createElement('div');
    container.id = 'json-buttons';

    const exportBtn = document.createElement('button');
    exportBtn.className = 'json-btn';
    exportBtn.textContent = '匯出選項記錄JSON';

    const importBtn = document.createElement('button');
    importBtn.className = 'json-btn';
    importBtn.textContent = '匯入選項記錄JSON';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';

    container.appendChild(exportBtn);
    container.appendChild(importBtn);
    container.appendChild(fileInput);
    document.body.appendChild(container);

    // 匯出功能
    exportBtn.addEventListener('click', () => {
        const detectedKey = findLocalStorageKey();
        if (!detectedKey) {
            alert(`找不到 localStorage.Key`);
            return;
        }

        let data = localStorage.getItem(detectedKey);
        if (!data) {
            alert(`找不到 localStorage.${detectedKey} 的資料`);
            return;
        }
        let jsondata = JSON.parse(data);
        jsondata = [...new Set(jsondata)];
        jsondata.sort();
        data = JSON.stringify(jsondata);

        // 產生時間戳記 yyyyMMdd-HHmmss
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

        // 網址轉為合法檔名
        const urlPart = window.location.href.replace(/[^a-zA-Z0-9]+/g, '_');

        // 完整檔名
        const filename = `${urlPart}_${detectedKey}-${timestamp}.json`;

        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });


    // 匯入功能
    importBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const detectedKey = findLocalStorageKey();
        if (!detectedKey) return;

        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                localStorage.setItem(detectedKey, JSON.stringify(json));

                const confirms = document.querySelectorAll('.confirm');
                let storagetemp = JSON.parse(localStorage.getItem(detectedKey));
                if (storagetemp !== undefined) {
                    confirms.forEach((elem) => {
                        let chkstts = false;
                        storagetemp.forEach((item) => {
                            if (elem.name == item) {
                                chkstts = true;
                                elem.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center" // 可選值: "start", "center", "end", "nearest"
                                });
                            }
                        });
                        elem.checked = chkstts;
                    });
                }
                storagetemp = [...new Set(storagetemp)];
                storagetemp.sort();
                console.log(`匯入成功：已寫入 localStorage.${detectedKey}`);
            } catch (err) {
                alert('匯入失敗：',err);
                console.log('匯入失敗：',err);
            }
        };
        reader.readAsText(file);
    });
})();
