// ==UserScript==
// @name        Pin ChatGPT Chats
// @namespace   Violentmonkey Scripts
// @match       https://chatgpt.com/*
// @grant       none
// @version     1.0
// @esversion   10
// @description Pin/Unpin ChatGPT chats with local-storage persistence
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/545705/Pin%20ChatGPT%20Chats.user.js
// @updateURL https://update.greasyfork.org/scripts/545705/Pin%20ChatGPT%20Chats.meta.js
// ==/UserScript==

(function () {
  const STORAGE_KEY = "pinnedChats";
  let scheduled = false;
  let lastPins = JSON.stringify(getPinnedChats());
  const processedChats = new WeakSet();
  let pinnedHeader = null;

  // --- Storage Helpers ---
  function getPinnedChats() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (err) {
      return [];
    }
  }
  function savePinnedChats(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
  function isPinned(chatId) {
    return getPinnedChats().includes(chatId);
  }
  function togglePin(chatId) {
    let pins = getPinnedChats();
    if (pins.includes(chatId)) {
      pins = pins.filter(x => x !== chatId);
    } else {
      pins.push(chatId);
    }
    savePinnedChats(pins);
    lastPins = JSON.stringify(pins);
    sortChats();
  }

  // --- Utility: Extract Chat ID from href ---
  function extractChatId(href) {
    if (!href) return null;
    const match = href.match(/\/c\/([^/?#]+)/);
    return match ? match[1] : null;
  }

  // Inject style for hover behavior
  const style = document.createElement("style");
  style.textContent = `
    .chat-pin.unpinned {
      visibility: hidden;
    }
    a:hover .chat-pin.unpinned {
      visibility: visible;
    }
`;
  document.head.appendChild(style);

  // --- Create Pin Button ---
  function createPin(chatId, pinned) {
    const span = document.createElement("span");
    span.innerText = pinned ? "★" : "☆";
    span.className = "chat-pin" + (pinned ? " pinned" : " unpinned");
    span.style.cursor = "pointer";
    span.style.marginLeft = "6px";
    span.style.fontSize = "14px";
    span.style.userSelect = "none";

    span.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      togglePin(chatId);
      span.replaceWith(createPin(chatId, !pinned));
    });

    return span;
  }

  // --- Add Pins to Chats ---
  function addPins(container) {
    const chats = container.querySelectorAll("a[href^='/c/']");
    chats.forEach(chat => {
      if (processedChats.has(chat)) return;

      const chatId = extractChatId(chat.getAttribute("href"));
      if (!chatId) return;

      chat.append(createPin(chatId, isPinned(chatId)));
      processedChats.add(chat);
    });
  }

  // --- Create/Ensure Pinned Header ---
  function ensurePinnedHeader(chatContainer) {
    if (!pinnedHeader) {
      pinnedHeader = document.createElement("div");
      pinnedHeader.textContent = "📌 Pinned";
      pinnedHeader.style.fontWeight = "bold";
      pinnedHeader.style.margin = "8px 0";
      pinnedHeader.style.padding = "4px 8px";
      pinnedHeader.style.background = "rgba(0,0,0,0.05)";
      pinnedHeader.style.borderRadius = "6px";
    }
    if (!chatContainer.contains(pinnedHeader)) {
      chatContainer.prepend(pinnedHeader);
    }
  }

  // --- Sort Chats with Header ---
  function sortChats() {
    const chatContainer = document.querySelectorAll("aside")[2];
    if (!chatContainer) return;

    const chats = Array.from(chatContainer.querySelectorAll("a[href^='/c/']"));
    const pins = getPinnedChats();

    const pinnedChats = chats.filter(c => pins.includes(extractChatId(c.getAttribute("href"))));
    const unpinnedChats = chats.filter(c => !pins.includes(extractChatId(c.getAttribute("href"))));

    chatContainer.innerHTML = ""; // clear list

    if (pinnedChats.length > 0) {
      ensurePinnedHeader(chatContainer);
      chatContainer.appendChild(pinnedHeader);

      // Add pinned chats
      pinnedChats.forEach(c => chatContainer.appendChild(c));

      // Separator line
      const hr = document.createElement("hr");
      hr.style.border = "none";
      hr.style.borderTop = "1px solid rgba(255,255,255,0.8)";
      hr.style.margin = "6px 0";
      chatContainer.appendChild(hr);
    }

    // Add remaining chats
    unpinnedChats.forEach(c => chatContainer.appendChild(c));
  }


  // --- Observer (throttled) ---
  function update() {
    scheduled = false;

    const chatContainer = document.querySelectorAll("aside")[2];
    if (!chatContainer) return;

    addPins(chatContainer);

    const currentPins = JSON.stringify(getPinnedChats());
    if (currentPins !== lastPins) {
      lastPins = currentPins;
      sortChats();
    }
  }

  const observer = new MutationObserver(() => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // --- Initial Render on Page Load ---
  function init() {
    const chatContainer = document.querySelectorAll("aside")[2];
    if (!chatContainer) {
      requestAnimationFrame(init);
      return;
    }
    addPins(chatContainer);
    sortChats(); // immediately reorder and add header on reload
  }
  init();
})();
