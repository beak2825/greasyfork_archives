// ==UserScript==
// @name         EZLinkZ
// @namespace    https://github.com/codeMonkeyHopeful/EZLinkZ
// @homepage     https://github.com/codeMonkeyHopeful/EZLinkZ
// @version      1.4
// @description  Copy hrefs from selected links with toast at top; toast clickable to show copied links; user can set keyboard shortcut via menu command
// @author       CodeMonkeyHopeful
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @supportURL   https://github.com/codeMonkeyHopeful/EZLinkZ
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540669/EZLinkZ.user.js
// @updateURL https://update.greasyfork.org/scripts/540669/EZLinkZ.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Default shortcut keys (Ctrl+Shift+C)
  let shortcut = {
    ctrlKey: true,
    shiftKey: true,
    altKey: false,
    metaKey: false,
    key: "c",
  };

  // Load saved shortcut from storage
  async function loadShortcut() {
    const saved = await GM_getValue("shortcut");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.key) shortcut = parsed;
      } catch {}
    }
  }

  // Save shortcut to storage
  async function saveShortcut(newShortcut) {
    await GM_setValue("shortcut", JSON.stringify(newShortcut));
    shortcut = newShortcut;
    showToast(`Shortcut updated to ${formatShortcut(newShortcut)}`);
  }

  function formatShortcut(sc) {
    let parts = [];
    if (sc.ctrlKey) parts.push("Ctrl");
    if (sc.shiftKey) parts.push("Shift");
    if (sc.altKey) parts.push("Alt");
    if (sc.metaKey) parts.push("Meta");
    parts.push(sc.key.toUpperCase());
    return parts.join("+");
  }

  // Prompt user to enter new shortcut (simple example, expects something like "Ctrl+Shift+X")
  async function promptShortcut() {
    const input = prompt(
      `Enter new shortcut keys separated by +\nExample: Ctrl+Shift+X\nCurrent: ${formatShortcut(
        shortcut
      )}`
    );
    if (!input) return;

    // Parse input
    const parts = input
      .toLowerCase()
      .split("+")
      .map((s) => s.trim());
    const newSc = {
      ctrlKey: parts.includes("ctrl"),
      shiftKey: parts.includes("shift"),
      altKey: parts.includes("alt"),
      metaKey: parts.includes("meta"),
      key:
        parts.find((k) => !["ctrl", "shift", "alt", "meta"].includes(k)) || "c",
    };

    await saveShortcut(newSc);
  }

  // Toast and popup elements
  const toast = document.createElement("div");
  const popup = document.createElement("div");
  const closeBtn = document.createElement("button");
  let popupVisible = false;

  // Style toast (top center)
  Object.assign(toast.style, {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(60,60,60,0.9)",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    fontSize: "14px",
    fontFamily: "sans-serif",
    zIndex: 9999,
    opacity: "0",
    transition: "opacity 0.3s ease",
    pointerEvents: "auto",
    cursor: "pointer",
    userSelect: "none",
    maxWidth: "80vw",
    boxSizing: "border-box",
  });
  document.body.appendChild(toast);

  // Style popup (hidden by default)
  Object.assign(popup.style, {
    position: "fixed",
    top: "60px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(30,30,30,0.95)",
    color: "#fff",
    padding: "15px 20px 20px 20px",
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: "monospace",
    zIndex: 10000,
    maxHeight: "300px",
    maxWidth: "90vw",
    overflowY: "auto",
    boxSizing: "border-box",
    display: "none",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  });
  document.body.appendChild(popup);

  // Close button inside popup
  closeBtn.textContent = "×";
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "5px",
    right: "10px",
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
    userSelect: "none",
  });
  popup.appendChild(closeBtn);

  // Show toast message for duration (ms)
  let toastTimeout;
  function showToast(message, duration = 2500) {
    if (popupVisible) return; // don't show toast if popup open
    toast.textContent = message;
    toast.style.opacity = "1";
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.style.opacity = "0";
    }, duration);
  }

  // Show popup with links text
  function showPopup(text) {
    popup.textContent = text;
    popup.appendChild(closeBtn);
    popup.style.display = "block";
    popupVisible = true;
    toast.style.opacity = "0";
  }

  // Hide popup
  function hidePopup() {
    popup.style.display = "none";
    popupVisible = false;
  }

  // Get links from selection
  function getSelectedLinks() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return null;
    }
    const range = selection.getRangeAt(0);
    const container = document.createElement("div");
    container.appendChild(range.cloneContents());

    const links = container.querySelectorAll("a");
    const hrefs = Array.from(links)
      .map((a) => a.href)
      .filter((href) => href);

    return hrefs.length > 0 ? hrefs : null;
  }

  // Copy selected links and handle UI
  function copySelectedLinks() {
    const hrefs = getSelectedLinks();
    if (!hrefs) {
      showToast("No links found in selection");
      return;
    }

    const textToCopy = hrefs.join("\n");
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        showToast(`Copied ${hrefs.length} link(s) to clipboard`);
        // When toast clicked, show popup with links
        toast.onclick = () => showPopup(textToCopy);
      })
      .catch(() => showToast("Failed to copy to clipboard"));
  }

  // Hide popup when clicking outside it
  document.addEventListener("click", (e) => {
    if (!popupVisible) return;
    if (popup.contains(e.target) || toast.contains(e.target)) return;
    hidePopup();
  });

  // Close button click
  closeBtn.addEventListener("click", () => {
    hidePopup();
  });

  // Keyboard shortcut listener
  document.addEventListener("keydown", (e) => {
    const keyMatches =
      e.key.toLowerCase() === shortcut.key.toLowerCase() &&
      e.ctrlKey === !!shortcut.ctrlKey &&
      e.shiftKey === !!shortcut.shiftKey &&
      e.altKey === !!shortcut.altKey &&
      e.metaKey === !!shortcut.metaKey;

    if (keyMatches) {
      e.preventDefault();
      copySelectedLinks();
    }
  });

  // Register Tampermonkey menu command to set shortcut
  GM_registerMenuCommand("Set Keyboard Shortcut", promptShortcut);

  // Load shortcut from storage on start
  loadShortcut();
})();
