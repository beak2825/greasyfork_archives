// ==UserScript==
// @name         Telegram Text Copier
// @name:en      Telegram Text Copier
// @name:tr     Telegram Metin Kopyalama
// @name:zh-CN   Telegram 文字复制器
// @name:zh-TW   Telegram 文字複製器
// @name:ru      Telegram: Копирование текста
// @version      1.0
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
// @downloadURL https://update.greasyfork.org/scripts/541182/Telegram%20Text%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/541182/Telegram%20Text%20Copier.meta.js
// ==/UserScript==

(function () {
  const logger = {
    info: (message) => {
      console.log(`[Tel Copier] ${message}`);
    },
    error: (message) => {
      console.error(`[Tel Copier] ${message}`);
    },
  };

  const COPY_ICON_K = "\uE94D";
  const REFRESH_DELAY = 500;
  let lastRightClickedMessageText = null;

  const tel_copy_text = (text, button) => {
    navigator.clipboard.writeText(text).then(
      () => {
        logger.info("Text copied to clipboard");
        const originalText = button.textContent;
        button.textContent = "Copied!";
        setTimeout(() => {
          button.textContent = originalText;
        }, 1500);
      },
      (err) => logger.error("Failed to copy text: " + err)
    );
  };

  // --- Main Logic ---

  const setupCopyListeners = (messageEl, textEl) => {
    messageEl.addEventListener("contextmenu", () => {
      lastRightClickedMessageText = textEl ? textEl.innerText : null;
    });
  };

  const addHoverCopyButtonZ = (messageEl, textEl) => {
    const bubble = messageEl.querySelector(".bubble");
    if (!bubble) return;
    const copyButton = document.createElement("button");
    copyButton.className = "Button tiny secondary round tel-copy-button";
    copyButton.innerHTML = '<i class="icon icon-copy"></i>';
    Object.assign(copyButton.style, {
      position: "absolute",
      right: "5px",
      bottom: "5px",
      zIndex: 100,
      opacity: 0,
      transition: "opacity 0.2s",
    });
    copyButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      tel_copy_text(textEl.innerText, copyButton);
    };
    bubble.style.position = "relative";
    bubble.append(copyButton);
    bubble.addEventListener("mouseover", () => {
      copyButton.style.opacity = "1";
    });
    bubble.addEventListener("mouseout", () => {
      copyButton.style.opacity = "0";
    });
  };

  const addHoverCopyButtonK = (bubble, textEl) => {
    const copyButton = document.createElement("button");
    copyButton.className = "btn-icon tel-copy-button";
    copyButton.innerHTML = `<span class="tgico button-icon">${COPY_ICON_K}</span>`;
    Object.assign(copyButton.style, { opacity: 0, transition: "opacity 0.2s" });
    copyButton.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      tel_copy_text(textEl.innerText, copyButton);
    };
    const dateContainer = bubble.querySelector(".message-date, .time");
    if (dateContainer) {
      dateContainer.prepend(copyButton);
      bubble.addEventListener("mouseover", () => {
        copyButton.style.opacity = "1";
      });
      bubble.addEventListener("mouseout", () => {
        copyButton.style.opacity = "0";
      });
    }
  };

  const addContextMenuCopyButton = (menuEl, buttonClass, iconHtml, text) => {
    const copyButton = document.createElement("button");
    copyButton.className = buttonClass;
    copyButton.innerHTML = `${iconHtml}<span class="i18n btn-menu-item-text">${text}</span>`;
    copyButton.onclick = (e) => {
      e.stopPropagation();
      tel_copy_text(
        lastRightClickedMessageText,
        copyButton.querySelector(".i18n")
      );
      menuEl.remove();
    };
    const itemsContainer = menuEl.querySelector(".btn-menu-items") || menuEl;
    itemsContainer.appendChild(copyButton);
  };

  // App-Z (/a/) Specific Logic
  setInterval(() => {
    // Messages
    document
      .querySelectorAll(".message-list .message:not(._tel_processed)")
      .forEach((message) => {
        message.classList.add("_tel_processed");
        const textEl = message.querySelector(
          ".text-content, .translatable-message"
        );
        if (textEl && textEl.innerText.trim()) {
          setupCopyListeners(message, textEl);
          addHoverCopyButtonZ(message, textEl);
        }
      });

    // Context Menu
    const contextMenuA = document.querySelector(
      ".ContextMenu:not(._tel_processed)"
    );
    if (contextMenuA && lastRightClickedMessageText) {
      contextMenuA.classList.add("_tel_processed");
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
      .querySelectorAll(".bubble:not(._tel_processed)")
      .forEach((bubble) => {
        bubble.classList.add("_tel_processed");
        const textEl = bubble.querySelector(
          ".message .text-content, .message .translatable-message"
        );
        if (textEl && textEl.innerText.trim()) {
          setupCopyListeners(bubble, textEl);
          addHoverCopyButtonK(bubble, textEl);
        }
      });

    // Context Menu
    const contextMenuK = document.querySelector(
      "#bubble-contextmenu:not(._tel_processed)"
    );
    if (contextMenuK && lastRightClickedMessageText) {
      contextMenuK.classList.add("_tel_processed");
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
