// ==UserScript==
// @name         Pixiv Tag Extractor (with copy function)
// @name:zh-TW   Pixiv 標籤提取器 (含複製功能)
// @name:zh-CN   Pixiv 标籤提取器 (含複製功能)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Click a button to extract tags from the current Pixiv artwork and get a copy option.
// @description:zh-TW  點擊按鈕後，獲取當前 Pixiv 作品的標籤，並提供複製選項。
// @description:zh-CN  点击按钮后，获取当前 Pixiv 作品的标签，并提供复制选项。
// @author       您的名字
// @match        https://www.pixiv.net/artworks/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546416/Pixiv%20Tag%20Extractor%20%28with%20copy%20function%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546416/Pixiv%20Tag%20Extractor%20%28with%20copy%20function%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Modal 相關的 DOM 元素和函數 ---
    let tagModal = null;
    let tagTextarea = null;
    let copyButton = null;
    let closeButton = null;

    function createTagModal() {
        // 創建 Modal 的外層容器
        tagModal = document.createElement('div');
        tagModal.style.position = 'fixed';
        tagModal.style.top = '0';
        tagModal.style.left = '0';
        tagModal.style.width = '100%';
        tagModal.style.height = '100%';
        tagModal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 半透明黑色背景
        tagModal.style.display = 'flex';
        tagModal.style.justifyContent = 'center';
        tagModal.style.alignItems = 'center';
        tagModal.style.zIndex = '10000'; // 確保在最上層

        // 創建 Modal 的內容區域
        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.padding = '30px';
        modalContent.style.borderRadius = '8px';
        modalContent.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        modalContent.style.textAlign = 'center';
        modalContent.style.maxWidth = '500px';
        modalContent.style.width = '80%';

        // Modal 標題
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = '提取到的作品標籤';
        modalTitle.style.marginBottom = '20px';
        modalTitle.style.color = '#333';
        modalContent.appendChild(modalTitle);

        // 顯示標籤的 textarea
        tagTextarea = document.createElement('textarea');
        tagTextarea.readOnly = true; // 設為唯讀
        tagTextarea.style.width = '100%';
        tagTextarea.style.minHeight = '150px';
        tagTextarea.style.marginBottom = '20px';
        tagTextarea.style.padding = '10px';
        tagTextarea.style.border = '1px solid #ccc';
        tagTextarea.style.borderRadius = '4px';
        tagTextarea.style.fontSize = '14px';
        tagTextarea.style.boxSizing = 'border-box'; // 確保 padding 不影響總寬度
        tagTextarea.style.resize = 'vertical'; // 允許垂直調整大小
        modalContent.appendChild(tagTextarea);

        // 創建按鈕容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-around'; // 按鈕之間均勻分布
        buttonContainer.style.marginTop = '15px';

        // 複製按鈕
        copyButton = document.createElement('button');
        copyButton.textContent = '複製到剪貼簿';
        copyButton.style.padding = '10px 20px';
        copyButton.style.backgroundColor = '#28a745'; // 綠色
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '5px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.fontSize = '16px';
        copyButton.addEventListener('click', copyTagsToClipboard);
        buttonContainer.appendChild(copyButton);

        // 關閉按鈕
        closeButton = document.createElement('button');
        closeButton.textContent = '關閉';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#6c757d'; // 灰色
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '16px';
        closeButton.addEventListener('click', hideTagModal);
        buttonContainer.appendChild(closeButton);

        modalContent.appendChild(buttonContainer);
        tagModal.appendChild(modalContent);

        // 將 Modal 添加到頁面
        document.body.appendChild(tagModal);
    }

    function showTagModal(tags) {
        if (!tagModal) {
            createTagModal();
        }
        tagTextarea.value = tags.join('\n');
        tagModal.style.display = 'flex'; // 顯示 Modal
    }

    function hideTagModal() {
        if (tagModal) {
            tagModal.style.display = 'none'; // 隱藏 Modal
        }
    }

    function copyTagsToClipboard() {
        if (tagTextarea) {
            tagTextarea.select(); // 選取 textarea 中的所有文字
            try {
                // 使用 navigator.clipboard API 進行複製 (較新且推薦的方式)
                navigator.clipboard.writeText(tagTextarea.value).then(() => {
                    // 複製成功後的提示
                    copyButton.textContent = '已複製！';
                    copyButton.style.backgroundColor = '#17a2b8'; // 淺藍色表示成功
                    setTimeout(() => {
                        copyButton.textContent = '複製到剪貼簿';
                        copyButton.style.backgroundColor = '#28a745'; // 恢復原色
                    }, 2000);
                }).catch(err => {
                    console.error('複製失敗:', err);
                    // 複製失敗的提示
                    copyButton.textContent = '複製失敗';
                    copyButton.style.backgroundColor = '#dc3545'; // 紅色表示失敗
                    setTimeout(() => {
                        copyButton.textContent = '複製到剪貼簿';
                        copyButton.style.backgroundColor = '#28a745'; // 恢復原色
                    }, 2000);
                });
            } catch (e) {
                // 舊瀏覽器或無效上下文的回退方式
                const textArea = document.createElement("textarea");
                textArea.value = tagTextarea.value;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    copyButton.textContent = '已複製！';
                    copyButton.style.backgroundColor = '#17a2b8';
                    setTimeout(() => {
                        copyButton.textContent = '複製到剪貼簿';
                        copyButton.style.backgroundColor = '#28a745';
                    }, 2000);
                } catch (err) {
                    console.error('複製失敗 (execCommand):', err);
                    copyButton.textContent = '複製失敗';
                    copyButton.style.backgroundColor = '#dc3545';
                    setTimeout(() => {
                        copyButton.textContent = '複製到剪貼簿';
                        copyButton.style.backgroundColor = '#28a745';
                    }, 2000);
                }
                document.body.removeChild(textArea);
            }
        }
    }

    // --- 主要腳本邏輯 ---

    // 創建一個按鈕來觸發標籤提取
    const extractButton = document.createElement('button');
    extractButton.textContent = '獲取作品標籤';

    // 設定按鈕的樣式，使其固定在頁面右上角
    extractButton.style.position = 'fixed';
    extractButton.style.top = '10px';
    extractButton.style.right = '10px';
    extractButton.style.zIndex = '1000'; // 確保按鈕在最上層
    extractButton.style.padding = '10px 15px';
    extractButton.style.backgroundColor = '#007bff'; // 藍色背景
    extractButton.style.color = 'white'; // 白色文字
    extractButton.style.border = 'none';
    extractButton.style.borderRadius = '5px';
    extractButton.style.cursor = 'pointer';
    extractButton.style.fontSize = '16px';

    // 為按鈕添加點擊事件監聽器
    extractButton.addEventListener('click', function() {
        // 查找所有具有特定類別的標籤元素
        const tagElements = document.getElementsByClassName('gtm-new-work-tag-event-click');
        const tags = [];

        // 遍歷找到的所有標籤元素
        for (let i = 0; i < tagElements.length; i++) {
            // 獲取每個標籤的文字內容 (例如 "バニー")
            tags.push(tagElements[i].textContent);
        }

        // 在瀏覽器控制台中顯示提取到的標籤
        console.log('提取到的標籤:', tags);

        // 顯示自定義 Modal
        if (tags.length > 0) {
            showTagModal(tags);
        } else {
            alert('未找到任何標籤。'); // 如果沒有找到標籤，仍然使用 alert
        }
    });

    // 將按鈕添加到頁面的 body 中
    document.body.appendChild(extractButton);

})();
