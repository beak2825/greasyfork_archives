// ==UserScript==
// @name         套書冊數、裝訂、CIP自動填寫
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自動依次填寫各冊冊數欄位，填入 1, 2, 3 等數字，自動勾選平裝和CIP選擇"否"的選項，除非這些欄位已經填寫或選擇過了。
// @author       You
// @match        https://isbn.ncl.edu.tw/NEW_ISBNNet/J61_MyAppISBN.php?&Pact=Step4
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522258/%E5%A5%97%E6%9B%B8%E5%86%8A%E6%95%B8%E3%80%81%E8%A3%9D%E8%A8%82%E3%80%81CIP%E8%87%AA%E5%8B%95%E5%A1%AB%E5%AF%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/522258/%E5%A5%97%E6%9B%B8%E5%86%8A%E6%95%B8%E3%80%81%E8%A3%9D%E8%A8%82%E3%80%81CIP%E8%87%AA%E5%8B%95%E5%A1%AB%E5%AF%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fillVolumeFields() {
        // 確認 "只申請套號" 的選項是否已選中
        const applySetNumber = document.querySelector("input[name='FO_AppType'][value='92']");
        if (applySetNumber && applySetNumber.checked) {
            // 選擇所有 "第 冊，" 的冊數欄位，這些欄位夾在文字 "第" 和 "冊，" 之間
            const volumeFields = document.querySelectorAll("input[name='T2_Volume[]']");
            volumeFields.forEach((field, index) => {
                if (!field.value) {
                    field.value = index + 1; // 只有在欄位未填寫的情況下才填入值
                }
            });

            // 自動勾選 "本書裝訂方式(必填)" 中的 "平裝" 選項
            const paperbackOption = document.querySelector("input[name^='EX_BindingType'][id='BindingType16']");
            if (paperbackOption && !paperbackOption.checked) {
                paperbackOption.checked = true; // 只有當尚未勾選的時候才進行勾選
            }

            // 自動選擇 "是否申請 CIP" 為 "否"
            const applyCIPNoOption = document.querySelector("input[name='FO_AppCIP'][value='3']");
            if (applyCIPNoOption && !applyCIPNoOption.checked) {
                applyCIPNoOption.checked = true; // 只有當尚未勾選 "否" 的時候才進行勾選
            }
        }
    }

    // 確保所有資源完全加載後執行
    function onPageReady() {
        // 初次加載時執行一次填寫
        setTimeout(fillVolumeFields, 1000); // 延遲 1 秒以確保頁面完全渲染

        // 使用 MutationObserver 觀察 DOM 變化，確保每次頁面更新時正確填寫
        const targetNode = document.querySelector("div.booksetlist");
        if (targetNode) {
            const config = { childList: true, subtree: true };

            const callback = function(mutationsList, observer) {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        fillVolumeFields();
                    }
                }
            };

            const observer = new MutationObserver(callback);
            observer.observe(targetNode, config);
        }

        // 監聽加號按鈕點擊事件，動態填寫新添加的冊數欄位
        document.body.addEventListener('click', function(event) {
            if (event.target && event.target.closest(".btn-primary.mb-2 i.bi-plus-square-fill")) {
                setTimeout(fillVolumeFields, 500); // 等待新元素渲染後填寫
            }
        });

        // 監聽選擇申請類型的選項變更，當選中 "只申請套號" 時執行填寫
        document.querySelectorAll("input[name='FO_AppType']").forEach((radio) => {
            radio.addEventListener('change', fillVolumeFields);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onPageReady);
    } else {
        onPageReady();
    }
})();
