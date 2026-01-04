// ==UserScript==
// @name         Pin Chats in ChatGPT
// @version      20240522
// @description  Allows pinning chats in the ChatGPT sidebar
// @author       jamesdeluk
// @match        https://chatgpt.com/*
// @grant        none
// @namespace https://greasyfork.org/users/242246
// @downloadURL https://update.greasyfork.org/scripts/495809/Pin%20Chats%20in%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/495809/Pin%20Chats%20in%20ChatGPT.meta.js
// ==/UserScript==

(function () {
  "use strict";

  async function waitForElement(selector) {
    while (!document.querySelector(selector)) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }

    // Load pinned chats from local storage
    var pinnedChats = JSON.parse(localStorage.getItem("pinnedChats") || "[]");

    // Add toggle pin button to each chat item
    function addPinButton(chatItem, chatId, chatTitle) {
      var pinButton = document.createElement("button");
      pinButton.innerHTML = "📌";
      pinButton.className = "pin-button";
      pinButton.title = "Toggle pin";
      pinButton.onclick = function (event) {
        event.preventDefault();
        event.stopPropagation();
        togglePinChat(chatId, chatTitle, pinButton);
      };
      var chatTextDiv = chatItem.querySelector(
        ".relative.grow.overflow-hidden.whitespace-nowrap"
      );
      chatTextDiv.parentElement.insertBefore(pinButton, chatTextDiv);
    }

    // Toggle pin/unpin chat function
    function togglePinChat(chatId, chatTitle, button) {
      var chatIndex = pinnedChats.findIndex((chat) => chat.id === chatId);
      if (chatIndex === -1) {
        pinnedChats.push({ id: chatId, title: chatTitle });
      } else {
        pinnedChats.splice(chatIndex, 1);
      }
      localStorage.setItem("pinnedChats", JSON.stringify(pinnedChats));
      renderPinnedChats();
    }

    // Render pinned chats
    function renderPinnedChats() {
      var todaySection = ''
      var headers = document.querySelectorAll("h3");
      for (var i = 0; i < headers.length; i++) {
        if (headers[i].textContent.trim() === "Today") {
          todaySection = headers[i].closest("div");
        }
      }
      var pinnedSection = document.getElementById("pinned-chats-section");

      if (!pinnedSection) {
        pinnedSection = document.createElement("div");
        pinnedSection.id = "pinned-chats-section";
        todaySection.parentElement.insertBefore(pinnedSection, todaySection);
      }

      pinnedSection.innerHTML = "";
      var header = document.createElement("h3");
      header.className =
        "pb-2 pt-3 px-2 text-xs font-medium text-ellipsis overflow-hidden break-all text-token-text-secondary";
      header.innerText = "Pinned";
      pinnedSection.appendChild(header);

      pinnedChats.forEach((chat) => {
        var chatItem = document.createElement("li");
        chatItem.className =
          "group relative rounded-lg active:opacity-90 hover:bg-token-sidebar-surface-secondary";
        chatItem.innerHTML = `
                <a href="/c/${chat.id}" class="flex items-center gap-2 p-2">
                    <div class="relative grow overflow-hidden whitespace-nowrap">${chat.title}
                        <div class="absolute bottom-0 right-0 top-0 bg-gradient-to-l to-transparent from-token-sidebar-surface-primary group-hover:from-token-sidebar-surface-secondary w-8 from-0% group-hover:w-20"></div>
                    </div>
                </a>
            `;
        pinnedSection.appendChild(chatItem);
      });
    }

    // Initial rendering of pinned chats
    renderPinnedChats();

    // Observe sidebar for new chat items
    var sidebarObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.matches("li")) {
              var chatId = node
                .querySelector("a")
                .getAttribute("href")
                .split("/")
                .pop();
              var chatTitle = node.querySelector(
                ".relative.grow.overflow-hidden.whitespace-nowrap"
              ).innerText;
              addPinButton(node, chatId, chatTitle);
            }
          });
        }
      });
    });

    var sidebar = document.querySelector("nav");
    if (sidebar) {
      sidebarObserver.observe(sidebar, { childList: true, subtree: true });

      // Add pin buttons to existing chat items
      sidebar.querySelectorAll("li").forEach((chatItem) => {
        var chatId = chatItem
          .querySelector("a")
          .getAttribute("href")
          .split("/")
          .pop();
        var chatTitle = chatItem.querySelector(
          ".relative.grow.overflow-hidden.whitespace-nowrap"
        ).innerText;
        addPinButton(chatItem, chatId, chatTitle);
      });
    }
  }

  waitForElement(".relative.grow.overflow-hidden.whitespace-nowrap");
})();
