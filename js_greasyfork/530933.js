// ==UserScript==
// @name         巴哈姆特刪信助手
// @namespace    https://github.com/vios10009
// @version      1.2
// @description  一鍵刪除指定的通知信(預設刪除動畫瘋獲獎通知、【勇者福利社】成功獲得抽獎資格通知信)
// @author       vios10009
// @match        https://mailbox.gamer.com.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/530933/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%88%AA%E4%BF%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/530933/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%88%AA%E4%BF%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

let bhSlave = document.getElementById("BH-slave");
let newButton = document.createElement("button");

// 自訂要刪除的信件標題列表
const defaultTitles = [
    "動畫瘋獲獎通知",
    "【勇者福利社】成功獲得抽獎資格通知信"
];
// 從 GM_getValue 取得已儲存的標題，如果沒有則使用預設標題
let titlesToDelete = GM_getValue('titlesToDelete', defaultTitles);

newButton.innerText = "刪除本頁的指定通知信";
newButton.style.cssText = `
  width: 100%;
  margin-bottom: 10px;
  height: 2.5rem;
  background-color: rgb(215, 84, 84);
  border-radius: 5px;
  border: 1px solid rgb(179, 59, 59);
  color: white;
`;
newButton.onclick = () => { deleteLetters(titlesToDelete) };
bhSlave.insertBefore(newButton, bhSlave.querySelector("h5"));

let deleteCount = 0; // 記錄刪除的信件數量

function deleteLetters(titles) {
    let bhTable = document.querySelector(".BH-table");
    let letters = bhTable.querySelectorAll("tr.readU, tr.readR");
    let found = false;

    for (let letter of letters) {
        let mailTitle = letter.querySelector(".mailTitle").innerText;
        if (titles.includes(mailTitle)) {
            letter.querySelector("input[type=checkbox]").checked = true;
            found = true;
            deleteCount++; // 累計刪除的信件數量
        }
    }

    if (found) {
        // 顯示按鈕區域
        document.getElementById("mail-action-area").style.display = "block";

        // 啟用刪除按鈕
        let deleteButton = document.querySelector("[onclick='mailbox.delMail();']");
        if (deleteButton) {
            deleteButton.classList.remove("is-disabled");
            deleteButton.click(); // 觸發刪除

            setTimeout(() => {
                let confirmButton = document.querySelector(".btn-box .btn-primary");
                if (confirmButton) {
                    confirmButton.click(); // 自動點擊「確定」

                    // 等待彈窗處理完畢後再點擊「關閉」
                    setTimeout(() => {
                        let closeButton = document.querySelector(".btn-box .btn-danger");
                        if (closeButton) {
                            closeButton.click(); // 自動點擊「關閉」
                        }
                        // 刪除後重新刪除目前頁面項目
                        setTimeout(() => deleteLetters(titles), 1000);
                    }, 1500);
                }
            }, 500);
        }
    } else {
        // 若當前頁面無可刪除的信件則結束並告知總共刪除的數量
        if (deleteCount == 0) {
            alert(`目前頁面沒有可刪除的信件。`);
        } else {
            alert(`刪除完成！總共刪除了 ${deleteCount} 封指定通知信。`);
        }
    }
}

// 新增要刪除的標題
GM_registerMenuCommand("新增要刪除的信件標題", () => {
    let newTitle = prompt("輸入要刪除的信件標題:");
    if (newTitle && !titlesToDelete.includes(newTitle)) {
        titlesToDelete.push(newTitle);
        GM_setValue('titlesToDelete', titlesToDelete);
        alert("已新增標題：" + newTitle);
    } else {
        alert("標題無效或重複！");
    }
});

// 刪除要刪除的標題
GM_registerMenuCommand("刪除要刪除的信件標題", () => {
    let titleToDelete = prompt("輸入要刪除的信件標題:");
    let index = titlesToDelete.indexOf(titleToDelete);
    if (index > -1) {
        titlesToDelete.splice(index, 1);
        GM_setValue('titlesToDelete', titlesToDelete);
        alert("已刪除標題：" + titleToDelete);
    } else {
        alert("找不到該標題！");
    }
});

// 顯示目前設定的標題
GM_registerMenuCommand("顯示目前設定的標題", () => {
    if (titlesToDelete.length > 0) {
        let titleList = titlesToDelete.join("\n");

        // 建立彈出視窗的 textarea
        let textarea = document.createElement("textarea");
        textarea.value = titleList;
        textarea.style.width = "400px";
        textarea.style.height = "200px";
        textarea.style.position = "fixed";
        textarea.style.top = "50%";
        textarea.style.left = "50%";
        textarea.style.transform = "translate(-50%, -50%)";
        textarea.style.zIndex = "9999";
        textarea.style.padding = "10px";
        textarea.style.border = "1px solid #ccc";
        textarea.style.background = "white";
        textarea.style.fontSize = "14px";

        document.body.appendChild(textarea);
        textarea.select(); // 自動選取內容，方便複製

        // 當點擊其他地方時，自動關閉 textarea
        textarea.onblur = () => document.body.removeChild(textarea);
    } else {
        alert("目前沒有設定任何標題。");
    }
});
