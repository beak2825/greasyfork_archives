// ==UserScript==
// @name         巴哈姆特刪信幫手
// @namespace    https://github.com/DonkeyBear
// @version      0.1
// @description  一鍵刪除惱人的「動畫瘋獲獎通知」
// @author       DonkeyBear
// @match        https://mailbox.gamer.com.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458171/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%88%AA%E4%BF%A1%E5%B9%AB%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/458171/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%88%AA%E4%BF%A1%E5%B9%AB%E6%89%8B.meta.js
// ==/UserScript==

let bhSlave = document.getElementById("BH-slave");
let newButton = document.createElement("button");
newButton.innerText = "刪除本頁的「動畫瘋獲獎通知」";
newButton.style.cssText = `
  width: 100%;
  margin-bottom: 10px;
  height: 2.5rem;
  background-color: rgb(215, 84, 84);
  border-radius: 5px;
  border: 1px solid rgb(179, 59, 59);
  color: white;
`;
newButton.onclick = () => { deleteLetters("動畫瘋獲獎通知") }
bhSlave.insertBefore(newButton, bhSlave.querySelector("h5"));

function deleteLetters(title) {
  let bhTable = document.querySelector(".BH-table");
  let letters = bhTable.querySelectorAll("tr.readU, tr.readR");
  for (let letter of letters) {
    if (letter.querySelector(".mailTitle").innerText == title) {
      letter.querySelector("input[type=checkbox]").checked = true;
    }
  }
  document.querySelector("[onclick='mailbox.delMail()']").click();
}