// ==UserScript==
// @name         加入時段批次點擊工具（家和一鍵任務編組 最終版）
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  一鍵建立多個勤務項目：指揮官、傳令幕僚...，支援換行文字，新增「外宿」按鈕
// @match        http://172.31.150.13:8078/WebForm2.aspx?s=edit&k=*
// @match        http://172.31.150.13:8078/WebForm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533261/%E5%8A%A0%E5%85%A5%E6%99%82%E6%AE%B5%E6%89%B9%E6%AC%A1%E9%BB%9E%E6%93%8A%E5%B7%A5%E5%85%B7%EF%BC%88%E5%AE%B6%E5%92%8C%E4%B8%80%E9%8D%B5%E4%BB%BB%E5%8B%99%E7%B7%A8%E7%B5%84%20%E6%9C%80%E7%B5%82%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533261/%E5%8A%A0%E5%85%A5%E6%99%82%E6%AE%B5%E6%89%B9%E6%AC%A1%E9%BB%9E%E6%93%8A%E5%B7%A5%E5%85%B7%EF%BC%88%E5%AE%B6%E5%92%8C%E4%B8%80%E9%8D%B5%E4%BB%BB%E5%8B%99%E7%B7%A8%E7%B5%84%20%E6%9C%80%E7%B5%82%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const 任務項目 = [
    "指揮官",
    "傳令幕僚",
    "副指揮官",
    "副傳令幕僚",
    "安全官",
    "情報組",
    "作戰組",
    "後勤組",
    "火警值班",
    "護理師"
];

    async function 新增任務項目(itemNameValue) {
        const groupType = document.getElementById("listGroupType");
        if (!groupType) return alert("找不到 listGroupType");

        groupType.value = "2"; // 作戰編組
        groupType.dispatchEvent(new Event("change", { bubbles: true }));
        await delay(200);

        const itemName = document.getElementById("listItemName");
        if (!itemName) return alert("找不到 listItemName");

        itemName.value = itemNameValue;
        itemName.dispatchEvent(new Event("change", { bubbles: true }));
        await delay(200);

        const addBtn = document.getElementById("btnAddItem");
        if (addBtn) {
            addBtn.click();
            await delay(200);
        }
    }

    async function 家和一鍵任務編組() {
        for (let item of 任務項目) {
            await 新增任務項目(item);
        }
        alert("✅ 家和一鍵任務編組完成！");
    }

    async function batchClick(start, end) {
        for (let i = start; i <= end; i++) {
            const btn = document.getElementById(`gridGroupFightMan_Button${i}`);
            if (btn) {
                btn.click();
                await delay(300);
            }
        }
        const clearBtn = document.getElementById("listFireMan_btnClearFireMan");
        if (clearBtn) {
            clearBtn.click();
            await delay(200);
        }
        alert("點擊完成");
    }

    function createBtn(label, onClickFn, topOffset, isHTML = false) {
        const btn = document.createElement("button");
        if (isHTML) {
            btn.innerHTML = label;
        } else {
            btn.textContent = label;
        }

        btn.style.position = "fixed";
        btn.style.right = "20px";
        btn.style.top = `${topOffset}px`;
        btn.style.zIndex = "9999";
        btn.style.padding = "6px 12px";
        btn.style.marginBottom = "5px";
        btn.style.backgroundColor = "#007bff";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.borderRadius = "6px";
        btn.style.cursor = "pointer";
        btn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
        btn.addEventListener("click", onClickFn);
        document.body.appendChild(btn);
    }

    window.addEventListener("load", () => {
        createBtn("家和製作<br>一鍵任務編組", 家和一鍵任務編組, 320, true); // 排序6（換行）
        createBtn("全時段", () => batchClick(0, 23), 380);
        createBtn("外宿", () => batchClick(8, 17), 420); // ✅ 新增「外宿」
        createBtn("A班", () => batchClick(8, 13), 460);
        createBtn("B班", () => batchClick(14, 19), 500);
        createBtn("C班", () => batchClick(20, 23), 540);
        createBtn("D班", () => batchClick(0, 7), 580);
    });
})();
