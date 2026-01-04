// ==UserScript==
// @name         Facebook狗推专用
// @namespace    http://tampermonkey.net/
// @version      2.2.2
// @description  Facebook一键脚本，支持点赞、移除推荐，并根据好友数量条件手动控制页面。提供UI按钮以控制开关，状态跨页面持久化保存，开关状态UI美化。
// @author       亦安
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490096/Facebook%E7%8B%97%E6%8E%A8%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/490096/Facebook%E7%8B%97%E6%8E%A8%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==



(function () {
  "use strict";

  // 读取初始状态
  let isChecking = localStorage.getItem("fb-friendCheckEnabled") === "true";
  let checkInterval;

  const settings = {
    likeButton: {
      text: "一键点赞",
      bottom: "50px",
      action: likeAction,
    },
    removeButton: {
      text: "移除推荐",
      bottom: "100px",
      action: removeRecommendations,
    },
    listPullupButton: {
      text: "一键列表上拉",
      bottom: "150px",
      action: listPullupAction,
    },
  };

  function toggleFriendCheck() {
    isChecking = !isChecking;
    localStorage.setItem("fb-friendCheckEnabled", isChecking.toString());
    updateButtonState();
    manageFriendCheck();
  }

  function updateButtonState() {
    const button = document.getElementById("fb-enhanced-checkFriendButton");
    if (button) {
      button.textContent = isChecking ? "停止检查好友数量" : "开始检查好友数量";
    }
  }

  function manageFriendCheck() {
    if (isChecking) {
      startFriendCheck();
    } else {
      if (checkInterval) clearInterval(checkInterval);
    }
  }

  function startFriendCheck() {
    if (checkInterval) clearInterval(checkInterval);
    checkInterval = setInterval(checkFriends, 500);
  }

  function checkFriends() {
    const links = document.querySelectorAll("a");
    for (let link of links) {
      if (link.textContent.includes("位好友")) {
        const friendCount = parseInt(link.textContent.split(" ")[0].replace(/,/g, ""), 10);
        if (friendCount < 10 || friendCount > 1000) {
          window.close();
          return;
        }
      }
    }
  }

  function createEnhancedButton() {
    let button = document.createElement("button");
    button.id = "fb-enhanced-checkFriendButton";
    button.textContent = isChecking ? "停止检查好友数量" : "开始检查好友数量";
    button.style = "position: fixed; bottom: 200px; right: 20px; z-index: 10000; padding: 10px 15px; font-size: 16px; border: none; border-radius: 5px; color: white; cursor: pointer; background-color: #4267B2;";
    button.onclick = toggleFriendCheck;
    document.body.appendChild(button);
  }

  function createButton({ text, bottom, action }) {
    let btn = document.createElement("button");
    btn.textContent = text;
    btn.style = `position: fixed; bottom: ${bottom}; right: 20px; z-index: 10000; padding: 10px 15px; font-size: 16px; border: none; border-radius: 5px; color: white; cursor: pointer; background-color: #4267B2;`;
    btn.addEventListener("click", action);
    document.body.appendChild(btn);
    return btn;
  }

  // 以下为代码2中的其他功能实现
  function likeAction() {
    const likeButtons = Array.from(
      document.querySelectorAll('div[aria-label="赞"][role="button"]'),
    );
    const numberOfLikes = Math.floor(Math.random() * 8) + 3;
    for (let i = 0; i < numberOfLikes; i++) {
      const randomIndex = Math.floor(Math.random() * likeButtons.length);
      const buttonToClick = likeButtons[randomIndex];
      if (buttonToClick) {
        setTimeout(
          () => buttonToClick.click(),
          Math.random() * (2000 - 1000) + 1000,
        );
        likeButtons.splice(randomIndex, 1);
      }
    }
  }

  function removeRecommendations() {
    setInterval(() => {
      const buttons = document.querySelectorAll('div[role="none"]');
      buttons.forEach(function (button) {
        if (
          button.innerText.includes("移除") ||
          button.innerText.includes("删除")
        ) {
          button.click();
        }
      });
    }, 1000);
  }
function listPullupAction() {
    const targetClassName =
      "x6s0dn4 xkh2ocl x1q0q8m5 x1qhh985 xu3j5b3 xcfux6l x26u7qi xm0m39n x13fuv20 x972fbf x9f619 x78zum5 x1q0g3np x1iyjqo2 xs83m0k x1qughib xat24cr x11i5rnm x1mh8g0r xdj266r xexx8yu x1n2onr6 x1ja2u2z";
    const elements = document.querySelectorAll(
      `div.${targetClassName.replace(/\s/g, ".")}`,
    );
    const friendLinks = [];
    elements.forEach((element) => {
      if (element.textContent.includes("添加好友")) {
        const link = element.querySelector("a");
        if (link && link.href) {
          friendLinks.push(link.href);
        }
      }
    });

    function openLinksInBatches(links, batchSize, interval) {
      let index = 0;
      function openBatch() {
        const batch = links.slice(index, index + batchSize);
        batch.forEach((link) => window.open(link, "_blank"));
        index += batchSize;
        if (index < links.length) {
          setTimeout(openBatch, interval);
        }
      }
      openBatch();
    }
    openLinksInBatches(friendLinks, 10, 20000);
}

  function initialize() {
    Object.values(settings).forEach((setting) => {
      createButton(setting);
    });
    createEnhancedButton(); // 创建增强检查好友数量的按钮
    updateButtonState();
    manageFriendCheck();
  }

  initialize();
})();
