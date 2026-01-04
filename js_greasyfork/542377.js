// ==UserScript==
// @name        Grok Chat Workspace Icon Sync
// @namespace   imxitiz's-Script
// @version     1.5.4
// @grant       none
// @license     GNU GPLv3
// @author      imxitiz
// @contributor imxitiz
// @match       https://grok.com/*
// @description Automatically syncs and displays workspace icons next to chat history items on Grok Chat. Includes features for mapping, storing, and visually enhancing chat navigation with workspace icons.
// @downloadURL https://update.greasyfork.org/scripts/542377/Grok%20Chat%20Workspace%20Icon%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/542377/Grok%20Chat%20Workspace%20Icon%20Sync.meta.js
// ==/UserScript==

(() => {
  // Initialize or load icon map from localStorage
  let iconMap = JSON.parse(localStorage.getItem("chatIcons") || "{}");
  let iconMapChanged = false;

  // Function to update icon map with new workspace icons
  function updateIconMap() {
    const workspaceLink = document.querySelector('main a[href^="/project/"]');
    if (workspaceLink) {
      const splits = location.href.split("/");
      const chatId = splits[3] === "chat"? splits[4] : splits[3] === "project"? new URLSearchParams(location.search).get("chat"): null;
      const iconSvg = workspaceLink.querySelector('svg');
      if (chatId && iconSvg && !iconMap[chatId]) {
        const iconHtml = iconSvg.outerHTML;
        iconMap[chatId] = iconHtml;
        localStorage.setItem("chatIcons", JSON.stringify(iconMap));
        iconMapChanged = true;
      }
    }
  }

  function createIconElement(iconHTML) {
    const icon = document.createElement("span");
    icon.className = "icon-added";
    icon.innerHTML = iconHTML;
    icon.style.display = "inline-block";
    icon.style.marginRight = "5px";
    icon.style.verticalAlign = "middle";
    return icon;
  }

  // Function to apply icons to chat items
  function applyIcons() {
    if (iconMapChanged) {
      iconMap = JSON.parse(localStorage.getItem("chatIcons") || "{}");
      iconMapChanged = false; // Reset immediately after use
    }

    const chatItems = document.querySelectorAll('a[href^="/chat/"]');
    chatItems.forEach((chat) => {
      const chatId = chat.getAttribute("href").split("/")[2];

      if (!iconMap[chatId]) return;

      const iconAlreadyThere = chat.querySelector(".icon-added");
      if (iconAlreadyThere) return;

      const chatTextSpan = chat.querySelector("span");

      const iconElement = createIconElement(iconMap[chatId]);

      if (chatTextSpan) {
        chatTextSpan.insertBefore(iconElement, chatTextSpan.firstChild);
      } else {
        const siblingDiv = chat.nextElementSibling;
        if (!siblingDiv) return;

        // Find the target span insertion point
        const target = siblingDiv.querySelector(".flex.items-center");
        if (!target || target.querySelector(".icon-added")) return;

        const iconElement = createIconElement(iconMap[chatId]);
        target.insertBefore(iconElement, target.firstChild);
      }
    });
  }

  // Main sync function combining both steps
  function syncIcons() {
    updateIconMap();
    applyIcons();
  }

  // Run after full page load with a delay for DOM stability
  window.onload = () => {
    setTimeout(syncIcons, 3000); // 3000ms delay to ensure full render
  };

  // Handle URL changes with a delay for dynamic content
  window.addEventListener("popstate", () => {
    setTimeout(syncIcons, 5000); // 5000ms delay to ensure DOM stability
  });

  setInterval(applyIcons, 2000); // Every 2 seconds, adjust as needed

  // Periodic check for real-time updates
  setInterval(syncIcons, 10000); // Every 10 seconds, adjust as needed
})();
