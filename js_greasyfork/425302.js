// ==UserScript==
// @name         Auto import ID number
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  when opening PDF auto import ID number.
// @author       Adokun
// @match        https://mail.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425302/Auto%20import%20ID%20number.user.js
// @updateURL https://update.greasyfork.org/scripts/425302/Auto%20import%20ID%20number.meta.js
// ==/UserScript==

// 將IDNumber改成自己的身分證
const IDNumber = "A1234567890";

function handlePasswordDialog(dialogElement) {
    observer.disconnect();
    setTimeout(() => {
        try {
            const driveInfoElement = document.querySelector('#drive-active-item-info');
            if (!driveInfoElement) {
                console.warn("警告：未找到元素 #drive-active-item-info。");
                return;
            }
            const fileInfo = JSON.parse(driveInfoElement.innerText);
            if (fileInfo && typeof fileInfo.title === 'string' && /\.pdf$/i.test(fileInfo.title)) {
                const passwordInput = dialogElement.querySelector('[type="password"]');
                if (passwordInput) {
                    // console.log(`偵測到 PDF 檔案：${fileInfo.title}。正在嘗試自動填入密碼。`);
                    passwordInput.value = IDNumber; // 填入密碼。
                    passwordInput.dispatchEvent(new Event('change')); // 觸發 'change' 事件，模擬使用者輸入。
                    // console.log("密碼欄位已成功填入並觸發 change 事件。");
                }
                else {
                    console.warn("警告：在 PDF 密碼對話框中未找到密碼輸入元素。");
                }
            }
        }
        catch (error) {
            console.error("錯誤：處理 PDF 密碼對話框時發生問題。", error);
        }
        finally {
            // 無論是否發生錯誤，都重新連接觀察器，繼續監聽 DOM 變化。
            observer.observe(document.body, { childList: true, subtree: true, attributes: true });
        }
    }, 1500);
}
// 創建一個 MutationObserver 實例來監聽 DOM 樹的變化。
// MutationObserver 比 DOMSubtreeModified 更加高效和推薦。
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
            // 檢查被修改的目標元素本身是否為對話框。
            const targetElement = mutation.target instanceof Element ? mutation.target : null;
            if (targetElement && targetElement.getAttribute('role') === 'dialog' && targetElement.classList.contains('aLF-aPX-axU')) {
                handlePasswordDialog(targetElement);
                return;
            }
            // 檢查所有新加入的節點，看是否有符合條件的對話框。
            mutation.addedNodes.forEach(node => {
                if (node instanceof Element && node.getAttribute('role') === 'dialog' && node.classList.contains('aLF-aPX-axU')) {
                    handlePasswordDialog(node);
                    return;
                }
            });
        }
    }
});
// 開始觀察整個 document body，監聽其子節點、所有後代子樹以及屬性的變化。
observer.observe(document.body, { childList: true, subtree: true, attributes: true });