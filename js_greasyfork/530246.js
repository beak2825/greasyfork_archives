// ==UserScript==
// @name         自動下單零股
// @namespace    https://github.com/zxc88645/TdccAuto/blob/main/SinotradeStockHelper.js
// @version      1.0.5
// @description  將需要購買的零股代號一次輸入到下方多行區塊後(建議整理好代號後一次貼上去)，將會自動為您下單到暫存。
// @author       Owen
// @match        https://www.sinotrade.com.tw/inside/Batch_Order
// @icon         https://raw.githubusercontent.com/zxc88645/TdccAuto/refs/heads/main/img/TdccAuto_icon.png
// @grant        none
// @license      MIT
// @homepage     https://github.com/zxc88645/TdccAuto
// @downloadURL https://update.greasyfork.org/scripts/530246/%E8%87%AA%E5%8B%95%E4%B8%8B%E5%96%AE%E9%9B%B6%E8%82%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/530246/%E8%87%AA%E5%8B%95%E4%B8%8B%E5%96%AE%E9%9B%B6%E8%82%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const selectors = {
        input: "#app-container input",
        button: "#app-container button.midbtn.submit",
        selectionMenu: "#ui-id-2",
        select: "#app-container .stockItemContainer select",
        priceButton: "#app-container .stockItemContainer button.priceBtn.smallBtn.high"
    };

    const bodyWrapper = document.querySelector(".body-wrapper");
    if (!bodyWrapper) return;

    const textArea = document.createElement("textarea");
    Object.assign(textArea.style, { width: "200px", height: "500px", display: "block", marginLeft: "50px" });
    textArea.placeholder = "輸入數字，每行一筆...";
    bodyWrapper.appendChild(textArea);

    let isProcessing = false;

    async function processNext() {
        if (isProcessing) return;
        isProcessing = true;

        const inputElement = document.querySelector(selectors.input);
        const buttonElement = document.querySelector(selectors.button);
        const selectionMenu = document.querySelector(selectors.selectionMenu);
        const selectElement = document.querySelector(selectors.select);
        const priceButton = document.querySelector(selectors.priceButton);

        if (!inputElement || !buttonElement || !selectionMenu || !selectElement || !priceButton) {
            console.warn("必要的 DOM 元素未找到，流程終止");
            isProcessing = false;
            return;
        }

        let lines = textArea.value.split("\n").map(line => line.trim()).filter(line => line);
        if (lines.length === 0) {
            isProcessing = false;
            return;
        }

        let value = lines.shift();
        textArea.value = lines.join("\n");

        await simulateTyping(inputElement, value);
        await sleep(1000);

        if (selectionMenu.childNodes.length > 0 && (selectionMenu.childNodes[0].innerText).startsWith(value + ' ')) {
            // 顯示該元素文字
            console.log(`[選擇] ${selectionMenu.childNodes[0].innerText}`);

            selectionMenu.childNodes[0].click();
            await sleep(500);
        } else {
            console.warn("所查詢股票不存在或不正確，流程中斷");
            isProcessing = false;
            return;
        }

        if (!(await selectOptionByValue(selectElement, "C"))) {
            console.warn("選項 C 不存在或不可見，流程中斷");
            isProcessing = false;
            return;
        }

        await sleep(500);
        await simulateClick(priceButton); // 點擊"漲"按鈕
        await sleep(300);
        await simulateClick(buttonElement); // 點擊"暫存"按鈕
        await sleep(100);
        isProcessing = false;
    }

    async function simulateTyping(element, text) {
        if (!element) return;
        element.focus();
        element.value = "";

        for (let char of text) {
            element.dispatchEvent(new KeyboardEvent("keydown", { key: char, bubbles: true }));
            element.value += char;
            element.dispatchEvent(new InputEvent("input", { bubbles: true }));
            element.dispatchEvent(new KeyboardEvent("keyup", { key: char, bubbles: true }));
            await sleep(50);
        }
    }

    async function selectOptionByValue(selectElement, value) {
        if (!selectElement) return false;

        let option = Array.from(selectElement.options).find(opt => opt.value === value && opt.style.display !== "none");
        if (option) {
            selectElement.value = value;
            selectElement.dispatchEvent(new Event("change", { bubbles: true }));
            console.log(`成功選擇值為 "${value}" 的選項`);
            return true;
        }
        return false;
    }

    async function simulateClick(element) {
        if (!element) return;
        element.click();
        await sleep(100);
    }

    setInterval(() => {
        if (!isProcessing && textArea.value.trim()) {
            processNext();
        }
    }, 1000);
})();