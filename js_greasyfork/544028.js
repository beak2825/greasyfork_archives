// ==UserScript==
// @name         Telegram Text Copier
// @name:en      Telegram Text Copier
// @name:tr      Telegram Metin Kopyalama
// @name:zh-CN   Telegram 文字复制器
// @name:zh-TW   Telegram 文字複製器
// @name:ru      Telegram: Копирование текста
// @version      1.0.1
// @namespace    https://github.com/ibryapici/telegram-text-copier
// @description  Telegram web uygulamasında içeriğin kaydedilmesini kısıtlayan özel kanallardan metin kopyalamayı etkinleştirir.
// @description:en  Enables text copying on the Telegram webapp from private channels that restrict saving content.
// @description:ru  Позволяет копировать текст в веб-приложении Telegram из частных каналов, которые ограничивают сохранение контента.
// @description:zh-CN 在禁止保存内容的Telegram私密频道中允许复制文字。
// @description:zh-TW 在禁止儲存內容的 Telegram 私密頻道中允許複製文字。
// @author       İbrahim Yapıcı & Cursor
// @license      GNU GPLv3
// @website      https://github.com/ibryapici/telegram-text-copier
// @match        https://web.telegram.org/*
// @match        https://webk.telegram.org/*
// @match        https://webz.telegram.org/*
// @icon         https://img.icons8.com/material-outlined/48/copy.png
// @downloadURL https://update.greasyfork.org/scripts/544028/Telegram%20Text%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/544028/Telegram%20Text%20Copier.meta.js
// ==/UserScript==

