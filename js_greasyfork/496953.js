// ==UserScript==
// @name         動畫瘋隱藏觀看紀錄(簡潔版)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在每個卡片右上角新增隱藏按鈕，點擊後即可隱藏該卡片。點擊"觀看紀錄"可以切換顯示隱藏的卡片。
// @author       rarachi
// @match        https://ani.gamer.com.tw/viewList.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496953/%E5%8B%95%E7%95%AB%E7%98%8B%E9%9A%B1%E8%97%8F%E8%A7%80%E7%9C%8B%E7%B4%80%E9%8C%84%28%E7%B0%A1%E6%BD%94%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496953/%E5%8B%95%E7%95%AB%E7%98%8B%E9%9A%B1%E8%97%8F%E8%A7%80%E7%9C%8B%E7%B4%80%E9%8C%84%28%E7%B0%A1%E6%BD%94%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let showHidden = JSON.parse(localStorage.getItem("aniShowHidden") || "false");

  //隱藏紀錄按鈕
  const addCloseButton = (card) => {
    const closeButton = document.createElement("button");
    closeButton.textContent = "x";
    closeButton.style.position = "absolute";
    closeButton.style.right = "0";
    closeButton.style.top = "0";
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.opacity = "0";
    closeButton.onclick = () => {
      card.parentElement.style.display = "none";
      const animeTitle = card.querySelector(".history-anime-title").textContent;
      let hiddenCards = JSON.parse(localStorage.getItem("hiddenCards") || "[]");

      if (hiddenCards.includes(animeTitle)) {
        // 如果動畫已經在隱藏列表中，則從列表中移除
        const index = hiddenCards.indexOf(animeTitle);
        hiddenCards.splice(index, 1);
      } else {
        // 否則，將動畫添加到隱藏列表中
        hiddenCards.push(animeTitle);
      }
      localStorage.setItem("hiddenCards", JSON.stringify(hiddenCards));
    };

    card.style.position = "relative";
    card.appendChild(closeButton);
  };

  const animeCards = document.querySelectorAll(".anime-card");
  const animeTitlesInPage = Array.from(animeCards).map(
    (card) => card.querySelector(".history-anime-title").textContent
  );

  // 清除過期紀錄
  let hiddenCards = JSON.parse(localStorage.getItem("hiddenCards") || "[]");
  hiddenCards = hiddenCards.filter((animeTitle) =>
    animeTitlesInPage.includes(animeTitle)
  );
  localStorage.setItem("hiddenCards", JSON.stringify(hiddenCards));

  animeCards.forEach((card) => {
    const animeTitle = card.querySelector(".history-anime-title").textContent;
    addCloseButton(card);
    if (hiddenCards.includes(animeTitle)) {
      card.parentElement.style.display = showHidden ? "block" : "none";
    } else {
      card.parentElement.style.display = showHidden ? "none" : "block";
    }
  });

// 以"觀看紀錄"切換頁面
const themeTitle = document.querySelector(".theme-title");
themeTitle.style.cursor = "pointer"; 
themeTitle.addEventListener("click", () => {
  const currentShowHidden = JSON.parse(
    localStorage.getItem("aniShowHidden") || "false"
  );
  localStorage.setItem("aniShowHidden", JSON.stringify(!currentShowHidden));
  location.reload();
});
})();
