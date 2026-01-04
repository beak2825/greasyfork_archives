// ==UserScript==
// @name         妖火快捷删除帖子插件
// @namespace    https://yaohuo.me/
// @version      0.8
// @description  删除没有回头路，一切请三思后行。
// @author       ID12167
// @match        *yaohuo.me*
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/463877/%E5%A6%96%E7%81%AB%E5%BF%AB%E6%8D%B7%E5%88%A0%E9%99%A4%E5%B8%96%E5%AD%90%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/463877/%E5%A6%96%E7%81%AB%E5%BF%AB%E6%8D%B7%E5%88%A0%E9%99%A4%E5%B8%96%E5%AD%90%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


// 一键删除
const url = window.location.href;
const shouldExecute = url.includes("siteid") && url.includes("classid") && url.includes("key") && url.includes("type=pub");

if (shouldExecute) {
  const listData = document.querySelectorAll(".listdata");
  const deleteStyle = "padding: 2px 4px; font-size: 14px; border-radius: 15px / 50%; font-weight: bold; color: #fff; background: #ff8080; display: none; margin-bottom: 0px; line-height: 25px;";

  const toggleDeleteButton = document.createElement("input");
  toggleDeleteButton.type = "button";
  toggleDeleteButton.value = "打开一键删除";
  toggleDeleteButton.style.cssText = "padding: 2px 4px; font-size: 14px; background-color: #66ccff; border-radius: 10px / 50%; color: #fff; margin-left: auto;";
  
  const titleDiv = document.querySelector(".title");
  titleDiv.style.display = "flex";
  titleDiv.style.justifyContent = "space-between";
  titleDiv.appendChild(toggleDeleteButton);

  listData.forEach((data, index) => {
    const deleteSpan = document.createElement("span");
    deleteSpan.textContent = `删除${"①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮"[index]}`;
    deleteSpan.style.cssText = deleteStyle;

    data.appendChild(deleteSpan);

    deleteSpan.addEventListener("click", () => {
      const link = data.querySelector("a:nth-of-type(2)");
      const href = link.getAttribute("href");
      const pattern = /classid=(\d+).*id=(\d+)/;
      const match = pattern.exec(href);
      const classid = match[1];
      const id = match[2];

      window.location.href = `https://yaohuo.me/bbs/book_view_del.aspx?action=godel&id=${id}&siteid=1000&classid=${classid}&lpage=1`;
    });
  });

  toggleDeleteButton.addEventListener("click", toggleDelete);

  function toggleDelete() {
    const deleteSpans = document.querySelectorAll(".listdata span:not(.right)");
    const isOpen = toggleDeleteButton.value === "打开一键删除";

    deleteSpans.forEach(span => {
      span.style.display = isOpen ? "inline-block" : "none";
    });

    toggleDeleteButton.value = isOpen ? "关闭一键删除" : "打开一键删除";
  }
}

