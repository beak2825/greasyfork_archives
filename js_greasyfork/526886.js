// ==UserScript==
// @name         遠大黑魔法
// @namespace    http://tampermonkey.net/
// @version      2025-02-14
// @description  搶票我就沒輸過!
// @author       lee98064
// @match        https://ticketplus.com.tw/order/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ticketplus.com.tw
// @grant        none
// @license      Beerware
// @downloadURL https://update.greasyfork.org/scripts/526886/%E9%81%A0%E5%A4%A7%E9%BB%91%E9%AD%94%E6%B3%95.user.js
// @updateURL https://update.greasyfork.org/scripts/526886/%E9%81%A0%E5%A4%A7%E9%BB%91%E9%AD%94%E6%B3%95.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const _parse = JSON.parse;
  const parseSet = { status: "onsale", count: 100 };
  const keysToProcess = ["product", "ticketArea"];

  // 用來收集 ticketArea 的舊屬性資料 (狀態、數量)
  let infoMap = {};

  // 先建立開啟按鈕(一開始先隱藏，等浮動視窗被關閉後再顯示)
  let openPanelButton = document.createElement("button");
  openPanelButton.textContent = "Show Ticket Info";
  openPanelButton.style.position = "fixed";
  openPanelButton.style.top = "50px";
  openPanelButton.style.left = "10px";
  openPanelButton.style.zIndex = 999998;
  openPanelButton.style.fontSize = "14px";
  openPanelButton.style.display = "none";
  document.body.appendChild(openPanelButton);

  openPanelButton.addEventListener("click", () => {
    let infoPanel = document.getElementById("ticketAreaInfoPanel");
    if (infoPanel) {
      infoPanel.style.display = "block";
      openPanelButton.style.display = "none";
    }
  });

  // 覆蓋原生 JSON.parse
  JSON.parse = (text, reviver) => {
    // 每次 parse 都先清空 infoMap，避免舊資料殘留
    infoMap = {};
    const data = _parse(text, reviver);

    if (data && data.result) {
      keysToProcess.forEach((key) => {
        const items = data.result[key];
        if (Array.isArray(items)) {
          items.forEach((item) => {
            if (key === "ticketArea") {
              const areaId = item.id || "(no ID)";
              const areaName = item.ticketAreaName || "(no name)";
              if (!infoMap[areaId]) {
                infoMap[areaId] = {
                  areaName,
                  oldStatus: "No Data",
                  oldCount: 0
                };
              }
              // 收集舊值並覆寫
              Object.entries(parseSet).forEach(([parseKey, parseValue]) => {
                const oldValue = item[parseKey] ?? 0;
                if (parseKey === "status") infoMap[areaId].oldStatus = oldValue;
                if (parseKey === "count")  infoMap[areaId].oldCount  = oldValue;
                item[parseKey] = parseValue;
              });
            } else {
              // product 直接覆寫，不做顯示
              Object.entries(parseSet).forEach(([parseKey, parseValue]) => {
                item[parseKey] = parseValue;
              });
            }
          });
        }
      });
    }

    // 解析完後顯示或更新浮動視窗
    showFloatingWindow();
    return data;
  };

  // 建立或更新浮動視窗
  function showFloatingWindow() {
    // 如果已存在就直接更新，否則建立一個
    let infoPanel = document.getElementById("ticketAreaInfoPanel");
    if (!infoPanel) {
      infoPanel = createInfoPanel();
      document.body.appendChild(infoPanel);
    } else {
      // 確保關掉後又重新Parse時能再顯示
      infoPanel.style.display = "block";
      // 也把「開啟按鈕」隱藏
      openPanelButton.style.display = "none";
    }

    // 先清除舊內容
    infoPanel.querySelectorAll(".ticketAreaInfoItem").forEach(el => el.remove());

    // 填入新的資訊
    Object.keys(infoMap).forEach((areaId) => {
      const { areaName, oldStatus, oldCount } = infoMap[areaId];

      const wrapper = document.createElement("div");
      wrapper.className = "ticketAreaInfoItem";
      wrapper.style.marginBottom = "10px";

      // 區域名稱
      const nameP = document.createElement("p");
      nameP.textContent = areaName;
      nameP.style.fontWeight = "bold";
      nameP.style.margin = "0 0 4px";
      wrapper.appendChild(nameP);

      // 狀態
      const statusP = document.createElement("p");
      statusP.textContent = `目前狀態: ${oldStatus !== undefined ? oldStatus : "(undefined)"}`;
      statusP.style.margin = "0 0 4px";
      wrapper.appendChild(statusP);

      // 張數
      const countP = document.createElement("p");
      countP.textContent = `剩餘張數: ${oldCount !== undefined ? oldCount : "(undefined)"}`;
      countP.style.margin = "0";
      wrapper.appendChild(countP);

      infoPanel.appendChild(wrapper);
    });
  }

  // 建立浮動面板(可關閉、可拖曳)
  function createInfoPanel() {
    const panel = document.createElement("div");
    panel.id = "ticketAreaInfoPanel";
    // 基本樣式
    panel.style.position = "fixed";
    panel.style.top = "10px";
    panel.style.left = "10px";
    panel.style.backgroundColor = "#fff";
    panel.style.padding = "8px";
    panel.style.border = "1px solid #ccc";
    panel.style.zIndex = 999999;
    panel.style.width = "250px";
    panel.style.maxHeight = "500px";
    panel.style.overflowY = "auto";
    panel.style.fontSize = "14px";

    // 標題列 + 關閉按鈕
    const titleBar = document.createElement("div");
    titleBar.style.cursor = "move"; // 拖曳區域
    titleBar.style.display = "flex";
    titleBar.style.justifyContent = "space-between";
    titleBar.style.alignItems = "center";

    const title = document.createElement("span");
    title.textContent = "TicketArea Info";
    title.style.fontWeight = "bold";
    title.style.marginRight = "10px";

    // 關閉按鈕
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "X";
    closeBtn.style.border = "none";
    closeBtn.style.background = "#ccc";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontWeight = "bold";
    closeBtn.style.width = "25px";
    closeBtn.style.height = "25px";
    closeBtn.addEventListener("click", () => {
      panel.style.display = "none";
      // 顯示開啟按鈕
      openPanelButton.style.display = "block";
    });

    titleBar.appendChild(title);
    titleBar.appendChild(closeBtn);
    panel.appendChild(titleBar);

    // 使整個面板可拖曳
    makeDraggable(panel, titleBar);

    return panel;
  }

  // 讓元素可被拖曳
  function makeDraggable(elem, handle = null) {
    let offsetX = 0, offsetY = 0;
    let isDown = false;

    (handle || elem).addEventListener("mousedown", (e) => {
      e.preventDefault();
      isDown = true;
      offsetX = e.clientX - elem.offsetLeft;
      offsetY = e.clientY - elem.offsetTop;
      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    });

    function mouseMove(e) {
      if (!isDown) return;
      elem.style.left = (e.clientX - offsetX) + "px";
      elem.style.top  = (e.clientY - offsetY) + "px";
    }

    function mouseUp() {
      isDown = false;
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    }
  }
})();

//const _parse = JSON.parse;
// const parseSet = { status: "onsale", count: 100 };
// const keysToProcess = ["product", "ticketArea"];

// JSON.parse = (text, reviver) => {
//   const data = _parse(text, reviver);

//   if (data.result) {
//     keysToProcess.forEach((key) => {
//       const items = data.result[key];
//       if (Array.isArray(items)) {
//         items.forEach((item) => {
//           Object.entries(parseSet).forEach(([parseKey, parseValue]) => {
//             item[parseKey] = parseValue;
//           });
//         });
//       }
//     });
//   }

//   return data;
// };


// const _parse = JSON.parse;
// const parseSet = { status: "onsale", count: 100 };

// JSON.parse = (text, reviver) => {
//   const data = _parse(text, reviver);

//   if (data.result) {
//     if (Array.isArray(data.result.product)) {
//       data.result.product.forEach(item => {
//         Object.entries(parseSet).forEach(([key, value]) => {
//           item[key] = value;
//         });
//       });
//     }
//     if (Array.isArray(data.result.ticketArea)) {
//       data.result.ticketArea.forEach(item => {
//         Object.entries(parseSet).forEach(([key, value]) => {
//           item[key] = value;
//         });
//       });
//     }
//   }

//   return data;
// };