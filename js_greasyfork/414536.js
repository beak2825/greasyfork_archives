// ==UserScript==
// @name         YouTube会员聊天过滤
// @namespace    Grefork
// @version      1.0.0
// @description  过滤出YouTube直播频道会员的聊天信息。在菜单上点击"Launch"启用。
// @author       Grefork
// @match        *://*.youtube.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/414536/YouTube%E4%BC%9A%E5%91%98%E8%81%8A%E5%A4%A9%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/414536/YouTube%E4%BC%9A%E5%91%98%E8%81%8A%E5%A4%A9%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
if (window.location.pathname !== "/live_chat") {
    return;
  }

  function launch() {
    const chatMessagesEl = document.querySelector("#chat-messages");
    if (!chatMessagesEl) {
      return;
    }

    const itemsEl = document.querySelector(
      "#items.yt-live-chat-item-list-renderer"
    );
    if (!itemsEl) {
      return;
    }

    const chatEl = document.querySelector("#chat");
    if (!itemsEl) {
      return;
    }

    const filterDivEl = document.createElement("div");
    filterDivEl.style.flexGrow = 1;
    filterDivEl.style.flexBasis = 0;
    filterDivEl.style.overflowY = "auto";
    chatMessagesEl.prepend(filterDivEl);

    const observer = new MutationObserver((mutationsList) => {

      mutationsList.forEach((rec) => {
        rec.addedNodes.forEach((node) => {
          const authorNameEl = node.querySelector("#author-name");

          const isMember = node.querySelector(".member");
          if (!isMember) {
              return
          };

          filterDivEl.appendChild(node);
          while (filterDivEl.children.length > 8) {
              filterDivEl.children[0].remove();
          }
        });
      });
    });
    observer.observe(itemsEl, {
      childList: true,
    });
  }

  const commandId = GM_registerMenuCommand("Launch", () => {
    launch();
    GM_unregisterMenuCommand(commandId);
  });

  window.addEventListener("unload", () => {
    GM_unregisterMenuCommand(commandId);
  });
})();