(function () {
  'use strict'; // Always good practice to include

  const logger = {
    info: (message) => {
      console.log(`[Tel Copier] ${message}`);
    },
    error: (message, error = null) => { // Added optional error parameter
      if (error) {
        console.error(`[Tel Copier] ${message}`, error);
      } else {
        console.error(`[Tel Copier] ${message}`);
      }
    },
  };

  const COPY_ICON_K = "\uE94D"; // Unicode for copy icon in webK
  const REFRESH_DELAY = 300; // Slightly reduced delay for quicker response
  let lastRightClickedMessageText = null; // Stores text from the message last right-clicked

  /**
   * Copies the given text to the clipboard and provides visual feedback.
   * @param {string} text The text to copy.
   * @param {HTMLElement} button The button element that triggered the copy.
   */
  const tel_copy_text = (text, button) => {
    if (!text || text.trim() === "") {
      logger.info("No text to copy.");
      return;
    }

    navigator.clipboard.writeText(text).then(
      () => {
        logger.info("Text copied to clipboard.");
        const originalText = button.textContent;
        // Store original display style if it's not inline
        const originalDisplay = button.style.display;
        button.textContent = "Copied!";
        button.style.display = 'inline-block'; // Ensure text is visible for "Copied!"
        button.style.width = 'auto'; // Adjust width to fit text

        // Restore original text and style after a delay
        setTimeout(() => {
          button.textContent = originalText;
          button.style.display = originalDisplay;
          button.style.width = ''; // Reset width
        }, 1500);
      },
      (err) => {
        logger.error("Failed to copy text to clipboard:", err);
        // Provide visual feedback for failure if needed
        const originalText = button.textContent;
        button.textContent = "Failed!";
        button.style.color = 'red';
        setTimeout(() => {
          button.textContent = originalText;
          button.style.color = '';
        }, 1500);
      }
    );
  };

  /**
   * Sets up a context menu listener on a message element to capture its text.
   * @param {HTMLElement} messageEl The main message container element.
   * @param {HTMLElement} textEl The element containing the text to copy.
   */
  const setupCopyListeners = (messageEl, textEl) => {
    messageEl.addEventListener("contextmenu", (e) => {
      // Ensure we only capture text if it's the actual message content being right-clicked
      // and not other elements within the message bubble (like links, media, etc.)
      if (textEl && textEl.contains(e.target)) {
        lastRightClickedMessageText = textEl.innerText;
        // logger.info("Captured text for context menu: " + lastRightClickedMessageText.substring(0, 50) + "...");
      } else {
        lastRightClickedMessageText = null; // Clear if not right-clicking actual text
      }
    });

    // Clear the stored text when context menu is closed or clicked elsewhere
    document.addEventListener('click', (e) => {
      // Check if click is outside any context menu
      const contextMenuA = document.querySelector(".ContextMenu");
      const contextMenuK = document.querySelector("#bubble-contextmenu");
      if ((contextMenuA && !contextMenuA.contains(e.target)) || (contextMenuK && !contextMenuK.contains(e.target))) {
        lastRightClickedMessageText = null;
      }
    }, true); // Use capture phase to ensure it runs before the context menu is removed
  };

  /**
   * Adds a hover-sensitive copy button to messages in Telegram Web Z (webz.telegram.org).
   * @param {HTMLElement} messageEl The message container element.
   * @param {HTMLElement} textEl The element containing the text to copy.
   */
  const addHoverCopyButtonZ = (messageEl, textEl) => {
    // Only add button if text content is meaningful
    if (!textEl || !textEl.innerText.trim()) return;

    // Use a unique class to identify our button to prevent re-adding
    if (messageEl.querySelector('.tel-copy-button-z')) {
      return;
    }

    const bubble = messageEl.querySelector(".bubble");
    if (!bubble) return;

    const copyButton = document.createElement("button");
    copyButton.className = "Button tiny secondary round tel-copy-button tel-copy-button-z";
    copyButton.innerHTML = '<i class="icon icon-copy"></i>';
    Object.assign(copyButton.style, {
      position: "absolute",
      right: "5px",
      bottom: "5px",
      zIndex: 100, // Ensure it's above other elements
      opacity: 0,
      transition: "opacity 0.2s ease-in-out", // Smoother transition
      pointerEvents: 'none', // Initially non-interactive until hover
    });

    copyButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      tel_copy_text(textEl.innerText, copyButton);
    };

    // Ensure bubble has relative positioning for absolute button
    bubble.style.position = "relative";
    bubble.append(copyButton);

    bubble.addEventListener("mouseenter", () => {
      copyButton.style.opacity = "1";
      copyButton.style.pointerEvents = 'auto'; // Make interactive on hover
    });
    bubble.addEventListener("mouseleave", () => {
      copyButton.style.opacity = "0";
      copyButton.style.pointerEvents = 'none'; // Make non-interactive off hover
    });
  };

  /**
   * Adds a hover-sensitive copy button to messages in Telegram Web K (webk.telegram.org).
   * @param {HTMLElement} bubble The message bubble element.
   * @param {HTMLElement} textEl The element containing the text to copy.
   */
  const addHoverCopyButtonK = (bubble, textEl) => {
    // Only add button if text content is meaningful
    if (!textEl || !textEl.innerText.trim()) return;

    // Use a unique class to identify our button to prevent re-adding
    if (bubble.querySelector('.tel-copy-button-k')) {
      return;
    }

    const copyButton = document.createElement("button");
    copyButton.className = "btn-icon tel-copy-button tel-copy-button-k";
    copyButton.innerHTML = `<span class="tgico button-icon">${COPY_ICON_K}</span>`;
    Object.assign(copyButton.style, {
      opacity: 0,
      transition: "opacity 0.2s ease-in-out", // Smoother transition
      pointerEvents: 'none', // Initially non-interactive
    });

    copyButton.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      tel_copy_text(textEl.innerText, copyButton);
    };

    const dateContainer = bubble.querySelector(".message-date, .time");
    if (dateContainer) {
      dateContainer.prepend(copyButton); // Prepend to appear before date/time

      bubble.addEventListener("mouseenter", () => {
        copyButton.style.opacity = "1";
        copyButton.style.pointerEvents = 'auto'; // Make interactive on hover
      });
      bubble.addEventListener("mouseleave", () => {
        copyButton.style.opacity = "0";
        copyButton.style.pointerEvents = 'none'; // Make non-interactive off hover
      });
    }
  };

  /**
   * Adds a "Copy Text" button to the Telegram context menu.
   * @param {HTMLElement} menuEl The context menu element.
   * @param {string} buttonClass The CSS class for the button.
   * @param {string} iconHtml The HTML for the button's icon.
   * @param {string} text The display text for the button.
   */
  const addContextMenuCopyButton = (menuEl, buttonClass, iconHtml, text) => {
    // Prevent adding multiple copy buttons to the same context menu instance
    if (menuEl.querySelector('.tel-context-copy-button')) {
      return;
    }

    const copyButton = document.createElement("button");
    copyButton.className = `${buttonClass} tel-context-copy-button`;
    copyButton.innerHTML = `${iconHtml}<span class="i18n btn-menu-item-text">${text}</span>`;
    copyButton.onclick = (e) => {
      e.stopPropagation();
      if (lastRightClickedMessageText) {
        tel_copy_text(lastRightClickedMessageText, copyButton.querySelector(".i18n"));
      } else {
        logger.info("No text captured for context menu copy.");
        // Optionally, provide feedback to user that no text was available
      }
      // Assuming context menu removes itself after click, no need to manually remove
      // menuEl.remove(); // This might interfere with Telegram's own menu closing
    };

    const itemsContainer = menuEl.querySelector(".btn-menu-items") || menuEl;
    // Insert at a consistent position, e.g., after "Reply" or "Forward"
    const replyItem = itemsContainer.querySelector('[data-menu-item-type="reply"], [data-menu-item-type="chat-reply"]');
    if (replyItem) {
      replyItem.after(copyButton);
    } else {
      itemsContainer.appendChild(copyButton);
    }
    // logger.info("Added context menu copy button.");
  };

  // --- Observation Loop for dynamically loaded content ---

  // App-Z (/a/, /z/) Specific Logic
  setInterval(() => {
    // Messages
    document
      .querySelectorAll(".message-list .message:not(._tel_processed_z)")
      .forEach((message) => {
        message.classList.add("_tel_processed_z"); // Mark as processed for Z app
        const textEl = message.querySelector(
          ".text-content, .translatable-message"
        );
        if (textEl && textEl.innerText.trim()) {
          setupCopyListeners(message, textEl);
          addHoverCopyButtonZ(message, textEl);
        }
      });

    // Context Menu
    // Use :not(._tel_processed_z_context) to avoid re-processing the same menu instance
    const contextMenuA = document.querySelector(
      ".ContextMenu:not(._tel_processed_z_context)"
    );
    if (contextMenuA && lastRightClickedMessageText !== null) { // Only add if text was captured
      contextMenuA.classList.add("_tel_processed_z_context");
      addContextMenuCopyButton(
        contextMenuA,
        "context-menu-item",
        '<i class="icon icon-copy"></i>',
        "Copy Text"
      );
    }
  }, REFRESH_DELAY);

  // App-K (/k/) Specific Logic
  setInterval(() => {
    // Messages
    document
      .querySelectorAll(".bubble:not(._tel_processed_k)")
      .forEach((bubble) => {
        bubble.classList.add("_tel_processed_k"); // Mark as processed for K app
        const textEl = bubble.querySelector(
          ".message-text, .message .text-content, .message .translatable-message" // Added .message-text for better coverage
        );
        if (textEl && textEl.innerText.trim()) {
          setupCopyListeners(bubble, textEl);
          addHoverCopyButtonK(bubble, textEl);
        }
      });

    // Context Menu
    // Use :not(._tel_processed_k_context) to avoid re-processing the same menu instance
    const contextMenuK = document.querySelector(
      "#bubble-contextmenu:not(._tel_processed_k_context)"
    );
    if (contextMenuK && lastRightClickedMessageText !== null) { // Only add if text was captured
      contextMenuK.classList.add("_tel_processed_k_context");
      addContextMenuCopyButton(
        contextMenuK,
        "btn-menu-item rp-overflow",
        `<span class="tgico btn-menu-item-icon">${COPY_ICON_K}</span>`,
        "Copy Text"
      );
    }
  }, REFRESH_DELAY);

  logger.info("Text Copier script loaded.");
})();