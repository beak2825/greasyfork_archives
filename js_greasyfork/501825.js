// ==UserScript==
// @name         Auto Copy
// @namespace    http://tampermonkey.net/
// @author       Ethan
// @license      MIT
// @version      1.1
// @description  Automatically copy selected text to clipboard, maintain copy history in local storage, right-click in the input area to paste at the cursor.
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/501825/Auto%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/501825/Auto%20Copy.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const MAX_HISTORY = 100;
  const NOTIFICATION_DURATION = 2000;
  let lastSelection = "";
  let isSelecting = false;
  let historyDiv = null;
  let isHistoryOpen = false;
  let copyHistory = GM_getValue("copyHistory", []);
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255, 255, 255, 0.9);
    color: black;
    padding: 10px 20px;
    border-radius: 5px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    transition: top 0.3s ease-in-out;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(notification);

  const debounce = (func, delay) => {
    let inDebounce;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
  };

  function showNotification(text) {
    notification.textContent = `Copied: ${text.substring(0, 50)}${
      text.length > 50 ? "..." : ""
    }`;
    notification.style.top = "20px";
    setTimeout(() => {
      notification.style.top = "-50px";
    }, NOTIFICATION_DURATION);
  }

  document.addEventListener("mousedown", function () {
    isSelecting = true;
  });

  document.addEventListener(
    "mouseup",
    debounce(function () {
      if (isSelecting) {
        isSelecting = false;
        let selection = window.getSelection().toString().trim();
        if (selection && selection !== lastSelection) {
          lastSelection = selection;
          copyToClipboard(selection);
          addToHistory(selection);
        }
      }
    }, 100)
  );

  function copyToClipboard(text) {
    GM_setClipboard(text, "text");
    console.log("Copied to clipboard:", text);
    showNotification(text);
  }

  function addToHistory(text) {
    copyHistory = copyHistory.filter((item) => item !== text);
    copyHistory.unshift(text);
    if (copyHistory.length > MAX_HISTORY) {
      copyHistory.pop();
    }
    GM_setValue("copyHistory", copyHistory);
    updateHistoryDisplay();
  }

  function deleteFromHistory(index) {
    copyHistory.splice(index, 1);
    GM_setValue("copyHistory", copyHistory);
    updateHistoryDisplay();
  }

  function updateHistoryDisplay() {
    if (isHistoryOpen && historyDiv) {
      renderHistory();
    }
  }

  document.addEventListener("contextmenu", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      e.preventDefault();

      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().then((text) => {
          insertText(target, text, start, end);
        }).catch((err) => {
          console.error("Failed to read clipboard contents: ", err);
          fallbackPaste(target, start, end);
        });
      } else {
        fallbackPaste(target, start, end);
      }
    }
  });

  function insertText(target, text, start, end) {
    const currentValue = target.value;
    const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
    target.value = newValue;
    target.setSelectionRange(start + text.length, start + text.length);

    const inputEvent = new Event('input', { bubbles: true });
    target.dispatchEvent(inputEvent);

    const changeEvent = new Event('change', { bubbles: true });
    target.dispatchEvent(changeEvent);
  }

  function fallbackPaste(target, start, end) {
    const temp = document.createElement('textarea');
    temp.style.position = 'fixed';
    temp.style.opacity = '0';
    document.body.appendChild(temp);
    temp.focus();

    document.execCommand('paste');

    const pastedText = temp.value;
    insertText(target, pastedText, start, end);

    document.body.removeChild(temp);
  }

  function showPermissionGuide() {
    const guide = document.createElement("div");
    guide.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 12px;
      padding: 20px;
      z-index: 10000;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      max-width: 300px;
      width: calc(100% - 40px);
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(-20px);
      font-family: Arial, sans-serif;
    `;
    guide.innerHTML = `
      <h3 style="margin-top: 0; color: #333; font-size: 18px;">需要剪贴板访问权限</h3>
      <p style="color: #666; font-size: 14px; line-height: 1.5;">要使用右键粘贴功能，请允许网站访问剪贴板。</p>
      <p style="color: #666; font-size: 14px; line-height: 1.5;">您可以在地址栏左侧的锁图标中找到并更改此设置。</p>
      <button id="close-guide" style="
        background: #4CAF50;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s;
        margin-top: 10px;
      ">我知道了</button>
    `;
    document.body.appendChild(guide);

    setTimeout(() => {
      guide.style.opacity = "1";
      guide.style.transform = "translateY(0)";
    }, 10);

    const closeButton = document.getElementById("close-guide");
    closeButton.onmouseover = () => (closeButton.style.background = "#45a049");
    closeButton.onmouseout = () => (closeButton.style.background = "#4CAF50");
    closeButton.onclick = function () {
      guide.style.opacity = "0";
      guide.style.transform = "translateY(-20px)";
      setTimeout(() => document.body.removeChild(guide), 300);
    };

    function adjustGuidePosition() {
      if (window.innerWidth <= 600) {
        guide.style.right = "10px";
        guide.style.left = "10px";
        guide.style.width = "calc(100% - 40px)";
      } else {
        guide.style.right = "20px";
        guide.style.left = "auto";
        guide.style.width = "300px";
      }
    }

    window.addEventListener("resize", adjustGuidePosition);
    adjustGuidePosition();
  }

  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === "H") {
      e.preventDefault();
      toggleCopyHistory();
    }
  });

  GM_registerMenuCommand("Toggle Copy History", toggleCopyHistory);

  function toggleCopyHistory() {
    if (historyDiv) {
      closeCopyHistory();
    } else {
      showCopyHistory();
    }
  }

  function closeCopyHistory() {
    if (historyDiv && historyDiv.parentNode) {
      historyDiv.parentNode.removeChild(historyDiv);
      historyDiv = null;
      isHistoryOpen = false;
    }
  }

  function showCopyHistory() {
    isHistoryOpen = true;
    historyDiv = document.createElement("div");
    historyDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 10px;
      padding: 20px;
      z-index: 9999;
      width: 300px;
      max-height: 80vh;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      font-family: Arial, sans-serif;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    `;
    document.body.appendChild(historyDiv);

    const titleElement = document.createElement("h3");
    titleElement.textContent = "Copy History";
    titleElement.style.cssText = `
      margin-top: 0;
      margin-bottom: 15px;
    `;
    historyDiv.appendChild(titleElement);

    const scrollContainer = document.createElement("div");
    scrollContainer.style.cssText = `
      flex-grow: 1;
      overflow-y: auto;
      margin-right: -10px;
      padding-right: 10px;
    `;
    scrollContainer.id = "copyHistoryScrollContainer";
    historyDiv.appendChild(scrollContainer);

    renderHistory();

    function clearAllHistory() {
      copyHistory = [];
      GM_setValue("copyHistory", copyHistory);
      if (historyDiv) {
        renderHistory(); // Re-render the history if the history div is open
      }
      showNotification("Copy history cleared");
      closeCopyHistory();
    }

    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      width: 100%;
    `;
    historyDiv.appendChild(buttonContainer);

    const clearAllButton = document.createElement("button");
    clearAllButton.textContent = "Clear All";
    clearAllButton.style.cssText = `
      background: #ff4d4d;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s ease;
      font-size: 12px;
    `;
    clearAllButton.onmouseover = function () {
      this.style.background = "#ff3333";
    };
    clearAllButton.onmouseout = function () {
      this.style.background = "#ff4d4d";
    };
    clearAllButton.onclick = function () {
      if (confirm("Are you sure you want to clear all copy history?")) {
        clearAllHistory();
      }
    };
    buttonContainer.appendChild(clearAllButton);

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.cssText = `
      background: #f0f0f0;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s ease;
      font-size: 12px;
    `;
    closeButton.onmouseover = function () {
      this.style.background = "#e0e0e0";
    };
    closeButton.onmouseout = function () {
      this.style.background = "#f0f0f0";
    };
    closeButton.onclick = closeCopyHistory;
    buttonContainer.appendChild(closeButton);

    const style = document.createElement("style");
    style.textContent = `
      #copyHistoryScrollContainer::-webkit-scrollbar {
        width: 2px;
      }
      #copyHistoryScrollContainer::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.05);
      }
      #copyHistoryScrollContainer::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,0.2);
        border-radius: 1px;
      }
      #copyHistoryScrollContainer::-webkit-scrollbar-thumb:hover {
        background: rgba(0,0,0,0.3);
      }
    `;
    document.head.appendChild(style);

    scrollContainer.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        e.preventDefault();
        const index = parseInt(e.target.getAttribute("data-index"));
        const item = copyHistory[index];
        copyToClipboard(item);
      } else if (e.target.classList.contains("delete-btn")) {
        const index = parseInt(e.target.getAttribute("data-index"));
        deleteFromHistory(index);
        renderHistory();
      }
    });

    scrollContainer.addEventListener("mouseover", function (e) {
      if (e.target.tagName === "LI") {
        e.target.style.background = "rgba(220, 220, 220, 0.5)";
      }
    });

    scrollContainer.addEventListener("mouseout", function (e) {
      if (e.target.tagName === "LI") {
        e.target.style.background = "rgba(240, 240, 240, 0.5)";
      }
    });
  }

  function renderHistory() {
    if (!historyDiv) return;

    const scrollContainer = historyDiv.querySelector(
      "#copyHistoryScrollContainer"
    );
    if (!scrollContainer) return;

    scrollContainer.innerHTML =
      '<ul style="list-style-type: none; padding: 0; margin: 0;">';
    copyHistory.forEach((item, index) => {
      scrollContainer.innerHTML += `
        <li style="margin-bottom: 5px; position: relative; padding: 6px 8px; background: rgba(240, 240, 240, 0.5); border-radius: 4px; transition: all 0.2s ease; font-size: 13px;">
          <a href="#" data-index="${index}" style="text-decoration: none; color: black; display: block; padding-right: 20px;">
            ${escapeHTML(item.substring(0, 50))}${item.length > 50 ? "..." : ""}
          </a>
          <button class="delete-btn" data-index="${index}" style="position: absolute; top: 50%; right: 5px; transform: translateY(-50%); background: none; border: none; color: #999; font-size: 14px; cursor: pointer; padding: 2px; line-height: 1;">×</button>
        </li>`;
    });
    scrollContainer.innerHTML += "</ul>";
  }
  function escapeHTML(str) {
    return str.replace(
      /[&<>'"]/g,
      (tag) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        }[tag] || tag)
    );
  }
})();
